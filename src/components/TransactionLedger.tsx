import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  Copy, 
  Check, 
  Printer, 
  X,
  CreditCard,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { TransactionRecord, Language } from '../types/bkash';

interface TransactionLedgerProps {
  transactions: TransactionRecord[];
  merchantNumber: string;
  lang: Language;
  onRefund: (txId: string) => void;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  merchantNumber,
  lang,
  onRefund,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = transactions.filter((tx) => {
    const q = searchTerm.toLowerCase();
    return (
      tx.trxId.toLowerCase().includes(q) ||
      tx.customerNumber.includes(q) ||
      tx.invoiceNumber.toLowerCase().includes(q) ||
      tx.reference.toLowerCase().includes(q)
    );
  });

  const totalCollected = transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter((t) => t.status === 'Refunded')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppShare = (tx: TransactionRecord) => {
    const origin = window.location.origin;
    const paymentLink = `${origin}?tab=selfcare&billId=${tx.invoiceNumber}`;
    
    const message = lang === 'bn' 
      ? `প্রিয় গ্রাহক, বিল আইডি: ${tx.invoiceNumber} এর জন্য আপনার ইন্টারনেট বিলের বর্তমান স্ট্যাটাস: ${tx.status}। মোট পরিমাণ: ৳ ${tx.amount}। আপনার লাইনটি সচল রাখতে এখনই পে করুন: ${paymentLink}`
      : `Dear Customer, your internet bill for Bill ID: ${tx.invoiceNumber} is ${tx.status}. Total: ৳ ${tx.amount}. Pay now to keep your line active: ${paymentLink}`;

    const whatsappUrl = `https://wa.me/${tx.customerNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExportCSV = () => {
    const headers = 'Transaction ID,Payment ID,Merchant Number,Customer Number,Amount (BDT),Invoice,Status,Timestamp\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.trxId}","${t.paymentId}","${t.merchantNumber}","${t.customerNumber}","${t.amount}","${t.invoiceNumber}","${t.status}","${t.timestamp}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bkash_transactions_${merchantNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">
            {lang === 'bn' ? 'মোট পেমেন্ট সংগ্রহ (Completed)' : 'Total Received'}
          </span>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            ৳ {totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
            {transactions.filter((t) => t.status === 'Completed').length} {lang === 'bn' ? 'টি সফল লেনদেন' : 'successful txns'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">
            {lang === 'bn' ? 'মার্চেন্ট ওয়ালেট নম্বর' : 'Merchant Wallet'}
          </span>
          <div className="text-xl font-bold text-pink-400 font-mono mt-1">
            {merchantNumber}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            {lang === 'bn' ? 'বিকাশ রেজিস্টার্ড মার্চেন্ট' : 'Active bKash Merchant'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">
            {lang === 'bn' ? 'রিফান্ডকৃত মোট টাকা' : 'Refunded Amount'}
          </span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
            ৳ {totalRefunded.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-300/80 font-medium mt-1 inline-block">
            {transactions.filter((t) => t.status === 'Refunded').length} {lang === 'bn' ? 'টি রিফান্ড' : 'refunded'}
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-white text-base">
              {lang === 'bn' ? 'মার্চেন্ট লেনদেন খতিয়ান (Transaction Ledger)' : 'Merchant Transaction Ledger'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'TrxID বা নম্বর খুঁজুন...' : 'Search TrxID or phone...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-pink-500 outline-none"
              />
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">TrxID / PaymentID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Invoice / Ref</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    {lang === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions recorded yet'}
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-semibold">
                      <div className="text-white flex items-center gap-1.5">
                        <span className="text-pink-400">{tx.trxId}</span>
                        <button
                          onClick={() => handleCopy(tx.trxId, tx.trxId)}
                          className="text-slate-500 hover:text-slate-300"
                          title="Copy TrxID"
                        >
                          {copiedId === tx.trxId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{tx.paymentId}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-200">
                      {tx.customerNumber}
                    </td>

                    <td className="py-3 px-3 font-bold text-white">
                      ৳ {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <div className="text-slate-200 font-mono text-[11px]">{tx.invoiceNumber}</div>
                      <div className="text-[10px] text-slate-500">{tx.reference}</div>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      {tx.status === 'Completed' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Completed
                        </span>
                      ) : tx.status === 'Refunded' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Refunded
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {tx.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-[11px] text-slate-400 font-sans">
                      {tx.timestamp}
                    </td>

                    <td className="py-3 px-3 text-right space-x-1 font-sans flex items-center justify-end">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition"
                      >
                        {lang === 'bn' ? 'রশিদ' : 'Receipt'}
                      </button>

                      <button
                        onClick={() => handleWhatsAppShare(tx)}
                        className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition group relative"
                        title={lang === 'bn' ? 'হোয়াটসঅ্যাপে শেয়ার করুন' : 'Share via WhatsApp'}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                          {lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}
                        </span>
                      </button>

                      {tx.status === 'Completed' && (
                        <button
                          onClick={() => onRefund(tx.id)}
                          className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] transition"
                        >
                          {lang === 'bn' ? 'রিফান্ড' : 'Refund'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-slate-800 relative space-y-4">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-3 border-b border-slate-200">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#e2136e] text-white flex items-center justify-center font-black text-2xl shadow-md mb-2">
                ব
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">bKash Payment Receipt</h3>
              <p className="text-xs text-slate-500">Official Merchant Transaction Confirmation</p>
            </div>

            {/* Amount */}
            <div className="text-center py-2 bg-pink-50 rounded-xl border border-pink-100">
              <span className="text-xs text-[#e2136e] font-semibold uppercase">Amount Paid</span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                ৳ {selectedTx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} BDT
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaction ID (TrxID)</span>
                <span className="font-mono font-bold text-pink-600">{selectedTx.trxId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Merchant Account</span>
                <span className="font-mono font-semibold">{selectedTx.merchantNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Customer Number</span>
                <span className="font-mono">{selectedTx.customerNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Invoice Number</span>
                <span className="font-mono">{selectedTx.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Date & Time</span>
                <span className="text-slate-600">{selectedTx.timestamp}</span>
              </div>
            </div>

            {/* Print & Close */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => window.print()}
                className="py-2 px-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setSelectedTx(null)}
                className="py-2 px-3 rounded-lg bg-[#e2136e] text-white text-xs font-bold hover:bg-[#c2105e]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
