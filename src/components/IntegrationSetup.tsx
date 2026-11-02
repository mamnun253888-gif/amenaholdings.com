import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  ShieldCheck, 
  MessageSquare, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Save,
  Terminal
} from 'lucide-react';
import { Language } from '../types/bkash';

interface IntegrationSetupProps {
  lang: Language;
  merchantNumber: string;
}

export const IntegrationSetup: React.FC<IntegrationSetupProps> = ({ lang, merchantNumber }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [integrationType, setIntegrationType] = useState<'direct' | 'aggregator'>('aggregator');
  const [aggregator, setAggregator] = useState({
    provider: 'SSLCOMMERZ',
    storeId: 'test_store_123',
    storePassword: '',
    isSandbox: true
  });
  const [mikrotik, setMikrotik] = useState({
    host: '103.127.56.46',
    username: 'billing',
    password: '',
    port: 2020,
    version: '7.x',
    radiusSecret: 'AmenaH',
    apiSsl: true,
    timeout: 10
  });
  const [appUrl, setAppUrl] = useState(window.location.origin);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sampleSms = `Dear Customer, Your Internet bill for Bill ID: BILL-101 is due. Please pay BDT 1200 using this link to avoid disconnection: ${appUrl}?tab=selfcare&billId=BILL-101`;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Configuration Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            <span>{lang === 'bn' ? 'সার্ভার ও পেমেন্ট কনফিগারেশন' : 'Server & Payment Configuration'}</span>
          </h2>
          <p className="text-sm text-slate-400">
            {lang === 'bn' 
              ? 'আপনার পেমেন্ট গেটওয়ে এবং মাইক্রোটিক সার্ভার ইনফো আপডেট করুন।' 
              : 'Update your payment gateway and MikroTik server information.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Integration Type & Aggregator Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>{lang === 'bn' ? 'পেমেন্ট মেথড সেটআপ' : 'Payment Method Setup'}</span>
            </h3>
            
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setIntegrationType('aggregator')}
                className={`px-3 py-1 rounded text-[10px] font-bold transition ${integrationType === 'aggregator' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                3rd Party
              </button>
              <button 
                onClick={() => setIntegrationType('direct')}
                className={`px-3 py-1 rounded text-[10px] font-bold transition ${integrationType === 'direct' ? 'bg-pink-600 text-white' : 'text-slate-500'}`}
              >
                Direct bKash
              </button>
            </div>
          </div>

          {integrationType === 'aggregator' ? (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300">
                {lang === 'bn' 
                  ? 'বিকাশ এপিআই সরাসরি না থাকলে SSLCOMMERZ বা Shurjopay এর মতো ৩য় পক্ষ ব্যবহার করুন।' 
                  : 'If you do not have direct bKash API, use 3rd party aggregators like SSLCOMMERZ or AamarPay.'}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Select Provider</label>
                <select 
                  value={aggregator.provider}
                  onChange={(e) => setAggregator({...aggregator, provider: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="SSLCOMMERZ">SSLCOMMERZ</option>
                  <option value="Shurjopay">Shurjopay</option>
                  <option value="AamarPay">AamarPay</option>
                  <option value="PortWallet">PortWallet</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Store ID*</label>
                  <input 
                    type="text" 
                    value={aggregator.storeId}
                    onChange={(e) => setAggregator({...aggregator, storeId: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. test_store_123"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Store Password*</label>
                  <input 
                    type="password" 
                    value={aggregator.storePassword}
                    onChange={(e) => setAggregator({...aggregator, storePassword: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
                <Save className="w-4 h-4" />
                <span>{lang === 'bn' ? 'এগ্রিগেটর সেটআপ সেভ করুন' : 'Save Aggregator Setup'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-pink-500/5 border border-pink-500/20 rounded-xl text-[11px] text-pink-300">
                {lang === 'bn' 
                  ? 'আপনার সরাসরি বিকাশ মার্চেন্ট ক্রেডেনশিয়াল ব্যবহার করুন।' 
                  : 'Use your direct bKash Merchant API credentials.'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">App Key*</label>
                  <input type="text" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-pink-500 outline-none" placeholder="bKash App Key" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">App Secret*</label>
                  <input type="password" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-pink-500 outline-none" placeholder="••••••••" />
                </div>
              </div>
              <button className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20">
                <Save className="w-4 h-4" />
                <span>{lang === 'bn' ? 'বিকাশ এপিআই সেভ করুন' : 'Save bKash API'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Server / MikroTik Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <span>{lang === 'bn' ? 'মাইক্রোটিক / রেডিয়াস কানেকশন' : 'MikroTik / Radius Connection'}</span>
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20">Active</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Server IP / Host*</label>
                <input 
                  type="text" 
                  value={mikrotik.host}
                  onChange={(e) => setMikrotik({...mikrotik, host: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">API Port*</label>
                <input 
                  type="number" 
                  value={mikrotik.port}
                  onChange={(e) => setMikrotik({...mikrotik, port: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">API Username*</label>
                <input 
                  type="text" 
                  value={mikrotik.username}
                  onChange={(e) => setMikrotik({...mikrotik, username: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">API Password*</label>
                <input 
                  type="password" 
                  value={mikrotik.password}
                  onChange={(e) => setMikrotik({...mikrotik, password: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 border border-slate-700">
              <Save className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'bn' ? 'সার্ভার সেটিংস আপডেট করুন' : 'Update Server Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Link & Webhook Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <LinkIcon className="w-5 h-5 text-pink-400" />
            <span>{lang === 'bn' ? 'পেমেন্ট লিঙ্ক জেনারেটর' : 'Payment Link Generator'}</span>
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Base URL</span>
                <button onClick={() => handleCopy('base', appUrl)} className="text-indigo-400 hover:underline">Copy</button>
              </div>
              <code className="text-xs text-white block truncate">{appUrl}</code>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Auto-Recharge SMS</span>
                <button onClick={() => handleCopy('sms', sampleSms)} className="text-indigo-400 hover:underline">Copy SMS</button>
              </div>
              <p className="text-[11px] text-slate-400 italic">"{sampleSms}"</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>{lang === 'bn' ? 'ওয়েবহুক কনফিগারেশন' : 'Webhook Configuration'}</span>
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Radius Webhook URL</span>
                <button onClick={() => handleCopy('webhook', `${appUrl}/api/webhook/bkash`)} className="text-indigo-400 hover:underline">Copy</button>
              </div>
              <code className="text-xs text-emerald-400 block truncate">{appUrl}/api/webhook/bkash</code>
            </div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-400">
              {lang === 'bn' 
                ? 'আপনার রেডিয়াস বা বিলিং প্যানেলের সেটিংসে এই লিঙ্কটি বসিয়ে দিন।' 
                : 'Paste this URL into your RADIUS or Billing Panel notification settings.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
