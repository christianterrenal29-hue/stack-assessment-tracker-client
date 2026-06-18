'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/alert';
import { useAuth } from '@/context/auth-context';
import { Mail, Building2, Briefcase } from 'lucide-react';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { DashboardPage } from '@/components/dashboard-page';

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <DashboardPage>
        <div>
          <h1 className="text-2xl font-semibold text-[#0b2f57] sm:text-3xl">My Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your account information and security settings.</p>
        </div>

        {message && (
          <Alert
            type={message.includes('successfully') ? 'success' : 'error'}
            message={message}
            dismissible
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-white/75 bg-white/85 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b2f57] to-[#0b7f3a] shadow-lg shadow-slate-900/10">
                  <span className="text-white text-2xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-[#0b2f57]">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="mt-1 rounded-full bg-[#edf8f1] px-3 py-1 text-sm capitalize text-[#0b7f3a]">{user?.role}</p>
                <div className="mt-4 w-full h-px bg-slate-200" />
                <div className="mt-4 w-full space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </div>
                  {user?.institution && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="w-4 h-4" />
                      Institution ID: {user.institution}
                    </div>
                  )}
                  {user?.department && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="w-4 h-4" />
                      Department ID: {user.department}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-white/75 bg-white/85 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#0b2f57]">Account Information</CardTitle>
                <Button
                  variant={isEditing ? 'outline' : 'default'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-slate-100"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          firstName: user?.firstName || '',
                          lastName: user?.lastName || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="text-lg font-medium text-slate-900">{user?.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="text-lg font-medium text-slate-900">{user?.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-medium text-slate-900">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="text-lg font-medium text-slate-900 capitalize">{user?.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user?.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/75 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#0b2f57]">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Password</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Keep your account secure by using a strong password.
              </p>
              <Button variant="outline">Change Password</Button>
            </div>
          </CardContent>
        </Card>
    </DashboardPage>
  );
}
