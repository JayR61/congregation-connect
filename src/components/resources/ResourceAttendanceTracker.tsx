
import React, { useState } from 'react';
import { ChurchResource, ResourceBooking, AttendanceRecord, Member } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/lib/toast';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export interface ResourceAttendanceTrackerProps {
  resources: ChurchResource[];
  bookings: ResourceBooking[];
  attendance: AttendanceRecord[];
  members: Member[];
  onRecordAttendance?: (data: Partial<AttendanceRecord>) => void;
}

const ResourceAttendanceTracker: React.FC<ResourceAttendanceTrackerProps> = ({
  resources,
  bookings,
  attendance,
  members,
  onRecordAttendance = () => {}
}) => {
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Get today's bookings only
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startDate);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate.getTime() === today.getTime() && booking.status === 'approved';
  });
  
  const resourceBookings = selectedResourceId 
    ? todaysBookings.filter(b => b.resourceId === selectedResourceId)
    : todaysBookings;
  
  // Find the current booking
  const currentBooking = bookings.find(b => b.id === selectedBookingId);
  
  // Get resource name
  const getResourceName = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : 'Unknown';
  };
  
  // Get member name
  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown';
  };
  
  // Record check-in
  const handleCheckIn = () => {
    if (!currentBooking) return;
    
    onRecordAttendance({
      resourceId: currentBooking.resourceId,
      memberId: currentBooking.memberId,
      date: new Date(),
      isPresent: true,
      checkInTime: new Date(),
      notes,
      createdAt: new Date()
    });
    
    toast.success('Check-in recorded successfully');
    setNotes('');
  };
  
  // Record check-out
  const handleCheckOut = (attendanceId: string) => {
    onRecordAttendance({
      id: attendanceId,
      checkOutTime: new Date()
    });
    
    toast.success('Check-out recorded successfully');
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Resource Attendance Tracking</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Track resource usage and attendance
          </p>
        </div>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Filter by Resource</Label>
              <Select value={selectedResourceId} onValueChange={setSelectedResourceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Resources</SelectItem>
                  {resources.map(resource => (
                    <SelectItem key={resource.id} value={resource.id}>{resource.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resourceBookings.length > 0 ? (
                  resourceBookings.map(booking => {
                    const attendanceRecord = attendance.find(a => 
                      a.resourceId === booking.resourceId && 
                      a.memberId === booking.memberId &&
                      new Date(a.date).toDateString() === new Date().toDateString()
                    );
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>{getResourceName(booking.resourceId)}</TableCell>
                        <TableCell>{getMemberName(booking.memberId)}</TableCell>
                        <TableCell>{booking.purpose}</TableCell>
                        <TableCell>
                          {new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(booking.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          {attendanceRecord ? (
                            attendanceRecord.checkOutTime ? 
                              <span className="flex items-center text-green-500">
                                <CheckCircle className="h-4 w-4 mr-1" /> Completed
                              </span> :
                              <span className="flex items-center text-blue-500">
                                <CheckCircle className="h-4 w-4 mr-1" /> Checked In
                              </span>
                          ) : (
                            <span className="flex items-center text-amber-500">
                              <XCircle className="h-4 w-4 mr-1" /> Not Arrived
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!attendanceRecord ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedBookingId(booking.id);
                                handleCheckIn();
                              }}
                            >
                              Check In
                            </Button>
                          ) : !attendanceRecord.checkOutTime ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleCheckOut(attendanceRecord.id)}
                            >
                              Check Out
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No bookings for today
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {selectedBookingId && !attendance.find(a => 
            a.resourceId === currentBooking?.resourceId && 
            a.memberId === currentBooking?.memberId &&
            new Date(a.date).toDateString() === new Date().toDateString()
          ) && (
            <div className="space-y-4 border p-4 rounded-md">
              <h3 className="font-medium">Record Check-in Notes</h3>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes" 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add any relevant notes about this resource usage"
                />
              </div>
              <Button onClick={handleCheckIn}>
                Record Check-in
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceAttendanceTracker;
