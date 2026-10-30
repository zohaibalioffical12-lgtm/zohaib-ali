import React, { useState } from 'react';
import { Invoice, Payment, FeeStructure } from '../../types';
import {
  DollarSign,
  Receipt,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Printer,
  Plus,
} from 'lucide-react';

interface AccountantDashboardProps {
  invoices: Invoice[];
  payments: Payment[];
  feeStructures: FeeStructure[];
  onOpenRecordPayment: () => void;
  onOpenReceipt: (invoice: Invoice) => void;
}

export const AccountantDashboard: React.FC<AccountantDashboardProps> = ({
  invoices,
  payments,
  feeStructures,
  onOpenRecordPayment,
  onOpenReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');

  const safeInvoices = invoices || [];
  const totalBilled = safeInvoices.reduce((sum, i) => sum + (i?.netAmount || 0), 0);
  const totalCollected = safeInvoices.reduce((sum, i) => sum + (i?.paidAmount || 0), 0);
  const totalOutstanding = safeInvoices.reduce((sum, i) => sum + (i?.balance || 0), 0);

  const filteredInvoices = safeInvoices.filter((inv) => {
    if (!inv) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    const studentName = (inv.studentName || '').toLowerCase();
    const admissionNo = (inv.admissionNo || '').toLowerCase();
    const invoiceNo = (inv.invoiceNo || '').toLowerCase();
    const className = (inv.className || '').toLowerCase();

    const matchesSearch =
      !term ||
      studentName.includes(term) ||
      admissionNo.includes(term) ||
      invoiceNo.includes(term) ||
      className.includes(term);
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Accountant Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Finance &amp; Accounts Portal
            </span>
            <span className="text-xs text-teal-300 font-semibold">• Officer Desk</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Fee Billing &amp; Collection Register</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage tuition fees, science lab charges, concessions, and issue official print vouchers.
          </p>
        </div>

        <button
          onClick={onOpenRecordPayment}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-900/30 transition-all cursor-pointer shrink-0"
        >
          <DollarSign className="w-4 h-4" />
          <span>Collect Fee &amp; Issue Receipt</span>
        </button>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Billed Revenue</span>
          <p className="text-2xl font-black text-slate-900 mt-1">PKR {totalBilled.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">Academic Session 2026-2027</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fees Collected</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">PKR {totalCollected.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-0.5">
            {totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : 0}% Realized
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Receivables</span>
          <p className="text-2xl font-black text-rose-600 mt-1">PKR {totalOutstanding.toLocaleString()}</p>
          <p className="text-xs text-rose-500 font-semibold mt-0.5">Defaulter Notices Issued</p>
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student, admission no, invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {(['all', 'paid', 'partial', 'unpaid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Invoice No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Class &amp; Wing</th>
                <th className="px-4 py-3">Billing Month</th>
                <th className="px-4 py-3 text-right">Net Payable</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{inv.invoiceNo || 'INV-N/A'}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{inv.studentName || 'Student'}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{inv.admissionNo || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {inv.className || 'General'} ({inv.sectionName || 'All'})
                  </td>
                  <td className="px-4 py-3 text-slate-600">{inv.month || ''} {inv.year || ''}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">
                    PKR {(inv.netAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-700">
                    PKR {(inv.paidAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-rose-600">
                    PKR {(inv.balance || 0).toLocaleString()}
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
                      onClick={() => onOpenReceipt(inv)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Print Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
