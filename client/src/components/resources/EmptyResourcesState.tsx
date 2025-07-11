import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Archive, Calendar, Image, BarChart, Settings, Users, QrCode, Download } from "lucide-react";

interface EmptyResourcesStateProps {
  onAddResource: () => void;
  onBookResource: () => void;
  currentView: string;
}

export const EmptyResourcesState = ({ onAddResource, onBookResource, currentView }: EmptyResourcesStateProps) => {
  const getEmptyStateContent = () => {
    switch (currentView) {
      case 'grid':
        return {
          icon: <Archive className="h-12 w-12 text-muted-foreground" />,
          title: "No Resources Yet",
          description: "Start by adding your first church resource to track and manage your inventory.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: null
        };
      
      case 'calendar':
        return {
          icon: <Calendar className="h-12 w-12 text-muted-foreground" />,
          title: "No Resource Bookings",
          description: "Your resource calendar is empty. Add resources first, then create bookings.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: { label: "Book Resource", onClick: onBookResource, icon: <Calendar className="h-4 w-4" /> }
        };
      
      case 'stats':
        return {
          icon: <BarChart className="h-12 w-12 text-muted-foreground" />,
          title: "No Usage Statistics",
          description: "Resource usage statistics will appear here once you add resources and track their usage.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: null
        };
      
      case 'gallery':
        return {
          icon: <Image className="h-12 w-12 text-muted-foreground" />,
          title: "No Resource Images",
          description: "Upload photos of your resources to create a visual inventory gallery.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: null
        };
      
      case 'health':
        return {
          icon: <Settings className="h-12 w-12 text-muted-foreground" />,
          title: "No Health Monitoring",
          description: "Track resource condition and maintenance schedules to keep everything in good shape.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: null
        };
      
      case 'attendance':
        return {
          icon: <Users className="h-12 w-12 text-muted-foreground" />,
          title: "No Attendance Records",
          description: "Resource usage and attendance tracking will appear here once you have active bookings.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: { label: "Book Resource", onClick: onBookResource, icon: <Calendar className="h-4 w-4" /> }
        };
      
      case 'categories':
        return {
          icon: <Archive className="h-12 w-12 text-muted-foreground" />,
          title: "No Resource Categories",
          description: "Organize your resources by creating categories like 'Equipment', 'Rooms', or 'Vehicles'.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: null
        };
      
      case 'checkin':
        return {
          icon: <QrCode className="h-12 w-12 text-muted-foreground" />,
          title: "No Check-in System",
          description: "Set up QR code check-in for easy resource access tracking.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: null
        };
      
      case 'approval':
        return {
          icon: <Settings className="h-12 w-12 text-muted-foreground" />,
          title: "No Pending Approvals",
          description: "Resource booking requests will appear here for approval.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: { label: "Book Resource", onClick: onBookResource, icon: <Calendar className="h-4 w-4" /> }
        };
      
      case 'reports':
        return {
          icon: <Download className="h-12 w-12 text-muted-foreground" />,
          title: "No Reports Available",
          description: "Generate detailed reports on resource usage, maintenance, and inventory once you have data.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: null
        };
      
      default:
        return {
          icon: <Archive className="h-12 w-12 text-muted-foreground" />,
          title: "No Resources Yet",
          description: "Start by adding your first church resource to track and manage your inventory.",
          primaryAction: { label: "Add Resource", onClick: onAddResource, icon: <Plus className="h-4 w-4" /> },
          secondaryAction: null
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {content.icon}
          </div>
          <CardTitle className="text-xl">{content.title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {content.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={content.primaryAction.onClick}
              className="w-full"
            >
              {content.primaryAction.icon}
              {content.primaryAction.label}
            </Button>
            {content.secondaryAction && (
              <Button 
                variant="outline" 
                onClick={content.secondaryAction.onClick}
                className="w-full"
              >
                {content.secondaryAction.icon}
                {content.secondaryAction.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};