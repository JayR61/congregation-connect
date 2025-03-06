
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { useAppContext } from "@/context/AppContext";
import { CheckCircle, AlertCircle, Clock, FileText, DollarSign } from "lucide-react";

type ActivityType = "task" | "finance" | "document" | "member";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  date: Date;
  icon?: React.ReactNode;
}

const RecentActivity: React.FC = () => {
  const { tasks, transactions, documents } = useAppContext();
  
  // Create a list of recent activities from different sources
  const generateActivities = (): Activity[] => {
    const taskActivities = tasks
      .slice(0, 3)
      .map(task => ({
        id: `task-${task.id}`,
        type: "task" as ActivityType,
        title: `Task ${task.status === "completed" ? "Completed" : "Updated"}`,
        description: task.title,
        date: task.updatedAt,
        icon: task.status === "completed" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-amber-500" />
      }));
      
    const transactionActivities = transactions
      .slice(0, 3)
      .map(transaction => ({
        id: `transaction-${transaction.id}`,
        type: "finance" as ActivityType,
        title: `${transaction.type === "income" ? "Income" : "Expense"} Recorded`,
        description: transaction.description,
        date: transaction.createdAt,
        icon: <DollarSign className="h-4 w-4 text-primary" />
      }));
      
    const documentActivities = documents
      .slice(0, 2)
      .map(document => ({
        id: `document-${document.id}`,
        type: "document" as ActivityType,
        title: "Document Uploaded",
        description: document.name,
        date: document.createdAt,
        icon: <FileText className="h-4 w-4 text-blue-500" />
      }));
      
    // Combine all activities, sort by date (newest first) and take the 5 most recent
    return [...taskActivities, ...transactionActivities, ...documentActivities]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  };
  
  const activities = generateActivities();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No recent activity
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="mt-1">
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistance(new Date(activity.date), new Date(), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
