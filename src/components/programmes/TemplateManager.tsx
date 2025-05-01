
import React from 'react';
import { Programme } from '@/types';

export interface TemplateManagerProps {
  onCreateTemplate: (template: any) => any;
  onCreateFromTemplate: (templateId: string, newProgrammeData: Omit<Programme, "id">) => Programme;
}

export const TemplateManager = ({
  onCreateTemplate,
  onCreateFromTemplate
}: TemplateManagerProps) => {
  return (
    <div>
      <h3>Template Manager Component</h3>
      <p>Create and manage templates for programmes</p>
    </div>
  );
};

export default TemplateManager;
