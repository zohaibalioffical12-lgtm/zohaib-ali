import React from 'react';
import { Shield, Sparkles, CheckCircle2, Building, Users } from 'lucide-react';

export const WingsSection: React.FC = () => {
  return (
    <section id="wings" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Modesty, Focus &amp; Excellence
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Separate Boys &amp; Girls Campuses
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            We preserve Islamic modesty and cultivate distraction-free academic focus through
            independent wings, separate academic buildings, dedicated faculty rosters, and separate
            recreational facilities.
          </p>
        </div>

        {/* Campuses Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Boys Wing */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                Boys Wing &amp; College
              </span>
              <span className="text-xs font-semibold text-slate-500">Classes 6 to 12</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
              Ibn Al-Haytham Boys Campus
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Empowering young Muslim men through rigorous STEM education, leadership training,
              athletic discipline, and brotherhood. Staffed by distinguished male professors,
              engineers, and Islamic scholars.
            </p>

            <div className="space-y-3 mb-6 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Dedicated Boys Science Labs (Physics, Chemistry &amp; High-End Robotics)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Full-sized sports arena: Cricket pitch, football turf &amp; martial arts</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Daily congregational prayers in Central Campus Mosque with Khutbah</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Boys Pre-Engineering, Pre-Medical, and ICS Computer Science sections</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 font-medium">
              Head of Boys Wing: <span className="font-bold">Ustadh Hafiz Usman Raza &amp; Dr. Tariq Mahmood</span>
            </div>
          </div>

          {/* Girls Wing */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                Girls Wing &amp; College
              </span>
              <span className="text-xs font-semibold text-slate-500">Classes 6 to 12</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
              Fatima Al-Fihri Girls Campus
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              A serene, dignified sanctuary designed strictly for young Muslim women. Fully gated,
              purdah-compliant perimeter with 100% female faculty, specialized medical laboratories,
              and speech auditoriums.
            </p>

            <div className="space-y-3 mb-6 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Secure, private entrance and enclosed courtyard for outdoor activities</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>100% qualified female faculty, professors, and subject specialists</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Pre-Medical specialization with MDCAT training and biology labs</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Islamic calligraphy, home sciences, literature society, and debating club</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 font-medium">
              Head of Girls Wing: <span className="font-bold">Mrs. Saima Noreen &amp; Dr. Ayesha Malik</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
