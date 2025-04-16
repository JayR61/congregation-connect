
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ProgrammeReminder, Programme, Member } from '@/types';
import { Bell, CalendarIcon, Mail } from 'lucide-react';
import { format, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

interface ReminderManagerProps {
  programmes: Programme[];
  reminders: ProgrammeReminder[];
  members: Member[];
  onCreateReminder: (reminder: Omit<ProgrammeReminder, 'id' | 'sentAt' | 'status'>) => ProgrammeReminder | null;
  onCheckReminders: () => ProgrammeReminder[];
}

export const ReminderManager = ({ 
  programmes, 
  reminders,
  members,
  onCreateReminder,
  onCheckReminders
}: ReminderManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<{[key: string]: boolean}>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [form, setForm] = useState({
    programmeId: '',
    type: 'email' as ProgrammeReminder['type'],
    schedule: 'day_before' as ProgrammeReminder['schedule'],
    customTime: new Date(),
    message: ''
  });
  
  const resetForm = () => {
    setForm({
      programmeId: '',
      type: 'email',
      schedule: 'day_before',
      customTime: new Date(),
      message: ''
    });
    setSelectedMembers({});
  };
  
  const handleMemberSelectionChange = (memberId: string, checked: boolean) => {
    setSelectedMembers(prev => ({
      ...prev,
      [memberId]: checked
    }));
  };
  
  const handleSubmit = () => {
    const selectedMemberIds = Object.entries(selectedMembers)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => id);
    
    if (selectedMemberIds.length === 0) return;
    
    onCreateReminder({
      programmeId: form.programmeId,
      type: form.type,
      schedule: form.schedule,
      customTime: form.schedule === 'custom' ? form.customTime : undefined,
      recipientIds: selectedMemberIds,
      message: form.message || undefined
    });
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleCheckReminders = async () => {
    setIsProcessing(true);
    
    try {
      const sentReminders = await onCheckReminders();
      console.log('Sent reminders:', sentReminders);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get programme name by ID
  const getProgrammeName = (programmeId: string) => {
    const programme = programmes.find(p => p.id === programmeId);
    return programme ? programme.name : 'Unknown Programme';
  };
  
  // Get member names by IDs
  const getMemberNames = (memberIds: string[]) => {
    return memberIds.map(id => {
      const member = members.find(m => m.id === id);
      return member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
    });
  };
  
  // Group reminders by programme
  const remindersByProgramme = reminders.reduce((acc, reminder) => {
    if (!acc[reminder.programmeId]) {
      acc[reminder.programmeId] = [];
    }
    acc[reminder.programmeId].push(reminder);
    return acc;
  }, {} as Record<string, ProgrammeReminder[]>);
  
  // Get status badge style
  const getStatusBadge = (status: ProgrammeReminder['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Reminders</h2>
          <p className="text-muted-foreground">
            Schedule email notifications for programme participants.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleCheckReminders}
            disabled={isProcessing}
          >
            <Bell className="mr-2 h-4 w-4" /> Check Pending Reminders
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" /> Create Reminder
          </Button>
        </div>
      </div>
      
      {Object.keys(remindersByProgramme).length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">No reminders scheduled yet.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Create Your First Reminder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(remindersByProgramme).map(([programmeId, programmeReminders]) => (
            <Card key={programmeId}>
              <CardHeader>
                <CardTitle>{getProgrammeName(programmeId)}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[300px] pr-4">
                  <div className="space-y-4">
                    {programmeReminders.map(reminder => (
                      <div key={reminder.id} className="border rounded-lg p-4">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                          <div className="flex items-center">
                            {reminder.type === 'email' ? (
                              <Mail className="h-4 w-4 mr-2" />
                            ) : (
                              <Bell className="h-4 w-4 mr-2" />
                            )}
                            <span className="font-medium">
                              {reminder.type === 'email' ? 'Email Reminder' : 'Notification'}
                            </span>
                          </div>
                          
                          <Badge className={getStatusBadge(reminder.status)}>
                            {reminder.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h4 className="text-sm font-medium">Schedule</h4>
                            <p className="text-sm">
                              {reminder.schedule === 'day_before' && 'One day before'}
                              {reminder.schedule === 'hour_before' && 'One hour before'}
                              {reminder.schedule === 'week_before' && 'One week before'}
                              {reminder.schedule === 'custom' && reminder.customTime && (
                                <>Custom time: {format(new Date(reminder.customTime), 'PPp')}</>
                              )}
                            </p>
                          </div>
                          
                          {reminder.sentAt && (
                            <div>
                              <h4 className="text-sm font-medium">Sent At</h4>
                              <p className="text-sm">{format(new Date(reminder.sentAt), 'PPp')}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium">Recipients</h4>
                          <p className="text-sm">
                            {getMemberNames(reminder.recipientIds).join(', ')}
                          </p>
                        </div>
                        
                        {reminder.message && (
                          <div>
                            <h4 className="text-sm font-medium">Message</h4>
                            <p className="text-sm border-l-2 pl-2 mt-1">
                              {reminder.message}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Reminder</DialogTitle>
            <DialogDescription>
              Schedule reminders for programme participants.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="programme">Programme</Label>
                <Select 
                  value={form.programmeId} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, programmeId: value }))}
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
                <Label className="mb-2 block">Reminder Type</Label>
                <RadioGroup 
                  value={form.type} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, type: value as ProgrammeReminder['type'] }))}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="type-email" />
                    <Label htmlFor="type-email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="notification" id="type-notification" />
                    <Label htmlFor="type-notification">In-app Notification</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="mb-2 block">Schedule</Label>
                <RadioGroup 
                  value={form.schedule} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, schedule: value as ProgrammeReminder['schedule'] }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="day_before" id="schedule-day" />
                    <Label htmlFor="schedule-day">One day before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hour_before" id="schedule-hour" />
                    <Label htmlFor="schedule-hour">One hour before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="week_before" id="schedule-week" />
                    <Label htmlFor="schedule-week">One week before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="schedule-custom" />
                    <Label htmlFor="schedule-custom">Custom time</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {form.schedule === 'custom' && (
                <div>
                  <Label htmlFor="customTime">Custom Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.customTime && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.customTime ? (
                          format(form.customTime, "PPp")
                        ) : (
                          <span>Pick a date and time</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.customTime}
                        onSelect={(date) => date && setForm(prev => ({ ...prev, customTime: date }))}
                        initialFocus
                      />
                      <div className="p-3 border-t">
                        <Label htmlFor="time" className="text-xs font-medium">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          className="mt-1"
                          value={format(form.customTime, "HH:mm")}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            const newDate = new Date(form.customTime);
                            newDate.setHours(parseInt(hours), parseInt(minutes));
                            setForm(prev => ({ ...prev, customTime: newDate }));
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter custom message for the reminder"
                  rows={3}
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Recipients</Label>
                <div className="border rounded-md max-h-[200px] overflow-y-auto">
                  <div className="p-3 space-y-2">
                    {members.map(member => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`member-${member.id}`}
                          checked={selectedMembers[member.id] || false}
                          onChange={(e) => handleMemberSelectionChange(member.id, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`member-${member.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {member.firstName} {member.lastName}
                        </label>
                      </div>
                    ))}
                    
                    {members.length === 0 && (
                      <div className="text-center py-2 text-muted-foreground">
                        No members available.
                      </div>
                    )}
                  </div>
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
            <Button 
              onClick={handleSubmit}
              disabled={
                !form.programmeId || 
                Object.values(selectedMembers).filter(Boolean).length === 0
              }
            >
              Create Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
