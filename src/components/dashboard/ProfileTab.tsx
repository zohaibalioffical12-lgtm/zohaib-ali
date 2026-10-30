import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, SchoolSettings } from '../../types';
import { updateUserProfile } from '../../services/dataService';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Building,
  CheckCircle,
  Save,
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles,
  MapPin,
  AlertCircle,
} from 'lucide-react';

interface ProfileTabProps {
  settings?: SchoolSettings;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ settings }) => {
  const { currentUser, userProfile, activeRole } = useAuth();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || currentUser?.displayName || 'Faculty / Member');
  const [phone, setPhone] = useState(userProfile?.phone || '+92 313 9375355');
  const [address, setAddress] = useState('Gujrat Ground, Near Sports Stadium, Mardan, KP');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.id && !currentUser?.uid) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const id = userProfile?.id || currentUser?.uid || 'usr_current';
      await updateUserProfile(id, {
        displayName,
        phone,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-3xl flex items-center justify-center border-4 border-slate-900 shadow-xl shrink-0">
            {displayName[0] || 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                {activeRole.replace('_', ' ')} Portal
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Institutional Account</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {displayName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{currentUser?.email || userProfile?.email || 'authenticated@muslimschool.edu.pk'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>The Muslim School &amp; College, Mardan</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Role-Specific Institutional Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Access Clearance</p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {activeRole.replace('_', ' ')}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeRole === 'ceo'
              ? 'Complete institutional authority, master CMS & RBAC control.'
              : activeRole === 'teacher'
              ? 'Classroom management, daily roll call, homework, and subject marks.'
              : activeRole === 'student'
              ? 'Enrolled student with individual timetable, report cards, and fee status.'
              : activeRole === 'parent'
              ? 'Verified guardian access with multi-ward academic monitoring.'
              : activeRole === 'accountant'
              ? 'Fee billing, collection receipts, and financial reconciliation.'
              : activeRole === 'admissions_officer'
              ? 'Candidate scrutiny, entrance interview scheduling & SIS conversion.'
              : activeRole === 'librarian'
              ? 'Islamic catalog, book circulation, and lending records.'
              : 'Operational administrative modules assigned by Super Admin.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Academic Term</p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">2026–2027 Session</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Active semester cycle. Both Boys &amp; Girls Wings operating in standard morning shifts.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Campus Timings</p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">07:45 AM – 02:15 PM</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mardan Campus, Khyber Pakhtunkhwa. Main Gate access via biometric &amp; card scan.
          </p>
        </div>
      </div>

      {/* Role-Specific Detailed Attributes */}
      {activeRole === 'teacher' && userProfile?.assignedClasses && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Assigned Teaching Load &amp; Responsibilities</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Assigned Classes</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {userProfile.assignedClasses.join(', ')}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Assigned Subjects</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {userProfile.assignedSubjects?.join(', ') || 'Physics, Applied Mechanics'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Section Allocations</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {userProfile.assignedSections?.join(', ') || 'Section A (Boys), Pre-Eng'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional Profile Information
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keep your contact information up to date for emergency alerts and school communication.
            </p>
          </div>
          {saveSuccess && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Profile Updated Successfully</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Registered Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={currentUser?.email || userProfile?.email || 'user@muslimschool.edu.pk'}
                  disabled
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Email addresses are bound to your verified authentication credential.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Official Phone / WhatsApp Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Residential / Postal Address (Mardan)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
