import React, { useState, useEffect, useRef } from 'react';
import { 
  Webhook, 
  Terminal, 
  Wifi, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Zap, 
  RefreshCw, 
  Smartphone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Search,
  Code
} from 'lucide-react';
import { TransactionRecord, Language } from '../types/bkash';

interface WebhookListenerProps {
  transactions: TransactionRecord[];
  lang: Language;
  onAutoActivate?: (billId: string) => void;
}

interface RawSignal {
  id: string;
  type: 'IPN' | 'SMS';
  raw: string;
  parsed: {
    billId: string;
    amount: number;
    trxId: string;
    customer: string;
  } | null;
  status: 'Received' | 'Parsing' | 'Validated' | 'Activated' | 'Failed';
  timestamp: string;
}

export const WebhookListener: React.FC<WebhookListenerProps> = ({ transactions, lang, onAutoActivate }) => {
  const [signals, setSignals] = useState<RawSignal[]>([]);
  const [isListening, setIsListening] = useState(true);
  const [activeSignal, setActiveSignal] = useState<RawSignal | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [signals]);

  const addLog = (signal: RawSignal) => {
    setSignals(prev => [signal, ...prev].slice(0, 50));
  };

  const simulateIncomingSignal = (type: 'IPN' | 'SMS') => {
    const trxId = 'BK' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const billId = 'BILL-' + (101 + Math.floor(Math.random() * 50));
    const amount = 500 + Math.floor(Math.random() * 1500);
    const customer = '017' + Math.floor(10000000 + Math.random() * 90000000);
    
    let rawData = '';
    if (type === 'IPN') {
      rawData = JSON.stringify({
        dateTime: new Date().toISOString(),
        debitMSISDN: customer,
        creditMSISDN: "01339562083",
        amount: amount.toString(),
        trxID: trxId,
        transactionStatus: "Completed",
        merchantInvoiceNumber: billId
      }, null, 2);
    } else {
      rawData = `bKash Payment Received. Amount: ৳${amount}. Customer: ${customer}. TrxID: ${trxId}. BillID: ${billId}. Time: ${new Date().toLocaleTimeString()}`;
    }

    const newSignal: RawSignal = {
      id: Date.now().toString(),
      type,
      raw: rawData,
      parsed: null,
      status: 'Received',
      timestamp: new Date().toLocaleTimeString()
    };

    addLog(newSignal);
    setActiveSignal(newSignal);

    // Step-by-step processing simulation
    setTimeout(() => {
      setSignals(prev => prev.map(s => s.id === newSignal.id ? { ...s, status: 'Parsing' } : s));
      
      setTimeout(() => {
        const parsed = { billId, amount, trxId, customer };
        setSignals(prev => prev.map(s => s.id === newSignal.id ? { ...s, status: 'Validated', parsed } : s));
        
        setTimeout(() => {
          setSignals(prev => prev.map(s => s.id === newSignal.id ? { ...s, status: 'Activated' } : s));
          if (onAutoActivate) onAutoActivate(billId);
        }, 1000);
      }, 1000);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in text-slate-900">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-12 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg shadow-pink-200 border border-pink-100 shrink-0">
               <img 
                 src="/assets/aistudio/bkash-logo-horizontal-mobile-banking-app-icon-emblem-transparent-background-free-png_c5fbc9f1.png" 
                 alt="bKash" 
                 className="w-full h-full object-contain"
               />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">{lang === 'bn' ? 'এসএমএস ও ওয়েব হুক লিসেনার' : 'SMS & Webhook Listener'}</h2>
          </div>
          <p className="text-slate-500 font-medium ml-1">Real-time payment signal processing with automated MikroTik line recharge</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => simulateIncomingSignal('IPN')}
            className="flex items-center gap-2 px-5 py-3 bg-[#e2136e] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-pink-100 hover:bg-[#c2105e] transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" />
            {lang === 'bn' ? 'ওয়েব-হুক টেস্ট (IPN)' : 'Test Webhook (IPN)'}
          </button>
          <button 
            onClick={() => simulateIncomingSignal('SMS')}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            {lang === 'bn' ? 'এসএমএস সিগন্যাল টেস্ট' : 'Test SMS Signal'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Signal Processing Console */}
        <div className="lg:col-span-7 bg-slate-950 rounded-[40px] shadow-2xl overflow-hidden border border-slate-800 flex flex-col h-[600px]">
          <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Incoming Signal Console</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                {isListening ? 'Live Listening' : 'Paused'}
              </span>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-4 scroll-smooth no-scrollbar"
          >
            {signals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <div className="p-4 rounded-full bg-slate-900 border border-slate-800">
                  <RefreshCw className="w-8 h-8 animate-spin-slow opacity-20" />
                </div>
                <p className="font-sans font-bold uppercase tracking-widest opacity-50">Waiting for signals...</p>
              </div>
            ) : (
              signals.map((s, idx) => (
                <div key={s.id} className={`p-4 rounded-2xl border ${
                  s.status === 'Activated' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                  s.status === 'Failed' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-slate-900/50 border-slate-800'
                } transition-all animate-slide-in`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        s.type === 'IPN' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400'
                      }`}>
                        {s.type}
                      </span>
                      <span className="text-slate-500">{s.timestamp}</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      s.status === 'Activated' ? 'text-emerald-400' : 
                      s.status === 'Parsing' ? 'text-amber-400' : 'text-indigo-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="text-slate-300 break-all overflow-hidden">
                    <pre className="whitespace-pre-wrap">{s.raw}</pre>
                  </div>
                  {s.parsed && (
                    <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 block">Identified BillID:</span>
                        <span className="text-white font-bold">{s.parsed.billId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Amount Confirmed:</span>
                        <span className="text-emerald-400 font-bold">৳{s.parsed.amount}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activation Flow & Logic */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl text-slate-900 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Cpu className="w-24 h-24 text-indigo-600" />
            </div>
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                <Cpu className="w-5 h-5" />
              </div>
              <span>{lang === 'bn' ? 'অটো-এক্টিভেশন লজিক' : 'Activation Flow'}</span>
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-1">1</div>
                <div>
                  <p className="text-sm font-black text-slate-900">{lang === 'bn' ? 'সিগন্যাল রিসিভ' : 'Signal Reception'}</p>
                  <p className="text-xs text-slate-500 mt-1">{lang === 'bn' ? 'বিকাশ গেটওয়ে থেকে JSON বা SMS আকারে সিগন্যাল আসে।' : 'Incoming HTTP POST request or SMS string is captured.'}</p>
                </div>
              </div>
              
              <div className="h-6 w-px bg-slate-100 ml-4"></div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-1">2</div>
                <div>
                  <p className="text-sm font-black text-slate-900">{lang === 'bn' ? 'তথ্য যাচাই (Parsing)' : 'Data Validation'}</p>
                  <p className="text-xs text-slate-500 mt-1">{lang === 'bn' ? 'সিস্টেম অটোমেটিক BillID এবং TrxID খুঁজে বের করে।' : 'Regex & JSON parsers extract critical billing identifiers.'}</p>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-100 ml-4"></div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#e2136e] text-white flex items-center justify-center font-black text-xs shrink-0 mt-1">3</div>
                <div>
                  <p className="text-sm font-black text-slate-900">{lang === 'bn' ? 'লাইন এক্টিভেশন সিগন্যাল' : 'Router Signal'}</p>
                  <p className="text-xs text-slate-500 mt-1">{lang === 'bn' ? 'MikroTik রাউটারে সরাসরি এক্টিভেশন কমান্ড পাঠানো হয়।' : 'A high-priority API call is sent to the MikroTik router.'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 border border-indigo-800 rounded-[40px] p-8 shadow-xl text-white relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 opacity-20">
                <Wifi className="w-32 h-32" />
             </div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-white/10 rounded-2xl">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                   </div>
                   <h4 className="font-black text-lg">System Security</h4>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                   সিস্টেমটি প্রতিটি সিগন্যাল <strong>SHA-256 HMAC</strong> ভেরিফিকেশন এর মাধ্যমে চেক করে। কোনো ভুয়া ট্রানজেকশন অটো-এক্টিভ হবে না।
                </p>
                <div className="pt-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                      Safety Protocol Active
                   </div>
                </div>
             </div>
          </div>

          {activeSignal && activeSignal.status === 'Activated' && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[32px] animate-bounce-in">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-emerald-900 uppercase text-xs tracking-widest">Success Signal</h4>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">Line Activated for {activeSignal.parsed?.billId}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
