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
      // Set newMemberDate if the category is 'new'
      newMemberDate: member.category === 'new' ? new Date() : null,
      // Ensure attachments exists
      attachments: member.attachments || [],
      // Determine if this is a leadership member based on structures or positions
      isLeadership: determineLeadershipStatus(member)
    };
    
    setMembers(prev => [...prev, newMember]);
    toast.success("Member added successfully");
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

  const updateMember = (id: string, member: Partial<Member>) => {
    setMembers(prev => 
      prev.map(m => {
        if (m.id === id) {
          // Handle category change from regular to new
          if (member.category === 'new' && m.category !== 'new') {
            member.newMemberDate = new Date();
          }
          
          // Handle category change from new to something else
          if (m.category === 'new' && member.category && member.category !== 'new') {
            member.newMemberDate = null;
          }
          
          // Determine leadership status when relevant fields change
          if (member.structures || member.positions) {
            const updatedMember = { ...m, ...member };
            member.isLeadership = determineLeadershipStatus(updatedMember);
          }
          
          return { 
            ...m, 
            ...member, 
            updatedAt: new Date() 
          };
        }
        return m;
      })
    );
    toast.success("Member updated successfully");
  };

  const deleteMember = (id: string) => {
    // Also remove this member from any family relationships
    setMembers(prev => {
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
    
    toast.success("Member removed successfully");
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
              newMemberDate: null,
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
