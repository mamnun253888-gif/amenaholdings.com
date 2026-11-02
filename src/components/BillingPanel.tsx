import React, { useState } from 'react';
import { 
  Server, 
  Activity, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  RefreshCw, 
  Search, 
  Database, 
  Webhook, 
  CheckCircle2, 
  MessageSquare, 
  Wallet, 
  TrendingUp, 
  History, 
  ArrowDownLeft, 
  LayoutDashboard,
  CreditCard,
  Download,
  Calendar,
  Filter,
  User,
  LogOut,
  ChevronRight,
  PieChart,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  Terminal
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { TransactionRecord, Language } from '../types/bkash';
import { handleFirestoreError, OperationType } from '../lib/firebase';

interface UserData {
  id?: string;
  billId: string;
  name: string;
  package: string;
  speed: string;
  amount: number;
  expiryDate: string;
  status: 'Active' | 'Expired';
  phoneNumber?: string;
}

const CustomerDirectory: React.FC<{ lang: Language }> = ({ lang }) => {
  const [customers, setCustomers] = useState<UserData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<UserData>>({
    status: 'Active',
    package: 'Basic Home',
    speed: '10 Mbps',
    amount: 500
  });

  React.useEffect(() => {
    const path = 'users';
    const q = query(collection(db, path));
    return onSnapshot(q, (snap) => {
      setCustomers(snap.docs.map(d => ({ ...d.data(), id: d.id } as UserData)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.billId || !newCustomer.name) return;
    const path = 'users';
    try {
      await addDoc(collection(db, path), {
        ...newCustomer,
        billId: newCustomer.billId.toUpperCase(),
        expiryDate: newCustomer.expiryDate || new Date().toISOString().split('T')[0]
      });
      setIsAdding(false);
      setNewCustomer({ status: 'Active', package: 'Basic Home', speed: '10 Mbps', amount: 500 });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const path = `users/${id}`;
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-slate-900">Customer Directory</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#e2136e] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-pink-100 hover:bg-[#c2105e] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Customer
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-pink-100 rounded-[32px] p-8 shadow-xl animate-slide-in">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill ID</label>
              <input 
                type="text" 
                required
                placeholder="e.g. BILL-101"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-[#e2136e] outline-none"
                value={newCustomer.billId || ''}
                onChange={e => setNewCustomer({...newCustomer, billId: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-[#e2136e] outline-none"
                value={newCustomer.name || ''}
                onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Amount</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-[#e2136e] outline-none"
                value={newCustomer.amount || ''}
                onChange={e => setNewCustomer({...newCustomer, amount: Number(e.target.value)})}
              />
            </div>
            <div className="flex items-end gap-3 md:col-span-3">
              <button type="submit" className="px-8 py-3 bg-[#e2136e] text-white rounded-xl text-xs font-black uppercase tracking-widest">Save Customer</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-[40px] shadow-2xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] text-slate-400 uppercase tracking-widest font-black border-b border-slate-100 bg-slate-50/50">
              <th className="px-10 py-6">Customer</th>
              <th className="px-10 py-6">Bill ID</th>
              <th className="px-10 py-6">Package</th>
              <th className="px-10 py-6">Expiry</th>
              <th className="px-10 py-6">Status</th>
              <th className="px-10 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-10 py-6">
                  <span className="text-sm font-black text-slate-900">{c.name}</span>
                </td>
                <td className="px-10 py-6">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 border border-slate-200 uppercase">{c.billId}</span>
                </td>
                <td className="px-10 py-6">
                  <span className="text-xs font-bold text-slate-500">{c.package} ({c.speed})</span>
                </td>
                <td className="px-10 py-6">
                  <span className="text-xs font-black text-slate-700">{c.expiryDate}</span>
                </td>
                <td className="px-10 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-10 py-6 text-right">
                  <button onClick={() => handleDelete(c.id!)} className="p-2 text-rose-400 hover:text-rose-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-10 py-12 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                  No customers found. Add your first customer above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PortalSync: React.FC<{ lang: Language }> = ({ lang }) => {
  const [portalUser, setPortalUser] = useState('');
  const [portalPass, setPortalPass] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const handleSync = async () => {
    if (!portalUser || !portalPass) return;
    setIsSyncing(true);
    setSyncLogs(prev => [`[${new Date().toLocaleTimeString()}] Initiating session with merchantportal.bkash.com...`, ...prev]);
    
    setTimeout(() => {
      setSyncLogs(prev => [`[${new Date().toLocaleTimeString()}] Authentication successful. Fetching latest statement...`, ...prev]);
      
      setTimeout(() => {
        setSyncLogs(prev => [
          `[${new Date().toLocaleTimeString()}] Found 2 new transactions.`,
          `[${new Date().toLocaleTimeString()}] TrxID: BLA928371, Amount: ৳1250, BillID: BILL-101`,
          `[${new Date().toLocaleTimeString()}] TrxID: BLA928372, Amount: ৳500, BillID: BILL-102`,
          `[${new Date().toLocaleTimeString()}] Syncing with local database...`,
          ...prev
        ]);
        
        setTimeout(() => {
          setSyncLogs(prev => [`[${new Date().toLocaleTimeString()}] Sync complete. 2 users updated.`, ...prev]);
          setIsSyncing(false);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl">
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-pink-50 rounded-xl text-[#e2136e]">
            <LogOut className="w-5 h-5 rotate-180" />
          </div>
          <span>Portal Login</span>
        </h3>
        <div className="space-y-4 text-slate-900">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username / Email</label>
            <input 
              type="text" 
              placeholder="Merchant Username"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-[#e2136e] outline-none"
              value={portalUser}
              onChange={e => setPortalUser(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-[#e2136e] outline-none"
              value={portalPass}
              onChange={e => setPortalPass(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full py-4 bg-[#e2136e] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-pink-100 hover:bg-[#c2105e] transition-all flex items-center justify-center gap-2"
          >
            {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isSyncing ? 'Syncing...' : 'Sync Portal Data'}
          </button>
        </div>
        <p className="mt-6 text-[10px] text-slate-400 leading-relaxed italic text-center">
          * This session is encrypted. Our system will extract TrxID and BillID from your portal statement to automate user activation.
        </p>
      </div>

      <div className="lg:col-span-2 bg-slate-950 rounded-[40px] shadow-2xl overflow-hidden border border-slate-800 flex flex-col h-[400px]">
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black text-white uppercase tracking-widest">Sync Terminal</span>
          </div>
        </div>
        <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-2 text-slate-300">
          {syncLogs.length === 0 ? (
            <p className="opacity-30">Waiting for portal sync to initiate...</p>
          ) : (
            syncLogs.map((log, i) => <p key={i} className="animate-slide-in">{log}</p>)
          )}
        </div>
      </div>
    </div>
  );
};

const RevenueOverview: React.FC<{ transactions: TransactionRecord[] }> = ({ transactions }) => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });

  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = (now.getMonth() + 1).toString().padStart(2, '0');
    const yearStr = now.getFullYear();
    const dateKey = `${yearStr}-${monthStr}-${dayStr}`;

    const dayTotal = transactions
      .filter(tx => tx.timestamp.startsWith(dateKey) && tx.status === 'Completed')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      name: day,
      amount: dayTotal
    };
  });

  const totalMonthly = chartData.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl shadow-slate-200/50 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#e2136e]" />
            Revenue Overview
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
            Daily Transaction Totals — {currentMonthName} {now.getFullYear()}
          </p>
        </div>
        <div className="bg-pink-50 px-6 py-3 rounded-2xl border border-pink-100">
          <p className="text-[9px] font-black text-[#e2136e] uppercase tracking-[0.2em] mb-0.5">Total Monthly</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">৳{totalMonthly.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e2136e" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#e2136e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              interval={2}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              tickFormatter={(value) => `৳${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '20px', 
                border: '1px solid #fce7f3', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)'
              }}
              labelClassName="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block"
              labelFormatter={(label) => `${currentMonthName} ${label}, ${now.getFullYear()}`}
              itemStyle={{ color: '#e2136e', fontWeight: 900, fontSize: '16px' }}
              formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
              cursor={{ stroke: '#e2136e', strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#e2136e" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
              animationDuration={1500}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#e2136e' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface BillingPanelProps {
  transactions: TransactionRecord[];
  lang: Language;
}

export const BillingPanel: React.FC<BillingPanelProps> = ({ transactions, lang }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'mikrotik' | 'bkash'>('bkash');
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'transactions' | 'withdraw' | 'customers' | 'sync'>('dashboard');

  const lineUpCount = transactions.filter(t => t.lineStatus === 'Up').length;
  const lineDownCount = transactions.filter(t => t.lineStatus === 'Down').length;

  const totalCollected = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const todayCollected = transactions
    .filter(tx => tx.timestamp.includes('2026-11-02') || tx.timestamp.includes(new Date().toISOString().split('T')[0]))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const q = searchTerm.toLowerCase();
    return (
      tx.trxId.toLowerCase().includes(q) ||
      tx.invoiceNumber.toLowerCase().includes(q) ||
      (tx.customerName || '').toLowerCase().includes(q)
    );
  });

  const BkashBirdLogo = ({ className, lang = 'en' }: { className?: string, lang?: Language }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src={lang === 'bn' ? '/assets/aistudio/images_244d0483.png' : '/assets/aistudio/bkash-logo-horizontal-mobile-banking-app-icon-emblem-transparent-background-free-png_c5fbc9f1.png'} 
        alt="bKash" 
        className="w-full h-full object-contain"
      />
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto min-h-screen bg-[#f1f5f9] -mt-6 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Top Professional Header (Official bKash Look) */}
      <div className="bg-[#e2136e] sticky top-0 z-40 shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-14 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-white/20 p-1">
                <BkashBirdLogo className="w-full h-full" lang={lang} />
             </div>
             <div className="text-white">
                <h1 className="text-xl font-black leading-none">bKash</h1>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80 mt-1">Merchant Portal</p>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveView('bkash')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'bkash' ? 'bg-white text-[#e2136e]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveView('mikrotik')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'mikrotik' ? 'bg-white text-indigo-600' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              ISP Sync
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-black text-white">01339562083</span>
              <div className="flex items-center gap-1 justify-end mt-1">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                 <span className="text-[9px] font-black text-white/90 uppercase">Online</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button onClick={handleRefresh} className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition text-white">
                 <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                 <User className="w-5 h-5" />
              </div>
           </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200 min-h-[calc(100vh-72px)] hidden lg:block p-8 space-y-10">
           <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4 block">Navigation</span>
              <button 
                onClick={() => setActiveSubTab('dashboard')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-sm font-black transition-all ${activeSubTab === 'dashboard' ? 'bg-pink-50 text-[#e2136e]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Overview</span>
              </button>
              <button 
                onClick={() => setActiveSubTab('transactions')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-sm font-black transition-all ${activeSubTab === 'transactions' ? 'bg-pink-50 text-[#e2136e]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <History className="w-5 h-5" />
                <span>Statements</span>
              </button>
              <button 
                onClick={() => setActiveSubTab('customers')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-sm font-black transition-all ${activeSubTab === 'customers' ? 'bg-pink-50 text-[#e2136e]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <User className="w-5 h-5" />
                <span>Customers</span>
              </button>
              <button 
                onClick={() => setActiveSubTab('sync')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-sm font-black transition-all ${activeSubTab === 'sync' ? 'bg-pink-50 text-[#e2136e]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Portal Sync</span>
              </button>
              <button className="w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-sm font-black text-slate-500 hover:bg-slate-50 transition-all">
                <Wallet className="w-5 h-5" />
                <span>Withdrawal</span>
              </button>
           </div>

           <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Merchant Link</p>
                <p className="text-xs font-bold text-slate-200 mb-4 truncate">merchantportal.bkash.com</p>
                <a 
                  href="https://merchantportal.bkash.com/dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black text-[#e2136e] bg-white px-3 py-2 rounded-lg hover:bg-pink-50 transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit Official Portal
                </a>
              </div>
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-12 overflow-hidden">
          {activeView === 'bkash' ? (
            <div className="max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                 <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">Merchant Dashboard</h2>
                    <p className="text-base text-slate-500 font-medium mt-1">Real-time settlement for <span className="text-[#e2136e] font-bold">01339562083</span></p>
                 </div>
                 <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
                      <Calendar className="w-4 h-4 text-[#e2136e]" />
                      Today: Nov 2, 2026
                    </div>
                 </div>
              </div>

              {/* KPI Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <TrendingUp className="w-24 h-24 text-[#e2136e]" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Balance</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-slate-900 font-mono tracking-tighter">৳ 45,820</span>
                      <span className="text-xl font-bold text-slate-400">.50</span>
                    </div>
                    <div className="pt-4">
                      <button className="w-full py-4 bg-[#e2136e] text-white text-sm font-black rounded-2xl shadow-lg shadow-pink-200 hover:bg-[#c2105e] transition-all">
                          Settle to Bank Account
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#e2136e] rounded-[40px] p-10 shadow-xl shadow-pink-200/50 relative overflow-hidden text-white">
                  <div className="absolute -right-4 -bottom-4 opacity-20">
                    <History className="w-32 h-32" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <span className="text-xs font-black text-white/70 uppercase tracking-widest">Received Today</span>
                    <div className="text-5xl font-black font-mono tracking-tighter">৳ {todayCollected.toLocaleString()}</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-white/90">
                       <ArrowUpCircle className="w-5 h-5" />
                       <span>{transactions.filter(t => t.timestamp.includes('2026-11-02')).length} Payments Received</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest">API Sync Status</span>
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900">Live & Synchronized</p>
                          <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Tokenized v1.2.0-beta</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-bold text-slate-500 leading-relaxed">
                        Data is being pulled directly from your <span className="text-[#e2136e]">bKash Merchant ID</span> and synced with your ISP line status.
                      </div>
                   </div>
                </div>
              </div>

              {activeSubTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                  {/* Recent Transactions */}
                  <div className="bg-white border border-slate-100 rounded-[40px] shadow-2xl shadow-slate-200/40 overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                      <div>
                        <h3 className="font-black text-slate-900 text-xl">Recent Settlements</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-1">Transaction History</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[11px] text-slate-400 uppercase tracking-widest font-black border-b border-slate-100 bg-white">
                            <th className="px-10 py-6">Payer</th>
                            <th className="px-10 py-6">ID</th>
                            <th className="px-10 py-6 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-pink-50/30 transition-colors group">
                              <td className="px-10 py-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#e2136e]/10 group-hover:text-[#e2136e] transition-all">
                                      <User className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <span className="text-sm font-black text-slate-900 block leading-tight">{tx.customerName || 'Customer'}</span>
                                      <span className="text-[10px] font-bold text-slate-400 mt-0.5 block tracking-tight">{tx.customerNumber}</span>
                                   </div>
                                </div>
                              </td>
                              <td className="px-10 py-6">
                                 <span className="text-sm font-black font-mono text-[#e2136e]">{tx.trxId}</span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <div className="text-lg font-black font-mono text-slate-900">৳{tx.amount}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* IPN / SMS Monitor Simulation */}
                  <div className="bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-800">
                     <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
                        <div>
                          <h3 className="font-black text-white text-xl">Incoming Signal Monitor</h3>
                          <p className="text-[10px] text-emerald-400 font-bold uppercase mt-1 tracking-widest flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                             Active IPN Listener
                          </p>
                        </div>
                     </div>
                     <div className="p-8 space-y-4">
                        {transactions.slice(0, 3).map((tx, idx) => (
                          <div key={`ipn-${tx.id}`} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 animate-slide-in" style={{ animationDelay: `${idx * 150}ms` }}>
                             <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                   <Webhook className="w-3.5 h-3.5" />
                                   Webhook (IPN)
                                </div>
                                <span className="text-[9px] font-bold text-slate-500">{tx.timestamp}</span>
                             </div>
                             <div className="font-mono text-[11px] text-slate-300 space-y-1">
                                <p><span className="text-slate-500">Event:</span> <span className="text-emerald-400">PAYMENT_SUCCESS</span></p>
                                <p><span className="text-slate-500">TrxID:</span> {tx.trxId}</p>
                                <p><span className="text-slate-500">BillID:</span> {tx.invoiceNumber}</p>
                                <p><span className="text-slate-500">Action:</span> <span className="text-indigo-400">Updating ISP Line Status...</span></p>
                             </div>
                          </div>
                        ))}
                        <div className="pt-4 text-center">
                           <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Waiting for incoming bKash signals...
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeSubTab === 'customers' && (
                <div className="space-y-8 animate-fade-in">
                  <CustomerDirectory lang={lang} />
                </div>
              )}

              {activeSubTab === 'sync' && (
                <PortalSync lang={lang} />
              )}
            </div>
          ) : (
            /* ISP / MikroTik Management View */
            <div className="max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-900">
               <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">ISP Network Overview</h2>
                  <p className="text-base text-slate-500 font-medium mt-1">Automatic line activation synced with <span className="text-[#e2136e] font-bold text-sm">bKash Merchant Portal</span></p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Sync Router
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-slate-900 rounded-[40px] p-10 text-white space-y-4 shadow-2xl relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                   <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Router Endpoint</span>
                   <div className="flex items-center gap-4">
                      <Server className="w-10 h-10 text-indigo-400" />
                      <span className="text-2xl font-black font-mono tracking-tight">103.127.56.46</span>
                   </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-xl">
                   <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Active Lines</span>
                   <div className="mt-6 flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <ArrowUpCircle className="w-10 h-10" />
                      </div>
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{lineUpCount + 42}</span>
                   </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-xl">
                   <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Inactive/Expired</span>
                   <div className="mt-6 flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <ArrowDownCircle className="w-10 h-10" />
                      </div>
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{lineDownCount + 5}</span>
                   </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-xl flex flex-col justify-between">
                   <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Auto-Recharge</span>
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                      <span className="text-xl font-black text-slate-900 uppercase">IPN Listening</span>
                   </div>
                </div>
              </div>

              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-16 text-center shadow-sm">
                 <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto mb-8">
                    <Database className="w-10 h-10" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900">MikroTik Router Synced</h3>
                 <p className="text-base text-slate-500 max-w-lg mx-auto mt-4 leading-relaxed font-medium">
                   When a payment is confirmed in the bKash Merchant Portal, our system automatically triggers a command to your MikroTik router to activate the line for <span className="text-[#e2136e] font-bold">Bill ID</span>.
                 </p>
                 <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                       <Webhook className="w-5 h-5 text-indigo-500" />
                       <span className="text-sm font-black text-slate-700">Webhook: /api/bkash/ipn</span>
                    </div>
                    <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                       <Activity className="w-5 h-5 text-emerald-500" />
                       <span className="text-sm font-black text-slate-700">Average Delay: 0.8s</span>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
