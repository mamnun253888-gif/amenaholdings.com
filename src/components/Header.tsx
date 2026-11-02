import React from 'react';
import { Phone, ShieldCheck, HelpCircle, Globe, ExternalLink, Copy, Check, LogOut, LogIn } from 'lucide-react';
import { Environment, Language } from '../types/bkash';
import { OFFICIAL_BKASH_CONTACTS } from '../data/bkashData';

interface HeaderProps {
  merchantNumber: string;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  merchantNumber,
  environment,
  setEnvironment,
  lang,
  setLang,
  activeTab,
  setActiveTab,
  onLogout,
  onLogin,
  isLoggedIn,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(merchantNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const navItems = [
    { id: 'selfcare', labelBn: 'পেমেন্ট পোর্টাল (Universal)', labelEn: 'Payment Portal' },
    { id: 'panel', labelBn: 'বিকাশ মার্চেন্ট পোর্টাল', labelEn: 'Merchant Portal' },
    { id: 'listener', labelBn: 'সিগন্যাল লিসেনার', labelEn: 'Signal Listener' },
    { id: 'ledger', labelBn: 'লেনদেন স্টেটমেন্ট', labelEn: 'Statements' },
    { id: 'billing', labelBn: 'আইএসপি বিল ম্যানেজমেন্ট', labelEn: 'ISP Management' },
    { id: 'setup', labelBn: 'এক্টিভেশন গাইড', labelEn: 'Activation Guide' },
    { id: 'playground', labelBn: 'এপিআই কনসোল', labelEn: 'API Console' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3.5 gap-3 border-b border-slate-800/80">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-pink-900/10 p-1.5 border border-pink-100">
              <img 
                src={lang === 'bn' ? '/assets/aistudio/images_244d0483.png' : '/assets/aistudio/bkash-logo-horizontal-mobile-banking-app-icon-emblem-transparent-background-free-png_c5fbc9f1.png'} 
                alt="bKash" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-tight">
                  bKash Merchant API Studio
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 font-medium border border-pink-500/20">
                  v1.2.0-beta
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'bn' 
                  ? 'বিকাশ পেমেন্ট গেটওয়ে ইন্টিগ্রেশন ও ডেভেলপার হাব' 
                  : 'Official Merchant Payment Gateway & Developer Hub'}
              </p>
            </div>
          </div>

          {/* Account & Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Merchant Number Badge */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200">
              <Phone className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-slate-400">{lang === 'bn' ? 'মার্চেন্ট:' : 'Merchant:'}</span>
              <span className="font-semibold text-white font-mono">{merchantNumber}</span>
              <button
                onClick={handleCopyNumber}
                title="Copy Merchant Number"
                className="hover:text-pink-400 transition-colors ml-1 p-0.5 rounded text-slate-400"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Environment Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setEnvironment('sandbox')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  environment === 'sandbox'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'স্যান্ডবক্স টেস্ট' : 'Sandbox'}
              </button>
              <button
                onClick={() => setEnvironment('production')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  environment === 'production'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'লাইভ প্রোডাকশন' : 'Live PGW'}
              </button>
            </div>

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-700 transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-pink-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Auth Toggle */}
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-lg transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

            {/* Hotline Link */}
            <a
              href={`tel:${OFFICIAL_BKASH_CONTACTS.merchantHelpline}`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 border border-pink-500/30 text-xs font-semibold rounded-lg transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>16247</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3.5 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#e2136e] text-white shadow-md shadow-pink-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.id === 'guide' && <HelpCircle className="w-4 h-4" />}
                {item.id === 'simulator' && <ShieldCheck className="w-4 h-4" />}
                <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
