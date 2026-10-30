import React, { useState } from 'react';
import { Invoice, Payment } from '../../types';
import { recordPayment } from '../../services/dataService';
import { X, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

interface RecordPaymentModalProps {
  invoices: Invoice[];
  onClose: () => void;
  onPaymentSuccess: (payment: Payment) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  invoices,
  onClose,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default to first unpaid or partial invoice
  const unpaidInvoices = invoices.filter((i) => i.status !== 'paid');
  const targetInvoice = unpaidInvoices[0] || invoices[0];

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(targetInvoice ? targetInvoice.id : '');
  const currentInvoice = invoices.find((i) => i.id === selectedInvoiceId) || targetInvoice;

  const [amount, setAmount] = useState<number>(currentInvoice ? currentInvoice.balance || currentInvoice.netAmount : 14500);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Cheque' | 'Online'>('Cash');
  const [recordedBy, setRecordedBy] = useState<string>('Accounts Officer Mr. Noman');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInvoice) {
      setError('Please select a valid invoice.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payment = await recordPayment({
        invoiceId: currentInvoice.id,
        invoiceNo: currentInvoice.invoiceNo,
        studentId: currentInvoice.studentId,
        studentName: currentInvoice.studentName,
        admissionNo: currentInvoice.admissionNo,
        amount: Number(amount),
        paymentMethod,
        receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        recordedBy,
      });

      onPaymentSuccess(payment);
      onClose();
    } catch (err: any) {
      console.error('Error saving payment:', err);
      setError('Failed to record payment in Firestore. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Collect Fee &amp; Issue Receipt
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Student Invoice *
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => {
                setSelectedInvoiceId(e.target.value);
                const inv = invoices.find((i) => i.id === e.target.value);
                if (inv) setAmount(inv.balance || inv.netAmount);
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.studentName} ({inv.admissionNo}) - {inv.month} {inv.year} [Due: PKR {inv.balance.toLocaleString()}]
                </option>
              ))}
            </select>
          </div>

          {currentInvoice && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="text-slate-500">
                Class: <span className="font-bold text-slate-800">{currentInvoice.className} - {currentInvoice.sectionName}</span>
              </p>
              <p className="text-slate-500">
                Invoice Total: <span className="font-bold text-slate-800">PKR {currentInvoice.netAmount.toLocaleString()}</span>
              </p>
              <p className="text-emerald-700 font-semibold">
                Current Outstanding Balance: PKR {currentInvoice.balance.toLocaleString()}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Amount (PKR) *
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
            >
              <option value="Cash">Cash at Counter</option>
              <option value="Bank Transfer">Bank Transfer (HBL / Meezan Bank)</option>
              <option value="Online">Online Portal / 1Link</option>
              <option value="Cheque">Pay Order / Bank Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recorded By
            </label>
            <input
              type="text"
              value={recordedBy}
              onChange={(e) => setRecordedBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Processing Receipt...' : 'Record Payment & Generate Receipt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
