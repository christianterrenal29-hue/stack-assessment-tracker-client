import type { CourseOption, YearLevelOption } from './school-options';

export type AssessmentScheduleStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
export type CandidateAttendanceStatus = 'pending' | 'present' | 'absent' | 'no-show';
export type CandidateAssessmentResult = 'pending' | 'competent' | 'not_yet_competent';
export type ChecklistStatus = 'pending' | 'submitted' | 'verified' | 'missing';

export interface UserSummary {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: string;
}

export interface StudentSummary {
  _id: string;
  studentId: string;
  course?: CourseOption;
  yearLevel?: YearLevelOption;
  user?: UserSummary;
}

export interface AssessmentCandidate {
  student: StudentSummary;
  attendanceStatus: CandidateAttendanceStatus;
  result: CandidateAssessmentResult;
  remarks?: string;
}

export interface AssessmentChecklist {
  applicationFormSubmitted: boolean;
  selfAssessmentGuideSubmitted: boolean;
  passportPhotosSubmitted: boolean;
  assessmentFeeOrAdmissionSlip: boolean;
  attendanceSheetStatus: ChecklistStatus;
  carsRatingSheetStatus: ChecklistStatus;
}

export interface AssessmentSchedule {
  _id: string;
  title: string;
  course: CourseOption;
  yearLevel: YearLevelOption;
  qualificationTitle: string;
  ncLevel: string;
  scheduleDateTime: string;
  assessmentCenter: string;
  labRoom?: string;
  assessor: UserSummary | string;
  assessorName: string;
  qualificationHandled: string;
  maxCandidates: number;
  candidates: AssessmentCandidate[];
  checklist: AssessmentChecklist;
  toolsMaterialsChecklist?: string;
  status: AssessmentScheduleStatus;
}

export interface AssessmentDashboardSummary {
  upcomingAssessmentSchedules: number;
  totalCandidatesScheduled: number;
  completedAssessments: number;
  competentCount: number;
  notYetCompetentCount: number;
  absentNoShowCandidates: number;
  pendingResults?: number;
  missingRequirements?: number;
  upcomingSchedules: AssessmentSchedule[];
}

export const formatCandidateName = (candidate: AssessmentCandidate) => {
  const user = candidate.student?.user;
  if (!user) return candidate.student?.studentId ?? 'Candidate';
  return `${user.firstName} ${user.lastName}`;
};

export const formatAssessorName = (assessor: AssessmentSchedule['assessor'], fallback: string) => {
  if (typeof assessor === 'object' && assessor) return `${assessor.firstName} ${assessor.lastName}`;
  return fallback;
};
