
import React, { useState } from 'react';
import { ChurchResource, ResourceHealthLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/lib/toast';
import { Thermometer, AlertCircle, CheckCircle, Settings } from 'lucide-react';

interface ResourceHealthMonitorProps {
  resources: ChurchResource[];
  healthLogs: ResourceHealthLog[];
  onLogHealth?: (data: Omit<ResourceHealthLog, 'id'>) => void;
  onUpdateMaintenanceDate?: (resourceId: string, date: Date) => void;
}

const ResourceHealthMonitor: React.FC<ResourceHealthMonitorProps> = ({
  resources,
  healthLogs,
  onLogHealth = () => {},
  onUpdateMaintenanceDate = () => {}
}) => {
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [healthStatus, setHealthStatus] = useState<number>(100);
  const [notes, setNotes] = useState<string>('');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState<string>('');
  
  const selectedResource = resources.find(r => r.id === selectedResourceId);
  
  // Get health status color
  const getHealthColor = (status: number) => {
    if (status >= 80) return 'text-green-500';
    if (status >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Log health status
  const handleLogHealth = () => {
    if (!selectedResourceId) {
      toast.error('Please select a resource');
      return;
    }
    
    onLogHealth({
      resourceId: selectedResourceId,
      status: healthStatus,
      notes: notes,
      date: new Date(),
      createdBy: 'user-1' // Typically would come from current user
    });
    
    toast.success('Health status logged successfully');
    setNotes('');
  };
  
  // Update maintenance date
  const handleUpdateMaintenanceDate = () => {
    if (!selectedResourceId || !nextMaintenanceDate) {
      toast.error('Please select a resource and date');
      return;
    }
    
    onUpdateMaintenanceDate(selectedResourceId, new Date(nextMaintenanceDate));
    toast.success('Maintenance date updated successfully');
  };
  
  // Get resource health logs
  const resourceLogs = selectedResourceId 
    ? healthLogs.filter(log => log.resourceId === selectedResourceId).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];
  
  // Resources that need maintenance
  const resourcesNeedingMaintenance = resources.filter(r => {
    if (!r.nextMaintenanceDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maintenanceDate = new Date(r.nextMaintenanceDate);
    maintenanceDate.setHours(0, 0, 0, 0);
    return maintenanceDate <= today;
  });
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Resource Health Monitor</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Track resource condition and maintenance needs
          </p>
        </div>
        <Thermometer className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {resourcesNeedingMaintenance.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <h3 className="flex items-center font-medium text-amber-800">
                <AlertCircle className="h-4 w-4 mr-2" />
                Resources Needing Maintenance
              </h3>
              <ul className="mt-2 space-y-1">
                {resourcesNeedingMaintenance.map(resource => (
                  <li key={resource.id} className="text-sm text-amber-800">
                    {resource.name} - Maintenance due {resource.nextMaintenanceDate ? formatDate(resource.nextMaintenanceDate) : '(not set)'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Select Resource</Label>
              <Select value={selectedResourceId} onValueChange={setSelectedResourceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a resource" />
                </SelectTrigger>
                <SelectContent>
                  {resources.map(resource => (
                    <SelectItem key={resource.id} value={resource.id}>{resource.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedResource && (
              <div className="grid place-items-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Current Health Status</p>
                  <p className={`text-2xl font-bold ${getHealthColor(selectedResource.healthStatus || 0)}`}>
                    {selectedResource.healthStatus || 0}%
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {selectedResource && (
            <>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Log New Health Status</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 flex justify-between">
                      <span>Health Status: {healthStatus}%</span>
                      <span className={getHealthColor(healthStatus)}>
                        {healthStatus >= 80 ? 'Good' : healthStatus >= 60 ? 'Fair' : 'Poor'}
                      </span>
                    </Label>
                    <Slider
                      defaultValue={[100]}
                      max={100}
                      step={1}
                      value={[healthStatus]}
                      onValueChange={(value) => setHealthStatus(value[0])}
                      className="py-4"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Describe the current condition and any issues"
                    />
                  </div>
                  
                  <Button onClick={handleLogHealth} className="w-full">
                    Log Health Status
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Schedule Maintenance</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Current Schedule:</Label>
                    <p className="text-sm">
                      {selectedResource.lastMaintenanceDate ? (
                        <span>Last maintenance: {formatDate(selectedResource.lastMaintenanceDate)}</span>
                      ) : (
                        <span>No previous maintenance recorded</span>
                      )}
                    </p>
                    <p className="text-sm">
                      {selectedResource.nextMaintenanceDate ? (
                        <span>Next scheduled: {formatDate(selectedResource.nextMaintenanceDate)}</span>
                      ) : (
                        <span>No maintenance scheduled</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="nextMaintenance">Next Maintenance Date</Label>
                      <Input 
                        id="nextMaintenance"
                        type="date"
                        value={nextMaintenanceDate}
                        onChange={e => setNextMaintenanceDate(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleUpdateMaintenanceDate} disabled={!nextMaintenanceDate}>
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Health History</h3>
                {resourceLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resourceLogs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(log.date)}</TableCell>
                          <TableCell>
                            <span className={getHealthColor(log.status)}>
                              {log.status}%
                            </span>
                          </TableCell>
                          <TableCell>{log.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground">No health logs recorded</p>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceHealthMonitor;
