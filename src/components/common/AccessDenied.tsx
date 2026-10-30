import React from 'react';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { UserRole } from '../../types';

interface AccessDeniedProps {
  requiredRole: string;
  actualRole: UserRole;
  onRedirectToAuthorized: () => void;
  onBackToPublic: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredRole,
  actualRole,
  onRedirectToAuthorized,
  onBackToPublic,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-950 border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-red-950/40 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>

        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-950/80 text-red-300 border border-red-800/50">
          HTTP 403 • Unauthorized Access Guard
        </span>

        <h1 className="text-2xl font-black text-white mt-4 tracking-tight">
          Access Restricted
        </h1>

        <p className="text-slate-300 text-sm mt-3 leading-relaxed">
          You are currently signed in as an institutional <strong className="text-amber-300 capitalize">{actualRole.replace('_', ' ')}</strong>. You do not have permission to view the <strong className="text-red-400 capitalize">{requiredRole.replace('_', ' ')} Portal</strong>.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Requested Portal Route:</span>
            <span className="font-mono text-red-300">/{requiredRole}/dashboard</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Your Authorized Role:</span>
            <span className="font-semibold text-emerald-400 capitalize">{actualRole.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Institutional Policy:</span>
            <span className="text-slate-300">Role-Specific Segregation</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={onRedirectToAuthorized}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-emerald-200" />
            <span>Go to My Authorized ({actualRole.replace('_', ' ')}) Portal</span>
          </button>

          <button
            onClick={onBackToPublic}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
