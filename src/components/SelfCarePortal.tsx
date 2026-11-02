import React, { useState } from 'react';
import { 
  User, 
  LogIn, 
  Calendar, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Clock, 
  Settings, 
  LogOut,
  CreditCard,
  Wifi,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebase';

import { Language, TransactionRecord } from '../types/bkash';
import { SimulatorModal } from './SimulatorModal';

interface SelfCarePortalProps {
  merchantNumber: string;
  lang: Language;
  onPaymentSuccess: (transaction: TransactionRecord) => void;
}

interface UserData {
  billId: string;
  name: string;
  package: string;
  speed: string;
  amount: number;
  expiryDate: string;
  status: 'Active' | 'Expired';
}

const MOCK_USERS: Record<string, UserData> = {};

const BkashBirdLogo = ({ className, lang = 'en' }: { className?: string, lang?: Language }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <img 
      src={lang === 'bn' ? '/assets/aistudio/images_244d0483.png' : '/assets/aistudio/bkash-logo-horizontal-mobile-banking-app-icon-emblem-transparent-background-free-png_c5fbc9f1.png'} 
      alt="bKash" 
      className="w-full h-full object-contain"
    />
  </div>
);

export const SelfCarePortal: React.FC<SelfCarePortalProps> = ({
  merchantNumber,
  lang,
  onPaymentSuccess,
}) => {
  const [billId, setBillId] = useState('');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecharging, setIsRecharging] = useState(false);

  // Auto-login from URL parameter (Simulates clicking a link in SMS)
  React.useEffect(() => {
    const fetchUser = async (id: string) => {
      const path = 'users';
      try {
        const q = query(collection(db, path), where('billId', '==', id.toUpperCase()));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setCurrentUser(snap.docs[0].data() as UserData);
          setBillId(id);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const urlBillId = params.get('billId');
    if (urlBillId) {
      fetchUser(urlBillId);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'users';
    try {
      const q = query(collection(db, path), where('billId', '==', billId.toUpperCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userData = snap.docs[0].data() as UserData;
        setCurrentUser(userData);
        setError('');
      } else {
        setError(lang === 'bn' ? 'দুঃখিত, এই বিল আইডিটি খুঁজে পাওয়া যায়নি।' : 'Sorry, this Bill ID was not found.');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
      setError("Database error. Please try again.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBillId('');
  };

  const handlePaymentComplete = (tx: TransactionRecord) => {
    onPaymentSuccess(tx);
    setIsModalOpen(false);
    setIsRecharging(true);

    setTimeout(() => {
      if (currentUser) {
        const nextMonth = new Date(currentUser.expiryDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        setCurrentUser({
          ...currentUser,
          status: 'Active',
          expiryDate: nextMonth.toISOString().split('T')[0],
        });
      }
      setIsRecharging(false);
    }, 2000);
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-[#e2136e] p-10 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-center mb-6 relative z-10">
              <BkashBirdLogo className="w-24 h-24" lang={lang} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight relative z-10">
              {lang === 'bn' ? 'ইউনিভার্সাল বিল পে' : 'Universal Bill Pay'}
            </h2>
            <p className="text-pink-100 text-xs mt-2 font-bold uppercase tracking-[0.2em] relative z-10 opacity-90">
              {lang === 'bn' ? 'সকল গ্রাহকের জন্য একটি সহজ পেমেন্ট পোর্টাল' : 'One Portal for All Customers'}
            </p>
          </div>

          <div className="p-10 space-y-8">
            <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100/50">
              <h3 className="text-slate-800 font-black text-xl mb-2">
                {lang === 'bn' ? 'আপনার বিল আইডি দিন' : 'Enter Your Bill ID'}
              </h3>
              <p className="text-slate-500 text-sm font-medium">
                {lang === 'bn' ? 'আপনার আইডি দিয়ে ইন্টারনেটের বর্তমান স্ট্যাটাস দেখুন এবং বিকাশ দিয়ে বিল পরিশোধ করুন।' : 'Check your line status and pay your internet bill instantly using bKash.'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Customer ID / Billing ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <User className="w-6 h-6 text-slate-300 group-focus-within:text-[#e2136e] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={billId}
                    onChange={(e) => setBillId(e.target.value)}
                    placeholder={lang === 'bn' ? 'উদা: BILL-101' : 'e.g. BILL-101'}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-slate-900 text-xl font-black focus:border-[#e2136e] focus:bg-white outline-none transition-all shadow-sm"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-sm text-rose-600 flex items-center gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="font-bold">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-5 rounded-[28px] bg-[#e2136e] hover:bg-[#c2105e] text-white font-black text-xl shadow-2xl shadow-pink-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
              >
                <span>{lang === 'bn' ? 'বিল দেখুন ও পরিশোধ করুন' : 'View & Pay Bill'}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </form>

            <div className="pt-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted bKash Payment Gateway</span>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 opacity-50">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                </div>
                <div className="w-12 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 opacity-50">
                  <Zap className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Merchant: <span className="text-[#e2136e]">{merchantNumber}</span>
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Official bKash User Header */}
      <div className="bg-[#e2136e] p-8 rounded-[40px] shadow-2xl shadow-pink-200/50 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg p-2">
             <BkashBirdLogo className="w-full h-full" lang={lang} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black leading-none">{currentUser.name}</h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                currentUser.status === 'Active' ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30' : 'bg-rose-400/20 text-rose-200 border-rose-400/30'
              }`}>
                {currentUser.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-pink-100 mt-2 font-bold uppercase tracking-widest">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{currentUser.billId}</span>
              <span className="opacity-40">•</span>
              <span>{currentUser.package}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl text-xs flex items-center gap-2 transition backdrop-blur-md border border-white/20"
        >
          <LogOut className="w-4 h-4" />
          <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-xl relative overflow-hidden h-full text-slate-900">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{lang === 'bn' ? 'লাইন স্ট্যাটাস' : 'Line Status'}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{lang === 'bn' ? 'পরবর্তী বিলের তারিখ' : 'Next Billing Date'}</span>
                  <div className="flex items-center gap-3 text-2xl font-black text-slate-900 mt-1">
                    <Calendar className="w-6 h-6 text-[#e2136e]" />
                    <span>{currentUser.expiryDate}</span>
                  </div>
                </div>
              </div>

              {isRecharging ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-5">
                  <div className="w-16 h-16 border-4 border-pink-100 border-t-[#e2136e] rounded-full animate-spin"></div>
                  <p className="text-base font-black text-slate-900 tracking-tight">
                    {lang === 'bn' ? 'বিকাশ পে বিল প্রসেসিং...' : 'Processing bKash Payment...'}
                  </p>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-6 rounded-[24px] bg-[#e2136e] hover:bg-[#c2105e] text-white font-black text-xl shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
                  >
                    <div className="w-12 h-10 brightness-0 invert">
                      <BkashBirdLogo lang={lang} className="w-full h-full" />
                    </div>
                    <div className="text-left leading-tight">
                      <span className="block">{lang === 'bn' ? 'বিল পে করুন' : 'Pay Your Bill'}</span>
                      <span className="text-xs font-medium opacity-80 uppercase tracking-widest">{lang === 'bn' ? 'বিকাশ দিয়ে ১ মিনিটে রিচার্জ' : 'Instant bKash Recharge'}</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-xl text-slate-900">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-base">
              <div className="p-2 bg-pink-50 rounded-xl text-[#e2136e]">
                <CreditCard className="w-5 h-5" />
              </div>
              <span>{lang === 'bn' ? 'বিল সামারি' : 'Payment Summary'}</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs py-3 border-b border-slate-50">
                <span className="text-slate-500 font-bold uppercase">{lang === 'bn' ? 'মাসিক চার্জ' : 'Monthly Bill'}</span>
                <span className="text-slate-900 font-black text-sm">৳ {currentUser.amount}.00</span>
              </div>
              <div className="flex justify-between items-center pt-5">
                <span className="text-slate-400 font-black uppercase text-[10px]">{lang === 'bn' ? 'সর্বমোট দেয়' : 'Payable Amount'}</span>
                <span className="text-2xl font-black text-[#e2136e] font-mono">৳ {currentUser.amount}</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[32px] bg-[#e2136e] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2 uppercase tracking-widest">
                {lang === 'bn' ? 'অটো-এক্টিভেশন' : 'Auto-Activation'}
              </h4>
              <p className="text-[11px] text-pink-50 leading-relaxed font-medium">
                {lang === 'bn' ? 'বিকাশে বিল পেমেন্ট সফল হওয়ার সাথে সাথে আপনার ইন্টারনেট লাইন সচল হবে।' : 'Internet line will be automatically activated upon successful bKash payment.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SimulatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        merchantNumber={merchantNumber}
        amount={currentUser.amount}
        invoiceNumber={currentUser.billId}
        reference={`ISP Self-Care: ${currentUser.name}`}
        lang={lang}
        onPaymentSuccess={handlePaymentComplete}
      />
    </div>
  );
};
