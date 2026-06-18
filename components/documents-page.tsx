'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Eye, FileText, ImageIcon, RefreshCw, Save, Trash2, Upload, UserRound } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
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
  fileType: string;
  fileSize: number;
  requirementType: string;
  status: DocumentStatus;
  remarks?: string;
  url: string;
  createdAt: string;
};

type StudentRecord = {
  _id: string;
  studentId: string;
  course?: string;
  yearLevel?: string;
  user?: {
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
  };
};

const documentTypes = [
  'Profile Picture',
  'Valid ID',
  'Birth Certificate',
  'Self-Assessment Guide',
  'Application Form',
  'Passport Photo',
  'Admission Slip / Official Receipt',
  'Assessment Requirements',
  'Certificate',
  'Assessment Evidence',
  'Attendance Sheet',
  'Rating Sheet / CARS',
];

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);
const maxFileSize = 5 * 1024 * 1024;

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
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
};

const isImage = (fileType: string) => fileType.startsWith('image/');
const isPdf = (fileType: string) => fileType === 'application/pdf';

const studentName = (student?: StudentRecord | null) => {
  if (!student) return 'Student';
  return student.user ? `${student.user.firstName} ${student.user.lastName}` : student.studentId;
};

export function DocumentsPage() {
  const { user } = useAuth();
  const canManageDocuments = user?.role === 'administrator' || user?.role === 'instructor' || user?.role === 'assessor';
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [documents, setDocuments] = useState<ManagedDocument[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState(documentTypes[0]);
  const [previewDocument, setPreviewDocument] = useState<ManagedDocument | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, DocumentStatus>>({});
  const [remarksDrafts, setRemarksDrafts] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const selectedPreviewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  const selectedStudent = students.find((student) => student._id === selectedStudentId);
  const profilePicture = documents.find((item) => item.requirementType === 'Profile Picture');
  const profilePictureUrl = profilePicture?.url || selectedStudent?.user?.avatar || user?.avatar;

  const filteredStudents = useMemo(() => {
    const search = studentSearch.trim().toLowerCase();
    if (!search) return students;
    return students.filter((student) => {
      const name = studentName(student).toLowerCase();
      return (
        name.includes(search) ||
        student.studentId.toLowerCase().includes(search) ||
        (student.course ?? '').toLowerCase().includes(search)
      );
    });
  }, [studentSearch, students]);

  const checklist = useMemo(
    () =>
      documentTypes.map((requirement) => ({
        requirement,
        document: documents.find((item) => item.requirementType === requirement),
      })),
    [documents]
  );

  useEffect(() => {
    return () => {
      if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl);
    };
  }, [selectedPreviewUrl]);

  const loadStudents = useCallback(async () => {
    if (!canManageDocuments) return;
    const data = await apiClient.get<StudentRecord[]>('/students');
    setStudents(data);
    setSelectedStudentId((current) => current || data[0]?._id || '');
  }, [canManageDocuments]);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      if (canManageDocuments) {
        if (!selectedStudentId) {
          setDocuments([]);
          return;
        }
        const data = await apiClient.get<ManagedDocument[]>(`/files/student/${selectedStudentId}`);
        setDocuments(data);
      } else {
        const data = await apiClient.get<ManagedDocument[]>('/files');
        setDocuments(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, [canManageDocuments, selectedStudentId]);

  useEffect(() => {
    loadStudents().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load students'));
  }, [loadStudents]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    setStatusDrafts(
      Object.fromEntries(documents.map((document) => [document._id, document.status]))
    );
    setRemarksDrafts(
      Object.fromEntries(documents.map((document) => [document._id, document.remarks ?? '']))
    );
  }, [documents]);

  const validateFile = (candidate: File) => {
    if (!allowedMimeTypes.has(candidate.type)) return 'Only JPG, JPEG, PNG, and PDF files are allowed.';
    if (candidate.size > maxFileSize) return 'File size must not exceed 5MB.';
    return '';
  };

  const chooseFile = (candidate?: File) => {
    if (!candidate) return;
    const validationError = validateFile(candidate);
    if (validationError) {
      setFile(null);
      setError(validationError);
      return;
    }
    setError('');
    setFile(candidate);
  };

  const uploadDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Choose a JPG, PNG, or PDF file to upload.');
      return;
    }
    if (!selectedStudentId) {
      setError('Select a student before uploading a document.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('requirementType', documentType);
    formData.append('uploadedFor', selectedStudentId);

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${getApiBaseUrl()}/files/upload`);
        xhr.withCredentials = true;
        const token = localStorage.getItem('token');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (progressEvent) => {
          if (!progressEvent.lengthComputable) return;
          setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
            return;
          }
          try {
            const payload = JSON.parse(xhr.responseText);
            reject(new Error(payload.error || payload.message || 'Upload failed'));
          } catch {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
      });

      setFile(null);
      setUploadProgress(100);
      await loadDocuments();
      await loadStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const updateVerification = async (document: ManagedDocument) => {
    setError('');
    try {
      await apiClient.patch(`/files/${document._id}/verify`, {
        status: statusDrafts[document._id] ?? document.status,
        remarks: remarksDrafts[document._id] ?? '',
      });
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document verification');
    }
  };

  const deleteDocument = async () => {
    if (!deleteId) return;
    setError('');
    setIsDeleting(true);
    try {
      await apiClient.delete(`/files/${deleteId}`);
      if (previewDocument?._id === deleteId) setPreviewDocument(null);
      setDeleteId(null);
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0b2f57] sm:text-3xl">Documents / Requirements</h1>
            <p className="mt-1 text-muted-foreground">
              Cloudinary-backed student requirements, candidate profile documents, and verification status.
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          {canManageDocuments && (
            <Card className="border-white/75 bg-white/85 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Student Document
                </CardTitle>
                <CardDescription>Max 5MB. Allowed formats: JPG, JPEG, PNG, PDF.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={uploadDocument} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student / Candidate</label>
                    <Input
                      value={studentSearch}
                      onChange={(event) => setStudentSearch(event.target.value)}
                      placeholder="Search by name, ID, or course"
                    />
                    <select
                      className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                      value={selectedStudentId}
                      onChange={(event) => setSelectedStudentId(event.target.value)}
                    >
                      <option value="">Select student</option>
                      {filteredStudents.map((student) => (
                        <option key={student._id} value={student._id}>
                          {studentName(student)} - {student.studentId} {student.course ? `(${student.course})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Document Type</label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsDragging(false);
                      chooseFile(event.dataTransfer.files?.[0]);
                    }}
                    className={`flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition ${
                      isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    }`}
                  >
                    <Upload className="mb-3 h-8 w-8 text-primary" />
                    <span className="text-sm font-medium">Drag and drop file here</span>
                    <span className="mt-1 text-xs text-muted-foreground">or click to browse</span>
                  </button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(event) => chooseFile(event.target.files?.[0])}
                  />

                  {file && (
                    <div className="rounded-lg border p-3">
                      <div className="mb-3 flex items-center gap-2 text-sm">
                        {isImage(file.type) ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                      </div>
                      {isImage(file.type) && (
                        <img src={selectedPreviewUrl} alt="Selected upload preview" className="h-40 w-full rounded-md border object-contain" />
                      )}
                      {isPdf(file.type) && (
                        <iframe src={selectedPreviewUrl} title="Selected PDF preview" className="h-48 w-full rounded-md border" />
                      )}
                    </div>
                  )}

                  {isUploading && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} />
                      <p className="text-xs text-muted-foreground">{uploadProgress}% uploaded</p>
                    </div>
                  )}

                  <Button className="w-full" type="submit" disabled={isUploading || !selectedStudentId}>
                    {isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            <Card className="border-white/75 bg-white/85 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="h-5 w-5" />
                  Candidate Profile
                </CardTitle>
                <CardDescription>
                  {canManageDocuments ? studentName(selectedStudent) : `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'My documents'}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <div className="flex h-44 items-center justify-center rounded-lg border bg-muted/30">
                  {profilePictureUrl ? (
                    <img src={profilePictureUrl} alt="Candidate profile" className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <UserRound className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {checklist.map(({ requirement, document }) => (
                    <div key={requirement} className="rounded-md border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{requirement}</span>
                        <Badge className={document ? statusClass[document.status] : 'bg-gray-100 text-gray-800'}>
                          {document?.status ?? 'missing'}
                        </Badge>
                      </div>
                      {document && (
                        <p className="mt-1 truncate text-xs text-muted-foreground">{document.originalName}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {previewDocument && (
              <Card className="border-white/75 bg-white/85 shadow-sm">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>{previewDocument.originalName}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isImage(previewDocument.fileType) && (
                    <img src={previewDocument.url} alt={previewDocument.originalName} className="max-h-[520px] w-full rounded-lg border object-contain" />
                  )}
                  {isPdf(previewDocument.fileType) && (
                    <iframe src={previewDocument.url} title={previewDocument.originalName} className="h-[520px] w-full rounded-lg border" />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card className="border-white/75 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              {isLoading ? 'Loading documents...' : `${documents.length} Cloudinary document(s) tracked`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  {canManageDocuments && <TableHead>Remarks</TableHead>}
                  <TableHead>Preview</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {isImage(document.fileType) ? (
                          <img src={document.url} alt={document.originalName} className="h-12 w-12 rounded-md border object-cover" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate font-medium">{document.originalName}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatBytes(document.fileSize)} | {new Date(document.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{document.requirementType}</TableCell>
                    <TableCell>
                      {canManageDocuments ? (
                        <select
                          className="h-9 rounded-md border bg-background px-2 text-sm"
                          value={statusDrafts[document._id] ?? document.status}
                          onChange={(event) =>
                            setStatusDrafts((current) => ({
                              ...current,
                              [document._id]: event.target.value as DocumentStatus,
                            }))
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      ) : (
                        <Badge className={statusClass[document.status]}>{document.status}</Badge>
                      )}
                    </TableCell>
                    {canManageDocuments && (
                      <TableCell className="min-w-60">
                        <Textarea
                          value={remarksDrafts[document._id] ?? ''}
                          onChange={(event) =>
                            setRemarksDrafts((current) => ({
                              ...current,
                              [document._id]: event.target.value,
                            }))
                          }
                          placeholder="Verification remarks"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setPreviewDocument(document)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a href={document.url} target="_blank" rel="noreferrer" download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        {canManageDocuments && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => updateVerification(document)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteId(document._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && documents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={canManageDocuments ? 6 : 5} className="py-10 text-center text-muted-foreground">
                      No student documents uploaded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <ConfirmDeleteDialog
          open={Boolean(deleteId)}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={deleteDocument}
          isDeleting={isDeleting}
          title="Delete document?"
          description="This will permanently remove the selected uploaded document record."
        />
      </div>
    </div>
  );
}
