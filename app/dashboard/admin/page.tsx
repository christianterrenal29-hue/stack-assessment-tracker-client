import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Administrator Dashboard
          </h1>
          <p className="text-muted-foreground">
            System overview, compliance reports, and user management
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Students</p>
                <p className="text-3xl font-bold text-foreground">-</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* At-Risk Students */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">At-Risk Students</p>
                <p className="text-3xl font-bold text-red-600">-</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* System Compliance */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">System Compliance</p>
                <p className="text-3xl font-bold text-green-600">100%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Courses */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Active Courses</p>
                <p className="text-3xl font-bold text-foreground">-</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25m20-11.002c0 5.251-4.5 9.999-10 9.999" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Risk Overview */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 border border-border mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Risk Overview</h2>
              
              {/* Risk Distribution */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <p className="text-green-900 text-sm font-medium mb-1">Low Risk</p>
                  <p className="text-3xl font-bold text-green-600">-</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                  <p className="text-yellow-900 text-sm font-medium mb-1">Medium Risk</p>
                  <p className="text-3xl font-bold text-yellow-600">-</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                  <p className="text-red-900 text-sm font-medium mb-1">High Risk</p>
                  <p className="text-3xl font-bold text-red-600">-</p>
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                Loading real-time analytics...
              </p>
            </div>

            {/* Recent Actions */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Recent Actions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Student enrolled</p>
                    <p className="text-sm text-muted-foreground">John Smith in Welding NC IV</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="bg-card rounded-lg p-6 border border-border h-fit">
            <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/dashboard/admin/students" className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium">
                Manage Students
              </Link>
              <Link to="/dashboard/admin/users" className="block w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center font-medium">
                Manage Users
              </Link>
              <Link to="/dashboard/admin/compliance" className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center font-medium">
                Compliance Report
              </Link>
              <Link to="/dashboard/admin/analytics" className="block w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center font-medium">
                View Analytics
              </Link>
            </div>

            <hr className="my-6 border-border" />

            <h3 className="text-lg font-bold text-foreground mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm">Database</span>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm">API Server</span>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm">Email Service</span>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
