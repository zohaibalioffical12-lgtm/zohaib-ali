import React, { useState } from 'react';
import { seedInstitutionalData } from '../../services/dataService';
import { Database, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';

interface SeedDataModalProps {
  onClose: () => void;
  onSeeded: () => void;
}

export const SeedDataModal: React.FC<SeedDataModalProps> = ({ onClose, onSeeded }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [count, setCount] = useState(0);

  const handleSeed = async () => {
    setLoading(true);
    const res = await seedInstitutionalData();
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setCount(res.count);
      onSeeded();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Initialize Institutional Database
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-slate-700">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-bold text-base text-slate-900">Database Seeded Successfully!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Alhamdulillah, {count} institutional documents (15 classes, boys/girls sections, teachers,
                students, attendance sessions, invoices, and exam results) have been populated in Firestore.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                Close &amp; View Dashboards
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                This will write verified sample data to your live Firebase Cloud Firestore database:
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 font-medium text-slate-700">
                <p>• 15 Academic Classes (Playgroup through Class 12 College)</p>
                <p>• Dedicated Boys and Girls Wing Section Rosters</p>
                <p>• Faculty Profiles (Ph.D., M.Phil &amp; Islamic Hufaaz)</p>
                <p>• Students (SIS) with admission numbers &amp; fee records</p>
                <p>• Attendance sessions with present &amp; absent logs</p>
                <p>• Examination marks &amp; printable report cards</p>
                <p>• Fee structures, invoices &amp; verified payment vouchers</p>
                <p>• Class timetables &amp; official announcements</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSeed}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Populating Firestore...' : 'Seed Live Firestore'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
