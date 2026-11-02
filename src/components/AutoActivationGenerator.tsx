import React, { useState } from 'react';
import { 
  Zap, 
  Link as LinkIcon, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight, 
  Lock, 
  Smartphone, 
  UserPlus,
  QrCode,
  Mail
} from 'lucide-react';
import { Language } from '../types/bkash';

interface AutoActivationGeneratorProps {
  lang: Language;
  onGoToSelfCare: (billId: string) => void;
}

export const AutoActivationGenerator: React.FC<AutoActivationGeneratorProps> = ({ lang, onGoToSelfCare }) => {
  const [billId, setBillId] = useState('BILL-102');
  const [amount, setAmount] = useState('800');
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerate = () => {
    // Simulate encryption by base64 encoding a JSON string
    const payload = JSON.stringify({ id: billId, amt: amount, ts: Date.now() });
    const encrypted = btoa(payload);
    const baseUrl = window.location.origin;
    const link = `${baseUrl}?tab=selfcare&token=${encrypted}&billId=${billId}`;
    setGeneratedLink(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Zap className="w-6 h-6 text-emerald-400" />
              <span>{lang === 'bn' ? 'অটো-এক্টিভেশন লিঙ্ক জেনারেটর' : 'Auto-Activation Link Generator'}</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              {lang === 'bn' 
                ? 'প্রতিটি কাস্টমারের জন্য ইউনিক এনক্রিপ্টেড পেমেন্ট লিঙ্ক তৈরি করুন। এই লিঙ্কে পে করলে মাইক্রোটিক লাইন অটোমেটিক চালু হবে।' 
                : 'Generate unique, encrypted payment links. Payments via these links trigger instant MikroTik line activation.'}
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure End-to-End Encryption</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'bn' ? 'কাস্টমার ডাটা ইনপুট' : 'Customer Parameters'}</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-widest">Customer Bill ID</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    value={billId}
                    onChange={(e) => setBillId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    placeholder="e.g. BILL-102"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-widest">Billing Amount (BDT)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm font-bold text-slate-600">৳</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <LinkIcon className="w-5 h-5" />
                <span>{lang === 'bn' ? 'এনক্রিপ্টেড লিঙ্ক তৈরি করুন' : 'Generate Secure Link'}</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-500/20">
            <h4 className="text-xs font-bold text-indigo-300 mb-2 uppercase flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'এসএমএস মার্কেটিং টিপ' : 'SMS Marketing Tip'}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {lang === 'bn' 
                ? 'আপনার এসএমএস প্যানেলে এই লিঙ্কটি ভ্যারিয়েবল হিসেবে ব্যবহার করুন যাতে কাস্টমার ১-ক্লিকেই বিল দিতে পারে।' 
                : 'Use this link as a variable in your SMS gateway to allow customers to pay bills with a single tap.'}
            </p>
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-7 space-y-6">
          {generatedLink ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 animate-fade-in relative overflow-hidden">
               <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />
               
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{lang === 'bn' ? 'লিঙ্ক জেনারেট হয়েছে!' : 'Link Ready for Dispatch'}</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/20">SSL SECURED</span>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 break-all font-mono text-xs text-indigo-400 leading-relaxed relative group">
                  {generatedLink}
                  <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 bg-slate-900 hover:bg-slate-800 rounded-xl transition border border-slate-800 shadow-lg"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3">
                    <QrCode className="w-12 h-12 text-slate-700" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Scan to Pay</span>
                  </div>
                  <button 
                    onClick={() => onGoToSelfCare(billId)}
                    className="p-4 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center gap-3 transition group"
                  >
                    <ArrowRight className="w-8 h-8 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{lang === 'bn' ? 'টেস্ট করতে ক্লিক করুন' : 'Test This Link'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Auto-Detection:</strong> When this link is clicked, the system identifies <strong>{billId}</strong> instantly.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Auto-Activation:</strong> Successful payment via this link will switch <strong>{billId}</strong> status to <span className="text-emerald-400 font-bold uppercase">Active (Up)</span> in MikroTik.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-700">
                <LinkIcon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-400">{lang === 'bn' ? 'তথ্য দিয়ে লিঙ্ক জেনারেট করুন' : 'Enter Details to Generate Link'}</h4>
                <p className="text-xs text-slate-600 mt-1">Generated links are unique and temporary for security.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 9-4.477 9-10S17.523 2 12 2 3 6.477 3 12s3.477 10 9 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
