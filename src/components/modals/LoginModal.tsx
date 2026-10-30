import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import {
  Lock,
  Mail,
  Shield,
  ArrowRight,
  Sparkles,
  X,
  AlertCircle,
  GraduationCap,
  Users,
  CheckCircle,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
  targetRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetRole,
}) => {
  const { signInWithGoogle, setActiveRole, currentUser, userProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const demoAccounts: {
    role: UserRole;
    name: string;
    email: string;
    title: string;
    badge: string;
    color: string;
  }[] = [
    {
      role: 'ceo',
      name: 'Zohaib Ali',
      email: 'zohaibalioffical12@gmail.com',
      title: 'Owner & Super Admin',
      badge: 'Full Institutional Control',
      color: 'bg-purple-900/60 border-purple-500/40 text-purple-200',
    },
    {
      role: 'principal',
      name: 'Prof. Dr. Muhammad Saleem',
      email: 'principal@muslimschool.edu.pk',
      title: 'Principal',
      badge: 'Academic & Faculty Lead',
      color: 'bg-blue-900/60 border-blue-500/40 text-blue-200',
    },
    {
      role: 'teacher',
      name: 'Dr. Tariq Mahmood',
      email: 'tariq.mahmood@muslimschool.edu.pk',
      title: 'Head of Physics & Senior Lecturer',
      badge: 'Classes 9, 10, 11, 12',
      color: 'bg-emerald-900/60 border-emerald-500/40 text-emerald-200',
    },
    {
      role: 'student',
      name: 'Muhammad Hamza Khan',
      email: 'hamza.khan@student.muslimschool.edu.pk',
      title: 'Class 10 (Matriculation)',
      badge: 'Roll No: 10-B-01',
      color: 'bg-amber-900/60 border-amber-500/40 text-amber-200',
    },
    {
      role: 'parent',
      name: 'Tariq Khan',
      email: 'tariq.khan@gmail.com',
      title: 'Guardian (2 Wards Enrolled)',
      badge: 'Hamza & Abdullah',
      color: 'bg-sky-900/60 border-sky-500/40 text-sky-200',
    },
    {
      role: 'accountant',
      name: 'Noman Bashir',
      email: 'accounts@muslimschool.edu.pk',
      title: 'Chief Accountant',
      badge: 'Fee Billing & Cashier',
      color: 'bg-teal-900/60 border-teal-500/40 text-teal-200',
    },
    {
      role: 'admissions_officer',
      name: 'Farhan Qureshi',
      email: 'admissions@muslimschool.edu.pk',
      title: 'Admissions Officer',
      badge: 'Candidate Pipeline',
      color: 'bg-rose-900/60 border-rose-500/40 text-rose-200',
    },
    {
      role: 'librarian',
      name: 'Hafiz Bilal Tariq',
      email: 'library@muslimschool.edu.pk',
      title: 'Head Librarian',
      badge: 'Book Circulation',
      color: 'bg-indigo-900/60 border-indigo-500/40 text-indigo-200',
    },
    {
      role: 'staff',
      name: 'Asadullah Shah',
      email: 'transport@muslimschool.edu.pk',
      title: 'Transport & Estate Officer',
      badge: 'Facilities & Logistics',
      color: 'bg-slate-800 border-slate-600 text-slate-200',
    },
  ];

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      const roleToUse = targetRole || userProfile?.role || 'ceo';
      setActiveRole(roleToUse);
      onSuccess(roleToUse);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError(err?.message || 'Authentication could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setActiveRole(role);
    onSuccess(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-800/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-slate-800">
          <SchoolLogo size="md" variant="light" />
          <div className="text-center sm:text-left">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
              Institutional Single Sign-On
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              TMSC Portal Authentication
            </h2>
            <p className="text-xs text-slate-300">
              Direct access to role-segregated dashboards for The Muslim School &amp; College, Mardan.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Real Firebase Google Sign-In */}
        <div className="mt-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Sign In with Verified Google Identity:
          </p>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'Authenticating...' : 'Sign in with Google Account'}</span>
          </button>
        </div>

        {/* Quick Institutional Role Access */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Explore Authorized Portals:
            </span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              One-Click Role Launch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                onClick={() => handleQuickDemoLogin(acc.role)}
                className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between ${acc.color}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white capitalize">{acc.role.replace('_', ' ')}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-black/40 text-amber-300">
                      /{acc.role}/dashboard
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-white/90 truncate">{acc.name}</p>
                  <p className="text-[10px] text-white/70 truncate">{acc.title}</p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/80 font-medium">
                  <span className="truncate">{acc.badge}</span>
                  <ArrowRight className="w-3 h-3 shrink-0 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Official Campus Portal • Mardan, Pakistan</span>
          <span className="text-emerald-400 font-medium">Role-Based Access Control Active</span>
        </div>
      </div>
    </div>
  );
};
