
import React, { useState } from 'react';
import { ChurchResource, ResourceBooking, Member } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, getDay } from 'date-fns';

interface ResourceCalendarProps {
  resources: ChurchResource[];
  bookings: ResourceBooking[];
  members: Member[];
}

const ResourceCalendar: React.FC<ResourceCalendarProps> = ({ resources, bookings, members }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedResource, setSelectedResource] = useState<string | 'all'>('all');
  
  const filteredBookings = bookings.filter(booking => {
    if (selectedResource !== 'all' && booking.resourceId !== selectedResource) {
      return false;
    }
    
    const bookingStartMonth = booking.startDate.getMonth();
    const bookingStartYear = booking.startDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return bookingStartMonth === currentMonth && bookingStartYear === currentYear;
  });
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const getBookingsForDay = (day: Date) => {
    return filteredBookings.filter(booking => {
      const bookingStartDate = new Date(booking.startDate);
      const bookingEndDate = new Date(booking.endDate);
      
      const bookingStart = new Date(
        bookingStartDate.getFullYear(),
        bookingStartDate.getMonth(),
        bookingStartDate.getDate()
      );
      
      const bookingEnd = new Date(
        bookingEndDate.getFullYear(),
        bookingEndDate.getMonth(),
        bookingEndDate.getDate()
      );
      
      const currentDay = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );
      
      return currentDay >= bookingStart && currentDay <= bookingEnd;
    });
  };
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    
    return (
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            {format(currentDate, dateFormat)}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedResource} onValueChange={(value) => setSelectedResource(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              {resources.map(resource => (
                <SelectItem key={resource.id} value={resource.id}>
                  {resource.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Resource Booking Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {renderHeader()}
        
        <div className="grid grid-cols-7 gap-2 text-sm font-semibold border-b pb-2 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 auto-rows-fr">
          {Array(getDay(monthStart))
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`} className="p-1 border border-transparent"></div>
            ))}
          
          {days.map((day, i) => {
            const dayBookings = getBookingsForDay(day);
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div 
                key={day.toString()} 
                className={`min-h-[100px] p-1 border rounded-md ${
                  isCurrentDay 
                    ? 'border-primary bg-primary/5' 
                    : isCurrentMonth 
                      ? 'border-gray-200'
                      : 'border-transparent text-gray-400'
                }`}
              >
                <div className="font-medium mb-1">{format(day, "d")}</div>
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayBookings.map(booking => {
                    const resource = resources.find(r => r.id === booking.resourceId);
                    const member = members.find(m => m.id === booking.memberId);
                    
                    return (
                      <div
                        key={booking.id}
                        className="p-1 text-xs rounded bg-primary/10 flex flex-col truncate"
                        title={`${booking.purpose} (${resource?.name})`}
                      >
                        <span className="font-medium truncate">{booking.purpose}</span>
                        <div className="flex justify-between items-center">
                          <span className="truncate text-muted-foreground">{resource?.name}</span>
                          <Badge variant="outline" className="text-[10px] px-1">{booking.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCalendar;
