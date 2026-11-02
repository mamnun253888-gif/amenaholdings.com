import React from 'react';
import { 
  Database, 
  Server, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Code, 
  Webhook, 
  ShieldCheck, 
  Link as LinkIcon 
} from 'lucide-react';
import { Language } from '../types/bkash';

interface TechFlowGuideProps {
  lang: Language;
  merchantNumber: string;
}

export const TechFlowGuide: React.FC<TechFlowGuideProps> = ({ lang, merchantNumber }) => {
  return (
    <div className="max-w-5xl mx-auto py-6 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-white">
          {lang === 'bn' ? 'অটো-রিচার্জ কিভাবে কাজ করে?' : 'How Auto-Recharge Works?'}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          {lang === 'bn' 
            ? 'বিল আইডি চেনা থেকে শুরু করে লাইন সচল করা পর্যন্ত সম্পূর্ণ টেকনিক্যাল ফ্লো নিচে আলোচনা করা হলো।' 
            : 'A deep dive into the technical workflow from identifying Bill IDs to instant line activation.'}
        </p>
      </div>

      {/* Step by Step Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connection Lines (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-1/3 w-12 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
        <div className="hidden md:block absolute top-1/2 left-2/3 w-12 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />

        {/* Step 1: Link & Identification */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative z-10 hover:border-indigo-500/50 transition">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/30">
            <LinkIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {lang === 'bn' ? '১. বিল আইডি ও লিঙ্ক' : '1. Bill ID & Link'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'bn' 
              ? 'গ্রাহক যখন লিঙ্কে ক্লিক করে, আপনার সিস্টেম ওই লিঙ্কের সাথে Bill ID টি বিকাশের "create" এপিআই-তে পাঠিয়ে দেয়। ফলে বিকাশ জানে কোন গ্রাহক পেমেন্ট করছে।' 
              : 'When a customer clicks your pay link, your system passes the Bill ID to bKash "create" API as "merchantInvoiceNumber". This identifies the specific user.'}
          </p>
          <div className="mt-4 p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-indigo-300">
            "merchantInvoiceNumber": "BILL-101"
          </div>
        </div>

        {/* Step 2: Payment & IPN */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative z-10 hover:border-pink-500/50 transition">
          <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-2xl flex items-center justify-center mb-4 border border-pink-500/30">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {lang === 'bn' ? '২. পেমেন্ট ও নোটিফিকেশন' : '2. Payment & IPN'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'bn' 
              ? 'গ্রাহক পিন দিলে বিকাশ সাথে সাথে আপনার সার্ভারে একটি IPN (Instant Payment Notification) পাঠায়। এতে Bill ID এবং TrxID থাকে।' 
              : 'Once the PIN is entered, bKash instantly sends an IPN (Webhook) to your server containing the Bill ID and successful TrxID.'}
          </p>
          <div className="mt-4 p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-pink-300">
            "transactionStatus": "Completed"
          </div>
        </div>

        {/* Step 3: Database & Auto-Up */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative z-10 hover:border-emerald-500/50 transition">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {lang === 'bn' ? '৩. অটো-লাইন আপডেট' : '3. Auto-Line Update'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'bn' 
              ? 'আপনার সার্ভার বিল আইডি মিলিয়ে ডাটাবেজে গ্রাহকের মেয়াদ বাড়িয়ে দেয় এবং মাইক্রোটিক বা অন্য সার্ভারে কমান্ড পাঠিয়ে লাইন সচল করে।' 
              : 'Your server matches the Bill ID, updates the database, and sends a command to your MikroTik/Server to enable the internet line.'}
          </p>
          <div className="mt-4 p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-emerald-300">
            UPDATE users SET status='Active'...
          </div>
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Webhook className="w-5 h-5 text-indigo-400" />
            <span>{lang === 'bn' ? 'সার্ভার যেভাবে বিল আইডি চেনে' : 'How Server Recognizes Bill ID'}</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">01</div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {lang === 'bn' 
                  ? 'বিকাশের পেমেন্ট তৈরি করার সময় "merchantInvoiceNumber" ফিল্ডে আপনি গ্রাহকের বিলিং আইডি (যেমন: BILL-101) বসিয়ে দেন।' 
                  : 'When creating payment, you inject the Bill ID into the "merchantInvoiceNumber" field of the bKash API payload.'}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">02</div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {lang === 'bn' 
                  ? 'পেমেন্ট শেষে বিকাশ যখন আপনার সার্ভারে রিপ্লাই দেয়, তখন ওই একই বিলিং আইডিটি তারা ফেরত পাঠায়।' 
                  : 'After a successful transaction, bKash sends a notification back to your server with that exact same Bill ID.'}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">03</div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {lang === 'bn' 
                  ? 'আপনার সার্ভার ওই আইডি দিয়ে ডাটাবেজে সার্চ করে দেখে এবং সাথে সাথে গ্রাহকের প্যাকেজ রিনিউ করে দেয়।' 
                  : 'Your backend searches the database for that Bill ID and instantly renews the package subscription.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{lang === 'bn' ? 'সিকিউরিটি ও কনফার্মেশন' : 'Security & Confirmation'}</span>
          </h3>
          
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Verification Step</span>
              <span className="text-emerald-400">Status</span>
            </div>
            <div className="flex items-center justify-between text-[11px] py-2 border-b border-slate-800">
              <span className="text-slate-300">bKash Signature Validation</span>
              <span className="flex items-center gap-1 text-emerald-500 font-bold"><CheckCircle2 className="w-3 h-3" /> VERIFIED</span>
            </div>
            <div className="flex items-center justify-between text-[11px] py-2 border-b border-slate-800">
              <span className="text-slate-300">Transaction Status Check</span>
              <span className="flex items-center gap-1 text-emerald-500 font-bold"><CheckCircle2 className="w-3 h-3" /> COMPLETED</span>
            </div>
            <div className="flex items-center justify-between text-[11px] py-2 border-b border-slate-800">
              <span className="text-slate-300">Double Payment Prevention</span>
              <span className="flex items-center gap-1 text-emerald-500 font-bold"><CheckCircle2 className="w-3 h-3" /> SECURED</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic">
            * {lang === 'bn' 
                ? 'আইপিএন ব্যবহার করলে আপনাকে ম্যানুয়ালি বিকাশ নম্বর বা TrxID চেক করতে হবে না, সিস্টেম অটোমেটিক কাজ করবে।' 
                : 'Using IPN eliminates the need for manual TrxID verification; the system handles everything in real-time.'}
          </p>
        </div>
      </div>


      {/* bKash App Reference Flow */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-amber-400" />
          <span>{lang === 'bn' ? 'বিকাশ অ্যাপ/কিউআর স্ক্যান (রেফারেন্স) ফ্লো' : 'bKash App / QR Scan (Reference) Flow'}</span>
        </h3>
        
        <p className="text-sm text-slate-400 leading-relaxed">
          {lang === 'bn' 
            ? 'কাস্টমার যখন সরাসরি বিকাশ অ্যাপ থেকে কিউআর কোড স্ক্যান করে বা পেমেন্ট করে রেফারেন্সে আপনার বিল আইডি দেয়, তখন সেই পেমেন্ট আপনি কিভাবে চিনবেন?' 
            : 'How does your system identify a payment when a customer manually scans your QR code and enters their Bill ID in the "Reference" field?'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase mb-3">Customer Side (bKash App)</h4>
              <ul className="space-y-3 text-[11px] text-slate-300">
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">1.</span>
                  <span>Scans Merchant QR or Dials *247#</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">2.</span>
                  <span>Enters Amount (e.g. 1200 BDT)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">3.</span>
                  <span className="font-bold underline">Enters Bill ID in "Reference" field</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">4.</span>
                  <span>Enters bKash PIN & Confirms</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3">System Side (Your Server)</h4>
              <ul className="space-y-3 text-[11px] text-slate-300">
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold">1.</span>
                  <span>bKash sends IPN with "Reference" payload</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold">2.</span>
                  <span>Server extracts Bill ID from the reference string</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold">3.</span>
                  <span>Matches ID with Database User</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold">4.</span>
                  <span>Triggers MikroTik API to "Enable" line</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example Snippet */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">{lang === 'bn' ? 'সার্ভার লজিক (স্যাম্পল)' : 'Server Logic (Sample)'}</span>
          </div>
        </div>
        <pre className="p-6 font-mono text-[11px] text-indigo-300/90 leading-relaxed overflow-x-auto">
{`// Your server-side IPN handler
app.post('/bkash-webhook', async (req, res) => {
  const { merchantInvoiceNumber, trxID, transactionStatus } = req.body;

  if (transactionStatus === 'Completed') {
    // 1. Identify the user by Bill ID
    const billId = merchantInvoiceNumber; 

    // 2. Database Update
    await db.users.update({
      where: { bill_id: billId },
      data: { 
        status: 'Active', 
        expiry_date: addOneMonth(new Date()),
        last_trx_id: trxID
      }
    });

    // 3. Optional: Send command to MikroTik to enable internet
    mikrotik.enableUser(billId);

    console.log(\`Success: Bill \${billId} recharged via TrxID \${trxID}\`);
  }

  res.status(200).send('OK');
});`}
        </pre>
      </div>
    </div>
  );
};
