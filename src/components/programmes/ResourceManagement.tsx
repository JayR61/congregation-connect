
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Programme, ProgrammeResource } from '@/types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface ResourceManagementProps {
  programmes: Programme[];
  resources: ProgrammeResource[];
  onAllocateResource: (resource: Omit<ProgrammeResource, 'id'>) => ProgrammeResource | null;
  onUpdateStatus: (resourceId: string, status: ProgrammeResource['status']) => boolean;
}

export const ResourceManagement = ({ 
  programmes, 
  resources,
  onAllocateResource,
  onUpdateStatus
}: ResourceManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null);
  const [filteredProgrammeId, setFilteredProgrammeId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    type: 'room' as ProgrammeResource['type'],
    quantity: 1,
    unit: '',
    cost: undefined as number | undefined,
    notes: '',
    status: 'allocated' as ProgrammeResource['status']
  });
  
  const resetForm = () => {
    setForm({
      name: '',
      type: 'room',
      quantity: 1,
      unit: '',
      cost: undefined,
      notes: '',
      status: 'allocated'
    });
    setSelectedProgramme(null);
  };
  
  const handleSubmit = () => {
    if (!selectedProgramme) return;
    
    onAllocateResource({
      programmeId: selectedProgramme,
      ...form
    });
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  const filteredResources = filteredProgrammeId 
    ? resources.filter(r => r.programmeId === filteredProgrammeId)
    : resources;
  
  const resourcesByProgramme = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.programmeId]) {
      acc[resource.programmeId] = [];
    }
    acc[resource.programmeId].push(resource);
    return acc;
  }, {} as Record<string, ProgrammeResource[]>);
  
  const getStatusColor = (status: ProgrammeResource['status']) => {
    switch (status) {
      case 'allocated':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Resource Management</h2>
          <p className="text-muted-foreground">
            Allocate and manage resources for your programmes.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Allocate Resource
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select 
          value={filteredProgrammeId || ''} 
          onValueChange={(value) => setFilteredProgrammeId(value || null)}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by programme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Programmes</SelectItem>
            {programmes.map(programme => (
              <SelectItem key={programme.id} value={programme.id}>
                {programme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {filteredProgrammeId && (
          <Button variant="outline" onClick={() => setFilteredProgrammeId(null)}>
            Clear Filter
          </Button>
        )}
      </div>
      
      {Object.keys(resourcesByProgramme).length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">No resources allocated yet.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Allocate Your First Resource
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.keys(resourcesByProgramme).map(programmeId => {
            const programme = programmes.find(p => p.id === programmeId);
            const programmeResources = resourcesByProgramme[programmeId];
            
            return (
              <Card key={programmeId}>
                <CardHeader>
                  <CardTitle>
                    {programme?.name || 'Unknown Programme'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {programmeResources.map(resource => (
                      <div key={resource.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1 mb-3 md:mb-0">
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {resource.quantity} {resource.unit && `${resource.unit} `}
                            of {resource.type}
                            {resource.cost && ` (Cost: $${resource.cost.toFixed(2)})`}
                          </div>
                          {resource.notes && (
                            <div className="text-sm mt-1">{resource.notes}</div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(resource.status)}>
                            {resource.status}
                          </Badge>
                          
                          <Select 
                            defaultValue={resource.status}
                            onValueChange={(value) => 
                              onUpdateStatus(resource.id, value as ProgrammeResource['status'])
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="allocated">Allocated</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="denied">Denied</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Resource</DialogTitle>
            <DialogDescription>
              Add resources for a specific programme.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="programme">Programme</Label>
                  <Select 
                    value={selectedProgramme || ''} 
                    onValueChange={setSelectedProgramme}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select programme" />
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
                
                <div>
                  <Label htmlFor="name">Resource Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter resource name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={form.type} 
                    onValueChange={(value) => setForm(prev => ({ ...prev, type: value as ProgrammeResource['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="personnel">Personnel</SelectItem>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={form.quantity}
                      onChange={(e) => setForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit">Unit (optional)</Label>
                    <Input
                      id="unit"
                      value={form.unit}
                      onChange={(e) => setForm(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., hours, pieces"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cost">Cost (optional)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={form.cost !== undefined ? form.cost : ''}
                    onChange={(e) => setForm(prev => ({ ...prev, cost: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    placeholder="Enter cost"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter additional notes"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={form.status} 
                    onValueChange={(value) => setForm(prev => ({ ...prev, status: value as ProgrammeResource['status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allocated">Allocated</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedProgramme || !form.name}>
              Allocate Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
