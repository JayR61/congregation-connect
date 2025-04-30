
// This is a simplified stub implementation focused on fixing the specific error

export const createReminder = (data: { 
  recipients: string[]; 
  programmeId: string; 
  title: string; 
  message: string; 
  scheduledDate: Date; 
  status: "scheduled"; 
}) => {
  // Fix: convert scheduledDate to scheduledTime
  return {
    ...data,
    scheduledTime: data.scheduledDate, // Using the correct property name
    id: `reminder-${Date.now()}`
  };
};

// Fix the status comparisons
export const isReminderable = (status: string) => {
  return status !== 'sent' && status !== 'failed' && status !== 'cancelled';
};

export const isReschedulable = (status: string) => {
  return status !== 'sent' && status !== 'cancelled';
};

export const isCancellable = (status: string) => {
  return status !== 'sent' && status !== 'cancelled';
};
