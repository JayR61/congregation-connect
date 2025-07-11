
import React, { useState } from 'react';
import { Member, Programme, ProgrammeReminder } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Plus, Send, X, CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ReminderManagerProps {
  programmes: Programme[];
  reminders?: any[];
  members: Member[];
  onCreateReminder: (reminder: Omit<ProgrammeReminder, "id" | "sent" | "status">) => ProgrammeReminder;
  onSendReminder?: (id: string) => boolean;
  onCancelReminder?: (id: string) => boolean;
}

export const ReminderManager = ({ 
  programmes, 
  reminders = [], 
  members, 
  onCreateReminder,
  onSendReminder = () => false,
  onCancelReminder = () => false
}: ReminderManagerProps) => {
  const [selectedProgrammeId, setSelectedProgrammeId] = useState('');
  const [isCreateReminderDialogOpen, setIsCreateReminderDialogOpen] = useState(false);
  const [reminderData, setReminderData] = useState({
    programmeId: '',
    type: 'email' as 'email' | 'sms' | 'push',
    title: '',
    message: '',
    scheduledFor: new Date(),
    targetAudience: 'all' as 'all' | 'registered' | 'waitlist',
    recipients: [] as string[]
  });

  const selectedProgramme = programmes.find(p => p.id === selectedProgrammeId);
  const programmeReminders = reminders.filter(r => r.programmeId === selectedProgrammeId);

  const handleCreateReminder = () => {
    if (!reminderData.programmeId || !reminderData.title || !reminderData.message) return;

    const newReminder = {
      programmeId: reminderData.programmeId,
      type: reminderData.type,
      title: reminderData.title,
      message: reminderData.message,
      scheduledFor: reminderData.scheduledFor,
      targetAudience: reminderData.targetAudience,
      recipients: reminderData.recipients
    };

    onCreateReminder(newReminder);
    setIsCreateReminderDialogOpen(false);
    setReminderData({
      programmeId: '',
      type: 'email',
      title: '',
      message: '',
      scheduledFor: new Date(),
      targetAudience: 'all',
      recipients: []
    });
  };

  const handleSendReminder = (reminderId: string) => {
    onSendReminder(reminderId);
  };

  const handleCancelReminder = (reminderId: string) => {
    onCancelReminder(reminderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'draft': return 'outline';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return '📧';
      case 'sms': return '📱';
      case 'push': return '🔔';
      default: return '📧';
    }
  };

  const reminderStats = React.useMemo(() => {
    const total = programmeReminders.length;
    const sent = programmeReminders.filter(r => r.status === 'sent').length;
    const scheduled = programmeReminders.filter(r => r.status === 'scheduled').length;
    const cancelled = programmeReminders.filter(r => r.status === 'cancelled').length;

    return { total, sent, scheduled, cancelled };
  }, [programmeReminders]);

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
          {/* Reminder Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Reminder Overview
                </div>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setReminderData({...reminderData, programmeId: selectedProgrammeId});
                    setIsCreateReminderDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Reminder
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{reminderStats.total}</div>
                  <div className="text-sm text-gray-600">Total Reminders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{reminderStats.sent}</div>
                  <div className="text-sm text-gray-600">Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{reminderStats.scheduled}</div>
                  <div className="text-sm text-gray-600">Scheduled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{reminderStats.cancelled}</div>
                  <div className="text-sm text-gray-600">Cancelled</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reminders List */}
          <Card>
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Target Audience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programmeReminders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No reminders created for this programme
                      </TableCell>
                    </TableRow>
                  ) : (
                    programmeReminders.map(reminder => (
                      <TableRow key={reminder.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getTypeIcon(reminder.type)}</span>
                            <span className="capitalize">{reminder.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{reminder.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            {format(new Date(reminder.scheduledFor), 'MMM dd, yyyy HH:mm')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {reminder.targetAudience}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(reminder.status)}>
                            {reminder.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {reminder.status === 'scheduled' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendReminder(reminder.id)}
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                            )}
                            {reminder.status !== 'sent' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelReminder(reminder.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Upcoming Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {programmeReminders
                  .filter(r => r.status === 'scheduled' && new Date(r.scheduledFor) > new Date())
                  .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
                  .slice(0, 5)
                  .map(reminder => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getTypeIcon(reminder.type)}</span>
                        <div>
                          <p className="font-medium">{reminder.title}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(reminder.scheduledFor), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {reminder.targetAudience}
                      </Badge>
                    </div>
                  ))}
                {programmeReminders.filter(r => r.status === 'scheduled' && new Date(r.scheduledFor) > new Date()).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No upcoming reminders</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Create Reminder Dialog */}
      <Dialog open={isCreateReminderDialogOpen} onOpenChange={setIsCreateReminderDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={reminderData.type} 
                onValueChange={(value) => setReminderData({...reminderData, type: value as 'email' | 'sms' | 'push'})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">📧 Email</SelectItem>
                  <SelectItem value="sms">📱 SMS</SelectItem>
                  <SelectItem value="push">🔔 Push Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={reminderData.title}
                onChange={(e) => setReminderData({...reminderData, title: e.target.value})}
                placeholder="Reminder title"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={reminderData.message}
                onChange={(e) => setReminderData({...reminderData, message: e.target.value})}
                placeholder="Reminder message"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Scheduled For</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !reminderData.scheduledFor && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reminderData.scheduledFor ? format(reminderData.scheduledFor, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={reminderData.scheduledFor}
                    onSelect={(date) => setReminderData({...reminderData, scheduledFor: date || new Date()})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select 
                value={reminderData.targetAudience} 
                onValueChange={(value) => setReminderData({...reminderData, targetAudience: value as 'all' | 'registered' | 'waitlist'})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="registered">Registered Attendees</SelectItem>
                  <SelectItem value="waitlist">Waitlist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateReminderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReminder}>
              Create Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReminderManager;
