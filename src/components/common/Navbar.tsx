import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  X,
  LogIn,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  ChevronDown,
  UserCheck,
  Building2,
  Users,
  Sun,
  Moon,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  activeView: 'public' | 'dashboard';
  setActiveView: (view: 'public' | 'dashboard') => void;
  publicSection: string;
  setPublicSection: (section: string) => void;
  onOpenAdmissionModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  publicSection,
  setPublicSection,
  onOpenAdmissionModal,
}) => {
  const { currentUser, userProfile, activeRole, setActiveRole, signInWithGoogle, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'programs', label: 'Academic Programs' },
    { id: 'wings', label: 'Boys & Girls Wings' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'admissions', label: 'Admissions 2026' },
    { id: 'news', label: 'Announcements' },
    { id: 'contact', label: 'Contact' },
  ];

  const roleOptions: { role: UserRole; label: string; desc: string; badgeColor: string }[] = [
    { role: 'ceo', label: 'Owner / Super Admin', desc: 'Full institutional control & financial analytics', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
    { role: 'principal', label: 'Principal', desc: 'Academic oversight, timetables & approvals', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
    { role: 'teacher', label: 'Teacher', desc: 'Mark attendance, enter exam marks & homework', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { role: 'student', label: 'Student', desc: 'Report cards, attendance meter & timetable', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
    { role: 'parent', label: 'Parent / Guardian', desc: 'Linked children progress & fee vouchers', badgeColor: 'bg-sky-100 text-sky-800 border-sky-300' },
    { role: 'accountant', label: 'Accountant', desc: 'Fee structures, invoices & fee receipts', badgeColor: 'bg-teal-100 text-teal-800 border-teal-300' },
    { role: 'admissions_officer', label: 'Admissions Officer', desc: 'Online applications & enrollment pipeline', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300' },
    { role: 'librarian', label: 'Librarian', desc: 'Islamic library catalog & book checkout', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    { role: 'staff', label: 'Other Staff', desc: 'Campus facilities, timetables & logistics', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveView('public');
    setPublicSection(sectionId);
    setMobileMenuOpen(false);
    window.location.hash = `#/${sectionId}`;

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    setActiveView('dashboard');
    setPortalDropdownOpen(false);
    setMobileMenuOpen(false);
    const routePrefix = role === 'ceo' ? 'owner' : role === 'admissions_officer' ? 'admissions' : role;
    window.location.hash = `#/${routePrefix}/dashboard`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-hidden cursor-pointer"
          >
            <SchoolLogo size="md" variant={theme === 'dark' ? 'light' : 'dark'} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeView === 'public' && publicSection === link.id
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-xl text-slate-600 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Quick Online Admission CTA */}
            {onOpenAdmissionModal && (
              <button
                onClick={onOpenAdmissionModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Apply Online</span>
              </button>
            )}

            {/* Portal Switcher & Access Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-slate-900 hover:from-emerald-800 hover:to-black shadow-md border border-amber-400/30 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-300" />
                <span className="capitalize">
                  {activeView === 'dashboard' ? `${activeRole} Portal` : 'Portals & Login'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              </button>

              {portalDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center justify-between">
                      <span>Role-Based Dashboards</span>
                      <span className="text-[10px] font-normal text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Live System
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Select any authorized institutional role to explore:
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.role}
                        onClick={() => handleSelectRole(opt.role)}
                        className={`w-full px-4 py-2.5 text-left flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                          activeRole === opt.role && activeView === 'dashboard'
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-700 dark:border-emerald-500'
                            : ''
                        }`}
                      >
                        <div className="mt-0.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${opt.badgeColor}`}>
                            {opt.role.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{opt.label}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Auth Footer */}
                  <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                    {currentUser ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {currentUser.displayName?.[0] || 'U'}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {currentUser.displayName || currentUser.email}
                            </p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Connected to Firebase</p>
                          </div>
                        </div>
                        <button
                          onClick={() => signOut()}
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={signInWithGoogle}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors"
                      >
                        <LogIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Sign in with Google</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <div className="py-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">School Navigation</p>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeView === 'public' && publicSection === link.id
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Management Portals</p>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((opt) => (
                <button
                  key={opt.role}
                  onClick={() => handleSelectRole(opt.role)}
                  className="px-2.5 py-2 rounded-lg text-left text-xs font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 transition-colors"
                >
                  <p className="text-slate-800 dark:text-slate-200">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
