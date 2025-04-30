
// This is a simplified stub implementation focused on fixing the specific error

export const createReminder = (data: { 
  recipients: string[]; 
  programmeId: string; 
  title: string; 
  message: string; 
  scheduledDate: Date; 
  status: "pending" | "sent" | "failed" | "scheduled" | "cancelled";
}) => {
  // Fix: convert scheduledDate to scheduledTime and ensure correct status types
  return {
    ...data,
    scheduledTime: data.scheduledDate, // Using the correct property name
    id: `reminder-${Date.now()}`
  };
};

// Fix the status comparisons with proper enum checking
export const isReminderable = (status: string) => {
  // Check if status is not one of the disallowed values
  return status !== 'sent' && status !== 'failed' && status !== 'cancelled';
};

export const isReschedulable = (status: string) => {
  // Check if status is not one of the disallowed values
  return status !== 'sent' && status !== 'cancelled';
};

export const isCancellable = (status: string) => {
  // Check if status is not one of the disallowed values
  return status !== 'sent' && status !== 'cancelled';
};
