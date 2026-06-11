'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { LoadingSkeleton } from '@/components/loading-skeleton';

interface AttendanceRecord {
  _id: string;
  student: string;
  course: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  createdAt: string;
}

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as AttendanceRecord['status'],
    remarks: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: attendance, mutate, isLoading } = useSWR<AttendanceRecord[]>(
    '/attendance',
    (url: string) => apiClient.get<AttendanceRecord[]>(url)
  );

  const { data: students } = useSWR<any[]>('/students', (url: string) => apiClient.get<any[]>(url));
  const { data: courses } = useSWR<any[]>('/courses', (url: string) => apiClient.get<any[]>(url));

  const filteredAttendance = attendance?.filter((record: AttendanceRecord) => {
    const matchesSearch = students?.find((s: any) => s._id === record.student)?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse = !filterCourse || record.course === filterCourse;
    const matchesDate = !filterDate || record.date === filterDate;
    return matchesSearch && matchesCourse && matchesDate;
  }) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/attendance/${editingId}`, formData);
      } else {
        await apiClient.post('/attendance', formData);
      }
      setFormData({
        student: '',
        course: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present' as AttendanceRecord['status'],
        remarks: '',
      });
      setEditingId(null);
      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const handleEdit = (record: AttendanceRecord) => {
    setFormData({
      student: record.student,
      course: record.course,
      date: record.date.split('T')[0],
      status: record.status,
      remarks: record.remarks || '',
    });
    setEditingId(record._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await apiClient.delete(`/attendance/${id}`);
        mutate();
      } catch (error) {
        console.error('Error deleting attendance:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      header: 'Student',
      cell: (row: AttendanceRecord) => {
        const student = students?.find((s: any) => s._id === row.student);
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="font-medium">{student?.name || 'Unknown'}</span>
          </div>
        );
      },
    },
    {
      header: 'Course',
      cell: (row: AttendanceRecord) => {
        const course = courses?.find((c: any) => c._id === row.course);
        return <span className="text-sm">{course?.title || 'Unknown'}</span>;
      },
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row: AttendanceRecord) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: AttendanceRecord) => (
        <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: AttendanceRecord) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Record Attendance
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Courses</option>
                {courses?.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <DataTable data={filteredAttendance} columns={columns} />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Attendance' : 'Record Attendance'}</CardTitle>
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
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                  <textarea
                    placeholder="Remarks (optional)"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
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
                          date: new Date().toISOString().split('T')[0],
                          status: 'present' as AttendanceRecord['status'],
                          remarks: '',
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
