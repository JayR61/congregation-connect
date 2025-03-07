
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CalendarIcon, Check, Plus, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppContext } from '@/context/AppContext';
import { Task, TaskStatus, TaskPriority, TaskRecurrence, TaskCategory } from '@/types';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: string;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ open, onOpenChange, taskId }) => {
  const { tasks, taskCategories, members, addTask, updateTask, deleteTask } = useAppContext();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [assignees, setAssignees] = useState<string[]>(['user-1']); // Default to current user
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none');
  
  // Custom category state
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategoryColor, setCustomCategoryColor] = useState('#3b82f6');
  const [customCategories, setCustomCategories] = useState<TaskCategory[]>([]);
  
  // Task metadata for editing
  const [creatorInfo, setCreatorInfo] = useState<{name: string, date: Date | null}>({name: '', date: null});
  const [lastModifierInfo, setLastModifierInfo] = useState<{name: string, date: Date | null, action: string}>({name: '', date: null, action: ''});
  const [confirmDelete, setConfirmDelete] = useState(false);
  
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
        
        // Set creator info
        const creator = members.find(m => m.id === task.createdById);
        if (creator) {
          setCreatorInfo({
            name: `${creator.firstName} ${creator.lastName}`,
            date: task.createdAt
          });
        }
        
        // Set last modifier info if available
        if (task.lastModifiedById) {
          const modifier = members.find(m => m.id === task.lastModifiedById);
          if (modifier) {
            setLastModifierInfo({
              name: `${modifier.firstName} ${modifier.lastName}`,
              date: task.updatedAt,
              action: task.lastModifiedAction || 'updated'
            });
          }
        }
      }
    } else if (open) {
      // Reset form when opening for a new task
      resetForm();
    }
  }, [taskId, open, tasks, members]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setPriority('medium');
    setDueDate(null);
    setSelectedCategories([]);
    setAssignees(['user-1']); // Default to current user
    setRecurrence('none');
    setCreatorInfo({name: '', date: null});
    setLastModifierInfo({name: '', date: null, action: ''});
    setCustomCategories([]);
    setShowCustomCategory(false);
    setCustomCategoryName('');
  };
  
  const handleAddCustomCategory = () => {
    if (customCategoryName.trim()) {
      const newCategory: TaskCategory = {
        id: `custom-category-${Date.now()}`,
        name: customCategoryName.trim(),
        color: customCategoryColor,
        description: 'Custom category'
      };
      
      setCustomCategories(prev => [...prev, newCategory]);
      setSelectedCategories(prev => [...prev, newCategory.id]);
      setCustomCategoryName('');
      setShowCustomCategory(false);
    }
  };
  
  const handleSubmit = () => {
    if (!title.trim()) {
      // Show validation error
      return;
    }
    
    // Combine system and custom categories for the task
    const allCategories = [
      ...taskCategories.filter(c => selectedCategories.includes(c.id)),
      ...customCategories.filter(c => selectedCategories.includes(c.id))
    ];
    
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      categories: allCategories,
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
  
  const handleDelete = () => {
    if (taskId) {
      deleteTask(taskId);
      onOpenChange(false);
      resetForm();
    }
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
  
  const handleRemoveCustomCategory = (categoryId: string) => {
    setCustomCategories(prev => prev.filter(c => c.id !== categoryId));
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{taskId ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {taskId 
                ? 'Update the details of your existing task.' 
                : 'Add a new task to your project. Fill in the required information below.'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-1">
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
                  
                  {/* Custom categories */}
                  {customCategories.map(category => (
                    <div key={category.id} className="inline-flex items-center">
                      <Badge 
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0 ml-1"
                        onClick={() => handleRemoveCustomCategory(category.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Add custom category button and form */}
                  {showCustomCategory ? (
                    <div className="flex items-center gap-2 mt-2 w-full">
                      <Input 
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        placeholder="Category name"
                        className="flex-1"
                      />
                      <input 
                        type="color" 
                        value={customCategoryColor}
                        onChange={(e) => setCustomCategoryColor(e.target.value)}
                        className="h-8 w-8 p-0 cursor-pointer rounded-md"
                      />
                      <Button size="sm" onClick={handleAddCustomCategory}>Add</Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setShowCustomCategory(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowCustomCategory(true)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Custom Category
                    </Button>
                  )}
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

              {taskId && (
                <>
                  <Separator className="my-2" />
                  <div className="grid gap-2 text-sm">
                    {creatorInfo.name && creatorInfo.date && (
                      <div className="flex items-center text-muted-foreground">
                        <span>Created by {creatorInfo.name} on {format(creatorInfo.date, "PPP 'at' p")}</span>
                      </div>
                    )}
                    
                    {lastModifierInfo.name && lastModifierInfo.date && lastModifierInfo.action && (
                      <div className="flex items-center text-muted-foreground">
                        <span>Last {lastModifierInfo.action} by {lastModifierInfo.name} on {format(lastModifierInfo.date, "PPP 'at' p")}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter className="flex items-center justify-between pt-4">
            <div>
              {taskId && (
                <Button 
                  variant="destructive" 
                  onClick={() => setConfirmDelete(true)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                onOpenChange(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {taskId ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
