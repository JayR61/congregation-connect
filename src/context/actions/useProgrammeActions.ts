
import { Programme, User } from '@/types';

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
  
  return {
    addProgramme,
    updateProgramme,
    deleteProgramme
  };
};
