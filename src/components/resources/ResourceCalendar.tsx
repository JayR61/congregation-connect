import React from 'react';
import { ChurchResource, ResourceBooking, Member } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export interface ResourceCalendarProps {
  resources: ChurchResource[];
  bookings: ResourceBooking[];
  members: Member[];
}

const ResourceCalendar: React.FC<ResourceCalendarProps> = ({
  resources,
  bookings,
  members
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Resource Calendar</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            View all resource bookings in calendar format
          </p>
        </div>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium">Calendar View</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Calendar component would be implemented here, showing bookings for each resource
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCalendar;
