
import { Member } from '@/types';

export interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member;
  onSave?: (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => void;
}
