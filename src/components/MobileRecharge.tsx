import React, { useState } from 'react';
import { Smartphone, Zap, CheckCircle2, History, CreditCard, PhoneCall, Info } from 'lucide-react';
import { Language, TransactionRecord } from '../types/bkash';
import { RECHARGE_OPERATORS } from '../data/bkashData';
import { SimulatorModal } from './SimulatorModal';

interface MobileRechargeProps {
  merchantNumber: string;
  lang: Language;
  onPaymentSuccess: (transaction: TransactionRecord) => void;
}

export const MobileRecharge: React.FC<MobileRechargeProps> = ({
  merchantNumber,
  lang,
  onPaymentSuccess,
}) => {
  const [operator, setOperator] = useState(RECHARGE_OPERATORS.length > 0 ? RECHARGE_OPERATORS[0] : { id: 'default', name: 'Operator', code: '00', color: 'bg-slate-500' });
  const [targetNumber, setTargetNumber] = useState('');
  const [amount, setAmount] = useState(0);
  const [rechargeType, setRechargeType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const presets = [20, 50, 100, 199, 499, 999];

  const handleRecharge = () => {
    if (!targetNumber || targetNumber.length !== 11) return;
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
      <div className="p-8 rounded-[32px] bg-gradient-to-br from-slate-900 to-rose-950 border border-slate-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="w-24 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shrink-0 shadow-xl shadow-rose-950/50">
          <img 
            src="/assets/aistudio/bkash-logo-horizontal-mobile-banking-app-icon-emblem-transparent-background-free-png_c5fbc9f1.png" 
            alt="bKash" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-6 h-6 text-rose-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">
              {lang === 'bn' ? 'মোবাইল রিচার্জ সিমুলেটর' : 'Mobile Recharge Simulator'}
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl font-medium">
            {lang === 'bn' 
              ? 'বিকাশ এপিআই এর মাধ্যমে কাস্টমারের সিমে অটোমেটিক রিচার্জ পাঠানোর ফ্লো টেস্ট করুন।' 
              : 'Simulate automated mobile airtime recharge via bKash API integration.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharge Form */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{lang === 'bn' ? 'রিচার্জের তথ্য' : 'Recharge Details'}</span>
            </h3>

            <div className="space-y-6">
              {/* Operator Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  {lang === 'bn' ? 'অপারেটর সিলেক্ট করুন' : 'Select Mobile Operator'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {RECHARGE_OPERATORS.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setOperator(op)}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                        operator.id === op.id
                          ? 'bg-rose-500/10 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${op.color}`} />
                      <span>{op.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number and Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                  </label>
                  <div className="relative">
                    <PhoneCall className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      maxLength={11}
                      value={targetNumber}
                      onChange={(e) => setTargetNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    {lang === 'bn' ? 'অ্যাকাউন্ট টাইপ' : 'Account Type'}
                  </label>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setRechargeType('prepaid')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        rechargeType === 'prepaid' ? 'bg-slate-800 text-white' : 'text-slate-500'
                      }`}
                    >
                      Prepaid
                    </button>
                    <button
                      onClick={() => setRechargeType('postpaid')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        rechargeType === 'postpaid' ? 'bg-slate-800 text-white' : 'text-slate-500'
                      }`}
                    >
                      Postpaid
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount and Presets */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {lang === 'bn' ? 'রিচার্জের পরিমাণ' : 'Recharge Amount'}
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-base font-bold focus:ring-2 focus:ring-rose-500 outline-none transition"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => setAmount(p)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition ${
                        amount === p
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'
                      }`}
                    >
                      ৳{p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRecharge}
                className="w-full py-4 rounded-xl bg-[#e2136e] hover:bg-[#c2105e] text-white font-bold text-base shadow-lg shadow-pink-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 group"
              >
                <div className="bg-white rounded p-0.5 text-[#e2136e] group-hover:animate-pulse transition">
                  <Zap className="w-5 h-5" />
                </div>
                <span>{lang === 'bn' ? 'রিচার্জ নিশ্চিত করুন' : 'Recharge Now'}</span>
              </button>
            </div>
          </div>

          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-bold">
                {lang === 'bn' ? 'রিচার্জ সফল হয়েছে! কাস্টমার মেসেজ পেয়েছে।' : 'Recharge successful! Customer has received the balance.'}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Status */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-400" />
              <span>{lang === 'bn' ? 'এপিআই ইন্টিগ্রেশন নোট' : 'API Integration Notes'}</span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-xs leading-relaxed">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-400">Mobile Recharge API is typically a specialized product and requires separate approval from bKash business team.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs leading-relaxed">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-400">The flow uses <strong>Instant Payment Confirmation</strong> to trigger the telco's recharge command.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs leading-relaxed">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-400">Ensure your system handles <strong>Retry Logic</strong> in case the telco server is temporarily down.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 text-center">
            <Smartphone className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <div className="text-xs font-bold text-slate-300">Ready for Live API?</div>
            <p className="text-[10px] text-slate-500 mt-1">
              Contact bKash Merchant support to enable "Utility & Recharge" specific API end-points.
            </p>
          </div>
        </div>
      </div>

      <SimulatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        merchantNumber={merchantNumber}
        amount={amount}
        invoiceNumber={`REC-${operator.code}-${Date.now().toString().slice(-4)}`}
        reference={`Recharge: ${targetNumber}`}
        lang={lang}
        onPaymentSuccess={handleSuccess}
      />
    </div>
  );
};
