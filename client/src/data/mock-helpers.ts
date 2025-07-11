
// Helper function to fix member data properties
export const fixMemberData = (members: any[]) => {
  return members.map(member => ({
    ...member,
    skills: Array.isArray(member.skills) ? member.skills : member.skills ? [member.skills] : [],
    interests: Array.isArray(member.interests) ? member.interests : member.interests ? [member.interests] : [],
    // Add any other fields that need to be arrays
  }));
};

// Helper function to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount);
};

// Helper function to format dates
export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
