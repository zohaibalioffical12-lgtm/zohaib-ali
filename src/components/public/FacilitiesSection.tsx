import React from 'react';
import {
  Microscope,
  BookOpen,
  Wifi,
  Bus,
  Shield,
  Activity,
  Award,
  Sparkles,
} from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      icon: Microscope,
      title: 'State-of-the-Art Science Labs',
      description: 'Separate, fully equipped laboratories for Physics, Chemistry, and Biology compliant with FBISE standards and digital data logging sensors.',
      tag: 'Academic Infrastructure',
    },
    {
      icon: Wifi,
      title: 'Advanced Computer & AI Labs',
      description: 'Dual high-speed computer labs equipped with modern Core i7 workstations, optical fiber internet, and programming development tools.',
      tag: 'Technology',
    },
    {
      icon: BookOpen,
      title: 'Dar-ul-Hikmah Central Library',
      description: 'Comprehensive repository housing over 15,000 volumes across Quranic exegesis, Hadith collections, modern physics, literature, and digital journals.',
      tag: 'Research & Books',
    },
    {
      icon: Sparkles,
      title: 'Grand Campus Mosque',
      description: 'Central Masjid accommodating 1,200 worshipers with ablution facilities, hosting daily congregational Zuhr prayers and weekly moral halaqas.',
      tag: 'Spiritual Center',
    },
    {
      icon: Activity,
      title: 'Sports & Athletic Grounds',
      description: 'Dedicated sports turf for cricket, football, basketball, badminton, and track events with certified physical training coaches.',
      tag: 'Health & Fitness',
    },
    {
      icon: Bus,
      title: 'Safe Fleet Transportation',
      description: 'GPS-tracked, air-conditioned bus fleet covering all sectors of the city with dedicated female attendants for junior and girls wings.',
      tag: 'Safety & Mobility',
    },
  ];

  return (
    <section id="facilities" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            World-Class Campus Ecosystem
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Institutional Facilities &amp; Infrastructure
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Purpose-built modern campuses designed to foster academic immersion, spiritual reflection,
            and physical vitality in an atmosphere of safety and discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-2xl p-7 border border-slate-200/80 hover:border-emerald-500/40 hover:bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-amber-300 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {fac.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                  {fac.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {fac.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
