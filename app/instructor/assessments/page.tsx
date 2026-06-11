'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface Assessment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalQuestions: number;
  submittedCount: number;
  totalStudents: number;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
}

export default function AssessmentManagementPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: '1',
      title: 'Module 1 Assessment',
      description: 'Assessment for Module 1 - Basic Concepts',
      dueDate: '2024-06-30',
      totalQuestions: 10,
      submittedCount: 18,
      totalStudents: 25,
      status: 'published',
      createdAt: '2024-05-01',
    },
    {
      id: '2',
      title: 'Module 2 Mid-Term',
      description: 'Mid-term assessment for Module 2',
      dueDate: '2024-07-15',
      totalQuestions: 20,
      submittedCount: 5,
      totalStudents: 25,
      status: 'published',
      createdAt: '2024-05-10',
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-blue-100 text-blue-800',
      closed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns: Column<Assessment>[] = [
    {
      key: 'title',
      label: 'Assessment Title',
      sortable: true,
      searchable: true,
    },
    {
      key: 'totalQuestions',
      label: 'Questions',
      render: (value: number) => `${value} questions`,
    },
    {
      key: 'submittedCount',
      label: 'Submissions',
      render: (value: number, row: Assessment) => (
        <div className="text-sm">
          <div className="font-medium">{value}/{row.totalStudents}</div>
          <div className="text-xs text-muted-foreground">
            {Math.round((value / row.totalStudents) * 100)}%
          </div>
        </div>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>{value}</Badge>
      ),
    },
  ];

  const handleCreateAssessment = async () => {
    if (!formData.title || !formData.dueDate) {
      alert('Please fill in required fields');
      return;
    }

    const newAssessment: Assessment = {
      id: String(assessments.length + 1),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      totalQuestions: 0,
      submittedCount: 0,
      totalStudents: 25,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAssessments([...assessments, newAssessment]);
    setFormData({ title: '', description: '', dueDate: '' });
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Assessment Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Create and manage student assessments
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Assessment</DialogTitle>
                  <DialogDescription>
                    Set up a new assessment for your students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Module 1 Assessment"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Assessment description..."
                      className="min-h-24"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Due Date *</label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleCreateAssessment} className="w-full">
                    Create Assessment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assessments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assessments.filter((a) => a.status === 'published').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Submission Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assessments.length > 0
                  ? Math.round(
                      assessments.reduce(
                        (acc, a) => acc + (a.submittedCount / a.totalStudents) * 100,
                        0
                      ) / assessments.length
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Assessments</CardTitle>
            <CardDescription>
              Manage all your assessments and track submission rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={assessments}
              columns={columns}
              pageSize={10}
              selectable={true}
              loading={false}
              emptyMessage="No assessments created yet"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
