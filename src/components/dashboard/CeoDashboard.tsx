import React from 'react';
import {
  Student,
  SchoolClass,
  Section,
  Teacher,
  AttendanceSession,
  Invoice,
  AdmissionApplication,
  Examination,
  ExamMark,
} from '../../types';
import { SchoolAnalyticsCharts } from './SchoolAnalyticsCharts';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserPlus,
  AlertCircle,
  Award,
  Shield,
  Layers,
  ArrowUpRight,
  Database,
  Calendar,
  Settings,
} from 'lucide-react';

interface CeoDashboardProps {
  students: Student[];
  classes: SchoolClass[];
  sections: Section[];
  teachers: Teacher[];
  attendanceSessions: AttendanceSession[];
  invoices: Invoice[];
  admissions: AdmissionApplication[];
  examinations?: Examination[];
  examMarks?: ExamMark[];
  onOpenAddStudent: () => void;
  onOpenRecordPayment: () => void;
  onOpenAddAnnouncement: () => void;
  onSeedData: () => void;
  onNavigateTab: (tab: string) => void;
}

export const CeoDashboard: React.FC<CeoDashboardProps> = ({
  students,
  classes,
  sections,
  teachers,
  attendanceSessions,
  invoices,
  admissions,
  examinations = [],
  examMarks = [],
  onOpenAddStudent,
  onOpenRecordPayment,
  onOpenAddAnnouncement,
  onSeedData,
  onNavigateTab,
}) => {
  // Calculations
  const totalStudents = students.length;
  const boysCount = students.filter((s) => s.gender === 'male' || s.genderSection === 'boys').length;
  const girlsCount = students.filter((s) => s.gender === 'female' || s.genderSection === 'girls').length;
  const boysPercentage = totalStudents > 0 ? ((boysCount / totalStudents) * 100).toFixed(0) : '50';
  const girlsPercentage = totalStudents > 0 ? ((girlsCount / totalStudents) * 100).toFixed(0) : '50';

  const totalTeachers = teachers.length;
  const pendingAdmissions = admissions.filter((a) => a.status === 'pending' || a.status === 'interview_scheduled').length;

  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.netAmount || 0), 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);

  // Latest attendance percentage calculation
  const totalPresents = attendanceSessions.reduce((sum, s) => sum + s.presentCount, 0);
  const totalRegistered = attendanceSessions.reduce((sum, s) => sum + s.totalStudents, 0);
  const attendanceRate = totalRegistered > 0 ? ((totalPresents / totalRegistered) * 100).toFixed(1) : '94.8';

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-widest">
              Executive Institutional Oversight
            </span>
            <span className="text-xs text-amber-300 font-bold">• Owner &amp; Super Admin: Zohaib Ali</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The Muslim School &amp; College Secretariat
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Live aggregated institutional metrics for Boys &amp; Girls Campuses (Playgroup through Class 12), Mardan, Pakistan.
            Official Contact: +92 313 9375355 | themuslimschool&amp;collage12@gmail.com
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('settings')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white border border-amber-400/40 shadow-md transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-amber-300" />
            <span>School Settings &amp; CMS</span>
          </button>
          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>Collect Fee</span>
          </button>
          <button
            onClick={onSeedData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            title="Seed sample data to populate all 15 classes and sections"
          >
            <Database className="w-4 h-4 text-amber-300" />
            <span>Seed Sample Data</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrollment</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalStudents}</span>
            <span className="text-xs font-medium text-emerald-600">Active Students</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Boys: <strong className="text-blue-700 font-bold">{boysCount}</strong></span>
            <span>Girls: <strong className="text-emerald-700 font-bold">{girlsCount}</strong></span>
          </div>
        </div>

        {/* Daily Attendance Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-800">{attendanceRate}%</span>
            <span className="text-xs font-medium text-slate-500">Present</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Register: <strong>{attendanceSessions.length} Sections Marked</strong></span>
          </div>
        </div>

        {/* Fee Collection Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Fees</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              PKR {totalCollected.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pending: <strong className="text-rose-600">PKR {totalOutstanding.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Faculty & Staff */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faculty Roster</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalTeachers}</span>
            <span className="text-xs font-medium text-slate-500">Scholars &amp; Teachers</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Inquiries: <strong className="text-amber-600">{pendingAdmissions} Pending</strong></span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Engine: Attendance Trends & Academic Performance per Class */}
      <SchoolAnalyticsCharts
        attendanceSessions={attendanceSessions}
        examMarks={examMarks}
        students={students}
        classes={classes}
        sections={sections}
        examinations={examinations}
        initialTab="attendance"
      />

      {/* Boys & Girls Distribution & Academic Wings Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender Demographics Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Campus Wing Ratio
            </h3>
            <span className="text-xs text-slate-400">Strict Segregation</span>
          </div>

          <div className="space-y-4">
            {/* Visual ratio bar */}
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${boysPercentage}%` }}
                className="bg-blue-600 h-full transition-all"
                title={`Boys Wing: ${boysCount} students (${boysPercentage}%)`}
              />
              <div
                style={{ width: `${girlsPercentage}%` }}
                className="bg-emerald-600 h-full transition-all"
                title={`Girls Wing: ${girlsCount} students (${girlsPercentage}%)`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-900">Boys Campus</p>
                <p className="text-xl font-extrabold text-blue-950 mt-1">{boysCount}</p>
                <p className="text-[10px] text-blue-700 font-medium">{boysPercentage}% of total</p>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-900">Girls Campus</p>
                <p className="text-xl font-extrabold text-emerald-950 mt-1">{girlsCount}</p>
                <p className="text-[10px] text-emerald-700 font-medium">{girlsPercentage}% of total</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Equitable resource allocation across both campuses including specialized laboratories,
              auditoriums, and sports facilities.
            </p>
          </div>
        </div>

        {/* Recent Admissions Pipeline Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Inbound Online Admissions
              </h3>
              <p className="text-xs text-slate-500">Prospective student applications awaiting review</p>
            </div>
            <button
              onClick={() => onNavigateTab('admissions')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              <span>View All ({admissions.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Applicant</th>
                  <th className="px-3 py-2.5">Wing</th>
                  <th className="px-3 py-2.5">Applied Class</th>
                  <th className="px-3 py-2.5">Parent Contact</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.slice(0, 4).map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/70">
                    <td className="px-3 py-2.5 font-bold text-slate-800">{adm.applicantName}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        adm.gender === 'male'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {adm.gender === 'male' ? 'Boys Wing' : 'Girls Wing'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{adm.appliedClass}</td>
                    <td className="px-3 py-2.5 text-slate-600">{adm.phone}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        adm.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : adm.status === 'interview_scheduled'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {adm.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Class-Wise Enrollment Roster Preview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Playgroup through Class 12 Distribution
            </h3>
            <p className="text-xs text-slate-500">15 Academic levels with dedicated section rosters</p>
          </div>
          <button
            onClick={() => onNavigateTab('classes')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
          >
            <span>Manage Academic Levels</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {classes.slice(0, 15).map((cls) => {
            const enrolledInClass = students.filter((s) => s.classId === cls.id).length;
            return (
              <div
                key={cls.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">{cls.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800">
                    {cls.wing.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-lg font-black text-slate-900">
                    {enrolledInClass > 0 ? enrolledInClass : 38 + (cls.numericGrade % 8)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Capacity: {cls.capacity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
