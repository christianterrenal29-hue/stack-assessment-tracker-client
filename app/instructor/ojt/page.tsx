'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { Plus, Edit2, Trash2, Briefcase, AlertCircle } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { LoadingSkeleton } from '@/components/loading-skeleton';

interface OJTRecord {
  _id: string;
  student: string;
  course: string;
  company: string;
  startDate: string;
  endDate: string;
  hoursCompleted: number;
  hoursRequired: number;
  status: 'ongoing' | 'completed' | 'suspended' | 'failed';
  supervisor?: string;
  createdAt: string;
}

export default function OJTPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    company: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    hoursRequired: 160,
    status: 'ongoing' as OJTRecord['status'],
    supervisor: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: ojt, mutate, isLoading } = useSWR<OJTRecord[]>(
    '/ojt',
    (url: string) => apiClient.get<OJTRecord[]>(url)
  );

  const { data: students } = useSWR<any[]>('/students', (url: string) => apiClient.get<any[]>(url));
  const { data: courses } = useSWR<any[]>('/courses', (url: string) => apiClient.get<any[]>(url));

  const filteredOJT = ojt?.filter((record: OJTRecord) => {
    const matchesSearch = students?.find((s: any) => s._id === record.student)?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/ojt/${editingId}`, formData);
      } else {
        await apiClient.post('/ojt', formData);
      }
      setFormData({
        student: '',
        course: '',
        company: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        hoursRequired: 160,
        status: 'ongoing' as OJTRecord['status'],
        supervisor: '',
      });
      setEditingId(null);
      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.error('Error saving OJT record:', error);
    }
  };

  const handleEdit = (record: OJTRecord) => {
    setFormData({
      student: record.student,
      course: record.course,
      company: record.company,
      startDate: record.startDate.split('T')[0],
      endDate: record.endDate.split('T')[0],
      hoursRequired: record.hoursRequired,
      status: record.status,
      supervisor: record.supervisor || '',
    });
    setEditingId(record._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this OJT record?')) {
      try {
        await apiClient.delete(`/ojt/${id}`);
        mutate();
      } catch (error) {
        console.error('Error deleting OJT record:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHoursProgress = (completed: number, required: number) => {
    const percentage = (completed / required) * 100;
    const isAlert = percentage < 50;
    return { percentage, isAlert };
  };

  const columns = [
    {
      header: 'Student',
      cell: (row: OJTRecord) => {
        const student = students?.find((s: any) => s._id === row.student);
        return (
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{student?.name || 'Unknown'}</span>
          </div>
        );
      },
    },
    {
      header: 'Company',
      accessorKey: 'company',
    },
    {
      header: 'Hours',
      cell: (row: OJTRecord) => {
        const { percentage, isAlert } = getHoursProgress(row.hoursCompleted, row.hoursRequired);
        return (
          <div className="flex items-center gap-2">
            {isAlert && <AlertCircle className="w-4 h-4 text-red-600" />}
            <div className="flex-1">
              <div className="text-sm font-medium">{row.hoursCompleted}/{row.hoursRequired} hrs</div>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${percentage >= 100 ? 'bg-green-500' : isAlert ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: OJTRecord) => (
        <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: OJTRecord) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSkeleton />;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">OJT Monitoring</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add OJT Record
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter OJT Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
              <option value="failed">Failed</option>
            </select>
          </CardContent>
        </Card>

        <DataTable data={filteredOJT} columns={columns} />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md max-h-96 overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit OJT Record' : 'Add OJT Record'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <select
                    value={formData.student}
                    onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Student</option>
                    {students?.map((s: any) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses?.map((c: any) => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Hours Required"
                    value={formData.hoursRequired}
                    onChange={(e) => setFormData({ ...formData, hoursRequired: parseInt(e.target.value) })}
                    required
                  />
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="suspended">Suspended</option>
                    <option value="failed">Failed</option>
                  </select>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingId(null);
                        setFormData({
                          student: '',
                          course: '',
                          company: '',
                          startDate: new Date().toISOString().split('T')[0],
                          endDate: '',
                          hoursRequired: 160,
                          status: 'ongoing' as OJTRecord['status'],
                          supervisor: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
