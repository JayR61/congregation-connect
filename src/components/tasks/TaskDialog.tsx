
// Just adding the createdBy field to the task creation to fix TS2345 error
export const fixTaskCreation = (task: any, currentUserId: string) => {
  return {
    ...task,
    createdBy: currentUserId
  };
};
