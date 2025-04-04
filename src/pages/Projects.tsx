
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

interface ProjectCardProps {
  project: Project;
  onAddUpdate: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
  formatCurrency: (amount: number) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusBadgeColor: (status: string) => string;
}

const ProjectCard = ({ 
  project, 
  onAddUpdate, 
  onViewDetails, 
  onDelete,
  formatCurrency,
  getStatusIcon,
  getStatusBadgeColor 
}: ProjectCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl mr-2">{project.name}</CardTitle>
          <Badge className={cn("text-xs", getStatusBadgeColor(project.status))}>
            <span className="flex items-center">
              {getStatusIcon(project.status)}
              <span className="ml-1 capitalize">{project.status}</span>
            </span>
          </Badge>
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <div className="text-muted-foreground">Start Date</div>
            <div>{format(project.startDate, 'MMM d, yyyy')}</div>
          </div>
          <div>
            <div className="text-muted-foreground">End Date</div>
            <div>{project.endDate ? format(project.endDate, 'MMM d, yyyy') : 'Not set'}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Budget</div>
            <div>{formatCurrency(project.budget)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Spent</div>
            <div>{formatCurrency(project.spent)}</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-muted-foreground text-sm mb-1">Progress</div>
          <Progress value={project.completionPercentage} className="h-2" />
          <div className="text-xs text-right mt-1">{project.completionPercentage}%</div>
        </div>
        {project.teamMembers.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {project.teamMembers.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-7 w-7">
                <AvatarFallback className="text-xs">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            ))}
            {project.teamMembers.length > 3 && (
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">+{project.teamMembers.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" onClick={onAddUpdate}>
          Add Update
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onViewDetails}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

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

      {/* Stats cards */}
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

      {/* Projects tabs and filters */}
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

          {/* Tab content */}
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
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <FormLabel htmlFor="startDate">Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !projectForm.getValues("startDate") && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {projectForm.getValues("startDate") ? (
                            format(projectForm.getValues("startDate"), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={projectForm.getValues("startDate")}
                          onSelect={(date) => date && projectForm.setValue("startDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-1">
                    <FormLabel htmlFor="endDate">End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !projectForm.getValues("endDate") && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {projectForm.getValues("endDate") ? (
                            format(projectForm.getValues("endDate"), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={projectForm.getValues("endDate")}
                          onSelect={(date) => date && projectForm.setValue("endDate", date)}
                          disabled={(date) => isBefore(date, projectForm.getValues("startDate"))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-1">
                    <FormLabel htmlFor="budget">Budget</FormLabel>
                    <Input
                      id="budget"
                      type="number"
                      {...projectForm.register("budget", { required: true, min: 0 })}
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
                        {DEFAULT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                        {customCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Add Custom Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {projectForm.getValues("category") === "custom" && (
                    <div className="col-span-2">
                      <FormLabel htmlFor="customCategory">Custom Category Name</FormLabel>
                      <Input
                        id="customCategory"
                        {...projectForm.register("customCategory")}
                        placeholder="Enter custom category name"
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <FormLabel htmlFor="objectives">Objectives</FormLabel>
                    <Textarea
                      id="objectives"
                      {...projectForm.register("objectives")}
                      placeholder="Enter project objectives (one per line)"
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter one objective per line. Each line will be a separate objective.
                    </p>
                  </div>
                  <div className="col-span-2">
                    <FormLabel>Team Members</FormLabel>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {projectForm.getValues("teamMembers").map((member) => (
                        <Badge
                          key={member.id}
                          variant="secondary"
                          className="flex items-center gap-1 p-1 pl-2"
                        >
                          <span>
                            {member.name}
                            {member.role && ` (${member.role})`}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveTeamMember(member.id)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    {addingCustomMember ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Name"
                            value={customMemberName}
                            onChange={(e) => setCustomMemberName(e.target.value)}
                          />
                          <Input
                            placeholder="Role (optional)"
                            value={customMemberRole}
                            onChange={(e) => setCustomMemberRole(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddCustomMember}
                            disabled={!customMemberName.trim()}
                          >
                            Add
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAddingCustomMember(false);
                              setCustomMemberName('');
                              setCustomMemberRole('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Input
                          placeholder="Search members..."
                          value={memberSearchQuery}
                          onChange={(e) => setMemberSearchQuery(e.target.value)}
                        />
                        {memberSearchQuery && filteredMembers.length > 0 && (
                          <ScrollArea className="h-40 border rounded-md p-2">
                            {filteredMembers.map((member) => (
                              <Button
                                key={member.id}
                                type="button"
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => handleAddExistingMember(member)}
                              >
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarFallback className="text-xs">
                                      {member.firstName[0]}{member.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{member.firstName} {member.lastName}</span>
                                </div>
                              </Button>
                            ))}
                          </ScrollArea>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setAddingCustomMember(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Custom Member
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Project Update</DialogTitle>
            <DialogDescription>
              Enter the details of the project update.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={updateForm.handleSubmit(handleAddUpdate)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="description">Update Description</FormLabel>
                <Textarea
                  id="description"
                  {...updateForm.register("description", { required: true })}
                  placeholder="Describe the project update"
                />
              </div>
              <div className="grid gap-2">
                <FormLabel htmlFor="date">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !updateForm.getValues("date") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {updateForm.getValues("date") ? (
                        format(updateForm.getValues("date"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={updateForm.getValues("date")}
                      onSelect={(date) => date && updateForm.setValue("date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <FormLabel htmlFor="completionPercentage">Completion Percentage</FormLabel>
                  <span className="text-sm text-muted-foreground">{updateForm.getValues("completionPercentage")}%</span>
                </div>
                <Input
                  id="completionPercentage"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  {...updateForm.register("completionPercentage", { 
                    required: true,
                    valueAsNumber: true 
                  })}
                  className="cursor-pointer"
                  onChange={(e) => updateForm.setValue("completionPercentage", parseInt(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Project Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>{selectedProject.name}</DialogTitle>
                  <Badge className={cn("text-xs", getStatusBadgeColor(selectedProject.status))}>
                    <span className="flex items-center">
                      {getStatusIcon(selectedProject.status)}
                      <span className="ml-1 capitalize">{selectedProject.status}</span>
                    </span>
                  </Badge>
                </div>
                <DialogDescription>
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium">Start Date</h4>
                      <p>{format(selectedProject.startDate, 'PPP')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">End Date</h4>
                      <p>{selectedProject.endDate ? format(selectedProject.endDate, 'PPP') : 'Not set'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Budget</h4>
                      <p>{formatCurrency(selectedProject.budget)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Spent</h4>
                      <p>{formatCurrency(selectedProject.spent)}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium mb-1">Progress</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedProject.completionPercentage} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{selectedProject.completionPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Category</h4>
                    <Badge className={cn("text-xs", getCategoryBadgeColor(selectedProject.category))}>
                      {selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1)}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Timeline</h4>
                    <Badge className={cn("text-xs", getTimelineBadgeColor(selectedProject.timeline))}>
                      {selectedProject.timeline.charAt(0).toUpperCase() + selectedProject.timeline.slice(1)}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Objectives</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedProject.objectives.map((objective, index) => (
                        <li key={index} className="text-sm">{objective}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Team Members</h4>
                    {selectedProject.teamMembers.length > 0 ? (
                      <div className="space-y-2">
                        {selectedProject.teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No team members assigned</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Updates</h4>
                    {selectedProject.updates.length > 0 ? (
                      <div className="space-y-4">
                        {selectedProject.updates.map((update) => (
                          <Card key={update.id} className="relative">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base">
                                  {update.completionPercentage && (
                                    <span className="text-sm font-normal text-muted-foreground">
                                      Updated to {update.completionPercentage}% completion
                                    </span>
                                  )}
                                </CardTitle>
                                <span className="text-xs text-muted-foreground">
                                  {format(update.date, 'MMM d, yyyy')}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">{update.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No updates yet</p>
                    )}
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewDetailsOpen(false);
                  openUpdateDialog(selectedProject.id);
                }}>
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
              This action cannot be undone. This will permanently delete the project and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
