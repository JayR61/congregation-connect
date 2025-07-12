import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Users, UserPlus, Hash } from 'lucide-react';
import { Member, Programme } from '@/types';
import { toast } from '@/hooks/use-toast';

interface EnhancedAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programme: Programme;
  members: Member[];
  onSaveAttendance: (attendanceData: AttendanceRecord) => void;
}

interface AttendanceRecord {
  programmeId: string;
  date: Date;
  presentMembers: string[];
  absentMembers: string[];
  visitors: VisitorRecord[];
  newSouls: NewSoulRecord[];
  totalAttendance: number;
  notes?: string;
}

interface VisitorRecord {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

interface NewSoulRecord {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

const EnhancedAttendanceDialog: React.FC<EnhancedAttendanceDialogProps> = ({
  open,
  onOpenChange,
  programme,
  members,
  onSaveAttendance
}) => {
  const [memberAttendance, setMemberAttendance] = useState<Map<string, boolean>>(new Map());
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [newSouls, setNewSouls] = useState<NewSoulRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [newVisitor, setNewVisitor] = useState<VisitorRecord>({ name: '' });
  const [newSoul, setNewSoul] = useState<NewSoulRecord>({ name: '' });

  const handleMemberToggle = (memberId: string, isPresent: boolean) => {
    setMemberAttendance(prev => {
      const newMap = new Map(prev);
      newMap.set(memberId, isPresent);
      return newMap;
    });
  };

  const handleMarkAllMembers = (present: boolean) => {
    const newAttendance = new Map();
    members.forEach(member => {
      newAttendance.set(member.id, present);
    });
    setMemberAttendance(newAttendance);
  };

  const addVisitor = () => {
    if (newVisitor.name.trim()) {
      setVisitors(prev => [...prev, { ...newVisitor }]);
      setNewVisitor({ name: '' });
    }
  };

  const addNewSoul = () => {
    if (newSoul.name.trim()) {
      setNewSouls(prev => [...prev, { ...newSoul }]);
      setNewSoul({ name: '' });
    }
  };

  const removeVisitor = (index: number) => {
    setVisitors(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewSoul = (index: number) => {
    setNewSouls(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalAttendance = () => {
    const presentMembers = Array.from(memberAttendance.values()).filter(v => v).length;
    return presentMembers + visitors.length + newSouls.length + totalCount;
  };

  const handleSave = () => {
    const presentMembers = Array.from(memberAttendance.entries())
      .filter(([_, present]) => present)
      .map(([memberId, _]) => memberId);

    const absentMembers = Array.from(memberAttendance.entries())
      .filter(([_, present]) => !present)
      .map(([memberId, _]) => memberId);

    const attendanceRecord: AttendanceRecord = {
      programmeId: programme.id,
      date: new Date(),
      presentMembers,
      absentMembers,
      visitors,
      newSouls,
      totalAttendance: calculateTotalAttendance(),
      notes
    };

    onSaveAttendance(attendanceRecord);
    onOpenChange(false);
    
    toast({
      title: "Attendance Recorded",
      description: `Total attendance: ${attendanceRecord.totalAttendance} people`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Attendance - {programme.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="newsouls">New Souls</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Registered Members</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleMarkAllMembers(true)}>
                  Mark All Present
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleMarkAllMembers(false)}>
                  Mark All Absent
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {members.map(member => (
                <Card key={member.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={memberAttendance.get(member.id) || false}
                        onCheckedChange={(checked) => handleMemberToggle(member.id, checked as boolean)}
                      />
                      <div>
                        <p className="font-medium">{member.firstName} {member.lastName}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant={memberAttendance.get(member.id) ? "default" : "secondary"}>
                      {memberAttendance.get(member.id) ? "Present" : "Absent"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="visitors" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Visitors</h3>
              <Badge variant="outline">
                <Users className="h-4 w-4 mr-1" />
                {visitors.length}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Visitor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="visitor-name">Name *</Label>
                    <Input
                      id="visitor-name"
                      value={newVisitor.name}
                      onChange={(e) => setNewVisitor({...newVisitor, name: e.target.value})}
                      placeholder="Enter visitor's name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="visitor-email">Email</Label>
                    <Input
                      id="visitor-email"
                      type="email"
                      value={newVisitor.email || ''}
                      onChange={(e) => setNewVisitor({...newVisitor, email: e.target.value})}
                      placeholder="Enter email (optional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="visitor-phone">Phone</Label>
                    <Input
                      id="visitor-phone"
                      value={newVisitor.phone || ''}
                      onChange={(e) => setNewVisitor({...newVisitor, phone: e.target.value})}
                      placeholder="Enter phone (optional)"
                    />
                  </div>
                </div>
                <Button onClick={addVisitor} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Visitor
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {visitors.map((visitor, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{visitor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {visitor.email} {visitor.phone && `• ${visitor.phone}`}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeVisitor(index)}>
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="newsouls" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">New Souls / Conversions</h3>
              <Badge variant="outline">
                <UserPlus className="h-4 w-4 mr-1" />
                {newSouls.length}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add New Soul</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="soul-name">Name *</Label>
                    <Input
                      id="soul-name"
                      value={newSoul.name}
                      onChange={(e) => setNewSoul({...newSoul, name: e.target.value})}
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="soul-email">Email</Label>
                    <Input
                      id="soul-email"
                      type="email"
                      value={newSoul.email || ''}
                      onChange={(e) => setNewSoul({...newSoul, email: e.target.value})}
                      placeholder="Enter email (optional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="soul-phone">Phone</Label>
                    <Input
                      id="soul-phone"
                      value={newSoul.phone || ''}
                      onChange={(e) => setNewSoul({...newSoul, phone: e.target.value})}
                      placeholder="Enter phone (optional)"
                    />
                  </div>
                </div>
                <Button onClick={addNewSoul} className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Soul
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {newSouls.map((soul, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{soul.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {soul.email} {soul.phone && `• ${soul.phone}`}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeNewSoul(index)}>
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <h3 className="text-lg font-semibold">Attendance Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Present Members</p>
                      <p className="text-2xl font-bold">
                        {Array.from(memberAttendance.values()).filter(v => v).length}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Visitors</p>
                      <p className="text-2xl font-bold">{visitors.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">New Souls</p>
                      <p className="text-2xl font-bold">{newSouls.length}</p>
                    </div>
                    <UserPlus className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Attendance</p>
                      <p className="text-2xl font-bold">{calculateTotalAttendance()}</p>
                    </div>
                    <Hash className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Additional Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="total-count">Manual Count (if needed)</Label>
                  <Input
                    id="total-count"
                    type="number"
                    value={totalCount}
                    onChange={(e) => setTotalCount(parseInt(e.target.value) || 0)}
                    placeholder="Enter additional count"
                  />
                  <p className="text-sm text-muted-foreground">
                    Use this if you have additional attendees not recorded above
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-20 p-2 border rounded-md"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes about the service..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Record Attendance ({calculateTotalAttendance()} total)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAttendanceDialog;