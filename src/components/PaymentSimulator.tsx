import React, { useState } from 'react';
import { ShoppingCart, Play, CheckCircle2, AlertTriangle, RefreshCw, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';
import { TransactionRecord, Language, Environment } from '../types/bkash';
import { SimulatorModal } from './SimulatorModal';

interface PaymentSimulatorProps {
  merchantNumber: string;
  environment: Environment;
  lang: Language;
  onPaymentSuccess: (transaction: TransactionRecord) => void;
}

export const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({
  merchantNumber,
  environment,
  lang,
  onPaymentSuccess,
}) => {
  const [amount, setAmount] = useState<number>(1250);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-2026-8921');
  const [reference, setReference] = useState<string>('E-commerce Checkout');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const presets = [100, 500, 1250, 2500, 5000];

  const handleGenerateInvoice = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setInvoiceNumber(`INV-2026-${randomNum}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Intro banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {lang === 'bn' ? 'লাইভ গেটওয়ে হাব সক্রিয়' : 'Live Gateway Hub Active'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' 
              ? `মার্চেন্ট ${merchantNumber} এর বিকাশ পেমেন্ট প্রোডাকশন পোর্টাল` 
              : `bKash Payment Production Portal for ${merchantNumber}`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {lang === 'bn'
              ? 'আপনার ওয়েবসাইট বা মোবাইল অ্যাপে একজন কাস্টমার ঠিক যেভাবে বিকাশ পেমেন্ট করবে, এখানে হুবহু সেই অভিজ্ঞতা টেস্ট করুন।'
              : 'Test the exact checkout journey your end customers will experience when paying online to your bKash merchant.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <Smartphone className="w-4 h-4 text-pink-400" />
          <span className="text-slate-300 font-mono font-bold">{merchantNumber}</span>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Checkout Setup Form */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-pink-400" />
              <span>{lang === 'bn' ? 'অর্ডার ও পেমেন্ট কনফিগারেশন' : 'Order & Payment Parameters'}</span>
            </h3>
            <button
              onClick={handleGenerateInvoice}
              className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{lang === 'bn' ? 'নতুন ইনভয়েস' : 'New Invoice'}</span>
            </button>
          </div>

          {/* Amount Input & Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              {lang === 'bn' ? 'পেমেন্ট এর পরিমাণ (টাকা / BDT)' : 'Payment Amount (BDT)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-pink-400 font-mono">৳</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-base font-bold focus:ring-2 focus:ring-[#e2136e] outline-none"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs text-slate-400 py-1">{lang === 'bn' ? 'কুইক অ্যামাউন্ট:' : 'Quick Select:'}</span>
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition ${
                    amount === p
                      ? 'bg-pink-600/20 text-pink-300 border-pink-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ৳ {p}
                </button>
              ))}
            </div>
          </div>

          {/* Invoice Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {lang === 'bn' ? 'মার্চেন্ট ইনভয়েস নম্বর (merchantInvoiceNumber)' : 'Merchant Invoice Number'}
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-[#e2136e] outline-none"
            />
          </div>

          {/* Reference */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {lang === 'bn' ? 'রেফারেন্স / পণ্যের বিবরণ (payerReference)' : 'Payer Reference / Order Memo'}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#e2136e] outline-none"
            />
          </div>

          {/* Trigger bKash Checkout Button */}
          <div className="pt-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#e2136e] hover:bg-[#c2105e] text-white font-bold text-base shadow-lg shadow-pink-900/30 flex items-center justify-center gap-3 transition group active:scale-[0.99]"
            >
              <div className="w-6 h-6 rounded bg-white text-[#e2136e] flex items-center justify-center font-black text-sm">
                ব
              </div>
              <span>{lang === 'bn' ? 'বিকাশ দিয়ে পেমেন্ট করুন' : 'Pay With bKash'}</span>
              <span className="font-mono bg-pink-800/60 px-2 py-0.5 rounded text-xs font-normal">
                ৳ {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: API Flow & Technical Blueprint */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-pink-400" />
            <span>{lang === 'bn' ? 'পেমেন্ট গেটওয়ে ফ্লো আর্কিটেকচার' : 'PGW Flow Architecture'}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2 font-semibold text-pink-400 mb-1">
                <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[10px]">1</span>
                <span>Grant Token API</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                সার্ভার থেকে bKash Tokenized API-তে <code className="text-pink-300">/token/grant</code> কল করে সাময়িক <code className="text-slate-300">id_token</code> তৈরি করা হয়।
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2 font-semibold text-pink-400 mb-1">
                <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[10px]">2</span>
                <span>Create Payment API</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                টাকা ও ইনভয়েস দিয়ে <code className="text-pink-300">/create</code> কল হয়। বিকাশ রেসপন্সে <code className="text-slate-300">paymentID</code> এবং <code className="text-slate-300">bkashURL</code> প্রদান করে।
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2 font-semibold text-pink-400 mb-1">
                <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[10px]">3</span>
                <span>Customer Verification</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                কাস্টমার বিকাশ পপআপে নম্বর দেয়, মোবাইলে আসা ৬ ডিজিট ওটিপি (OTP) ও ৫ ডিজিট পিন (PIN) দিয়ে নিশ্চিত করে।
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2 font-semibold text-pink-400 mb-1">
                <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[10px]">4</span>
                <span>Execute Payment API</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                সার্ভার থেকে <code className="text-pink-300">/execute</code> কল সম্পন্ন হলে চূড়ান্ত <code className="text-emerald-400">trxID</code> পাওয়া যায় এবং টাকা মার্চেন্ট নম্বরে জমা হয়।
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-white">💡 স্যান্ডবক্স টেস্ট ইনপুট:</span>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span>নম্বর: <b className="text-slate-200">01712345678</b></span>
              <span>OTP: <b className="text-slate-200">123456</b></span>
              <span>PIN: <b className="text-slate-200">12121</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Simulator Modal */}
      <SimulatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        merchantNumber={merchantNumber}
        amount={amount}
        invoiceNumber={invoiceNumber}
        reference={reference}
        lang={lang}
        onPaymentSuccess={onPaymentSuccess}
      />
    </div>
  );
};
