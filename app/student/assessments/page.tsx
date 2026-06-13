'use client';

import useSWR from 'swr';
import { CalendarClock, MapPin, Medal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { AssessmentSchedule, StudentSummary } from '@/lib/assessment-types';

export default function StudentAssessmentsPage() {
  const { data: student } = useSWR<StudentSummary>('/students/user/profile', (url: string) => apiClient.get<StudentSummary>(url));
  const { data: schedules = [] } = useSWR<AssessmentSchedule[]>('/assessments', (url: string) => apiClient.get<AssessmentSchedule[]>(url));

  const mySchedules = schedules
    .map((schedule) => ({
      schedule,
      candidate: schedule.candidates.find((candidate) => candidate.student._id === student?._id),
    }))
    .filter((item) => item.candidate);

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Assessment Schedule</h1>
          <p className="text-muted-foreground">TESDA competency assessment schedules where you are listed as a candidate.</p>
          {student && <p className="text-sm text-muted-foreground">{student.course} - {student.yearLevel}</p>}
        </div>

        <div className="grid gap-4">
          {mySchedules.map(({ schedule, candidate }) => (
            <Card key={schedule._id}>
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle>{schedule.title}</CardTitle>
                    <CardDescription>{schedule.course} - {schedule.yearLevel}</CardDescription>
                    <CardDescription>{schedule.qualificationTitle} {schedule.ncLevel}</CardDescription>
                  </div>
                  <Badge>{schedule.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="flex gap-3">
                  <CalendarClock className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Date and Time</p>
                    <p className="text-sm text-muted-foreground">{new Date(schedule.scheduleDateTime).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Center/Venue</p>
                    <p className="text-sm text-muted-foreground">{schedule.assessmentCenter}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Medal className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Assessor</p>
                    <p className="text-sm text-muted-foreground">{schedule.assessorName}</p>
                  </div>
                </div>
                <div className="md:col-span-3 flex flex-wrap gap-2">
                  <Badge variant="outline">Attendance: {candidate?.attendanceStatus}</Badge>
                  <Badge variant="outline">Result: {candidate?.result.replaceAll('_', ' ')}</Badge>
                  <Badge variant="outline">CARS: {schedule.checklist?.carsRatingSheetStatus ?? 'pending'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {mySchedules.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">No assessment schedule assigned yet.</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
