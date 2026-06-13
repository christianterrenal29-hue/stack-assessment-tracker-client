'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { Plus, Edit2, Trash2, Target } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { LoadingSkeleton } from '@/components/loading-skeleton';

interface Competency {
  _id: string;
  code: string;
  title: string;
  description: string;
  qualification: string;
  assessmentType: string;
  createdAt: string;
}

export default function CompetenciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    qualification: '',
    assessmentType: 'practical',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: competencies, mutate, isLoading } = useSWR<Competency[]>(
    '/competencies',
    (url: string) => apiClient.get<Competency[]>(url)
  );

  const { data: qualifications } = useSWR<any[]>(
    '/qualifications',
    (url: string) => apiClient.get<any[]>(url)
  );

  const filteredCompetencies = competencies?.filter((comp: Competency) =>
    comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/competencies/${editingId}`, formData);
      } else {
        await apiClient.post('/competencies', formData);
      }
      setFormData({
        code: '',
        title: '',
        description: '',
        qualification: '',
        assessmentType: 'practical',
      });
      setEditingId(null);
      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.error('Error saving competency:', error);
    }
  };

  const handleEdit = (competency: Competency) => {
    setFormData({
      code: competency.code,
      title: competency.title,
      description: competency.description,
      qualification: competency.qualification,
      assessmentType: competency.assessmentType,
    });
    setEditingId(competency._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this competency?')) {
      try {
        await apiClient.delete(`/competencies/${id}`);
        mutate();
      } catch (error) {
        console.error('Error deleting competency:', error);
      }
    }
  };

  const columns = [
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (row: Competency) => (
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-green-600" />
          <span className="font-mono text-sm font-medium">{row.code}</span>
        </div>
      ),
    },
    {
      header: 'Competency Title',
      accessorKey: 'title',
      cell: (row: Competency) => <span className="font-medium">{row.title}</span>,
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row: Competency) => (
        <span className="text-sm text-gray-600 line-clamp-2">{row.description}</span>
      ),
    },
    {
      header: 'Assessment Type',
      accessorKey: 'assessmentType',
      cell: (row: Competency) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm capitalize">
          {row.assessmentType}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: Competency) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Competencies</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Competency
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Competencies</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        <DataTable data={filteredCompetencies} columns={columns} />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md max-h-96 overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Competency' : 'Add Competency'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Competency Code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <select
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Qualification</option>
                    {qualifications?.map((qual: any) => (
                      <option key={qual._id} value={qual._id}>{qual.title}</option>
                    ))}
                  </select>
                  <select
                    value={formData.assessmentType}
                    onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="practical">Practical</option>
                    <option value="written">Written</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="performance">Performance</option>
                  </select>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingId(null);
                        setFormData({
                          code: '',
                          title: '',
                          description: '',
                          qualification: '',
                          assessmentType: 'practical',
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
