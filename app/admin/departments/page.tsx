'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { LoadingSkeleton } from '@/components/loading-skeleton';

interface Department {
  _id: string;
  name: string;
  code: string;
  institution: string;
  head?: string;
  createdAt: string;
}

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    institution: '',
    head: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: departments, mutate, isLoading } = useSWR<Department[]>(
    '/departments',
    (url: string) => apiClient.get<Department[]>(url)
  );

  const { data: institutions } = useSWR<any[]>(
    '/institutions',
    (url: string) => apiClient.get<any[]>(url)
  );

  const filteredDepartments = departments?.filter((dept: Department) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/departments/${editingId}`, formData);
      } else {
        await apiClient.post('/departments', formData);
      }
      setFormData({
        name: '',
        code: '',
        institution: '',
        head: '',
      });
      setEditingId(null);
      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleEdit = (department: Department) => {
    setFormData({
      name: department.name,
      code: department.code,
      institution: department.institution,
      head: department.head || '',
    });
    setEditingId(department._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await apiClient.delete(`/departments/${id}`);
        mutate();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const columns = [
    {
      header: 'Department',
      accessorKey: 'name',
      cell: (row: Department) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-600" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (row: Department) => <span className="text-sm text-gray-600">{row.code}</span>,
    },
    {
      header: 'Institution',
      cell: (row: Department) => {
        const inst = institutions?.find((i: any) => i._id === row.institution);
        return inst?.name || 'Unknown';
      },
    },
    {
      header: 'Head',
      accessorKey: 'head',
      cell: (row: Department) => row.head ? <span className="text-sm">{row.head}</span> : <span className="text-gray-400 text-sm">Unassigned</span>,
    },
    {
      header: 'Actions',
      cell: (row: Department) => (
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
    <div className="p-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        <DataTable data={filteredDepartments} columns={columns} />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Department' : 'Add Department'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Department Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                  <select
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Institution</option>
                    {institutions?.map((inst: any) => (
                      <option key={inst._id} value={inst._id}>{inst.name}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Department Head (optional)"
                    value={formData.head}
                    onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingId(null);
                        setFormData({
                          name: '',
                          code: '',
                          institution: '',
                          head: '',
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
    </div>
  );
}
