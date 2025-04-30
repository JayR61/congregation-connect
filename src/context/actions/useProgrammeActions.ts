import { Programme } from '@/types';

// Define proper type for required properties in a new programme
interface ProgrammeActionsProps {
  programmes: Programme[];
  setProgrammes: React.Dispatch<React.SetStateAction<Programme[]>>;
  attendance?: any[];
  setAttendance?: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser?: any;
}

export const useProgrammeActions = ({
  programmes,
  setProgrammes,
  currentUser
}: ProgrammeActionsProps) => {
  const addProgramme = (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => {
    // Ensure all required properties are present, including status
    const programme: Programme = {
      ...programmeData,
      id: `programme-${Date.now()}`,
      currentAttendees: 0,
      attendees: [],
      status: programmeData.status || 'planning',
    };
    
    setProgrammes(prev => [...prev, programme]);
    return programme;
  };

  // Keep other methods

  return {
    addProgramme,
    updateProgramme: (id: string, data: Partial<Programme>) => {
      setProgrammes(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      return true;
    },
    deleteProgramme: (id: string) => {
      setProgrammes(prev => prev.filter(p => p.id !== id));
      return true;
    }
  };
};
