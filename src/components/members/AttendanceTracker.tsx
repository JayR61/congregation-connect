
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AttendanceRecord, Member } from '@/types';
import { Calendar, Check, Save, Plus, CalendarDays } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useAppContext } from '@/context/AppContext';

interface AttendanceTrackerProps {
  member: Member;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ member }) => {
  const { updateMember } = useAppContext();
  const [newEvent, setNewEvent] = useState({
    eventId: `event-${Date.now()}`,
    description: '',
    date: new Date().toISOString().split('T')[0],
    isPresent: true,
    notes: '',
  });
  
  const handleRecordAttendance = () => {
    if (!newEvent.description) {
      toast.error("Please enter event description");
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `attendance-${Date.now()}`,
      memberId: member.id,
      date: new Date(newEvent.date),
      isPresent: newEvent.isPresent,
      notes: newEvent.notes || `Event: ${newEvent.description}`,
      eventId: newEvent.eventId,
      createdAt: new Date()
    };

    const updatedAttendance = [...(member.attendance || []), newRecord];
    
    updateMember(member.id, {
      attendance: updatedAttendance
    });
    
    // Reset form
    setNewEvent({
      eventId: `event-${Date.now()}`,
      description: '',
      date: new Date().toISOString().split('T')[0],
      isPresent: true,
      notes: '',
    });
    
    toast.success("Attendance recorded successfully");
  };

  const getEventDescription = (eventId: string) => {
    // This would typically come from a database of events
    // For now, we'll extract it from the member's attendance records
    const record = member.attendance?.find(a => {
      if ('eventId' in a) {
        return a.eventId === eventId;
      }
      return false;
    });
    
    if (record && record.notes && record.notes.includes('Event:')) {
      return record.notes.split('Event:')[1].trim();
    }
    return 'Unnamed Event';
  };

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Tracking</CardTitle>
        <CardDescription>Record and manage member attendance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
          <div className="space-y-2">
            <Label htmlFor="eventDescription">Event Description</Label>
            <Input
              id="eventDescription"
              placeholder="Sunday Service, Youth Meeting, etc."
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventDate">Date</Label>
            <Input
              id="eventDate"
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attendance">Attendance</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="attendance"
                checked={newEvent.isPresent}
                onCheckedChange={(checked) => 
                  setNewEvent({...newEvent, isPresent: checked === true})
                }
              />
              <label
                htmlFor="attendance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Present
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventNotes">Notes</Label>
            <Input
              id="eventNotes"
              placeholder="Additional notes"
              value={newEvent.notes}
              onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
            />
          </div>
        </div>
        
        <Button onClick={handleRecordAttendance} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Record Attendance
        </Button>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Attendance History</h3>
          {member.attendance && member.attendance.length > 0 ? (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {[...member.attendance]
                  .sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return dateB - dateA;
                  })
                  .map((record) => (
                    <div key={record.id || `record-${Math.random()}`} className="flex items-center p-2 border rounded-md">
                      <div className={`h-2 w-2 rounded-full mr-3 ${
                        record.isPresent ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm font-medium">{formatDate(record.date)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Event: {record.notes ? String(record.notes).substring(0, 30) : 
                            ('eventId' in record ? getEventDescription(record.eventId as string) : 'Unnamed Event')}
                          {record.isPresent && (
                            <Check className="inline-block h-3 w-3 ml-1 text-green-500" />
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-6 border rounded-md">
              <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium">No Attendance Records</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start tracking this member's attendance by adding a record above.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;
