
// Fix for addMentorshipProgram function
export const createMentorshipProgram = (programData: any) => {
  return {
    id: `program-${Date.now()}`,
    ...programData,
    mentors: programData.mentors || [],
    mentees: [programData.menteeId]
  };
};
