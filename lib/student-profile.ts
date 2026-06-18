import { apiClient } from '@/lib/api-client';
import { StudentSummary, UserSummary } from '@/lib/assessment-types';

export interface CurrentStudentProfile {
  user?: Partial<UserSummary> & { role?: string };
  student: StudentSummary | null;
}

type StudentProfileApiResponse = CurrentStudentProfile | StudentSummary;

const isProfileResponse = (value: StudentProfileApiResponse): value is CurrentStudentProfile => {
  return Object.prototype.hasOwnProperty.call(value, 'student');
};

export async function getStudentProfile(): Promise<StudentSummary | null> {
  const profile = await apiClient.get<StudentProfileApiResponse>('/students/user/profile');
  return isProfileResponse(profile) ? profile.student : profile;
}
