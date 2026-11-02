import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Mail, 
  Phone, 
  FileText, 
  ShieldCheck, 
  Send, 
  Building,
  KeyRound,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types/bkash';
import { OFFICIAL_BKASH_CONTACTS } from '../data/bkashData';

interface ActivationGuideProps {
  merchantNumber: string;
  lang: Language;
  onGoToSimulator: () => void;
  onGoToPlayground: () => void;
}

export const ActivationGuide: React.FC<ActivationGuideProps> = ({
  merchantNumber,
  lang,
  onGoToSimulator,
  onGoToPlayground,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const emailSubject = `Request for bKash Payment Gateway (PGW) API Credentials for Merchant: ${merchantNumber}`;
  const emailBody = `Dear bKash Merchant Onboarding Team,

Greetings from our business.

We have a bKash Merchant Account with registered number: ${merchantNumber}.
We are currently integrating online payment on our e-commerce platform/application and require the official bKash Tokenized Checkout API credentials.

Merchant Details:
- Merchant Wallet Number: ${merchantNumber}
- Business Name: [আপনার প্রতিষ্ঠানের নাম]
- Website/Platform URL: [আপনার ওয়েবসাইট বা অ্যাপের লিঙ্ক]
- Contact Person: [আপনার নাম]
- Contact Phone: ${merchantNumber}
- Contact Email: [আপনার ইমেইল ঠিকানা]

Attached Documents:
1. Updated Trade License
2. e-TIN Certificate
3. Bank Account Statement / Cheque Leaf
4. National ID Card (NID) of Proprietor/Director

Please provide us with:
1. Sandbox/Test credentials (Username, Password, App Key, App Secret)
2. UAT Form & Guidelines for production rollout

Looking forward to your prompt response.

Sincerely,
[আপনার নাম ও পদবী]
${merchantNumber}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Hero Notice Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e2136e] text-white tracking-wide">
              {lang === 'bn' ? 'মার্চেন্ট নম্বর: 01339562083' : 'Merchant No: 01339562083'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'অফিসিয়াল নির্দেশিকা' : 'Official Guidelines'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            {lang === 'bn' 
              ? `${merchantNumber} বিকাশ মার্চেন্ট অ্যাকাউন্টের API পাওয়ার নিয়ম ও ইন্টিগ্রেশন`
              : `bKash Merchant API Activation & Setup Guide for ${merchantNumber}`}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
            {lang === 'bn' ? (
              <>
                বিকাশ সরাসরি কোনো নম্বর থেকে স্বয়ংক্রিয়ভাবে পাবলিক এপিআই তৈরি করে না। ওয়েবসাইট বা অ্যাপে স্বয়ংক্রিয় পেমেন্ট নেওয়ার জন্য বিকাশ লিমিটেড থেকে <span className="text-pink-400 font-semibold">Tokenized Checkout API</span> এর ক্রেডেনশিয়াল (Username, Password, App Key, App Secret) সংগ্রহ করতে হয়। নিচে সম্পূর্ণ নিয়ম ও টেস্ট করার ব্যবস্থা দেওয়া হলো।
              </>
            ) : (
              <>
                bKash does not auto-generate public API keys directly from a phone number alone. To accept automated payments on your website or app, bKash Limited securely issues <span className="text-pink-400 font-semibold">Tokenized Checkout API</span> credentials (Username, Password, App Key, App Secret) after merchant verification.
              </>
            )}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onGoToSimulator}
              className="px-5 py-2.5 rounded-xl bg-[#e2136e] hover:bg-[#c2105e] text-white font-semibold text-sm shadow-lg shadow-pink-900/30 transition flex items-center gap-2"
            >
              <span>{lang === 'bn' ? 'সরাসরি পেমেন্ট টেস্ট করুন' : 'Test Live Checkout Simulator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToPlayground}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-pink-400" />
              <span>{lang === 'bn' ? 'API কনসোল ও টেস্টিং' : 'API Playground'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Type Classification: PRA vs PGW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'bn' ? '১. পার্সোনাল রিটেইল অ্যাকাউন্ট (PRA)?' : '1. Personal Retail Account (PRA)?'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ছোট দোকানদার বা ফেসবুক পেজ মার্চেন্ট' : 'F-commerce or Retail QR accounts'}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            {lang === 'bn' ? (
              <>
                আপনার <strong>{merchantNumber}</strong> নম্বরটি যদি বিকাশ অ্যাপ বা *২৪৭# ডায়াল করে এনআইডি দিয়ে খোলা <em>Personal Retail Account</em> হয়, তবে এতে শুধুমাত্র কিউআর কোড (QR Code) ও সেন্ডমানি বা মার্চেন্ট পেমেন্ট গ্রহণ করা যায়। 
                বিকাশ পার্সোনাল রিটেইলে সরাসরি কোনো অনলাইন স্বয়ংক্রিয় এপিআই দেয় না।
              </>
            ) : (
              <>
                If <strong>{merchantNumber}</strong> was opened via NID on the bKash App as a <em>Personal Retail Account (PRA)</em>, it supports QR code customer payments, but bKash does not issue automated online checkout API credentials for PRA directly.
              </>
            )}
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300/90 flex items-start gap-2">
            <span className="font-bold">💡 {lang === 'bn' ? 'পরামর্শ:' : 'Tip:'}</span>
            <span>
              {lang === 'bn' 
                ? 'এক্ষেত্রে কর্পোরেট PGW মার্চেন্টে আপগ্রেড করুন অথবা বিকাশ পার্টনার পেমেন্ট এগ্রিগেটর (যেমন SSLCOMMERZ, Shurjopay) ব্যবহার করুন।'
                : 'Upgrade to a Corporate PGW Merchant or connect through an authorized MFS aggregator like SSLCOMMERZ or Shurjopay.'}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-pink-900/50 transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'bn' ? '২. কর্পোরেট পেমেন্ট গেটওয়ে (PGW)?' : '2. Payment Gateway (PGW) Merchant'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ওয়েবসাইট ও অ্যাপের জন্য অফিশিয়াল এপিআই' : 'Official Checkout API for websites/apps'}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            {lang === 'bn' ? (
              <>
                আপনার যদি একটি বৈধ ট্রেড লাইসেন্স ও ব্যবসা থাকে, তবে বিকাশ লিমিটেড আপনার নম্বর <strong>{merchantNumber}</strong> এর বিপরীতে অফিসিয়াল <strong>Tokenized Checkout API</strong> প্রদান করবে। এতে স্বয়ংক্রিয় ওটিপি ও পিন ভেরিফিকেশনের মাধ্যমে টাকা গ্রহণ করা যায়।
              </>
            ) : (
              <>
                With a registered trade license and bank account, bKash provides official <strong>Tokenized Checkout API</strong> credentials linked to merchant <strong>{merchantNumber}</strong>. Customers pay seamlessly via OTP and PIN popup.
              </>
            )}
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300/90 flex items-start gap-2">
            <span className="font-bold">✨ {lang === 'bn' ? 'সুবিধা:' : 'Benefit:'}</span>
            <span>
              {lang === 'bn'
                ? 'তাৎক্ষণিক পেমেন্ট কনফার্মেশন, স্বয়ংক্রিয় রিফান্ড, কোনো ম্যানুয়াল TrxID চেক করার ঝামেলা নেই।'
                : 'Instant real-time webhook confirmation, auto refund, and zero manual TrxID verification hassles.'}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Step Roadmap to Get bKash API */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-pink-400" />
          <span>{lang === 'bn' ? 'বিকাশ অফিসিয়াল এপিআই পাওয়ার ৪টি ধাপ' : '4-Step Process to Obtain bKash API'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 relative">
            <div className="w-7 h-7 rounded-lg bg-pink-600/20 text-pink-400 font-bold text-xs flex items-center justify-center mb-3 border border-pink-500/30">
              01
            </div>
            <h4 className="font-semibold text-white text-sm mb-1.5">
              {lang === 'bn' ? 'কাগজপত্র প্রস্তুত' : 'Prepare Documents'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'হালনাগাদ ট্রেড লাইসেন্স, টিন (TIN) সার্টিফিকেট, ব্যাংক স্টেটমেন্ট ও মালিকের এনআইডি প্রস্তুত রাখুন।'
                : 'Valid Trade License, e-TIN certificate, Bank Statement/Cheque, and owner National ID.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 relative">
            <div className="w-7 h-7 rounded-lg bg-pink-600/20 text-pink-400 font-bold text-xs flex items-center justify-center mb-3 border border-pink-500/30">
              02
            </div>
            <h4 className="font-semibold text-white text-sm mb-1.5">
              {lang === 'bn' ? 'আবেদন প্রেরণ' : 'Submit Application'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? `merchant@bkash.com বা developer.bkash.com এ মার্চেন্ট নম্বর ${merchantNumber} উল্লেখ করে ইমেইল করুন।`
                : `Email merchant@bkash.com with merchant number ${merchantNumber} or register on developer.bkash.com.`}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 relative">
            <div className="w-7 h-7 rounded-lg bg-pink-600/20 text-pink-400 font-bold text-xs flex items-center justify-center mb-3 border border-pink-500/30">
              03
            </div>
            <h4 className="font-semibold text-white text-sm mb-1.5">
              {lang === 'bn' ? 'স্যান্ডবক্স ও UAT টেস্ট' : 'Sandbox & UAT Test'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'বিকাশ আপনাকে টেস্ট কি দেবে। আমাদের এই স্টুডিওর কোড দিয়ে টেস্ট করে UAT রিপোর্ট সাবমিট করুন।'
                : 'bKash provides test credentials. Integrate and submit the completed UAT test report.'}
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 relative">
            <div className="w-7 h-7 rounded-lg bg-pink-600/20 text-pink-400 font-bold text-xs flex items-center justify-center mb-3 border border-pink-500/30">
              04
            </div>
            <h4 className="font-semibold text-white text-sm mb-1.5">
              {lang === 'bn' ? 'লাইভ এপিআই অ্যাক্টিভ' : 'Production Go-Live'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'আপনার লাইভ সার্ভার আইপি হোয়াইটলিস্ট করে প্রোডাকশন ক্রেডেনশিয়াল প্রদান করবে।'
                : 'bKash whitelists your server IP and issues production App Key, Secret, and Password.'}
            </p>
          </div>
        </div>
      </div>

      {/* Pre-filled Email Template for 01339562083 */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'bn' ? 'বিকাশ অফিসে পাঠানোর জন্য প্রস্তুত ইমেইল' : 'Ready Email Draft for bKash'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? `মার্চেন্ট নম্বর ${merchantNumber} এর জন্য তৈরি` : `Pre-configured for merchant ${merchantNumber}`}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            {copiedEmail ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{lang === 'bn' ? 'পুরো ইমেইল কপি করুন' : 'Copy Email Draft'}</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
            <span className="text-slate-500 select-none">To: </span>
            <span className="text-pink-400 font-semibold">{OFFICIAL_BKASH_CONTACTS.supportEmail}</span>
            <span className="text-slate-500 select-none">, </span>
            <span className="text-pink-400 font-semibold">{OFFICIAL_BKASH_CONTACTS.developerSupportEmail}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
            <span className="text-slate-500 select-none">Subject: </span>
            <span className="text-white font-semibold">{emailSubject}</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
            {emailBody}
          </div>
        </div>
      </div>

      {/* Official Contacts & Hotlines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href={`tel:${OFFICIAL_BKASH_CONTACTS.merchantHelpline}`}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition group flex flex-col items-start"
        >
          <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-400 mb-3 group-hover:scale-105 transition">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400">{lang === 'bn' ? 'মার্চেন্ট হেল্পলাইন' : 'Merchant Helpline'}</span>
          <span className="text-lg font-bold text-white font-mono mt-0.5">{OFFICIAL_BKASH_CONTACTS.merchantHelpline}</span>
          <span className="text-xs text-slate-500 mt-1">{lang === 'bn' ? 'যেকোনো নম্বর থেকে সার্বক্ষণিক' : '24/7 dedicated support'}</span>
        </a>

        <a
          href={OFFICIAL_BKASH_CONTACTS.developerPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition group flex flex-col items-start"
        >
          <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-400 mb-3 group-hover:scale-105 transition">
            <ExternalLink className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400">{lang === 'bn' ? 'ডেভেলপার পোর্টাল' : 'Developer Portal'}</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5">developer.bkash.com</span>
          <span className="text-xs text-slate-500 mt-1">{lang === 'bn' ? 'অফিসিয়াল ডকুমেন্টেশন ও গাইড' : 'Official API documentation'}</span>
        </a>

        <a
          href={`mailto:${OFFICIAL_BKASH_CONTACTS.supportEmail}`}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition group flex flex-col items-start"
        >
          <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-400 mb-3 group-hover:scale-105 transition">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400">{lang === 'bn' ? 'মার্চেন্ট সাপোর্ট ইমেইল' : 'Merchant Support Email'}</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5">{OFFICIAL_BKASH_CONTACTS.supportEmail}</span>
          <span className="text-xs text-slate-500 mt-1">{lang === 'bn' ? 'কাগজপত্র ও চুক্তিপত্র পাঠাতে' : 'Submit merchant documents'}</span>
        </a>
      </div>
    </div>
  );
};
