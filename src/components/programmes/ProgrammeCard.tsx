
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Church, GraduationCap, Heart, Trash2, Users } from "lucide-react";
import { Programme } from "@/types";

interface ProgrammeCardProps {
  programme: Programme;
  onDeleteConfirm: (id: string) => void;
  onAttendanceClick: (id: string) => void;
  getTypeBadgeColor: (type: string) => string;
}

export const ProgrammeCard = ({ 
  programme, 
  onDeleteConfirm, 
  onAttendanceClick,
  getTypeBadgeColor
}: ProgrammeCardProps) => {
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'ministry':
        return <Church className="h-4 w-4" />;
      case 'counseling':
        return <Heart className="h-4 w-4" />;
      case 'service':
        return <Church className="h-4 w-4" />;
      case 'training':
        return <GraduationCap className="h-4 w-4" />;
      case 'outreach':
        return <Users className="h-4 w-4" />;
      default:
        return <Church className="h-4 w-4" />;
    }
  };

  const confirmDeleteProgramme = (programmeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{programme.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={cn("ml-2", getTypeBadgeColor(programme.type))}>
              <span className="flex items-center">
                {getTypeIcon(programme.type)}
                <span className="ml-1 capitalize">{programme.type}</span>
              </span>
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={(e) => confirmDeleteProgramme(programme.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the "{programme.name}" programme and all associated attendance records. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteConfirm(programme.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardDescription>{programme.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Start Date:</span>
            <span className="text-sm">{format(programme.startDate, 'PPP')}</span>
          </div>
          {programme.endDate && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">End Date:</span>
              <span className="text-sm">{format(programme.endDate, 'PPP')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium">Location:</span>
            <span className="text-sm">{programme.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Coordinator:</span>
            <span className="text-sm">{programme.coordinator}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Attendance:</span>
            <span className="text-sm">{programme.currentAttendees} / {programme.capacity}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onAttendanceClick(programme.id)}
        >
          {programme.endDate && programme.endDate < new Date() ? "View Attendance" : "Record Attendance"}
        </Button>
      </CardFooter>
    </Card>
  );
};
