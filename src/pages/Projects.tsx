
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  BarChart, 
  Calendar, 
  Loader2, 
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/context/AppContext';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/lib/toast';
import EvidenceDialog from '@/components/projects/EvidenceDialog';
import DocumentPreview from '@/components/projects/DocumentPreview';
import { saveProjects, getProjects } from '@/services/localStorage';

const Projects = () => {
  // State for projects
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false);
  
  // Data states
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [newUpdate, setNewUpdate] = useState({
    description: '',
    completionPercentage: 0,
    expense: 0,
  });
  
  // Form states for new project
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: new Date(),
    endDate: null as Date | null,
    budget: 0,
    status: 'pending',
    category: 'event',
    teamMembers: [] as string[],
    externalMembers: [] as { name: string; email?: string; phone?: string }[],
    verified: false,
    customCategory: '',
    hasGoal: false,
    goalType: 'financial',
    customGoalName: '',
    goalTarget: '',
  });

  const { members } = useAppContext();
  
  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = getProjects();
    if (savedProjects && savedProjects.length > 0) {
      setProjects(savedProjects);
    }
    setIsLoading(false);
  }, []);
  
  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveProjects(projects);
    }
  }, [projects, isLoading]);

  // Categories
  const categories = [
    { id: 'event', label: 'Event', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    { id: 'building', label: 'Building', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    { id: 'missions', label: 'Missions', color: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' },
    { id: 'outreach', label: 'Outreach', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
    { id: 'fundraising', label: 'Fundraising', color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
    { id: 'donation', label: 'Donation', color: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300' },
    { id: 'custom', label: 'Custom', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  ];
  
  // Statuses
  const statuses = [
    { id: 'pending', label: 'Pending', icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' },
    { id: 'in-progress', label: 'In Progress', icon: <Loader2 className="h-4 w-4 animate-spin" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    { id: 'completed', label: 'Completed', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' },
    { id: 'cancelled', label: 'Cancelled', icon: <XCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
    { id: 'on-hold', label: 'On Hold', icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' },
  ];

  // Handlers
  const handleCreateProject = () => {
    // Validate required fields
    if (!newProject.name || !newProject.description || !newProject.startDate || !newProject.category) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if custom category is provided when 'custom' category is selected
    if (newProject.category === 'custom' && !newProject.customCategory) {
      toast({
        title: "Custom Category Required",
        description: "Please provide a name for your custom category.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if goal information is complete
    if (newProject.hasGoal) {
      if (!newProject.goalTarget) {
        toast({
          title: "Goal Target Required",
          description: "Please provide a target for your goal.",
          variant: "destructive"
        });
        return;
      }
      
      if (newProject.goalType === 'custom' && !newProject.customGoalName) {
        toast({
          title: "Custom Goal Name Required",
          description: "Please provide a name for your custom goal.",
          variant: "destructive"
        });
        return;
      }
    }

    // Create new project object
    const categoryLabel = newProject.category === 'custom' 
      ? newProject.customCategory 
      : categories.find(c => c.id === newProject.category)?.label || newProject.category;
    
    // Process goal information
    const goalData = newProject.hasGoal ? {
      type: newProject.goalType,
      name: newProject.goalType === 'custom' ? newProject.customGoalName : 'Fundraising',
      target: newProject.goalType === 'financial' ? parseFloat(newProject.goalTarget) : newProject.goalTarget
    } : null;

    const project = {
      id: `project-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      budget: parseFloat(newProject.budget as unknown as string) || 0,
      spent: 0,
      completionPercentage: 0,
      status: newProject.status,
      category: categoryLabel,
      categoryId: newProject.category,
      teamMembers: newProject.teamMembers,
      externalMembers: newProject.externalMembers,
      verified: newProject.verified,
      createdAt: new Date(),
      updates: [],
      evidence: [],
      goal: goalData
    };

    // Add to projects state
    setProjects([...projects, project]);
    
    // Reset form and close dialog
    setNewProject({
      name: '',
      description: '',
      startDate: new Date(),
      endDate: null,
      budget: 0,
      status: 'pending',
      category: 'event',
      teamMembers: [],
      externalMembers: [],
      verified: false,
      customCategory: '',
      hasGoal: false,
      goalType: 'financial',
      customGoalName: '',
      goalTarget: '',
    });
    setNewProjectDialogOpen(false);
    
    toast({
      title: "Project Created",
      description: `${project.name} has been created successfully.`
    });
  };
  
  const handleAddUpdate = (project: any) => {
    setCurrentProject(project);
    setNewUpdate({
      description: '',
      completionPercentage: project.completionPercentage || 0,
      expense: 0,
    });
    setUpdateDialogOpen(true);
  };
  
  const handleAddEvidence = (project: any) => {
    setCurrentProject(project);
    setEvidenceDialogOpen(true);
  };
  
  const handleViewDetails = (project: any) => {
    setCurrentProject(project);
    setDetailsDialogOpen(true);
  };
  
  const handleSaveUpdate = () => {
    if (!currentProject || !newUpdate.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a description for the update.",
        variant: "destructive"
      });
      return;
    }
    
    const update = {
      id: `update-${Date.now()}`,
      description: newUpdate.description,
      completionPercentage: newUpdate.completionPercentage,
      expense: parseFloat(newUpdate.expense as unknown as string) || 0,
      date: new Date()
    };
    
    const updatedProject = {
      ...currentProject,
      updates: [...(currentProject.updates || []), update],
      completionPercentage: newUpdate.completionPercentage,
      spent: (currentProject.spent || 0) + (update.expense || 0)
    };
    
    setProjects(
      projects.map(p => p.id === currentProject.id ? updatedProject : p)
    );
    
    setUpdateDialogOpen(false);
    setCurrentProject(null);
    setNewUpdate({
      description: '',
      completionPercentage: 0,
      expense: 0,
    });
    
    toast({
      title: "Update Added",
      description: `Update has been added to ${updatedProject.name}.`
    });
  };
  
  const handleDeleteProject = (project: any) => {
    setCurrentProject(project);
    setConfirmDeleteOpen(true);
  };
  
  const confirmDelete = () => {
    if (!currentProject) return;
    
    setProjects(projects.filter(p => p.id !== currentProject.id));
    setConfirmDeleteOpen(false);
    setCurrentProject(null);
    
    toast({
      title: "Project Deleted",
      description: "The project has been deleted successfully."
    });
  };
  
  const handleSaveEvidence = (files: File[], description: string) => {
    if (!currentProject) return;
    
    const newEvidence = files.map(file => {
      const url = URL.createObjectURL(file);
      return {
        id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        description: description,
        type: file.type,
        size: file.size,
        url: url,
        date: new Date()
      };
    });
    
    const updatedProject = {
      ...currentProject,
      evidence: [...(currentProject.evidence || []), ...newEvidence]
    };
    
    setProjects(
      projects.map(p => p.id === currentProject.id ? updatedProject : p)
    );
    
    setEvidenceDialogOpen(false);
    setCurrentProject(null);
    
    toast({
      title: "Evidence Added",
      description: `${newEvidence.length} file(s) added as evidence.`
    });
  };
  
  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setDocumentPreviewOpen(true);
  };
  
  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getStatusIcon = (statusId: string) => {
    const status = statuses.find(s => s.id === statusId);
    return status?.icon || <Clock className="h-4 w-4" />;
  };
  
  const getStatusBadgeColor = (statusId: string) => {
    const status = statuses.find(s => s.id === statusId);
    return status?.color || 'bg-gray-100 text-gray-800';
  };
  
  const getCategoryBadgeColor = (categoryName: string) => {
    const category = categories.find(c => c.label === categoryName);
    return category?.color || 'bg-gray-100 text-gray-800';
  };
  
  const [newExternalMember, setNewExternalMember] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage church projects, initiatives and campaigns</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => setNewProjectDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-lg">
              <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first project to get started.</p>
              <Button onClick={() => setNewProjectDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onAddUpdate={() => handleAddUpdate(project)}
                  onViewDetails={() => handleViewDetails(project)}
                  onDelete={() => handleDeleteProject(project)}
                  onAddEvidence={() => handleAddEvidence(project)}
                  formatCurrency={formatCurrency}
                  getStatusIcon={getStatusIcon}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getCategoryBadgeColor={getCategoryBadgeColor}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-lg">
              <h3 className="text-lg font-medium mb-2">No Active Projects</h3>
              <p className="text-muted-foreground mb-4">Create a new project or check completed projects.</p>
              <Button onClick={() => setNewProjectDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects
                .filter(p => p.status !== 'completed' && p.status !== 'cancelled')
                .map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onAddUpdate={() => handleAddUpdate(project)}
                    onViewDetails={() => handleViewDetails(project)}
                    onDelete={() => handleDeleteProject(project)}
                    onAddEvidence={() => handleAddEvidence(project)}
                    formatCurrency={formatCurrency}
                    getStatusIcon={getStatusIcon}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getCategoryBadgeColor={getCategoryBadgeColor}
                  />
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.filter(p => p.status === 'completed').length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-lg">
              <h3 className="text-lg font-medium mb-2">No Completed Projects</h3>
              <p className="text-muted-foreground">Projects will appear here when they are marked as completed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects
                .filter(p => p.status === 'completed')
                .map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onAddUpdate={() => handleAddUpdate(project)}
                    onViewDetails={() => handleViewDetails(project)}
                    onDelete={() => handleDeleteProject(project)}
                    onAddEvidence={() => handleAddEvidence(project)}
                    formatCurrency={formatCurrency}
                    getStatusIcon={getStatusIcon}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getCategoryBadgeColor={getCategoryBadgeColor}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* New Project Dialog */}
      <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project or initiative for your church.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the project"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {newProject.startDate ? format(newProject.startDate, "PPP") : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newProject.startDate}
                      onSelect={(date) => setNewProject({...newProject, startDate: date || new Date()})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {newProject.endDate ? format(newProject.endDate, "PPP") : (
                        <span>Optional</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newProject.endDate || undefined}
                      onSelect={(date) => setNewProject({...newProject, endDate: date})}
                      initialFocus
                      disabled={(date) => date < (newProject.startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newProject.status} 
                onValueChange={(value) => setNewProject({...newProject, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status.id} value={status.id}>
                      <div className="flex items-center">
                        <span className="mr-2">{status.icon}</span>
                        <span>{status.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newProject.category} 
                onValueChange={(value) => setNewProject({...newProject, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {newProject.category === 'custom' && (
              <div className="grid gap-2">
                <Label htmlFor="customCategory">Custom Category Name</Label>
                <Input
                  id="customCategory"
                  placeholder="Enter custom category name"
                  value={newProject.customCategory}
                  onChange={(e) => setNewProject({...newProject, customCategory: e.target.value})}
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                placeholder="Enter budget amount"
                type="number"
                min="0"
                step="0.01"
                value={newProject.budget || ''}
                onChange={(e) => setNewProject({...newProject, budget: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hasGoal">Project Goal</Label>
                <Switch 
                  id="hasGoal" 
                  checked={newProject.hasGoal}
                  onCheckedChange={(checked) => setNewProject({...newProject, hasGoal: checked})}
                />
              </div>
            </div>
            
            {newProject.hasGoal && (
              <>
                <div className="grid gap-2">
                  <Label>Goal Type</Label>
                  <RadioGroup 
                    value={newProject.goalType}
                    onValueChange={(value) => setNewProject({...newProject, goalType: value})}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="financial" id="financial" />
                      <Label htmlFor="financial" className="cursor-pointer">Financial Fundraising</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="cursor-pointer">Custom Goal</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {newProject.goalType === 'custom' && (
                  <div className="grid gap-2">
                    <Label htmlFor="customGoalName">Custom Goal Name</Label>
                    <Input
                      id="customGoalName"
                      placeholder="Enter goal name (e.g., Number of Attendees)"
                      value={newProject.customGoalName}
                      onChange={(e) => setNewProject({...newProject, customGoalName: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="goalTarget">
                    {newProject.goalType === 'financial' ? 'Fundraising Target' : 'Goal Target'}
                  </Label>
                  <Input
                    id="goalTarget"
                    placeholder={newProject.goalType === 'financial' ? "Enter amount to raise" : "Enter target value"}
                    value={newProject.goalTarget}
                    onChange={(e) => setNewProject({...newProject, goalTarget: e.target.value})}
                    type={newProject.goalType === 'financial' ? "number" : "text"}
                    min={newProject.goalType === 'financial' ? "0" : undefined}
                    step={newProject.goalType === 'financial' ? "0.01" : undefined}
                  />
                </div>
              </>
            )}
            
            <Separator className="my-2" />
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Team Members</Label>
                <div className="text-xs text-muted-foreground">
                  {newProject.teamMembers.length} selected
                </div>
              </div>
              <Select
                onValueChange={(value) => {
                  if (!newProject.teamMembers.includes(value)) {
                    setNewProject({
                      ...newProject, 
                      teamMembers: [...newProject.teamMembers, value]
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add team member" />
                </SelectTrigger>
                <SelectContent>
                  {members.filter(m => !newProject.teamMembers.includes(m.id)).map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {newProject.teamMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.teamMembers.map(memberId => {
                    const member = members.find(m => m.id === memberId);
                    return (
                      <Badge 
                        key={memberId} 
                        variant="secondary"
                        className="flex items-center gap-1 pl-2"
                      >
                        {member ? `${member.firstName} ${member.lastName}` : 'Unknown Member'}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-1 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            setNewProject({
                              ...newProject,
                              teamMembers: newProject.teamMembers.filter(id => id !== memberId)
                            });
                          }}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label>External Collaborators</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  placeholder="Name"
                  value={newExternalMember.name}
                  onChange={(e) => setNewExternalMember({...newExternalMember, name: e.target.value})}
                />
                <Input
                  placeholder="Email (optional)"
                  type="email"
                  value={newExternalMember.email}
                  onChange={(e) => setNewExternalMember({...newExternalMember, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 mt-2 gap-2">
                <Input
                  placeholder="Phone (optional)"
                  value={newExternalMember.phone}
                  onChange={(e) => setNewExternalMember({...newExternalMember, phone: e.target.value})}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!newExternalMember.name) return;
                    
                    setNewProject({
                      ...newProject,
                      externalMembers: [
                        ...newProject.externalMembers,
                        {...newExternalMember}
                      ]
                    });
                    setNewExternalMember({name: '', email: '', phone: ''});
                  }}
                  disabled={!newExternalMember.name}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {newProject.externalMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.externalMembers.map((member, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline"
                      className="flex items-center gap-1 pl-2"
                    >
                      {member.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          setNewProject({
                            ...newProject,
                            externalMembers: newProject.externalMembers.filter((_, i) => i !== idx)
                          });
                        }}
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="verified" 
                  checked={newProject.verified}
                  onCheckedChange={(checked) => setNewProject({...newProject, verified: checked})}
                />
                <Label htmlFor="verified" className="cursor-pointer">Mark as verified project</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Project Update</DialogTitle>
            <DialogDescription>
              Record progress, changes or news about the project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="update-description">Update Description</Label>
              <Textarea
                id="update-description"
                placeholder="What's happening with the project?"
                className="min-h-[100px]"
                value={newUpdate.description}
                onChange={(e) => setNewUpdate({...newUpdate, description: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="completion">Progress (%)</Label>
              <div className="flex items-center">
                <Input
                  id="completion"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Completion percentage"
                  value={newUpdate.completionPercentage}
                  onChange={(e) => setNewUpdate({
                    ...newUpdate, 
                    completionPercentage: Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                  })}
                />
                <span className="ml-2 text-sm text-muted-foreground">%</span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="expense">Expense</Label>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-muted-foreground">$</span>
                <Input
                  id="expense"
                  type="number"
                  placeholder="Amount spent"
                  min="0"
                  step="0.01"
                  value={newUpdate.expense || ''}
                  onChange={(e) => setNewUpdate({
                    ...newUpdate, 
                    expense: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUpdate}>Save Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Evidence Dialog */}
      <EvidenceDialog
        open={evidenceDialogOpen}
        onOpenChange={setEvidenceDialogOpen}
        onSave={handleSaveEvidence}
      />

      {/* Document Preview Dialog */}
      <DocumentPreview
        isOpen={documentPreviewOpen}
        onClose={() => setDocumentPreviewOpen(false)}
        document={selectedDocument}
      />
      
      {/* Project Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>{currentProject?.name}</DialogTitle>
            <DialogDescription>
              Project details and history
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh]">
            <div className="grid gap-4 py-4">
              {/* Project Info */}
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">Project Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Status:</div>
                  <div>
                    <Badge className={getStatusBadgeColor(currentProject?.status)}>
                      {currentProject?.status?.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="font-medium">Category:</div>
                  <div>
                    <Badge className={getCategoryBadgeColor(currentProject?.category)}>
                      {currentProject?.category}
                    </Badge>
                  </div>
                  
                  <div className="font-medium">Start Date:</div>
                  <div>{currentProject?.startDate ? format(new Date(currentProject.startDate), "PPP") : 'N/A'}</div>
                  
                  <div className="font-medium">End Date:</div>
                  <div>{currentProject?.endDate ? format(new Date(currentProject.endDate), "PPP") : 'N/A'}</div>
                  
                  {currentProject?.budget > 0 && (
                    <>
                      <div className="font-medium">Budget:</div>
                      <div>{currentProject ? formatCurrency(currentProject.budget) : 'N/A'}</div>
                      
                      <div className="font-medium">Spent:</div>
                      <div>{currentProject ? formatCurrency(currentProject.spent || 0) : '$0.00'}</div>
                      
                      <div className="font-medium">Remaining:</div>
                      <div>{currentProject ? formatCurrency(currentProject.budget - (currentProject.spent || 0)) : 'N/A'}</div>
                    </>
                  )}
                  
                  {currentProject?.goal && (
                    <>
                      <div className="font-medium">
                        {currentProject.goal.type === 'financial' ? 'Fundraising Target:' : `${currentProject.goal.name} Goal:`}
                      </div>
                      <div>
                        {currentProject.goal.type === 'financial' 
                          ? formatCurrency(currentProject.goal.target) 
                          : currentProject.goal.target
                        }
                      </div>
                    </>
                  )}
                  
                  <div className="font-medium">Completion:</div>
                  <div className="flex items-center gap-2">
                    <Progress value={currentProject?.completionPercentage || 0} className="w-20" />
                    <span>{currentProject?.completionPercentage || 0}%</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="font-medium mb-1">Description:</div>
                  <p className="text-sm text-muted-foreground">{currentProject?.description}</p>
                </div>
              </div>
              
              <Separator />
              
              {/* Team Members */}
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">Team</h3>
                
                {(!currentProject?.teamMembers?.length && !currentProject?.externalMembers?.length) && (
                  <p className="text-sm text-muted-foreground">No team members assigned to this project.</p>
                )}
                
                {currentProject?.teamMembers?.length > 0 && (
                  <div className="mb-2">
                    <div className="text-sm font-medium mb-1">Church Members:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentProject?.teamMembers.map((memberId: string) => {
                        const member = members.find(m => m.id === memberId);
                        return (
                          <Badge key={memberId} variant="secondary">
                            {member ? `${member.firstName} ${member.lastName}` : 'Unknown Member'}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {currentProject?.externalMembers?.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">External Collaborators:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentProject?.externalMembers.map((member: any, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {member.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Updates History */}
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">Updates</h3>
                
                {!currentProject?.updates?.length ? (
                  <p className="text-sm text-muted-foreground">No updates recorded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {currentProject.updates.map((update: any) => (
                      <div key={update.id} className="bg-muted/50 p-3 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{format(new Date(update.date), "PPP")}</div>
                          <Badge variant="outline">{update.completionPercentage}% Complete</Badge>
                        </div>
                        <p className="text-sm">{update.description}</p>
                        {update.expense > 0 && (
                          <div className="mt-2 text-sm flex items-center gap-2">
                            <Badge variant="outline" className="text-orange-600">
                              Expense: {formatCurrency(update.expense)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Evidence */}
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">Evidence & Documents</h3>
                
                {!currentProject?.evidence?.length ? (
                  <p className="text-sm text-muted-foreground">No evidence uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentProject.evidence.map((doc: any) => (
                      <div key={doc.id} className="bg-muted/50 p-2 rounded-md flex items-center gap-2">
                        <div className="flex-1 truncate">
                          <div className="font-medium truncate">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">{format(new Date(doc.date), "PP")}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDocument(doc)}
                          className="flex-shrink-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              setDetailsDialogOpen(false);
              handleAddUpdate(currentProject);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm font-medium">{currentProject?.name}</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
