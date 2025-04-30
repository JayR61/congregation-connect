
import { Programme } from '@/types';

export interface ProgrammeFormProps {
  onSave: (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => void;
  onCancel: () => void;
  initialData: Partial<Programme> | {}; 
  isEditing: boolean;
}

const ProgrammeForm = ({ onSave, onCancel, initialData, isEditing }: ProgrammeFormProps) => {
  return (
    <div>Programme Form Component</div>
  );
};

export { ProgrammeForm };
export default ProgrammeForm;
