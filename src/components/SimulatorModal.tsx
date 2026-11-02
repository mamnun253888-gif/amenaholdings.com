import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, ArrowLeft, RotateCcw, Copy, Check, Printer } from 'lucide-react';
import { TransactionRecord, Language } from '../types/bkash';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantNumber: string;
  amount: number;
  invoiceNumber: string;
  reference: string;
  lang: Language;
  onPaymentSuccess: (transaction: TransactionRecord) => void;
}

type CheckoutStep = 'msisdn' | 'otp' | 'pin' | 'processing' | 'success' | 'failed';

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  merchantNumber,
  amount,
  invoiceNumber,
  reference,
  lang,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<CheckoutStep>('msisdn');
  const [customerNumber, setCustomerNumber] = useState('01712345678');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('12121');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(120);
  const [completedTx, setCompletedTx] = useState<TransactionRecord | null>(null);
  const [copiedTrx, setCopiedTrx] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('msisdn');
      setCustomerNumber('01712345678');
      setOtp('123456');
      setPin('12121');
      setErrorMessage('');
      setCountdown(120);
      setCompletedTx(null);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleMsisdnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = customerNumber.trim();
    if (!cleanNum.startsWith('01') || cleanNum.length !== 11) {
      setErrorMessage(lang === 'bn' ? 'সঠিক ১১ ডিজিটের বিকাশ মোবাইল নম্বর দিন' : 'Enter a valid 11-digit bKash number');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage(lang === 'bn' ? 'শর্তাবলী মেনে টিক দিন' : 'Please agree to terms and conditions');
      return;
    }
    setErrorMessage('');
    setStep('otp');
    setCountdown(120);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setErrorMessage(lang === 'bn' ? 'সঠিক ৬ ডিজিটের ওটিপি দিন' : 'Enter valid 6-digit OTP');
      return;
    }
    if (otp === '000000') {
      // Simulate invalid OTP test case
      setErrorMessage(lang === 'bn' ? 'ভুল ওটিপি কোড (Status 2005)' : 'Invalid OTP code (Status 2005)');
      return;
    }
    setErrorMessage('');
    setStep('pin');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 5) {
      setErrorMessage(lang === 'bn' ? 'সঠিক ৫ ডিজিটের পিন নম্বর দিন' : 'Enter 5-digit PIN');
      return;
    }
    if (pin === '00000') {
      // Simulate wrong pin error
      setErrorMessage(lang === 'bn' ? 'ভুল বিকাশ পিন (Status 2006)' : 'Invalid bKash PIN (Status 2006)');
      return;
    }
    if (pin === '99999') {
      // Simulate insufficient balance error
      setErrorMessage(lang === 'bn' ? 'অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই (Status 2008)' : 'Insufficient Balance (Status 2008)');
      return;
    }

    setErrorMessage('');
    setStep('processing');

    setTimeout(() => {
      // Generate authentic bKash TrxID e.g. BLA...
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let randomTrx = 'BLA';
      for (let i = 0; i < 7; i++) {
        randomTrx += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const paymentId = 'TR0011' + Date.now().toString().slice(-8);

      const newTx: TransactionRecord = {
        id: 'tx-' + Date.now(),
        paymentId,
        trxId: randomTrx,
        merchantNumber,
        customerNumber,
        amount,
        currency: 'BDT',
        invoiceNumber,
        reference: reference || 'Online Checkout',
        status: 'Completed',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        environment: 'sandbox',
      };

      setCompletedTx(newTx);
      onPaymentSuccess(newTx);
      setStep('success');
    }, 1800);
  };

  const handleCopyTrx = () => {
    if (completedTx) {
      navigator.clipboard.writeText(completedTx.trxId);
      setCopiedTrx(true);
      setTimeout(() => setCopiedTrx(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800 animate-scale-up">
        {/* bKash Official Header Banner */}
        <div className="bg-[#e2136e] px-6 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-black/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-1">
              <img 
                src={lang === 'bn' ? '/assets/aistudio/images_244d0483.png' : '/assets/aistudio/bkash-logo-horizontal-mobile-banking-app-icon-emblem-transparent-background-free-png_c5fbc9f1.png'} 
                alt="bKash" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-pink-100 font-medium">
                bKash Tokenized Checkout
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{merchantNumber}</span>
                <span className="text-[10px] bg-pink-800/60 px-1.5 py-0.5 rounded font-normal">Merchant</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-pink-400/30 flex justify-between items-center text-xs">
            <div>
              <span className="text-pink-200">Invoice: </span>
              <span className="font-mono font-semibold text-white">{invoiceNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-pink-200">Amount: </span>
              <span className="font-bold text-base text-white">৳ {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Step 1: Customer Phone Number */}
          {step === 'msisdn' && (
            <form onSubmit={handleMsisdnSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-sm font-bold text-slate-800">
                  {lang === 'bn' ? 'আপনার বিকাশ অ্যাকাউন্ট নম্বর দিন' : 'Enter your bKash Account Number'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'bn' ? 'পেমেন্ট সম্পন্ন করতে আপনার বিকাশ ওয়ালেট নম্বর লিখুন' : 'Provide your bKash wallet number to initiate'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  bKash Account Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 font-mono">+88</span>
                  <input
                    type="tel"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    maxLength={11}
                    className="w-full pl-12 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#e2136e] focus:border-transparent outline-none text-slate-900 bg-slate-50"
                    placeholder="01XXXXXXXXX"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#e2136e] focus:ring-[#e2136e]"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 leading-tight cursor-pointer">
                  {lang === 'bn'
                    ? 'আমি বিকাশ এর নিয়ম ও শর্তাবলীর সাথে সম্মত।'
                    : 'I agree to the terms and conditions of bKash PGW.'}
                </label>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Close'}
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 text-xs font-bold rounded-lg bg-[#e2136e] hover:bg-[#c2105e] text-white shadow-md shadow-pink-600/30 transition"
                >
                  {lang === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-400 bg-slate-50 p-2 rounded border border-slate-100">
                💡 {lang === 'bn' ? 'টেস্ট করতে যেকোনো নম্বর ব্যবহার করতে পারেন' : 'Sandbox tip: Any 11-digit number works'}
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-sm font-bold text-slate-800">
                  {lang === 'bn' ? 'বিকাশ ভেরিফিকেশন কোড (OTP) দিন' : 'Enter bKash Verification Code'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {customerNumber} নম্বরে একটি ওটিপি পাঠানো হয়েছে
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#e2136e] outline-none text-slate-900 bg-slate-50 font-bold"
                  placeholder="123456"
                  autoFocus
                />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>সময় বাকি: {countdown}s</span>
                <button
                  type="button"
                  onClick={() => { setCountdown(120); setOtp('123456'); }}
                  className="text-[#e2136e] hover:underline font-semibold"
                >
                  পুনরায় ওটিপি পাঠান
                </button>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('msisdn')}
                  className="py-2.5 px-4 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ফিরে যান' : 'Back'}</span>
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 text-xs font-bold rounded-lg bg-[#e2136e] hover:bg-[#c2105e] text-white shadow-md shadow-pink-600/30 transition"
                >
                  {lang === 'bn' ? 'যাচাই করুন' : 'Verify OTP'}
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                🔑 স্যান্ডবক্স টেস্ট কোড: <span className="font-mono font-bold text-slate-800">123456</span>
              </div>
            </form>
          )}

          {/* Step 3: PIN Input */}
          {step === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-sm font-bold text-slate-800">
                  {lang === 'bn' ? 'আপনার বিকাশ পিন (PIN) দিন' : 'Enter your bKash PIN'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'bn' ? '৫ ডিজিটের গোপন পিন নম্বর প্রদান করুন' : '5-digit secret PIN required to authorize payment'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  bKash PIN (5 Digits)
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={5}
                  className="w-full text-center tracking-widest text-xl font-mono py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#e2136e] outline-none text-slate-900 bg-slate-50 font-bold"
                  placeholder="•••••"
                  autoFocus
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="py-2.5 px-4 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ফিরে যান' : 'Back'}</span>
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 text-xs font-bold rounded-lg bg-[#e2136e] hover:bg-[#c2105e] text-white shadow-md shadow-pink-600/30 transition"
                >
                  {lang === 'bn' ? 'পেমেন্ট সম্পন্ন করুন' : 'Confirm Payment'}
                </button>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-100">
                <div>🔑 স্যান্ডবক্স টেস্ট পিন: <span className="font-mono font-bold text-slate-800">12121</span></div>
                <div className="text-[10px] text-slate-400">ব্যালেন্স কম এরর দেখতে: 99999 দিন | ভুল পিন দেখতে: 00000 দিন</div>
              </div>
            </form>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full border-4 border-pink-200 border-t-[#e2136e] animate-spin" />
              <div>
                <p className="text-base font-bold text-slate-800">
                  {lang === 'bn' ? 'পেমেন্ট প্রসেসিং হচ্ছে...' : 'Processing Payment...'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'bn' ? 'অনুগ্রহ করে অপেক্ষা করুন, ব্রাউজার রিফ্রেশ করবেন না' : 'Executing transaction with bKash PGW Gateway'}
                </p>
              </div>
            </div>
          )}

          {/* Step: Success Receipt */}
          {step === 'success' && completedTx && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Transaction Successful (Status: 0000)
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  ৳ {completedTx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} BDT
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'মার্চেন্ট অ্যাকাউন্টে পেমেন্ট সফল হয়েছে' : 'Payment successfully credited to merchant wallet'}
                </p>
              </div>

              {/* Receipt Box */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Transaction ID (TrxID):</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-pink-600">
                    <span>{completedTx.trxId}</span>
                    <button
                      onClick={handleCopyTrx}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 transition"
                      title="Copy TrxID"
                    >
                      {copiedTrx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Merchant Account:</span>
                  <span className="font-mono font-semibold text-slate-800">{completedTx.merchantNumber}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Number:</span>
                  <span className="font-mono text-slate-800">{completedTx.customerNumber}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Invoice Number:</span>
                  <span className="font-mono text-slate-800">{completedTx.invoiceNumber}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Reference:</span>
                  <span className="text-slate-800">{completedTx.reference}</span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="text-slate-600">{completedTx.timestamp}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setStep('msisdn');
                    setCustomerNumber('01712345678');
                  }}
                  className="py-2.5 px-3 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'পুনরায় টেস্ট করুন' : 'Test Again'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="py-2.5 px-3 text-xs font-bold rounded-lg bg-[#e2136e] hover:bg-[#c2105e] text-white shadow-md shadow-pink-600/20 transition"
                >
                  {lang === 'bn' ? 'সম্পন্ন / বন্ধ করুন' : 'Finish & Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
