
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, Users, Check, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from '@/lib/toast';
import { useForm } from "react-hook-form";

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  team: string[];
  category: string;
  budget?: number;
  priority: 'low' | 'medium' | 'high';
}

const Projects = () => {
  const { members } = useAppContext();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToComplete, setProjectToComplete] = useState<string | null>(null);
  
  // Custom team member input state
  const [newTeamMember, setNewTeamMember] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: undefined as Date | undefined,
      budget: undefined as number | undefined,
      priority: 'medium' as 'low' | 'medium' | 'high',
      category: ''
    }
  });
  
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-1',
      name: 'Church Renovation',
      description: 'Renovating the main sanctuary and updating facilities',
      status: 'in-progress',
      startDate: new Date(2023, 2, 15),
      endDate: new Date(2023, 8, 30),
      team: ['member-1', 'member-2'],
      category: 'Facilities',
      budget: 50000,
      priority: 'high'
    },
    {
      id: 'proj-2',
      name: 'Youth Camp',
      description: 'Annual summer youth retreat',
      status: 'planning',
      startDate: new Date(2023, 5, 1),
      endDate: new Date(2023, 5, 15),
      team: ['member-3'],
      category: 'Youth Ministry',
      budget: 8000,
      priority: 'medium'
    },
    {
      id: 'proj-3',
      name: 'Christmas Concert',
      description: 'Annual Christmas concert and community outreach',
      status: 'planning',
      startDate: new Date(2023, 10, 1),
      endDate: new Date(2023, 11, 24),
      team: ['member-1', 'member-4'],
      category: 'Music Ministry',
      budget: 5000,
      priority: 'medium'
    },
    {
      id: 'proj-4',
      name: 'Website Redesign',
      description: 'Update the church website with new design and features',
      status: 'completed',
      startDate: new Date(2023, 0, 10),
      endDate: new Date(2023, 3, 1),
      team: ['member-5'],
      category: 'Technology',
      priority: 'low'
    },
    {
      id: 'proj-5',
      name: 'Food Drive',
      description: 'Monthly food collection and distribution to those in need',
      status: 'in-progress',
      startDate: new Date(2023, 0, 1),
      team: ['member-2', 'member-3'],
      category: 'Outreach',
      budget: 1000,
      priority: 'high'
    }
  ]);

  const categories = [
    'Facilities',
    'Youth Ministry',
    'Music Ministry',
    'Technology',
    'Outreach',
    'Education',
    'Administration',
    'Worship',
    'Missions',
    'Community Service'
  ];

  // Filter projects based on search query, category, and active tab
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    const matchesTab = 
      (activeTab === 'all') || 
      (activeTab === 'current' && project.status !== 'completed' && project.status !== 'cancelled') ||
      (activeTab === 'completed' && (project.status === 'completed' || project.status === 'cancelled'));
    
    return matchesSearch && matchesCategory && matchesPriority && matchesTab;
  });

  const handleAddTeamMember = () => {
    if (newTeamMember.trim() && !selectedTeamMembers.includes(newTeamMember)) {
      setSelectedTeamMembers(prev => [...prev, newTeamMember]);
      setNewTeamMember('');
    }
  };

  const handleRemoveTeamMember = (member: string) => {
    setSelectedTeamMembers(prev => prev.filter(m => m !== member));
  };

  const handleSelectExistingMember = (memberId: string) => {
    if (!selectedTeamMembers.includes(memberId)) {
      setSelectedTeamMembers(prev => [...prev, memberId]);
    }
  };

  const handleCreateProject = () => {
    const formValues = form.getValues();
    
    const newProject: Project = {
      id: `proj-${projects.length + 1}`,
      name: formValues.name,
      description: formValues.description,
      status: 'planning',
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      team: selectedTeamMembers,
      category: useCustomCategory ? customCategory : formValues.category,
      budget: formValues.budget,
      priority: formValues.priority
    };

    setProjects(prev => [...prev, newProject]);
    setIsProjectDialogOpen(false);
    form.reset();
    setSelectedTeamMembers([]);
    setNewTeamMember('');
    setCustomCategory('');
    setUseCustomCategory(false);
    toast.success('Project created successfully');
  };

  const handleDeleteProject = () => {
    if (projectToDelete) {
      setProjects(prev => prev.filter(project => project.id !== projectToDelete));
      setProjectToDelete(null);
      toast.success('Project deleted successfully');
    }
  };

  const handleCompleteProject = () => {
    if (projectToComplete) {
      setProjects(prev => prev.map(project => 
        project.id === projectToComplete 
          ? { ...project, status: 'completed', endDate: project.endDate || new Date() } 
          : project
      ));
      setProjectToComplete(null);
      toast.success('Project marked as completed');
    }
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : memberId;
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'planning':
        return "bg-blue-100 text-blue-800";
      case 'in-progress':
        return "bg-green-100 text-green-800";
      case 'on-hold':
        return "bg-yellow-100 text-yellow-800";
      case 'completed':
        return "bg-purple-100 text-purple-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch(priority) {
      case 'high':
        return "bg-red-100 text-red-800";
      case 'medium':
        return "bg-yellow-100 text-yellow-800";
      case 'low':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const confirmDeleteProject = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setProjectToDelete(projectId);
  };

  const confirmCompleteProject = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setProjectToComplete(projectId);
  };

  const resetFormFields = () => {
    form.reset();
    setSelectedTeamMembers([]);
    setNewTeamMember('');
    setCustomCategory('');
    setUseCustomCategory(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Projects</h1>
        <Button onClick={() => {
          resetFormFields();
          setIsProjectDialogOpen(true);
        }}>
          Add New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {projects.filter(p => p.status === 'in-progress' || p.status === 'planning').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {projects.filter(p => p.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="current">Current Projects</TabsTrigger>
              <TabsTrigger value="completed">Past Projects</TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <div className="w-64">
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                  {projects.map(project => project.category)
                    .filter(category => !categories.includes(category))
                    .filter((category, index, self) => self.indexOf(category) === index)
                    .map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
                      <div className="flex items-center space-x-2">
                        <Badge className={cn("ml-2", getStatusBadgeColor(project.status))}>
                          {project.status === 'in-progress' ? 'In Progress' : 
                           project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                        <div className="flex space-x-1">
                          {project.status !== 'completed' && project.status !== 'cancelled' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-green-600 hover:bg-green-50"
                                  onClick={(e) => confirmCompleteProject(project.id, e)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to mark "{project.name}" as completed? This will move it to the Past Projects section.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setProjectToComplete(null)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleCompleteProject}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Complete Project
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={(e) => confirmDeleteProject(project.id, e)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the "{project.name}" project. This action cannot be undone.
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
                        <span className="text-sm font-medium">Category:</span>
                        <span className="text-sm">{project.category}</span>
                      </div>
                      {project.budget && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Budget:</span>
                          <span className="text-sm">${project.budget.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Priority:</span>
                        <Badge className={cn(getPriorityBadgeColor(project.priority))}>
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium mb-1">Team:</span>
                        <div className="flex flex-wrap gap-1">
                          {project.team.map(memberId => (
                            <Badge key={memberId} variant="outline" className="text-xs">
                              {getMemberName(memberId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="current" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={cn("ml-2", getStatusBadgeColor(project.status))}>
                          {project.status === 'in-progress' ? 'In Progress' : 
                           project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                        <div className="flex space-x-1">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-green-600 hover:bg-green-50"
                                onClick={(e) => confirmCompleteProject(project.id, e)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to mark "{project.name}" as completed? This will move it to the Past Projects section.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setProjectToComplete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleCompleteProject}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Complete Project
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={(e) => confirmDeleteProject(project.id, e)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the "{project.name}" project. This action cannot be undone.
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
                        <span className="text-sm font-medium">Category:</span>
                        <span className="text-sm">{project.category}</span>
                      </div>
                      {project.budget && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Budget:</span>
                          <span className="text-sm">${project.budget.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Priority:</span>
                        <Badge className={cn(getPriorityBadgeColor(project.priority))}>
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium mb-1">Team:</span>
                        <div className="flex flex-wrap gap-1">
                          {project.team.map(memberId => (
                            <Badge key={memberId} variant="outline" className="text-xs">
                              {getMemberName(memberId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={cn("ml-2", getStatusBadgeColor(project.status))}>
                          {project.status === 'in-progress' ? 'In Progress' : 
                           project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={(e) => confirmDeleteProject(project.id, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the "{project.name}" project. This action cannot be undone.
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
                        <span className="text-sm font-medium">Category:</span>
                        <span className="text-sm">{project.category}</span>
                      </div>
                      {project.budget && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Budget:</span>
                          <span className="text-sm">${project.budget.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Priority:</span>
                        <Badge className={cn(getPriorityBadgeColor(project.priority))}>
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium mb-1">Team:</span>
                        <div className="flex flex-wrap gap-1">
                          {project.team.map(memberId => (
                            <Badge key={memberId} variant="outline" className="text-xs">
                              {getMemberName(memberId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Enter the details for the new church project.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormLabel htmlFor="name">Project Name</FormLabel>
                  <Input
                    id="name"
                    value={form.watch('name')}
                    onChange={(e) => form.setValue('name', e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="col-span-2">
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Textarea
                    id="description"
                    value={form.watch('description')}
                    onChange={(e) => form.setValue('description', e.target.value)}
                    placeholder="Enter project description"
                  />
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
                            !form.watch('startDate') && "text-muted-foreground"
                          )}
                        >
                          {form.watch('startDate') ? (
                            format(form.watch('startDate'), "PPP")
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
                        selected={form.watch('startDate')}
                        onSelect={(date) => date && form.setValue('startDate', date)}
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
                            !form.watch('endDate') && "text-muted-foreground"
                          )}
                        >
                          {form.watch('endDate') ? (
                            format(form.watch('endDate'), "PPP")
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
                        selected={form.watch('endDate')}
                        onSelect={(date) => form.setValue('endDate', date || undefined)}
                        initialFocus
                        disabled={(date) => date < form.watch('startDate')}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="col-span-1">
                  <FormLabel htmlFor="budget">Budget (Optional)</FormLabel>
                  <Input
                    id="budget"
                    type="number"
                    value={form.watch('budget') || ''}
                    onChange={(e) => form.setValue('budget', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Enter budget"
                  />
                </div>
                <div className="col-span-1">
                  <FormLabel htmlFor="priority">Priority</FormLabel>
                  <Select 
                    value={form.watch('priority')} 
                    onValueChange={(value) => form.setValue('priority', value as 'low' | 'medium' | 'high')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="useCustomCategory"
                      checked={useCustomCategory}
                      onCheckedChange={(checked) => setUseCustomCategory(checked === true)}
                    />
                    <label
                      htmlFor="useCustomCategory"
                      className="text-sm font-medium leading-none"
                    >
                      Use custom category
                    </label>
                  </div>
                  
                  {useCustomCategory ? (
                    <div>
                      <FormLabel htmlFor="customCategory">Custom Category</FormLabel>
                      <Input
                        id="customCategory"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter custom category"
                      />
                    </div>
                  ) : (
                    <div>
                      <FormLabel htmlFor="category">Category</FormLabel>
                      <Select 
                        value={form.watch('category')} 
                        onValueChange={(value) => form.setValue('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="col-span-2">
                  <FormLabel>Team Members</FormLabel>
                  <div className="space-y-4">
                    <div>
                      <FormLabel htmlFor="existingMembers">Select from Church Members</FormLabel>
                      <Select onValueChange={handleSelectExistingMember}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team members" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.firstName} {member.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FormLabel htmlFor="newTeamMember" className="flex-shrink-0">Or add custom member:</FormLabel>
                      <Input
                        id="newTeamMember"
                        value={newTeamMember}
                        onChange={(e) => setNewTeamMember(e.target.value)}
                        placeholder="Enter name"
                        className="flex-grow"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddTeamMember}
                        disabled={!newTeamMember.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {selectedTeamMembers.length > 0 && (
                      <div className="mt-2">
                        <FormLabel>Team:</FormLabel>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedTeamMembers.map(member => (
                            <Badge 
                              key={member} 
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {getMemberName(member)}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleRemoveTeamMember(member)}
                              >
                                ×
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateProject} 
              disabled={!form.watch('name') || selectedTeamMembers.length === 0 || (!useCustomCategory && !form.watch('category')) || (useCustomCategory && !customCategory)}
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
