
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Church, GraduationCap, Heart, Trash2, Users, ChevronDown, ChevronUp, Download, CalendarRange } from "lucide-react";
import { Programme } from "@/types";
import { useState } from "react";

interface ProgrammeCardProps {
  programme: Programme;
  onEdit: () => void;
  onDelete: () => void;
  onAttendance: () => void;
  onExportToPDF?: (programmeId: string) => void;
  onExportToCalendar?: (programmeId: string) => void;
}

export const ProgrammeCard = ({ 
  programme, 
  onEdit,
  onDelete, 
  onAttendance,
  onExportToPDF,
  onExportToCalendar
}: ProgrammeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
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

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case 'ministry':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'counseling':
        return "bg-pink-100 text-pink-800 hover:bg-pink-200";
      case 'service':
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case 'training':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'outreach':
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-[360px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="truncate">{programme.name}</CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className={cn("ml-2", getTypeBadgeColor(programme.type || 'other'))}>
              <span className="flex items-center">
                {getTypeIcon(programme.type || 'other')}
                <span className="ml-1 capitalize">{programme.type || 'other'}</span>
              </span>
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{programme.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow overflow-hidden">
        <div className={cn("space-y-2", expanded ? "overflow-y-auto max-h-[180px] pr-2" : "")}>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Start Date:</span>
            <span className="text-sm">{format(new Date(programme.startDate), 'PPP')}</span>
          </div>
          {programme.endDate && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">End Date:</span>
              <span className="text-sm">{format(new Date(programme.endDate), 'PPP')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium">Location:</span>
            <span className="text-sm truncate max-w-[150px]">{programme.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Coordinator:</span>
            <span className="text-sm truncate max-w-[150px]">{programme.coordinator}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Attendance:</span>
            <span className="text-sm">{programme.currentAttendees} / {programme.capacity}</span>
          </div>
          
          {expanded && (
            <>
              {programme.recurring && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Frequency:</span>
                  <span className="text-sm capitalize">{programme.frequency || 'N/A'}</span>
                </div>
              )}
              <div>
                <span className="text-sm font-medium block mb-1">Description:</span>
                <p className="text-sm text-muted-foreground">{programme.description}</p>
              </div>
              {(onExportToPDF || onExportToCalendar) && (
                <div className="flex gap-2 mt-2">
                  {onExportToPDF && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportToPDF(programme.id);
                      }}
                      className="text-xs flex items-center"
                    >
                      <Download className="h-3 w-3 mr-1" /> PDF
                    </Button>
                  )}
                  {onExportToCalendar && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportToCalendar(programme.id);
                      }}
                      className="text-xs flex items-center"
                    >
                      <CalendarRange className="h-3 w-3 mr-1" /> Calendar
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2"
          onClick={toggleExpand}
        >
          {expanded ? (
            <span className="flex items-center">Show Less <ChevronUp className="h-4 w-4 ml-1" /></span>
          ) : (
            <span className="flex items-center">Show More <ChevronDown className="h-4 w-4 ml-1" /></span>
          )}
        </Button>
      </CardContent>
      <CardFooter className="pt-2 border-t mt-auto">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onAttendance();
          }}
        >
          Record Attendance
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgrammeCard;
