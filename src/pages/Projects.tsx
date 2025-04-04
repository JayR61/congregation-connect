import { useState } from 'react';
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
  differenceInCalendarDays
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
  Trash2
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

const DEFAULT_CATEGORIES = ['building', 'outreach', 'missions', 'education', 'other'];

const Projects = () => {
  const { members } = useAppContext();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [customMemberName, setCustomMemberName] = useState('');
  const [customMemberRole, setCustomMemberRole] = useState('');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [addingCustomMember, setAddingCustomMember] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  
  // New state for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Temporary state for projects
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-1',
      name: 'Church Building Renovation',
      description: 'Complete renovation of the main sanctuary, including new flooring, lighting, and sound system.',
      status: 'in-progress',
      startDate: new Date(2023, 0, 15),
      endDate: new Date(2023, 11, 31),
      budget: 500000,
      spent: 250000,
      category: 'building',
      objectives: [
        'Replace flooring throughout the building',
        'Update sound and lighting systems',
        'Renovate restrooms',
        'Repaint interior and exterior'
      ],
      teamMembers: [
        { id: 'member-1', name: 'John Smith', role: 'Project Manager' },
        { id: 'member-3', name: 'Sarah Johnson', role: 'Coordinator' }
      ],
      updates: [
        {
          id: 'update-1-1',
          projectId: 'proj-1',
          date: new Date(2023, 2, 10),
          description: 'Flooring has been completed in the main sanctuary.',
          author: 'member-1',
          completionPercentage: 25
        },
        {
          id: 'update-1-2',
          projectId: 'proj-1',
          date: new Date(2023, 4, 15),
          description: 'Sound system installation is 50% complete.',
          author: 'member-3',
          completionPercentage: 45
        }
      ],
      completionPercentage: 45,
      timeline: 'current'
    },
    {
      id: 'proj-2',
      name: 'Community Food Bank',
      description: 'Annual project to collect and distribute food to needy families in our community.',
      status: 'completed',
      startDate: new Date(2023, 5, 1),
      endDate: new Date(2023, 8, 30),
      budget: 10000,
      spent: 9500,
      category: 'outreach',
      objectives: [
        'Collect 5000 pounds of non-perishable food',
        'Serve 200 families',
        'Recruit 30 volunteers'
      ],
      teamMembers: [
        { id: 'member-2', name: 'Emily Taylor', role: 'Outreach Director' },
        { id: 'member-4', name: 'Michael Brown', role: 'Volunteer Coordinator' }
      ],
      updates: [
        {
          id: 'update-2-1',
          projectId: 'proj-2',
          date: new Date(2023, 6, 15),
          description: 'Collected 3000 pounds of food so far.',
          author: 'member-2',
          completionPercentage: 50
        },
        {
          id: 'update-2-2',
          projectId: 'proj-2',
          date: new Date(2023, 7, 30),
          description: 'Successfully distributed food to 175 families.',
          author: 'member-4',
          completionPercentage: 85
        },
        {
          id: 'update-2-3',
          projectId: 'proj-2',
          date: new Date(2023, 8, 28),
          description: 'Project completed successfully. Total of 5500 pounds collected and 210 families served.',
          author: 'member-2',
          completionPercentage: 100
        }
      ],
      completionPercentage: 100,
      timeline: 'past'
    },
    {
      id: 'proj-3',
      name: 'Youth Camp 2024',
      description: 'Planning for next year\'s youth summer camp.',
      status: 'planned',
      startDate: new Date(2024, 5, 15),
      endDate: new Date(2024, 5, 22),
      budget: 25000,
      spent: 0,
      category: 'education',
      objectives: [
        'Secure location and accommodations',
        'Develop curriculum and activities',
        'Recruit at least 10 chaperones',
        'Register at least 100 youth participants'
      ],
      teamMembers: [
        { id: 'member-3', name: 'Sarah Johnson', role: 'Youth Pastor' }
      ],
      updates: [
        {
          id: 'update-3-1',
          projectId: 'proj-3',
          date: new Date(2023, 9, 5),
          description: 'Initial planning meeting completed. Location options identified.',
          author: 'member-3',
          completionPercentage: 10
        }
      ],
      completionPercentage: 10,
      timeline: 'future'
    },
    {
      id: 'proj-4',
      name: 'Mission Trip to Ghana',
      description: 'Two-week mission trip to build a school and provide medical services.',
      status: 'on-hold',
      startDate: new Date(2023, 8, 1),
      endDate: new Date(2023, 8, 15),
      budget: 75000,
      spent: 15000,
      category: 'missions',
      objectives: [
        'Raise R75,000 for project expenses',
        'Recruit 20 volunteers with specific skills',
        'Complete school building construction',
        'Provide medical services to at least 500 people'
      ],
      teamMembers: [
        { id: 'member-1', name: 'John Smith', role: 'Missions Director' },
        { id: 'custom-1', name: 'Dr. Rebecca White', role: 'Medical Team Leader', isCustom: true }
      ],
      updates: [
        {
          id: 'update-4-1',
          projectId: 'proj-4',
          date: new Date(2023, 5, 10),
          description: 'Trip planning initiated. Currently on hold due to travel restrictions.',
          author: 'member-1',
          completionPercentage: 20
        }
      ],
      completionPercentage: 20,
      timeline: 'current'
    },
    {
      id: 'proj-5',
      name: 'Digital Ministry Expansion',
      description: 'Expanding our online presence with improved website, app, and social media strategy.',
      status: 'in-progress',
      startDate: new Date(2023, 3, 1),
      endDate: new Date(2023, 11, 31),
      budget: 30000,
      spent: 12000,
      category: 'digital',
      objectives: [
        'Redesign church website',
        'Develop mobile app',
        'Establish social media team',
        'Create content creation strategy',
        'Improve online giving platform'
      ],
      teamMembers: [
        { id: 'member-2', name: 'Emily Taylor', role: 'Communications Director' },
        { id: 'custom-2', name: 'James Wilson', role: 'Web Developer', isCustom: true }
      ],
      updates: [
        {
          id: 'update-5-1',
          projectId: 'proj-5',
          date: new Date(2023, 5, 15),
          description: 'Website redesign complete. App development in progress.',
          author: 'custom-2',
          completionPercentage: 40
        },
        {
          id: 'update-5-2',
          projectId: 'proj-5',
          date: new Date(2023, 7, 1),
          description: 'Social media team established with 5 volunteers.',
          author: 'member-2',
          completionPercentage: 60
        }
      ],
      completionPercentage: 60,
      timeline: 'current'
    }
  ]);

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
      (activeTab === 'future' && isFuture(project.startDate));
    
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
      timeline: data.timeline
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
          completionPercentage: data.completionPercentage
        };
      }
      return project;
    }));

    setIsUpdateDialogOpen(false);
    updateForm.reset();
    toast.success('Project update added successfully');
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
                    onViewDetails={() => openViewDetails(project)}
                    onDelete={() => openDeleteDialog(project.id)}
                    formatCurrency={formatCurrency}
                    getStatusIcon={getStatusIcon}
                    getStatusBadgeColor={getStatusBadgeColor}
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
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onAddUpdate={() => openUpdateDialog(project.id)}
                    onViewDetails={() => openViewDetails(project)}
                    onDelete={() => openDeleteDialog(project.id)}
                    formatCurrency={formatCurrency}
                    getStatusIcon={getStatusIcon}
                    getStatusBadgeColor={getStatusBadgeColor}
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
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onAddUpdate={() => openUpdateDialog(project.id)}
                    onViewDetails={() => openViewDetails(project)}
                    onDelete={() => openDeleteDialog(project.id)}
                    formatCurrency={formatCurrency}
                    getStatusIcon={getStatusIcon}
                    getStatusBadgeColor={getStatusBadgeColor}
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
        </Tabs>
      </div>

      {/* Add Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Enter the details for the new church project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={projectForm.handleSubmit(handleCreateProject)}>
            <ScrollArea className="pr-4 max-h-[60vh]">
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
                    </
