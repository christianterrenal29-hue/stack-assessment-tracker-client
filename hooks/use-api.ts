import useSWR, { SWRConfiguration } from 'swr';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL
  : `${API_BASE_URL.replace(/\/$/, '')}/api`;

const normalizeApiPath = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath.startsWith('/api/')
    ? normalizedPath.replace(/^\/api/, '')
    : normalizedPath;
};

const fetcher = async (url: string) => {
  const res = await fetch(`${API_URL}${normalizeApiPath(url)}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    const data = await res.json();
    error.message = data.message || error.message;
    throw error;
  }

  const payload = await res.json();
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data')
    ? payload.data
    : payload;
};

// ============ Auth Hooks ============

export function useLogin() {
  return async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Login failed');
    }

    const payload = await res.json();
    return payload.data ?? payload;
  };
}

export function useLogout() {
  return async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Logout failed');
    }

    const payload = await res.json();
    return payload.data ?? payload;
  };
}

export function useCurrentUser(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/auth/profile',
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    user: data,
    error,
    isLoading,
    mutate,
  };
}

// ============ User Hooks ============

export function useUsers(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/users',
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    users: data || [],
    error,
    isLoading,
    mutate,
  };
}

export function useUser(id: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/users/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    user: data,
    error,
    isLoading,
    mutate,
  };
}

export function useCreateUser() {
  return async (userData: any) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to create user');
    }

    const payload = await res.json();
    return payload.data ?? payload;
  };
}

// ============ Student Hooks ============

export function useStudents(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/students',
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    students: data || [],
    error,
    isLoading,
    mutate,
  };
}

export function useStudent(id: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/students/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    student: data,
    error,
    isLoading,
    mutate,
  };
}

export function useStudentProgress(studentId: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    studentId ? `/api/students/${studentId}/progress` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    progress: data,
    error,
    isLoading,
    mutate,
  };
}

// ============ Assessment Hooks ============

export function useAssessments(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/assessments',
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    assessments: data || [],
    error,
    isLoading,
    mutate,
  };
}

export function useAssessment(id: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/assessments/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    assessment: data,
    error,
    isLoading,
    mutate,
  };
}

export function useCreateAssessment() {
  return async (assessmentData: any) => {
    const res = await fetch(`${API_URL}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(assessmentData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to create assessment');
    }

    const payload = await res.json();
    return payload.data ?? payload;
  };
}

// ============ Submission Hooks ============

export function useSubmissions(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/submissions',
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    submissions: data || [],
    error,
    isLoading,
    mutate,
  };
}

export function useSubmission(id: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/submissions/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    submission: data,
    error,
    isLoading,
    mutate,
  };
}

export function useGradeSubmission() {
  return async (submissionId: string, gradeData: any) => {
    const res = await fetch(`${API_URL}/submissions/${submissionId}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(gradeData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to submit grade');
    }

    const payload = await res.json();
    return payload.data ?? payload;
  };
}

// ============ Competency Hooks ============

export function useCompetencies(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/competencies',
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    competencies: data || [],
    error,
    isLoading,
    mutate,
  };
}

export function useCompetency(id: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/competencies/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    competency: data,
    error,
    isLoading,
    mutate,
  };
}

// ============ Risk Monitoring Hooks ============

export function useAtRiskStudents(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/risk-monitoring/students/at-risk',
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    students: data || [],
    error,
    isLoading,
    mutate,
  };
}

export function useStudentRiskStatus(studentId: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    studentId ? `/api/risk-monitoring/student/${studentId}/report` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    riskStatus: data,
    error,
    isLoading,
    mutate,
  };
}

// ============ Notification Hooks ============

export function useNotifications(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/notifications',
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    notifications: data || [],
    error,
    isLoading,
    mutate,
  };
}

export function useMarkNotificationAsRead() {
  return async (notificationId: string) => {
    const res = await fetch(
      `${API_URL}/notifications/${notificationId}/read`,
      {
        method: 'PUT',
        credentials: 'include',
      }
    );

    if (!res.ok) {
      throw new Error('Failed to mark notification as read');
    }

    const payload = await res.json();
    return payload.data ?? payload;
  };
}

// ============ Dashboard Hooks ============

export function useDashboardStats(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/analytics/dashboard',
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  );

  return {
    stats: data,
    error,
    isLoading,
    mutate,
  };
}
