import React, { useState } from 'react';
import { Header } from './components/Header';
import { ActivationGuide } from './components/ActivationGuide';
import { SelfCarePortal } from './components/SelfCarePortal';
import { MerchantLogin } from './components/MerchantLogin';
import { AutoActivationGenerator } from './components/AutoActivationGenerator';
import { IntegrationSetup } from './components/IntegrationSetup';
import { BillingPanel } from './components/BillingPanel';
import { TechFlowGuide } from './components/TechFlowGuide';
import { PaymentSimulator } from './components/PaymentSimulator';
import { IspBillingPortal } from './components/IspBillingPortal';
import { MobileRecharge } from './components/MobileRecharge';
import { ApiPlayground } from './components/ApiPlayground';
import { CodeGenerator } from './components/CodeGenerator';
import { TransactionLedger } from './components/TransactionLedger';
import { WebhookListener } from './components/WebhookListener';
import { 
  DEFAULT_MERCHANT_NUMBER, 
  SANDBOX_CREDENTIALS, 
  INITIAL_TRANSACTIONS, 
  OFFICIAL_BKASH_CONTACTS 
} from './data/bkashData';
import { BkashCredentials, Environment, Language, TransactionRecord } from './types/bkash';
import { Phone, ExternalLink, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { db, auth } from './lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  where 
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { handleFirestoreError, OperationType } from './lib/firebase';

export default function App() {
  const [merchantNumber, setMerchantNumber] = useState<string>(DEFAULT_MERCHANT_NUMBER);
  const [environment, setEnvironment] = useState<Environment>('sandbox');
  const [lang, setLang] = useState<Language>('bn');
  const [activeTab, setActiveTab] = useState<string>('selfcare');
  const [merchantIsLoggedIn, setMerchantIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState<BkashCredentials>(SANDBOX_CREDENTIALS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [user, setUser] = useState<any>(null);

  // Sync with Firebase Auth
  React.useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setMerchantIsLoggedIn(true);
    });
  }, []);

  // Sync with Firestore Transactions
  React.useEffect(() => {
    const path = 'transactions';
    const q = query(collection(db, path), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TransactionRecord));
      setTransactions(txs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handlePaymentSuccess = async (newTx: TransactionRecord) => {
    const txPath = 'transactions';
    const userPath = 'users';
    try {
      // Find user to check required amount
      const userSnap = await getDocs(query(collection(db, userPath), where('billId', '==', newTx.invoiceNumber)));
      let lineStatus: 'Up' | 'Down' = 'Down';
      let activationNote = '';

      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        const requiredAmount = userData.amount;
        
        // Strict logic: If even 1 Taka less, do not activate
        if (newTx.amount >= requiredAmount) {
          lineStatus = 'Up';
          const userDocId = userSnap.docs[0].id;
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          await updateDoc(doc(db, userPath, userDocId), {
            status: 'Active',
            expiryDate: nextMonth.toISOString().split('T')[0]
          });
        } else {
          activationNote = ` (Insufficient amount: Required ৳${requiredAmount})`;
        }
      }

      const enrichedTx = { 
        ...newTx, 
        lineStatus, 
        customerName: (newTx.reference?.split(': ')[1] || 'bKash Customer') + activationNote
      };
      await addDoc(collection(db, txPath), enrichedTx);
      
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, txPath);
    }
  };

  const handleRefund = async (txId: string) => {
    const path = `transactions/${txId}`;
    try {
      await updateDoc(doc(db, 'transactions', txId), {
        status: 'Refunded',
        refundTrxId: 'BLR' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleAutoActivate = async (billId: string) => {
    const txPath = 'transactions';
    const userPath = 'users';
    try {
      // Find transactions for this bill ID and mark them as Up
      const q = query(collection(db, txPath), where('invoiceNumber', '==', billId));
      const snap = await getDocs(q);
      const promises = snap.docs.map(d => updateDoc(doc(db, txPath, d.id), { lineStatus: 'Up' }));
      await Promise.all(promises);

      // Update user status
      const userSnap = await getDocs(query(collection(db, userPath), where('billId', '==', billId)));
      if (!userSnap.empty) {
        await updateDoc(doc(db, userPath, userSnap.docs[0].id), { status: 'Active' });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, userPath);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMerchantIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        merchantNumber={merchantNumber}
        environment={environment}
        setEnvironment={setEnvironment}
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onLogin={handleLogin}
        isLoggedIn={merchantIsLoggedIn}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'selfcare' && (
          <SelfCarePortal
            merchantNumber={merchantNumber}
            lang={lang}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {activeTab === 'setup' && (
          !merchantIsLoggedIn ? (
            <MerchantLogin lang={lang} onLogin={() => setMerchantIsLoggedIn(true)} />
          ) : (
            <IntegrationSetup
              lang={lang}
              merchantNumber={merchantNumber}
            />
          )
        )}

        {activeTab === 'panel' && (
          !merchantIsLoggedIn ? (
            <MerchantLogin lang={lang} onLogin={() => setMerchantIsLoggedIn(true)} />
          ) : (
            <BillingPanel
              transactions={transactions}
              lang={lang}
            />
          )
        )}

        {activeTab === 'listener' && (
          <WebhookListener
            transactions={transactions}
            lang={lang}
            onAutoActivate={handleAutoActivate}
          />
        )}

        {activeTab === 'billing' && (
          !merchantIsLoggedIn ? (
            <MerchantLogin lang={lang} onLogin={() => setMerchantIsLoggedIn(true)} />
          ) : (
            <IspBillingPortal
              merchantNumber={merchantNumber}
              lang={lang}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )
        )}

        {activeTab === 'playground' && (
          <ApiPlayground
            credentials={credentials}
            setCredentials={setCredentials}
            lang={lang}
          />
        )}

        {activeTab === 'ledger' && (
          <TransactionLedger
            transactions={transactions}
            merchantNumber={merchantNumber}
            lang={lang}
            onRefund={handleRefund}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded-lg bg-white flex items-center justify-center p-1 border border-slate-700">
              <img 
                src="/assets/aistudio/bkash-logo-horizontal-mobile-banking-app-icon-emblem-transparent-background-free-png_c5fbc9f1.png" 
                alt="bKash" 
                className="h-full object-contain"
              />
            </div>
            <div>
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">bKash Merchant API Studio</span>
              <p className="text-[11px] text-slate-500">
                Dedicated Developer & Merchant Integration Hub for {merchantNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-400">
            <a
              href={OFFICIAL_BKASH_CONTACTS.developerPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition flex items-center gap-1"
            >
              <span>developer.bkash.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`tel:${OFFICIAL_BKASH_CONTACTS.merchantHelpline}`}
              className="hover:text-pink-400 transition flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>Helpline: 16247</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-500">
              API Version: Tokenized Checkout v1.2.0-beta
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
