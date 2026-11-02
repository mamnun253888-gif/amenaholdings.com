import React, { useState } from 'react';
import { Wifi, Search, CreditCard, CheckCircle2, History, ArrowRight, User, Hash } from 'lucide-react';
import { Language, TransactionRecord } from '../types/bkash';
import { ISP_LIST } from '../data/bkashData';
import { SimulatorModal } from './SimulatorModal';

interface IspBillingPortalProps {
  merchantNumber: string;
  lang: Language;
  onPaymentSuccess: (transaction: TransactionRecord) => void;
}

export const IspBillingPortal: React.FC<IspBillingPortalProps> = ({
  merchantNumber,
  lang,
  onPaymentSuccess,
}) => {
  const [selectedIsp, setSelectedIsp] = useState(ISP_LIST.length > 0 ? ISP_LIST[0] : { id: 'default', name: 'ISP', billerCode: '0000', category: 'Internet' });
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayBill = () => {
    if (!customerId) return;
    setIsModalOpen(true);
  };

  const handleSuccess = (tx: TransactionRecord) => {
    onPaymentSuccess(tx);
    setIsModalOpen(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Hero Header */}
      <div className="p-8 rounded-[32px] bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="w-24 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shrink-0 shadow-xl shadow-indigo-950/50">
          <img 
            src="/assets/aistudio/bkash-logo-horizontal-mobile-banking-app-icon-emblem-transparent-background-free-png_c5fbc9f1.png" 
            alt="bKash" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Wifi className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">
              {lang === 'bn' ? 'আইএসপি বিল পেমেন্ট পোর্টাল' : 'ISP Bill Payment Portal'}
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl font-medium">
            {lang === 'bn' 
              ? 'আপনার ইন্টারনাল আইএসপি বিলিং সিস্টেমে বিকাশ অটোমেটেড পেমেন্ট ইন্টিগ্রেশন টেস্ট করুন।' 
              : 'Simulate automated ISP bill payments for your internal billing system using bKash PGW.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-pink-400" />
              <span>{lang === 'bn' ? 'বিলের তথ্য দিন' : 'Enter Billing Details'}</span>
            </h3>

            <div className="space-y-4">
              {/* ISP Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  {lang === 'bn' ? 'আইএসপি সিলেক্ট করুন' : 'Select ISP / Biller'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ISP_LIST.map((isp) => (
                    <button
                      key={isp.id}
                      onClick={() => setSelectedIsp(isp)}
                      className={`p-3 rounded-xl border text-xs font-medium transition-all text-center flex flex-col items-center gap-1 ${
                        selectedIsp.id === isp.id
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold">{isp.name}</span>
                      <span className="text-[10px] opacity-60">Code: {isp.billerCode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    {lang === 'bn' ? 'কাস্টমার আইডি' : 'Customer / User ID'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      placeholder="e.g. USER-123"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    {lang === 'bn' ? 'টাকার পরিমাণ' : 'Billing Amount (BDT)'}
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayBill}
                className="w-full py-4 rounded-xl bg-[#e2136e] hover:bg-[#c2105e] text-white font-bold text-base shadow-lg shadow-pink-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 group"
              >
                <div className="bg-white rounded p-0.5 text-[#e2136e] group-hover:rotate-12 transition">
                  <Wifi className="w-5 h-5" />
                </div>
                <span>{lang === 'bn' ? 'বিকাশে বিল দিন' : 'Pay ISP Bill via bKash'}</span>
                <span className="bg-pink-800/40 px-2 py-0.5 rounded text-xs font-normal">৳ {amount}</span>
              </button>
            </div>
          </div>

          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-bold">
                {lang === 'bn' ? 'বিল সফলভাবে প্রদান করা হয়েছে! আপনার ইন্টারনেট রিনিউ হয়েছে।' : 'Bill paid successfully! Your internet has been renewed.'}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'bn' ? 'অটো-আপডেট কিভাবে কাজ করে?' : 'How Auto-Update Works?'}</span>
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{lang === 'bn' ? 'পেমেন্ট নিশ্চিতকরণ' : 'Payment Confirmation'}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Customer pays using bKash. Once successful, bKash sends an Instant Payment Notification (IPN) to your server.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{lang === 'bn' ? 'সার্ভার ভ্যালিডেশন' : 'Server Validation'}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Your backend validates the IPN and confirms the TrxID matches the amount and customer ID.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{lang === 'bn' ? 'অটো-রিনিউয়াল' : 'Instant Renewal'}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Your system automatically updates the customer's expiry date and enables the internet line without manual work.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <Wifi className="w-10 h-10 text-indigo-500/40 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">Testing Tip</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Use a unique <strong>Customer ID</strong> for each test to see how your backend would handle different account updates.
            </p>
          </div>
        </div>
      </div>

      <SimulatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        merchantNumber={merchantNumber}
        amount={amount}
        invoiceNumber={`BILL-${selectedIsp.billerCode}-${Date.now().toString().slice(-4)}`}
        reference={`ISP Bill: ${customerId}`}
        lang={lang}
        onPaymentSuccess={handleSuccess}
      />
    </div>
  );
};
