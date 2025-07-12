
import React, { useState } from 'react';
import { Programme } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Settings, Plus, Package, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export interface ResourceManagementProps {
  programmes: Programme[];
  resources: any[];
  onAllocateResource: (resource: any) => any;
  onUpdateStatus: (id: string, status: string) => boolean;
}

export const ResourceManagement = ({ 
  programmes = [], 
  resources = [], 
  onAllocateResource = () => ({}),
  onUpdateStatus = () => false
}: ResourceManagementProps) => {
  const { resources: contextResources } = useAppContext();
  
  // Mock resourceBookings data for now
  const resourceBookings: any[] = [];
  const [selectedProgrammeId, setSelectedProgrammeId] = useState('');
  const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false);
  const [allocationData, setAllocationData] = useState({
    resourceId: '',
    quantity: 1,
    startDate: new Date(),
    endDate: new Date(),
    notes: ''
  });

  const allResources = resources.length > 0 ? resources : contextResources;
  const selectedProgramme = programmes.find(p => p.id === selectedProgrammeId);

  const programmeResources = allResources.filter(resource => 
    selectedProgramme?.resourceIds?.includes(resource.id)
  );

  const availableResources = allResources.filter(resource => 
    resource.status === 'available' && resource.quantity > 0
  );

  const getResourceStatus = (resource: any) => {
    if (resource.status === 'maintenance') return 'warning';
    if (resource.status === 'unavailable') return 'destructive';
    if (resource.quantity === 0) return 'secondary';
    return 'default';
  };

  const handleAllocateResource = () => {
    if (!selectedProgrammeId || !allocationData.resourceId) return;

    const allocation = {
      programmeId: selectedProgrammeId,
      resourceId: allocationData.resourceId,
      quantity: allocationData.quantity,
      startDate: allocationData.startDate,
      endDate: allocationData.endDate,
      notes: allocationData.notes,
      status: 'allocated'
    };

    onAllocateResource(allocation);
    setIsAllocateDialogOpen(false);
    setAllocationData({
      resourceId: '',
      quantity: 1,
      startDate: new Date(),
      endDate: new Date(),
      notes: ''
    });
  };

  const handleStatusChange = (resourceId: string, newStatus: string) => {
    onUpdateStatus(resourceId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Programme Selection */}
      <div className="space-y-2">
        <Label>Select Programme</Label>
        <Select value={selectedProgrammeId} onValueChange={setSelectedProgrammeId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a programme" />
          </SelectTrigger>
          <SelectContent>
            {programmes.map(programme => (
              <SelectItem key={programme.id} value={programme.id}>
                {programme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProgramme && (
        <>
          {/* Programme Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Allocated Resources
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setIsAllocateDialogOpen(true)}
                  disabled={availableResources.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Allocate Resource
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programmeResources.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No resources allocated to this programme
                      </TableCell>
                    </TableRow>
                  ) : (
                    programmeResources.map(resource => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.name}</TableCell>
                        <TableCell>{resource.type}</TableCell>
                        <TableCell>{resource.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={getResourceStatus(resource)}>
                            {resource.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{resource.location}</TableCell>
                        <TableCell>
                          <Select 
                            value={resource.status} 
                            onValueChange={(value) => handleStatusChange(resource.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="in-use">In Use</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="unavailable">Unavailable</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Resource Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Resource Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Booked By</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resourceBookings.filter((booking: any) => booking.programmeId === selectedProgrammeId).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No resource bookings for this programme
                      </TableCell>
                    </TableRow>
                  ) : (
                    resourceBookings
                      .filter((booking: any) => booking.programmeId === selectedProgrammeId)
                      .map((booking: any) => {
                        const resource = allResources.find(r => r.id === booking.resourceId);
                        return (
                          <TableRow key={booking.id}>
                            <TableCell>{resource?.name || 'Unknown Resource'}</TableCell>
                            <TableCell>{booking.bookedBy}</TableCell>
                            <TableCell>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{format(new Date(booking.endDate), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Resource Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Resource Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allResources.filter(r => r.status === 'maintenance' || r.quantity === 0).length === 0 ? (
                  <p className="text-gray-500">No resource alerts</p>
                ) : (
                  allResources
                    .filter(r => r.status === 'maintenance' || r.quantity === 0)
                    .map(resource => (
                      <div key={resource.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium">{resource.name}</p>
                          <p className="text-sm text-gray-600">
                            {resource.status === 'maintenance' ? 'Under maintenance' : 'Out of stock'}
                          </p>
                        </div>
                        <Badge variant="warning">
                          {resource.status === 'maintenance' ? 'Maintenance' : 'Empty'}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Allocate Resource Dialog */}
      <Dialog open={isAllocateDialogOpen} onOpenChange={setIsAllocateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Allocate Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Resource</Label>
              <Select 
                value={allocationData.resourceId} 
                onValueChange={(value) => setAllocationData({...allocationData, resourceId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  {availableResources.map(resource => (
                    <SelectItem key={resource.id} value={resource.id}>
                      {resource.name} (Available: {resource.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={allocationData.quantity}
                onChange={(e) => setAllocationData({...allocationData, quantity: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={allocationData.notes}
                onChange={(e) => setAllocationData({...allocationData, notes: e.target.value})}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAllocateResource}>
              Allocate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceManagement;
