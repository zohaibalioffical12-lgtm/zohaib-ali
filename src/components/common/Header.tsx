import React from 'react';
import { Phone, Mail, Clock, Sparkles, Sun, Moon } from 'lucide-react';
import { SchoolSettings } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  settings?: SchoolSettings;
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const { theme, toggleTheme } = useTheme();
  const contactNumber = settings?.contactNumber || '+92 313 9375355';
  const officialEmail = settings?.officialEmail || 'themuslimschool&collage12@gmail.com';

  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-200 text-xs border-b border-emerald-800/40 dark:border-emerald-950/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Arabic Bismillah & Islamic Motto */}
        <div className="flex items-center gap-3">
          <span className="font-serif text-amber-400 dark:text-amber-300 text-sm tracking-wide select-none drop-shadow-xs">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
          <span className="hidden sm:inline-block text-slate-600 dark:text-slate-700">|</span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300 dark:text-slate-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-300" />
            <span>&ldquo;Read! In the name of your Lord who created&rdquo; (Surah Al-Alaq)</span>
          </span>
        </div>

        {/* Right: Contact Hotline, Email, Visiting Timings & Dark Mode Theme Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-300 dark:text-slate-300">
          <a
            href={`tel:${contactNumber}`}
            className="flex items-center gap-1.5 hover:text-amber-400 dark:hover:text-amber-300 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admissions: {contactNumber}</span>
          </a>
          <span className="text-slate-700 dark:text-slate-800 hidden sm:inline">•</span>
          <a
            href={`mailto:${officialEmail}`}
            className="hidden sm:flex items-center gap-1.5 hover:text-amber-400 dark:hover:text-amber-300 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>{officialEmail}</span>
          </a>
          <span className="text-slate-700 dark:text-slate-800 hidden sm:inline">•</span>
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-300 dark:text-emerald-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mon - Sat: 7:45 AM - 2:15 PM</span>
          </div>

          <span className="text-slate-700 dark:text-slate-800 hidden sm:inline">•</span>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 dark:bg-slate-800/80 hover:bg-white/20 dark:hover:bg-slate-700 text-slate-200 dark:text-amber-300 border border-white/20 dark:border-amber-400/30 transition-all cursor-pointer shadow-xs hover:border-amber-400/60"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                <span className="text-amber-300">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-200">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
