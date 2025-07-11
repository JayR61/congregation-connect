import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Users, Calculator, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModernAnimation } from '@/hooks/useModernAnimation';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'tasks' | 'members' | 'transactions' | 'documents' | 'programmes';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const navigate = useNavigate();
  const { ref, isVisible } = useModernAnimation();

  const configs = {
    tasks: {
      title: 'No Tasks Yet',
      description: 'Get started by creating your first task to organize your church activities.',
      icon: FileText,
      action: 'Create First Task',
      path: '/tasks'
    },
    members: {
      title: 'No Members Yet',
      description: 'Start building your church community by adding your first member.',
      icon: Users,
      action: 'Add First Member',
      path: '/members'
    },
    transactions: {
      title: 'No Financial Records',
      description: 'Begin tracking your church finances by recording your first transaction.',
      icon: Calculator,
      action: 'Add First Transaction',
      path: '/finance'
    },
    documents: {
      title: 'No Documents',
      description: 'Upload and organize important church documents and files.',
      icon: FolderOpen,
      action: 'Upload First Document',
      path: '/documents'
    },
    programmes: {
      title: 'No Programmes',
      description: 'Create your first church programme to start organizing activities.',
      icon: PlusCircle,
      action: 'Create First Programme',
      path: '/programmes'
    }
  };

  const config = configs[type];
  const IconComponent = config.icon;

  return (
    <Card 
      ref={ref}
      className={cn(
        'border-dashed border-2 border-muted-foreground/25 bg-gradient-to-br from-muted/30 to-background',
        'transition-all duration-500 ease-out',
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      )}
    >
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
          <IconComponent className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <CardTitle className="text-xl font-semibold text-muted-foreground">
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
          {config.description}
        </p>
        <Button 
          onClick={() => navigate(config.path)}
          className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-200"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {config.action}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;