/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/public/HeroSection';
import { AboutSection } from './components/public/AboutSection';
import { ProgramsSection } from './components/public/ProgramsSection';
import { WingsSection } from './components/public/WingsSection';
import { FacilitiesSection } from './components/public/FacilitiesSection';
import { FacultySection } from './components/public/FacultySection';
import { AdmissionsSection } from './components/public/AdmissionsSection';
import { NewsSection } from './components/public/NewsSection';
import { ContactSection } from './components/public/ContactSection';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

import { AddStudentModal } from './components/modals/AddStudentModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { AddAnnouncementModal } from './components/modals/AddAnnouncementModal';
import { ReportCardModal } from './components/modals/ReportCardModal';
import { FeeReceiptModal } from './components/modals/FeeReceiptModal';
import { SeedDataModal } from './components/modals/SeedDataModal';
import { LoginModal } from './components/modals/LoginModal';
import { AccessDenied } from './components/common/AccessDenied';
import { Lock } from 'lucide-react';
import { UserRole } from './types';

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
  SchoolSettings,
  WebsiteContent,
} from './types';

import {
  getStudents,
  getClasses,
  getSections,
  getTeachers,
  getAttendanceSessions,
  getExaminations,
  getExamMarks,
  getFeeStructures,
  getInvoices,
  getPayments,
  getAnnouncements,
  getAdmissions,
  getTimetables,
  getLibraryBooks,
  getSchoolSettings,
  getWebsiteContent,
  DEFAULT_STUDENTS,
  DEFAULT_CLASSES,
  DEFAULT_SECTIONS,
  DEFAULT_TEACHERS,
  DEFAULT_ATTENDANCE_SESSIONS,
  DEFAULT_EXAMS,
  DEFAULT_EXAM_MARKS,
  DEFAULT_FEE_STRUCTURES,
  DEFAULT_INVOICES,
  DEFAULT_PAYMENTS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_ADMISSIONS,
  DEFAULT_TIMETABLES,
  DEFAULT_BOOKS,
  DEFAULT_SCHOOL_SETTINGS,
  DEFAULT_WEBSITE_CONTENT,
} from './services/dataService';

function MainApp() {
  const { currentUser, userProfile, activeRole, setActiveRole } = useAuth();
  const [activeView, setActiveView] = useState<'public' | 'dashboard'>('public');
  const [publicSection, setPublicSection] = useState<string>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [unauthorizedRoute, setUnauthorizedRoute] = useState<{ requiredRole: string } | null>(null);

  // Hash route parsing
  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') || '';
      const parts = hash.split('/').filter(Boolean);

      if (parts.length === 0 || ['home', 'about', 'programs', 'wings', 'facilities', 'faculty', 'admissions', 'news', 'contact'].includes(parts[0])) {
        setActiveView('public');
        if (parts[0]) setPublicSection(parts[0]);
        setUnauthorizedRoute(null);
        return;
      }

      if (parts[0] === 'login') {
        setShowLoginModal(true);
        return;
      }

      const roleMap: Record<string, UserRole> = {
        owner: 'ceo',
        ceo: 'ceo',
        principal: 'principal',
        teacher: 'teacher',
        student: 'student',
        parent: 'parent',
        accountant: 'accountant',
        admissions: 'admissions_officer',
        librarian: 'librarian',
        staff: 'staff',
      };

      const requestedRole = roleMap[parts[0]];
      if (requestedRole) {
        const isOwner = currentUser?.email === 'zohaibalioffical12@gmail.com' || userProfile?.role === 'ceo';
        const userAssignedRole = userProfile?.role;

        // If non-owner user tries to access a different role portal, guard it
        if (!isOwner && userProfile && userAssignedRole && userAssignedRole !== requestedRole) {
          setUnauthorizedRoute({ requiredRole: requestedRole });
          setActiveView('dashboard');
          return;
        }

        setUnauthorizedRoute(null);
        setActiveRole(requestedRole);
        setActiveView('dashboard');
      }
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, [currentUser, userProfile]);

  // Master Data State
  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS);
  const [classes, setClasses] = useState<SchoolClass[]>(DEFAULT_CLASSES);
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [teachers, setTeachers] = useState<Teacher[]>(DEFAULT_TEACHERS);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(DEFAULT_ATTENDANCE_SESSIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(DEFAULT_INVOICES);
  const [payments, setPayments] = useState<Payment[]>(DEFAULT_PAYMENTS);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(DEFAULT_FEE_STRUCTURES);
  const [examinations, setExaminations] = useState<Examination[]>(DEFAULT_EXAMS);
  const [examMarks, setExamMarks] = useState<ExamMark[]>(DEFAULT_EXAM_MARKS);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(DEFAULT_ADMISSIONS);
  const [timetables, setTimetables] = useState<Timetable[]>(DEFAULT_TIMETABLES);
  const [books, setBooks] = useState<LibraryBook[]>(DEFAULT_BOOKS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(DEFAULT_SCHOOL_SETTINGS);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(DEFAULT_WEBSITE_CONTENT);

  // Modals state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);

  const [reportCardTarget, setReportCardTarget] = useState<{
    student: Student;
    exam: Examination;
  } | null>(null);

  const [receiptTarget, setReceiptTarget] = useState<{
    invoice: Invoice;
    payment?: Payment;
  } | null>(null);

  // Load Firestore data
  const loadAllData = async () => {
    try {
      const [
        stdList,
        clsList,
        secList,
        tchList,
        attList,
        examList,
        markList,
        feeList,
        invList,
        payList,
        annList,
        admList,
        ttList,
        bookList,
        settingsData,
        contentData,
      ] = await Promise.all([
        getStudents(),
        getClasses(),
        getSections(),
        getTeachers(),
        getAttendanceSessions(),
        getExaminations(),
        getExamMarks(),
        getFeeStructures(),
        getInvoices(),
        getPayments(),
        getAnnouncements(),
        getAdmissions(),
        getTimetables(),
        getLibraryBooks(),
        getSchoolSettings(),
        getWebsiteContent(),
      ]);

      if (stdList.length > 0) setStudents(stdList);
      if (clsList.length > 0) setClasses(clsList);
      if (secList.length > 0) setSections(secList);
      if (tchList.length > 0) setTeachers(tchList);
      if (attList.length > 0) setAttendanceSessions(attList);
      if (examList.length > 0) setExaminations(examList);
      if (markList.length > 0) setExamMarks(markList);
      if (feeList.length > 0) setFeeStructures(feeList);
      if (invList.length > 0) setInvoices(invList);
      if (payList.length > 0) setPayments(payList);
      if (annList.length > 0) setAnnouncements(annList);
      if (admList.length > 0) setAdmissions(admList);
      if (ttList.length > 0) setTimetables(ttList);
      if (bookList.length > 0) setBooks(bookList);
      if (settingsData) setSchoolSettings(settingsData);
      if (contentData) setWebsiteContent(contentData);
    } catch (err) {
      console.warn('Using loaded institutional data state:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for additions
  const handleStudentAdded = (student: Student) => {
    setStudents((prev) => [student, ...prev]);
  };

  const handlePaymentSuccess = (payment: Payment) => {
    setPayments((prev) => [payment, ...prev]);
    // Update invoice state
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === payment.invoiceId
          ? { ...inv, paidAmount: payment.amount, balance: 0, status: 'paid' }
          : inv
      )
    );
    const targetInv = invoices.find((i) => i.id === payment.invoiceId);
    if (targetInv) {
      setReceiptTarget({ invoice: targetInv, payment });
    }
  };

  const handleAttendanceSubmitted = (session: AttendanceSession) => {
    setAttendanceSessions((prev) => [session, ...prev]);
  };

  const handleAnnouncementAdded = (ann: Announcement) => {
    setAnnouncements((prev) => [ann, ...prev]);
  };

  const handleScrollToAdmissions = () => {
    setActiveView('public');
    setPublicSection('admissions');
    const el = document.getElementById('admissions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Account Suspended Screen
  if (userProfile?.status === 'suspended') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-950 border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-950 text-red-300 border border-red-800">
            Account Status: Suspended
          </span>
          <h2 className="text-xl font-bold text-white mt-4">Institutional Access On Hold</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Your portal credentials have been placed on temporary suspension by Central Administration. Please contact the Secretariat office to resolve your status.
          </p>
          <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 text-left space-y-1.5">
            <p>Institutional Helpline: <strong className="text-emerald-400">+92 313 9375355</strong></p>
            <p>Official Desk: <strong className="text-emerald-400">themuslimschool&amp;collage12@gmail.com</strong></p>
            <p className="text-[11px] text-slate-500">Gujrat Ground, Near Sports Stadium, Mardan</p>
          </div>
          <button
            onClick={() => {
              setActiveView('public');
              window.location.hash = '#/';
            }}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
          >
            Return to Public School Website
          </button>
        </div>
      </div>
    );
  }

  // Access Denied Screen (Role route protection)
  if (unauthorizedRoute) {
    return (
      <AccessDenied
        requiredRole={unauthorizedRoute.requiredRole}
        actualRole={userProfile?.role || activeRole}
        onRedirectToAuthorized={() => {
          setUnauthorizedRoute(null);
          const authorizedRole = userProfile?.role || 'student';
          setActiveRole(authorizedRole);
          const routePrefix = authorizedRole === 'ceo' ? 'owner' : authorizedRole === 'admissions_officer' ? 'admissions' : authorizedRole;
          window.location.hash = `#/${routePrefix}/dashboard`;
        }}
        onBackToPublic={() => {
          setUnauthorizedRoute(null);
          setActiveView('public');
          window.location.hash = '#/';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-700 selection:text-white transition-colors duration-200">
      {activeView === 'public' ? (
        /* Public School Website */
        <div className="flex-1 flex flex-col">
          <Header settings={schoolSettings} />
          <Navbar
            activeView={activeView}
            setActiveView={setActiveView}
            publicSection={publicSection}
            setPublicSection={setPublicSection}
            onOpenAdmissionModal={handleScrollToAdmissions}
          />
          <main className="flex-1">
            <HeroSection
              content={websiteContent}
              settings={schoolSettings}
              onApplyClick={handleScrollToAdmissions}
              onExplorePortals={() => setShowLoginModal(true)}
              onLearnMore={() => {
                const el = document.getElementById('about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <AboutSection content={websiteContent} settings={schoolSettings} />
            <ProgramsSection onApplyClick={handleScrollToAdmissions} />
            <WingsSection />
            <FacilitiesSection />
            <FacultySection teachers={teachers} />
            <AdmissionsSection />
            <NewsSection announcements={announcements} />
            <ContactSection settings={schoolSettings} />
          </main>
          <Footer
            settings={schoolSettings}
            onNavClick={(sec) => {
              setPublicSection(sec);
              const el = document.getElementById(sec);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onPortalClick={() => setShowLoginModal(true)}
          />
        </div>
      ) : (
        /* School & College Management Dashboard */
        <DashboardLayout
          onBackToPublic={() => {
            setActiveView('public');
            window.location.hash = '#/';
          }}
          students={students}
          classes={classes}
          sections={sections}
          teachers={teachers}
          attendanceSessions={attendanceSessions}
          invoices={invoices}
          payments={payments}
          feeStructures={feeStructures}
          examinations={examinations}
          examMarks={examMarks}
          admissions={admissions}
          timetables={timetables}
          books={books}
          announcements={announcements}
          settings={schoolSettings}
          content={websiteContent}
          onSettingsUpdated={(newSettings) => setSchoolSettings(newSettings)}
          onContentUpdated={(newContent) => setWebsiteContent(newContent)}
          onOpenAddStudent={() => setShowAddStudent(true)}
          onOpenRecordPayment={() => setShowRecordPayment(true)}
          onOpenAddAnnouncement={() => setShowAddAnnouncement(true)}
          onOpenReportCard={(std, ex) => setReportCardTarget({ student: std, exam: ex })}
          onOpenReceipt={(inv) => setReceiptTarget({ invoice: inv })}
          onSeedData={() => setShowSeedModal(true)}
          onAttendanceSubmitted={handleAttendanceSubmitted}
          onMarksSaved={loadAllData}
          onApplicationUpdated={loadAllData}
          onStudentEnrolled={handleStudentAdded}
        />
      )}

      {/* Modals */}
      {showAddStudent && (
        <AddStudentModal
          classes={classes}
          sections={sections}
          onClose={() => setShowAddStudent(false)}
          onStudentAdded={handleStudentAdded}
        />
      )}

      {showRecordPayment && (
        <RecordPaymentModal
          invoices={invoices}
          onClose={() => setShowRecordPayment(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {showAddAnnouncement && (
        <AddAnnouncementModal
          onClose={() => setShowAddAnnouncement(false)}
          onAdded={handleAnnouncementAdded}
        />
      )}

      {showSeedModal && (
        <SeedDataModal
          onClose={() => setShowSeedModal(false)}
          onSeeded={loadAllData}
        />
      )}

      {reportCardTarget && (
        <ReportCardModal
          student={reportCardTarget.student}
          exam={reportCardTarget.exam}
          marks={examMarks}
          onClose={() => setReportCardTarget(null)}
        />
      )}

      {receiptTarget && (
        <FeeReceiptModal
          invoice={receiptTarget.invoice}
          payment={receiptTarget.payment}
          onClose={() => setReceiptTarget(null)}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          if (window.location.hash === '#/login') {
            window.location.hash = '#/';
          }
        }}
        onSuccess={(role) => {
          setActiveRole(role);
          setActiveView('dashboard');
          setShowLoginModal(false);
          const prefix = role === 'ceo' ? 'owner' : role === 'admissions_officer' ? 'admissions' : role;
          window.location.hash = `#/${prefix}/dashboard`;
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
