
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Programme, ProgrammeAttendance, Member } from "@/types";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { useState } from "react";

interface AttendanceReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programmes: Programme[];
  attendance: ProgrammeAttendance[];
  members: Member[];
}

export const AttendanceReportDialog = ({ 
  open, 
  onOpenChange, 
  programmes, 
  attendance, 
  members 
}: AttendanceReportDialogProps) => {
  const [selectedProgramme, setSelectedProgramme] = useState<string>("");
  
  const filteredAttendance = selectedProgramme
    ? attendance.filter(a => a.programmeId === selectedProgramme)
    : [];
  
  // Group attendance by date
  const attendanceByDate = filteredAttendance.reduce((acc, record) => {
    const dateStr = format(record.date, 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(record);
    return acc;
  }, {} as Record<string, ProgrammeAttendance[]>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(attendanceByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
  };

  const exportToCSV = () => {
    if (!selectedProgramme) return;
    
    const programme = programmes.find(p => p.id === selectedProgramme);
    if (!programme) return;
    
    let csvContent = "Date,Member,Status,Notes\n";
    
    filteredAttendance.forEach(record => {
      const memberName = getMemberName(record.memberId);
      const date = format(record.date, 'yyyy-MM-dd');
      const status = record.isPresent ? "Present" : "Absent";
      const notes = record.notes || "";
      
      csvContent += `"${date}","${memberName}","${status}","${notes}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${programme.name}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Attendance Report</DialogTitle>
          <DialogDescription>
            View and export attendance records for programmes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center my-4">
          <Select value={selectedProgramme} onValueChange={setSelectedProgramme}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a programme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programmes</SelectItem>
              {programmes.map(programme => (
                <SelectItem key={programme.id} value={programme.id}>
                  {programme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            disabled={!selectedProgramme || filteredAttendance.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
        
        {selectedProgramme && filteredAttendance.length > 0 ? (
          <div className="mt-4 max-h-[500px] overflow-auto">
            {sortedDates.map(dateStr => (
              <div key={dateStr} className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  {format(new Date(dateStr), 'PPPP')}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceByDate[dateStr].map(record => (
                      <TableRow key={record.id}>
                        <TableCell>{getMemberName(record.memberId)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${record.isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {record.isPresent ? 'Present' : 'Absent'}
                          </span>
                        </TableCell>
                        <TableCell>{record.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        ) : selectedProgramme ? (
          <div className="py-8 text-center text-muted-foreground">
            No attendance records found for this programme.
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Select a programme to view attendance records.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
