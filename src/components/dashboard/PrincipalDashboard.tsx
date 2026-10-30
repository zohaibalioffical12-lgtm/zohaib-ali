import React from 'react';
import {
  Student,
  SchoolClass,
  Section,
  Teacher,
  AttendanceSession,
  Examination,
  ExamMark,
} from '../../types';
import { SchoolAnalyticsCharts } from './SchoolAnalyticsCharts';
import {
  GraduationCap,
  Award,
  CheckCircle,
  Clock,
  Shield,
  Layers,
  ArrowRight,
  BookOpen,
  Users,
} from 'lucide-react';

interface PrincipalDashboardProps {
  students: Student[];
  classes: SchoolClass[];
  sections: Section[];
  teachers: Teacher[];
  attendanceSessions: AttendanceSession[];
  examinations: Examination[];
  examMarks?: ExamMark[];
  onOpenReportCard: () => void;
  onNavigateTab: (tab: string) => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({
  students,
  classes,
  sections,
  teachers,
  attendanceSessions,
  examinations,
  examMarks = [],
  onOpenReportCard,
  onNavigateTab,
}) => {
  const pendingApprovals = attendanceSessions.filter((s) => s.status === 'submitted');

  return (
    <div className="space-y-6">
      {/* Principal Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Principal&apos;s Secretariat
            </span>
            <span className="text-xs text-blue-300 font-semibold">• Dr. Tariq Mahmood, Ph.D.</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Academic Performance &amp; Discipline</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Oversight of boys and girls wings, syllabus completion, faculty workload, and attendance registers.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('attendance')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
        >
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>Approve Registers ({pendingApprovals.length})</span>
        </button>
      </div>

      {/* Boys vs Girls Wing Comparative Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Boys Campus Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
              Ibn Al-Haytham Boys Wing
            </span>
            <span className="text-xs font-semibold text-slate-500">Classes 6 to 12</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="p-3 bg-blue-50/70 rounded-xl">
              <p className="text-[10px] font-bold text-blue-800 uppercase">Enrolled</p>
              <p className="text-xl font-extrabold text-blue-950 mt-1">
                {students.filter((s) => s.gender === 'male').length || 720}
              </p>
            </div>
            <div className="p-3 bg-blue-50/70 rounded-xl">
              <p className="text-[10px] font-bold text-blue-800 uppercase">Attendance</p>
              <p className="text-xl font-extrabold text-emerald-700 mt-1">95.2%</p>
            </div>
            <div className="p-3 bg-blue-50/70 rounded-xl">
              <p className="text-[10px] font-bold text-blue-800 uppercase">Board A+</p>
              <p className="text-xl font-extrabold text-amber-600 mt-1">94%</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Head of Wing: <strong className="text-slate-800">Ustadh Hafiz Usman Raza</strong>.
            Discipline status: Exemplary. Preparations for FBISE Model Board exams on schedule.
          </p>
        </div>

        {/* Girls Campus Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
              Fatima Al-Fihri Girls Wing
            </span>
            <span className="text-xs font-semibold text-slate-500">Classes 6 to 12</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="p-3 bg-emerald-50/70 rounded-xl">
              <p className="text-[10px] font-bold text-emerald-800 uppercase">Enrolled</p>
              <p className="text-xl font-extrabold text-emerald-950 mt-1">
                {students.filter((s) => s.gender === 'female').length || 730}
              </p>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-xl">
              <p className="text-[10px] font-bold text-emerald-800 uppercase">Attendance</p>
              <p className="text-xl font-extrabold text-emerald-700 mt-1">96.8%</p>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-xl">
              <p className="text-[10px] font-bold text-emerald-800 uppercase">Board A+</p>
              <p className="text-xl font-extrabold text-amber-600 mt-1">97%</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Head of Wing: <strong className="text-slate-800">Mrs. Saima Noreen</strong>.
            Highest district result in F.Sc Pre-Medical biology examinations.
          </p>
        </div>
      </div>

      {/* Visual Analytics: Attendance Trends & Class Academic Performance */}
      <SchoolAnalyticsCharts
        attendanceSessions={attendanceSessions}
        examMarks={examMarks}
        students={students}
        classes={classes}
        sections={sections}
        examinations={examinations}
        initialTab="academic"
      />

      {/* Attendance Approval Queue */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Daily Attendance Registers Awaiting Principal Endorsement
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Class &amp; Section</th>
                <th className="px-4 py-2.5">Wing</th>
                <th className="px-4 py-2.5">Class Teacher</th>
                <th className="px-4 py-2.5 text-center">Present / Total</th>
                <th className="px-4 py-2.5 text-center">Percentage</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceSessions.map((sess) => {
                const pct = sess.totalStudents > 0 ? ((sess.presentCount / sess.totalStudents) * 100).toFixed(0) : '0';
                return (
                  <tr key={sess.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-semibold text-slate-800">{sess.date}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-900">
                      {sess.className} ({sess.sectionName})
                    </td>
                    <td className="px-4 py-2.5 capitalize">{sess.genderSection} Wing</td>
                    <td className="px-4 py-2.5 text-slate-600">{sess.teacherName}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-slate-900">
                      {sess.presentCount} / {sess.totalStudents}
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold text-emerald-700">{pct}%</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        sess.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sess.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
