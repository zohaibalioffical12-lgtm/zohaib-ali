import React, { useState, useEffect } from 'react';
import {
  Student,
  SchoolClass,
  Section,
  Teacher,
  AttendanceSession,
  AttendanceRecord,
  Examination,
  ExamMark,
} from '../../types';
import { submitAttendanceSession, saveExamMarks } from '../../services/dataService';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Save,
  BookOpen,
  Award,
  Users,
  AlertCircle,
  Printer,
  History,
  RotateCcw,
  CheckCheck,
  UserCheck,
  UserX,
  FileSpreadsheet,
  X,
} from 'lucide-react';

interface TeacherDashboardProps {
  students: Student[];
  classes: SchoolClass[];
  sections: Section[];
  teachers: Teacher[];
  examinations: Examination[];
  examMarks: ExamMark[];
  attendanceSessions?: AttendanceSession[];
  onAttendanceSubmitted: (session: AttendanceSession) => void;
  onMarksSaved: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  classes,
  sections,
  teachers,
  examinations,
  examMarks,
  attendanceSessions = [],
  onAttendanceSubmitted,
  onMarksSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'history' | 'marks'>('attendance');

  // Active teacher (Default Dr. Tariq Mahmood or Hafiz Usman)
  const currentTeacher = teachers[0] || {
    id: 'tch_1',
    fullName: 'Dr. Tariq Mahmood',
    designation: 'Head of Physics & Senior Lecturer',
  };

  // Section Selector for Attendance
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    sections[0]?.id || 'sec_10_b_a'
  );
  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];
  const currentClass = classes.find((c) => c.id === currentSection?.classId);

  // Filter enrolled students for this section
  const sectionStudents = students.filter(
    (s) => s.classId === currentSection?.classId || s.sectionId === currentSection?.id
  );

  // Attendance state dictionary: studentId -> 'present' | 'absent' | 'late' | 'leave'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late' | 'leave'>>(() => {
    const init: Record<string, 'present' | 'absent' | 'late' | 'leave'> = {};
    sectionStudents.forEach((s) => {
      init[s.id] = 'present';
    });
    return init;
  });

  // Remarks state: studentId -> string
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});

  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [submittingAtt, setSubmittingAtt] = useState(false);
  const [attSuccessMsg, setAttSuccessMsg] = useState<string | null>(null);
  const [attErrorMsg, setAttErrorMsg] = useState<string | null>(null);
  const [showMarkAllAbsentConfirm, setShowMarkAllAbsentConfirm] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Reset attendance state when section or date changes
  useEffect(() => {
    const init: Record<string, 'present' | 'absent' | 'late' | 'leave'> = {};
    sectionStudents.forEach((s) => {
      init[s.id] = 'present';
    });
    setAttendanceMap(init);
    setRemarksMap({});
    setAttSuccessMsg(null);
    setAttErrorMsg(null);
  }, [selectedSectionId, attendanceDate]);

  // Metrics calculation
  const totalRoster = sectionStudents.length;
  const presentCount = sectionStudents.filter((s) => (attendanceMap[s.id] || 'present') === 'present').length;
  const absentCount = sectionStudents.filter((s) => attendanceMap[s.id] === 'absent').length;
  const lateCount = sectionStudents.filter((s) => attendanceMap[s.id] === 'late').length;
  const leaveCount = sectionStudents.filter((s) => attendanceMap[s.id] === 'leave').length;
  const attendanceRate = totalRoster > 0 ? ((presentCount / totalRoster) * 100).toFixed(1) : '100.0';

  // Marks Entry State
  const [selectedExamId, setSelectedExamId] = useState<string>(
    examinations[0]?.id || 'exam_mid_2026'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [marksState, setMarksState] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    sectionStudents.forEach((s) => {
      init[s.id] = 88 + Math.floor(Math.random() * 10);
    });
    return init;
  });
  const [savingMarks, setSavingMarks] = useState(false);
  const [marksSuccessMsg, setMarksSuccessMsg] = useState<string | null>(null);

  // Attendance Handlers
  const handleSetStatus = (studentId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSetRemarks = (studentId: string, text: string) => {
    setRemarksMap((prev) => ({ ...prev, [studentId]: text }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'present' | 'absent' | 'late' | 'leave'> = {};
    sectionStudents.forEach((s) => {
      updated[s.id] = 'present';
    });
    setAttendanceMap(updated);
  };

  const handleMarkAllAbsentConfirmed = () => {
    const updated: Record<string, 'present' | 'absent' | 'late' | 'leave'> = {};
    sectionStudents.forEach((s) => {
      updated[s.id] = 'absent';
    });
    setAttendanceMap(updated);
    setShowMarkAllAbsentConfirm(false);
  };

  const handleResetUnsaved = () => {
    const init: Record<string, 'present' | 'absent' | 'late' | 'leave'> = {};
    sectionStudents.forEach((s) => {
      init[s.id] = 'present';
    });
    setAttendanceMap(init);
    setRemarksMap({});
    setAttSuccessMsg(null);
    setAttErrorMsg(null);
  };

  const handleSubmitAttendance = async () => {
    if (!currentSection) return;
    setSubmittingAtt(true);
    setAttSuccessMsg(null);
    setAttErrorMsg(null);

    try {
      const records = sectionStudents.map((s) => ({
        date: attendanceDate,
        studentId: s.id,
        studentName: s.fullName,
        admissionNo: s.admissionNo,
        classId: s.classId,
        sectionId: s.sectionId,
        status: attendanceMap[s.id] || 'present',
        remarks: remarksMap[s.id] || 'Daily Session Register',
      }));

      const session = await submitAttendanceSession(
        {
          date: attendanceDate,
          classId: currentSection.classId,
          className: currentSection.className,
          sectionId: currentSection.id,
          sectionName: currentSection.name,
          genderSection: currentSection.genderSection,
          teacherId: currentTeacher.id,
          teacherName: currentTeacher.fullName,
          totalStudents: records.length,
          presentCount,
          absentCount,
          lateCount,
          leaveCount,
          status: 'submitted',
        },
        records
      );

      onAttendanceSubmitted(session);
      setAttSuccessMsg(
        `Attendance register for ${currentSection.className} - ${currentSection.name} (${currentSection.genderSection.toUpperCase()} Wing) on ${attendanceDate} successfully saved to Firebase!`
      );
    } catch (err: unknown) {
      console.error('Failed to submit attendance:', err);
      setAttErrorMsg('Failed to save attendance to Firestore. Your unsaved entries have been preserved. Please try again.');
    } finally {
      setSubmittingAtt(false);
    }
  };

  // Marks Handlers
  const handleSaveMarks = async () => {
    setSavingMarks(true);
    setMarksSuccessMsg(null);

    try {
      const payload: Omit<ExamMark, 'id'>[] = sectionStudents.map((s) => {
        const marks = Number(marksState[s.id] || 0);
        let grade = 'A';
        if (marks >= 90) grade = 'A+';
        else if (marks >= 80) grade = 'A';
        else if (marks >= 70) grade = 'B';
        else if (marks >= 60) grade = 'C';
        else if (marks >= 50) grade = 'D';
        else grade = 'F';

        return {
          examId: selectedExamId,
          examTitle: examinations.find((e) => e.id === selectedExamId)?.title || 'Term Exam',
          studentId: s.id,
          studentName: s.fullName,
          admissionNo: s.admissionNo,
          classId: s.classId,
          sectionId: s.sectionId,
          subjectId: `sb_${selectedSubject.toLowerCase().slice(0, 3)}`,
          subjectName: selectedSubject,
          marksObtained: marks,
          maxMarks: 100,
          passingMarks: 33,
          grade,
        };
      });

      await saveExamMarks(payload);
      onMarksSaved();
      setMarksSuccessMsg(`Evaluation marks for ${selectedSubject} saved to Firestore successfully!`);
    } catch (err) {
      console.error('Failed to save exam marks:', err);
    } finally {
      setSavingMarks(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-amber-400/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Faculty &amp; Attendance Portal
            </span>
            <span className="text-xs text-emerald-200">• {currentTeacher.fullName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Daily Student Attendance &amp; Marks Management
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Designation: {currentTeacher.designation} • The Muslim School &amp; College, Mardan
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Attendance Register</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-300" />
            <span>History &amp; Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'marks'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Exam Marks</span>
          </button>
        </div>
      </div>

      {activeTab === 'attendance' && (
        /* Attendance Register View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Notification Messages */}
          {attSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">{attSuccessMsg}</span>
              </div>
              <button
                onClick={() => setAttSuccessMsg(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {attErrorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="font-bold">{attErrorMsg}</span>
              </div>
              <button
                onClick={() => setAttErrorMsg(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Section & Date Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-5 border-b border-slate-200">
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Class &amp; Campus Section *
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-600"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.className} - {sec.name} ({sec.genderSection.toUpperCase()} WING)
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Attendance Date *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white font-medium"
                />
                <button
                  type="button"
                  onClick={() => setAttendanceDate(new Date().toISOString().split('T')[0])}
                  className="px-2.5 py-2 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Set to today"
                >
                  Today
                </button>
              </div>
            </div>

            <div className="sm:col-span-3 flex items-end justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
                title="Print official attendance register"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Sheet</span>
              </button>
            </div>
          </div>

          {/* Quick Action Buttons & Real-Time Metrics Strip */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMarkAllAbsentConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 transition-colors cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Mark All Absent</span>
              </button>
              <button
                type="button"
                onClick={handleResetUnsaved}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Unsaved</span>
              </button>
            </div>

            {/* Attendance Metrics Counters */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-slate-600">Total: <strong className="text-slate-900">{totalRoster}</strong></span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Present: {presentCount}</span>
              <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Absent: {absentCount}</span>
              <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Late: {lateCount}</span>
              <span className="text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Leave: {leaveCount}</span>
              <span className="text-emerald-900 font-extrabold ml-1">Rate: {attendanceRate}%</span>
            </div>
          </div>

          {/* Mark All Absent Confirmation Modal */}
          {showMarkAllAbsentConfirm && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs space-y-3">
              <p className="font-bold text-rose-900">
                Are you sure you want to mark all {sectionStudents.length} students as ABSENT?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllAbsentConfirmed}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-700 text-white font-bold text-xs hover:bg-rose-800"
                >
                  Yes, Mark All Absent
                </button>
                <button
                  type="button"
                  onClick={() => setShowMarkAllAbsentConfirm(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3 text-center">Roll No</th>
                  <th className="px-4 py-3">Class &amp; Section</th>
                  <th className="px-4 py-3 text-center">Attendance Status</th>
                  <th className="px-4 py-3">Optional Remarks</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectionStudents.map((st) => {
                  const currentStatus = attendanceMap[st.id] || 'present';
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student ID */}
                      <td className="px-4 py-3 font-mono text-slate-600 font-semibold">{st.admissionNo}</td>

                      {/* Student Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            st.genderSection === 'boys' ? 'bg-blue-600' : 'bg-emerald-600'
                          }`}>
                            {st.fullName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{st.fullName}</p>
                            <p className="text-[10px] text-slate-400 capitalize">{st.genderSection} Wing</p>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="px-4 py-3 text-center font-mono font-bold text-slate-700">
                        {st.rollNo || st.admissionNo.slice(-3)}
                      </td>

                      {/* Class & Section */}
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {currentSection.className} - {currentSection.name}
                      </td>

                      {/* Attendance Status Buttons */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSetStatus(st.id, 'present')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(st.id, 'absent')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(st.id, 'late')}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(st.id, 'leave')}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'leave'
                                ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>

                      {/* Optional Remarks */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="e.g. sick leave, excused..."
                          value={remarksMap[st.id] || ''}
                          onChange={(e) => handleSetRemarks(st.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 text-slate-800 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                        />
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleSetStatus(
                              st.id,
                              currentStatus === 'present'
                                ? 'absent'
                                : currentStatus === 'absent'
                                ? 'late'
                                : currentStatus === 'late'
                                ? 'leave'
                                : 'present'
                            )
                          }
                          className="px-2 py-1 rounded text-[10px] font-semibold text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                          title="Toggle status"
                        >
                          Cycle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Submission Action Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              <p>
                Class Roster: <strong className="text-slate-900">{sectionStudents.length} Students</strong> • Date: <strong className="text-slate-900">{attendanceDate}</strong>
              </p>
              <p className="text-[10px] text-slate-400">
                Submissions automatically prevent duplicates and create an immutable audit record in Firestore.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetUnsaved}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Reset Changes
              </button>
              <button
                type="button"
                onClick={handleSubmitAttendance}
                disabled={submittingAtt}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-800 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>{submittingAtt ? 'Saving to Firebase...' : 'Save & Publish Attendance'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance History View */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                Attendance Registers &amp; Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Historical daily attendance registers recorded for {currentSection.className} - {currentSection.name}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('attendance')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
            >
              Take Today&apos;s Attendance
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Class &amp; Section</th>
                  <th className="px-4 py-3">Teacher</th>
                  <th className="px-4 py-3 text-center">Present</th>
                  <th className="px-4 py-3 text-center">Absent</th>
                  <th className="px-4 py-3 text-center">Late</th>
                  <th className="px-4 py-3 text-center">Leave</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center">Rate</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceSessions.map((sess) => {
                  const rate = sess.totalStudents > 0 ? ((sess.presentCount / sess.totalStudents) * 100).toFixed(1) : '100';
                  return (
                    <tr key={sess.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800">{sess.date}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {sess.className} ({sess.sectionName})
                      </td>
                      <td className="px-4 py-3 text-slate-600">{sess.teacherName}</td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-700">{sess.presentCount}</td>
                      <td className="px-4 py-3 text-center font-bold text-rose-600">{sess.absentCount}</td>
                      <td className="px-4 py-3 text-center font-bold text-amber-600">{sess.lateCount}</td>
                      <td className="px-4 py-3 text-center font-bold text-sky-600">{sess.leaveCount || 0}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{sess.totalStudents}</td>
                      <td className="px-4 py-3 text-center font-extrabold text-emerald-800">{rate}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
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
      )}

      {/* Marks View */}
      {activeTab === 'marks' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          {marksSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{marksSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Examination *
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                {examinations.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title} ({ex.term})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject Evaluated *
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Quran Tajweed & Islamic Studies">Quran Tajweed &amp; Islamic Studies</option>
                <option value="Computer Science">Computer Science</option>
                <option value="English Literature">English Literature</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 w-full">
                <span>Passing Criteria: </span>
                <strong className="text-emerald-700">33 / 100 Marks (33%)</strong>
              </div>
            </div>
          </div>

          {/* Marks Input Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Admission No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3 text-center">Max Marks</th>
                  <th className="px-4 py-3 text-center">Marks Obtained (0-100)</th>
                  <th className="px-4 py-3 text-center">Calculated Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectionStudents.map((st) => {
                  const m = marksState[st.id] ?? 85;
                  let grade = 'A';
                  if (m >= 90) grade = 'A+';
                  else if (m >= 80) grade = 'A';
                  else if (m >= 70) grade = 'B';
                  else if (m >= 60) grade = 'C';
                  else if (m >= 50) grade = 'D';
                  else grade = 'F';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono text-slate-500">{st.admissionNo}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{st.fullName}</td>
                      <td className="px-4 py-3 text-center text-slate-500 font-medium">100</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={m}
                          onChange={(e) =>
                            setMarksState((prev) => ({
                              ...prev,
                              [st.id]: Number(e.target.value),
                            }))
                          }
                          className="w-20 px-2 py-1 text-center font-bold border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
            <button
              onClick={handleSaveMarks}
              disabled={savingMarks}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-800 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{savingMarks ? 'Saving Marks...' : 'Save & Publish Subject Marks'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Printable Sheet Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider">
                Print Official Daily Attendance Register
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sheet</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-white text-slate-900">
              <div className="text-center border-b-2 border-emerald-900 pb-4 mb-4">
                <p className="font-serif text-amber-600 text-xs">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <h3 className="text-xl font-black uppercase text-slate-900">THE MUSLIM SCHOOL &amp; COLLEGE</h3>
                <p className="text-[10px] text-slate-600">Main Road, Gujrat Near Ground, Mardan, Pakistan • Ph: +92 313 9375355</p>
                <p className="text-xs font-bold text-emerald-800 uppercase mt-1">
                  OFFICIAL DAILY ATTENDANCE REGISTER — {attendanceDate}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-lg mb-4">
                <div>Class: <strong>{currentSection.className}</strong></div>
                <div>Section: <strong>{currentSection.name}</strong></div>
                <div>Wing: <strong className="capitalize">{currentSection.genderSection}</strong></div>
                <div>Teacher: <strong>{currentTeacher.fullName}</strong></div>
              </div>

              <table className="w-full text-xs text-left border border-slate-300 mb-6">
                <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="border p-2">Roll</th>
                    <th className="border p-2">Adm No</th>
                    <th className="border p-2">Student Name</th>
                    <th className="border p-2 text-center">Status</th>
                    <th className="border p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionStudents.map((st) => (
                    <tr key={st.id} className="border">
                      <td className="border p-2 font-mono">{st.rollNo || '01'}</td>
                      <td className="border p-2 font-mono">{st.admissionNo}</td>
                      <td className="border p-2 font-bold">{st.fullName}</td>
                      <td className="border p-2 text-center uppercase font-bold">
                        {attendanceMap[st.id] || 'present'}
                      </td>
                      <td className="border p-2 text-slate-500">{remarksMap[st.id] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-8 text-center text-xs pt-6 border-t border-slate-300">
                <div>
                  <div className="w-32 border-b border-slate-400 mx-auto mb-1" />
                  <p className="font-bold text-slate-800">Class Teacher Signature</p>
                </div>
                <div>
                  <div className="w-32 border-b border-slate-400 mx-auto mb-1" />
                  <p className="font-bold text-slate-800">Principal / Headmistress Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
