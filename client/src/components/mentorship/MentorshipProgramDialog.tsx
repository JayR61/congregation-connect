import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Plus, Users, Target } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MentorshipProgram } from '@/types/mentorship.types';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface MentorshipProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program?: MentorshipProgram | null;
  onSave: (program: Omit<MentorshipProgram, 'id'>) => void;
}

const MentorshipProgramDialog: React.FC<MentorshipProgramDialogProps> = ({
  open,
  onOpenChange,
  program,
  onSave
}) => {
  const { members } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<'active' | 'completed' | 'cancelled' | 'pending'>('active');
  const [mentors, setMentors] = useState<string[]>([]);
  const [mentees, setMentees] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [resources, setResources] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [progress, setProgress] = useState(0);
  const [newGoal, setNewGoal] = useState('');
  const [newResource, setNewResource] = useState('');

  useEffect(() => {
    if (program) {
      setName(program.name);
      setDescription(program.description);
      setStartDate(program.startDate);
      setEndDate(program.endDate || undefined);
      setStatus(program.status);
      setMentors(program.mentors || []);
      setMentees(program.mentees || []);
      setGoals(program.goals || []);
      setResources(program.resources || []);
      setNotes(program.notes || '');
      setProgress(program.progress || 0);
    } else {
      resetForm();
    }
  }, [program, open]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus('active');
    setMentors([]);
    setMentees([]);
    setGoals([]);
    setResources([]);
    setNotes('');
    setProgress(0);
    setNewGoal('');
    setNewResource('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Program name is required",
        variant: "destructive"
      });
      return;
    }

    if (!startDate) {
      toast({
        title: "Error",
        description: "Start date is required",
        variant: "destructive"
      });
      return;
    }

    const programData: Omit<MentorshipProgram, 'id'> = {
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      status,
      mentors,
      mentees,
      goals,
      resources,
      notes: notes.trim(),
      progress
    };

    onSave(programData);
    resetForm();
    onOpenChange(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const addResource = () => {
    if (newResource.trim()) {
      setResources([...resources, newResource.trim()]);
      setNewResource('');
    }
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const addMentor = (memberId: string) => {
    if (!mentors.includes(memberId)) {
      setMentors([...mentors, memberId]);
    }
  };

  const removeMentor = (memberId: string) => {
    setMentors(mentors.filter(id => id !== memberId));
  };

  const addMentee = (memberId: string) => {
    if (!mentees.includes(memberId)) {
      setMentees([...mentees, memberId]);
    }
  };

  const removeMentee = (memberId: string) => {
    setMentees(mentees.filter(id => id !== memberId));
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
  };

  const availableMembers = members.filter(m => !mentors.includes(m.id) && !mentees.includes(m.id));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {program ? 'Edit Program' : 'Create New Mentorship Program'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter program name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter program description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Progress (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Mentors */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <Label>Mentors</Label>
            </div>
            {mentors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mentors.map(mentorId => (
                  <Badge key={mentorId} variant="secondary" className="flex items-center gap-1">
                    {getMemberName(mentorId)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeMentor(mentorId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <Select onValueChange={addMentor}>
              <SelectTrigger>
                <SelectValue placeholder="Add a mentor" />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mentees */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <Label>Mentees</Label>
            </div>
            {mentees.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mentees.map(menteeId => (
                  <Badge key={menteeId} variant="outline" className="flex items-center gap-1">
                    {getMemberName(menteeId)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeMentee(menteeId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <Select onValueChange={addMentee}>
              <SelectTrigger>
                <SelectValue placeholder="Add a mentee" />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Goals */}
          <div className="space-y-3">
            <Label>Goals</Label>
            {goals.length > 0 && (
              <div className="space-y-2">
                {goals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{goal}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoal(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex space-x-2">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add a goal"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
              />
              <Button type="button" onClick={addGoal} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <Label>Resources</Label>
            {resources.length > 0 && (
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{resource}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResource(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex space-x-2">
              <Input
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                placeholder="Add a resource"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
              />
              <Button type="button" onClick={addResource} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {program ? 'Update Program' : 'Create Program'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MentorshipProgramDialog;