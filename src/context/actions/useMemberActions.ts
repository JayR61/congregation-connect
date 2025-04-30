import { Member } from '@/types';
import { toast } from '@/lib/toast';

interface UseMemberActionsProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

export const useMemberActions = ({
  members,
  setMembers
}: UseMemberActionsProps) => {
  
  const addMember = (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMember: Member = {
      ...member,
      id: `member-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isLeadership: determineLeadershipStatus(member),
    };
    
    setMembers(prev => [...prev, newMember]);
    toast.success("Member added successfully");
    return newMember;
  };

  // Helper function to determine leadership status based on structures or positions
  const determineLeadershipStatus = (member: Partial<Member>): boolean => {
    // Check structures
    const hasLeadershipStructure = member.structures?.some(s => 
      s === 'senior_leadership' || s === 'youth_leadership'
    ) || false;
    
    // Check positions
    const hasLeadershipPosition = member.positions?.some(p => 
      p.structure === 'senior_leadership' || p.structure === 'youth_leadership'
    ) || false;
    
    return hasLeadershipStructure || hasLeadershipPosition;
  };

  const updateMember = (id: string, updatedFields: Partial<Member>) => {
    let updated = false;
    
    setMembers(prev => 
      prev.map(member => {
        if (member.id === id) {
          updated = true;
          // Handle newMemberDate property
          const updatedMember = {
            ...member,
            ...updatedFields,
          };
          
          return updatedMember;
        }
        return member;
      })
    );
    
    return updated;
  };

  const deleteMember = (id: string) => {
    let deleted = false;
    
    // Also remove this member from any family relationships
    setMembers(prev => {
      // First, check if the member exists
      const memberToDelete = prev.find(m => m.id === id);
      if (!memberToDelete) return prev;
      
      deleted = true;
      const updatedMembers = prev.filter(m => m.id !== id);
      
      // Update family relationships for remaining members
      return updatedMembers.map(m => {
        if (m.familyIds && m.familyIds.includes(id)) {
          return {
            ...m,
            familyIds: m.familyIds.filter(fid => fid !== id),
            updatedAt: new Date()
          };
        }
        if (m.familyId === id) {
          return {
            ...m,
            familyId: null,
            updatedAt: new Date()
          };
        }
        return m;
      });
    });
    
    if (deleted) {
      toast.success("Member removed successfully");
    }
    
    return deleted;
  };

  // Function to check for members that should be automatically upgraded
  const checkMemberStatusUpdates = () => {
    const currentDate = new Date();
    let updates = false;
    
    setMembers(prev => 
      prev.map(member => {
        // Check if new members should be converted to regular (after 60 days)
        if (member.category === 'new' && member.newMemberDate) {
          const newMemberDate = new Date(member.newMemberDate);
          const daysSinceNewMember = Math.floor((currentDate.getTime() - newMemberDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceNewMember >= 60) {
            updates = true;
            toast.success(`${member.firstName} ${member.lastName} is now a regular member`);
            return {
              ...member,
              category: 'regular' as const,
              newMemberDate: undefined,
              updatedAt: new Date()
            };
          }
        }
        
        // Check if regular members can become full members (after 2 years)
        if ((member.category === 'regular') && !member.isFullMember && member.joinDate) {
          const joinDate = new Date(member.joinDate);
          const yearsSinceJoining = (currentDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
          
          if (yearsSinceJoining >= 2) {
            // Just notify, don't automatically change
            toast.info(`${member.firstName} ${member.lastName} is eligible to become a full member`);
          }
        }
        
        // Check if member should be added to leadership based on their positions or structures
        if (!member.isLeadership && (member.structures || member.positions)) {
          const shouldBeLeadership = determineLeadershipStatus(member);
          if (shouldBeLeadership) {
            updates = true;
            return {
              ...member,
              isLeadership: true,
              updatedAt: new Date()
            };
          }
        }
        
        return member;
      })
    );
    
    return updates;
  };

  return {
    addMember,
    updateMember,
    deleteMember,
    checkMemberStatusUpdates
  };
};
