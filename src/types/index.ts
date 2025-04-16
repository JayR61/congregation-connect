
// Add this type definition at the end of the file

export interface ProgrammeStatistics {
  totalProgrammes: number;
  activeProgrammes: number;
  completedProgrammes: number;
  totalParticipants: number;
  attendanceRate: number;
  programmesByType: Record<string, number>;
  participantsTrend: {
    month: string;
    count: number;
  }[];
}
