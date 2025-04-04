
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Progress
} from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { 
  format, 
  isFuture, 
  isThisYear,
  isBefore,
  isPast,
  differenceInCalendarDays,
  addDays,
} from "date-fns";
import { 
  AlertCircle,
  CalendarIcon, 
  ChevronRight,
  Eye,
  PlusCircle, 
  Circle,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Plus,
  X,
  Trash2,
  FileCheck,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from '@/lib/toast';
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  startDate: Date;
  endDate?: Date;
  budget: number;
  spent: number;
  category: string;
  objectives: string[];
  teamMembers: TeamMember[];
  updates: ProjectUpdate[];
  completionPercentage: number;
  timeline: 'past' | 'current' | 'future';
  evidence?: ProjectEvidence[];
  lastUpdateDate?: Date;
  verified: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role?: string;
  isCustom?: boolean;
}

interface ProjectUpdate {
  id: string;
  projectId: string;
  date: Date;
  description: string;
  author: string;
  completionPercentage?: number;
}

interface ProjectEvidence {
  id: string;
  projectId: string;
  date: Date;
  title: string;
  description: string;
  fileUrl?: string;
  fileType?: string;
  verified: boolean;
}

interface ProjectFormValues {
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  startDate: Date;
  endDate?: Date;
  budget: number;
  category: string;
  customCategory?: string;
  objectives: string;
  teamMembers: TeamMember[];
  timeline: 'past' | 'current' | 'future';
}

interface UpdateFormValues {
  description: string;
  date: Date;
  completionPercentage: number;
}

interface EvidenceFormValues {
  title: string;
  description: string;
  date: Date;
  fileUrl?: string;
}

const DEFAULT_CATEGORIES = ['building', 'outreach', 'missions', 'education', 'other'];

// Project Card component
const ProjectCard = ({ 
  project, 
  onAddUpdate, 
  onViewDetails, 
  onDelete,
  onAddEvidence,
  formatCurrency, 
  getStatusIcon, 
  getStatusBadgeColor,
  getCategoryBadgeColor
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{project.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={cn("ml-2", getStatusBadgeColor(project.status))}>
              <span className="flex items-center">
                {getStatusIcon(project.status)}
                <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
              </span>
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Start Date:</span>
            <span className="text-sm">{format(project.startDate, 'PPP')}</span>
          </div>
          {project.endDate && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">End Date:</span>
              <span className="text-sm">{format(project.endDate, 'PPP')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium">Budget:</span>
            <span className="text-sm">{formatCurrency(project.budget)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Spent:</span>
            <span className="text-sm">{formatCurrency(project.spent)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Progress:</span>
              <span className="text-sm">{project.completionPercentage}%</span>
            </div>
            <Progress value={project.completionPercentage} />
          </div>
          <div className="flex justify-between items-center">
            <Badge className={cn("mt-1", getCategoryBadgeColor(project.category))}>
              {project.category}
            </Badge>
            {project.verified ? (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <FileCheck className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 flex items-center gap-1 border-amber-300">
                <AlertTriangle className="h-3 w-3" />
                Unverified
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={onAddUpdate}
        >
          Add Update
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={onAddEvidence}
        >
          Add Evidence
        </Button>
        <Button 
          variant="default" 
          size="sm"
          className="flex-1"
          onClick={onViewDetails}
        >
          <Eye className="h-4 w-4 mr-1" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const Projects = () => {
  const { members } = useAppContext();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [customMemberName, setCustomMemberName] = useState('');
  const [customMemberRole, setCustomMemberRole] = useState('');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [addingCustomMember, setAddingCustomMember] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Empty initial state for projects
  const [projects, setProjects] = useState<Project[]>([]);

  // Project form handling
  const projectForm = useForm<ProjectFormValues>({
    defaultValues: {
      name: '',
      description: '',
      status: 'planned',
      startDate: new Date(),
      endDate: undefined,
      budget: 0,
      category: '',
      customCategory: '',
      objectives: '',
      teamMembers: [],
      timeline: 'current'
    }
  });

  // Update form handling
  const updateForm = useForm<UpdateFormValues>({
    defaultValues: {
      description: '',
      date: new Date(),
      completionPercentage: 0
    }
  });
  
  // Evidence form handling
  const evidenceForm = useForm<EvidenceFormValues>({
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      fileUrl: ''
    }
  });

  // Check for projects that should be moved to past projects
  useEffect(() => {
    const checkForStaleProjects = () => {
      const now = new Date();
      const updatedProjects = projects.map(project => {
        // If project has an end date and it has passed more than 30 days ago
        // and there are no recent updates
        if (
          project.endDate && 
          differenceInCalendarDays(now, project.endDate) > 30 &&
          project.timeline !== 'past'
        ) {
          // Check if there have been any updates in the last 30 days
          const lastUpdate = project.updates.reduce((latest, update) => {
            return latest && latest > update.date ? latest : update.date;
          }, project.lastUpdateDate || null);
          
          // If no updates in 30 days or no updates at all
          if (!lastUpdate || differenceInCalendarDays(now, lastUpdate) > 30) {
            return { ...project, timeline: 'past' };
          }
        }
        return project;
      });
      
      // Update projects if any changes
      if (JSON.stringify(updatedProjects) !== JSON.stringify(projects)) {
        setProjects(updatedProjects);
        toast.info("Some projects have been moved to Past Projects due to inactivity");
      }
    };
    
    // Run check when projects change
    checkForStaleProjects();
    
    // Set up daily check
    const interval = setInterval(checkForStaleProjects, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [projects]);

  // Filter projects based on search query, status filter, and timeline filter
  const filteredProjects = projects.filter(project => {
    // Filter by search query
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    // Filter by timeline
    const matchesTimeline = timelineFilter === 'all' || project.timeline === timelineFilter;
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'current-year' && isThisYear(project.startDate)) ||
      (activeTab === 'future' && isFuture(project.startDate)) ||
      (activeTab === 'past' && project.timeline === 'past');
    
    return matchesSearch && matchesStatus && matchesTimeline && matchesTab;
  });

  // Filter members based on search query
  const filteredMembers = members.filter(member => 
    (member.firstName + ' ' + member.lastName)
      .toLowerCase()
      .includes(memberSearchQuery.toLowerCase())
  );

  const handleAddCustomMember = () => {
    if (customMemberName.trim()) {
      const newMember: TeamMember = {
        id: `custom-${Date.now()}`,
        name: customMemberName.trim(),
        role: customMemberRole.trim() || undefined,
        isCustom: true
      };

      const currentMembers = projectForm.getValues("teamMembers") || [];
      projectForm.setValue("teamMembers", [...currentMembers, newMember]);
      
      // Reset form
      setCustomMemberName('');
      setCustomMemberRole('');
      setAddingCustomMember(false);
      toast.success(`Added ${newMember.name} to the team`);
    }
  };

  const handleAddExistingMember = (member: any) => {
    const currentMembers = projectForm.getValues("teamMembers") || [];
    
    // Check if member is already added
    if (currentMembers.some(m => m.id === member.id)) {
      toast.info("This member is already in the team");
      return;
    }
    
    const newMember: TeamMember = {
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      role: member.role || undefined
    };
    
    projectForm.setValue("teamMembers", [...currentMembers, newMember]);
    setMemberSearchQuery('');
    toast.success(`Added ${newMember.name} to the team`);
  };

  const handleRemoveTeamMember = (memberId: string) => {
    const currentMembers = projectForm.getValues("teamMembers") || [];
    projectForm.setValue("teamMembers", currentMembers.filter(m => m.id !== memberId));
  };

  const handleCreateProject = (data: ProjectFormValues) => {
    const objectivesArray = data.objectives
      .split('\n')
      .filter(objective => objective.trim() !== '');

    // Handle custom category
    let category = data.category;
    if (data.category === 'custom' && data.customCategory) {
      category = data.customCategory.trim();
      
      // Add to custom categories if not already there
      if (!customCategories.includes(category)) {
        setCustomCategories([...customCategories, category]);
      }
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: data.name,
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      spent: 0,
      category: category,
      objectives: objectivesArray,
      teamMembers: data.teamMembers || [],
      updates: [],
      completionPercentage: 0,
      timeline: data.timeline,
      evidence: [],
      lastUpdateDate: new Date(),
      verified: false
    };

    setProjects(prev => [...prev, newProject]);
    setIsProjectDialogOpen(false);
    projectForm.reset();
    toast.success('Project created successfully');
  };

  const handleAddUpdate = (data: UpdateFormValues) => {
    if (!selectedProjectId) return;

    const newUpdate: ProjectUpdate = {
      id: `update-${selectedProjectId}-${Date.now()}`,
      projectId: selectedProjectId,
      date: data.date,
      description: data.description,
      author: 'current-user', // Using the current user ID
      completionPercentage: data.completionPercentage
    };

    setProjects(prev => prev.map(project => {
      if (project.id === selectedProjectId) {
        return {
          ...project,
          updates: [...project.updates, newUpdate],
          completionPercentage: data.completionPercentage,
          lastUpdateDate: new Date()
        };
      }
      return project;
    }));

    setIsUpdateDialogOpen(false);
    updateForm.reset();
    toast.success('Project update added successfully');
  };
  
  const handleAddEvidence = (data: EvidenceFormValues) => {
    if (!selectedProjectId) return;
    
    const newEvidence: ProjectEvidence = {
      id: `evidence-${selectedProjectId}-${Date.now()}`,
      projectId: selectedProjectId,
      date: data.date,
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl,
      fileType: data.fileUrl ? data.fileUrl.split('.').pop() : undefined,
      verified: false
    };
    
    setProjects(prev => prev.map(project => {
      if (project.id === selectedProjectId) {
        const updatedEvidence = [...(project.evidence || []), newEvidence];
        // If there's at least one piece of evidence, mark as verified
        return {
          ...project,
          evidence: updatedEvidence,
          verified: updatedEvidence.length > 0,
          lastUpdateDate: new Date()
        };
      }
      return project;
    }));
    
    setIsEvidenceDialogOpen(false);
    evidenceForm.reset();
    toast.success('Project evidence added successfully');
  };

  // Delete project handler
  const handleDeleteProject = () => {
    if (projectToDelete) {
      setProjects(prev => prev.filter(project => project.id !== projectToDelete));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      toast.success('Project deleted successfully');
    }
  };

  const openUpdateDialog = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectId(projectId);
      updateForm.setValue('completionPercentage', project.completionPercentage);
      setIsUpdateDialogOpen(true);
    }
  };
  
  const openEvidenceDialog = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsEvidenceDialogOpen(true);
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const openViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsViewDetailsOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'planned':
        return <Circle className="h-4 w-4 text-blue-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'on-hold':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'planned':
        return "bg-blue-100 text-blue-800 border-blue-300";
      case 'in-progress':
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 'completed':
        return "bg-green-100 text-green-800 border-green-300";
      case 'on-hold':
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'building':
        return "bg-purple-100 text-purple-800 border-purple-300";
      case 'outreach':
        return "bg-pink-100 text-pink-800 border-pink-300";
      case 'missions':
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case 'education':
        return "bg-green-100 text-green-800 border-green-300";
      case 'digital':
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case 'other':
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTimelineBadgeColor = (timeline: string) => {
    switch(timeline) {
      case 'past':
        return "bg-gray-100 text-gray-800 border-gray-300";
      case 'current':
        return "bg-blue-100 text-blue-800 border-blue-300";
      case 'future':
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-full lg:max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Church Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track all church projects in one place</p>
        </div>
        <Button onClick={() => setIsProjectDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {projects.filter(p => p.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(projects.reduce((acc, curr) => acc + curr.budget, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(projects.reduce((acc, curr) => acc + curr.spent, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="current-year">Current Year</TabsTrigger>
              <TabsTrigger value="future">Future Projects</TabsTrigger>
              <TabsTrigger value="past">Past Projects</TabsTrigger>
            </TabsList>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-48 lg:w-64"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timelineFilter} onValueChange={setTimelineFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Timelines</SelectItem>
                  <SelectItem value="past">Past Projects</SelectItem>
                  <SelectItem value="current">Current Projects</SelectItem>
                  <SelectItem value="future">Future Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onAddUpdate={() => openUpdateDialog(project.id)}
                    onAddEvidence={() => openEvidenceDialog(project.id)}
                    onViewDetails={() => openViewDetails(project)}
                    onDelete={() => openDeleteDialog(project.id)}
                    formatCurrency={formatCurrency}
                    getStatusIcon={getStatusIcon}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getCategoryBadgeColor={getCategoryBadgeColor}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filters or create a new project.</p>
                <Button className="mt-4" onClick={() => setIsProjectDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="current-year" className="mt-0">
            {/* ... same content structure as all tab but with different filtered projects */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onAddUpdate={() => openUpdateDialog(project.id)}
                    onAddEvidence={() => openEvidenceDialog(project.id)}
                    onViewDetails={() => openViewDetails(project)}
                    onDelete={() => openDeleteDialog(project.id)}
                    formatCurrency={formatCurrency}
                    getStatusIcon={getStatusIcon}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getCategoryBadgeColor={getCategoryBadgeColor}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No projects found for current year</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filters or create a new project.</p>
                <Button className="mt-4" onClick={() => setIsProjectDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="future" className="mt-0">
            {/* ... same content structure as all tab but with different filtered projects */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onAddUpdate={() => openUpdateDialog(project.id)}
                    onAddEvidence={() => openEvidenceDialog(project.id)}
                    onViewDetails={() => openViewDetails(project)}
                    onDelete={() => openDeleteDialog(project.id)}
                    formatCurrency={formatCurrency}
                    getStatusIcon={getStatusIcon}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getCategoryBadgeColor={getCategoryBadgeColor}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No future projects found</h3>
                <p className="text-muted-foreground mt-1">Start planning for the future by creating new projects.</p>
                <Button className="mt-4" onClick={() => setIsProjectDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-0">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onAddUpdate={() => openUpdateDialog(project.id)}
                    onAddEvidence={() => openEvidenceDialog(project.id)}
                    onViewDetails={() => openViewDetails(project)}
                    onDelete={() => openDeleteDialog(project.id)}
                    formatCurrency={formatCurrency}
                    getStatusIcon={getStatusIcon}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getCategoryBadgeColor={getCategoryBadgeColor}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No past projects found</h3>
                <p className="text-muted-foreground mt-1">Projects are automatically moved here when they've been inactive for 30+ days after their end date.</p>
                <Button className="mt-4" onClick={() => setIsProjectDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Enter the details for the new church project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={projectForm.handleSubmit(handleCreateProject)}>
            <div className="h-[calc(60vh-100px)] overflow-auto pr-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FormLabel htmlFor="name">Project Name</FormLabel>
                    <Input
                      id="name"
                      {...projectForm.register("name", { required: true })}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="col-span-2">
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea
                      id="description"
                      {...projectForm.register("description", { required: true })}
                      placeholder="Enter project description"
                    />
                  </div>
                  <div className="col-span-1">
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <Select 
                      defaultValue={projectForm.getValues("status")}
                      onValueChange={(value) => projectForm.setValue("status", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <FormLabel htmlFor="timeline">Timeline</FormLabel>
                    <Select 
                      defaultValue={projectForm.getValues("timeline")}
                      onValueChange={(value) => projectForm.setValue("timeline", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="past">Past Project</SelectItem>
                        <SelectItem value="current">Current Project</SelectItem>
                        <SelectItem value="future">Future Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <FormLabel htmlFor="startDate">Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {projectForm.getValues("startDate") ? (
                            format(projectForm.getValues("startDate"), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                        <Calendar
                          mode="single"
                          selected={projectForm.getValues("startDate")}
                          onSelect={(date) => projectForm.setValue("startDate", date as Date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-1">
                    <FormLabel htmlFor="endDate">End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {projectForm.getValues("endDate") ? (
                            format(projectForm.getValues("endDate"), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                        <Calendar
                          mode="single"
                          selected={projectForm.getValues("endDate")}
                          onSelect={(date) => projectForm.setValue("endDate", date || undefined)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-1">
                    <FormLabel htmlFor="budget">Budget (ZAR)</FormLabel>
                    <Input
                      id="budget"
                      type="number"
                      {...projectForm.register("budget", { 
                        required: true, 
                        valueAsNumber: true,
                        min: 0
                      })}
                      placeholder="Enter budget amount"
                    />
                  </div>
                  <div className="col-span-1">
                    <FormLabel htmlFor="category">Category</FormLabel>
                    <Select 
                      defaultValue={projectForm.getValues("category")}
                      onValueChange={(value) => projectForm.setValue("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEFAULT_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                        ))}
                        {customCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                        ))}
                        <SelectItem value="custom">Custom Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {projectForm.getValues("category") === 'custom' && (
                    <div className="col-span-1">
                      <FormLabel htmlFor="customCategory">Custom Category Name</FormLabel>
                      <Input
                        id="customCategory"
                        {...projectForm.register("customCategory")}
                        placeholder="Enter custom category"
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <FormLabel htmlFor="objectives">
                      Objectives (One per line)
                    </FormLabel>
                    <Textarea
                      id="objectives"
                      {...projectForm.register("objectives")}
                      placeholder="Enter objectives, one per line"
                      rows={4}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <FormLabel>Team Members</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAddingCustomMember(!addingCustomMember)}
                      >
                        {addingCustomMember ? (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Custom Member
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Add custom member form */}
                    {addingCustomMember && (
                      <div className="flex flex-col space-y-2 mb-4 p-3 border rounded-md">
                        <FormLabel htmlFor="customMemberName">Name</FormLabel>
                        <Input
                          id="customMemberName"
                          value={customMemberName}
                          onChange={(e) => setCustomMemberName(e.target.value)}
                          placeholder="Enter member name"
                        />
                        <FormLabel htmlFor="customMemberRole">Role (Optional)</FormLabel>
                        <Input
                          id="customMemberRole"
                          value={customMemberRole}
                          onChange={(e) => setCustomMemberRole(e.target.value)}
                          placeholder="Enter member role"
                        />
                        <Button 
                          type="button" 
                          size="sm" 
                          onClick={handleAddCustomMember}
                          disabled={!customMemberName.trim()}
                        >
                          Add to Team
                        </Button>
                      </div>
                    )}
                    
                    {/* Search existing members */}
                    <div className="mb-4">
                      <FormLabel htmlFor="memberSearch">Search Church Members</FormLabel>
                      <div className="relative">
                        <Input
                          id="memberSearch"
                          value={memberSearchQuery}
                          onChange={(e) => setMemberSearchQuery(e.target.value)}
                          placeholder="Search members..."
                          className="pr-8"
                        />
                        <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      {memberSearchQuery && filteredMembers.length > 0 && (
                        <div className="mt-1 border rounded-md max-h-40 overflow-y-auto">
                          {filteredMembers.map(member => (
                            <div 
                              key={member.id}
                              className="p-2 hover:bg-slate-100 cursor-pointer flex items-center"
                              onClick={() => handleAddExistingMember(member)}
                            >
                              <Avatar className="h-6 w-6 mr-2">
                                {member.profileImage ? (
                                  <AvatarImage src={member.profileImage} alt={`${member.firstName} ${member.lastName}`} />
                                ) : (
                                  <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                )}
                              </Avatar>
                              <span>{member.firstName} {member.lastName}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Display selected team members */}
                    <div className="space-y-2">
                      {projectForm.getValues("teamMembers")?.length > 0 ? (
                        <div className="space-y-1">
                          {projectForm.getValues("teamMembers").map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{member.name}</div>
                                  {member.role && <div className="text-xs text-muted-foreground">{member.role}</div>}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTeamMember(member.id)}
                                className="h-7 w-7 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                          No team members added yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Project Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Project Update</DialogTitle>
            <DialogDescription>
              Record a progress update for this project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={updateForm.handleSubmit(handleAddUpdate)}>
            <div className="grid gap-4 py-4">
              <div>
                <FormLabel htmlFor="date">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {updateForm.getValues("date") ? (
                        format(updateForm.getValues("date"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={updateForm.getValues("date")}
                      onSelect={(date) => updateForm.setValue("date", date as Date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <FormLabel htmlFor="description">Update Description</FormLabel>
                <Textarea
                  id="description"
                  {...updateForm.register("description", { required: true })}
                  placeholder="Describe the progress or update"
                  rows={4}
                />
              </div>
              <div>
                <FormLabel htmlFor="completionPercentage">
                  Completion Percentage: {updateForm.getValues("completionPercentage")}%
                </FormLabel>
                <Input
                  id="completionPercentage"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  {...updateForm.register("completionPercentage", { 
                    required: true, 
                    valueAsNumber: true,
                  })}
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Project Evidence Dialog */}
      <Dialog open={isEvidenceDialogOpen} onOpenChange={setIsEvidenceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Project Evidence</DialogTitle>
            <DialogDescription>
              Provide supporting evidence for this project to verify its authenticity.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={evidenceForm.handleSubmit(handleAddEvidence)}>
            <div className="grid gap-4 py-4">
              <div>
                <FormLabel htmlFor="title">Evidence Title</FormLabel>
                <Input
                  id="title"
                  {...evidenceForm.register("title", { required: true })}
                  placeholder="Enter a descriptive title for this evidence"
                />
              </div>
              <div>
                <FormLabel htmlFor="date">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {evidenceForm.getValues("date") ? (
                        format(evidenceForm.getValues("date"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={evidenceForm.getValues("date")}
                      onSelect={(date) => evidenceForm.setValue("date", date as Date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  {...evidenceForm.register("description", { required: true })}
                  placeholder="Describe this evidence and how it verifies the project"
                  rows={4}
                />
              </div>
              <div>
                <FormLabel htmlFor="fileUrl">Document/Image URL (Optional)</FormLabel>
                <Input
                  id="fileUrl"
                  {...evidenceForm.register("fileUrl")}
                  placeholder="Enter URL to supporting document or image"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  In a real application, you would upload files here. For now, you can paste a URL to an external resource.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEvidenceDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Evidence</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Project Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">{selectedProject.name}</DialogTitle>
                  <Badge className={cn(getStatusBadgeColor(selectedProject.status))}>
                    <span className="flex items-center">
                      {getStatusIcon(selectedProject.status)}
                      <span className="ml-1 capitalize">{selectedProject.status.replace('-', ' ')}</span>
                    </span>
                  </Badge>
                </div>
                <DialogDescription>
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="h-[calc(70vh-100px)] overflow-y-auto pr-3">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Start Date</h4>
                      <p>{format(selectedProject.startDate, 'PPP')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">End Date</h4>
                      <p>{selectedProject.endDate ? format(selectedProject.endDate, 'PPP') : 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Budget</h4>
                      <p>{formatCurrency(selectedProject.budget)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Spent</h4>
                      <p>{formatCurrency(selectedProject.spent)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Category</h4>
                      <Badge className={cn(getCategoryBadgeColor(selectedProject.category))}>
                        {selectedProject.category}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Timeline</h4>
                      <Badge className={cn(getTimelineBadgeColor(selectedProject.timeline))}>
                        {selectedProject.timeline}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium mb-1">Progress</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Current: {selectedProject.completionPercentage}%</span>
                          <span>Goal: 100%</span>
                        </div>
                        <Progress value={selectedProject.completionPercentage} />
                      </div>
                    </div>
                  </div>

                  {/* Objectives */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Objectives</h3>
                    {selectedProject.objectives.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedProject.objectives.map((objective, idx) => (
                          <li key={idx}>{objective}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No objectives defined for this project.</p>
                    )}
                  </div>

                  {/* Team Members */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Team Members</h3>
                    {selectedProject.teamMembers.length > 0 ? (
                      <div className="space-y-2">
                        {selectedProject.teamMembers.map(member => (
                          <div key={member.id} className="flex items-center border p-2 rounded-md">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              {member.role && <div className="text-sm text-muted-foreground">{member.role}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No team members assigned to this project.</p>
                    )}
                  </div>
                  
                  {/* Evidence */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Supporting Evidence</h3>
                    {selectedProject.evidence && selectedProject.evidence.length > 0 ? (
                      <div className="space-y-3">
                        {selectedProject.evidence.map(evidence => (
                          <div key={evidence.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{evidence.title}</h4>
                              <Badge 
                                variant={evidence.verified ? "default" : "outline"}
                                className={evidence.verified ? "bg-green-100 text-green-800 flex items-center gap-1" : "text-amber-600 flex items-center gap-1 border-amber-300"}
                              >
                                {evidence.verified ? 
                                  <><FileCheck className="h-3 w-3" /> Verified</> : 
                                  <><AlertTriangle className="h-3 w-3" /> Pending Verification</>
                                }
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Date: {format(evidence.date, 'PPP')}</p>
                            <p className="mt-1">{evidence.description}</p>
                            {evidence.fileUrl && (
                              <a 
                                href={evidence.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block mt-2 text-sm text-blue-600 hover:underline"
                              >
                                View Document/Image
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 border border-dashed rounded-md">
                        <p className="text-muted-foreground">No supporting evidence has been added yet.</p>
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => {
                            setSelectedProjectId(selectedProject.id);
                            setIsViewDetailsOpen(false);
                            setIsEvidenceDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Evidence
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Updates */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Project Updates</h3>
                    {selectedProject.updates.length > 0 ? (
                      <div className="space-y-4">
                        {selectedProject.updates
                          .sort((a, b) => b.date.getTime() - a.date.getTime())
                          .map(update => (
                            <div key={update.id} className="border-l-4 border-blue-500 pl-3 py-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-muted-foreground">{format(update.date, 'PPP')}</p>
                                  <p className="mt-1">{update.description}</p>
                                </div>
                                {update.completionPercentage !== undefined && (
                                  <Badge variant="outline" className="ml-2">
                                    {update.completionPercentage}% complete
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No updates recorded for this project yet.</p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
                <Button 
                  onClick={() => {
                    setSelectedProjectId(selectedProject.id);
                    setIsViewDetailsOpen(false);
                    setIsUpdateDialogOpen(true);
                  }}
                >
                  Add Update
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this project and all associated records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
