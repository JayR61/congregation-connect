
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/lib/toast';
import { Member, Programme, ProgrammeAttendance } from '@/types';
import { useAppContext } from '@/context/AppContext';

interface BulkAttendanceRecorderProps {
  programmeId: string;
  onSaveComplete?: () => void;
}

const BulkAttendanceRecorder = ({ programmeId, onSaveComplete }: BulkAttendanceRecorderProps) => {
  const { members, programmes, recordBulkAttendance } = useAppContext();
  const [open, setOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Map<string, boolean>>(new Map());
  const [loading, setLoading] = useState(false);
  
  const programme = programmes.find(p => p.id === programmeId);
  const availableMembers = members || [];
  
  const handleToggleAttendance = (memberId: string, isPresent: boolean) => {
    setAttendanceData(prev => {
      const newMap = new Map(prev);
      newMap.set(memberId, isPresent);
      return newMap;
    });
  };
  
  const handleMarkAllAs = (status: boolean) => {
    const newAttendanceData = new Map();
    availableMembers.forEach(member => {
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
      
      // Call the context function
      recordBulkAttendance(programmeId, records);
      
      setLoading(false);
      setOpen(false);
      toast("Attendance recorded", "Attendance for " + records.length + " members has been recorded.");
      
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      setLoading(false);
      toast("Error recording attendance", "There was a problem saving the attendance records.", "destructive");
    }
  };
  
  return (
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
            {Array.from(attendanceData.values()).filter(v => v).length} of {availableMembers.length} present
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
          {availableMembers.length === 0 && (
            <div className="px-4 py-8 text-center text-muted-foreground">
              No members to display
            </div>
          )}
          
          {availableMembers.map((member, index) => (
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
      
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSave} disabled={loading || attendanceData.size === 0}>
          {loading ? 'Saving...' : 'Save Attendance'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default BulkAttendanceRecorder;
