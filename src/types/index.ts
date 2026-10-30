export type UserRole =
  | 'ceo' // Owner / Super Admin (Zohaib Ali)
  | 'principal'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'admissions_officer'
  | 'librarian'
  | 'staff';

export type Gender = 'male' | 'female';
export type GenderSection = 'boys' | 'girls';
export type Wing = 'combined' | 'boys' | 'girls';

export interface UserProfile {
  id: string;
  uid?: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoUrl?: string;
  status: 'active' | 'suspended' | 'inactive';
  phone?: string;
  phoneNumber?: string;
  studentId?: string;
  assignedStudentId?: string;
  assignedTeacherId?: string;
  assignedClasses?: string[];
  assignedSections?: string[];
  assignedSubjects?: string[];
  linkedStudentIds?: string[]; // for parent accounts linking multiple verified children
  staffRoleTitle?: string; // e.g. IT Administrator, Examination Controller, Security Officer
  permittedModules?: string[]; // permissions configuration for staff roles
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  fullName: string;
  gender: Gender;
  dateOfBirth: string;
  admissionDate: string;
  academicYear: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  genderSection: GenderSection;
  rollNo?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianRelation?: string;
  address?: string;
  emergencyContact?: string;
  status: 'active' | 'transferred' | 'graduated' | 'withdrawn';
  photoUrl?: string;
  monthlyFee: number;
  discountPercent?: number;
  createdAt: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  numericGrade: number; // 0 for Playgroup, 1-12
  wing: Wing;
  capacity: number;
  active: boolean;
  subjectsCount?: number;
  sectionsCount?: number;
  createdAt: string;
}

export interface Section {
  id: string;
  classId: string;
  className: string;
  name: string; // 'A', 'B', 'Pre-Medical', etc.
  genderSection: GenderSection; // 'boys' | 'girls'
  roomNumber: string;
  classTeacherId?: string;
  classTeacherName?: string;
  studentCount: number;
  capacity: number;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  designation: string; // e.g. Senior Lecturer, Subject Specialist, Head of Dept
  qualification: string;
  specialization?: string;
  assignedClasses: string[];
  assignedSections: string[];
  assignedSubjects: string[];
  status: 'active' | 'on_leave' | 'resigned';
  joinDate: string;
  photoUrl?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  classId: string;
  className: string;
  weeklyPeriods: number;
  isElective?: boolean;
}

export interface AttendanceSession {
  id: string;
  date: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  genderSection: GenderSection;
  teacherId: string;
  teacherName: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
  status: 'submitted' | 'approved';
  timestamp?: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  date: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  sectionId: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  remarks?: string;
}

export interface Examination {
  id: string;
  title: string;
  term: 'First Term' | 'Mid Term' | 'Final Term' | 'Annual Board Pre-Exam';
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'ongoing' | 'grading' | 'published';
}

export interface ExamMark {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  passingMarks: number;
  grade: string;
}

export interface StudentResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  totalMarksObtained: number;
  totalMaxMarks: number;
  percentage: number;
  grade: string;
  position: number;
  remarks: string;
  published: boolean;
  marksBreakdown: ExamMark[];
}

export interface FeeStructure {
  id: string;
  title: string;
  academicYear: string;
  classId: string;
  className: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  computerLabFee: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  month: string;
  year: string;
  tuitionFee: number;
  otherFee: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
  dueDate: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online';
  receiptNo: string;
  date: string;
  recordedBy: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'teachers' | 'students' | 'parents';
  category: 'academic' | 'exam' | 'fee' | 'event' | 'holiday';
  priority: 'normal' | 'urgent';
  date: string;
  authorName: string;
}

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  gender: Gender;
  dateOfBirth?: string;
  appliedClass: string;
  parentName: string;
  phone: string;
  email: string;
  previousSchool?: string;
  bFormCnic?: string;
  address?: string;
  submissionDate: string;
  status: 'pending' | 'interview_scheduled' | 'approved' | 'rejected';
  notes?: string;
}

export interface TimetablePeriod {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  room: string;
}

export interface Timetable {
  id: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: TimetablePeriod[];
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: 'Islamic Studies' | 'Sciences' | 'Mathematics' | 'Literature' | 'General';
  copiesTotal: number;
  copiesAvailable: number;
  shelfLocation: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  targetResource: string;
  details: string;
  timestamp: string;
}

export interface SchoolSettings {
  id: string;
  institutionName: string;
  ownerName: string;
  ownerEmail: string;
  officialEmail: string;
  contactNumber: string;
  address: string;
  logoUrl?: string;
  academicYear: string;
  motto: string;
  themeColor?: string;
  gate1Notice?: string;
  gate2Notice?: string;
  visitorHours?: string;
  attendanceStatuses?: string[];
  updatedAt?: string;
}

export interface WebsiteContent {
  id: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroBadgeText?: string;
  heroBannerUrl?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  statLevels?: string;
  statStudents?: string;
  statPassRatio?: string;
  statFaculty?: string;
  aboutUsTitle?: string;
  aboutUsText: string;
  missionText: string;
  visionText: string;
  ethosText?: string;
  boysWingDesc?: string;
  girlsWingDesc?: string;
  programsIntro?: string;
  facilitiesIntro?: string;
  principalMessage: string;
  principalName: string;
  principalDesignation: string;
  principalPhotoUrl?: string;
  admissionsIntro?: string;
  admissionsNotice?: string;
  admissionsOpen: boolean;
  announcementsTicker: string;
  contactHeading?: string;
  contactSubheading?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  whatsappUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: 'published' | 'draft';
  publishedAt?: string;
  updatedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  sectionId?: string;
  sectionName?: string;
  description: string;
  dueDate: string;
  teacherId: string;
  teacherName: string;
  totalMarks?: number;
  maxScore?: number;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  admissionNo?: string;
  rollNo?: string;
  className?: string;
  content?: string;
  submittedAt: string;
  notes?: string;
  status: 'submitted' | 'graded';
  grade?: string;
  marksAwarded?: number;
  feedback?: string;
}

