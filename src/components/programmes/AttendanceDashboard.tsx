
import React from 'react';
import { Member, Programme, ProgrammeAttendance } from '@/types';

export interface AttendanceDashboardProps {
  programmes: Programme[];
  members: Member[];
  attendance: ProgrammeAttendance[];
}

export const AttendanceDashboard = ({ 
  programmes, 
  members, 
  attendance = [] 
}: AttendanceDashboardProps) => {
  return (
    <div className="space-y-4">
      <p>Attendance Dashboard</p>
      <p>Programmes: {programmes.length}</p>
      <p>Members: {members.length}</p>
      <p>Attendance records: {attendance.length}</p>
    </div>
  );
};

export default AttendanceDashboard;
