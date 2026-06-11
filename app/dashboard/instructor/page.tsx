import { Link } from 'react-router-dom';

export default function InstructorDashboard() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Instructor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage students, track attendance, and monitor OJT progress
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Students Enrolled</p>
                <p className="text-3xl font-bold text-foreground">-</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">At-Risk Students</p>
                <p className="text-3xl font-bold text-orange-600">-</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Avg Attendance</p>
                <p className="text-3xl font-bold text-green-600">-</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Active Assessments</p>
                <p className="text-3xl font-bold text-purple-600">-</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Classes */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">My Classes</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-foreground">Welding NC IV</h3>
                      <p className="text-sm text-muted-foreground">12 students enrolled</p>
                    </div>
                    <Link to="/dashboard/instructor/class/welding" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium">
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Tracking */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Quick Attendance</h2>
              <p className="text-muted-foreground text-sm mb-4">Record attendance for today</p>
              <Link to="/dashboard/instructor/attendance" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                Record Attendance
              </Link>
            </div>

            {/* Recent Student Actions */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Student Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Maria Garcia</p>
                    <p className="text-sm text-muted-foreground">Submitted assessment</p>
                  </div>
                  <p className="text-sm text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/dashboard/instructor/students" className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium text-sm">
                  Manage Students
                </Link>
                <Link to="/dashboard/instructor/attendance" className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center font-medium text-sm">
                  Record Attendance
                </Link>
                <Link to="/dashboard/instructor/ojt" className="block w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center font-medium text-sm">
                  OJT Tracking
                </Link>
                <Link to="/dashboard/instructor/risk" className="block w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-center font-medium text-sm">
                  At-Risk Students
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Notifications</h3>
              <div className="space-y-3">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-sm font-medium text-red-900">Student at Risk</p>
                  <p className="text-xs text-red-700">John Smith: Low attendance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
