
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/lib/toast';
import { Member, Programme, BulkAttendanceRecord } from '@/types';

interface BulkAttendanceRecorderProps {
  programmeId: string;
  onSaveComplete?: () => void;
}

const BulkAttendanceRecorder = ({ programmeId, onSaveComplete }: BulkAttendanceRecorderProps) => {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [attendanceData, setAttendanceData] = useState<Map<string, boolean>>(new Map());
  const [loading, setLoading] = useState(false);
  
  // In a real app, this would come from context or API
  useEffect(() => {
    // Mock data fetching
    const fetchData = () => {
      // This would be replaced with actual data fetching
      setMembers([]); // Mock members
      setProgramme(null); // Mock programme
    };
    
    fetchData();
  }, [programmeId]);
  
  const handleToggleAttendance = (memberId: string, isPresent: boolean) => {
    setAttendanceData(prev => {
      const newMap = new Map(prev);
      newMap.set(memberId, isPresent);
      return newMap;
    });
  };
  
  const handleMarkAllAs = (status: boolean) => {
    const newAttendanceData = new Map();
    members.forEach(member => {
      newAttendanceData.set(member.id, status);
    });
    setAttendanceData(newAttendanceData);
  };
  
  const handleSave = () => {
    setLoading(true);
    
    try {
      // Convert Map to array of objects
      const records = Array.from(attendanceData).map(([memberId, isPresent]) => ({
        memberId,
        isPresent
      }));
      
      if (records.length === 0) {
        throw new Error("No attendance records to save");
      }
      
      // This would be an API call or context function call in a real app
      console.log("Saving attendance:", {
        programmeId,
        records
      });
      
      // Mock successful save
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
        toast({
          title: "Attendance recorded",
          description: `Attendance for ${records.length} members has been recorded.`
        });
        
        if (onSaveComplete) {
          onSaveComplete();
        }
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error recording attendance",
        description: "There was a problem saving the attendance records.",
        variant: "destructive" 
      });
    }
  };
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Record Attendance</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Record Attendance</DialogTitle>
            <DialogDescription>
              {programme ? `Record attendance for ${programme.name}` : 'Select members who attended the programme'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="space-x-2">
                <Button variant="outline" onClick={() => handleMarkAllAs(true)} size="sm">
                  Mark All Present
                </Button>
                <Button variant="outline" onClick={() => handleMarkAllAs(false)} size="sm">
                  Mark All Absent
                </Button>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">
                  {Array.from(attendanceData.values()).filter(v => v).length} of {members.length} present
                </span>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_100px] bg-muted px-4 py-2 font-medium">
                <div>Name</div>
                <div>Contact</div>
                <div className="text-center">Present</div>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {members.length === 0 && (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No members to display
                  </div>
                )}
                
                {members.map((member, index) => (
                  <React.Fragment key={member.id}>
                    {index > 0 && <Separator />}
                    <div className="grid grid-cols-[1fr_1fr_100px] px-4 py-3 items-center">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">
                          {member.firstName} {member.lastName}
                        </div>
                      </div>
                      <div className="text-muted-foreground">
                        {member.email}
                      </div>
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={attendanceData.get(member.id) || false}
                          onCheckedChange={(checked) => handleToggleAttendance(member.id, !!checked)}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading || attendanceData.size === 0}>
              {loading ? 'Saving...' : 'Save Attendance'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkAttendanceRecorder;
