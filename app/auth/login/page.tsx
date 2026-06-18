'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/auth-context';
import { getDashboardPath } from '@/lib/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#eef6f1_48%,#edf4fb_100%)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-5 flex items-center justify-center gap-5">
            <img src="/tesda-logo.png" alt="TESDA logo" className="h-16 w-16 rounded-2xl bg-white object-contain p-2 shadow-sm" />
            <img src="/toplink-logo.png" alt="Top Link Global College logo" className="h-16 w-16 rounded-2xl bg-white object-contain p-2 shadow-sm" />
          </div>
          <h1 className="text-2xl font-semibold text-[#0b2f57] sm:text-3xl">TESDA Assessment Tracker System</h1>
          <p className="mt-2 text-muted-foreground">Assessment Tracker for Student Records and Monitoring System</p>
        </div>

        <Card className="border-white/80 bg-white/90 shadow-xl shadow-slate-900/5">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full bg-[#0b2f57] hover:bg-[#123f70]" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/auth/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>TESDA Assessment Tracker / Top Link Global College Inc.</p>
          <p className="mt-2">
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            {' | '}
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
