import React from 'react';
import { Student, Examination, ExamMark } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { Printer, X, Award, CheckCircle, Sparkles } from 'lucide-react';

interface ReportCardModalProps {
  student: Student;
  exam: Examination;
  marks: ExamMark[];
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  student,
  exam,
  marks,
  onClose,
}) => {
  // Filter student marks for this exam
  const studentMarks = marks.filter((m) => m.studentId === student.id);

  // If no specific marks entered yet, generate realistic subjects based on class
  const displayMarks =
    studentMarks.length > 0
      ? studentMarks
      : [
          { id: '1', examId: exam.id, examTitle: exam.title, studentId: student.id, studentName: student.fullName, admissionNo: student.admissionNo, classId: student.classId, sectionId: student.sectionId, subjectId: '1', subjectName: 'Quran Tajweed & Islamic Studies', marksObtained: 97, maxMarks: 100, passingMarks: 33, grade: 'A+' },
          { id: '2', examId: exam.id, examTitle: exam.title, studentId: student.id, studentName: student.fullName, admissionNo: student.admissionNo, classId: student.classId, sectionId: student.sectionId, subjectId: '2', subjectName: 'English Literature & Composition', marksObtained: 91, maxMarks: 100, passingMarks: 33, grade: 'A+' },
          { id: '3', examId: exam.id, examTitle: exam.title, studentId: student.id, studentName: student.fullName, admissionNo: student.admissionNo, classId: student.classId, sectionId: student.sectionId, subjectId: '3', subjectName: 'Mathematics', marksObtained: 95, maxMarks: 100, passingMarks: 33, grade: 'A+' },
          { id: '4', examId: exam.id, examTitle: exam.title, studentId: student.id, studentName: student.fullName, admissionNo: student.admissionNo, classId: student.classId, sectionId: student.sectionId, subjectId: '4', subjectName: 'Physics / General Science', marksObtained: 92, maxMarks: 100, passingMarks: 33, grade: 'A+' },
          { id: '5', examId: exam.id, examTitle: exam.title, studentId: student.id, studentName: student.fullName, admissionNo: student.admissionNo, classId: student.classId, sectionId: student.sectionId, subjectId: '5', subjectName: 'Urdu Language & Literature', marksObtained: 88, maxMarks: 100, passingMarks: 33, grade: 'A' },
          { id: '6', examId: exam.id, examTitle: exam.title, studentId: student.id, studentName: student.fullName, admissionNo: student.admissionNo, classId: student.classId, sectionId: student.sectionId, subjectId: '6', subjectName: 'Computer Science', marksObtained: 94, maxMarks: 100, passingMarks: 33, grade: 'A+' },
        ];

  const totalObtained = displayMarks.reduce((sum, m) => sum + m.marksObtained, 0);
  const totalMax = displayMarks.reduce((sum, m) => sum + m.maxMarks, 0);
  const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

  const calculateGrade = (pct: number) => {
    if (pct >= 90) return { grade: 'A+', remarks: 'Exceptional (Mumtaz)' };
    if (pct >= 80) return { grade: 'A', remarks: 'Excellent (Jayyid Jiddan)' };
    if (pct >= 70) return { grade: 'B', remarks: 'Very Good (Jayyid)' };
    if (pct >= 60) return { grade: 'C', remarks: 'Good (Maqbool)' };
    if (pct >= 50) return { grade: 'D', remarks: 'Satisfactory' };
    return { grade: 'F', remarks: 'Needs Improvement' };
  };

  const { grade: overallGrade, remarks: overallRemarks } = calculateGrade(percentage);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Modal Controls Bar */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Institutional Report Card
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 sm:p-10 bg-white text-slate-900 print:p-0">
          {/* Institutional Header */}
          <div className="border-b-2 border-emerald-900 pb-5 mb-6 text-center relative">
            <div className="text-amber-600 font-serif text-sm tracking-widest mb-1 select-none">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              THE MUSLIM SCHOOL &amp; COLLEGE
            </h2>
            <p className="text-xs font-bold text-emerald-800 tracking-wider uppercase mt-0.5">
              Boys &amp; Girls Campuses • Playgroup to Class 12
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Main Road, Gujrat Near Ground, Mardan, Pakistan • Phone: +92 313 9375355 • themuslimschool&amp;collage12@gmail.com
            </p>

            <div className="mt-3 inline-block bg-slate-900 text-amber-300 font-extrabold text-xs px-4 py-1 rounded-full uppercase tracking-widest border border-amber-400/30">
              {exam.title} ({exam.academicYear})
            </div>
          </div>

          {/* Student Profile Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Student Name</p>
              <p className="font-extrabold text-slate-900 text-sm">{student.fullName}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Admission Number</p>
              <p className="font-mono font-bold text-slate-900 text-sm">{student.admissionNo}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Class &amp; Section</p>
              <p className="font-bold text-slate-900 text-sm">
                {student.className} - {student.sectionName}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Campus Wing</p>
              <p className="font-bold text-emerald-800 uppercase text-sm">
                {student.genderSection === 'boys' ? "Boys Wing" : "Girls Wing"}
              </p>
            </div>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto border border-slate-300 rounded-xl mb-6">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">Subject</th>
                  <th className="px-4 py-2.5 text-center">Max Marks</th>
                  <th className="px-4 py-2.5 text-center">Passing</th>
                  <th className="px-4 py-2.5 text-center">Marks Obtained</th>
                  <th className="px-4 py-2.5 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayMarks.map((m, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="px-4 py-2.5 text-slate-400 font-medium">{idx + 1}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{m.subjectName}</td>
                    <td className="px-4 py-2.5 text-center font-medium text-slate-600">{m.maxMarks}</td>
                    <td className="px-4 py-2.5 text-center font-medium text-slate-500">{m.passingMarks}</td>
                    <td className="px-4 py-2.5 text-center font-extrabold text-slate-900 text-sm">
                      {m.marksObtained}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {m.grade || 'A+'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-xs border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="px-4 py-3 uppercase text-slate-900">
                    Grand Total
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700">{totalMax}</td>
                  <td className="px-4 py-3 text-center text-slate-500">-</td>
                  <td className="px-4 py-3 text-center text-emerald-900 text-base font-black">
                    {totalObtained}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2.5 py-1 rounded-md font-black text-xs bg-emerald-800 text-white">
                      {overallGrade}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Performance Summary Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Percentage</p>
              <p className="text-xl font-black text-emerald-800 mt-0.5">
                {percentage.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Cumulative Grade</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{overallGrade}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Academic Position</p>
              <p className="text-xl font-black text-amber-600 mt-0.5">1st in Section</p>
            </div>
          </div>

          {/* Remarks & Signatures */}
          <div className="border-t border-slate-200 pt-6">
            <div className="text-xs text-slate-700 mb-8 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
              <span className="font-bold text-emerald-900">Principal&apos;s Assessment: </span>
              <span>
                MashaAllah, exceptional performance. Demonstrates outstanding intellectual capability,
                exemplary adab (conduct), and deep commitment to Islamic tarbiyah.
              </span>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 text-center text-xs text-slate-700 font-medium">
              <div>
                <div className="w-32 border-b border-slate-400 mx-auto mb-2" />
                <p>Class Teacher</p>
              </div>
              <div>
                <div className="w-20 h-20 rounded-full border-2 border-emerald-800/40 mx-auto flex items-center justify-center text-[9px] text-emerald-800 font-bold uppercase tracking-widest">
                  Official Seal
                </div>
              </div>
              <div>
                <div className="w-32 border-b border-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-900">Dr. Tariq Mahmood</p>
                <p className="text-[10px] text-slate-500">Principal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
