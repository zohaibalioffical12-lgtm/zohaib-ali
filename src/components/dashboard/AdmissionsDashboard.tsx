import React, { useState } from 'react';
import { AdmissionApplication, Student, SchoolClass, Section } from '../../types';
import { updateAdmissionStatus, createStudent } from '../../services/dataService';
import {
  UserCheck,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  UserPlus,
} from 'lucide-react';

interface AdmissionsDashboardProps {
  admissions: AdmissionApplication[];
  classes: SchoolClass[];
  sections: Section[];
  onApplicationUpdated: () => void;
  onStudentEnrolled: (student: Student) => void;
}

export const AdmissionsDashboard: React.FC<AdmissionsDashboardProps> = ({
  admissions,
  classes,
  sections,
  onApplicationUpdated,
  onStudentEnrolled,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'interview_scheduled' | 'approved' | 'rejected'>('all');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const filtered = admissions.filter((a) => (filter === 'all' ? true : a.status === filter));

  const handleStatusChange = async (id: string, status: AdmissionApplication['status']) => {
    try {
      await updateAdmissionStatus(id, status);
      onApplicationUpdated();
    } catch (err) {
      console.error('Failed to update admission status:', err);
    }
  };

  const handleEnrollApplicant = async (app: AdmissionApplication) => {
    setEnrollingId(app.id);
    try {
      // Find matching class or default
      const matchedClass =
        classes.find((c) => (app?.appliedClass || '').toLowerCase().includes((c?.name || '').toLowerCase())) ||
        classes[11] ||
        classes[0];

      const genderSec = app.gender === 'male' ? 'boys' : 'girls';
      const matchedSection =
        sections.find((s) => s.classId === matchedClass.id && s.genderSection === genderSec) ||
        sections[0];

      const newStudent = await createStudent({
        admissionNo: `MSC-2026-${Math.floor(200 + Math.random() * 800)}`,
        fullName: app.applicantName,
        gender: app.gender,
        dateOfBirth: app.dateOfBirth || '2010-01-01',
        admissionDate: new Date().toISOString().split('T')[0],
        academicYear: '2026-2027',
        classId: matchedClass.id,
        className: matchedClass.name,
        sectionId: matchedSection?.id || `sec_${matchedClass.id}_${genderSec}`,
        sectionName: matchedSection?.name || 'Section A',
        genderSection: genderSec,
        rollNo: `${Math.floor(10 + Math.random() * 30)}`,
        guardianName: app.parentName,
        guardianPhone: app.phone,
        guardianEmail: app.email,
        guardianRelation: 'Father',
        address: app.address || 'Islamabad',
        status: 'active',
        monthlyFee: 14500,
        createdAt: new Date().toISOString(),
      });

      await updateAdmissionStatus(app.id, 'approved');
      onStudentEnrolled(newStudent);
      onApplicationUpdated();
    } catch (err) {
      console.error('Error enrolling student:', err);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admissions Header */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Admissions Directorate
            </span>
            <span className="text-xs text-rose-300 font-semibold">• Candidate Review</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Admissions Pipeline &amp; Entrance Roster</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Process candidate applications, schedule entrance interviews, and admit students directly into Firestore SIS.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/70 p-1.5 rounded-xl border border-white/10">
          {(['all', 'pending', 'interview_scheduled', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === st
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                  app.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : app.status === 'interview_scheduled'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : app.status === 'rejected'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {app.status.replace('_', ' ')}
                </span>

                <span className="text-xs text-slate-400 font-mono">Date: {app.submissionDate}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  app.gender === 'male' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {app.gender === 'male' ? 'Boys Campus' : 'Girls Campus'}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {app.appliedClass}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{app.applicantName}</h3>
              <p className="text-xs text-slate-600 font-medium">Guardian: {app.parentName}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{app.phone}</span>
                </p>
                {app.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{app.email}</span>
                  </p>
                )}
                {app.previousSchool && (
                  <p className="text-[11px] text-slate-500">
                    Previous School: <span className="text-slate-700">{app.previousSchool}</span>
                  </p>
                )}
                {app.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-md">
                    {app.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStatusChange(app.id, 'interview_scheduled')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'rejected')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  Reject
                </button>
              </div>

              {app.status !== 'approved' && (
                <button
                  onClick={() => handleEnrollApplicant(app)}
                  disabled={enrollingId === app.id}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{enrollingId === app.id ? 'Enrolling...' : 'Approve & Enroll (SIS)'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
