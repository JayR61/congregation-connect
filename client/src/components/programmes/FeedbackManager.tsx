
import React from 'react';
import { Member, Programme, ProgrammeFeedback } from '@/types';

export interface FeedbackManagerProps {
  programmes: Programme[];
  feedback: ProgrammeFeedback[];
  members: Member[];
  onAddFeedback: (feedback: Omit<ProgrammeFeedback, "id">) => ProgrammeFeedback;
}

export const FeedbackManager = ({
  programmes = [],
  feedback = [],
  members = [],
  onAddFeedback
}: FeedbackManagerProps) => {
  return (
    <div>
      <h3>Feedback Manager</h3>
      <p>Programmes: {programmes.length}</p>
      <p>Feedback entries: {feedback.length}</p>
    </div>
  );
};

export default FeedbackManager;
