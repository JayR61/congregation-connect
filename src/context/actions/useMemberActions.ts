
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
      updatedAt: new Date()
    };
    
    setMembers(prev => [...prev, newMember]);
    toast.success("Member added successfully");
  };

  const updateMember = (id: string, member: Partial<Member>) => {
    setMembers(prev => 
      prev.map(m => 
        m.id === id 
          ? { ...m, ...member, updatedAt: new Date() } 
          : m
      )
    );
    toast.success("Member updated successfully");
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success("Member removed successfully");
  };

  return {
    addMember,
    updateMember,
    deleteMember
  };
};
