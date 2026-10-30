import React from 'react';
import {
  Student,
  Examination,
  ExamMark,
  Timetable,
  Announcement,
} from '../../types';
import {
  GraduationCap,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  Printer,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface StudentDashboardProps {
  students: Student[];
  examinations: Examination[];
  examMarks: ExamMark[];
  timetables: Timetable[];
  announcements: Announcement[];
  onOpenReportCard: (student: Student, exam: Examination) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  students,
  examinations,
  examMarks,
  timetables,
  announcements,
  onOpenReportCard,
}) => {
  // Active student (default Muhammad Hamza Khan or Fatima Zahra)
  const currentStudent = students[0] || {
    id: 'std_01',
    admissionNo: 'MSC-2024-001',
    fullName: 'Muhammad Hamza Khan',
    gender: 'male',
    className: 'Class 10 (Matriculation)',
    sectionName: 'Section A',
    genderSection: 'boys',
    rollNo: '10-B-01',
    guardianName: 'Tariq Khan',
    status: 'active',
  };

  const studentMarks = examMarks.filter((m) => m.studentId === currentStudent.id);
  const targetExam = examinations[0] || {
    id: 'exam_mid_2026',
    title: 'Mid-Term Examinations 2026',
    term: 'Mid Term',
    academicYear: '2026-2027',
  };

  // Find timetable for student's class
  const studentTimetable = timetables[0] || {
    dayOfWeek: 'Monday',
    periods: [
      { periodNumber: 1, startTime: '08:00', endTime: '08:45', subject: 'Quran Tajweed & Islamic Studies', teacherName: 'Ustadh Hafiz Usman', room: 'B-201' },
      { periodNumber: 2, startTime: '08:45', endTime: '09:30', subject: 'Mathematics', teacherName: 'Engr. Bilal Hashmi', room: 'B-201' },
      { periodNumber: 3, startTime: '09:30', endTime: '10:15', subject: 'Physics Lab', teacherName: 'Dr. Tariq Mahmood', room: 'Lab 1' },
      { periodNumber: 4, startTime: '10:45', endTime: '11:30', subject: 'English Literature', teacherName: 'Mrs. Saima Noreen', room: 'B-201' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Student ID Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-slate-900 text-amber-300 font-black text-2xl flex items-center justify-center border-2 border-amber-400/40 shadow-lg shrink-0">
            {currentStudent.fullName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                Active Student
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                • {currentStudent.genderSection === 'boys' ? 'Boys Wing & Campus' : 'Girls Wing & Campus'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">{currentStudent.fullName}</h2>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300 mt-1">
              <span>Admission No: <strong className="font-mono text-amber-300">{currentStudent.admissionNo}</strong></span>
              <span>•</span>
              <span>Class: <strong className="text-white">{currentStudent.className}</strong> ({currentStudent.sectionName})</span>
              <span>•</span>
              <span>Roll: <strong className="text-white">{currentStudent.rollNo || '01'}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenReportCard(currentStudent as any, targetExam as any)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 border border-amber-400/30 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>View Official Report Card</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance Percentage */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Attendance Rate</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-800">96.4%</p>
          <p className="text-xs text-slate-500 mt-1">Status: Regular &amp; Punctual (No fines)</p>
        </div>

        {/* Mid-Term GPA / Grade */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mid-Term Evaluation</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">A+</span>
            <span className="text-xs font-bold text-emerald-700">94.8% Average</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Position: 1st in Class Section</p>
        </div>

        {/* Conduct & Tarbiyah */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Islamic Tarbiyah Grade</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">Mumtaz</p>
          <p className="text-xs text-slate-500 mt-1">Exemplary Islamic Adab &amp; Character</p>
        </div>
      </div>

      {/* Class Schedule Timetable */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Today&apos;s Class Schedule ({studentTimetable.dayOfWeek})</span>
            </h3>
            <p className="text-xs text-slate-500">School Bell Timings &amp; Lecture Venues</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {studentTimetable.periods.map((p, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 mb-1">
                <span>Period {p.periodNumber}</span>
                <span className="font-mono text-slate-500">{p.startTime} - {p.endTime}</span>
              </div>
              <p className="text-xs font-bold text-slate-900 line-clamp-1">{p.subject}</p>
              <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>{p.teacherName}</span>
                <span className="font-medium bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {p.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
