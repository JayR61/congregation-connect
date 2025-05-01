
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ChurchResource, ResourceBooking, Member } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, User, CalendarDays } from 'lucide-react';

interface ResourceCalendarProps {
  resources: ChurchResource[];
  bookings: ResourceBooking[];
  members: Member[];
}

const ResourceCalendar: React.FC<ResourceCalendarProps> = ({ resources, bookings, members }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedResource, setSelectedResource] = useState<string>('all');

  // Filter bookings by selected date and resource
  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startDate);
    const matchesDate = selectedDate ? 
      bookingDate.getDate() === selectedDate.getDate() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getFullYear() === selectedDate.getFullYear() 
      : true;
      
    const matchesResource = selectedResource === 'all' || booking.resourceId === selectedResource;
    
    return matchesDate && matchesResource;
  });
  
  // Format time from date object
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get resource name by ID
  const getResourceName = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : 'Unknown Resource';
  };
  
  // Get member name by ID
  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Select a date to view bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          
          <div className="mt-4">
            <Select value={selectedResource} onValueChange={setSelectedResource}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                {resources.map(resource => (
                  <SelectItem key={resource.id} value={resource.id}>{resource.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            Bookings for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'All Dates'}
          </CardTitle>
          <CardDescription>
            {selectedResource !== 'all' 
              ? `Filtered to ${getResourceName(selectedResource)}` 
              : 'All resources'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="flex p-4 border rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{booking.purpose}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{new Date(booking.startDate).toLocaleDateString()} {formatTime(booking.startDate)} - {formatTime(booking.endDate)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{getResourceName(booking.resourceId)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{getMemberName(booking.memberId)}</span>
                      </div>
                      
                      {booking.notes && (
                        <div className="mt-2 text-muted-foreground">
                          <p>{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found for the selected date and resource
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceCalendar;
