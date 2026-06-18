'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { DashboardPage } from '@/components/dashboard-page';

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

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'instructor',
      isActive: true,
      institution: 'TESDA Institute',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'assessor',
      isActive: true,
      institution: 'TESDA Institute',
      createdAt: '2024-01-20',
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', role: 'instructor' });
  const [formError, setFormError] = useState('');

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
    },
  ];

  const handleAddUser = async () => {
    setFormError('');
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setFormError('Please fill in the first name, last name, and email fields.');
      return;
    }

    try {
      // API call would go here
      const newUser: User = {
        id: String(users.length + 1),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role as any,
        isActive: true,
        institution: 'TESDA Institute',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setUsers([...users, newUser]);
      setFormData({ firstName: '', lastName: '', email: '', role: 'instructor' });
      setDialogOpen(false);
    } catch {
      setFormError('Failed to add user');
    }
  };

  return (
    <DashboardPage>
        {/* Header */}
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0b2f57] sm:text-3xl">User Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage system users and their roles
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
                <div className="space-y-4">
                  {formError && (
                    <Alert variant="destructive">
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                  <Button onClick={handleAddUser} className="w-full">
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-white/75 bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card className="border-white/75 bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Instructors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === 'instructor').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/75 bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assessors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === 'assessor').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/75 bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.isActive).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="border-white/75 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              All system users with their roles and statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={users}
              columns={columns}
              pageSize={10}
              selectable={true}
              loading={false}
              emptyMessage="No users found"
            />
          </CardContent>
        </Card>
    </DashboardPage>
  );
}
