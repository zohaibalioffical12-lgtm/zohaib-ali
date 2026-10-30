import React from 'react';
import { SchoolLogo } from './SchoolLogo';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { SchoolSettings } from '../../types';

interface FooterProps {
  onNavClick?: (id: string) => void;
  onPortalClick?: () => void;
  settings?: SchoolSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onNavClick,
  onPortalClick,
  settings,
}) => {
  const address = settings?.address || 'Main Road, Gujrat Near Ground, Mardan, Pakistan';
  const phone = settings?.contactNumber || '+92 313 9375355';
  const email = settings?.officialEmail || 'themuslimschool&collage12@gmail.com';
  const institution = settings?.institutionName || 'The Muslim School & College';

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Banner */}
      <div className="border-b border-slate-900 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-serif text-lg tracking-wider">
              رَّبِّ زِدْنِي عِلْمًا
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 font-medium text-xs sm:text-sm">
              &ldquo;My Lord! Increase me in knowledge&rdquo; (Surah Taha 20:114)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onPortalClick && (
              <button
                onClick={onPortalClick}
                className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs border border-amber-400/30 transition-colors cursor-pointer"
              >
                Access School Portals
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <SchoolLogo size="md" variant="light" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mt-3">
              A distinguished Islamic educational complex combining Playgroup through Class 12,
              strict separation of Boys and Girls wings, contemporary science labs, and integrated
              Tahfeez-ul-Quran with authentic Tajweed in Mardan, Pakistan.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Boys &amp; Girls Campuses • Playgroup to Class 12</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Academic Wings
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavClick?.('programs')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Playgroup, Nursery &amp; KG
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick?.('programs')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Primary Wing (Classes 1–5)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick?.('programs')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Middle School (Classes 6–8)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick?.('programs')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Matriculation (Classes 9–10)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick?.('programs')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  College Wing (Classes 11–12)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick?.('programs')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Tahfeez-ul-Quran Department
                </button>
              </li>
            </ul>
          </div>

          {/* Role Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Role Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onPortalClick} className="hover:text-amber-300 transition-colors cursor-pointer">
                  CEO / Owner (Zohaib Ali)
                </button>
              </li>
              <li>
                <button onClick={onPortalClick} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Principal Portal
                </button>
              </li>
              <li>
                <button onClick={onPortalClick} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Teacher Attendance &amp; Marks
                </button>
              </li>
              <li>
                <button onClick={onPortalClick} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Student Report Card &amp; Timetable
                </button>
              </li>
              <li>
                <button onClick={onPortalClick} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Parent / Guardian Portal
                </button>
              </li>
              <li>
                <button onClick={onPortalClick} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Accountant Fee Counter
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Secretariat
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="break-all">{email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Corner Credits */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} {institution}, Mardan, Pakistan. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>Owner &amp; Super Admin: <strong className="text-slate-300">Zohaib Ali</strong></span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-amber-400/40 text-amber-300 font-bold text-xs tracking-wide shadow-xs">
              Rahmat Ali
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
