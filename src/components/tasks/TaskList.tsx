
import React from "react";
import { Task } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckSquare, Clock, AlertCircle, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { useAppContext } from "@/context/AppContext";

interface TaskListProps {
  tasks: Task[];
  isGrid?: boolean;
  onTaskClick: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isGrid = true, onTaskClick }) => {
  const { members } = useAppContext();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-amber-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getAssignees = (assigneeIds: string[]) => {
    return assigneeIds.map(id => {
      const member = members.find(m => m.id === id);
      return member ? {
        name: `${member.firstName} ${member.lastName}`,
        avatar: member.avatar
      } : {
        name: "Unknown",
        avatar: null
      };
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No tasks found</h3>
        <p className="text-muted-foreground mt-2">
          Create a new task to get started or adjust your filters.
        </p>
      </div>
    );
  }

  if (isGrid) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card 
            key={task.id} 
            className="overflow-hidden hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
            onClick={() => onTaskClick(task)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {getStatusIcon(task.status)}
                  <Badge variant="outline" className="ml-2">
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Badge>
                </div>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
              </div>
              
              <h3 className="font-medium text-lg mt-3">{task.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {task.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {task.categories.map((category) => (
                  <Badge 
                    key={category.id} 
                    style={{ backgroundColor: category.color, color: 'white' }}
                    className="font-normal"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="p-5 pt-0 flex items-center justify-between">
              <div className="flex -space-x-2">
                {getAssignees(task.assigneeIds).slice(0, 3).map((assignee, index) => (
                  <Avatar key={index} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={assignee.avatar || ""} alt={assignee.name} />
                    <AvatarFallback>
                      {assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assigneeIds.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                    +{task.assigneeIds.length - 3}
                  </div>
                )}
              </div>
              
              {task.dueDate && (
                <div className="flex items-center text-muted-foreground text-xs">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="flex items-center p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
          onClick={() => onTaskClick(task)}
        >
          <div className="mr-3">
            {getStatusIcon(task.status)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{task.title}</h4>
            <div className="flex items-center mt-1">
              <div className="flex -space-x-2 mr-2">
                {getAssignees(task.assigneeIds).slice(0, 2).map((assignee, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={assignee.avatar || ""} alt={assignee.name} />
                    <AvatarFallback className="text-[10px]">
                      {assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assigneeIds.length > 2 && (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background">
                    +{task.assigneeIds.length - 2}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {task.categories.slice(0, 2).map((category) => (
                  <Badge 
                    key={category.id} 
                    variant="outline"
                    className="font-normal text-xs py-0 h-5"
                  >
                    {category.name}
                  </Badge>
                ))}
                {task.categories.length > 2 && (
                  <Badge variant="outline" className="font-normal text-xs py-0 h-5">
                    +{task.categories.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(task.priority) + " text-xs"}>
              {task.priority.charAt(0).toUpperCase()}
            </Badge>
            
            {task.dueDate && (
              <div className="text-muted-foreground text-xs whitespace-nowrap">
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
