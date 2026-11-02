import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types/bkash';

interface MerchantLoginProps {
  lang: Language;
  onLogin: () => void;
}

export const MerchantLogin: React.FC<MerchantLoginProps> = ({ lang, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        onLogin();
      } else {
        setError(lang === 'bn' ? 'ইউজারনেম বা পাসওয়ার্ড ভুল!' : 'Invalid Username or Password!');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="p-8 text-center bg-slate-800/50 border-b border-slate-800">
          <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {lang === 'bn' ? 'মার্চেন্ট অ্যাডমিন লগইন' : 'Merchant Admin Login'}
          </h2>
          <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-semibold">
            Secure Access for 01339562083
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-600 hover:text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{lang === 'bn' ? 'অ্যাডমিন প্যানেল লগইন' : 'Admin Panel Login'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-slate-800"></div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">OR</span>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  onLogin();
                }, 1500);
              }}
              className="w-full py-4 rounded-2xl bg-[#e2136e] hover:bg-[#c2105e] text-white font-bold text-base shadow-xl shadow-pink-900/20 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
               <div className="w-10 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0 p-1">
                  <img 
                    src={lang === 'bn' ? '/assets/aistudio/images_244d0483.png' : '/assets/aistudio/bkash-logo-horizontal-mobile-banking-app-icon-emblem-transparent-background-free-png_c5fbc9f1.png'} 
                    alt="bKash" 
                    className="w-full h-full object-contain"
                  />
               </div>
               <span>{lang === 'bn' ? 'বিকাশ মার্চেন্ট পোর্টাল দিয়ে লগইন' : 'Login with bKash Portal'}</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-500">
              Direct access enabled for <span className="text-pink-500 font-bold">bKash Merchant Account</span>
            </p>
          </div>
        </form>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] text-slate-500 font-bold uppercase">Encrypted Session Active</span>
        </div>
      </div>
    </div>
  );
};
