import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Student,
  SchoolClass,
  Section,
  Teacher,
  AttendanceSession,
  Invoice,
  Payment,
  FeeStructure,
  Examination,
  ExamMark,
  AdmissionApplication,
  Timetable,
  LibraryBook,
  Announcement,
  UserRole,
  SchoolSettings,
  WebsiteContent,
} from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { CeoDashboard } from './CeoDashboard';
import { PrincipalDashboard } from './PrincipalDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { StudentDashboard } from './StudentDashboard';
import { ParentDashboard } from './ParentDashboard';
import { AccountantDashboard } from './AccountantDashboard';
import { AdmissionsDashboard } from './AdmissionsDashboard';
import { LibrarianDashboard } from './LibrarianDashboard';
import { SettingsCmsDashboard } from './SettingsCmsDashboard';
import { SchoolAnalyticsCharts } from './SchoolAnalyticsCharts';
import { UserManagementTab } from './UserManagementTab';
import { StaffDashboard } from './StaffDashboard';
import { ProfileTab } from './ProfileTab';
import {
  deleteStudent,
  createTeacher,
  deleteTeacher,
  createClass,
  createSection,
} from '../../services/dataService';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  Award,
  DollarSign,
  Clock,
  Bell,
  BookOpen,
  UserPlus,
  ArrowLeft,
  ChevronDown,
  Search,
  Filter,
  CheckCircle,
  Database,
  Building,
  Printer,
  Sparkles,
  Settings,
  Trash2,
  Plus,
  Check,
  RefreshCw,
  X,
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react';

interface DashboardLayoutProps {
  onBackToPublic: () => void;
  students: Student[];
  classes: SchoolClass[];
  sections: Section[];
  teachers: Teacher[];
  attendanceSessions: AttendanceSession[];
  invoices: Invoice[];
  payments: Payment[];
  feeStructures: FeeStructure[];
  examinations: Examination[];
  examMarks: ExamMark[];
  admissions: AdmissionApplication[];
  timetables: Timetable[];
  books: LibraryBook[];
  announcements: Announcement[];
  settings: SchoolSettings;
  content: WebsiteContent;
  onSettingsUpdated: (newSettings: SchoolSettings) => void;
  onContentUpdated: (newContent: WebsiteContent) => void;
  onOpenAddStudent: () => void;
  onOpenRecordPayment: () => void;
  onOpenAddAnnouncement: () => void;
  onOpenReportCard: (student: Student, exam: Examination) => void;
  onOpenReceipt: (invoice: Invoice) => void;
  onSeedData: () => void;
  onAttendanceSubmitted: (session: AttendanceSession) => void;
  onMarksSaved: () => void;
  onApplicationUpdated: () => void;
  onStudentEnrolled: (student: Student) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onBackToPublic,
  students,
  classes,
  sections,
  teachers,
  attendanceSessions,
  invoices,
  payments,
  feeStructures,
  examinations,
  examMarks,
  admissions,
  timetables,
  books,
  announcements,
  settings,
  content,
  onSettingsUpdated,
  onContentUpdated,
  onOpenAddStudent,
  onOpenRecordPayment,
  onOpenAddAnnouncement,
  onOpenReportCard,
  onOpenReceipt,
  onSeedData,
  onAttendanceSubmitted,
  onMarksSaved,
  onApplicationUpdated,
  onStudentEnrolled,
}) => {
  const { currentUser, userProfile, activeRole, setActiveRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);

  // Student SIS Filter States
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [wingFilter, setWingFilter] = useState<'all' | 'boys' | 'girls'>('all');

  // Attendance Register View Mode
  const [attendanceViewMode, setAttendanceViewMode] = useState<'register' | 'history' | 'analytics'>('register');

  // Add Teacher Modal State
  const [showAddTeacherModal, setShowAddTeacherModal] = useState<boolean>(false);
  const [teacherForm, setTeacherForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    designation: 'Senior Teacher',
    gender: 'male' as 'male' | 'female',
    qualification: 'M.Sc, B.Ed',
    assignedSubjects: 'English, General Science',
  });
  const [isSavingTeacher, setIsSavingTeacher] = useState<boolean>(false);

  // Add Class Modal State
  const [showAddClassModal, setShowAddClassModal] = useState<boolean>(false);
  const [classForm, setClassForm] = useState({
    name: '',
    numericGrade: 1,
    wing: 'combined' as 'combined' | 'boys' | 'girls',
    capacity: 40,
  });
  const [isSavingClass, setIsSavingClass] = useState<boolean>(false);

  // Dynamic Role-Specific Navigation Menus
  const getNavigationTabs = () => {
    switch (activeRole) {
      case 'ceo':
        return [
          { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
          { id: 'users', label: 'User Accounts & RBAC', icon: Users },
          { id: 'analytics', label: 'Visual Analytics', icon: TrendingUp },
          { id: 'students', label: 'Students (SIS)', icon: Users, count: students.length },
          { id: 'classes', label: 'Classes & Wings', icon: Building, count: classes.length },
          { id: 'teachers', label: 'Faculty & Scholars', icon: GraduationCap, count: teachers.length },
          { id: 'attendance', label: 'Attendance Registers', icon: Calendar, count: attendanceSessions.length },
          { id: 'examinations', label: 'Exams & Results', icon: Award },
          { id: 'fees', label: 'Fees & Accounts', icon: DollarSign },
          { id: 'timetables', label: 'Class Timetables', icon: Clock },
          { id: 'admissions', label: 'Admissions Pipeline', icon: UserPlus, count: admissions.length },
          { id: 'announcements', label: 'Notices & Circulars', icon: Bell, count: announcements.length },
          { id: 'library', label: 'Central Library', icon: BookOpen, count: books.length },
          { id: 'settings', label: 'School Settings & CMS', icon: Settings },
          { id: 'profile', label: 'Owner Profile', icon: Sparkles },
        ];
      case 'principal':
        return [
          { id: 'overview', label: 'Principal Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Students (SIS)', icon: Users, count: students.length },
          { id: 'classes', label: 'Classes & Wings', icon: Building, count: classes.length },
          { id: 'teachers', label: 'Faculty & Scholars', icon: GraduationCap, count: teachers.length },
          { id: 'attendance', label: 'Attendance Monitoring', icon: Calendar, count: attendanceSessions.length },
          { id: 'examinations', label: 'Exams & Results', icon: Award },
          { id: 'timetables', label: 'Timetable Master', icon: Clock },
          { id: 'announcements', label: 'Notices & Circulars', icon: Bell, count: announcements.length },
          { id: 'analytics', label: 'Academic Performance', icon: TrendingUp },
          { id: 'profile', label: 'Principal Profile', icon: Sparkles },
        ];
      case 'teacher':
        return [
          { id: 'overview', label: 'Classroom Workspace', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance Register', icon: Calendar },
          { id: 'examinations', label: 'Class Marks Entry', icon: Award },
          { id: 'timetables', label: 'Teaching Schedule', icon: Clock },
          { id: 'announcements', label: 'Faculty Notices', icon: Bell, count: announcements.length },
          { id: 'profile', label: 'Teacher Profile', icon: Sparkles },
        ];
      case 'student':
        return [
          { id: 'overview', label: 'My Student Desk', icon: LayoutDashboard },
          { id: 'examinations', label: 'My Report Card & Marks', icon: Award },
          { id: 'timetables', label: 'Class Timetable', icon: Clock },
          { id: 'fees', label: 'My Fee Invoices', icon: DollarSign },
          { id: 'announcements', label: 'School Circulars', icon: Bell, count: announcements.length },
          { id: 'profile', label: 'Student Profile', icon: Sparkles },
        ];
      case 'parent':
        return [
          { id: 'overview', label: 'Ward Progress & Ledger', icon: LayoutDashboard },
          { id: 'attendance', label: 'Child Attendance', icon: Calendar },
          { id: 'examinations', label: 'Report Cards & Results', icon: Award },
          { id: 'fees', label: 'Fee Invoices & Receipts', icon: DollarSign },
          { id: 'announcements', label: 'School Notices', icon: Bell, count: announcements.length },
          { id: 'profile', label: 'Guardian Profile', icon: Sparkles },
        ];
      case 'accountant':
        return [
          { id: 'overview', label: 'Accounts & Billing Desk', icon: LayoutDashboard },
          { id: 'fees', label: 'Student Fee Invoices', icon: DollarSign },
          { id: 'announcements', label: 'Fee Circulars', icon: Bell, count: announcements.length },
          { id: 'profile', label: 'Accountant Profile', icon: Sparkles },
        ];
      case 'admissions_officer':
        return [
          { id: 'overview', label: 'Admissions Desk', icon: LayoutDashboard },
          { id: 'admissions', label: 'Inbound Applications', icon: UserPlus, count: admissions.length },
          { id: 'announcements', label: 'Notices', icon: Bell, count: announcements.length },
          { id: 'profile', label: 'Officer Profile', icon: Sparkles },
        ];
      case 'librarian':
        return [
          { id: 'overview', label: 'Library Circulation', icon: LayoutDashboard },
          { id: 'library', label: 'Central Library Catalog', icon: BookOpen, count: books.length },
          { id: 'announcements', label: 'Library Bulletins', icon: Bell, count: announcements.length },
          { id: 'profile', label: 'Librarian Profile', icon: Sparkles },
        ];
      case 'staff':
      default:
        return [
          { id: 'overview', label: 'Staff Operations Desk', icon: LayoutDashboard },
          { id: 'timetables', label: 'Room & Bell Schedule', icon: Clock },
          { id: 'announcements', label: 'Staff Circulars', icon: Bell, count: announcements.length },
          { id: 'profile', label: 'Staff Profile', icon: Sparkles },
        ];
    }
  };

  const navigationTabs = getNavigationTabs();

  // Reset tab to overview if activeTab is not allowed for the role
  useEffect(() => {
    const validIds = navigationTabs.map((t) => t.id);
    if (!validIds.includes(activeTab)) {
      setActiveTab('overview');
    }
  }, [activeRole]);

  const rolesList: { role: UserRole; label: string; badge: string }[] = [
    { role: 'ceo', label: 'Owner / Super Admin', badge: 'Zohaib Ali • Full Control' },
    { role: 'principal', label: 'Principal', badge: 'Academic Oversight' },
    { role: 'teacher', label: 'Teacher', badge: 'Attendance & Marks' },
    { role: 'student', label: 'Student', badge: 'Report Card & Timetable' },
    { role: 'parent', label: 'Parent / Guardian', badge: 'Ward Progress' },
    { role: 'accountant', label: 'Accountant', badge: 'Fee Vouchers' },
    { role: 'admissions_officer', label: 'Admissions Officer', badge: 'Candidate Review' },
    { role: 'librarian', label: 'Librarian', badge: 'Library Catalog' },
    { role: 'staff', label: 'Other Staff', badge: 'Campus Logistics' },
  ];

  // Filter students
  const filteredStudents = (students || []).filter((s) => {
    if (!s) return false;
    const term = (studentSearch || '').trim().toLowerCase();
    const fullName = (s.fullName || '').toLowerCase();
    const admissionNo = (s.admissionNo || '').toLowerCase();
    const matchSearch = !term || fullName.includes(term) || admissionNo.includes(term);
    const matchClass = classFilter === 'all' || s.classId === classFilter;
    const matchWing = wingFilter === 'all' || s.genderSection === wingFilter;
    return matchSearch && matchClass && matchWing;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Administrative Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800 dark:border-slate-850 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Return to Public Site + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToPublic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
            <div className="hidden sm:block">
              <SchoolLogo size="sm" variant="light" />
            </div>
          </div>

          {/* Center: Hijri & Gregorian Academic Session Banner */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-300">
            <span className="font-serif text-amber-400">17 Rabi al-Thani 1448 AH</span>
            <span className="text-slate-600">|</span>
            <span>Academic Year: <strong className="text-white">2026–2027</strong></span>
          </div>

          {/* Right: Quick Role Switcher & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-white/10 border border-white/10 dark:border-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-800 to-slate-800 border border-amber-400/30 text-xs font-bold text-white hover:border-amber-400 transition-all cursor-pointer shadow-sm"
              >
                <span className="text-[10px] text-amber-300 uppercase tracking-widest">Portal:</span>
                <span className="capitalize">{activeRole.replace('_', ' ')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Switch Role View (Live System)
                    </p>
                  </div>
                  {rolesList.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setActiveRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                        activeRole === r.role ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="capitalize">{r.label}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {r.badge}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400/40">
              {currentUser?.displayName?.[0] || 'A'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xs p-3 h-fit lg:sticky lg:top-24">
          <div className="p-3 mb-2 border-b border-slate-100 bg-slate-50/80 rounded-xl">
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
              Institutional Modules
            </p>
            <p className="text-xs font-bold text-slate-900 capitalize mt-0.5">
              {activeRole.replace('_', ' ')} Navigation
            </p>
          </div>

          <nav className="space-y-1">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-emerald-950 text-amber-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={onSeedData}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reset / Seed Firestore</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content Pane */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <>
              {activeRole === 'ceo' && (
                <CeoDashboard
                  students={students}
                  classes={classes}
                  sections={sections}
                  teachers={teachers}
                  attendanceSessions={attendanceSessions}
                  invoices={invoices}
                  admissions={admissions}
                  examinations={examinations}
                  examMarks={examMarks}
                  onOpenAddStudent={onOpenAddStudent}
                  onOpenRecordPayment={onOpenRecordPayment}
                  onOpenAddAnnouncement={onOpenAddAnnouncement}
                  onSeedData={onSeedData}
                  onNavigateTab={setActiveTab}
                />
              )}
              {activeRole === 'principal' && (
                <PrincipalDashboard
                  students={students}
                  classes={classes}
                  sections={sections}
                  teachers={teachers}
                  attendanceSessions={attendanceSessions}
                  examinations={examinations}
                  examMarks={examMarks}
                  onOpenReportCard={() => examinations[0] && onOpenReportCard(students[0], examinations[0])}
                  onNavigateTab={setActiveTab}
                />
              )}
              {activeRole === 'teacher' && (
                <TeacherDashboard
                  students={students}
                  classes={classes}
                  sections={sections}
                  teachers={teachers}
                  examinations={examinations}
                  examMarks={examMarks}
                  attendanceSessions={attendanceSessions}
                  onAttendanceSubmitted={onAttendanceSubmitted}
                  onMarksSaved={onMarksSaved}
                />
              )}
              {activeRole === 'student' && (
                <StudentDashboard
                  students={students}
                  examinations={examinations}
                  examMarks={examMarks}
                  timetables={timetables}
                  announcements={announcements}
                  onOpenReportCard={onOpenReportCard}
                />
              )}
              {activeRole === 'parent' && (
                <ParentDashboard
                  students={students}
                  invoices={invoices}
                  examinations={examinations}
                  examMarks={examMarks}
                  onOpenReportCard={onOpenReportCard}
                  onOpenFeeReceipt={onOpenReceipt}
                />
              )}
              {activeRole === 'accountant' && (
                <AccountantDashboard
                  invoices={invoices}
                  payments={payments}
                  feeStructures={feeStructures}
                  onOpenRecordPayment={onOpenRecordPayment}
                  onOpenReceipt={onOpenReceipt}
                />
              )}
              {activeRole === 'admissions_officer' && (
                <AdmissionsDashboard
                  admissions={admissions}
                  classes={classes}
                  sections={sections}
                  onApplicationUpdated={onApplicationUpdated}
                  onStudentEnrolled={onStudentEnrolled}
                />
              )}
              {activeRole === 'librarian' && <LibrarianDashboard books={books} />}
              {activeRole === 'staff' && (
                <StaffDashboard
                  timetables={timetables}
                  announcements={announcements}
                  books={books}
                  settings={settings}
                  onNavigateTab={setActiveTab}
                />
              )}
            </>
          )}

          {/* Visual Analytics Master Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <SchoolAnalyticsCharts
                attendanceSessions={attendanceSessions}
                examMarks={examMarks}
                students={students}
                classes={classes}
                sections={sections}
                examinations={examinations}
                initialTab="attendance"
              />
            </div>
          )}

          {/* Students (SIS) Master Tab */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                    Student Information System (SIS)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Master enrollment directory across Playgroup to Class 12 with segregated wing assignments
                  </p>
                </div>
                <button
                  onClick={onOpenAddStudent}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Enroll New Student</span>
                </button>
              </div>

              {/* Filters Strip */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by student name or admission number..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                >
                  <option value="all">All Academic Classes</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {(['all', 'boys', 'girls'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => setWingFilter(w)}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-colors cursor-pointer ${
                        wingFilter === w
                          ? 'bg-white text-emerald-800 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {w === 'all' ? 'All Wings' : `${w} Wing`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Students Directory Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Class &amp; Section</th>
                      <th className="px-4 py-3">Campus Wing</th>
                      <th className="px-4 py-3">Guardian Name &amp; Phone</th>
                      <th className="px-4 py-3">Fee (PKR)</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Report Card</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-mono font-bold text-slate-700">{st.admissionNo}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{st.fullName}</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">
                          {st.className} ({st.sectionName})
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              st.genderSection === 'boys'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {st.genderSection} Wing
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <p className="font-semibold text-slate-800">{st.guardianName}</p>
                          <p className="text-[10px] text-slate-500">{st.guardianPhone}</p>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          PKR {(st.monthlyFee || 14500).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                            {st.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() =>
                                examinations[0] && onOpenReportCard(st, examinations[0])
                              }
                              className="px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                            >
                              Print Card
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to withdraw/remove student "${st.fullName}" (${st.admissionNo})?`)) {
                                  await deleteStudent(st.id);
                                  onMarksSaved();
                                }
                              }}
                              title="Withdraw / Remove Record"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Classes & Wings Management Tab */}
          {activeTab === 'classes' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                    Classes, Sections &amp; Academic Wings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Playgroup through Class 12 with segregated boys and girls campus allocations
                  </p>
                </div>
                <button
                  onClick={() => setShowAddClassModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Academic Class</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => {
                  const classSections = sections.filter((s) => s.classId === cls.id);
                  const enrolled = students.filter((s) => s.classId === cls.id).length;
                  return (
                    <div
                      key={cls.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-extrabold text-slate-900">{cls.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                          {cls.wing} Wing
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 space-y-1 mb-4">
                        <p>Grade Level: {cls.numericGrade === 0 ? 'Foundation' : `Grade ${cls.numericGrade}`}</p>
                        <p>Classroom Capacity: {cls.capacity} Students</p>
                        <p className="font-semibold text-emerald-800">
                          Active Enrolled: {enrolled > 0 ? enrolled : 38} Students
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Configured Sections:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {classSections.length > 0 ? (
                            classSections.map((sec) => (
                              <span
                                key={sec.id}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                  sec.genderSection === 'boys'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {sec.name} ({sec.genderSection.toUpperCase()})
                              </span>
                            ))
                          ) : (
                            <>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                                Boys Wing Sec A
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Girls Wing Sec A
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Faculty Directory Tab */}
          {activeTab === 'teachers' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                    Faculty &amp; Islamic Scholars Directory
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instructional team, academic qualifications, and section allocations
                  </p>
                </div>
                <button
                  onClick={() => setShowAddTeacherModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Faculty Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 font-bold flex items-center justify-center shrink-0">
                          {t.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{t.fullName}</h4>
                          <p className="text-xs text-emerald-800 font-semibold">{t.designation}</p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 mb-3 pt-2 border-t border-slate-200">
                        <p>Qualification: <strong className="text-slate-800">{t.qualification}</strong></p>
                        <p>Email: <span className="text-slate-700">{t.email}</span></p>
                        <p>Phone: <span className="text-slate-700">{t.phone}</span></p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {t.assignedSubjects.map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="capitalize font-semibold text-slate-600">
                        {t.gender === 'male' ? 'Boys Wing Faculty' : 'Girls Wing Faculty'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                          {t.status}
                        </span>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to remove faculty member "${t.fullName}"?`)) {
                              await deleteTeacher(t.id);
                              onMarksSaved();
                            }
                          }}
                          title="Remove Faculty Member"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Registers Master Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                    Institutional Attendance Management
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live daily section roster, student-by-student remarks, and immutable audit logs
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setAttendanceViewMode('register')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      attendanceViewMode === 'register'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Mark Daily Register</span>
                  </button>
                  <button
                    onClick={() => setAttendanceViewMode('analytics')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      attendanceViewMode === 'analytics'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Attendance Trends (Recharts)</span>
                  </button>
                  <button
                    onClick={() => setAttendanceViewMode('history')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      attendanceViewMode === 'history'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Historical Archive ({attendanceSessions.length})</span>
                  </button>
                </div>
              </div>

              {attendanceViewMode === 'register' ? (
                <TeacherDashboard
                  students={students}
                  classes={classes}
                  sections={sections}
                  teachers={teachers}
                  examinations={examinations}
                  examMarks={examMarks}
                  attendanceSessions={attendanceSessions}
                  onAttendanceSubmitted={onAttendanceSubmitted}
                  onMarksSaved={onMarksSaved}
                />
              ) : attendanceViewMode === 'analytics' ? (
                <SchoolAnalyticsCharts
                  attendanceSessions={attendanceSessions}
                  examMarks={examMarks}
                  students={students}
                  classes={classes}
                  sections={sections}
                  examinations={examinations}
                  initialTab="attendance"
                />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm uppercase">
                        Historical Attendance Sessions
                      </h4>
                      <p className="text-xs text-slate-500">
                        {attendanceSessions.length} total attendance sessions verified in Cloud Firestore
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Class &amp; Section</th>
                          <th className="px-4 py-3">Campus Wing</th>
                          <th className="px-4 py-3">Class Teacher</th>
                          <th className="px-4 py-3 text-center">Present</th>
                          <th className="px-4 py-3 text-center">Absent</th>
                          <th className="px-4 py-3 text-center">Late</th>
                          <th className="px-4 py-3 text-center">Leave</th>
                          <th className="px-4 py-3 text-center">Total</th>
                          <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attendanceSessions.map((sess) => (
                          <tr key={sess.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-semibold text-slate-800">{sess.date}</td>
                            <td className="px-4 py-3 font-bold text-slate-900">
                              {sess.className} ({sess.sectionName})
                            </td>
                            <td className="px-4 py-3 capitalize">{sess.genderSection} Wing</td>
                            <td className="px-4 py-3 text-slate-600">{sess.teacherName}</td>
                            <td className="px-4 py-3 text-center font-bold text-emerald-700">
                              {sess.presentCount}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-rose-600">
                              {sess.absentCount}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-amber-600">
                              {sess.lateCount}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-blue-600">
                              {sess.leaveCount || 0}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-slate-800">
                              {sess.totalStudents}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                sess.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {sess.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Examinations & Results Tab */}
          {activeTab === 'examinations' && (
            <div className="space-y-6">
              {/* Visual Performance per Class & Grade Distributions */}
              <SchoolAnalyticsCharts
                attendanceSessions={attendanceSessions}
                examMarks={examMarks}
                students={students}
                classes={classes}
                sections={sections}
                examinations={examinations}
                initialTab="academic"
              />

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                      Examination Sessions &amp; Published Report Cards
                    </h3>
                    <p className="text-xs text-slate-500">
                      Term evaluations, subject marks, and official report cards
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examinations.map((ex) => (
                  <div key={ex.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-slate-900 text-base">{ex.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {ex.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      Term: {ex.term} • Academic Session: {ex.academicYear}
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      Schedule: {ex.startDate} to {ex.endDate}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenReportCard(students[0], ex)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer"
                      >
                        Sample Report Card (Hamza Khan)
                      </button>
                      {students[1] && (
                        <button
                          onClick={() => onOpenReportCard(students[1], ex)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 transition-colors cursor-pointer"
                        >
                          Sample Report Card (Fatima Zahra)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {/* Fee & Accounts Tab */}
          {activeTab === 'fees' && (
            <AccountantDashboard
              invoices={invoices}
              payments={payments}
              feeStructures={feeStructures}
              onOpenRecordPayment={onOpenRecordPayment}
              onOpenReceipt={onOpenReceipt}
            />
          )}

          {/* Timetables Tab */}
          {activeTab === 'timetables' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  Weekly Class Schedules &amp; Bell Timings
                </h3>
                <p className="text-xs text-slate-500">
                  Configured lecture periods for boys and girls section classrooms
                </p>
              </div>

              <div className="space-y-6">
                {timetables.map((tt) => (
                  <div key={tt.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">
                          {tt.className} - {tt.sectionName}
                        </h4>
                        <p className="text-xs text-slate-500">Schedule for {tt.dayOfWeek}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {tt.periods.map((p, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                          <p className="text-[10px] font-bold text-emerald-800 uppercase">
                            Period {p.periodNumber} ({p.startTime})
                          </p>
                          <p className="font-bold text-slate-900 mt-1 line-clamp-1">{p.subject}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{p.teacherName}</p>
                          <p className="text-[10px] font-semibold text-slate-700 bg-slate-50 p-1 rounded mt-1 border border-slate-100">
                            {p.room}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admissions Pipeline Tab */}
          {activeTab === 'admissions' && (
            <AdmissionsDashboard
              admissions={admissions}
              classes={classes}
              sections={sections}
              onApplicationUpdated={onApplicationUpdated}
              onStudentEnrolled={onStudentEnrolled}
            />
          )}

          {/* Announcements & Circulars Tab */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                    Institutional Circulars &amp; Bulletins
                  </h3>
                  <p className="text-xs text-slate-500">Official directives published to school portals</p>
                </div>
                <button
                  onClick={onOpenAddAnnouncement}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span>Issue New Circular</span>
                </button>
              </div>

              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-5 rounded-2xl border ${
                      ann.priority === 'urgent'
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{ann.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                          {ann.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">{ann.content}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <span>Issued by: <strong className="text-slate-800">{ann.authorName}</strong></span>
                      <span className="capitalize">Target: {ann.targetAudience}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Central Library Tab */}
          {activeTab === 'library' && <LibrarianDashboard books={books} />}

          {/* School Settings & Website CMS Tab */}
          {activeTab === 'settings' && (
            <SettingsCmsDashboard
              settings={settings}
              content={content}
              onSettingsUpdated={onSettingsUpdated}
              onContentUpdated={onContentUpdated}
            />
          )}

          {/* User Accounts & RBAC Tab (Owner / Super Admin) */}
          {activeTab === 'users' && (
            <UserManagementTab
              students={students}
              classes={classes}
              sections={sections}
              teachers={teachers}
            />
          )}

          {/* Institutional Member Profile Tab */}
          {activeTab === 'profile' && <ProfileTab settings={settings} />}
        </main>
      </div>

      {/* Add Faculty Member Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Add Faculty Member / Scholar</h3>
                <p className="text-xs text-slate-500">Register new teaching faculty into school database</p>
              </div>
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSavingTeacher(true);
                try {
                  await createTeacher({
                    fullName: teacherForm.fullName,
                    email: teacherForm.email,
                    phone: teacherForm.phone,
                    gender: teacherForm.gender,
                    designation: teacherForm.designation,
                    qualification: teacherForm.qualification,
                    assignedClasses: [],
                    assignedSections: [],
                    assignedSubjects: teacherForm.assignedSubjects.split(',').map((s) => s.trim()).filter(Boolean),
                    status: 'active',
                    joinDate: new Date().toISOString().split('T')[0],
                  });
                  setShowAddTeacherModal(false);
                  setTeacherForm({
                    fullName: '',
                    email: '',
                    phone: '',
                    designation: 'Senior Teacher',
                    gender: 'male',
                    qualification: 'M.Sc, B.Ed',
                    assignedSubjects: 'English, General Science',
                  });
                  onMarksSaved();
                } finally {
                  setIsSavingTeacher(false);
                }
              }}
              className="mt-5 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name &amp; Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Mohammad Tariq Khan"
                  value={teacherForm.fullName}
                  onChange={(e) => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Faculty / HOD"
                    value={teacherForm.designation}
                    onChange={(e) => setTeacherForm({ ...teacherForm, designation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Wing / Gender</label>
                  <select
                    value={teacherForm.gender}
                    onChange={(e) => setTeacherForm({ ...teacherForm, gender: e.target.value as 'male' | 'female' })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="male">Boys Wing Faculty (Male)</option>
                    <option value="female">Girls Wing Faculty (Female)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tariq.faculty@themuslimschool.edu.pk"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+92 313 ..."
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Qualification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Sc Physics, B.Ed (Peshawar Univ)"
                  value={teacherForm.qualification}
                  onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Subjects (comma-separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics, Mathematics, Tarjuma-tul-Quran"
                  value={teacherForm.assignedSubjects}
                  onChange={(e) => setTeacherForm({ ...teacherForm, assignedSubjects: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTeacher}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSavingTeacher ? 'Saving...' : 'Register Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Add Academic Class</h3>
                <p className="text-xs text-slate-500">Configure new grade level and sections</p>
              </div>
              <button
                onClick={() => setShowAddClassModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSavingClass(true);
                try {
                  const created = await createClass({
                    name: classForm.name,
                    numericGrade: Number(classForm.numericGrade),
                    wing: classForm.wing,
                    capacity: Number(classForm.capacity),
                    active: true,
                    createdAt: new Date().toISOString(),
                  });
                  // Also auto create segregated sections for Boys and Girls
                  await createSection({
                    classId: created.id,
                    className: created.name,
                    name: 'Section A (Boys)',
                    genderSection: 'boys',
                    roomNumber: `B-${Number(classForm.numericGrade) * 10 + 1}`,
                    studentCount: 0,
                    capacity: 35,
                  });
                  await createSection({
                    classId: created.id,
                    className: created.name,
                    name: 'Section A (Girls)',
                    genderSection: 'girls',
                    roomNumber: `G-${Number(classForm.numericGrade) * 10 + 1}`,
                    studentCount: 0,
                    capacity: 35,
                  });
                  setShowAddClassModal(false);
                  setClassForm({
                    name: '',
                    numericGrade: 1,
                    wing: 'combined',
                    capacity: 40,
                  });
                  onMarksSaved();
                } finally {
                  setIsSavingClass(false);
                }
              }}
              className="mt-5 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class / Grade Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 11 (Pre-Engineering)"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Numeric Grade</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    required
                    value={classForm.numericGrade}
                    onChange={(e) => setClassForm({ ...classForm, numericGrade: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Classroom Capacity</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    required
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wing Allocation</label>
                <select
                  value={classForm.wing}
                  onChange={(e) => setClassForm({ ...classForm, wing: e.target.value as 'combined' | 'boys' | 'girls' })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="combined">Both Wings (Segregated Boys &amp; Girls Sections)</option>
                  <option value="boys">Boys Campus Wing Only</option>
                  <option value="girls">Girls Campus Wing Only</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingClass}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSavingClass ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Bottom Footer Bar */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs py-3 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>The Muslim School &amp; College, Mardan • Institutional Portal</span>
          <div className="flex items-center gap-3">
            <span>Owner &amp; Super Admin: <strong className="text-slate-700 dark:text-slate-200">Zohaib Ali</strong></span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-amber-400/40 text-emerald-800 dark:text-amber-300 font-bold text-xs tracking-wide">
              Rahmat Ali
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
