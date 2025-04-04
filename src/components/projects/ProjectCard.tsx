
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  PlusCircle, 
  FileCheck, 
  AlertTriangle,
  Trash2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: any;
  onAddUpdate: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
  onAddEvidence: () => void;
  formatCurrency: (amount: number) => string;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusBadgeColor: (status: string) => string;
  getCategoryBadgeColor: (category: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onAddUpdate, 
  onViewDetails, 
  onDelete,
  onAddEvidence,
  formatCurrency, 
  getStatusIcon, 
  getStatusBadgeColor,
  getCategoryBadgeColor
}) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{project.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={cn("ml-2", getStatusBadgeColor(project.status))}>
              <span className="flex items-center">
                {getStatusIcon(project.status)}
                <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
              </span>
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Start Date:</span>
            <span className="text-sm">{new Date(project.startDate).toLocaleDateString()}</span>
          </div>
          {project.endDate && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">End Date:</span>
              <span className="text-sm">{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium">Budget:</span>
            <span className="text-sm">{formatCurrency(project.budget)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Spent:</span>
            <span className="text-sm">{formatCurrency(project.spent)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Progress:</span>
              <span className="text-sm">{project.completionPercentage}%</span>
            </div>
            <Progress value={project.completionPercentage} />
          </div>
          <div className="flex justify-between items-center">
            <Badge className={cn("mt-1", getCategoryBadgeColor(project.category))}>
              {project.category}
            </Badge>
            {project.verified ? (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <FileCheck className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 flex items-center gap-1 border-amber-300">
                <AlertTriangle className="h-3 w-3" />
                Unverified
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          className="flex-1 h-9"
          onClick={onAddUpdate}
          title="Add Update"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="flex-1 h-9"
          onClick={onAddEvidence}
          title="Add Evidence"
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button 
          variant="default" 
          size="icon"
          className="flex-1 h-9"
          onClick={onViewDetails}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
