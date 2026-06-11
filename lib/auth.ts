export type SessionUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'administrator' | 'instructor' | 'assessor' | 'student';
  institution?: string;
  department?: string;
  avatar?: string;
  isActive: boolean;
};

export type Session = {
  user: SessionUser;
};

type ApiProfileResponse = {
  data?: SessionUser;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL
  : `${API_BASE_URL.replace(/\/$/, '')}/api`;

export async function getSession(): Promise<Session | null> {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const profile = (await response.json()) as ApiProfileResponse;
    return profile.data ? { user: profile.data } : null;
  } catch {
    return null;
  }
}
