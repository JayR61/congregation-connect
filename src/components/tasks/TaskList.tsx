
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskCategory } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, Circle, CheckSquare, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '@/context/AppContext';

interface TaskListProps {
  tasks: Task[];
  viewMode: 'grid' | 'list';
}

const TaskList: React.FC<TaskListProps> = ({ tasks, viewMode }) => {
  const navigate = useNavigate();
  const { members } = useAppContext();

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
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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
    <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
      {tasks.map(task => (
        <Card key={task.id} className="card-hover cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
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
                </div>
              </CardContent>
              <CardFooter className="pt-2">
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
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
