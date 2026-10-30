import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/firestoreError';
import {
  Student,
  SchoolClass,
  Section,
  Teacher,
  AttendanceSession,
  AttendanceRecord,
  Examination,
  ExamMark,
  StudentResult,
  FeeStructure,
  Invoice,
  Payment,
  Announcement,
  AdmissionApplication,
  Timetable,
  LibraryBook,
  AuditLog,
  SchoolSettings,
  WebsiteContent,
  UserProfile,
  Assignment,
  AssignmentSubmission,
} from '../types';

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  id: 'school_settings_main',
  institutionName: 'The Muslim School & College',
  ownerName: 'Zohaib Ali',
  ownerEmail: 'zohaibalioffical12@gmail.com',
  officialEmail: 'themuslimschool&collage12@gmail.com',
  contactNumber: '+92 313 9375355',
  address: 'Main Road, Gujrat Near Ground, Mardan, Pakistan',
  academicYear: '2026-2027',
  motto: 'Excellence in Faith, Knowledge & Character',
  themeColor: '#047857',
  gate1Notice: 'Male guardians and visitors must enter via Gate 1 (Boys Wing Secretariat).',
  gate2Notice: 'Female guardians and visitors enter via Gate 2 (Girls Wing Executive Reception).',
  visitorHours: 'Mon - Thu: 07:45 AM - 02:30 PM | Fri: 07:45 AM - 12:30 PM | Sat: 08:30 AM - 01:30 PM',
  attendanceStatuses: ['present', 'absent', 'late', 'leave'],
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  id: 'website_content_main',
  heroHeadline: 'Nurturing Leaders with Islamic Values & Academic Distinction',
  heroSubtitle:
    'A premier institution providing rigorous contemporary sciences, FBISE curriculum, and integrated Quranic Tahfeez. Offering dedicated, segregated campuses for boys and girls from Playgroup through Class 12 in Mardan, Pakistan.',
  heroBadgeText: 'Admissions Open for Academic Session 2026–2027 • Playgroup to Class 12',
  heroBannerUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
  heroCtaPrimary: 'Apply for Admission Online',
  heroCtaSecondary: 'Access Role Portals (Live Demo)',
  statLevels: '15 Academic Levels',
  statStudents: '1,450+ Enrolled',
  statPassRatio: '100% Board Pass',
  statFaculty: '45+ Scholars & Teachers',
  aboutUsTitle: 'About The Muslim School & College',
  aboutUsText:
    'The Muslim School & College was founded in Mardan to harmonize modern scientific inquiry with timeless prophetic character. Providing an intellectually challenging and morally protective environment for both young men and young women.',
  missionText:
    'To cultivate well-rounded, God-conscious Muslim citizens equipped with intellectual rigor, technological proficiency, and moral courage.',
  visionText:
    'To be the benchmark Islamic educational institution in Khyber Pakhtunkhwa and Pakistan, producing trailblazing scholars, physicians, and engineers.',
  ethosText:
    'Daily collective adhkar, Friday congregational prayers, and mandatory adab & akhlaq evaluation integrated into the academic transcript.',
  boysWingDesc: 'Dedicated campus with specialized physics, chemistry, and computer laboratories with male scholar mentors.',
  girlsWingDesc: 'Completely segregated campus with executive security, private auditorium, STEM facilities, and female faculty.',
  programsIntro: 'Academic streams spanning early foundation (Playgroup–KG), Primary (1–5), Middle (6–8), Matriculation (9–10), and Higher Secondary College (11–12 F.Sc & ICS).',
  facilitiesIntro: 'Purpose-built Islamic educational infrastructure designed for intellectual exploration and spiritual elevation.',
  principalMessage:
    'At The Muslim School & College, Mardan, we cultivate intellectual passion, modesty, and academic discipline. Our students excel in science, college pre-medical/pre-engineering, and Quranic recitation under qualified scholars.',
  principalName: 'Dr. Tariq Mahmood, Ph.D.',
  principalDesignation: 'Principal, The Muslim School & College, Mardan',
  principalPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  admissionsIntro: 'Begin your journey of academic distinction and righteous character at The Muslim School & College.',
  admissionsNotice: 'Merit-based scholarships available for Hufaaz-e-Quran and top academic achievers in Mardan.',
  announcementsTicker: 'Admissions Open for Session 2026-2027 • Separate Boys & Girls Campuses • Playgroup to Class 12 • Contact: +92 313 9375355',
  contactHeading: 'Contact Us & Campus Locations',
  contactSubheading: 'Have questions regarding admissions, curriculum, or visiting our campuses in Mardan? Get in touch with our administrative secretariat.',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  whatsappUrl: 'https://wa.me/923139375355',
  seoTitle: 'The Muslim School & College, Mardan | Admissions Open',
  seoDescription: 'Premier Islamic School and College in Mardan, Pakistan. Separate Boys and Girls Campuses, Playgroup to Class 12, Matric, F.Sc, and Tahfeez-ul-Quran.',
  admissionsOpen: true,
  status: 'published',
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default Academic Levels from Playgroup through Class 12
export const INITIAL_CLASSES: Omit<SchoolClass, 'id'>[] = [
  { name: 'Playgroup', numericGrade: 0, wing: 'combined', capacity: 30, active: true, createdAt: '2026-01-01' },
  { name: 'Nursery', numericGrade: 0, wing: 'combined', capacity: 35, active: true, createdAt: '2026-01-01' },
  { name: 'KG', numericGrade: 0, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { name: 'Class 1', numericGrade: 1, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { name: 'Class 2', numericGrade: 2, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { name: 'Class 3', numericGrade: 3, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { name: 'Class 4', numericGrade: 4, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { name: 'Class 5', numericGrade: 5, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { name: 'Class 6', numericGrade: 6, wing: 'boys', capacity: 40, active: true, createdAt: '2026-01-01' },
  { name: 'Class 7', numericGrade: 7, wing: 'boys', capacity: 40, active: true, createdAt: '2026-01-01' },
  { name: 'Class 8', numericGrade: 8, wing: 'boys', capacity: 40, active: true, createdAt: '2026-01-01' },
  { name: 'Class 9 (Matric)', numericGrade: 9, wing: 'boys', capacity: 45, active: true, createdAt: '2026-01-01' },
  { name: 'Class 10 (Matric)', numericGrade: 10, wing: 'boys', capacity: 45, active: true, createdAt: '2026-01-01' },
  { name: 'Class 11 (1st Year FSC/ICS)', numericGrade: 11, wing: 'boys', capacity: 50, active: true, createdAt: '2026-01-01' },
  { name: 'Class 12 (2nd Year FSC/ICS)', numericGrade: 12, wing: 'boys', capacity: 50, active: true, createdAt: '2026-01-01' },
];

// Helper to safely fetch docs or return fallback
export async function fetchCollection<T>(collectionName: string, fallback: T[]): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      return fallback;
    }
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch (err) {
    console.warn(`Could not read from Firestore ${collectionName}, using local fallback:`, err);
    return fallback;
  }
}

// ----------------- STUDENTS -----------------
export async function getStudents(): Promise<Student[]> {
  return fetchCollection<Student>('students', DEFAULT_STUDENTS);
}

export async function createStudent(student: Omit<Student, 'id'>): Promise<Student> {
  const newId = `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fullRecord: Student = { ...student, id: newId };
  try {
    await setDoc(doc(db, 'students', newId), fullRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `students/${newId}`);
  }
  return fullRecord;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<void> {
  try {
    await updateDoc(doc(db, 'students', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `students/${id}`);
  }
}

export async function deleteStudent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'students', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `students/${id}`);
  }
}

// ----------------- CLASSES & SECTIONS -----------------
export async function getClasses(): Promise<SchoolClass[]> {
  return fetchCollection<SchoolClass>('classes', DEFAULT_CLASSES);
}

export async function getSections(): Promise<Section[]> {
  return fetchCollection<Section>('sections', DEFAULT_SECTIONS);
}

export async function createClass(classData: Omit<SchoolClass, 'id'>): Promise<SchoolClass> {
  const newId = `cls_${Date.now()}`;
  const record: SchoolClass = { ...classData, id: newId };
  try {
    await setDoc(doc(db, 'classes', newId), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `classes/${newId}`);
  }
  return record;
}

export async function createSection(sectionData: Omit<Section, 'id'>): Promise<Section> {
  const newId = `sec_${Date.now()}`;
  const record: Section = { ...sectionData, id: newId };
  try {
    await setDoc(doc(db, 'sections', newId), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `sections/${newId}`);
  }
  return record;
}

export async function updateClass(id: string, updates: Partial<SchoolClass>): Promise<void> {
  try {
    await updateDoc(doc(db, 'classes', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `classes/${id}`);
  }
}

export async function deleteClass(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'classes', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `classes/${id}`);
  }
}

export async function updateSection(id: string, updates: Partial<Section>): Promise<void> {
  try {
    await updateDoc(doc(db, 'sections', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `sections/${id}`);
  }
}

export async function deleteSection(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'sections', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `sections/${id}`);
  }
}

// ----------------- TEACHERS -----------------
export async function getTeachers(): Promise<Teacher[]> {
  return fetchCollection<Teacher>('teachers', DEFAULT_TEACHERS);
}

export async function createTeacher(teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
  const newId = `tch_${Date.now()}`;
  const record: Teacher = { ...teacher, id: newId };
  try {
    await setDoc(doc(db, 'teachers', newId), record);
    await logAudit({
      action: 'TEACHER_CREATED',
      performedBy: 'Zohaib Ali (Super Admin)',
      targetResource: teacher.fullName,
      details: `Added new faculty member: ${teacher.fullName} (${teacher.designation})`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `teachers/${newId}`);
  }
  return record;
}

export async function updateTeacher(id: string, updates: Partial<Teacher>): Promise<void> {
  try {
    await updateDoc(doc(db, 'teachers', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `teachers/${id}`);
  }
}

export async function deleteTeacher(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'teachers', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `teachers/${id}`);
  }
}

// ----------------- ATTENDANCE -----------------
export async function getAttendanceSessions(): Promise<AttendanceSession[]> {
  return fetchCollection<AttendanceSession>('attendanceSessions', DEFAULT_ATTENDANCE_SESSIONS);
}

export async function submitAttendanceSession(
  session: Omit<AttendanceSession, 'id'>,
  records: Omit<AttendanceRecord, 'id' | 'sessionId'>[]
): Promise<AttendanceSession> {
  // Deterministic Session ID per class + section + date to prevent duplicates
  const safeDate = session.date.replace(/[^0-9]/g, '');
  const sessionId = `att_sess_${session.classId}_${session.sectionId}_${safeDate}`;
  const fullSession: AttendanceSession = { ...session, id: sessionId, timestamp: Date.now() };

  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'attendanceSessions', sessionId), fullSession, { merge: true });

    records.forEach((rec, idx) => {
      const recId = `att_rec_${sessionId}_${rec.studentId || idx}`;
      const fullRec: AttendanceRecord = { ...rec, id: recId, sessionId };
      batch.set(doc(db, 'attendanceRecords', recId), fullRec, { merge: true });
    });

    await batch.commit();

    await logAudit({
      action: 'ATTENDANCE_SUBMITTED',
      performedBy: session.teacherName || 'Teacher',
      targetResource: `${session.className} (${session.sectionName})`,
      details: `Attendance marked for ${session.date}: ${session.presentCount} Present, ${session.absentCount} Absent, ${session.lateCount} Late, ${session.leaveCount || 0} Leave.`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `attendanceSessions/${sessionId}`);
  }

  return fullSession;
}

// ----------------- EXAMINATIONS & MARKS -----------------
export async function getExaminations(): Promise<Examination[]> {
  return fetchCollection<Examination>('examinations', DEFAULT_EXAMS);
}

export async function getExamMarks(examId?: string): Promise<ExamMark[]> {
  return fetchCollection<ExamMark>('examinationMarks', DEFAULT_EXAM_MARKS);
}

export async function saveExamMarks(marks: Omit<ExamMark, 'id'>[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    marks.forEach((m) => {
      const markId = `mark_${m.examId}_${m.studentId}_${m.subjectId}`;
      batch.set(doc(db, 'examinationMarks', markId), { ...m, id: markId });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'examinationMarks');
  }
}

// ----------------- FEES & INVOICES -----------------
export async function getFeeStructures(): Promise<FeeStructure[]> {
  return fetchCollection<FeeStructure>('feeStructures', DEFAULT_FEE_STRUCTURES);
}

export async function getInvoices(): Promise<Invoice[]> {
  return fetchCollection<Invoice>('invoices', DEFAULT_INVOICES);
}

export async function getPayments(): Promise<Payment[]> {
  return fetchCollection<Payment>('payments', DEFAULT_PAYMENTS);
}

export async function recordPayment(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
  const payId = `pay_${Date.now()}`;
  const payment: Payment = { ...paymentData, id: payId };

  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'payments', payId), payment);

    // Update the corresponding invoice with merge to prevent failure on unseeded records
    const invRef = doc(db, 'invoices', payment.invoiceId);
    batch.set(
      invRef,
      {
        id: payment.invoiceId,
        paidAmount: payment.amount,
        balance: 0,
        status: 'paid',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    await batch.commit();
  } catch (error) {
    console.warn('Firestore payment record notice:', error);
    // If not signed in or local preview, allow operation to succeed in-memory
    if (auth.currentUser) {
      handleFirestoreError(error, OperationType.WRITE, `payments/${payId}`);
    }
  }

  return payment;
}

// ----------------- SCHOOL SETTINGS & WEBSITE CMS -----------------
export async function getSchoolSettings(): Promise<SchoolSettings> {
  try {
    const snap = await getDoc(doc(db, 'schoolSettings', 'main'));
    if (snap.exists()) {
      return snap.data() as SchoolSettings;
    }
  } catch (e) {
    console.warn('Using default school settings:', e);
  }
  return DEFAULT_SCHOOL_SETTINGS;
}

export async function updateSchoolSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings> {
  const merged = { ...DEFAULT_SCHOOL_SETTINGS, ...settings, updatedAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, 'schoolSettings', 'main'), merged, { merge: true });
  } catch (e) {
    console.warn('Could not save school settings to Firestore:', e);
  }
  return merged;
}

export async function getWebsiteContent(): Promise<WebsiteContent> {
  try {
    const snap = await getDoc(doc(db, 'websiteContent', 'main'));
    if (snap.exists()) {
      return snap.data() as WebsiteContent;
    }
  } catch (e) {
    console.warn('Using default website content:', e);
  }
  return DEFAULT_WEBSITE_CONTENT;
}

export async function updateWebsiteContent(content: Partial<WebsiteContent>): Promise<WebsiteContent> {
  const merged = { ...DEFAULT_WEBSITE_CONTENT, ...content, updatedAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, 'websiteContent', 'main'), merged, { merge: true });
  } catch (e) {
    console.warn('Could not save website content to Firestore:', e);
  }
  return merged;
}

// ----------------- ANNOUNCEMENTS -----------------
export async function getAnnouncements(): Promise<Announcement[]> {
  return fetchCollection<Announcement>('announcements', DEFAULT_ANNOUNCEMENTS);
}

export async function createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
  const newId = `ann_${Date.now()}`;
  const record: Announcement = { ...announcement, id: newId };
  try {
    await setDoc(doc(db, 'announcements', newId), record);
  } catch (error) {
    console.warn('Firestore announcement record notice:', error);
    if (auth.currentUser) {
      handleFirestoreError(error, OperationType.CREATE, `announcements/${newId}`);
    }
  }
  return record;
}

// ----------------- ADMISSIONS -----------------
export async function getAdmissions(): Promise<AdmissionApplication[]> {
  return fetchCollection<AdmissionApplication>('admissions', DEFAULT_ADMISSIONS);
}

export async function submitAdmissionApplication(app: Omit<AdmissionApplication, 'id'>): Promise<AdmissionApplication> {
  const newId = `adm_${Date.now()}`;
  const record: AdmissionApplication = { ...app, id: newId, status: 'pending' };
  try {
    await setDoc(doc(db, 'admissions', newId), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `admissions/${newId}`);
  }
  return record;
}

export async function updateAdmissionStatus(id: string, status: AdmissionApplication['status']): Promise<void> {
  try {
    await updateDoc(doc(db, 'admissions', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `admissions/${id}`);
  }
}

// ----------------- TIMETABLES -----------------
export async function getTimetables(): Promise<Timetable[]> {
  return fetchCollection<Timetable>('timetables', DEFAULT_TIMETABLES);
}

// ----------------- LIBRARY -----------------
export async function getLibraryBooks(): Promise<LibraryBook[]> {
  return fetchCollection<LibraryBook>('libraryBooks', DEFAULT_BOOKS);
}

export async function createLibraryBook(book: Omit<LibraryBook, 'id'>): Promise<LibraryBook> {
  const newId = `bk_${Date.now()}`;
  const record: LibraryBook = { ...book, id: newId };
  try {
    await setDoc(doc(db, 'libraryBooks', newId), record);
    await logAudit({
      action: 'BOOK_ADDED',
      performedBy: 'Librarian / Admin',
      targetResource: book.title,
      details: `Added new book: ${book.title} (${book.author}) - Copies: ${book.copiesTotal}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `libraryBooks/${newId}`);
  }
  return record;
}

export async function updateLibraryBook(id: string, updates: Partial<LibraryBook>): Promise<void> {
  try {
    await updateDoc(doc(db, 'libraryBooks', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `libraryBooks/${id}`);
  }
}

export async function deleteLibraryBook(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'libraryBooks', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `libraryBooks/${id}`);
  }
}

// ----------------- ANNOUNCEMENT DELETION -----------------
export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
  }
}

// ----------------- INVOICES & FEE STRUCTURES -----------------
export async function createInvoice(invData: Omit<Invoice, 'id'>): Promise<Invoice> {
  const newId = `inv_${Date.now()}`;
  const record: Invoice = { ...invData, id: newId };
  try {
    await setDoc(doc(db, 'invoices', newId), record);
    await logAudit({
      action: 'INVOICE_GENERATED',
      performedBy: 'Accountant / Admin',
      targetResource: record.invoiceNo,
      details: `Generated voucher for ${record.studentName} (${record.month} ${record.year}) - Amount: PKR ${record.netAmount}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `invoices/${newId}`);
  }
  return record;
}

export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<void> {
  try {
    await updateDoc(doc(db, 'invoices', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `invoices/${id}`);
  }
}

export async function createFeeStructure(feeData: Omit<FeeStructure, 'id'>): Promise<FeeStructure> {
  const newId = `fee_${Date.now()}`;
  const record: FeeStructure = { ...feeData, id: newId };
  try {
    await setDoc(doc(db, 'feeStructures', newId), record);
    await logAudit({
      action: 'FEE_STRUCTURE_UPDATED',
      performedBy: 'Zohaib Ali (Super Admin)',
      targetResource: record.title,
      details: `Updated fee schedule for ${record.className} - Total: PKR ${record.totalAmount}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `feeStructures/${newId}`);
  }
  return record;
}

// ----------------- AUDIT LOGS -----------------
export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    action: 'SYSTEM_BOOTSTRAP',
    performedBy: 'Zohaib Ali (Super Admin)',
    targetResource: 'The Muslim School & College, Mardan',
    details: 'Initial system deployment and academic levels configured for Session 2026-2027.',
    timestamp: '2026-10-28T08:00:00Z',
  },
  {
    id: 'log_02',
    action: 'ATTENDANCE_RECORDED',
    performedBy: 'Ustadh Hafiz Usman',
    targetResource: 'Class 10 - Section A (Boys)',
    details: 'Daily attendance marked: 40 Present, 1 Absent, 1 Late, 0 Leave on 2026-10-29.',
    timestamp: '2026-10-29T08:15:00Z',
  },
  {
    id: 'log_03',
    action: 'CMS_PUBLISHED',
    performedBy: 'Zohaib Ali (Super Admin)',
    targetResource: 'Public Website Portal',
    details: 'Updated admissions marquee ticker and official contact information.',
    timestamp: '2026-10-29T08:45:00Z',
  },
];

export async function logAudit(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
  const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const log: AuditLog = { ...logData, id: logId, timestamp: new Date().toISOString() };
  try {
    await setDoc(doc(db, 'auditLogs', logId), log);
  } catch (err) {
    console.warn('Could not persist audit log to Firestore:', err);
  }
  return log;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return fetchCollection<AuditLog>('auditLogs', DEFAULT_AUDIT_LOGS);
}

// ----------------- USER ACCOUNT MANAGEMENT (RBAC) -----------------
export async function getUserProfiles(): Promise<UserProfile[]> {
  return fetchCollection<UserProfile>('users', DEFAULT_USERS);
}

export async function createUserProfile(profileData: Omit<UserProfile, 'id'> & { id?: string }): Promise<UserProfile> {
  const newId = profileData.id || `usr_${Date.now()}`;
  const profile: UserProfile = {
    ...profileData,
    id: newId,
    status: profileData.status || 'active',
    createdAt: profileData.createdAt || new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, 'users', newId), profile, { merge: true });
    await logAudit({
      action: 'USER_CREATED',
      performedBy: auth.currentUser?.email || 'Owner (Zohaib Ali)',
      targetResource: profile.email,
      details: `Created user account for ${profile.displayName} with assigned role: ${profile.role} (${profile.status})`,
    });
  } catch (error) {
    console.warn('Firestore write warning:', error);
  }
  return profile;
}

export async function updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    await setDoc(doc(db, 'users', id), { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    await logAudit({
      action: 'USER_UPDATED',
      performedBy: auth.currentUser?.email || 'Owner (Zohaib Ali)',
      targetResource: id,
      details: `Updated account settings for user ID ${id}: ${Object.keys(updates).join(', ')}`,
    });
  } catch (error) {
    console.warn('Firestore update warning:', error);
  }
}

export async function deleteUserProfile(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', id));
    await logAudit({
      action: 'USER_DELETED',
      performedBy: auth.currentUser?.email || 'Owner (Zohaib Ali)',
      targetResource: id,
      details: `Deactivated and removed user account ${id}`,
    });
  } catch (error) {
    console.warn('Firestore delete warning:', error);
  }
}

// ----------------- ASSIGNMENTS & HOMEWORK -----------------
export async function getAssignments(): Promise<Assignment[]> {
  return fetchCollection<Assignment>('assignments', DEFAULT_ASSIGNMENTS);
}

export async function createAssignment(assignmentData: Omit<Assignment, 'id'>): Promise<Assignment> {
  const id = `asgn_${Date.now()}`;
  const record: Assignment = { ...assignmentData, id, createdAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, 'assignments', id), record);
    await logAudit({
      action: 'ASSIGNMENT_CREATED',
      performedBy: assignmentData.teacherName,
      targetResource: `${assignmentData.className} - ${assignmentData.subject}`,
      details: `Assigned homework: "${assignmentData.title}" due ${assignmentData.dueDate}`,
    });
  } catch (e) {
    console.warn('Firestore assignment notice:', e);
  }
  return record;
}

export async function getAssignmentSubmissions(assignmentId?: string): Promise<AssignmentSubmission[]> {
  const list = await fetchCollection<AssignmentSubmission>('assignmentSubmissions', DEFAULT_SUBMISSIONS);
  if (assignmentId) {
    return list.filter((s) => s.assignmentId === assignmentId);
  }
  return list;
}

export async function submitAssignment(submissionData: Omit<AssignmentSubmission, 'id'>): Promise<AssignmentSubmission> {
  const id = `sub_${Date.now()}`;
  const record: AssignmentSubmission = { ...submissionData, id, submittedAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, 'assignmentSubmissions', id), record);
    await logAudit({
      action: 'ASSIGNMENT_SUBMITTED',
      performedBy: submissionData.studentName,
      targetResource: submissionData.assignmentTitle,
      details: `Submitted coursework for ${submissionData.assignmentTitle}`,
    });
  } catch (e) {
    console.warn('Firestore assignment submission notice:', e);
  }
  return record;
}

// ----------------- SEED INITIAL INSTITUTIONAL DATA -----------------
export async function seedInstitutionalData(): Promise<{ success: boolean; count: number }> {
  try {
    const batch = writeBatch(db);
    let count = 0;

    // Seed Classes
    DEFAULT_CLASSES.forEach((c) => {
      batch.set(doc(db, 'classes', c.id), c);
      count++;
    });

    // Seed Sections
    DEFAULT_SECTIONS.forEach((s) => {
      batch.set(doc(db, 'sections', s.id), s);
      count++;
    });

    // Seed Teachers
    DEFAULT_TEACHERS.forEach((t) => {
      batch.set(doc(db, 'teachers', t.id), t);
      count++;
    });

    // Seed Students
    DEFAULT_STUDENTS.forEach((st) => {
      batch.set(doc(db, 'students', st.id), st);
      count++;
    });

    // Seed Fee Structures
    DEFAULT_FEE_STRUCTURES.forEach((f) => {
      batch.set(doc(db, 'feeStructures', f.id), f);
      count++;
    });

    // Seed Invoices
    DEFAULT_INVOICES.forEach((inv) => {
      batch.set(doc(db, 'invoices', inv.id), inv);
      count++;
    });

    // Seed Payments
    DEFAULT_PAYMENTS.forEach((p) => {
      batch.set(doc(db, 'payments', p.id), p);
      count++;
    });

    // Seed Announcements
    DEFAULT_ANNOUNCEMENTS.forEach((a) => {
      batch.set(doc(db, 'announcements', a.id), a);
      count++;
    });

    // Seed Exams
    DEFAULT_EXAMS.forEach((e) => {
      batch.set(doc(db, 'examinations', e.id), e);
      count++;
    });

    // Seed Timetables
    DEFAULT_TIMETABLES.forEach((tt) => {
      batch.set(doc(db, 'timetables', tt.id), tt);
      count++;
    });

    // Seed Users
    DEFAULT_USERS.forEach((u) => {
      batch.set(doc(db, 'users', u.id), u);
      count++;
    });

    // Seed Assignments
    DEFAULT_ASSIGNMENTS.forEach((asg) => {
      batch.set(doc(db, 'assignments', asg.id), asg);
      count++;
    });

    await batch.commit();
    return { success: true, count };
  } catch (error) {
    console.error('Failed to seed institutional data:', error);
    return { success: false, count: 0 };
  }
}

// ==========================================
// REALISTIC INSTITUTIONAL DEFAULT MOCK DATA
// ==========================================

export const DEFAULT_CLASSES: SchoolClass[] = [
  { id: 'cls_pg', name: 'Playgroup', numericGrade: 0, wing: 'combined', capacity: 30, active: true, createdAt: '2026-01-01' },
  { id: 'cls_nur', name: 'Nursery', numericGrade: 0, wing: 'combined', capacity: 35, active: true, createdAt: '2026-01-01' },
  { id: 'cls_kg', name: 'KG (Kindergarten)', numericGrade: 0, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { id: 'cls_1', name: 'Class 1', numericGrade: 1, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { id: 'cls_2', name: 'Class 2', numericGrade: 2, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { id: 'cls_3', name: 'Class 3', numericGrade: 3, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { id: 'cls_4', name: 'Class 4', numericGrade: 4, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { id: 'cls_5', name: 'Class 5', numericGrade: 5, wing: 'combined', capacity: 40, active: true, createdAt: '2026-01-01' },
  { id: 'cls_6', name: 'Class 6', numericGrade: 6, wing: 'boys', capacity: 45, active: true, createdAt: '2026-01-01' },
  { id: 'cls_7', name: 'Class 7', numericGrade: 7, wing: 'boys', capacity: 45, active: true, createdAt: '2026-01-01' },
  { id: 'cls_8', name: 'Class 8', numericGrade: 8, wing: 'boys', capacity: 45, active: true, createdAt: '2026-01-01' },
  { id: 'cls_9', name: 'Class 9 (Matriculation)', numericGrade: 9, wing: 'boys', capacity: 50, active: true, createdAt: '2026-01-01' },
  { id: 'cls_10', name: 'Class 10 (Matriculation)', numericGrade: 10, wing: 'boys', capacity: 50, active: true, createdAt: '2026-01-01' },
  { id: 'cls_11', name: 'Class 11 (1st Year College)', numericGrade: 11, wing: 'boys', capacity: 60, active: true, createdAt: '2026-01-01' },
  { id: 'cls_12', name: 'Class 12 (2nd Year College)', numericGrade: 12, wing: 'boys', capacity: 60, active: true, createdAt: '2026-01-01' },
];

export const DEFAULT_SECTIONS: Section[] = [
  // Class 9 Sections
  { id: 'sec_9_b_a', classId: 'cls_9', className: 'Class 9', name: 'Section A', genderSection: 'boys', roomNumber: 'B-101', classTeacherId: 'tch_1', classTeacherName: 'Dr. Tariq Mahmood', studentCount: 38, capacity: 45 },
  { id: 'sec_9_g_a', classId: 'cls_9', className: 'Class 9', name: 'Section A', genderSection: 'girls', roomNumber: 'G-101', classTeacherId: 'tch_2', classTeacherName: 'Mrs. Saima Noreen', studentCount: 36, capacity: 45 },
  // Class 10 Sections
  { id: 'sec_10_b_a', classId: 'cls_10', className: 'Class 10', name: 'Section A', genderSection: 'boys', roomNumber: 'B-201', classTeacherId: 'tch_3', classTeacherName: 'Ustadh Hafiz Usman', studentCount: 42, capacity: 45 },
  { id: 'sec_10_g_a', classId: 'cls_10', className: 'Class 10', name: 'Section A', genderSection: 'girls', roomNumber: 'G-201', classTeacherId: 'tch_4', classTeacherName: 'Ms. Fatima Qureshi', studentCount: 40, capacity: 45 },
  // College Class 11 Sections
  { id: 'sec_11_b_eng', classId: 'cls_11', className: 'Class 11', name: 'Pre-Engineering (Boys)', genderSection: 'boys', roomNumber: 'B-Col-01', classTeacherId: 'tch_5', classTeacherName: 'Engr. Bilal Hashmi', studentCount: 48, capacity: 55 },
  { id: 'sec_11_g_med', classId: 'cls_11', className: 'Class 11', name: 'Pre-Medical (Girls)', genderSection: 'girls', roomNumber: 'G-Col-01', classTeacherId: 'tch_6', classTeacherName: 'Dr. Ayesha Malik', studentCount: 52, capacity: 55 },
  // College Class 12 Sections
  { id: 'sec_12_b_ics', classId: 'cls_12', className: 'Class 12', name: 'ICS Computer Science', genderSection: 'boys', roomNumber: 'B-Col-02', classTeacherId: 'tch_7', classTeacherName: 'Prof. Junaid Farooq', studentCount: 45, capacity: 50 },
  { id: 'sec_12_g_med', classId: 'cls_12', className: 'Class 12', name: 'Pre-Medical (Girls)', genderSection: 'girls', roomNumber: 'G-Col-02', classTeacherId: 'tch_6', classTeacherName: 'Dr. Ayesha Malik', studentCount: 47, capacity: 50 },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 'tch_1',
    fullName: 'Dr. Tariq Mahmood',
    email: 'tariq.mahmood@muslimschool.edu.pk',
    phone: '+92 300 1234567',
    gender: 'male',
    designation: 'Head of Physics & Senior Lecturer',
    qualification: 'Ph.D. in Physics, Quaid-i-Azam University',
    specialization: 'Quantum Mechanics & College Physics',
    assignedClasses: ['cls_9', 'cls_10', 'cls_11', 'cls_12'],
    assignedSections: ['sec_9_b_a', 'sec_11_b_eng'],
    assignedSubjects: ['Physics', 'Applied Mechanics'],
    status: 'active',
    joinDate: '2020-08-15',
  },
  {
    id: 'tch_2',
    fullName: 'Mrs. Saima Noreen',
    email: 'saima.noreen@muslimschool.edu.pk',
    phone: '+92 321 9876543',
    gender: 'female',
    designation: 'Senior Mistress & English Specialist',
    qualification: 'M.A. English Literature & Linguistics',
    specialization: 'Grammar, Creative Writing & Literature',
    assignedClasses: ['cls_9', 'cls_10'],
    assignedSections: ['sec_9_g_a', 'sec_10_g_a'],
    assignedSubjects: ['English', 'Literature'],
    status: 'active',
    joinDate: '2019-03-01',
  },
  {
    id: 'tch_3',
    fullName: 'Ustadh Hafiz Usman Raza',
    email: 'hafiz.usman@muslimschool.edu.pk',
    phone: '+92 333 4567890',
    gender: 'male',
    designation: 'Head of Islamic Studies & Nazra / Hifz',
    qualification: 'Shahadat-ul-Alimiyya, Wifaq-ul-Madaris & M.A. Islamic Studies',
    specialization: 'Quranic Tajweed, Hadith & Islamic Jurisprudence',
    assignedClasses: ['cls_6', 'cls_7', 'cls_8', 'cls_9', 'cls_10'],
    assignedSections: ['sec_9_b_a', 'sec_10_b_a'],
    assignedSubjects: ['Islamic Studies', 'Tarjuma-tul-Quran'],
    status: 'active',
    joinDate: '2018-01-10',
  },
  {
    id: 'tch_4',
    fullName: 'Ms. Fatima Qureshi',
    email: 'fatima.qureshi@muslimschool.edu.pk',
    phone: '+92 345 6789012',
    gender: 'female',
    designation: 'Lecturer in Mathematics',
    qualification: 'M.Phil. Applied Mathematics',
    specialization: 'Calculus, Algebra & Trigonometry',
    assignedClasses: ['cls_9', 'cls_10'],
    assignedSections: ['sec_9_g_a', 'sec_10_g_a'],
    assignedSubjects: ['Mathematics'],
    status: 'active',
    joinDate: '2021-09-01',
  },
  {
    id: 'tch_5',
    fullName: 'Engr. Bilal Hashmi',
    email: 'bilal.hashmi@muslimschool.edu.pk',
    phone: '+92 301 2345678',
    gender: 'male',
    designation: 'Senior Lecturer in Mathematics',
    qualification: 'M.Sc. Systems Engineering & B.Sc. Mathematics',
    specialization: 'Higher Secondary Mathematics',
    assignedClasses: ['cls_11', 'cls_12'],
    assignedSections: ['sec_11_b_eng', 'sec_12_b_ics'],
    assignedSubjects: ['College Mathematics', 'Calculus'],
    status: 'active',
    joinDate: '2021-02-15',
  },
  {
    id: 'tch_6',
    fullName: 'Dr. Ayesha Malik',
    email: 'ayesha.malik@muslimschool.edu.pk',
    phone: '+92 312 3456789',
    gender: 'female',
    designation: 'Associate Professor of Biology',
    qualification: 'Ph.D. Molecular Genetics, MBBS',
    specialization: 'Pre-Medical MDCAT preparation & Human Physiology',
    assignedClasses: ['cls_11', 'cls_12'],
    assignedSections: ['sec_11_g_med', 'sec_12_g_med'],
    assignedSubjects: ['Biology', 'Genetics', 'MDCAT Prep'],
    status: 'active',
    joinDate: '2019-07-20',
  },
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'std_01',
    admissionNo: 'MSC-2024-001',
    fullName: 'Muhammad Hamza Khan',
    gender: 'male',
    dateOfBirth: '2009-04-12',
    admissionDate: '2024-03-15',
    academicYear: '2026-2027',
    classId: 'cls_10',
    className: 'Class 10 (Matriculation)',
    sectionId: 'sec_10_b_a',
    sectionName: 'Section A',
    genderSection: 'boys',
    rollNo: '10-B-01',
    guardianName: 'Tariq Khan',
    guardianPhone: '+92 300 5551234',
    guardianEmail: 'tariq.khan@gmail.com',
    guardianRelation: 'Father',
    address: 'Main Road Gujrat, Near Ground, Mardan',
    status: 'active',
    monthlyFee: 14500,
    createdAt: '2024-03-15',
  },
  {
    id: 'std_02',
    admissionNo: 'MSC-2024-002',
    fullName: 'Fatima Zahra Siddiqui',
    gender: 'female',
    dateOfBirth: '2009-08-25',
    admissionDate: '2024-03-18',
    academicYear: '2026-2027',
    classId: 'cls_10',
    className: 'Class 10 (Matriculation)',
    sectionId: 'sec_10_g_a',
    sectionName: 'Section A',
    genderSection: 'girls',
    rollNo: '10-G-01',
    guardianName: 'Dr. Rashid Siddiqui',
    guardianPhone: '+92 333 5559876',
    guardianEmail: 'dr.rashid@siddiqui.org',
    guardianRelation: 'Father',
    address: 'Sheikh Maltoon Town, Sector B, Mardan',
    status: 'active',
    monthlyFee: 14500,
    createdAt: '2024-03-18',
  },
  {
    id: 'std_03',
    admissionNo: 'MSC-2025-045',
    fullName: 'Abdullah Umar',
    gender: 'male',
    dateOfBirth: '2008-01-14',
    admissionDate: '2025-08-10',
    academicYear: '2026-2027',
    classId: 'cls_11',
    className: 'Class 11 (1st Year College)',
    sectionId: 'sec_11_b_eng',
    sectionName: 'Pre-Engineering (Boys)',
    genderSection: 'boys',
    rollNo: '11-ENG-03',
    guardianName: 'Muhammad Umar Farooq',
    guardianPhone: '+92 321 8887766',
    guardianEmail: 'umar.farooq@outlook.com',
    guardianRelation: 'Father',
    address: 'Cantt Area, Near Railway Station, Mardan',
    status: 'active',
    monthlyFee: 18500,
    createdAt: '2025-08-10',
  },
  {
    id: 'std_04',
    admissionNo: 'MSC-2025-046',
    fullName: 'Aisha Maryam',
    gender: 'female',
    dateOfBirth: '2008-05-19',
    admissionDate: '2025-08-12',
    academicYear: '2026-2027',
    classId: 'cls_11',
    className: 'Class 11 (1st Year College)',
    sectionId: 'sec_11_g_med',
    sectionName: 'Pre-Medical (Girls)',
    genderSection: 'girls',
    rollNo: '11-MED-05',
    guardianName: 'Engr. Jameel Ahmed',
    guardianPhone: '+92 302 4443322',
    guardianEmail: 'jameel.ahmed@yahoo.com',
    guardianRelation: 'Father',
    address: 'Nowshera Road, Mardan',
    status: 'active',
    monthlyFee: 18500,
    createdAt: '2025-08-12',
  },
  {
    id: 'std_05',
    admissionNo: 'MSC-2023-112',
    fullName: 'Zaid bin Khalid',
    gender: 'male',
    dateOfBirth: '2010-11-03',
    admissionDate: '2023-04-01',
    academicYear: '2026-2027',
    classId: 'cls_9',
    className: 'Class 9 (Matriculation)',
    sectionId: 'sec_9_b_a',
    sectionName: 'Section A',
    genderSection: 'boys',
    rollNo: '9-B-08',
    guardianName: 'Khalid Mehmood',
    guardianPhone: '+92 344 1122334',
    guardianEmail: 'khalid.m@gmail.com',
    guardianRelation: 'Father',
    address: 'Bank Road, Gujrat, Mardan',
    status: 'active',
    monthlyFee: 13500,
    createdAt: '2023-04-01',
  },
  {
    id: 'std_06',
    admissionNo: 'MSC-2023-113',
    fullName: 'Khadija Tul Kubra',
    gender: 'female',
    dateOfBirth: '2010-09-17',
    admissionDate: '2023-04-05',
    academicYear: '2026-2027',
    classId: 'cls_9',
    className: 'Class 9 (Matriculation)',
    sectionId: 'sec_9_g_a',
    sectionName: 'Section A',
    genderSection: 'girls',
    rollNo: '9-G-04',
    guardianName: 'Sheikh Waqas Ali',
    guardianPhone: '+92 313 9988776',
    guardianEmail: 'waqas.ali@trade.pk',
    guardianRelation: 'Father',
    address: 'College Road, Gujrat Ground, Mardan',
    status: 'active',
    monthlyFee: 13500,
    createdAt: '2023-04-05',
  },
  {
    id: 'std_07',
    admissionNo: 'MSC-2025-089',
    fullName: 'Ibrahim Hassan',
    gender: 'male',
    dateOfBirth: '2007-06-30',
    admissionDate: '2025-08-15',
    academicYear: '2026-2027',
    classId: 'cls_12',
    className: 'Class 12 (2nd Year College)',
    sectionId: 'sec_12_b_ics',
    sectionName: 'ICS Computer Science',
    genderSection: 'boys',
    rollNo: '12-ICS-02',
    guardianName: 'Hassan Nisar',
    guardianPhone: '+92 300 7766554',
    guardianEmail: 'hassan.nisar@corp.pk',
    guardianRelation: 'Father',
    address: 'Near Sports Stadium, Mardan',
    status: 'active',
    monthlyFee: 19500,
    createdAt: '2025-08-15',
  },
  {
    id: 'std_08',
    admissionNo: 'MSC-2025-090',
    fullName: 'Zainab Bint Asim',
    gender: 'female',
    dateOfBirth: '2007-03-11',
    admissionDate: '2025-08-15',
    academicYear: '2026-2027',
    classId: 'cls_12',
    className: 'Class 12 (2nd Year College)',
    sectionId: 'sec_12_g_med',
    sectionName: 'Pre-Medical (Girls)',
    genderSection: 'girls',
    rollNo: '12-MED-01',
    guardianName: 'Dr. Asim Munir',
    guardianPhone: '+92 333 1112233',
    guardianEmail: 'dr.asim@hospital.org',
    guardianRelation: 'Father',
    address: 'Main Road, Gujrat, Mardan',
    status: 'active',
    monthlyFee: 19500,
    createdAt: '2025-08-15',
  },
];

export const DEFAULT_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'att_01',
    date: '2026-10-29',
    classId: 'cls_10',
    className: 'Class 10 (Matriculation)',
    sectionId: 'sec_10_b_a',
    sectionName: 'Section A',
    genderSection: 'boys',
    teacherId: 'tch_3',
    teacherName: 'Ustadh Hafiz Usman',
    totalStudents: 42,
    presentCount: 39,
    absentCount: 2,
    lateCount: 1,
    leaveCount: 0,
    status: 'submitted',
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    id: 'att_02',
    date: '2026-10-29',
    classId: 'cls_10',
    className: 'Class 10 (Matriculation)',
    sectionId: 'sec_10_g_a',
    sectionName: 'Section A',
    genderSection: 'girls',
    teacherId: 'tch_4',
    teacherName: 'Ms. Fatima Qureshi',
    totalStudents: 40,
    presentCount: 38,
    absentCount: 1,
    lateCount: 0,
    leaveCount: 1,
    status: 'approved',
    timestamp: Date.now() - 3600000 * 3,
  },
  {
    id: 'att_03',
    date: '2026-10-29',
    classId: 'cls_11',
    className: 'Class 11 (1st Year College)',
    sectionId: 'sec_11_b_eng',
    sectionName: 'Pre-Engineering (Boys)',
    genderSection: 'boys',
    teacherId: 'tch_5',
    teacherName: 'Engr. Bilal Hashmi',
    totalStudents: 48,
    presentCount: 45,
    absentCount: 2,
    lateCount: 1,
    leaveCount: 0,
    status: 'submitted',
    timestamp: Date.now() - 3600000 * 4,
  },
  {
    id: 'att_04',
    date: '2026-10-29',
    classId: 'cls_11',
    className: 'Class 11 (1st Year College)',
    sectionId: 'sec_11_g_med',
    sectionName: 'Pre-Medical (Girls)',
    genderSection: 'girls',
    teacherId: 'tch_6',
    teacherName: 'Dr. Ayesha Malik',
    totalStudents: 52,
    presentCount: 50,
    absentCount: 1,
    lateCount: 1,
    leaveCount: 0,
    status: 'approved',
    timestamp: Date.now() - 3600000 * 5,
  },
];

export const DEFAULT_EXAMS: Examination[] = [
  {
    id: 'exam_mid_2026',
    title: 'Mid-Term Examinations 2026',
    term: 'Mid Term',
    academicYear: '2026-2027',
    startDate: '2026-11-15',
    endDate: '2026-11-30',
    status: 'published',
  },
  {
    id: 'exam_final_2027',
    title: 'Annual Board Model & Final Exams 2027',
    term: 'Annual Board Pre-Exam',
    academicYear: '2026-2027',
    startDate: '2027-02-20',
    endDate: '2027-03-10',
    status: 'scheduled',
  },
];

export const DEFAULT_EXAM_MARKS: ExamMark[] = [
  { id: 'mk_01', examId: 'exam_mid_2026', examTitle: 'Mid-Term Examinations 2026', studentId: 'std_01', studentName: 'Muhammad Hamza Khan', admissionNo: 'MSC-2024-001', classId: 'cls_10', sectionId: 'sec_10_b_a', subjectId: 'sb_phy', subjectName: 'Physics', marksObtained: 94, maxMarks: 100, passingMarks: 33, grade: 'A+' },
  { id: 'mk_02', examId: 'exam_mid_2026', examTitle: 'Mid-Term Examinations 2026', studentId: 'std_01', studentName: 'Muhammad Hamza Khan', admissionNo: 'MSC-2024-001', classId: 'cls_10', sectionId: 'sec_10_b_a', subjectId: 'sb_mat', subjectName: 'Mathematics', marksObtained: 98, maxMarks: 100, passingMarks: 33, grade: 'A+' },
  { id: 'mk_03', examId: 'exam_mid_2026', examTitle: 'Mid-Term Examinations 2026', studentId: 'std_01', studentName: 'Muhammad Hamza Khan', admissionNo: 'MSC-2024-001', classId: 'cls_10', sectionId: 'sec_10_b_a', subjectId: 'sb_isl', subjectName: 'Islamic Studies & Quran', marksObtained: 96, maxMarks: 100, passingMarks: 33, grade: 'A+' },
  { id: 'mk_04', examId: 'exam_mid_2026', examTitle: 'Mid-Term Examinations 2026', studentId: 'std_01', studentName: 'Muhammad Hamza Khan', admissionNo: 'MSC-2024-001', classId: 'cls_10', sectionId: 'sec_10_b_a', subjectId: 'sb_eng', subjectName: 'English Literature', marksObtained: 89, maxMarks: 100, passingMarks: 33, grade: 'A' },
  { id: 'mk_05', examId: 'exam_mid_2026', examTitle: 'Mid-Term Examinations 2026', studentId: 'std_02', studentName: 'Fatima Zahra Siddiqui', admissionNo: 'MSC-2024-002', classId: 'cls_10', sectionId: 'sec_10_g_a', subjectId: 'sb_phy', subjectName: 'Physics', marksObtained: 96, maxMarks: 100, passingMarks: 33, grade: 'A+' },
  { id: 'mk_06', examId: 'exam_mid_2026', examTitle: 'Mid-Term Examinations 2026', studentId: 'std_02', studentName: 'Fatima Zahra Siddiqui', admissionNo: 'MSC-2024-002', classId: 'cls_10', sectionId: 'sec_10_g_a', subjectId: 'sb_mat', subjectName: 'Mathematics', marksObtained: 95, maxMarks: 100, passingMarks: 33, grade: 'A+' },
  { id: 'mk_07', examId: 'exam_mid_2026', examTitle: 'Mid-Term Examinations 2026', studentId: 'std_02', studentName: 'Fatima Zahra Siddiqui', admissionNo: 'MSC-2024-002', classId: 'cls_10', sectionId: 'sec_10_g_a', subjectId: 'sb_isl', subjectName: 'Islamic Studies & Quran', marksObtained: 99, maxMarks: 100, passingMarks: 33, grade: 'A+' },
  { id: 'mk_08', examId: 'exam_mid_2026', examTitle: 'Mid-Term Examinations 2026', studentId: 'std_02', studentName: 'Fatima Zahra Siddiqui', admissionNo: 'MSC-2024-002', classId: 'cls_10', sectionId: 'sec_10_g_a', subjectId: 'sb_eng', subjectName: 'English Literature', marksObtained: 94, maxMarks: 100, passingMarks: 33, grade: 'A+' },
];

export const DEFAULT_FEE_STRUCTURES: FeeStructure[] = [
  { id: 'fee_mat', title: 'Matriculation (Classes 9 & 10)', academicYear: '2026-2027', classId: 'cls_10', className: 'Class 9-10', tuitionFee: 12500, admissionFee: 15000, examFee: 3000, computerLabFee: 1500, totalAmount: 14500 },
  { id: 'fee_col', title: 'Intermediate / College (Classes 11 & 12)', academicYear: '2026-2027', classId: 'cls_11', className: 'Class 11-12', tuitionFee: 15500, admissionFee: 20000, examFee: 4000, computerLabFee: 2500, totalAmount: 18500 },
  { id: 'fee_pri', title: 'Primary Wing (Classes 1 to 5)', academicYear: '2026-2027', classId: 'cls_1', className: 'Primary 1-5', tuitionFee: 9500, admissionFee: 10000, examFee: 2000, computerLabFee: 1000, totalAmount: 11000 },
];

export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv_2026_10_01',
    invoiceNo: 'INV-2026-10-001',
    studentId: 'std_01',
    studentName: 'Muhammad Hamza Khan',
    admissionNo: 'MSC-2024-001',
    classId: 'cls_10',
    className: 'Class 10',
    sectionId: 'sec_10_b_a',
    sectionName: 'Section A (Boys)',
    month: 'October',
    year: '2026',
    tuitionFee: 12500,
    otherFee: 2000,
    discount: 0,
    netAmount: 14500,
    paidAmount: 14500,
    balance: 0,
    status: 'paid',
    dueDate: '2026-10-10',
    createdAt: '2026-10-01',
  },
  {
    id: 'inv_2026_10_02',
    invoiceNo: 'INV-2026-10-002',
    studentId: 'std_02',
    studentName: 'Fatima Zahra Siddiqui',
    admissionNo: 'MSC-2024-002',
    classId: 'cls_10',
    className: 'Class 10',
    sectionId: 'sec_10_g_a',
    sectionName: 'Section A (Girls)',
    month: 'October',
    year: '2026',
    tuitionFee: 12500,
    otherFee: 2000,
    discount: 1000,
    netAmount: 13500,
    paidAmount: 13500,
    balance: 0,
    status: 'paid',
    dueDate: '2026-10-10',
    createdAt: '2026-10-01',
  },
  {
    id: 'inv_2026_10_03',
    invoiceNo: 'INV-2026-10-003',
    studentId: 'std_03',
    studentName: 'Abdullah Umar',
    admissionNo: 'MSC-2025-045',
    classId: 'cls_11',
    className: 'Class 11',
    sectionId: 'sec_11_b_eng',
    sectionName: 'Pre-Engineering (Boys)',
    month: 'October',
    year: '2026',
    tuitionFee: 15500,
    otherFee: 3000,
    discount: 0,
    netAmount: 18500,
    paidAmount: 0,
    balance: 18500,
    status: 'unpaid',
    dueDate: '2026-10-10',
    createdAt: '2026-10-01',
  },
  {
    id: 'inv_2026_10_04',
    invoiceNo: 'INV-2026-10-004',
    studentId: 'std_04',
    studentName: 'Aisha Maryam',
    admissionNo: 'MSC-2025-046',
    classId: 'cls_11',
    className: 'Class 11',
    sectionId: 'sec_11_g_med',
    sectionName: 'Pre-Medical (Girls)',
    month: 'October',
    year: '2026',
    tuitionFee: 15500,
    otherFee: 3000,
    discount: 0,
    netAmount: 18500,
    paidAmount: 10000,
    balance: 8500,
    status: 'partial',
    dueDate: '2026-10-10',
    createdAt: '2026-10-01',
  },
];

export const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: 'pay_01',
    invoiceId: 'inv_2026_10_01',
    invoiceNo: 'INV-2026-10-001',
    studentId: 'std_01',
    studentName: 'Muhammad Hamza Khan',
    admissionNo: 'MSC-2024-001',
    amount: 14500,
    paymentMethod: 'Bank Transfer',
    receiptNo: 'RCP-2026-1049',
    date: '2026-10-05',
    recordedBy: 'Accounts Officer Mr. Noman',
  },
  {
    id: 'pay_02',
    invoiceId: 'inv_2026_10_02',
    invoiceNo: 'INV-2026-10-002',
    studentId: 'std_02',
    studentName: 'Fatima Zahra Siddiqui',
    admissionNo: 'MSC-2024-002',
    amount: 13500,
    paymentMethod: 'Online',
    receiptNo: 'RCP-2026-1050',
    date: '2026-10-07',
    recordedBy: 'Accounts Officer Mr. Noman',
  },
];

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_01',
    title: 'Winter Uniform Mandatory Guidelines & Islamic Dress Code',
    content: 'All students are notified that winter uniform standards become effective from November 1st. Boys must wear navy blue blazers with grey trousers, white collared shirt, and school tie. Girls must wear full-sleeved emerald green kameez with white shalwar and institutional white headscarf/chador.',
    targetAudience: 'all',
    category: 'academic',
    priority: 'urgent',
    date: '2026-10-28',
    authorName: 'Office of the Principal, The Muslim School & College, Mardan',
  },
  {
    id: 'ann_02',
    title: 'Mid-Term Examination Datesheet Released',
    content: 'The Mid-Term Examination 2026 for Classes 1 through 12 will commence on November 15, 2026. Hall tickets and personalized examination schedules have been published on student portals. Parents are requested to ensure clearance of all dues prior to November 10.',
    targetAudience: 'all',
    category: 'exam',
    priority: 'urgent',
    date: '2026-10-26',
    authorName: 'Examination Controller, Mardan',
  },
  {
    id: 'ann_03',
    title: 'Annual Seerat-un-Nabi (PBUH) Conference & Qirat Competition',
    content: 'The Muslim School & College cordially invites all parents and students to the Annual Seerat Conference on Friday. Special competitions in Husn-e-Qirat, Naat Khawani, and Speech on prophetic morals will be held in the Main Auditorium at Gujrat Ground, Mardan.',
    targetAudience: 'all',
    category: 'event',
    priority: 'normal',
    date: '2026-10-24',
    authorName: 'Department of Islamic Studies, Mardan',
  },
];

export const DEFAULT_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'adm_01',
    applicantName: 'Saad Ahmed',
    gender: 'male',
    appliedClass: 'Class 11 (1st Year FSC Pre-Eng)',
    parentName: 'Ahmed Bilal',
    phone: '+92 313 9375355',
    email: 'ahmed.bilal@gmail.com',
    previousSchool: 'Army Public School, Mardan',
    bFormCnic: '16101-1234567-1',
    submissionDate: '2026-10-27',
    status: 'interview_scheduled',
    notes: 'Matric 92% marks in Science group. Strong foundation in Physics & Math.',
  },
  {
    id: 'adm_02',
    applicantName: 'Muntaha Fatima',
    gender: 'female',
    appliedClass: 'Class 9 (Matriculation)',
    parentName: 'Dr. Tariq Jamil',
    phone: '+92 313 9375355',
    email: 'themuslimschool&collage12@gmail.com',
    previousSchool: 'Mardan Model School for Girls',
    bFormCnic: '16101-7654321-2',
    submissionDate: '2026-10-28',
    status: 'pending',
    notes: 'Seeking admission in Girls Section A. Hafiza-e-Quran with certificate.',
  },
];

export const DEFAULT_TIMETABLES: Timetable[] = [
  {
    id: 'tt_10_b',
    classId: 'cls_10',
    className: 'Class 10',
    sectionId: 'sec_10_b_a',
    sectionName: 'Section A (Boys)',
    dayOfWeek: 'Monday',
    periods: [
      { periodNumber: 1, startTime: '08:00', endTime: '08:45', subject: 'Quran Tajweed & Islamic Studies', teacherName: 'Ustadh Hafiz Usman', room: 'B-201' },
      { periodNumber: 2, startTime: '08:45', endTime: '09:30', subject: 'Mathematics', teacherName: 'Engr. Bilal Hashmi', room: 'B-201' },
      { periodNumber: 3, startTime: '09:30', endTime: '10:15', subject: 'Physics Lab', teacherName: 'Dr. Tariq Mahmood', room: 'Science Lab 1' },
      { periodNumber: 4, startTime: '10:45', endTime: '11:30', subject: 'English Grammar & Comp', teacherName: 'Mrs. Saima Noreen', room: 'B-201' },
      { periodNumber: 5, startTime: '11:30', endTime: '12:15', subject: 'Chemistry', teacherName: 'Prof. Junaid Farooq', room: 'Chemistry Lab' },
      { periodNumber: 6, startTime: '12:15', endTime: '01:00', subject: 'Computer Science', teacherName: 'Engr. Zeeshan', room: 'Lab 2' },
    ],
  },
  {
    id: 'tt_11_g',
    classId: 'cls_11',
    className: 'Class 11',
    sectionId: 'sec_11_g_med',
    sectionName: 'Pre-Medical (Girls)',
    dayOfWeek: 'Monday',
    periods: [
      { periodNumber: 1, startTime: '08:00', endTime: '08:45', subject: 'Biology Lecture', teacherName: 'Dr. Ayesha Malik', room: 'G-Col-01' },
      { periodNumber: 2, startTime: '08:45', endTime: '09:30', subject: 'Chemistry', teacherName: 'Prof. Junaid Farooq', room: 'G-Col-01' },
      { periodNumber: 3, startTime: '09:30', endTime: '10:15', subject: 'Physics', teacherName: 'Dr. Tariq Mahmood', room: 'G-Col-01' },
      { periodNumber: 4, startTime: '10:45', endTime: '11:30', subject: 'Tarjuma-tul-Quran', teacherName: 'Ustadh Hafiz Usman', room: 'G-Col-01' },
      { periodNumber: 5, startTime: '11:30', endTime: '12:15', subject: 'English', teacherName: 'Mrs. Saima Noreen', room: 'G-Col-01' },
      { periodNumber: 6, startTime: '12:15', endTime: '01:00', subject: 'Biology Practical', teacherName: 'Dr. Ayesha Malik', room: 'Bio Lab' },
    ],
  },
];

export const DEFAULT_BOOKS: LibraryBook[] = [
  { id: 'bk_01', isbn: '978-969-01', title: 'Tafheem-ul-Quran (Vols 1-6)', author: 'Sayyid Abul A\'la Maududi', category: 'Islamic Studies', copiesTotal: 12, copiesAvailable: 9, shelfLocation: 'IS-A1' },
  { id: 'bk_02', isbn: '978-969-02', title: 'Riyad as-Salihin (Gardens of the Righteous)', author: 'Imam an-Nawawi', category: 'Islamic Studies', copiesTotal: 15, copiesAvailable: 11, shelfLocation: 'IS-B2' },
  { id: 'bk_03', isbn: '978-019-01', title: 'Fundamentals of Physics (11th Edition)', author: 'Halliday, Resnick, Walker', category: 'Sciences', copiesTotal: 25, copiesAvailable: 18, shelfLocation: 'SC-P1' },
  { id: 'bk_04', isbn: '978-019-02', title: 'Calculus: Early Transcendentals', author: 'James Stewart', category: 'Mathematics', copiesTotal: 20, copiesAvailable: 14, shelfLocation: 'MT-C1' },
  { id: 'bk_05', isbn: '978-969-03', title: 'Kulliyat-e-Iqbal (Complete Works of Allama Iqbal)', author: 'Dr. Allama Muhammad Iqbal', category: 'Literature', copiesTotal: 30, copiesAvailable: 24, shelfLocation: 'LIT-U1' },
];

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'usr_owner_01',
    uid: 'owner_zohaib_uid',
    displayName: 'Zohaib Ali',
    email: 'zohaibalioffical12@gmail.com',
    role: 'ceo',
    status: 'active',
    phone: '+92 313 9375355',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr_prin_01',
    uid: 'prin_saleem_uid',
    displayName: 'Prof. Dr. Muhammad Saleem',
    email: 'principal@muslimschool.edu.pk',
    role: 'principal',
    status: 'active',
    phone: '+92 313 9375355',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr_tch_01',
    uid: 'tch_tariq_uid',
    displayName: 'Dr. Tariq Mahmood',
    email: 'tariq.mahmood@muslimschool.edu.pk',
    role: 'teacher',
    status: 'active',
    phone: '+92 300 1234567',
    assignedClasses: ['cls_9', 'cls_10', 'cls_11', 'cls_12'],
    assignedSections: ['sec_9_b_a', 'sec_11_b_eng'],
    assignedSubjects: ['Physics', 'Applied Mechanics'],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'usr_tch_02',
    uid: 'tch_saima_uid',
    displayName: 'Mrs. Saima Noreen',
    email: 'saima.noreen@muslimschool.edu.pk',
    role: 'teacher',
    status: 'active',
    phone: '+92 321 9876543',
    assignedClasses: ['cls_9', 'cls_10'],
    assignedSections: ['sec_9_g_a', 'sec_10_g_a'],
    assignedSubjects: ['English', 'Literature'],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'usr_std_01',
    uid: 'std_hamza_uid',
    displayName: 'Muhammad Hamza Khan',
    email: 'hamza.khan@student.muslimschool.edu.pk',
    role: 'student',
    status: 'active',
    phone: '+92 300 5551234',
    studentId: 'std_01',
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'usr_std_02',
    uid: 'std_fatima_uid',
    displayName: 'Fatima Zahra Siddiqui',
    email: 'fatima.zahra@student.muslimschool.edu.pk',
    role: 'student',
    status: 'active',
    phone: '+92 333 5559876',
    studentId: 'std_02',
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'usr_par_01',
    uid: 'par_tariq_uid',
    displayName: 'Tariq Khan',
    email: 'tariq.khan@gmail.com',
    role: 'parent',
    status: 'active',
    phone: '+92 300 5551234',
    linkedStudentIds: ['std_01', 'std_03'],
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'usr_par_02',
    uid: 'par_rashid_uid',
    displayName: 'Dr. Rashid Siddiqui',
    email: 'dr.rashid@siddiqui.org',
    role: 'parent',
    status: 'active',
    phone: '+92 333 5559876',
    linkedStudentIds: ['std_02'],
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'usr_acc_01',
    uid: 'acc_noman_uid',
    displayName: 'Noman Bashir (Accountant)',
    email: 'accounts@muslimschool.edu.pk',
    role: 'accountant',
    status: 'active',
    phone: '+92 300 8765432',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'usr_adm_01',
    uid: 'adm_farhan_uid',
    displayName: 'Farhan Qureshi (Admissions)',
    email: 'admissions@muslimschool.edu.pk',
    role: 'admissions_officer',
    status: 'active',
    phone: '+92 313 9375355',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'usr_lib_01',
    uid: 'lib_bilal_uid',
    displayName: 'Hafiz Bilal Tariq (Librarian)',
    email: 'library@muslimschool.edu.pk',
    role: 'librarian',
    status: 'active',
    phone: '+92 333 9988776',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'usr_stf_01',
    uid: 'stf_asad_uid',
    displayName: 'Asadullah Shah',
    email: 'transport@muslimschool.edu.pk',
    role: 'staff',
    status: 'active',
    staffRoleTitle: 'Transport & Facilities Officer',
    permittedModules: ['facilities', 'timetables', 'announcements'],
    phone: '+92 345 1234987',
    createdAt: '2026-01-15T00:00:00Z',
  },
];

export const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asgn_01',
    title: 'Electromagnetic Induction & Faradays Law',
    description: 'Solve textbook exercises 14.1 through 14.8 with complete step-by-step vector diagrams and formulas.',
    classId: 'cls_10',
    className: 'Class 10 (Matriculation)',
    sectionId: 'sec_10_b_a',
    sectionName: 'Section A (Boys)',
    subject: 'Physics',
    teacherId: 'tch_1',
    teacherName: 'Dr. Tariq Mahmood',
    dueDate: '2026-11-05',
    totalMarks: 20,
    createdAt: '2026-10-28T09:00:00Z',
  },
  {
    id: 'asgn_02',
    title: 'Essay: Role of Education in Islamic Civilizations',
    description: 'Write an analytical essay (400-500 words) referencing historical centers of learning like Baghdad, Cordoba, and Cairo.',
    classId: 'cls_10',
    className: 'Class 10 (Matriculation)',
    sectionId: 'sec_10_g_a',
    sectionName: 'Section A (Girls)',
    subject: 'English Literature',
    teacherId: 'tch_2',
    teacherName: 'Mrs. Saima Noreen',
    dueDate: '2026-11-04',
    totalMarks: 25,
    createdAt: '2026-10-27T10:00:00Z',
  },
  {
    id: 'asgn_03',
    title: 'Calculus: Derivatives of Trigonometric Functions',
    description: 'Complete problem sheet #4 uploaded to portal. Submit solutions in PDF or clean scanned format.',
    classId: 'cls_11',
    className: 'Class 11 (1st Year College)',
    sectionId: 'sec_11_b_eng',
    sectionName: 'Pre-Engineering (Boys)',
    subject: 'College Mathematics',
    teacherId: 'tch_5',
    teacherName: 'Engr. Bilal Hashmi',
    dueDate: '2026-11-06',
    totalMarks: 30,
    createdAt: '2026-10-29T08:30:00Z',
  },
];

export const DEFAULT_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub_01',
    assignmentId: 'asgn_01',
    assignmentTitle: 'Electromagnetic Induction & Faradays Law',
    studentId: 'std_01',
    studentName: 'Muhammad Hamza Khan',
    rollNo: '10-B-01',
    className: 'Class 10 (Matriculation)',
    content: 'Completed all problems including the step-by-step derivation of Lenz\'s law with illustrative circuit diagrams.',
    submittedAt: '2026-10-29T14:30:00Z',
    status: 'graded',
    marksAwarded: 19,
    feedback: 'Excellent mathematical working and clear diagrams. Well done Hamza.',
  },
  {
    id: 'sub_02',
    assignmentId: 'asgn_02',
    assignmentTitle: 'Essay: Role of Education in Islamic Civilizations',
    studentId: 'std_02',
    studentName: 'Fatima Zahra Siddiqui',
    rollNo: '10-G-01',
    className: 'Class 10 (Matriculation)',
    content: 'Attached comprehensive essay exploring the Golden Age of Islam, House of Wisdom (Bayt al-Hikmah), and scientific contributions.',
    submittedAt: '2026-10-28T16:15:00Z',
    status: 'graded',
    marksAwarded: 24,
    feedback: 'Outstanding vocabulary, strong references, and eloquent presentation.',
  },
];

