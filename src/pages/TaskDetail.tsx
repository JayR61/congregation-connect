
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/data/mockData";

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', id],
    queryFn: () => {
      const tasks = getTasks();
      return tasks.find(task => task.id === id) || null;
    }
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/tasks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
            </Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/tasks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium">Task not found</h3>
              <p className="text-muted-foreground mt-2">
                The task you're looking for doesn't exist or has been removed.
              </p>
              <Button className="mt-4" asChild>
                <Link to="/tasks">View All Tasks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/tasks">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-muted-foreground">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">Status</div>
              <div className="flex items-center">
                {getStatusIcon(task.status)}
                <span className="ml-2">{task.status}</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">Priority</div>
              <div className="flex items-center">
                <Flag className={`h-5 w-5 ${getPriorityColor(task.priority)}`} />
                <span className="ml-2">{task.priority}</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">Due Date</div>
              <div className="flex items-center">
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Assigned To</h3>
            <div className="flex flex-wrap gap-2">
              {task.assignees?.map((assignee) => (
                <div key={assignee.id} className="flex items-center space-x-2 border rounded-full px-3 py-1">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {assignee.name.charAt(0)}
                  </div>
                  <span>{assignee.name}</span>
                </div>
              ))}
            </div>
          </div>

          {task.categories?.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {task.categories.map((category) => (
                  <span key={category} className="bg-muted px-2 py-1 rounded text-sm">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;
