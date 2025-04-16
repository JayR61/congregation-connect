
import { useState, useEffect } from 'react';
import { Programme, ProgrammeAttendance } from '@/types';
import { toast } from '@/lib/toast';
import { saveProgrammes, saveAttendance } from '@/services/localStorage';

interface ProgrammeActionsProps {
  programmes: Programme[];
  setProgrammes: React.Dispatch<React.SetStateAction<Programme[]>>;
  attendance: ProgrammeAttendance[];
  setAttendance: React.Dispatch<React.SetStateAction<ProgrammeAttendance[]>>;
  currentUser: any;
}

export const useProgrammeActions = ({
  programmes,
  setProgrammes,
  attendance,
  setAttendance,
  currentUser,
}: ProgrammeActionsProps) => {
  // Save programmes to localStorage whenever they change
  useEffect(() => {
    saveProgrammes(programmes);
  }, [programmes]);

  // Save attendance to localStorage whenever it changes
  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);

  const addProgramme = (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => {
    try {
      const newProgramme: Programme = {
        id: `prog-${Date.now()}`,
        ...programmeData,
        currentAttendees: 0,
        attendees: [],
      };

      setProgrammes(prev => [...prev, newProgramme]);
      toast.success('Programme created successfully');
      return newProgramme;
    } catch (error) {
      console.error('Error adding programme:', error);
      toast.error('Failed to create programme');
      return null;
    }
  };

  const updateProgramme = (id: string, programmeData: Partial<Programme>) => {
    try {
      setProgrammes(prev => 
        prev.map(programme => 
          programme.id === id 
            ? { ...programme, ...programmeData } 
            : programme
        )
      );
      toast.success('Programme updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating programme:', error);
      toast.error('Failed to update programme');
      return false;
    }
  };

  const deleteProgramme = (id: string) => {
    try {
      setProgrammes(prev => prev.filter(programme => programme.id !== id));
      // Also remove related attendance records
      setAttendance(prev => prev.filter(record => record.programmeId !== id));
      toast.success('Programme deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting programme:', error);
      toast.error('Failed to delete programme');
      return false;
    }
  };

  const recordAttendance = (
    programmeId: string, 
    memberId: string, 
    date: Date, 
    isPresent: boolean, 
    notes?: string
  ) => {
    try {
      const newAttendance: ProgrammeAttendance = {
        id: `att-${Date.now()}`,
        programmeId,
        memberId,
        date,
        isPresent,
        notes
      };

      setAttendance(prev => [...prev, newAttendance]);
      
      // If present, update the programme's attendees list if not already there
      if (isPresent) {
        setProgrammes(prev => prev.map(prog => {
          if (prog.id === programmeId && !prog.attendees.includes(memberId)) {
            return {
              ...prog,
              currentAttendees: prog.currentAttendees + 1,
              attendees: [...prog.attendees, memberId]
            };
          }
          return prog;
        }));
      }

      toast.success('Attendance recorded successfully');
      return newAttendance;
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast.error('Failed to record attendance');
      return null;
    }
  };

  const exportProgrammesToCSV = () => {
    try {
      let csvContent = "Name,Type,Start Date,End Date,Location,Coordinator,Capacity,Attendees,Description\n";
      
      programmes.forEach(programme => {
        const startDate = new Date(programme.startDate).toISOString().split('T')[0];
        const endDate = programme.endDate ? new Date(programme.endDate).toISOString().split('T')[0] : '';
        
        csvContent += [
          `"${programme.name}"`,
          `"${programme.type}"`,
          `"${startDate}"`,
          `"${endDate}"`,
          `"${programme.location}"`,
          `"${programme.coordinator}"`,
          programme.capacity,
          programme.currentAttendees,
          `"${programme.description.replace(/"/g, '""')}"`
        ].join(',') + "\n";
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'church_programmes.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Programmes exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting programmes:', error);
      toast.error('Failed to export programmes');
      return false;
    }
  };

  const exportAttendanceToCSV = (programmeId: string) => {
    try {
      const programme = programmes.find(p => p.id === programmeId);
      if (!programme) {
        toast.error('Programme not found');
        return false;
      }
      
      const programmeAttendance = attendance.filter(a => a.programmeId === programmeId);
      if (programmeAttendance.length === 0) {
        toast.error('No attendance records found for this programme');
        return false;
      }
      
      let csvContent = "Date,Member ID,Status,Notes\n";
      
      programmeAttendance.forEach(record => {
        const date = new Date(record.date).toISOString().split('T')[0];
        const status = record.isPresent ? "Present" : "Absent";
        const notes = record.notes || "";
        
        csvContent += `"${date}","${record.memberId}","${status}","${notes}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${programme.name}_attendance.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Attendance records exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting attendance:', error);
      toast.error('Failed to export attendance records');
      return false;
    }
  };

  return {
    addProgramme,
    updateProgramme,
    deleteProgramme,
    recordAttendance,
    exportProgrammesToCSV,
    exportAttendanceToCSV
  };
};
