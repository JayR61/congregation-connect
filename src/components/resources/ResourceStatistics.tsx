
import React from 'react';
import { ChurchResource, ResourceBooking } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

export interface ResourceStatisticsProps {
  resources: ChurchResource[];
  bookings: ResourceBooking[];
}

const ResourceStatistics: React.FC<ResourceStatisticsProps> = ({
  resources,
  bookings
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Resource Statistics</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Analytics and usage data for church resources
          </p>
        </div>
        <BarChart className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium">Statistics Dashboard</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Charts and statistics would be implemented here
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceStatistics;
