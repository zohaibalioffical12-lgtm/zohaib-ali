import React, { useState } from 'react';
import { Student, Invoice, Examination, ExamMark } from '../../types';
import {
  Users,
  CheckCircle,
  Receipt,
  Award,
  DollarSign,
  Printer,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface ParentDashboardProps {
  students: Student[];
  invoices: Invoice[];
  examinations: Examination[];
  examMarks: ExamMark[];
  onOpenReportCard: (student: Student, exam: Examination) => void;
  onOpenFeeReceipt: (invoice: Invoice) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  students,
  invoices,
  examinations,
  examMarks,
  onOpenReportCard,
  onOpenFeeReceipt,
}) => {
  // Let parent toggle between enrolled children
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || 'std_01'
  );
  const currentChild = students.find((s) => s.id === selectedStudentId) || students[0];

  const childInvoices = invoices.filter((i) => i.studentId === currentChild?.id);
  const activeExam = examinations[0];

  return (
    <div className="space-y-6">
      {/* Parent Header & Child Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Parent &amp; Guardian Portal
            </span>
            <span className="text-xs text-emerald-300 font-semibold">• Direct Access</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Ward Academic &amp; Financial Ledger
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time verification of your child&apos;s daily attendance, academic scores, and fee status.
          </p>
        </div>

        {/* Children Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/10">
          <span className="text-xs text-slate-400 px-2 font-medium">Select Child:</span>
          {students.slice(0, 2).map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedStudentId(child.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStudentId === child.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              <span>{child.fullName.split(' ')[0]}</span>
              <span className="text-[10px] opacity-80 ml-1">({child.className.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {currentChild && (
        <>
          {/* Child Snapshot Details */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Ward</span>
              <p className="text-lg font-black text-slate-900 mt-1">{currentChild.fullName}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{currentChild.admissionNo}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class &amp; Wing</span>
              <p className="text-lg font-black text-emerald-800 mt-1">{currentChild.className}</p>
              <p className="text-xs text-slate-500 uppercase font-semibold">
                {currentChild.genderSection === 'boys' ? 'Boys Wing (Campus 1)' : 'Girls Wing (Campus 2)'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Attendance</span>
              <p className="text-lg font-black text-emerald-700 mt-1 flex items-center gap-1.5">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Present</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Recorded: 07:50 AM</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Card</span>
              <button
                onClick={() => activeExam && onOpenReportCard(currentChild, activeExam)}
                className="mt-2 w-full py-2 px-3 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span>View Term Report</span>
              </button>
            </div>
          </div>

          {/* Child Fee Vouchers & Receipts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Fee Ledgers &amp; Payment Receipts
                </h3>
                <p className="text-xs text-slate-500">Official verified receipts for school tuition and laboratory fees</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Invoice No</th>
                    <th className="px-4 py-3">Billing Month</th>
                    <th className="px-4 py-3 text-right">Net Amount</th>
                    <th className="px-4 py-3 text-right">Paid Amount</th>
                    <th className="px-4 py-3 text-right">Balance Due</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {childInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">{inv.invoiceNo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {inv.month} {inv.year}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800">
                        PKR {inv.netAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">
                        PKR {inv.paidAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-rose-600">
                        PKR {inv.balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onOpenFeeReceipt(inv)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
                        >
                          Print Voucher
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
