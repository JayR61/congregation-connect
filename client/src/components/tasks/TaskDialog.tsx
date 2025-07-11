import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: any;
  editMode?: boolean;
  taskId?: string;
}

export function TaskDialog({ open, onOpenChange, defaultValues, editMode = false, taskId }: TaskDialogProps) {
  const { addTask, updateTask, currentUser, taskCategories, members } = useAppContext();
  const [title, setTitle] = useState(defaultValues?.title || '');
  const [description, setDescription] = useState(defaultValues?.description || '');
  const [status, setStatus] = useState(defaultValues?.status || 'pending');
  const [priority, setPriority] = useState(defaultValues?.priority || 'medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(defaultValues?.dueDate ? new Date(defaultValues.dueDate) : undefined);
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId || '');
  const [assigneeId, setAssigneeId] = useState(defaultValues?.assigneeId || '');
  const [assigneeIds, setAssigneeIds] = useState<string[]>(defaultValues?.assigneeIds || []);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(defaultValues?.estimatedTime || '');
  const [dateOpen, setDateOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return; // Prevent submission if title is empty
    }
    
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      categoryId,
      assigneeId,
      assigneeIds: (assigneeId && assigneeId !== 'unassigned') ? [assigneeId] : [],
      categories: [
        taskCategories.find(cat => cat.id === categoryId) || taskCategories[0]
      ],
      estimatedTime,
      lastModifiedById: currentUser.id,
      lastModifiedAction: editMode ? 'updated' : 'created'
    };
    
    if (editMode && taskId) {
      // Update existing task
      updateTask(taskId, taskData);
    } else {
      // Create new task
      const fixedTask = fixTaskCreation(taskData, currentUser.id);
      addTask(fixedTask);
    }
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setPriority('medium');
    setDueDate(undefined);
    setCategoryId('');
    setAssigneeId('');
    setAssigneeIds([]);
    setEstimatedTime('');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {editMode ? 'Update task details and assignments.' : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>
        <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
          <ScrollArea className="max-h-[70vh] pr-6">
            <div className="space-y-4">
              <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date);
                      setDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
              <Input
                id="estimatedTime"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="e.g. 2.5"
                type="number"
                min="0"
                step="0.5"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {taskCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Multiple Assignees Section */}
          <div className="space-y-2">
            <Label>Team Assignment</Label>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => (
                <Badge
                  key={member.id}
                  variant={assigneeIds.includes(member.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setAssigneeIds(prev => 
                      prev.includes(member.id) 
                        ? prev.filter(id => id !== member.id)
                        : [...prev, member.id]
                    );
                  }}
                >
                  {member.firstName} {member.lastName}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Click to assign/unassign team members. Individual assignee above takes priority.
            </p>
          </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editMode ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Just adding the createdBy field to the task creation to fix TS2345 error
export const fixTaskCreation = (task: any, currentUserId: string) => {
  return {
    ...task,
    createdBy: currentUserId
  };
};

export default TaskDialog;
