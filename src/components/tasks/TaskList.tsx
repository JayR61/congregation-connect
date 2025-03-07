
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskCategory } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, Circle, CheckSquare, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { TaskDialog } from './TaskDialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskListProps {
  tasks: Task[];
  viewMode: 'grid' | 'list';
  onTaskClick?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, viewMode, onTaskClick }) => {
  const navigate = useNavigate();
  const { members, deleteTask } = useAppContext();
  const [editTaskId, setEditTaskId] = React.useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'pending':
        return <Circle className="h-4 w-4 text-indigo-500" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const formatDueDate = (date: Date | null) => {
    if (!date) return 'No due date';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isOverdue = dueDate < today;
    const isToday = dueDate.getTime() === today.getTime();
    const isTomorrow = dueDate.getTime() === tomorrow.getTime();
    
    let formattedDate = format(date, 'MMM d, yyyy');
    
    if (isToday) formattedDate = 'Today';
    if (isTomorrow) formattedDate = 'Tomorrow';
    
    return (
      <span className={`flex items-center ${isOverdue && 'text-red-500'}`}>
        {isOverdue && <AlertTriangle className="h-3 w-3 mr-1" />}
        {formattedDate}
      </span>
    );
  };

  const getInitials = (name: string) => {
    if (typeof name !== 'string') return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleCardClick = (e: React.MouseEvent, taskId: string) => {
    // This prevents navigation when clicking on action buttons
    if ((e.target as HTMLElement).closest('.task-actions')) {
      return;
    }
    
    if (onTaskClick) {
      onTaskClick(taskId);
    } else {
      navigate(`/tasks/${taskId}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setEditTaskId(taskId);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setTaskToDelete(taskId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const getCreatorName = (createdById: string) => {
    const creator = members.find(m => m.id === createdById);
    return creator ? `${creator.firstName} ${creator.lastName}` : 'Unknown';
  };

  const emptyState = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Tasks Found</h3>
      <p className="text-muted-foreground mb-4">There are no tasks matching your current filters. Try adjusting your filters or create a new task.</p>
    </div>
  );

  if (tasks.length === 0) return emptyState;

  return (
    <>
      <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {tasks.map(task => (
          <Card key={task.id} className="card-hover cursor-pointer" onClick={(e) => handleCardClick(e, task.id)}>
            {viewMode === 'grid' ? (
              <>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold line-clamp-1">{task.title}</CardTitle>
                    {getStatusIcon(task.status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {task.categories.map(category => (
                      <Badge key={category.id} style={{ backgroundColor: category.color, color: 'white' }}>
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatDueDate(task.dueDate)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Created by {getCreatorName(task.createdById)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <div className="flex -space-x-2">
                    {task.assigneeIds.slice(0, 3).map((assigneeId) => {
                      const member = members.find(m => m.id === assigneeId);
                      return (
                        <Avatar key={assigneeId} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={member?.avatar || undefined} alt={member?.firstName} />
                          <AvatarFallback>
                            {getInitials(`${member?.firstName || ''} ${member?.lastName || ''}`)}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {task.assigneeIds.length > 3 && (
                      <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarFallback>+{task.assigneeIds.length - 3}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="task-actions flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={(e) => handleEditClick(e, task.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive" 
                      onClick={(e) => handleDeleteClick(e, task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex p-4">
                <div className="mr-4 mt-0.5">
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{task.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{task.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {task.categories.map(category => (
                      <Badge key={category.id} style={{ backgroundColor: category.color, color: 'white' }}>
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>Created by {getCreatorName(task.createdById)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between ml-4">
                  <div className="text-sm flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {formatDueDate(task.dueDate)}
                  </div>
                  <div className="flex -space-x-2 mt-2">
                    {task.assigneeIds.slice(0, 2).map((assigneeId) => {
                      const member = members.find(m => m.id === assigneeId);
                      return (
                        <Avatar key={assigneeId} className="h-7 w-7 border-2 border-background">
                          <AvatarImage src={member?.avatar || undefined} alt={member?.firstName} />
                          <AvatarFallback>
                            {getInitials(`${member?.firstName || ''} ${member?.lastName || ''}`)}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {task.assigneeIds.length > 2 && (
                      <Avatar className="h-7 w-7 border-2 border-background">
                        <AvatarFallback>+{task.assigneeIds.length - 2}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
                <div className="task-actions flex flex-col space-y-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={(e) => handleEditClick(e, task.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive" 
                    onClick={(e) => handleDeleteClick(e, task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Edit Task Dialog */}
      <TaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        taskId={editTaskId || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskList;
