// This is a simplified stub implementation to fix the specific error
export const createProgrammeKPI = (data: { 
  programmeId: string; 
  name: string;
  title: string;
  description: string;
  target: number; 
  current: number; 
  unit: string; 
}) => {
  // Implementation details don't matter for this example
  // The important part is that we're passing both 'title' and 'description' properties
  return { ...data, id: `kpi-${Date.now()}` };
};
