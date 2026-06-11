'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, AlertCircle } from 'lucide-react';
import { useUsers, useCreateUser } from '@/hooks/use-api';
import { TableSkeleton } from '@/components/loading-skeleton';
import { ApiErrorHandler } from '@/lib/api-client';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'administrator' | 'instructor' | 'assessor' | 'student';
  isActive: boolean;
  institution?: string;
  createdAt: string;
}

export default function UserManagementWithSWRPage() {
  const { users, error, isLoading, mutate } = useUsers();
  const createUser = useCreateUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'instructor',
  });

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      administrator: 'bg-red-100 text-red-800',
      instructor: 'bg-blue-100 text-blue-800',
      assessor: 'bg-green-100 text-green-800',
      student: 'bg-purple-100 text-purple-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const columns: Column<User>[] = [
    {
      key: 'firstName',
      label: 'Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: User) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      searchable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string) => (
        <Badge className={getRoleColor(value)}>{value}</Badge>
      ),
    },
    {
      key: 'institution',
      label: 'Institution',
      searchable: true,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date Joined',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleAddUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setSubmitError('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await createUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
      });

      // Refresh the user list
      mutate();

      // Reset form
      setFormData({ firstName: '', lastName: '', email: '', role: 'instructor' });
      setDialogOpen(false);
    } catch (err) {
      const errorMessage = ApiErrorHandler.handle(err);
      setSubmitError(errorMessage.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                User Management (SWR Integration)
              </h1>
              <p className="text-muted-foreground mt-1">
                API-driven user management with real-time updates
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account in the system
                  </DialogDescription>
                </DialogHeader>
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 text-sm flex gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {submitError}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                        })
                      }
                      placeholder="John"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Doe"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      placeholder="john@example.com"
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    onClick={handleAddUser}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Failed to load users</p>
                  <p className="text-sm text-red-800 mt-1">
                    {ApiErrorHandler.handle(error).message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {!isLoading && users && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Instructors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter((u: any) => u.role === 'instructor').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Assessors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter((u: any) => u.role === 'assessor').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter((u: any) => u.isActive).length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              {isLoading
                ? 'Loading users...'
                : `${users?.length || 0} total users`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton rows={10} />
            ) : users && users.length > 0 ? (
              <DataTable
                data={users as User[]}
                columns={columns}
                pageSize={10}
                selectable={true}
                loading={isLoading}
                emptyMessage="No users found"
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Integration Notes */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">SWR Integration Example</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-900 text-sm space-y-2">
            <p>
              ✓ Real-time data fetching with SWR hook
            </p>
            <p>
              ✓ Automatic error handling and display
            </p>
            <p>
              ✓ Loading states with skeleton UI
            </p>
            <p>
              ✓ API error handler for user-friendly messages
            </p>
            <p>
              ✓ Automatic data refresh after mutations
            </p>
            <p className="text-xs text-blue-700 pt-2">
              This page demonstrates how to integrate SWR with the existing UI components.
              Use this pattern to update other pages to use real API data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
