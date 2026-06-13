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
const SubmissionsPage = lazy(() => import('@/app/assessor/submissions/page'));
const GradingPage = lazy(() => import('@/app/assessor/submissions/[id]/grade/page'));
const StudentAssessmentsPage = lazy(() => import('@/app/student/assessments/page'));
const StudentCompetenciesListPage = lazy(() => import('@/app/student/competencies/page'));
const StudentAttendancePage = lazy(() => import('@/app/student/attendance/page'));
const CompetencyDetailsPage = lazy(() => import('@/app/student/competencies/[id]/page'));
const ProfilePage = lazy(() => import('@/app/profile/page'));
const SettingsPage = lazy(() => import('@/app/settings/page'));
const NotificationsPage = lazy(() => import('@/app/dashboard/notifications/page'));
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

function dashboardElement(element: ReactNode, role?: AppRole) {
  return <DashboardLayout role={role}>{element}</DashboardLayout>;
}

function protectedDashboardElement(element: ReactNode, roles?: AppRole[], role?: AppRole) {
  return protectedElement(dashboardElement(element, role), roles);
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
          <Route path="/dashboard/admin" element={protectedDashboardElement(<AdminDashboard />, [...adminRoles], 'administrator')} />
          <Route path="/dashboard/instructor" element={protectedDashboardElement(<InstructorDashboard />, [...instructorRoles], 'instructor')} />
          <Route path="/dashboard/assessor" element={protectedDashboardElement(<AssessorDashboard />, [...assessorRoles], 'assessor')} />
          <Route path="/dashboard/student" element={protectedDashboardElement(<StudentDashboard />, [...studentRoles], 'student')} />
          <Route path="/admin/compliance" element={<Navigate to="/dashboard/admin/compliance" replace />} />
          <Route path="/admin/audit" element={<Navigate to="/dashboard/admin/audit-logs" replace />} />
          <Route path="/dashboard/notifications" element={protectedDashboardElement(<NotificationsPage />)} />
          <Route path="/dashboard/instructor/class/welding" element={<Navigate to="/instructor/students" replace />} />
          <Route path="/admin/users" element={protectedDashboardElement(<UsersPage />, [...adminRoles], 'administrator')} />
          <Route path="/admin/users-swr" element={protectedDashboardElement(<UsersSwrPage />, [...adminRoles], 'administrator')} />
          <Route path="/users" element={protectedDashboardElement(<UsersPage />, [...adminRoles], 'administrator')} />
          <Route path="/dashboard/admin/users" element={protectedDashboardElement(<UsersPage />, [...adminRoles], 'administrator')} />
          <Route path="/admin/institutions" element={protectedDashboardElement(<InstitutionsPage />, [...adminRoles], 'administrator')} />
          <Route path="/institutions" element={protectedDashboardElement(<InstitutionsPage />, [...adminRoles], 'administrator')} />
          <Route path="/admin/departments" element={protectedDashboardElement(<DepartmentsPage />, [...adminRoles], 'administrator')} />
          <Route path="/departments" element={protectedDashboardElement(<DepartmentsPage />, [...adminRoles], 'administrator')} />
          <Route path="/admin/competencies" element={protectedDashboardElement(<CompetenciesPage />, [...adminRoles], 'administrator')} />
          <Route path="/competencies" element={protectedDashboardElement(<CompetenciesPage />, [...adminRoles], 'administrator')} />
          <Route path="/instructor/students" element={protectedDashboardElement(<InstructorStudentsPage />, [...instructorRoles], 'instructor')} />
          <Route path="/dashboard/instructor/students" element={protectedDashboardElement(<InstructorStudentsPage />, [...instructorRoles], 'instructor')} />
          <Route path="/students" element={protectedDashboardElement(<InstructorStudentsPage />, [...instructorRoles], 'instructor')} />
          <Route path="/dashboard/admin/students" element={protectedDashboardElement(<InstructorStudentsPage />, [...adminRoles], 'administrator')} />
          <Route path="/instructor/assessments" element={protectedDashboardElement(<InstructorAssessmentsPage />, [...instructorRoles], 'instructor')} />
          <Route path="/dashboard/instructor/assessments" element={protectedDashboardElement(<InstructorAssessmentsPage />, [...instructorRoles], 'instructor')} />
          <Route path="/assessments" element={protectedDashboardElement(<InstructorAssessmentsPage />, [...instructorRoles], 'instructor')} />
          <Route path="/instructor/attendance" element={protectedDashboardElement(<AttendancePage />, [...instructorRoles], 'instructor')} />
          <Route path="/dashboard/instructor/attendance" element={protectedDashboardElement(<AttendancePage />, [...instructorRoles], 'instructor')} />
          <Route path="/attendance" element={protectedDashboardElement(<AttendancePage />, [...instructorRoles], 'instructor')} />
          <Route path="/assessor/submissions" element={protectedDashboardElement(<SubmissionsPage />, [...assessorRoles], 'assessor')} />
          <Route path="/assessor/grading" element={protectedDashboardElement(<SubmissionsPage />, [...assessorRoles], 'assessor')} />
          <Route path="/submissions" element={protectedDashboardElement(<SubmissionsPage />, [...assessorRoles], 'assessor')} />
          <Route path="/assessor/submissions/:id/grade" element={protectedDashboardElement(<GradingPage />, [...assessorRoles], 'assessor')} />
          <Route path="/grading/:id" element={protectedDashboardElement(<GradingPage />, [...assessorRoles], 'assessor')} />
          <Route path="/grading" element={protectedDashboardElement(<SubmissionsPage />, [...assessorRoles], 'assessor')} />
          <Route path="/student/dashboard" element={<Navigate to="/dashboard/student" replace />} />
          <Route path="/student/assessments" element={protectedDashboardElement(<StudentAssessmentsPage />, [...studentRoles], 'student')} />
          <Route path="/student/assessments/:id" element={<Navigate to="/student/assessments" replace />} />
          <Route path="/student/progress" element={<Navigate to="/student/assessments" replace />} />
          <Route path="/student/competencies" element={protectedDashboardElement(<StudentCompetenciesListPage />, [...studentRoles], 'student')} />
          <Route path="/student/attendance" element={protectedDashboardElement(<StudentAttendancePage />, [...studentRoles], 'student')} />
          <Route path="/student/competencies/:id" element={protectedDashboardElement(<CompetencyDetailsPage />, [...studentRoles], 'student')} />
          <Route path="/reports" element={protectedDashboardElement(<ReportsPage />, [...documentRoles])} />
          <Route path="/dashboard/admin/reports" element={protectedDashboardElement(<AdminReportsPage />, [...adminRoles], 'administrator')} />
          <Route path="/dashboard/admin/compliance" element={protectedDashboardElement(<CompliancePage />, [...adminRoles], 'administrator')} />
          <Route path="/dashboard/admin/analytics" element={protectedDashboardElement(<AnalyticsPage />, [...adminRoles], 'administrator')} />
          <Route path="/documents" element={protectedDashboardElement(<DocumentsPage />, [...documentRoles])} />
          <Route path="/dashboard/admin/documents" element={protectedDashboardElement(<AdminDocumentsPage />, [...adminRoles], 'administrator')} />
          <Route path="/audit-logs" element={protectedDashboardElement(<AuditLogsPage />, [...adminRoles], 'administrator')} />
          <Route path="/dashboard/admin/audit-logs" element={protectedDashboardElement(<AdminAuditLogsPage />, [...adminRoles], 'administrator')} />
          <Route path="/profile" element={protectedDashboardElement(<ProfilePage />)} />
          <Route path="/settings" element={protectedDashboardElement(<SettingsPage />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Providers>
  );
}
