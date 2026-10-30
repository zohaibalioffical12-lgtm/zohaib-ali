import React from 'react';
import { Invoice, Payment } from '../../types';
import { Printer, X, CheckCircle, Receipt } from 'lucide-react';

interface FeeReceiptModalProps {
  invoice: Invoice;
  payment?: Payment;
  onClose: () => void;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  invoice,
  payment,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const receiptNo = payment?.receiptNo || `RCP-2026-${invoice.invoiceNo.slice(-4)}`;
  const paymentDate = payment?.date || new Date().toISOString().split('T')[0];
  const paymentMethod = payment?.paymentMethod || 'Cash / Bank Transfer';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Modal Controls Bar */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Fee Payment Voucher
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
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
        <div className="p-8 bg-white text-slate-900 print:p-0">
          {/* Header */}
          <div className="border-b-2 border-emerald-900 pb-4 mb-5 text-center">
            <div className="text-amber-600 font-serif text-xs mb-0.5 select-none">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase">
              THE MUSLIM SCHOOL &amp; COLLEGE
            </h3>
            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Accounts &amp; Finance Directorate • Official Receipt
            </p>
            <p className="text-[10px] text-slate-500">
              Main Road, Gujrat Near Ground, Mardan, Pakistan • Ph: +92 313 9375355
            </p>
          </div>

          {/* Receipt Info Bar */}
          <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b border-slate-200">
            <div>
              <span className="text-slate-500 font-medium">Receipt No: </span>
              <span className="font-mono font-bold text-slate-900">{receiptNo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Date: </span>
              <span className="font-semibold text-slate-900">{paymentDate}</span>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs mb-5 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-900">{invoice.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Admission No:</span>
              <span className="font-mono font-semibold text-slate-800">{invoice.admissionNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Class &amp; Section:</span>
              <span className="font-semibold text-slate-800">{invoice.className} - {invoice.sectionName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Billing Period:</span>
              <span className="font-semibold text-emerald-800">{invoice.month} {invoice.year}</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <table className="w-full text-xs mb-5 border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-3 py-2 text-left">Fee Head</th>
                <th className="px-3 py-2 text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-3 py-2 text-slate-800">Monthly Tuition Fee</td>
                <td className="px-3 py-2 text-right font-medium">{invoice.tuitionFee.toLocaleString()}</td>
              </tr>
              {invoice.otherFee > 0 && (
                <tr>
                  <td className="px-3 py-2 text-slate-800">Science Lab &amp; Computer Charges</td>
                  <td className="px-3 py-2 text-right font-medium">{invoice.otherFee.toLocaleString()}</td>
                </tr>
              )}
              {invoice.discount > 0 && (
                <tr className="text-emerald-700">
                  <td className="px-3 py-2">Merit / Quran Concession</td>
                  <td className="px-3 py-2 text-right">- {invoice.discount.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
              <tr>
                <td className="px-3 py-2 text-slate-900">Total Net Payable</td>
                <td className="px-3 py-2 text-right text-slate-900">PKR {invoice.netAmount.toLocaleString()}</td>
              </tr>
              <tr className="text-emerald-900 bg-emerald-50">
                <td className="px-3 py-2">Amount Paid (Receipt)</td>
                <td className="px-3 py-2 text-right font-extrabold text-sm">
                  PKR {(invoice.paidAmount || invoice.netAmount).toLocaleString()}
                </td>
              </tr>
              {invoice.balance > 0 && (
                <tr className="text-rose-700">
                  <td className="px-3 py-2">Remaining Outstanding Balance</td>
                  <td className="px-3 py-2 text-right font-bold">PKR {invoice.balance.toLocaleString()}</td>
                </tr>
              )}
            </tfoot>
          </table>

          {/* Payment Method & Verification */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 mb-8">
            <div>
              <span className="text-slate-500">Payment Mode: </span>
              <span className="font-bold text-slate-900">{paymentMethod}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>PAID &amp; VERIFIED</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs text-slate-600 pt-4 border-t border-slate-200">
            <div>
              <div className="w-28 border-b border-slate-400 mx-auto mb-1" />
              <p className="font-medium text-slate-800">Depositor Signature</p>
            </div>
            <div>
              <div className="w-28 border-b border-slate-400 mx-auto mb-1" />
              <p className="font-bold text-slate-900">Accounts Officer</p>
              <p className="text-[10px] text-slate-400">The Muslim School &amp; College, Mardan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
