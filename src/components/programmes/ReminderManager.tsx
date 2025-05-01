
import React from 'react';
import { Member, Programme, ProgrammeReminder } from '@/types';

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
  return (
    <div>
      <h3>Reminder Manager</h3>
      <p>Programmes: {programmes.length}</p>
      <p>Members: {members.length}</p>
      <p>Reminders: {reminders.length}</p>
    </div>
  );
};

export default ReminderManager;
