
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgrammeReminder, Programme, Member } from '@/types';
import { Bell, Calendar as CalendarIcon, Clock, Send, Check, X, AlertTriangle } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReminderManagerProps {
  programmes: Programme[];
  reminders: ProgrammeReminder[];
  members: Member[];
  onAddReminder: (reminder: Omit<ProgrammeReminder, 'id' | 'createdAt' | 'updatedAt'>) => ProgrammeReminder | null;
  onSendReminder: (reminderId: string) => boolean;
  onCancelReminder: (reminderId: string) => boolean;
}

export const ReminderManager = ({ 
  programmes, 
  reminders,
  members,
  onAddReminder,
  onSendReminder,
  onCancelReminder
}: ReminderManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<{[key: string]: boolean}>({});
  const [selectAll, setSelectAll] = useState(false);
  
  const [form, setForm] = useState({
    programmeId: '',
    title: '',
    message: '',
    scheduledDate: new Date(),
    status: 'scheduled' as const,
    recipients: [] as string[]
  });
  
  const resetForm = () => {
    setForm({
      programmeId: '',
      title: '',
      message: '',
      scheduledDate: new Date(),
      status: 'scheduled',
      recipients: []
    });
    setSelectedRecipients({});
    setSelectAll(false);
  };
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    
    if (checked) {
      const allMembers = members.reduce((acc, member) => {
        acc[member.id] = true;
        return acc;
      }, {} as {[key: string]: boolean});
      
      setSelectedRecipients(allMembers);
    } else {
      setSelectedRecipients({});
    }
  };
  
  const handleSelectMember = (memberId: string, checked: boolean) => {
    setSelectedRecipients(prev => ({
      ...prev,
      [memberId]: checked
    }));
    
    // Check if all are selected
    const updatedRecipients = {
      ...selectedRecipients,
      [memberId]: checked
    };
    
    const allSelected = members.every(member => 
      updatedRecipients[member.id] === true
    );
    
    setSelectAll(allSelected);
  };
  
  const handleSubmit = () => {
    // Get selected recipient IDs
    const recipientIds = Object.entries(selectedRecipients)
      .filter(([_, selected]) => selected)
      .map(([id, _]) => id);
    
    if (!form.programmeId || !form.title || !form.message || recipientIds.length === 0) {
      // Show error
      return;
    }
    
    const reminderData = {
      ...form,
      recipients: recipientIds
    };
    
    onAddReminder(reminderData);
    setIsDialogOpen(false);
    resetForm();
  };
  
  // Get programme name by ID
  const getProgrammeName = (programmeId: string) => {
    const programme = programmes.find(p => p.id === programmeId);
    return programme ? programme.name : 'Unknown Programme';
  };
  
  // Get recipient names
  const getRecipientNames = (recipientIds: string[]) => {
    const recipientMembers = members.filter(m => recipientIds.includes(m.id));
    if (recipientMembers.length <= 2) {
      return recipientMembers.map(m => `${m.firstName} ${m.lastName}`).join(', ');
    } else {
      return `${recipientMembers[0].firstName} ${recipientMembers[0].lastName} and ${recipientMembers.length - 1} others`;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Reminders & Notifications</h2>
          <p className="text-muted-foreground">
            Set up automated reminders for programme participants.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Bell className="mr-2 h-4 w-4" /> Add Reminder
        </Button>
      </div>
      
      <div className="space-y-4">
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No reminders scheduled yet.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Create Your First Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          reminders.map(reminder => (
            <Card key={reminder.id} className={cn(
              "border-l-4",
              reminder.status === 'sent' ? "border-l-green-500" :
              reminder.status === 'cancelled' ? "border-l-gray-400" :
              new Date(reminder.scheduledDate) < new Date() ? "border-l-red-500" :
              "border-l-blue-500"
            )}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg">{reminder.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {getProgrammeName(reminder.programmeId)}
                    </p>
                    <div className="flex flex-wrap gap-y-1 gap-x-3 text-sm">
                      <span className="flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" /> 
                        {format(new Date(reminder.scheduledDate), 'PPP')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" /> 
                        {format(new Date(reminder.scheduledDate), 'p')}
                      </span>
                      <span className={cn(
                        "flex items-center",
                        reminder.status === 'sent' ? "text-green-600" :
                        reminder.status === 'cancelled' ? "text-gray-500" :
                        new Date(reminder.scheduledDate) < new Date() ? "text-red-600" :
                        "text-blue-600"
                      )}>
                        {reminder.status === 'sent' ? (
                          <><Check className="mr-1 h-3 w-3" /> Sent</>
                        ) : reminder.status === 'cancelled' ? (
                          <><X className="mr-1 h-3 w-3" /> Cancelled</>
                        ) : new Date(reminder.scheduledDate) < new Date() ? (
                          <><AlertTriangle className="mr-1 h-3 w-3" /> Overdue</>
                        ) : (
                          <><Bell className="mr-1 h-3 w-3" /> Scheduled</>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="shrink-0 space-x-2">
                    {reminder.status === 'scheduled' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onSendReminder(reminder.id)}
                        >
                          <Send className="mr-2 h-3 w-3" /> Send Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onCancelReminder(reminder.id)}
                        >
                          <X className="mr-2 h-3 w-3" /> Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm mb-3">{reminder.message}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                    <span className="font-medium">Recipients:</span>
                    <span className="text-muted-foreground">
                      {reminder.recipients && Array.isArray(reminder.recipients) 
                        ? getRecipientNames(reminder.recipients) 
                        : 'No recipients'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
            <DialogDescription>
              Create a new reminder to notify programme participants.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="date">Schedule Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.scheduledDate ? (
                        format(form.scheduledDate, "PPP p")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.scheduledDate}
                      onSelect={(date) => date && setForm(prev => ({ ...prev, scheduledDate: date }))}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Label htmlFor="time" className="text-xs">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={format(form.scheduledDate, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const newDate = new Date(form.scheduledDate);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          setForm(prev => ({ ...prev, scheduledDate: newDate }));
                        }}
                        className="mt-1"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Reminder Title</Label>
              <Input 
                id="title"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter reminder title"
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter reminder message"
                rows={3}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Recipients</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="selectAll" 
                    checked={selectAll}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                  />
                  <label 
                    htmlFor="selectAll" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Select All
                  </label>
                </div>
              </div>
              
              <ScrollArea className="h-[150px] border rounded-md p-2">
                <div className="space-y-2">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`member-${member.id}`}
                        checked={selectedRecipients[member.id] === true}
                        onCheckedChange={(checked) => handleSelectMember(member.id, checked === true)}
                      />
                      <label 
                        htmlFor={`member-${member.id}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {member.firstName} {member.lastName}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!form.programmeId || !form.title || !form.message || Object.values(selectedRecipients).filter(Boolean).length === 0}
            >
              Schedule Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
