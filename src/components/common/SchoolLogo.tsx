import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const SchoolLogo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-sm font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-extrabold',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className="flex items-center gap-3 group">
      {/* Islamic Arch & Official TMSC Crest Emblem */}
      <div
        className={`${iconSizes[size]} relative rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 flex items-center justify-center shadow-md border border-amber-400/50 dark:border-amber-400/80 dark:shadow-[0_0_14px_rgba(251,191,36,0.25)] shrink-0 text-amber-300 transition-all duration-300 group-hover:border-amber-400 overflow-hidden`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-4/5 h-4/5 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-105 text-amber-300 dark:text-amber-400"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="crestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="crestBookGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
          </defs>

          {/* Islamic Arch Outline */}
          <path
            d="M50 8 C30 20, 20 40, 20 88 L80 88 C80 40, 70 20, 50 8 Z"
            fill="none"
            stroke="url(#crestGoldGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Minaret Crescent / Star */}
          <circle cx="50" cy="22" r="6" fill="url(#crestGoldGrad)" />
          <path
            d="M50 14 A 8 8 0 0 1 50 30 A 6.5 6.5 0 0 0 50 14"
            fill="url(#crestGoldGrad)"
          />

          {/* Open Book / Quran of Knowledge */}
          <path
            d="M26 62 Q50 54 50 78 Q50 54 74 62 L74 52 Q50 44 50 68 Q50 44 26 52 Z"
            fill="url(#crestBookGrad)"
            stroke="#b45309"
            strokeWidth="1.5"
          />

          {/* Pen / Knowledge Nib */}
          <path d="M50 40 L54 48 L46 48 Z" fill="url(#crestGoldGrad)" />
          <line
            x1="50"
            y1="48"
            x2="50"
            y2="60"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`${titleSizes[size]} tracking-tight leading-none transition-colors duration-200 ${
              variant === 'light' ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            MUSLIM SCHOOL &amp; COLLEGE
          </span>
        </div>
        <div
          className={`${subtitleSizes[size]} font-medium tracking-wide uppercase flex items-center gap-1.5 transition-colors duration-200 ${
            variant === 'light'
              ? 'text-amber-300/90'
              : 'text-emerald-700 dark:text-emerald-400 font-semibold'
          }`}
        >
          <span>Boys &amp; Girls Campuses</span>
          <span className="text-amber-500">•</span>
          <span>Playgroup to Class 12</span>
        </div>
      </div>
    </div>
  );
};
