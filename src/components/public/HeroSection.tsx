import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';
import { WebsiteContent, SchoolSettings } from '../../types';

interface HeroSectionProps {
  onApplyClick: () => void;
  onExplorePortals: () => void;
  onLearnMore?: () => void;
  content?: WebsiteContent;
  settings?: SchoolSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onApplyClick,
  onExplorePortals,
  content,
  settings,
}) => {
  const headline = content?.heroHeadline || 'Nurturing Leaders with Islamic Values & Academic Distinction';
  const subtitle =
    content?.heroSubtitle ||
    'A premier institution providing rigorous contemporary sciences, FBISE curriculum, and integrated Quranic Tahfeez. Offering dedicated, segregated campuses for boys and girls from Playgroup through Class 12 in Mardan, Pakistan.';
  const badgeText =
    content?.heroBadgeText || 'Admissions Open for Academic Session 2026–2027 • Playgroup to Class 12';
  const ctaPrimary = content?.heroCtaPrimary || 'Apply for Admission Online';
  const ctaSecondary = content?.heroCtaSecondary || 'Access Role Portals (Live Demo)';

  const statLevels = content?.statLevels || '15 Academic Levels';
  const statStudents = content?.statStudents || '1,450+ Enrolled';
  const statPass = content?.statPassRatio || '100% Board Pass';
  const statFaculty = content?.statFaculty || '45+ Scholars & Teachers';

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Islamic Geometric Pattern Subtle Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #f59e0b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #10b981 2%, transparent 0%)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{badgeText}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {headline}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onApplyClick}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 shadow-lg shadow-emerald-900/50 hover:shadow-emerald-700/60 border border-amber-300 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExplorePortals}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-amber-400/50 backdrop-blur-xs transition-all cursor-pointer"
            >
              <span>{ctaSecondary}</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Features Ticker */}
          <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strictly Segregated Boys &amp; Girls Wings</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Tahfeez-ul-Quran &amp; Tajweed Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Playgroup to Class 12 (College)</span>
            </div>
          </div>
        </div>

        {/* Highlight Statistics Cards */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/20 text-center shadow-lg">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">{statLevels}</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Academic Levels</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Playgroup to Class 12</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/20 text-center shadow-lg">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">{statStudents}</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Enrolled Students</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Boys &amp; Girls Campuses</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/20 text-center shadow-lg">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">{statPass}</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Matric &amp; F.Sc Pass</p>
            <p className="text-[11px] text-slate-400 mt-0.5">A+ &amp; A Grade Ratio</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/20 text-center shadow-lg">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">{statFaculty}</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Faculty &amp; Scholars</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Ph.D, M.Phil &amp; Hufaaz</p>
          </div>
        </div>
      </div>
    </div>
  );
};
