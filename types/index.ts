export type UserRole = 'administrator' | 'instructor' | 'assessor' | 'student';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  institution?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  status: string;
  data: {
    user: Omit<User, 'createdAt' | 'updatedAt' | 'isActive' | 'lastLogin'>;
    token: string;
  };
}

export interface Institution {
  _id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  institution: string;
  head?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  _id: string;
  type: 'mcq' | 'short-answer' | 'essay' | 'file-upload';
  question: string;
  points: number;
  options?: string[];
  correctAnswer?: string;
  rubric?: string;
}

export interface Assessment {
  _id: string;
  title: string;
  description: string;
  type: 'formative' | 'summative' | 'diagnostic';
  subject: string;
  course: 'IT' | 'HRMT' | 'ECT' | 'HST';
  yearLevel: '1st Year' | '2nd Year' | '3rd Year';
  createdBy: string;
  institution: string;
  department?: string;
  learningOutcomes: string[];
  questions: Question[];
  totalPoints: number;
  dueDate: Date;
  releaseDate: Date;
  status: 'draft' | 'published' | 'closed';
  canResubmit: boolean;
  maxSubmissions: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentDistribution {
  _id: string;
  assessment: string;
  distributedTo: string[];
  distributedBy: string;
  class: string;
  distributedAt: Date;
  deadline: Date;
  reminderSent: boolean;
  status: 'pending' | 'in-progress' | 'submitted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  questionId: string;
  answerType: 'mcq' | 'short-answer' | 'essay' | 'file-upload';
  answer: string;
  submittedAt: Date;
}

export interface Submission {
  _id: string;
  assessment: string;
  student: string;
  distributedAssessment: string;
  answers: Answer[];
  submittedAt: Date;
  submissionNumber: number;
  status: 'draft' | 'submitted' | 'graded';
  markedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RubricScore {
  criterion: string;
  score: number;
  feedback: string;
}

export interface Grade {
  questionId: string;
  score: number;
  rubricScores: RubricScore[];
  feedback: string;
}

export interface GradingRecord {
  _id: string;
  submission: string;
  gradedBy: string;
  grades: Grade[];
  totalScore: number;
  totalPoints: number;
  percentage: number;
  overallFeedback: string;
  gradedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Level {
  level: string;
  points: number;
  description: string;
}

export interface Criterion {
  _id: string;
  criterion: string;
  description: string;
  maxPoints: number;
  levels: Level[];
}

export interface Rubric {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  institution: string;
  criteria: Criterion[];
  totalPoints: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectPerformance {
  subject: string;
  averageScore: number;
  assessmentCount: number;
}

export interface PerformanceMetrics {
  totalAssessments: number;
  submittedAssessments: number;
  averageScore: number;
  lowestScore: number;
  highestScore: number;
  submissionRate: number;
  onTimeSubmissions: number;
  lateSubmissions: number;
  gradeTrend: number[];
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
}

export interface StudentPerformance {
  _id: string;
  student: string;
  institution: string;
  department?: string;
  performanceMetrics: PerformanceMetrics;
  subjectPerformance: SubjectPerformance[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface AuditLog {
  _id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, any>;
  ipAddress: string;
  timestamp: Date;
}

export interface FileUpload {
  _id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedFor: string;
  url: string;
  createdAt: Date;
}
