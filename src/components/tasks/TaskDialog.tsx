
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppContext } from '@/context/AppContext';
import { Task, TaskStatus, TaskPriority, TaskRecurrence } from '@/types';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: string;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ open, onOpenChange, taskId }) => {
  const { tasks, taskCategories, members, addTask, updateTask } = useAppContext();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [assignees, setAssignees] = useState<string[]>(['user-1']); // Default to current user
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none');
  
  // Load task data if editing
  useEffect(() => {
    if (taskId && open) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.dueDate);
        setSelectedCategories(task.categories.map(c => c.id));
        setAssignees(task.assigneeIds);
        setRecurrence(task.recurrence);
      }
    } else if (open) {
      // Reset form when opening for a new task
      resetForm();
    }
  }, [taskId, open, tasks]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setPriority('medium');
    setDueDate(null);
    setSelectedCategories([]);
    setAssignees(['user-1']); // Default to current user
    setRecurrence('none');
  };
  
  const handleSubmit = () => {
    if (!title.trim()) {
      // Show validation error
      return;
    }
    
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      categories: taskCategories.filter(c => selectedCategories.includes(c.id)),
      reminderDate: null,
      recurrence,
      assigneeIds: assignees,
      dependencyIds: [],
      attachments: [],
    };
    
    if (taskId) {
      updateTask(taskId, taskData);
    } else {
      addTask(taskData);
    }
    
    onOpenChange(false);
    resetForm();
  };
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleAssigneeToggle = (memberId: string) => {
    setAssignees(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{taskId ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {taskId 
              ? 'Update the details of your existing task.' 
              : 'Add a new task to your project. Fill in the required information below.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Enter task title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Enter task description" 
              className="min-h-[100px]"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate || undefined}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
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
          
          <div className="grid gap-2">
            <Label>Assignees</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {members.map(member => {
                const isSelected = assignees.includes(member.id);
                return (
                  <div 
                    key={member.id}
                    className={`flex items-center space-x-2 p-1 rounded-full cursor-pointer ${
                      isSelected ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => handleAssigneeToggle(member.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar || undefined} />
                      <AvatarFallback>{`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.firstName} {member.lastName}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="recurrence">Recurrence</Label>
            <Select value={recurrence} onValueChange={(value: TaskRecurrence) => setRecurrence(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {taskId ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
