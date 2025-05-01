
import React from 'react';

export interface AttendanceReportDialogProps {
  programmeId?: string;
  programmes?: any[];
  onClose: () => void;
}

export const AttendanceReportDialog = ({ 
  programmeId,
  programmes = [],
  onClose
}: AttendanceReportDialogProps) => {
  return (
    <div>
      <h3>Attendance Report</h3>
      <p>Programme ID: {programmeId}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AttendanceReportDialog;
