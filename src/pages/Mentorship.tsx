
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAppContext } from '@/context/AppContext';
import { MentorshipProgram } from '@/types';
import { toast } from '@/lib/toast';

const Mentorship = () => {
  const { members, addMentorshipProgram } = useAppContext();
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false);
  const [newProgram, setNewProgram] = useState<Partial<MentorshipProgram>>({
    title: '',
    name: '', 
    description: '',
    startDate: new Date(),
    endDate: null,
    goals: [],
    progress: 0,
    notes: '',
    status: 'active',
    menteeId: '',
    mentors: [],
    mentees: []
  });

  const handleAddProgram = () => {
    if (!newProgram.title || !newProgram.menteeId || !newProgram.mentors?.length) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const programData: MentorshipProgram = {
      id: `program-${Date.now()}`,
      title: newProgram.title || '',
      name: newProgram.title || '',
      menteeId: newProgram.menteeId || '',
      mentors: newProgram.mentors || [],
      mentees: [newProgram.menteeId || ''],
      status: newProgram.status || 'active',
      startDate: newProgram.startDate || new Date(),
      endDate: newProgram.endDate || null,
      description: newProgram.description || '',
      goals: newProgram.goals || [],
      progress: newProgram.progress || 0,
      notes: newProgram.notes || ''
    };

    addMentorshipProgram(programData);
    setNewProgram({
      title: '',
      name: '',
      description: '',
      startDate: new Date(),
      endDate: null,
      goals: [],
      progress: 0,
      notes: '',
      status: 'active',
      menteeId: '',
      mentors: [],
      mentees: []
    });
    setIsAddProgramDialogOpen(false);
    
    toast.success('Mentorship program added successfully!');
  };

  const updateProgramTitle = (value: string) => {
    setNewProgram({
      ...newProgram,
      title: value,
      name: value
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Mentorship Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsAddProgramDialogOpen(true)}>Add Mentorship Program</Button>
        </CardContent>
      </Card>

      <Dialog open={isAddProgramDialogOpen} onOpenChange={setIsAddProgramDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Mentorship Program</DialogTitle>
            <DialogDescription>
              Fill in the details for the new mentorship program.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Select 
                value={newProgram.menteeId || ''} 
                onValueChange={(value) => setNewProgram({ ...newProgram, menteeId: value, mentees: [value] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mentee" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={newProgram.mentors?.length ? newProgram.mentors[0] : ''} 
                onValueChange={(value) => setNewProgram({ ...newProgram, mentors: [value] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mentor" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                placeholder="Program Title"
                value={newProgram.title}
                onChange={(e) => updateProgramTitle(e.target.value)}
              />
            </div>
            <div>
              <Textarea
                placeholder="Program Description"
                value={newProgram.description}
                onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
              />
            </div>
            <div>
              <Input
                type="date"
                value={newProgram.startDate?.toISOString().split('T')[0]}
                onChange={(e) => setNewProgram({ ...newProgram, startDate: new Date(e.target.value) })}
              />
            </div>
            <div>
              <Input
                type="date"
                value={newProgram.endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setNewProgram({ ...newProgram, endDate: e.target.value ? new Date(e.target.value) : null })}
              />
            </div>
            <div>
              <Textarea
                placeholder="Goals"
                value={newProgram.goals?.join(', ')}
                onChange={(e) => setNewProgram({ ...newProgram, goals: e.target.value.split(',').map(goal => goal.trim()) })}
              />
            </div>
            <div>
              <Textarea
                placeholder="Notes"
                value={newProgram.notes}
                onChange={(e) => setNewProgram({ ...newProgram, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProgramDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProgram}>Add Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Mentorship;
