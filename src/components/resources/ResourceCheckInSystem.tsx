
import React, { useState } from 'react';
import { ChurchResource, ResourceBooking, Member } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/lib/toast';
import { QrCode, Search, CheckCircle, XCircle, Clock, MoreHorizontal, User } from 'lucide-react';

interface ResourceCheckInSystemProps {
  resources: ChurchResource[];
  bookings: ResourceBooking[];
  members: Member[];
  onCheckIn?: (bookingId: string) => void;
  onCheckOut?: (bookingId: string) => void;
}

const ResourceCheckInSystem: React.FC<ResourceCheckInSystemProps> = ({
  resources,
  bookings,
  members,
  onCheckIn = () => {},
  onCheckOut = () => {}
}) => {
  const [qrCode, setQrCode] = useState('');
  const [manualResourceId, setManualResourceId] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<ResourceBooking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  
  // Handle QR code scan
  const handleQrScan = () => {
    if (!qrCode) {
      toast.error('Please enter a valid QR code');
      return;
    }
    
    const resource = resources.find(r => r.qrCode === qrCode);
    if (!resource) {
      toast.error('Resource not found');
      return;
    }
    
    // Find active bookings for this resource
    const activeBookings = bookings.filter(b => 
      b.resourceId === resource.id && 
      b.status === 'approved' &&
      new Date(b.startDate) <= new Date() &&
      new Date(b.endDate) >= new Date()
    );
    
    if (activeBookings.length === 0) {
      toast.error('No active bookings found for this resource');
      return;
    }
    
    if (activeBookings.length === 1) {
      setSelectedBooking(activeBookings[0]);
      setIsDialogOpen(true);
    } else {
      setManualResourceId(resource.id);
      toast.success(`Found ${activeBookings.length} active bookings for ${resource.name}`);
    }
    
    setQrCode('');
  };
  
  // Handle manual selection
  const handleManualSelection = () => {
    if (!manualResourceId) {
      toast.error('Please select a resource');
      return;
    }
    
    // Find active bookings for this resource
    const activeBookings = bookings.filter(b => 
      b.resourceId === manualResourceId && 
      b.status === 'approved' &&
      new Date(b.startDate) <= new Date() &&
      new Date(b.endDate) >= new Date()
    );
    
    if (activeBookings.length === 0) {
      toast.error('No active bookings found for this resource');
      return;
    }
  };
  
  // Process check-in
  const processCheckIn = () => {
    if (!selectedBooking) return;
    
    onCheckIn(selectedBooking.id);
    toast.success('Resource checked in successfully');
    setIsDialogOpen(false);
    setSelectedBooking(null);
  };
  
  // Process check-out
  const processCheckOut = () => {
    if (!selectedBooking) return;
    
    onCheckOut(selectedBooking.id);
    toast.success('Resource checked out successfully');
    setIsDialogOpen(false);
    setSelectedBooking(null);
  };
  
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
  
  // Format date and time
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge class
  const getStatusBadge = (booking: ResourceBooking) => {
    if (booking.checkedOutAt) {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>;
    }
    
    if (booking.checkedInAt) {
      return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Checked In</span>;
    }
    
    return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Not Checked In</span>;
  };
  
  // Today's bookings
  const todayBookings = bookings.filter(b => {
    const bookingDate = new Date(b.startDate);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString() && b.status === 'approved';
  });
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Resource Check-in System</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Check in and out resources using QR codes
          </p>
        </div>
        <QrCode className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4">Scan Resource QR Code</h3>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input 
                    placeholder="Scan or enter QR code" 
                    value={qrCode}
                    onChange={e => setQrCode(e.target.value)}
                  />
                </div>
                <Button onClick={handleQrScan}>
                  <Search className="h-4 w-4 mr-2" />
                  Scan
                </Button>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setBookingDetailsOpen(true)} className="w-full">
                  View Today's Bookings
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Recent Check-ins/Outs</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayBookings.length > 0 ? (
                    todayBookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{getResourceName(booking.resourceId)}</TableCell>
                        <TableCell>{getMemberName(booking.memberId)}</TableCell>
                        <TableCell>
                          {booking.checkedInAt ? formatDateTime(booking.checkedInAt) : 'Not checked in yet'}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No check-ins recorded today
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resource Check-in/Out</DialogTitle>
              </DialogHeader>
              {selectedBooking && (
                <div className="py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resource</p>
                      <p>{getResourceName(selectedBooking.resourceId)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member</p>
                      <p>{getMemberName(selectedBooking.memberId)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                      <p>{selectedBooking.purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p>{getStatusBadge(selectedBooking)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                      <p>{formatDateTime(selectedBooking.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">End Time</p>
                      <p>{formatDateTime(selectedBooking.endDate)}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter className="flex space-x-2">
                {selectedBooking && !selectedBooking.checkedInAt && (
                  <Button onClick={processCheckIn} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check In
                  </Button>
                )}
                {selectedBooking && selectedBooking.checkedInAt && !selectedBooking.checkedOutAt && (
                  <Button onClick={processCheckOut} className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" />
                    Check Out
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Today's Resource Bookings</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto">
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
                    {todayBookings.length > 0 ? (
                      todayBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{getResourceName(booking.resourceId)}</TableCell>
                          <TableCell>{getMemberName(booking.memberId)}</TableCell>
                          <TableCell>{booking.purpose}</TableCell>
                          <TableCell>
                            {formatDateTime(booking.startDate)} - {formatDateTime(booking.endDate)}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setBookingDetailsOpen(false);
                                setIsDialogOpen(true);
                              }}
                            >
                              {!booking.checkedInAt 
                                ? <CheckCircle className="h-4 w-4 mr-1" /> 
                                : !booking.checkedOutAt 
                                ? <XCircle className="h-4 w-4 mr-1" />
                                : <MoreHorizontal className="h-4 w-4 mr-1" />
                              }
                              {!booking.checkedInAt 
                                ? 'Check In' 
                                : !booking.checkedOutAt 
                                ? 'Check Out'
                                : 'Details'
                              }
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No bookings scheduled for today
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCheckInSystem;
