
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
import { format } from "date-fns";
import { CalendarIcon, Briefcase, Calendar as CalendarIcon2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from '@/lib/toast';

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
}

interface ProjectUpdate {
  id: string;
  projectId: string;
  date: Date;
  description: string;
  author: string;
}

const Projects = () => {
  const { members } = useAppContext();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
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
      completionPercentage: 45
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
      completionPercentage: 100
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
      completionPercentage: 10
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
        'Raise $75,000 for project expenses',
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
      completionPercentage: 20
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
      completionPercentage: 60
    }
  ]);

  // Form states
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: 'planned',
    startDate: new Date(),
    endDate: undefined as Date | undefined,
    budget: 0,
    category: 'building',
    objectives: '',
    teamMembers: [] as string[]
  });

  const [updateForm, setUpdateForm] = useState({
    description: '',
    date: new Date(),
    completionPercentage: 0
  });

  // Filter projects based on search query and status filter
  const filteredProjects = projects.filter(project => {
    // Filter by search query
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'current-year' && project.startDate.getFullYear() === new Date().getFullYear()) ||
      (activeTab === 'future' && project.startDate > new Date());
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleCreateProject = () => {
    const objectivesArray = projectForm.objectives
      .split('\n')
      .filter(objective => objective.trim() !== '');

    const newProject: Project = {
      id: `proj-${projects.length + 1}`,
      name: projectForm.name,
      description: projectForm.description,
      status: projectForm.status as 'planned' | 'in-progress' | 'completed' | 'on-hold',
      startDate: projectForm.startDate,
      endDate: projectForm.endDate,
      budget: projectForm.budget,
      spent: 0,
      category: projectForm.category as 'building' | 'outreach' | 'missions' | 'education' | 'other',
      objectives: objectivesArray,
      teamMembers: projectForm.teamMembers,
      updates: [],
      completionPercentage: 0
    };

    setProjects(prev => [...prev, newProject]);
    setIsProjectDialogOpen(false);
    resetProjectForm();
    toast.success('Project created successfully');
  };

  const handleAddUpdate = () => {
    if (!selectedProjectId) return;

    const newUpdate: ProjectUpdate = {
      id: `update-${selectedProjectId}-${Date.now()}`,
      projectId: selectedProjectId,
      date: updateForm.date,
      description: updateForm.description,
      author: 'user-1' // Using the current user ID
    };

    setProjects(prev => prev.map(project => {
      if (project.id === selectedProjectId) {
        return {
          ...project,
          updates: [...project.updates, newUpdate],
          completionPercentage: updateForm.completionPercentage
        };
      }
      return project;
    }));

    setIsUpdateDialogOpen(false);
    resetUpdateForm();
    toast.success('Project update added successfully');
  };

  const resetProjectForm = () => {
    setProjectForm({
      name: '',
      description: '',
      status: 'planned',
      startDate: new Date(),
      endDate: undefined,
      budget: 0,
      category: 'building',
      objectives: '',
      teamMembers: []
    });
  };

  const resetUpdateForm = () => {
    setUpdateForm({
      description: '',
      date: new Date(),
      completionPercentage: 0
    });
  };

  const openUpdateDialog = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectId(projectId);
      setUpdateForm(prev => ({
        ...prev,
        completionPercentage: project.completionPercentage
      }));
      setIsUpdateDialogOpen(true);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'planned':
        return "bg-blue-100 text-blue-800";
      case 'in-progress':
        return "bg-yellow-100 text-yellow-800";
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'on-hold':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'building':
        return "bg-purple-100 text-purple-800";
      case 'outreach':
        return "bg-pink-100 text-pink-800";
      case 'missions':
        return "bg-indigo-100 text-indigo-800";
      case 'education':
        return "bg-green-100 text-green-800";
      case 'other':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Projects</h1>
        <Button onClick={() => setIsProjectDialogOpen(true)}>Add New Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {projects.filter(p => p.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(projects.reduce((acc, curr) => acc + curr.budget, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Spent</CardTitle>
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
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="current-year">Current Year</TabsTrigger>
              <TabsTrigger value="future">Future Projects</TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <div className="w-64">
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge className={cn("ml-2", getStatusBadgeColor(project.status))}>
                          <span className="capitalize">{project.status}</span>
                        </Badge>
                        <Badge className={cn("ml-2", getCategoryBadgeColor(project.category))}>
                          <span className="capitalize">{project.category}</span>
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">{project.completionPercentage}%</span>
                        </div>
                        <Progress value={project.completionPercentage} className="h-2" />
                      </div>
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
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Team:</span>
                        <span className="text-sm">{project.teamMembers.length} members</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Updates:</span>
                        <span className="text-sm">{project.updates.length}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openUpdateDialog(project.id)}
                    >
                      Add Update
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="current-year" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge className={cn("ml-2", getStatusBadgeColor(project.status))}>
                          <span className="capitalize">{project.status}</span>
                        </Badge>
                        <Badge className={cn("ml-2", getCategoryBadgeColor(project.category))}>
                          <span className="capitalize">{project.category}</span>
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">{project.completionPercentage}%</span>
                        </div>
                        <Progress value={project.completionPercentage} className="h-2" />
                      </div>
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
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openUpdateDialog(project.id)}
                    >
                      Add Update
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="future" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge className={cn("ml-2", getStatusBadgeColor(project.status))}>
                          <span className="capitalize">{project.status}</span>
                        </Badge>
                        <Badge className={cn("ml-2", getCategoryBadgeColor(project.category))}>
                          <span className="capitalize">{project.category}</span>
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">{project.completionPercentage}%</span>
                        </div>
                        <Progress value={project.completionPercentage} className="h-2" />
                      </div>
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
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openUpdateDialog(project.id)}
                    >
                      Add Update
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Enter the details for the new church project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormLabel htmlFor="name">Project Name</FormLabel>
                <Input
                  id="name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div className="col-span-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter project description"
                />
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="status">Status</FormLabel>
                <Select 
                  value={projectForm.status} 
                  onValueChange={(value) => setProjectForm(prev => ({ ...prev, status: value as any }))}
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
                <FormLabel htmlFor="category">Category</FormLabel>
                <Select 
                  value={projectForm.category} 
                  onValueChange={(value) => setProjectForm(prev => ({ ...prev, category: value as any }))}
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
                <FormLabel htmlFor="startDate">Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !projectForm.startDate && "text-muted-foreground"
                        )}
                      >
                        {projectForm.startDate ? (
                          format(projectForm.startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={projectForm.startDate}
                      onSelect={(date) => date && setProjectForm(prev => ({ ...prev, startDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="endDate">End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !projectForm.endDate && "text-muted-foreground"
                        )}
                      >
                        {projectForm.endDate ? (
                          format(projectForm.endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={projectForm.endDate}
                      onSelect={(date) => setProjectForm(prev => ({ ...prev, endDate: date || undefined }))}
                      initialFocus
                      disabled={(date) => date < projectForm.startDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="budget">Budget</FormLabel>
                <Input
                  id="budget"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter budget amount"
                />
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="teamMembers">Team Members</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    if (!projectForm.teamMembers.includes(value)) {
                      setProjectForm(prev => ({ 
                        ...prev, 
                        teamMembers: [...prev.teamMembers, value] 
                      }));
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
                  {projectForm.teamMembers.map(memberId => {
                    const member = members.find(m => m.id === memberId);
                    return (
                      <Badge 
                        key={memberId}
                        className="flex items-center gap-1 px-2 py-1"
                        variant="outline"
                      >
                        {member ? `${member.firstName} ${member.lastName}` : memberId}
                        <button
                          className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                          onClick={() => setProjectForm(prev => ({
                            ...prev,
                            teamMembers: prev.teamMembers.filter(id => id !== memberId)
                          }))}
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
                  value={projectForm.objectives}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, objectives: e.target.value }))}
                  placeholder="Enter project objectives (one per line)"
                  rows={5}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
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
          <div className="grid gap-4 py-4">
            <div>
              <FormLabel htmlFor="updateDate">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !updateForm.date && "text-muted-foreground"
                      )}
                    >
                      {updateForm.date ? (
                        format(updateForm.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={updateForm.date}
                    onSelect={(date) => date && setUpdateForm(prev => ({ ...prev, date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <FormLabel htmlFor="description">Update Description</FormLabel>
              <Textarea
                id="description"
                value={updateForm.description}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the project update"
                rows={4}
              />
            </div>
            <div>
              <FormLabel htmlFor="completionPercentage">
                Completion Percentage: {updateForm.completionPercentage}%
              </FormLabel>
              <Input
                id="completionPercentage"
                type="range"
                min="0"
                max="100"
                value={updateForm.completionPercentage}
                onChange={(e) => setUpdateForm(prev => ({ 
                  ...prev, 
                  completionPercentage: parseInt(e.target.value) 
                }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUpdate}>Add Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
