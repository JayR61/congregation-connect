
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volunteer } from '@/types';
import { toast } from '@/lib/toast';

const Volunteers = () => {
  const { members } = useAppContext();
  
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState<Partial<Volunteer>>({
    memberId: '',
    position: '',
    startDate: new Date(),
    status: 'active',
    hours: 0
  });
  
  const handleAddVolunteer = () => {
    if (!newVolunteer.memberId || !newVolunteer.position) {
      toast.error('Please select a member and enter a position');
      return;
    }
    
    const volunteer: Volunteer = {
      id: `volunteer-${Date.now()}`,
      memberId: newVolunteer.memberId,
      position: newVolunteer.position,
      department: newVolunteer.department || '',
      startDate: newVolunteer.startDate || new Date(),
      status: newVolunteer.status || 'active',
      hours: newVolunteer.hours || 0,
      area: newVolunteer.area || '',
      ministry: newVolunteer.ministry || '',
      role: newVolunteer.role || '',
      joinDate: newVolunteer.joinDate || new Date(),
      availability: newVolunteer.availability || []
    };
    
    setVolunteers([...volunteers, volunteer]);
    setNewVolunteer({
      memberId: '',
      position: '',
      startDate: new Date(),
      status: 'active',
      hours: 0
    });
    setIsDialogOpen(false);
    
    toast.success('Volunteer added successfully!');
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Volunteers</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Volunteer</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Volunteer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Ministry</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No volunteers registered yet. Click "Add Volunteer" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                volunteers.map(volunteer => {
                  const member = members.find(m => m.id === volunteer.memberId);
                  
                  return (
                    <TableRow key={volunteer.id}>
                      <TableCell>{member ? `${member.firstName} ${member.lastName}` : 'Unknown Member'}</TableCell>
                      <TableCell>{volunteer.ministry}</TableCell>
                      <TableCell>{volunteer.role}</TableCell>
                      <TableCell>{volunteer.joinDate?.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={volunteer.status === 'active' ? 'success' : 'secondary'}>
                          {volunteer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{volunteer.hours}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Volunteer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Member *</label>
                <Select
                  value={newVolunteer.memberId}
                  onValueChange={(value) => setNewVolunteer({ ...newVolunteer, memberId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.firstName} {member.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Position/Role *</label>
                <Input
                  placeholder="e.g., Youth Leader, Sound Technician, Greeter"
                  value={newVolunteer.position || ''}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, position: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ministry/Department</label>
                <Input
                  placeholder="e.g., Youth Ministry, Technical Team, Hospitality"
                  value={newVolunteer.ministry || ''}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, ministry: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Join Date</label>
                  <Input
                    type="date"
                    value={newVolunteer.joinDate ? newVolunteer.joinDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, joinDate: new Date(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hours/Week</label>
                  <Input
                    type="number"
                    placeholder="Hours per week"
                    value={newVolunteer.hours || 0}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, hours: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={newVolunteer.status || 'active'}
                  onValueChange={(value) => setNewVolunteer({ ...newVolunteer, status: value as 'active' | 'inactive' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddVolunteer}>Add Volunteer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Volunteers;
