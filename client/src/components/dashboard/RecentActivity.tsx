
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { CheckSquare, DollarSign, FileText, UserPlus, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const RecentActivity = () => {
  const { tasks, transactions, documents, members } = useAppContext();

  // Get recent activities by combining and sorting tasks, transactions, and documents
  const getActivities = () => {
    const taskActivities = tasks.map(task => ({
      id: task.id,
      type: 'task',
      title: task.title,
      status: task.status,
      date: task.updatedAt,
      icon: <CheckSquare className="h-4 w-4" />,
      description: `Task "${task.title}" was ${task.status}`
    }));

    const transactionActivities = transactions.map(transaction => ({
      id: transaction.id,
      type: 'transaction',
      title: transaction.description,
      amount: transaction.amount,
      transactionType: transaction.type,
      date: transaction.date || new Date(), // Use date instead of createdAt
      icon: <DollarSign className="h-4 w-4" />,
      description: `${transaction.type === 'income' ? 'Received' : 'Spent'} R${transaction.amount} for ${transaction.description}`
    }));

    const documentActivities = documents
      .filter(document => !document.name.toLowerCase().includes('template'))
      .map(document => ({
        id: document.id,
        type: 'document',
        title: document.name, // Use name instead of title
        date: document.createdAt,
        icon: <FileText className="h-4 w-4" />,
        description: `Document "${document.name}" was uploaded`
      }));

    // Handle task comments safely
    const commentActivities = tasks
      .filter(task => task.comments && Array.isArray(task.comments))
      .flatMap(task => 
        task.comments!.map(comment => ({
          id: comment.id,
          type: 'comment',
          taskId: task.id,
          taskTitle: task.title,
          content: comment.content,
          date: comment.createdAt,
          icon: <MessageSquare className="h-4 w-4" />,
          description: `New comment on task "${task.title}"`
        }))
      );

    // Combine all activities
    const allActivities = [
      ...taskActivities,
      ...transactionActivities,
      ...documentActivities,
      ...commentActivities
    ];

    // Sort by date (most recent first)
    return allActivities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);
  };

  const activities = getActivities();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4 p-1">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={`${activity.id}-${index}`} className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                {activity.icon}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No recent activity
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default RecentActivity;
