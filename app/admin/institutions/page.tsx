'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { LoadingSkeleton } from '@/components/loading-skeleton';

interface Institution {
  _id: string;
  name: string;
  code: string;
  location: string;
  contactEmail: string;
  phoneNumber: string;
  createdAt: string;
}

export default function InstitutionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    contactEmail: '',
    phoneNumber: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: institutions, mutate, isLoading } = useSWR<Institution[]>(
    '/institutions',
    (url: string) => apiClient.get<Institution[]>(url)
  );

  const filteredInstitutions = institutions?.filter((inst: Institution) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/institutions/${editingId}`, formData);
      } else {
        await apiClient.post('/institutions', formData);
      }
      setFormData({
        name: '',
        code: '',
        location: '',
        contactEmail: '',
        phoneNumber: '',
      });
      setEditingId(null);
      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.error('Error saving institution:', error);
    }
  };

  const handleEdit = (institution: Institution) => {
    setFormData({
      name: institution.name,
      code: institution.code,
      location: institution.location,
      contactEmail: institution.contactEmail,
      phoneNumber: institution.phoneNumber,
    });
    setEditingId(institution._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this institution?')) {
      try {
        await apiClient.delete(`/institutions/${id}`);
        mutate();
      } catch (error) {
        console.error('Error deleting institution:', error);
      }
    }
  };

  const columns = [
    {
      header: 'Institution Name',
      accessorKey: 'name',
      cell: (row: Institution) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (row: Institution) => <span className="text-sm text-gray-600">{row.code}</span>,
    },
    {
      header: 'Location',
      accessorKey: 'location',
    },
    {
      header: 'Contact Email',
      accessorKey: 'contactEmail',
      cell: (row: Institution) => (
        <a href={`mailto:${row.contactEmail}`} className="text-blue-600 hover:underline text-sm">
          {row.contactEmail}
        </a>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phoneNumber',
    },
    {
      header: 'Actions',
      cell: (row: Institution) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Institutions</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Institution
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Institutions</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        <DataTable data={filteredInstitutions} columns={columns} />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Institution' : 'Add Institution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Institution Name"
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
                  <Input
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Contact Email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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
                          location: '',
                          contactEmail: '',
                          phoneNumber: '',
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
