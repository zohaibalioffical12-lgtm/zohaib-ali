import React, { useState } from 'react';
import { SchoolClass, Section, Student, Gender, GenderSection } from '../../types';
import { createStudent } from '../../services/dataService';
import { X, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

interface AddStudentModalProps {
  classes: SchoolClass[];
  sections: Section[];
  onClose: () => void;
  onStudentAdded: (student: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  classes,
  sections,
  onClose,
  onStudentAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultClass = classes[11] || classes[0] || { id: 'cls_9', name: 'Class 9' };

  const [formData, setFormData] = useState({
    admissionNo: `MSC-2026-${Math.floor(100 + Math.random() * 900)}`,
    fullName: '',
    gender: 'male' as Gender,
    dateOfBirth: '2010-05-15',
    admissionDate: new Date().toISOString().split('T')[0],
    academicYear: '2026-2027',
    classId: defaultClass.id,
    className: defaultClass.name,
    sectionId: '',
    sectionName: 'Section A',
    genderSection: 'boys' as GenderSection,
    rollNo: '01',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelation: 'Father',
    address: 'Islamabad',
    monthlyFee: 14500,
  });

  // Filter sections based on selected class and gender
  const availableSections = sections.filter(
    (s) => s.classId === formData.classId && s.genderSection === formData.genderSection
  );

  const handleClassChange = (classId: string) => {
    const selected = classes.find((c) => c.id === classId);
    setFormData((prev) => ({
      ...prev,
      classId,
      className: selected ? selected.name : prev.className,
    }));
  };

  const handleGenderChange = (gender: Gender) => {
    const genderSec: GenderSection = gender === 'male' ? 'boys' : 'girls';
    setFormData((prev) => ({
      ...prev,
      gender,
      genderSection: genderSec,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.guardianName || !formData.guardianPhone) {
      setError('Please provide student full name, guardian name, and guardian phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const chosenSection = availableSections[0] || {
        id: `sec_${formData.classId}_${formData.genderSection}`,
        name: 'Section A',
      };

      const newStudent = await createStudent({
        admissionNo: formData.admissionNo.trim(),
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        admissionDate: formData.admissionDate,
        academicYear: formData.academicYear,
        classId: formData.classId,
        className: formData.className,
        sectionId: chosenSection.id,
        sectionName: chosenSection.name,
        genderSection: formData.genderSection,
        rollNo: formData.rollNo,
        guardianName: formData.guardianName.trim(),
        guardianPhone: formData.guardianPhone.trim(),
        guardianEmail: formData.guardianEmail.trim(),
        guardianRelation: formData.guardianRelation,
        address: formData.address.trim(),
        status: 'active',
        monthlyFee: Number(formData.monthlyFee) || 12000,
        createdAt: new Date().toISOString(),
      });

      onStudentAdded(newStudent);
      onClose();
    } catch (err: any) {
      console.error('Error creating student in Firestore:', err);
      setError('Failed to record student in Firestore. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Enroll New Student (SIS Registration)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admission Number *
              </label>
              <input
                type="text"
                required
                value={formData.admissionNo}
                onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-800 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Zaid bin Khalid"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender / Campus Wing *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleGenderChange(e.target.value as Gender)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="male">Male (Boys Wing &amp; Campus)</option>
                <option value="female">Female (Girls Wing &amp; Campus)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Class (Playgroup to 12) *
              </label>
              <select
                value={formData.classId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Tuition Fee (PKR)
              </label>
              <input
                type="number"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Father / Guardian Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Khalid Mehmood"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guardian Mobile Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="+92 300 1234567"
                value={formData.guardianPhone}
                onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Saving to Database...' : 'Register & Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
