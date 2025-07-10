import { MentorshipProgram, MentorshipSession } from '@/types/mentorship.types';

export const mockMentorshipPrograms: MentorshipProgram[] = [
  {
    id: "program-1",
    name: "New Member Mentorship",
    description: "A comprehensive program to help new members integrate into church life and build meaningful relationships.",
    startDate: new Date(2024, 0, 15),
    endDate: new Date(2024, 5, 15),
    mentors: ["member-2", "user-1"],
    mentees: ["member-1", "user-3"],
    status: "active",
    goals: [
      "Help new members understand church values and mission",
      "Build strong relationships within the congregation",
      "Identify spiritual gifts and ministry opportunities",
      "Provide ongoing spiritual support and guidance"
    ],
    resources: [
      "New Member Handbook",
      "Spiritual Gifts Assessment",
      "Church History Guide"
    ],
    notes: "Monthly progress reviews scheduled",
    progress: 65
  },
  {
    id: "program-2",
    name: "Youth Leadership Development",
    description: "Developing the next generation of church leaders through mentorship and practical ministry experience.",
    startDate: new Date(2024, 1, 1),
    endDate: new Date(2024, 11, 31),
    mentors: ["user-2", "user-4"],
    mentees: ["user-5", "user-6", "user-7"],
    status: "active",
    goals: [
      "Develop leadership skills in young adults",
      "Provide ministry experience opportunities",
      "Build confidence in public speaking and teaching",
      "Foster spiritual maturity and responsibility"
    ],
    resources: [
      "Leadership Training Manual",
      "Public Speaking Workshop Materials",
      "Ministry Opportunity Directory"
    ],
    notes: "Weekly meetings every Tuesday",
    progress: 40
  },
  {
    id: "program-3",
    name: "Ministry Transition Support",
    description: "Supporting members transitioning into new ministry roles with experienced mentors.",
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 7, 31),
    mentors: ["user-1", "user-3"],
    mentees: ["user-8", "user-9"],
    status: "active",
    goals: [
      "Smooth transition into ministry leadership",
      "Understand ministry best practices",
      "Build network of ministry colleagues",
      "Develop ministry-specific skills"
    ],
    resources: [
      "Ministry Leadership Guide",
      "Best Practices Handbook",
      "Ministry Planning Templates"
    ],
    notes: "Bi-weekly check-ins and monthly group sessions",
    progress: 75
  },
  {
    id: "program-4",
    name: "Spiritual Growth Partnership",
    description: "One-on-one mentorship focused on deepening spiritual life and biblical understanding.",
    startDate: new Date(2023, 9, 1),
    endDate: new Date(2024, 3, 1),
    mentors: ["user-2"],
    mentees: ["user-10"],
    status: "completed",
    goals: [
      "Deepen understanding of Scripture",
      "Develop consistent prayer life",
      "Explore spiritual disciplines",
      "Build strong foundation for faith journey"
    ],
    resources: [
      "Study Bible",
      "Prayer Journal",
      "Spiritual Disciplines Workbook"
    ],
    notes: "Successfully completed with excellent outcomes",
    progress: 100
  }
];

export const mockMentorshipSessions: MentorshipSession[] = [
  {
    id: "session-1",
    programId: "program-1",
    date: new Date(2024, 2, 15, 10, 0),
    duration: 60,
    title: "Church History & Values",
    description: "Overview of church history, core values, and mission statement",
    status: "completed",
    notes: "Great engagement and thoughtful questions",
    attendees: ["member-2", "member-1"]
  },
  {
    id: "session-2",
    programId: "program-1",
    date: new Date(2024, 2, 22, 10, 0),
    duration: 90,
    title: "Spiritual Gifts Discovery",
    description: "Assessment and discussion of individual spiritual gifts",
    status: "completed",
    notes: "Identified strong gifts in teaching and hospitality",
    attendees: ["member-2", "member-1"]
  },
  {
    id: "session-3",
    programId: "program-2",
    date: new Date(2024, 2, 20, 18, 0),
    duration: 120,
    title: "Leadership Fundamentals",
    description: "Basic principles of Christian leadership and servant leadership",
    status: "scheduled",
    attendees: ["user-2", "user-5", "user-6"]
  },
  {
    id: "session-4",
    programId: "program-3",
    date: new Date(2024, 2, 18, 14, 0),
    duration: 75,
    title: "Ministry Planning Workshop",
    description: "Hands-on session for planning and organizing ministry activities",
    status: "scheduled",
    attendees: ["user-1", "user-8", "user-9"]
  }
];

export const mentorshipPrograms = mockMentorshipPrograms;
export const mentorshipSessions = mockMentorshipSessions;

export const getMentorshipPrograms = () => mockMentorshipPrograms;
export const getMentorshipSessions = (programId?: string) => {
  if (programId) {
    return mockMentorshipSessions.filter(session => session.programId === programId);
  }
  return mockMentorshipSessions;
};