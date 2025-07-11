
import React from 'react';
import { Programme } from '@/types';

export interface ProgrammeFormProps {
  programme?: Programme | null;
  onSubmit: (programmeData: Omit<Programme, "id">) => void;
  onCancel: () => void;
}

const ProgrammeForm = ({ programme, onSubmit, onCancel }: ProgrammeFormProps) => {
  return (
    <div>
      <h3>Programme Form</h3>
      <p>{programme ? 'Edit' : 'Add'} Programme</p>
    </div>
  );
};

export default ProgrammeForm;
