'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { Link } from 'react-router-dom';

interface Assessment {
  _id: string;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'failed';
  score?: number;
  maxScore: number;
  createdAt: string;
}

export default function StudentAssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const { data: assessments, isLoading } = useSWR<Assessment[]>(
    '/assessments?status=active',
    (url: string) => apiClient.get<Assessment[]>(url)
  );

  const filteredAssessments = assessments?.filter((assessment: Assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || assessment.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const columns = [
    {
      header: 'Assessment',
      cell: (row: Assessment) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-gray-500">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Due Date',
      cell: (row: Assessment) => {
        const overdue = isOverdue(row.dueDate);
        return (
          <div className={overdue && row.status === 'pending' ? 'text-red-600 font-medium' : ''}>
            {new Date(row.dueDate).toLocaleDateString()}
            {overdue && row.status === 'pending' && <span className="ml-2 text-xs">OVERDUE</span>}
          </div>
        );
      },
    },
    {
      header: 'Score',
      cell: (row: Assessment) => (
        <div>
          {row.status === 'graded' ? (
            <span className={row.score! >= row.maxScore * 0.6 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {row.score}/{row.maxScore}
            </span>
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: Assessment) => (
        <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Action',
      cell: (row: Assessment) => (
        <Link to={`/student/assessments/${row._id}`}>
          <Button variant="outline" size="sm">
            {row.status === 'pending' ? 'Start' : 'View'}
          </Button>
        </Link>
      ),
    },
  ];

  if (isLoading) return <LoadingSkeleton />;

  const pendingCount = assessments?.filter((a: Assessment) => a.status === 'pending').length || 0;
  const gradedCount = assessments?.filter((a: Assessment) => a.status === 'graded').length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">My Assessments</h1>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{filteredAssessments.length}</p>
                <p className="text-sm text-gray-600">Total Assessments</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{gradedCount}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Assessments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="failed">Failed</option>
            </select>
          </CardContent>
        </Card>

        <DataTable data={filteredAssessments} columns={columns} />
      </div>
    </DashboardLayout>
  );
}
