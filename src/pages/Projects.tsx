import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/lib/toast';
import ProjectCard from '@/components/projects/ProjectCard';
import EvidenceDialog from '@/components/projects/EvidenceDialog';
import {
  Eye, 
  PlusCircle, 
  FileCheck, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  budget: number;
  spent: number;
  completionPercentage: number;
  verified: boolean;
  goal: {
    type: string;
    name?: string;
    target: string | number;
  };
  updates: {
    date: Date;
    content: string;
  }[];
  evidence: {
    file: string;
    description: string;
  }[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Community Garden Project',
      description: 'Establish a community garden to provide fresh produce for local families.',
      category: 'Environment',
      status: 'in-progress',
      startDate: new Date(2023, 0, 1),
      endDate: new Date(2023, 11, 31),
      budget: 15000,
      spent: 8000,
      completionPercentage: 55,
      verified: true,
      goal: {
        type: 'custom',
        name: 'Families Served',
        target: '100'
      },
      updates: [
        { date: new Date(2023, 3, 15), content: 'Planted first seeds.' },
        { date: new Date(2023, 5, 20), content: 'Harvested first crops.' }
      ],
      evidence: [
        { file: 'garden_plan.pdf', description: 'Initial garden layout plan.' },
        { file: 'harvest_photo.jpg', description: 'Photo of the first harvest.' }
      ]
    },
    {
      id: '2',
      name: 'Youth Mentorship Program',
      description: 'Create a mentorship program to support at-risk youth in the community.',
      category: 'Education',
      status: 'completed',
      startDate: new Date(2022, 6, 1),
      endDate: new Date(2023, 5, 30),
      budget: 20000,
      spent: 20000,
      completionPercentage: 100,
      verified: true,
      goal: {
        type: 'custom',
        name: 'Youth Mentored',
        target: '50'
      },
      updates: [
        { date: new Date(2022, 9, 10), content: 'Launched mentorship program.' },
        { date: new Date(2023, 4, 15), content: 'Held mid-year review meeting.' }
      ],
      evidence: [
        { file: 'program_brochure.pdf', description: 'Program details and guidelines.' },
        { file: 'mentorship_report.pdf', description: 'Summary of program outcomes.' }
      ]
    },
    {
      id: '3',
      name: 'Clean Water Initiative',
      description: 'Implement a clean water initiative to provide safe drinking water to rural communities.',
      category: 'Health',
      status: 'planned',
      startDate: new Date(2024, 2, 1),
      budget: 50000,
      spent: 0,
      completionPercentage: 0,
      verified: false,
      goal: {
        type: 'custom',
        name: 'People Served',
        target: '2000'
      },
      updates: [],
      evidence: []
    },
    {
      id: '4',
      name: 'Job Skills Training Program',
      description: 'Offer job skills training to unemployed individuals to improve their employment prospects.',
      category: 'Employment',
      status: 'in-progress',
      startDate: new Date(2023, 4, 1),
      endDate: new Date(2023, 9, 30),
      budget: 12000,
      spent: 7000,
      completionPercentage: 60,
      verified: false,
      goal: {
        type: 'custom',
        name: 'Trainees Enrolled',
        target: '30'
      },
      updates: [
        { date: new Date(2023, 6, 1), content: 'Conducted first training session.' }
      ],
      evidence: [
        { file: 'training_schedule.pdf', description: 'Training schedule and curriculum.' }
      ]
    },
    {
      id: '5',
      name: 'Elderly Care Support',
      description: 'Provide support and assistance to elderly individuals in the community.',
      category: 'Social Services',
      status: 'on-hold',
      startDate: new Date(2022, 10, 1),
      endDate: new Date(2023, 3, 31),
      budget: 8000,
      spent: 8000,
      completionPercentage: 100,
      verified: true,
      goal: {
        type: 'custom',
        name: 'Seniors Assisted',
        target: '25'
      },
      updates: [
        { date: new Date(2022, 11, 15), content: 'Started providing home visits.' }
      ],
      evidence: [
        { file: 'care_plan.pdf', description: 'Sample care plan for elderly individuals.' }
      ]
    },
    {
      id: '6',
      name: 'Environmental Conservation',
      description: 'Promote environmental conservation through tree planting and awareness campaigns.',
      category: 'Environment',
      status: 'completed',
      startDate: new Date(2022, 2, 1),
      endDate: new Date(2022, 7, 31),
      budget: 10000,
      spent: 10000,
      completionPercentage: 100,
      verified: true,
      goal: {
        type: 'custom',
        name: 'Trees Planted',
        target: '500'
      },
      updates: [
        { date: new Date(2022, 4, 1), content: 'Planted first batch of trees.' }
      ],
      evidence: [
        { file: 'tree_planting_guide.pdf', description: 'Guide on tree planting techniques.' }
      ]
    },
    {
      id: '7',
      name: 'Educational Scholarship Fund',
      description: 'Establish a scholarship fund to support underprivileged students in pursuing higher education.',
      category: 'Education',
      status: 'in-progress',
      startDate: new Date(2023, 1, 1),
      endDate: new Date(2023, 12, 31),
      budget: 30000,
      spent: 15000,
      completionPercentage: 50,
      verified: false,
      goal: {
        type: 'financial',
        target: '50000'
      },
      updates: [
        { date: new Date(2023, 3, 1), content: 'Launched scholarship application process.' }
      ],
      evidence: [
        { file: 'scholarship_application.pdf', description: 'Scholarship application form.' }
      ]
    },
    {
      id: '8',
      name: 'Healthcare Access Improvement',
      description: 'Improve healthcare access for underserved populations through mobile clinics and health education programs.',
      category: 'Health',
      status: 'planned',
      startDate: new Date(2024, 0, 1),
      budget: 60000,
      spent: 0,
      completionPercentage: 0,
      verified: false,
      goal: {
        type: 'custom',
        name: 'People Reached',
        target: '1000'
      },
      updates: [],
      evidence: []
    },
    {
      id: '9',
      name: 'Entrepreneurship Training',
      description: 'Provide entrepreneurship training and resources to aspiring business owners.',
      category: 'Employment',
      status: 'in-progress',
      startDate: new Date(2023, 5, 1),
      endDate: new Date(2023, 10, 31),
      budget: 18000,
      spent: 9000,
      completionPercentage: 50,
      verified: false,
      goal: {
        type: 'custom',
        name: 'Businesses Started',
        target: '10'
      },
      updates: [
        { date: new Date(2023, 7, 1), content: 'Conducted first entrepreneurship workshop.' }
      ],
      evidence: [
        { file: 'business_plan_template.pdf', description: 'Business plan template for participants.' }
      ]
    },
    {
      id: '10',
      name: 'Community Support Network',
      description: 'Establish a community support network to provide assistance and resources to vulnerable individuals and families.',
      category: 'Social Services',
      status: 'on-hold',
      startDate: new Date(2022, 9, 1),
      endDate: new Date(2023, 2, 28),
      budget: 12000,
      spent: 12000,
      completionPercentage: 100,
      verified: true,
      goal: {
        type: 'custom',
        name: 'Families Supported',
        target: '30'
      },
      updates: [
        { date: new Date(2022, 10, 15), content: 'Launched community support hotline.' }
      ],
      evidence: [
        { file: 'support_network_guidelines.pdf', description: 'Guidelines for community support network members.' }
      ]
    }
  ]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isViewingProjectDetails, setIsViewingProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addEvidenceProjectId, setAddEvidenceProjectId] = useState<string | null>(null);
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [selectedProjectIdForUpdate, setSelectedProjectIdForUpdate] = useState<string | null>(null);

  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'updates' | 'evidence' | 'completionPercentage' | 'spent' | 'verified'>>({
    name: '',
    description: '',
    category: 'Environment',
    status: 'planned',
    startDate: new Date(),
    endDate: undefined,
    budget: 0,
    goal: {
      type: 'custom',
      name: '',
      target: ''
    }
  });

  const [newUpdateContent, setNewUpdateContent] = useState('');

  const [newEvidence, setNewEvidence] = useState<{ file: string; description: string }>({
    file: '',
    description: ''
  });

  // Update the formatCurrency function to use South African Rand
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned':
        return <PlusCircle className="h-3 w-3" />;
      case 'in-progress':
        return <Progress className="h-3 w-3" />;
      case 'on-hold':
        return <AlertTriangle className="h-3 w-3" />;
      case 'completed':
        return <FileCheck className="h-3 w-3" />;
      default:
        return <Eye className="h-3 w-3" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'planned':
        return "bg-blue-100 text-blue-800";
      case 'in-progress':
        return "bg-green-100 text-green-800";
      case 'on-hold':
        return "bg-yellow-100 text-yellow-800";
      case 'completed':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Environment':
        return "bg-green-100 text-green-800";
      case 'Education':
        return "bg-blue-100 text-blue-800";
      case 'Health':
        return "bg-red-100 text-red-800";
      case 'Employment':
        return "bg-yellow-100 text-yellow-800";
      case 'Social Services':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Add a function to filter projects by timeframe
  const getFilteredProjects = (timeframe: 'all' | 'past' | 'future' | 'current') => {
    let filtered = [...projects];
    
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    const today = new Date();

    switch (timeframe) {
      case 'past':
        return filtered.filter(project => project.endDate && new Date(project.endDate) < today);
      case 'future':
        return filtered.filter(project => new Date(project.startDate) > today);
      case 'current':
        return filtered.filter(project => 
          new Date(project.startDate) <= today && 
          (!project.endDate || new Date(project.endDate) >= today)
        );
      default:
        return filtered;
    }
  };

  const handleCreateProject = () => {
    const newId = String(projects.length + 1);
    const endDate = newProject.endDate === null ? undefined : newProject.endDate;

    const newProjectToAdd: Project = {
      id: newId,
      name: newProject.name,
      description: newProject.description,
      category: newProject.category,
      status: newProject.status,
      startDate: newProject.startDate,
      endDate: endDate,
      budget: newProject.budget,
      spent: 0,
      completionPercentage: 0,
      verified: false,
      goal: {
        type: newProject.goal.type,
        name: newProject.goal.name,
        target: newProject.goal.target
      },
      updates: [],
      evidence: []
    };

    setProjects([...projects, newProjectToAdd]);
    setIsCreatingProject(false);
    setNewProject({
      name: '',
      description: '',
      category: 'Environment',
      status: 'planned',
      startDate: new Date(),
      endDate: undefined,
      budget: 0,
      goal: {
        type: 'custom',
        name: '',
        target: ''
      }
    });
    toast.success('Project created successfully!');
  };

  const handleViewDetails = (id: string) => {
    const project = projects.find(p => p.id === id);
    setSelectedProject(project);
    setIsViewingProjectDetails(true);
  };

  const handleCloseDetails = () => {
    setIsViewingProjectDetails(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Project deleted successfully!');
  };

  const handleAddEvidence = (projectId: string) => {
    setAddEvidenceProjectId(projectId);
  };

  const handleEvidenceSubmit = (projectId: string, evidence: { file: string; description: string }) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          evidence: [...project.evidence, evidence]
        };
      }
      return project;
    }));
    setAddEvidenceProjectId(null);
    setNewEvidence({ file: '', description: '' });
    toast.success('Evidence added successfully!');
  };

  const handleAddUpdate = (projectId: string) => {
    setSelectedProjectIdForUpdate(projectId);
    setIsAddingUpdate(true);
  };

  const handleUpdateSubmit = (projectId: string, content: string) => {
    const newUpdate = { date: new Date(), content };
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          updates: [...project.updates, newUpdate]
        };
      }
      return project;
    }));
    setIsAddingUpdate(false);
    setSelectedProjectIdForUpdate(null);
    setNewUpdateContent('');
    toast.success('Update added successfully!');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsCreatingProject(true)}>Create New Project</Button>
      </div>
      
      {/* Status Cards */}
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
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {projects.filter(p => p.status === 'completed').length}
            </div>
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
      </div>

      <div className="space-y-5">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-background rounded-lg p-3 border">
          <Input
            type="search"
            placeholder="Search projects..."
            className="md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Environment">Environment</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Employment">Employment</SelectItem>
                <SelectItem value="Social Services">Social Services</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs for Project Timeframes */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="future">Future</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredProjects('all').map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onAddUpdate={() => handleAddUpdate(project.id)}
                  onViewDetails={() => handleViewDetails(project.id)}
                  onDelete={() => handleDeleteProject(project.id)}
                  onAddEvidence={() => handleAddEvidence(project.id)}
                  formatCurrency={formatCurrency}
                  getStatusIcon={getStatusIcon}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getCategoryBadgeColor={getCategoryBadgeColor}
                />
              ))}
            </div>
            {getFilteredProjects('all').length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No projects found matching your filters.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="current" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredProjects('current').map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onAddUpdate={() => handleAddUpdate(project.id)}
                  onViewDetails={() => handleViewDetails(project.id)}
                  onDelete={() => handleDeleteProject(project.id)}
                  onAddEvidence={() => handleAddEvidence(project.id)}
                  formatCurrency={formatCurrency}
                  getStatusIcon={getStatusIcon}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getCategoryBadgeColor={getCategoryBadgeColor}
                />
              ))}
            </div>
            {getFilteredProjects('current').length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No current projects found matching your filters.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="future" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredProjects('future').map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onAddUpdate={() => handleAddUpdate(project.id)}
                  onViewDetails={() => handleViewDetails(project.id)}
                  onDelete={() => handleDeleteProject(project.id)}
                  onAddEvidence={() => handleAddEvidence(project.id)}
                  formatCurrency={formatCurrency}
                  getStatusIcon={getStatusIcon}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getCategoryBadgeColor={getCategoryBadgeColor}
                />
              ))}
            </div>
            {getFilteredProjects('future').length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No future projects found matching your filters.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredProjects('past').map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onAddUpdate={() => handleAddUpdate(project.id)}
                  onViewDetails={() => handleViewDetails(project.id)}
                  onDelete={() => handleDeleteProject(project.id)}
                  onAddEvidence={() => handleAddEvidence(project.id)}
                  formatCurrency={formatCurrency}
                  getStatusIcon={getStatusIcon}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getCategoryBadgeColor={getCategoryBadgeColor}
                />
              ))}
            </div>
            {getFilteredProjects('past').length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No past projects found matching your filters.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Creation Dialog */}
      <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details for the new project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newProject.category} onValueChange={(value) => setNewProject({ ...newProject, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Employment">Employment</SelectItem>
                    <SelectItem value="Social Services">Social Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newProject.status} onValueChange={(value) => setNewProject({ ...newProject, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !newProject.startDate && "text-muted-foreground"
                      )}
                    >
                      {newProject.startDate ? (
                        format(newProject.startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newProject.startDate}
                      onSelect={(date) => date && setNewProject({ ...newProject, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !newProject.endDate && "text-muted-foreground"
                      )}
                    >
                      {newProject.endDate ? (
                        format(newProject.endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newProject.endDate}
                      onSelect={(date) => setNewProject({ ...newProject, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input
                  type="number"
                  id="budget"
                  value={String(newProject.budget)}
                  onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="goalType">Goal Type</Label>
                <Select value={newProject.goal.type} onValueChange={(value) => setNewProject({ ...newProject, goal: { ...newProject.goal, type: value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newProject.goal.type === 'custom' && (
                <>
                  <div>
                    <Label htmlFor="goalName">Goal Name</Label>
                    <Input
                      type="text"
                      id="goalName"
                      value={String(newProject.goal.name)}
                      onChange={(e) => setNewProject({ ...newProject, goal: { ...newProject.goal, name: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalTarget">Goal Target</Label>
                    <Input
                      type="text"
                      id="goalTarget"
                      value={String(newProject.goal.target)}
                      onChange={(e) => setNewProject({ ...newProject, goal: { ...newProject.goal, target: e.target.value } })}
                    />
                  </div>
                </>
              )}
              {newProject.goal.type === 'financial' && (
                <div>
                  <Label htmlFor="goalTarget">Fundraising Target</Label>
                  <Input
                    type="number"
                    id="goalTarget"
                    value={String(newProject.goal.target)}
                    onChange={(e) => setNewProject({ ...newProject, goal: { ...newProject.goal, target:
