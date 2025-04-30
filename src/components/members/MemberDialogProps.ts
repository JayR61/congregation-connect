
import { Member } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member;
  onSave?: (member: Member) => void;  // Optional since not all usages provide it
}
