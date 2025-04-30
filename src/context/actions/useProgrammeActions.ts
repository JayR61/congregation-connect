
import { Programme, User } from '@/types';

interface AttendanceData {
  programmeId: string;
  memberId: string;
  date: Date;
  isPresent: boolean;
  notes?: string;
}

interface UseProgrammeActionsProps {
  programmes: Programme[];
  setProgrammes: React.Dispatch<React.SetStateAction<Programme[]>>;
  currentUser: User;
}

export const useProgrammeActions = ({
  programmes,
  setProgrammes,
  currentUser
}: UseProgrammeActionsProps) => {
  
  const addProgramme = (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => {
    const newProgramme: Programme = {
      ...programmeData,
      id: `programme-${Date.now()}`,
      currentAttendees: 0,
      attendees: [],
    };
    
    setProgrammes(prev => [...prev, newProgramme]);
    return newProgramme;
  };
  
  const updateProgramme = (id: string, updatedFields: Partial<Programme>) => {
    let found = false;
    
    setProgrammes(prev => 
      prev.map(programme => {
        if (programme.id === id) {
          found = true;
          return { 
            ...programme, 
            ...updatedFields
          };
        }
        return programme;
      })
    );
    
    return found;
  };
  
  const deleteProgramme = (id: string) => {
    let found = false;
    
    setProgrammes(prev => {
      const filtered = prev.filter(programme => {
        if (programme.id === id) {
          found = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    
    return found;
  };

  const recordAttendance = (data: AttendanceData) => {
    // Implementation for the recordAttendance function
    // This would typically update attendance records in a real app
    console.log("Recording attendance:", data);
    return true;
  };
  
  return {
    addProgramme,
    updateProgramme,
    deleteProgramme,
    recordAttendance
  };
};
