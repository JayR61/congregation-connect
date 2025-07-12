import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List, Plus, Search, Filter, TagIcon, Calendar, CheckCircle, Clock } from 'lucide-react';
import TaskList from '@/components/tasks/TaskList';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import TaskDialog from '@/components/tasks/TaskDialog';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const { tasks, taskCategories } = useAppContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [tabsValue, setTabsValue] = useState('all');
  const navigate = useNavigate();
  
  // Filter tasks based on selected filters and search query
  const filteredTasks = tasks.filter(task => {
    // Status filter
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    // Search query filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
                           task.categories.some(category => selectedCategories.includes(category.id));
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesStatus && matchesSearch && matchesCategory && matchesPriority;
  });

  // Calculate task statistics
  const { currentUser } = useAppContext();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const myTasks = tasks.filter(task => task.assigneeIds.includes(currentUser.id)).length;
  const overdueTasks = tasks.filter(task => 
    task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date()
  ).length;

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSelectedCategories([]);
    setPriorityFilter('all');
    setSearchQuery('');
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button onClick={() => setShowTaskDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" 
              onClick={() => setStatusFilter('all')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setStatusFilter('completed')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => {
                setStatusFilter('all');
                setSelectedCategories([]);
                setTabsValue('my');
              }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTasks}</div>
          </CardContent>
        </Card>
        <Card className="hover:bg-red-50 text-red-700 border-red-100 transition-colors cursor-pointer"
              onClick={() => {
                const overdueIds = tasks
                  .filter(task => task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date())
                  .map(task => task.id);
                // Custom handling for overdue tasks view
                setStatusFilter('all');
                setTabsValue('upcoming');
              }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue
            </CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'in-progress' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('in-progress')}
            size="sm"
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('completed')}
            size="sm"
          >
            Completed
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <TagIcon size={14} />
                Categories
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs font-normal">
                    {selectedCategories.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Filter by category</h4>
                <div className="flex flex-wrap gap-2 pt-2">
                  {taskCategories.map(category => (
                    <Badge 
                      key={category.id}
                      variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      style={
                        selectedCategories.includes(category.id) 
                          ? { backgroundColor: category.color, color: 'white' } 
                          : {}
                      }
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          {(searchQuery || statusFilter !== 'all' || selectedCategories.length > 0 || priorityFilter !== 'all') && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-muted' : ''}
          >
            <LayoutGrid size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-muted' : ''}
          >
            <List size={18} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4" value={tabsValue} onValueChange={setTabsValue}>
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="my">My Tasks</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="recent">Recently Updated</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TaskList 
            tasks={filteredTasks} 
            viewMode={viewMode} 
            onTaskClick={handleViewTask}
          />
        </TabsContent>
        <TabsContent value="my">
          <TaskList 
            tasks={tasks.filter(task => task.assigneeIds.includes(currentUser.id))} 
            viewMode={viewMode} 
            onTaskClick={handleViewTask}
          />
        </TabsContent>
        <TabsContent value="upcoming">
          <TaskList 
            tasks={tasks.filter(task => 
              task.dueDate && new Date(task.dueDate) > new Date() && task.status !== 'completed'
            )} 
            viewMode={viewMode} 
            onTaskClick={handleViewTask}
          />
        </TabsContent>
        <TabsContent value="recent">
          <TaskList 
            tasks={[...tasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 20)} 
            viewMode={viewMode} 
            onTaskClick={handleViewTask}
          />
        </TabsContent>
      </Tabs>

      <TaskDialog 
        open={showTaskDialog} 
        onOpenChange={setShowTaskDialog}
      />
    </div>
  );
};

export default Tasks;
