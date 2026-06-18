import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarClock,
  ClipboardCheck,
  Database,
  FileText,
  GraduationCap,
  LockKeyhole,
  MonitorCheck,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  ['Assessment Scheduling', 'Plan TESDA assessment dates, venues, assessors, rooms, and candidate capacity.', CalendarClock],
  ['Student Records', 'Keep candidate details, course, year level, requirements, and competency progress organized.', Users],
  ['Results Monitoring', 'Track attendance, competent outcomes, pending decisions, and no-show records.', MonitorCheck],
  ['Reports and Forms', 'Prepare printable candidate lists, attendance sheets, result summaries, and compliance reports.', FileText],
] as const;

const modules = [
  ['Dashboard', 'Role-based overview of schedules, requirements, attendance, and results.', BarChart3],
  ['Documents', 'Upload, preview, verify, and manage candidate requirement files.', ClipboardCheck],
  ['Notifications', 'Surface schedule updates, missing requirements, and posted result alerts.', BellRing],
  ['Audit and Compliance', 'Support traceable records for institutional monitoring and reporting.', ShieldCheck],
] as const;

const roles = [
  ['Administrator', 'Manage users, school records, compliance pages, reports, and audit logs.'],
  ['Instructor', 'Prepare assessment schedules, candidate lists, attendance, and documentation.'],
  ['Assessor', 'Review assigned assessments, attendance, candidate evidence, and results.'],
  ['Student', 'View schedules, competency progress, attendance, and uploaded requirements.'],
] as const;

const stats = [
  ['4', 'User roles'],
  ['8+', 'Core modules'],
  ['10', 'Candidates per schedule'],
  ['5MB', 'Upload limit'],
] as const;

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f7f5] text-slate-900">
      <section className="relative border-b border-white/70 bg-[linear-gradient(135deg,#f8fbf9_0%,#eef6f1_46%,#edf4fb_100%)]">
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-4 sm:justify-start">
              <img src="/tesda-logo.png" alt="TESDA logo" className="h-12 w-12 rounded-xl bg-white object-contain p-1 shadow-sm sm:h-14 sm:w-14" />
              <div className="min-w-0 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0b7f3a]">Top Link Global College Inc.</p>
                <p className="mt-0.5 text-sm font-medium text-[#0b2f57]">TESDA Assessment Tracker</p>
              </div>
              <img src="/toplink-logo.png" alt="Top Link Global College logo" className="h-12 w-12 rounded-xl bg-white object-contain p-1 shadow-sm sm:hidden" />
            </div>
            <div className="flex items-center justify-center gap-3 sm:justify-end">
              <Button asChild variant="outline" className="border-[#0b7f3a]/25 bg-white/80 text-[#0b7f3a] hover:bg-[#edf8f1]">
                <a href="#features">View Features</a>
              </Button>
              <Button asChild className="bg-[#0b2f57] text-white hover:bg-[#123f70]">
                <Link to="/auth/login">
                  Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <img src="/toplink-logo.png" alt="Top Link Global College logo" className="hidden h-14 w-14 rounded-xl bg-white object-contain p-1 shadow-sm sm:block" />
            </div>
          </nav>

          <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] lg:py-12">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#0b7f3a]/20 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0b7f3a] shadow-sm lg:mx-0">
                <LockKeyhole className="h-3.5 w-3.5" />
                Student records and monitoring system
              </div>
              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-normal text-[#0b2f57] sm:text-4xl lg:text-5xl">
                TESDA Assessment Tracker System
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base lg:mx-0">
                A clean workspace for assessment scheduling, candidate requirements, competency results,
                attendance monitoring, and school reporting.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Button asChild size="lg" className="bg-[#0b7f3a] text-white hover:bg-[#096c32]">
                  <Link to="/auth/login">
                    Login to System
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-[#0b2f57]/20 bg-white/80 text-[#0b2f57] hover:bg-white">
                  <a href="#features">View Features</a>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_24px_70px_rgba(15,59,82,0.12)] backdrop-blur">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0b2f57]">Assessment Overview</p>
                    <p className="text-xs text-slate-500">Defense-ready monitoring snapshot</p>
                  </div>
                  <span className="rounded-full bg-[#e8f5ec] px-3 py-1 text-xs font-medium text-[#0b7f3a]">Live</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {stats.map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-slate-100 bg-[#f8faf9] p-4">
                      <p className="text-2xl font-semibold text-[#0b2f57]">{value}</p>
                      <p className="mt-1 text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-[#0b2f57] p-5 text-white">
                  <div className="flex items-center gap-3">
                    <Database className="h-8 w-8 text-[#9fe2b3]" />
                    <div>
                      <p className="font-semibold">Centralized assessment records</p>
                      <p className="mt-1 text-sm leading-6 text-blue-50">Schedules, candidates, documents, outcomes, and reports stay in one role-based system.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Features" title="Built for assessment office workflows" description="Focused modules for scheduling, monitoring, records, and TESDA documentation." />
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, description, Icon]) => (
            <article key={title} className="group rounded-2xl border border-white/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf8f1] text-[#0b7f3a] transition group-hover:bg-[#0b7f3a] group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold text-[#0b2f57]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/65 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Modules" title="Organized system areas" description="Each module supports a clear part of the student record and monitoring process." />
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {modules.map(([title, description, Icon]) => (
              <article key={title} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4fb] text-[#0b2f57]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-[#0b2f57]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="User Roles" title="Clear access for every user" description="The interface stays focused by showing each role the modules they need." />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-white/80 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0b2f57] text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-[#0b2f57]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/80 bg-[#0b2f57] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/tesda-logo.png" alt="TESDA logo" className="h-10 w-10 rounded-lg bg-white object-contain p-1" />
            <div>
              <p className="text-sm font-semibold">TESDA Assessment Tracker</p>
              <p className="text-xs text-blue-100">Assessment Tracker for Student Records and Monitoring System</p>
            </div>
          </div>
          <p className="text-sm text-blue-100">Top Link Global College Inc.</p>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#0b7f3a]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[#0b2f57] sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}
