'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, FileCheck, RefreshCw, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type DocumentStatus = 'pending' | 'verified' | 'rejected';

type ManagedDocument = {
  _id: string;
  originalName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedFor?: string;
  requirementType: string;
  status: DocumentStatus;
  remarks?: string;
  url: string;
  createdAt: string;
};

const requirementTypes = [
  'Enrollment Form',
  'Valid ID',
  'Birth Certificate',
  'Training Agreement',
  'OJT MOA',
  'Medical Certificate',
  'Assessment Evidence',
  'Certificate of Completion',
];

const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl.replace(/\/$/, '')}/api`;
};

const statusClass: Record<DocumentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 KB';
  return `${(bytes / 1024).toFixed(1)} KB`;
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState<ManagedDocument[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [requirementType, setRequirementType] = useState(requirementTypes[0]);
  const [uploadedFor, setUploadedFor] = useState('');
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const checklist = useMemo(
    () =>
      requirementTypes.map((requirement) => ({
        requirement,
        document: documents.find((item) => item.requirementType === requirement),
      })),
    [documents]
  );

  const loadDocuments = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiClient.get<ManagedDocument[]>('/files');
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Choose a PDF, DOCX, JPG, or PNG file to upload.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('requirementType', requirementType);
    if (uploadedFor.trim()) {
      formData.append('uploadedFor', uploadedFor.trim());
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/files/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || payload.message || 'Upload failed');
      }
      setFile(null);
      setUploadedFor('');
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const updateStatus = async (id: string, status: DocumentStatus) => {
    setError('');
    try {
      await apiClient.patch(`/files/${id}/verify`, {
        status,
        remarks: remarks[id] || undefined,
      });
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
    }
  };

  const deleteDocument = async (id: string) => {
    setError('');
    try {
      await apiClient.delete(`/files/${id}`);
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
            <p className="mt-1 text-muted-foreground">
              Upload, verify, and track TESDA student requirement documents.
            </p>
          </div>
          <Button variant="outline" onClick={loadDocuments} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Document
              </CardTitle>
              <CardDescription>Accepted formats: PDF, DOCX, JPG, PNG.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Requirement</label>
                  <Select value={requirementType} onValueChange={setRequirementType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {requirementTypes.map((requirement) => (
                        <SelectItem key={requirement} value={requirement}>
                          {requirement}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Student/User ID</label>
                  <Input
                    value={uploadedFor}
                    onChange={(event) => setUploadedFor(event.target.value)}
                    placeholder="Optional MongoDB ID"
                  />
                </div>
                <Input
                  type="file"
                  accept=".pdf,.docx,.jpg,.jpeg,.png"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
                <Button className="w-full" type="submit" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Requirement Checklist
              </CardTitle>
              <CardDescription>Latest matching document per TESDA requirement type.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {checklist.map(({ requirement, document }) => (
                  <div key={requirement} className="rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{requirement}</span>
                      <Badge className={document ? statusClass[document.status] : 'bg-gray-100 text-gray-800'}>
                        {document?.status ?? 'missing'}
                      </Badge>
                    </div>
                    {document && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {document.originalName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              {isLoading ? 'Loading documents...' : `${documents.length} document(s) tracked`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{document.originalName}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatBytes(document.fileSize)} · {new Date(document.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{document.requirementType}</TableCell>
                    <TableCell>
                      <Badge className={statusClass[document.status]}>{document.status}</Badge>
                    </TableCell>
                    <TableCell className="min-w-60">
                      <Textarea
                        value={remarks[document._id] ?? document.remarks ?? ''}
                        onChange={(event) =>
                          setRemarks((current) => ({
                            ...current,
                            [document._id]: event.target.value,
                          }))
                        }
                        placeholder="Verification remarks"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a href={`${getApiBaseUrl()}${document.url.replace(/^\/api/, '')}`} target="_blank" rel="noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" onClick={() => updateStatus(document._id, 'verified')}>
                          Verify
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => updateStatus(document._id, 'rejected')}>
                          Reject
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteDocument(document._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && documents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No documents uploaded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
