import React, { useState } from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, Flag, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { format, isAfter, isBefore, isToday } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import TaskDialog from './TaskDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface TaskListProps {
  tasks: Task[];
  viewMode: 'grid' | 'list';
  onTaskClick: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, viewMode, onTaskClick }) => {
  const { members, deleteTask } = useAppContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleEditTask = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setEditingTask(task);
    setShowEditDialog(true);
  };

  const handleDeleteTask = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setTaskToDelete(task);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg bg-muted/30 text-center">
        <h3 className="text-xl font-medium mb-2">No tasks found</h3>
        <p className="text-muted-foreground mb-4">
          There are no tasks that match your criteria. Try adjusting your filters or create a new task.
        </p>
        <div className="flex items-center justify-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Your task list is empty</span>
        </div>
      </div>
    );
  }

  // Function to get creator name from task
  const getCreatorName = (task: Task) => {
    const creator = members.find(m => m.id === task.createdById);
    return creator ? `${creator.firstName} ${creator.lastName}` : 'Unknown';
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <Flag className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Flag className="h-4 w-4 text-orange-500" />;
      case 'low':
        return <Flag className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getDueDateInfo = (dueDate: Date | null) => {
    if (!dueDate) return { text: 'No due date', className: 'text-muted-foreground' };
    
    const now = new Date();
    
    if (isToday(dueDate)) {
      return { text: 'Due today', className: 'text-orange-500 font-medium' };
    } else if (isBefore(dueDate, now)) {
      return { text: `Overdue: ${format(dueDate, 'MMM d')}`, className: 'text-red-500 font-medium' };
    } else {
      return { text: `Due ${format(dueDate, 'MMM d')}`, className: 'text-muted-foreground' };
    }
  };

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onTaskClick(task.id)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{task.title}</CardTitle>
                <div className="flex items-center gap-1">
                  {getPriorityIcon(task.priority)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEditTask(e, task)}>
                        <Edit className="h-3 w-3 mr-2" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleDeleteTask(e, task)} className="text-red-600">
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                {task.dueDate && (
                  <div className="flex items-center text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className={getDueDateInfo(task.dueDate).className}>
                      {getDueDateInfo(task.dueDate).text}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-4 text-xs">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">By:</span>
                  <span>{getCreatorName(task)}</span>
                </div>
                
                <div className="flex -space-x-2">
                  {task.assigneeIds && task.assigneeIds.slice(0, 3).map((id) => {
                    const member = members.find(m => m.id === id);
                    return (
                      <Avatar key={id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={member?.avatar || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {member ? `${member.firstName[0]}${member.lastName[0]}` : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                  {task.assigneeIds && task.assigneeIds.length > 3 && (
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-[10px] bg-muted">
                        +{task.assigneeIds.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {editingTask && (
          <TaskDialog 
            open={showEditDialog} 
            onOpenChange={setShowEditDialog}
            defaultValues={editingTask}
            editMode={true}
            taskId={editingTask.id}
          />
        )}
        
        <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className="flex items-center border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onTaskClick(task.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{task.title}</h3>
              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
              {getPriorityIcon(task.priority)}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{task.description}</p>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Created by {getCreatorName(task)}</span>
              <span className="mx-2">•</span>
              
              {task.categories && task.categories.length > 0 && (
                <div className="flex items-center gap-1 mr-2">
                  {task.categories.slice(0, 2).map(category => (
                    <Badge 
                      key={category.id} 
                      variant="outline"
                      className="text-[10px] px-1 h-4"
                      style={{ borderColor: category.color, color: category.color }}
                    >
                      {category.name}
                    </Badge>
                  ))}
                  {task.categories.length > 2 && (
                    <span className="text-xs">+{task.categories.length - 2}</span>
                  )}
                </div>
              )}
              
              {task.dueDate && (
                <div className="flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span className={getDueDateInfo(task.dueDate).className}>
                    {getDueDateInfo(task.dueDate).text}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <div className="flex -space-x-2">
              {task.assigneeIds && task.assigneeIds.slice(0, 3).map((id) => {
                const member = members.find(m => m.id === id);
                return (
                  <Avatar key={id} className="h-7 w-7 border-2 border-background">
                    <AvatarImage src={member?.avatar || undefined} />
                    <AvatarFallback>
                      {member ? `${member.firstName[0]}${member.lastName[0]}` : 'U'}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              {task.assigneeIds && task.assigneeIds.length > 3 && (
                <Avatar className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className="bg-muted">
                    +{task.assigneeIds.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => handleEditTask(e, task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleDeleteTask(e, task)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      
      {editingTask && (
        <TaskDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) {
              setEditingTask(null);
            }
          }}
          editMode={true}
          taskId={editingTask?.id}
          defaultValues={editingTask}
        />
      )}
      
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskList;
