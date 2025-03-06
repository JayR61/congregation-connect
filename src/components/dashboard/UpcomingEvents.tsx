
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { CalendarRange, Clock, Users } from 'lucide-react';

const UpcomingEvents = () => {
  const { tasks } = useAppContext();
  const today = new Date();
  
  // Filter tasks that are due in the next 7 days and not completed
  const upcomingTasks = tasks
    .filter(task => 
      task.dueDate && 
      task.status !== 'completed' &&
      (new Date(task.dueDate) > today) &&
      ((new Date(task.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 7)
    )
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);
  
  const formatDueDate = (dueDate: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return dueDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-4">
      {upcomingTasks.length > 0 ? (
        upcomingTasks.map(task => (
          <div key={task.id} className="flex items-start space-x-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              new Date(task.dueDate!).toDateString() === new Date().toDateString() 
                ? 'bg-orange-100 text-orange-600'
                : 'bg-primary/10'
            }`}>
              <CalendarRange className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{task.title}</p>
              <div className="flex items-center space-x-2 text-xs">
                <span className="flex items-center text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDueDate(new Date(task.dueDate!))}
                </span>
                {task.assigneeIds.length > 0 && (
                  <span className="flex items-center text-muted-foreground">
                    <Users className="mr-1 h-3 w-3" />
                    {task.assigneeIds.length} {task.assigneeIds.length === 1 ? 'assignee' : 'assignees'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No upcoming events in the next 7 days
        </div>
      )}
    </div>
  );
};

export { UpcomingEvents };
