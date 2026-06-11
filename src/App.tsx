import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Providers } from '@/app/providers';
import { useAuth } from '@/context/auth-context';
import { getDashboardPath } from '@/lib/routes';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';

const LoginPage = lazy(() => import('@/app/auth/login/page'));
const RegisterPage = lazy(() => import('@/app/auth/register/page'));
const PrivacyPage = lazy(() => import('@/app/privacy/page'));
const TermsPage = lazy(() => import('@/app/terms/page'));
const AdminDashboard = lazy(() => import('@/app/dashboard/admin/page'));
const InstructorDashboard = lazy(() => import('@/app/dashboard/instructor/page'));
const AssessorDashboard = lazy(() => import('@/app/dashboard/assessor/page'));
const StudentDashboard = lazy(() => import('@/app/dashboard/student/page'));
const UsersPage = lazy(() => import('@/app/admin/users/page'));
const InstitutionsPage = lazy(() => import('@/app/admin/institutions/page'));
const DepartmentsPage = lazy(() => import('@/app/admin/departments/page'));
const CompetenciesPage = lazy(() => import('@/app/admin/competencies/page'));
const InstructorStudentsPage = lazy(() => import('@/app/instructor/students/page'));
const InstructorAssessmentsPage = lazy(() => import('@/app/instructor/assessments/page'));
const AttendancePage = lazy(() => import('@/app/instructor/attendance/page'));
const OJTPage = lazy(() => import('@/app/instructor/ojt/page'));
const SubmissionsPage = lazy(() => import('@/app/assessor/submissions/page'));
const GradingPage = lazy(() => import('@/app/assessor/submissions/[id]/grade/page'));
const StudentDashboardPage = lazy(() => import('@/app/student/dashboard/page'));
const StudentAssessmentsPage = lazy(() => import('@/app/student/assessments/page'));
const StudentProgressPage = lazy(() => import('@/app/student/progress/page'));
const StudentCompetenciesListPage = lazy(() => import('@/app/student/competencies/page'));
const StudentAttendancePage = lazy(() => import('@/app/student/attendance/page'));
const StudentOJTLogPage = lazy(() => import('@/app/student/ojt/page'));
const CompetencyDetailsPage = lazy(() => import('@/app/student/competencies/[id]/page'));
const ProfilePage = lazy(() => import('@/app/profile/page'));
const SettingsPage = lazy(() => import('@/app/settings/page'));
const NotificationsPage = lazy(() => import('@/app/dashboard/notifications/page'));
const AtRiskStudentsPage = lazy(() => import('@/app/dashboard/at-risk-students/page'));
const UsersSwrPage = lazy(() => import('@/app/admin/users-swr/page'));
const ReportsPage = lazy(() => import('@/app/reports/page'));
const AdminReportsPage = lazy(() => import('@/app/dashboard/admin/reports/page'));
const CompliancePage = lazy(() => import('@/app/dashboard/admin/compliance/page'));
const AnalyticsPage = lazy(() => import('@/app/dashboard/admin/analytics/page'));
const DocumentsPage = lazy(() => import('@/app/documents/page'));
const AdminDocumentsPage = lazy(() => import('@/app/dashboard/admin/documents/page'));
const AuditLogsPage = lazy(() => import('@/app/audit-logs/page'));
const AdminAuditLogsPage = lazy(() => import('@/app/dashboard/admin/audit-logs/page'));

type AppRole = 'administrator' | 'instructor' | 'assessor' | 'student';

const adminRoles = ['administrator'] as const;
const instructorRoles = ['administrator', 'instructor'] as const;
const assessorRoles = ['administrator', 'assessor'] as const;
const documentRoles = ['administrator', 'instructor', 'assessor'] as const;
const studentRoles = ['student'] as const;

function protectedElement(element: ReactNode, roles?: AppRole[]) {
  return <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;
}

function dashboardElement(element: ReactNode, role: AppRole) {
  return <DashboardLayout role={role}>{element}</DashboardLayout>;
}

function PageFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      Loading...
    </main>
  );
}

function RootRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading...
      </main>
    );
  }

  return <Navigate to={user ? getDashboardPath(user.role) : '/auth/login'} replace />;
}

export default function App() {
  return (
    <Providers>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          <Route path="/dashboard" element={<RootRedirect />} />
          <Route path="/dashboard/admin" element={protectedElement(dashboardElement(<AdminDashboard />, 'administrator'), [...adminRoles])} />
          <Route path="/dashboard/instructor" element={protectedElement(dashboardElement(<InstructorDashboard />, 'instructor'), [...instructorRoles])} />
          <Route path="/dashboard/assessor" element={protectedElement(dashboardElement(<AssessorDashboard />, 'assessor'), [...assessorRoles])} />
          <Route path="/dashboard/student" element={protectedElement(dashboardElement(<StudentDashboard />, 'student'), [...studentRoles])} />
          <Route path="/admin/compliance" element={<Navigate to="/dashboard/admin/compliance" replace />} />
          <Route path="/admin/audit" element={<Navigate to="/dashboard/admin/audit-logs" replace />} />
          <Route path="/dashboard/notifications" element={protectedElement(<NotificationsPage />)} />
          <Route path="/dashboard/at-risk-students" element={protectedElement(<AtRiskStudentsPage />, [...instructorRoles])} />
          <Route path="/dashboard/instructor/class/welding" element={<Navigate to="/instructor/students" replace />} />
          <Route path="/dashboard/instructor/risk" element={<Navigate to="/dashboard/at-risk-students" replace />} />
          <Route path="/admin/users" element={protectedElement(<UsersPage />, [...adminRoles])} />
          <Route path="/admin/users-swr" element={protectedElement(<UsersSwrPage />, [...adminRoles])} />
          <Route path="/users" element={protectedElement(<UsersPage />, [...adminRoles])} />
          <Route path="/dashboard/admin/users" element={protectedElement(<UsersPage />, [...adminRoles])} />
          <Route path="/admin/institutions" element={protectedElement(<InstitutionsPage />, [...adminRoles])} />
          <Route path="/institutions" element={protectedElement(<InstitutionsPage />, [...adminRoles])} />
          <Route path="/admin/departments" element={protectedElement(<DepartmentsPage />, [...adminRoles])} />
          <Route path="/departments" element={protectedElement(<DepartmentsPage />, [...adminRoles])} />
          <Route path="/admin/competencies" element={protectedElement(<CompetenciesPage />, [...adminRoles])} />
          <Route path="/competencies" element={protectedElement(<CompetenciesPage />, [...adminRoles])} />
          <Route path="/instructor/students" element={protectedElement(<InstructorStudentsPage />, [...instructorRoles])} />
          <Route path="/dashboard/instructor/students" element={protectedElement(<InstructorStudentsPage />, [...instructorRoles])} />
          <Route path="/students" element={protectedElement(<InstructorStudentsPage />, [...instructorRoles])} />
          <Route path="/dashboard/admin/students" element={protectedElement(<InstructorStudentsPage />, [...adminRoles])} />
          <Route path="/instructor/assessments" element={protectedElement(<InstructorAssessmentsPage />, [...instructorRoles])} />
          <Route path="/dashboard/instructor/assessments" element={protectedElement(<InstructorAssessmentsPage />, [...instructorRoles])} />
          <Route path="/assessments" element={protectedElement(<InstructorAssessmentsPage />, [...instructorRoles])} />
          <Route path="/instructor/attendance" element={protectedElement(<AttendancePage />, [...instructorRoles])} />
          <Route path="/dashboard/instructor/attendance" element={protectedElement(<AttendancePage />, [...instructorRoles])} />
          <Route path="/attendance" element={protectedElement(<AttendancePage />, [...instructorRoles])} />
          <Route path="/instructor/ojt" element={protectedElement(<OJTPage />, [...instructorRoles])} />
          <Route path="/dashboard/instructor/ojt" element={protectedElement(<OJTPage />, [...instructorRoles])} />
          <Route path="/ojt" element={protectedElement(<OJTPage />, [...instructorRoles])} />
          <Route path="/assessor/submissions" element={protectedElement(<SubmissionsPage />, [...assessorRoles])} />
          <Route path="/assessor/grading" element={protectedElement(<SubmissionsPage />, [...assessorRoles])} />
          <Route path="/submissions" element={protectedElement(<SubmissionsPage />, [...assessorRoles])} />
          <Route path="/assessor/submissions/:id/grade" element={protectedElement(<GradingPage />, [...assessorRoles])} />
          <Route path="/grading/:id" element={protectedElement(<GradingPage />, [...assessorRoles])} />
          <Route path="/grading" element={protectedElement(<SubmissionsPage />, [...assessorRoles])} />
          <Route path="/student/dashboard" element={protectedElement(<StudentDashboardPage />, [...studentRoles])} />
          <Route path="/student/assessments" element={protectedElement(<StudentAssessmentsPage />, [...studentRoles])} />
          <Route path="/student/assessments/:id" element={<Navigate to="/student/assessments" replace />} />
          <Route path="/student/progress" element={protectedElement(<StudentProgressPage />, [...studentRoles])} />
          <Route path="/student/competencies" element={protectedElement(<StudentCompetenciesListPage />, [...studentRoles])} />
          <Route path="/student/attendance" element={protectedElement(<StudentAttendancePage />, [...studentRoles])} />
          <Route path="/student/ojt" element={protectedElement(<StudentOJTLogPage />, [...studentRoles])} />
          <Route path="/student/competencies/:id" element={protectedElement(<CompetencyDetailsPage />, [...studentRoles])} />
          <Route path="/reports" element={protectedElement(<ReportsPage />, [...adminRoles])} />
          <Route path="/dashboard/admin/reports" element={protectedElement(<AdminReportsPage />, [...adminRoles])} />
          <Route path="/dashboard/admin/compliance" element={protectedElement(<CompliancePage />, [...adminRoles])} />
          <Route path="/dashboard/admin/analytics" element={protectedElement(<AnalyticsPage />, [...adminRoles])} />
          <Route path="/documents" element={protectedElement(<DocumentsPage />, [...documentRoles])} />
          <Route path="/dashboard/admin/documents" element={protectedElement(<AdminDocumentsPage />, [...adminRoles])} />
          <Route path="/audit-logs" element={protectedElement(<AuditLogsPage />, [...adminRoles])} />
          <Route path="/dashboard/admin/audit-logs" element={protectedElement(<AdminAuditLogsPage />, [...adminRoles])} />
          <Route path="/profile" element={protectedElement(<ProfilePage />)} />
          <Route path="/settings" element={protectedElement(<SettingsPage />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Providers>
  );
}
