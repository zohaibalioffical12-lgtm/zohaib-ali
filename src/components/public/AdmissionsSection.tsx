import React, { useState } from 'react';
import { submitAdmissionApplication } from '../../services/dataService';
import {
  Sparkles,
  Send,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Phone,
  User,
  School,
} from 'lucide-react';
import { Gender } from '../../types';

export const AdmissionsSection: React.FC = () => {
  const [formData, setFormData] = useState({
    applicantName: '',
    gender: 'male' as Gender,
    appliedClass: 'Class 9 (Matriculation)',
    dateOfBirth: '2011-01-01',
    parentName: '',
    phone: '',
    email: '',
    previousSchool: '',
    bFormCnic: '',
    address: '',
    isHafiz: 'no',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const classOptions = [
    'Playgroup (Early Years)',
    'Nursery (Early Years)',
    'KG - Kindergarten',
    'Class 1 (Primary Wing)',
    'Class 2 (Primary Wing)',
    'Class 3 (Primary Wing)',
    'Class 4 (Primary Wing)',
    'Class 5 (Primary Wing)',
    'Class 6 (Middle Wing)',
    'Class 7 (Middle Wing)',
    'Class 8 (Middle Wing)',
    'Class 9 (Matric Science / CS)',
    'Class 10 (Matric Science / CS)',
    'Class 11 (1st Year F.Sc Pre-Medical)',
    'Class 11 (1st Year F.Sc Pre-Engineering)',
    'Class 11 (1st Year ICS Computer Science)',
    'Class 12 (2nd Year F.Sc Pre-Medical)',
    'Class 12 (2nd Year F.Sc Pre-Engineering)',
    'Class 12 (2nd Year ICS Computer Science)',
    'Integrated Hifz-ul-Quran Department',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.parentName || !formData.phone) {
      setErrorMsg('Please fill in all mandatory fields (Student Name, Parent Name, Phone).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await submitAdmissionApplication({
        applicantName: formData.applicantName.trim(),
        gender: formData.gender,
        appliedClass: formData.appliedClass,
        parentName: formData.parentName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        previousSchool: formData.previousSchool.trim(),
        bFormCnic: formData.bFormCnic.trim(),
        address: formData.address.trim(),
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        notes: `Hafiz: ${formData.isHafiz}. Notes: ${formData.notes || 'None'}`,
      });

      setSubmittedId(res.id);
      setFormData({
        applicantName: '',
        gender: 'male',
        appliedClass: 'Class 9 (Matriculation)',
        dateOfBirth: '2011-01-01',
        parentName: '',
        phone: '',
        email: '',
        previousSchool: '',
        bFormCnic: '',
        address: '',
        isHafiz: 'no',
        notes: '',
      });
    } catch (err: any) {
      console.error('Failed to submit admission:', err);
      setErrorMsg('Unable to submit your application to Firestore. Please try again or visit our campus.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="admissions" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Admissions Session 2026–2027
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Online Admission Application Form
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Submit your child&apos;s registration online. Our Admissions Committee will contact you to
            schedule the entrance evaluation and campus tour.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          {submittedId ? (
            <div className="text-center py-12 px-4 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Application Submitted Successfully!</h3>
              <p className="text-slate-600 mt-2 max-w-lg mx-auto text-sm">
                Alhamdulillah, your registration has been logged in our institution database. Our
                Admissions Officer will contact you within 24 to 48 hours.
              </p>

              <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200 max-w-md mx-auto">
                <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                  Your Application Reference ID:
                </p>
                <p className="text-xl font-mono font-extrabold text-emerald-950 mt-1 select-all">
                  {submittedId}
                </p>
              </div>

              <button
                onClick={() => setSubmittedId(null)}
                className="mt-8 px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Applicant Details */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>1. Applicant Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      placeholder="e.g. Muhammad Abdullah"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gender / Campus Wing *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    >
                      <option value="male">Male (Boys Wing &amp; Campus)</option>
                      <option value="female">Female (Girls Wing &amp; Campus)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applying for Class / Program *
                    </label>
                    <select
                      value={formData.appliedClass}
                      onChange={(e) => setFormData({ ...formData, appliedClass: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    >
                      {classOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Child B-Form / CNIC Number
                    </label>
                    <input
                      type="text"
                      value={formData.bFormCnic}
                      onChange={(e) => setFormData({ ...formData, bFormCnic: e.target.value })}
                      placeholder="e.g. 61101-1234567-1"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hafiz-e-Quran Status?
                    </label>
                    <select
                      value={formData.isHafiz}
                      onChange={(e) => setFormData({ ...formData, isHafiz: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes (Completed Hifz)</option>
                      <option value="in_progress">In Progress (Partially memorized)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Parent / Guardian Details */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>2. Parent / Guardian Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Father / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. Tariq Khan"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="parent@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Academic Background & Address */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                  <School className="w-4 h-4 text-emerald-700" />
                  <span>3. Previous Academic Records &amp; Residential Address</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Previous School / Madrasah Name
                    </label>
                    <input
                      type="text"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="e.g. Islamabad Model School"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Residential Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Sector / Town / City"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-slate-500">
                  By submitting, you agree to uphold the code of conduct and Islamic ethos of the school.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-700 to-slate-900 hover:from-emerald-800 hover:to-black shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Transmitting Application...' : 'Submit Admission Application'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
