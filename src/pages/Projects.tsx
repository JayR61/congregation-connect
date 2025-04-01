
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
  CalendarIcon, 
  ChevronRight,
  Eye,
  PlusCircle, 
  Circle,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from '@/lib/toast';
import { useForm } from "react-hook-form";

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  startDate: Date;
  endDate?: Date;
  budget: number;
  spent: number;
  category: 'building' | 'outreach' | 'missions' | 'education' | 'other';
  objectives: string[];
  teamMembers: string[];
  updates: ProjectUpdate[];
  completionPercentage: number;
  timeline: 'past' | 'current' | 'future';
}

interface ProjectUpdate {
  id: string;
  projectId: string;
  date: Date;
  description: string;
  author: string;
}

interface ProjectFormValues {
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  startDate: Date;
  endDate?: Date;
  budget: number;
  category: 'building' | 'outreach' | 'missions' | 'education' | 'other';
  objectives: string;
  teamMembers: string[];
  timeline: 'past' | 'current' | 'future';
}

interface UpdateFormValues {
  description: string;
  date: Date;
  completionPercentage: number;
}

const getTimelineFromDates = (startDate: Date, endDate?: Date): 'past' | 'current' | 'future' => {
  if (isFuture(startDate)) return 'future';
  if (endDate && isPast(endDate)) return 'past';
  return 'current';
};

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
      teamMembers: ['member-1', 'member-3'],
      updates: [
        {
          id: 'update-1-1',
          projectId: 'proj-1',
          date: new Date(2023, 2, 10),
          description: 'Flooring has been completed in the main sanctuary.',
          author: 'member-1'
        },
        {
          id: 'update-1-2',
          projectId: 'proj-1',
          date: new Date(2023, 4, 15),
          description: 'Sound system installation is 50% complete.',
          author: 'member-3'
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
      teamMembers: ['member-2', 'member-4', 'member-5'],
      updates: [
        {
          id: 'update-2-1',
          projectId: 'proj-2',
          date: new Date(2023, 6, 15),
          description: 'Collected 3000 pounds of food so far.',
          author: 'member-2'
        },
        {
          id: 'update-2-2',
          projectId: 'proj-2',
          date: new Date(2023, 7, 30),
          description: 'Successfully distributed food to 175 families.',
          author: 'member-4'
        },
        {
          id: 'update-2-3',
          projectId: 'proj-2',
          date: new Date(2023, 8, 28),
          description: 'Project completed successfully. Total of 5500 pounds collected and 210 families served.',
          author: 'member-2'
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
      teamMembers: ['member-3'],
      updates: [
        {
          id: 'update-3-1',
          projectId: 'proj-3',
          date: new Date(2023, 9, 5),
          description: 'Initial planning meeting completed. Location options identified.',
          author: 'member-3'
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
      teamMembers: ['member-1', 'member-5'],
      updates: [
        {
          id: 'update-4-1',
          projectId: 'proj-4',
          date: new Date(2023, 5, 10),
          description: 'Trip planning initiated. Currently on hold due to travel restrictions.',
          author: 'member-1'
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
      category: 'other',
      objectives: [
        'Redesign church website',
        'Develop mobile app',
        'Establish social media team',
        'Create content creation strategy',
        'Improve online giving platform'
      ],
      teamMembers: ['member-2', 'member-4'],
      updates: [
        {
          id: 'update-5-1',
          projectId: 'proj-5',
          date: new Date(2023, 5, 15),
          description: 'Website redesign complete. App development in progress.',
          author: 'member-2'
        },
        {
          id: 'update-5-2',
          projectId: 'proj-5',
          date: new Date(2023, 7, 1),
          description: 'Social media team established with 5 volunteers.',
          author: 'member-4'
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
      category: 'building',
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

  const handleCreateProject = (data: ProjectFormValues) => {
    const objectivesArray = data.objectives
      .split('\n')
      .filter(objective => objective.trim() !== '');

    const timeline = data.timeline;

    const newProject: Project = {
      id: `proj-${projects.length + 1}`,
      name: data.name,
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      spent: 0,
      category: data.category,
      objectives: objectivesArray,
      teamMembers: data.teamMembers,
      updates: [],
      completionPercentage: 0,
      timeline: timeline
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
      author: 'current-user' // Using the current user ID
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

  const openUpdateDialog = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectId(projectId);
      updateForm.setValue('completionPercentage', project.completionPercentage);
      setIsUpdateDialogOpen(true);
    }
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
        return <Circle className="text-blue-500" />;
      case 'in-progress':
        return <Clock className="text-yellow-500" />;
      case 'completed':
        return <CheckCircle2 className="text-green-500" />;
      case 'on-hold':
        return <XCircle className="text-gray-500" />;
      default:
        return <Circle className="text-gray-500" />;
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
    <div className="container mx-auto py-6 max-w-7xl px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Projects</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onAddUpdate={() => openUpdateDialog(project.id)}
                  onViewDetails={() => openViewDetails(project)}
                  formatCurrency={formatCurrency}
                  getStatusIcon={getStatusIcon}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="current-year" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onAddUpdate={() => openUpdateDialog(project.id)}
                  onViewDetails={() => openViewDetails(project)}
                  formatCurrency={formatCurrency}
                  getStatusIcon={getStatusIcon}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="future" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onAddUpdate={() => openUpdateDialog(project.id)}
                  onViewDetails={() => openViewDetails(project)}
                  formatCurrency={formatCurrency}
                  getStatusIcon={getStatusIcon}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Enter the details for the new church project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={projectForm.handleSubmit(handleCreateProject)}>
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
                  <FormLabel htmlFor="category">Category</FormLabel>
                  <Select 
                    defaultValue={projectForm.getValues("category")}
                    onValueChange={(value) => projectForm.setValue("category", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="outreach">Outreach</SelectItem>
                      <SelectItem value="missions">Missions</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <FormLabel htmlFor="budget">Budget (ZAR)</FormLabel>
                  <Input
                    id="budget"
                    type="number"
                    {...projectForm.register("budget", { required: true, min: 0, valueAsNumber: true })}
                    placeholder="Enter budget amount"
                  />
                </div>
                <div className="col-span-1">
                  <FormLabel htmlFor="startDate">Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !projectForm.getValues("startDate") && "text-muted-foreground"
                        )}
                      >
                        {projectForm.getValues("startDate") ? (
                          format(projectForm.getValues("startDate"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
                  <FormLabel htmlFor="endDate">End Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !projectForm.getValues("endDate") && "text-muted-foreground"
                        )}
                      >
                        {projectForm.getValues("endDate") ? (
                          format(projectForm.getValues("endDate"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={projectForm.getValues("endDate")}
                        onSelect={(date) => projectForm.setValue("endDate", date || undefined)}
                        initialFocus
                        disabled={(date) => date < projectForm.getValues("startDate")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="col-span-2">
                  <FormLabel htmlFor="teamMembers">Team Members</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      if (!projectForm.getValues("teamMembers").includes(value)) {
                        projectForm.setValue("teamMembers", [...projectForm.getValues("teamMembers"), value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {projectForm.getValues("teamMembers").map(memberId => {
                      const member = members.find(m => m.id === memberId);
                      return (
                        <Badge 
                          key={memberId}
                          className="flex items-center gap-1 px-2 py-1"
                          variant="outline"
                        >
                          {member ? `${member.firstName} ${member.lastName}` : memberId}
                          <button
                            type="button"
                            className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                            onClick={() => projectForm.setValue("teamMembers", 
                              projectForm.getValues("teamMembers").filter(id => id !== memberId)
                            )}
                          >
                            ✕
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="col-span-2">
                  <FormLabel htmlFor="objectives">Objectives (one per line)</FormLabel>
                  <Textarea
                    id="objectives"
                    {...projectForm.register("objectives")}
                    placeholder="Enter project objectives (one per line)"
                    rows={5}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)}>Cancel</Button>
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
              Record an update for the selected project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={updateForm.handleSubmit(handleAddUpdate)}>
            <div className="grid gap-4 py-4">
              <div>
                <FormLabel htmlFor="date">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !updateForm.getValues("date") && "text-muted-foreground"
                      )}
                    >
                      {updateForm.getValues("date") ? (
                        format(updateForm.getValues("date"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={updateForm.getValues("date")}
                      onSelect={(date) => date && updateForm.setValue("date", date)}
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
                  placeholder="Describe the project update"
                  rows={4}
                />
              </div>
              <div>
                <FormLabel htmlFor="completionPercentage">
                  Completion Percentage: {updateForm.watch("completionPercentage")}%
                </FormLabel>
                <Input
                  id="completionPercentage"
                  type="range"
                  min="0"
                  max="100"
                  {...updateForm.register("completionPercentage", { valueAsNumber: true })}
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

      {/* View Project Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.name}</DialogTitle>
                <DialogDescription>
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={cn(getStatusBadgeColor(selectedProject.status))}>
                    {getStatusIcon(selectedProject.status)}
                    <span className="ml-1 capitalize">{selectedProject.status}</span>
                  </Badge>
                  <Badge className={cn(getCategoryBadgeColor(selectedProject.category))}>
                    <span className="capitalize">{selectedProject.category}</span>
                  </Badge>
                  <Badge className={cn(getTimelineBadgeColor(selectedProject.timeline))}>
                    <span className="capitalize">{selectedProject.timeline} project</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Progress</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={selectedProject.completionPercentage} className="h-2 flex-1" />
                      <span className="text-sm font-medium w-10 text-right">{selectedProject.completionPercentage}%</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Budget</h3>
                    <p className="text-sm mt-1">{formatCurrency(selectedProject.budget)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Spent</h3>
                    <p className="text-sm mt-1">{formatCurrency(selectedProject.spent)} 
                      <span className="text-muted-foreground ml-1">
                        ({Math.round((selectedProject.spent / selectedProject.budget) * 100)}%)
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Remaining</h3>
                    <p className="text-sm mt-1">{formatCurrency(selectedProject.budget - selectedProject.spent)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Start Date</h3>
                    <p className="text-sm mt-1">{format(selectedProject.startDate, 'PPP')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">End Date</h3>
                    <p className="text-sm mt-1">{selectedProject.endDate ? format(selectedProject.endDate, 'PPP') : 'Not set'}</p>
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-2">Team Members ({selectedProject.teamMembers.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.teamMembers.map(memberId => {
                      const member = members.find(m => m.id === memberId);
                      return (
                        <Badge key={memberId} variant="outline">
                          {member ? `${member.firstName} ${member.lastName}` : memberId}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-2">Objectives</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedProject.objectives.map((objective, index) => (
                      <li key={index} className="text-sm">{objective}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-2">Updates ({selectedProject.updates.length})</h3>
                  {selectedProject.updates.length > 0 ? (
                    <div className="space-y-4">
                      {selectedProject.updates.map(update => {
                        const updateAuthor = members.find(m => m.id === update.author);
                        return (
                          <div key={update.id} className="border rounded p-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{format(update.date, 'PPP')}</span>
                              <span className="text-xs text-muted-foreground">
                                By {updateAuthor ? `${updateAuthor.firstName} ${updateAuthor.lastName}` : update.author}
                              </span>
                            </div>
                            <p className="text-sm">{update.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No updates recorded yet.</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => openUpdateDialog(selectedProject.id)}>Add Update</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Separate component for project cards
const ProjectCard = ({ 
  project, 
  onAddUpdate, 
  onViewDetails,
  formatCurrency,
  getStatusIcon,
  getStatusBadgeColor
}: { 
  project: Project; 
  onAddUpdate: () => void;
  onViewDetails: () => void;
  formatCurrency: (amount: number) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusBadgeColor: (status: string) => string;
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1 mr-auto">{project.name}</CardTitle>
          <Badge className={cn("shrink-0", getStatusBadgeColor(project.status))}>
            {getStatusIcon(project.status)}
            <span className="ml-1 capitalize">{project.status}</span>
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3 flex-1">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{project.completionPercentage}%</span>
            </div>
            <Progress value={project.completionPercentage} className="h-2" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Start Date:</span>
            <span className="text-sm">{format(project.startDate, 'PP')}</span>
          </div>
          {project.endDate && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">End Date:</span>
              <span className="text-sm">{format(project.endDate, 'PP')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium">Budget:</span>
            <span className="text-sm">{formatCurrency(project.budget)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 gap-3 flex">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onAddUpdate}
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Update
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={onViewDetails}
          size="sm"
        >
          <Eye className="h-4 w-4 mr-1" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Projects;
