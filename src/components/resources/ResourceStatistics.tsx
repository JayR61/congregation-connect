
import React from 'react';
import { ChurchResource, ResourceBooking } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ResourceStatisticsProps {
  resources: ChurchResource[];
  bookings: ResourceBooking[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const ResourceStatistics: React.FC<ResourceStatisticsProps> = ({ resources, bookings }) => {
  // Generate resource type distribution data
  const resourceTypeData = React.useMemo(() => {
    const typeCounts: Record<string, number> = {};
    
    resources.forEach(resource => {
      typeCounts[resource.type] = (typeCounts[resource.type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [resources]);

  // Generate resource status distribution data
  const resourceStatusData = React.useMemo(() => {
    const statusCounts: Record<string, number> = {};
    
    resources.forEach(resource => {
      statusCounts[resource.status] = (statusCounts[resource.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
      value
    }));
  }, [resources]);

  // Generate booking status distribution data
  const bookingStatusData = React.useMemo(() => {
    const statusCounts: Record<string, number> = {};
    
    bookings.forEach(booking => {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [bookings]);

  // Generate resource utilization data (bookings per resource)
  const resourceUtilizationData = React.useMemo(() => {
    const utilizationCounts: Record<string, number> = {};
    
    bookings.forEach(booking => {
      utilizationCounts[booking.resourceId] = (utilizationCounts[booking.resourceId] || 0) + 1;
    });
    
    return Object.entries(utilizationCounts)
      .map(([resourceId, count]) => {
        const resource = resources.find(r => r.id === resourceId);
        return {
          name: resource ? resource.name : 'Unknown',
          bookings: count
        };
      })
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [bookings, resources]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Types</CardTitle>
          <CardDescription>Distribution by resource type</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resourceTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {resourceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} resources`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Status</CardTitle>
          <CardDescription>Current distribution by status</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resourceStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {resourceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} resources`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Utilized Resources</CardTitle>
          <CardDescription>Resources with the most bookings</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={resourceUtilizationData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value} bookings`, 'Usage']} />
              <Bar dataKey="bookings" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Status</CardTitle>
          <CardDescription>Distribution of booking statuses</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceStatistics;
