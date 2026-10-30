import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Microscope,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle,
  Clock,
  Award,
} from 'lucide-react';

export const ProgramsSection: React.FC<{ onApplyClick: () => void }> = ({ onApplyClick }) => {
  const [activeTab, setActiveTab] = useState<'early' | 'primary' | 'middle' | 'matric' | 'college' | 'hifz'>('matric');

  const programs = [
    {
      id: 'early',
      title: 'Early Childhood Education',
      grades: 'Playgroup, Nursery & KG',
      badge: 'Ages 3 – 5 Years',
      icon: Layers,
      description: 'Montessori-inspired, playful cognitive exploration combined with early Quranic Noorani Qaida phonetics, motor skill enrichment, and Arabic alphabet familiarization in a warm, nurturing ambiance.',
      highlights: [
        'Activity-based multisensory learning',
        'Phonics-based English & Urdu literacy',
        'Noorani Qaida & Basic Islamic Adab (manners)',
        'Sensory playrooms & child-safe indoor play area',
      ],
      timing: '08:00 AM – 12:30 PM',
      wingType: 'Combined wing with caring female Montessori educators',
    },
    {
      id: 'primary',
      title: 'Primary School Wing',
      grades: 'Class 1 through Class 5',
      badge: 'Classes 1 – 5',
      icon: BookOpen,
      description: 'Comprehensive academic foundation integrating Oxford curriculum, mathematics reasoning, science experiments, Nazra Quran with Tajweed, and daily conversational English and Arabic.',
      highlights: [
        'Cambridge English & progressive STEM coursework',
        'Daily Tajweed and memorization of daily Masnoon Duas',
        'Mental math, robotics clubs, and arts',
        'Regular parent-teacher feedback sessions',
      ],
      timing: '07:45 AM – 01:45 PM',
      wingType: 'Junior Wing with dedicated female faculty and separate classrooms',
    },
    {
      id: 'middle',
      title: 'Middle School Wing',
      grades: 'Class 6 through Class 8',
      badge: 'Classes 6 – 8',
      icon: GraduationCap,
      description: 'Transition into specialized subjects with distinct Boys and Girls wings. Focus on conceptual clarity in physical sciences, pre-algebra, general science labs, computer programming, and Islamic history.',
      highlights: [
        'Strictly segregated boys and girls campus wings',
        'Specialized laboratories for Physics, Chemistry & Biology',
        'Computer programming (Scratch & Python fundamentals)',
        'Tarjuma-tul-Quran curriculum according to national guidelines',
      ],
      timing: '07:45 AM – 02:00 PM',
      wingType: 'Strictly segregated Boys and Girls Wings',
    },
    {
      id: 'matric',
      title: 'Matriculation Wing (Secondary)',
      grades: 'Class 9 & Class 10',
      badge: 'FBISE & BISE Affiliated',
      icon: Microscope,
      description: 'Rigorous preparation for Federal & Provincial Board examinations. Students specialize in Science Group (Biology / Computer Science) with intensive coaching, model exams, and laboratory practical sessions.',
      highlights: [
        'Federal Board (FBISE) & Rawalpindi Board affiliation',
        'Physics, Chemistry, Biology & Computer Science laboratories',
        'Past paper workshops and daily assessment tests',
        '100% historical A+ & A board distinctions',
      ],
      timing: '07:45 AM – 02:15 PM',
      wingType: 'Independent Boys & Girls Campuses with specialized faculties',
    },
    {
      id: 'college',
      title: 'Intermediate & College Wing',
      grades: 'Class 11 & Class 12 (1st & 2nd Year)',
      badge: 'F.Sc / ICS College',
      icon: Cpu,
      description: 'Premier collegiate education preparing future doctors, software architects, and engineers. Specializations include F.Sc Pre-Engineering, F.Sc Pre-Medical, and ICS (Computer Science & Statistics/Math).',
      highlights: [
        'F.Sc Pre-Medical with MDCAT booster curriculum',
        'F.Sc Pre-Engineering with ECAT analytical training',
        'ICS Computer Science with Modern Web & Python Labs',
        'Distinguished professors, Ph.D. scholars & career counseling',
      ],
      timing: '07:45 AM – 02:15 PM (Extended Labs till 03:00 PM)',
      wingType: 'College Boys Wing & College Girls Wing with executive lecture halls',
    },
    {
      id: 'hifz',
      title: 'Integrated Tahfeez-ul-Quran',
      grades: 'Full Hifz with Academic Continuity',
      badge: 'Certified Hifz Department',
      icon: Sparkles,
      description: 'Unique program enabling bright students to complete memorization of the Holy Quran under certified Asateedha while continuing their core English, Urdu, and Mathematics studies.',
      highlights: [
        'Certified Wifaq-ul-Madaris Hufaaz and Qaris',
        'Tajweed rules (Hafs an Asim)',
        'Dual-track schedule ensuring zero academic gap',
        'Graduation ceremony and formal Sanad upon completion',
      ],
      timing: 'Morning session 06:30 AM – 01:30 PM',
      wingType: 'Dedicated Tahfeez halls for boys and girls',
    },
  ];

  const currentProgram = programs.find((p) => p.id === activeTab) || programs[3];

  return (
    <section id="programs" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            From Early Steps to College Degree
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Academic Programs &amp; Class Levels
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Complete educational pathway encompassing Playgroup through Class 12 Higher Secondary
            College, providing continuity, moral consistency, and scholastic mastery.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {programs.map((prog) => {
            const Icon = prog.icon;
            const isActive = activeTab === prog.id;
            return (
              <button
                key={prog.id}
                onClick={() => setActiveTab(prog.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-800/30 border border-emerald-800 scale-102'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{prog.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Card */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {currentProgram.badge}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {currentProgram.grades}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
                {currentProgram.title}
              </h3>

              <p className="text-slate-600 text-base leading-relaxed mb-6">
                {currentProgram.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentProgram.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-200 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span className="font-medium">Timings: {currentProgram.timing}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">Campus Structure: {currentProgram.wingType}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="w-full lg:w-72 bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-amber-400/30 shadow-lg text-center shrink-0">
              <h4 className="font-bold text-base text-white mb-2">Enroll Your Child</h4>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                Seats in {currentProgram.grades} are awarded on merit and entrance evaluation.
              </p>
              <button
                onClick={onApplyClick}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md transition-colors cursor-pointer"
              >
                Apply for {currentProgram.title}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
