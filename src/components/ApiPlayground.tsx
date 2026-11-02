import React, { useState } from 'react';
import { 
  Key, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Code2,
  ExternalLink
} from 'lucide-react';
import { BkashCredentials, Environment, Language } from '../types/bkash';
import { BKASH_ENDPOINTS, BKASH_STATUS_CODES, SANDBOX_CREDENTIALS } from '../data/bkashData';

interface ApiPlaygroundProps {
  credentials: BkashCredentials;
  setCredentials: (creds: BkashCredentials) => void;
  lang: Language;
}

type EndpointKey = 'grant_token' | 'create_payment' | 'execute_payment' | 'query_payment' | 'refund_payment';

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({
  credentials,
  setCredentials,
  lang,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointKey>('grant_token');
  const [idToken, setIdToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sandbox_token_mock_auth_sample_id_token_bkash_pgw');
  const [paymentId, setPaymentId] = useState<string>('TR00118671991042');
  const [amount, setAmount] = useState<string>('1250');
  const [trxId, setTrxId] = useState<string>('BLA98G2X91');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedRes, setCopiedRes] = useState<boolean>(false);

  // Response state
  const [responseStatus, setResponseStatus] = useState<number>(200);
  const [responseCode, setResponseCode] = useState<string>('0000');
  const [responseJson, setResponseJson] = useState<any>({
    statusCode: '0000',
    statusMessage: 'Successful',
    id_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sandbox_token_mock_auth_sample_id_token_bkash_pgw',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'rf_sandbox_refresh_token_example_bkash_49201',
  });

  const baseUrl = credentials.environment === 'sandbox' 
    ? BKASH_ENDPOINTS.sandbox.baseUrl 
    : BKASH_ENDPOINTS.production.baseUrl;

  const endpointsMeta: Record<EndpointKey, { nameBn: string; nameEn: string; method: string; path: string }> = {
    grant_token: {
      nameBn: '১. টোকেন গ্রান্ট (Grant Token)',
      nameEn: '1. Grant Token API',
      method: 'POST',
      path: '/tokenized/checkout/token/grant',
    },
    create_payment: {
      nameBn: '২. পেমেন্ট তৈরি (Create Payment)',
      nameEn: '2. Create Payment API',
      method: 'POST',
      path: '/tokenized/checkout/create',
    },
    execute_payment: {
      nameBn: '৩. পেমেন্ট এক্সিকিউট (Execute Payment)',
      nameEn: '3. Execute Payment API',
      method: 'POST',
      path: '/tokenized/checkout/execute',
    },
    query_payment: {
      nameBn: '৪. পেমেন্ট স্ট্যাটাস (Query Payment)',
      nameEn: '4. Query Payment Status',
      method: 'POST',
      path: '/tokenized/checkout/payment/status',
    },
    refund_payment: {
      nameBn: '৫. রিফান্ড (Refund Transaction)',
      nameEn: '5. Refund Transaction API',
      method: 'POST',
      path: '/tokenized/checkout/payment/refund',
    },
  };

  const getHeaders = () => {
    switch (selectedEndpoint) {
      case 'grant_token':
        return {
          'Content-Type': 'application/json',
          username: credentials.username || 'sandboxTokenizedUser02',
          password: credentials.password || 'sandboxTokenizedUser02@123',
        };
      default:
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken.slice(0, 30)}...`,
          'X-APP-Key': credentials.appKey,
        };
    }
  };

  const getRequestBody = () => {
    switch (selectedEndpoint) {
      case 'grant_token':
        return {
          app_key: credentials.appKey,
          app_secret: credentials.appSecret,
        };
      case 'create_payment':
        return {
          mode: '0011',
          payerReference: '01712345678',
          callbackURL: 'https://yourwebsite.com/api/bkash/callback',
          amount: amount,
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        };
      case 'execute_payment':
        return {
          paymentID: paymentId,
        };
      case 'query_payment':
        return {
          paymentID: paymentId,
        };
      case 'refund_payment':
        return {
          paymentID: paymentId,
          amount: amount,
          trxID: trxId,
          sku: 'ITEM-DEFAULT',
          reason: 'Customer return / test refund',
        };
    }
  };

  const handleExecuteRequest = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setResponseStatus(200);

      switch (selectedEndpoint) {
        case 'grant_token': {
          const newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token_' + Math.random().toString(36).substring(2);
          setIdToken(newToken);
          setResponseCode('0000');
          setResponseJson({
            statusCode: '0000',
            statusMessage: 'Successful',
            id_token: newToken,
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'rf_bkash_' + Math.random().toString(36).substring(2),
          });
          break;
        }
        case 'create_payment': {
          const newPid = 'TR0011' + Date.now().toString().slice(-8);
          setPaymentId(newPid);
          setResponseCode('0000');
          setResponseJson({
            statusCode: '0000',
            statusMessage: 'Successful',
            paymentID: newPid,
            bkashURL: `${credentials.environment === 'sandbox' ? BKASH_ENDPOINTS.sandbox.checkoutUrl : BKASH_ENDPOINTS.production.checkoutUrl}?paymentID=${newPid}`,
            callbackURL: 'https://yourwebsite.com/api/bkash/callback',
            amount: amount,
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            createTime: new Date().toISOString(),
            orgLogo: 'https://scripts.sandbox.bka.sh/resources/img/bkash_logo.png',
            orgName: `Merchant (${credentials.merchantNumber})`,
          });
          break;
        }
        case 'execute_payment': {
          const generatedTrx = 'BLA' + Math.random().toString(36).substring(2, 9).toUpperCase();
          setTrxId(generatedTrx);
          setResponseCode('0000');
          setResponseJson({
            statusCode: '0000',
            statusMessage: 'Successful',
            paymentID: paymentId,
            payerReference: '01712345678',
            customerMsisdn: '01712345678',
            trxID: generatedTrx,
            amount: amount,
            transactionStatus: 'Completed',
            paymentExecuteTime: new Date().toISOString(),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: 'INV-8921',
          });
          break;
        }
        case 'query_payment': {
          setResponseCode('0000');
          setResponseJson({
            statusCode: '0000',
            statusMessage: 'Successful',
            paymentID: paymentId,
            mode: '0011',
            payerReference: '01712345678',
            customerMsisdn: '01712345678',
            trxID: trxId,
            amount: amount,
            transactionStatus: 'Completed',
            verificationStatus: 'Complete',
            initiationTime: new Date(Date.now() - 60000).toISOString(),
            executionTime: new Date().toISOString(),
            currency: 'BDT',
          });
          break;
        }
        case 'refund_payment': {
          const refundTrx = 'BLR' + Math.random().toString(36).substring(2, 9).toUpperCase();
          setResponseCode('0000');
          setResponseJson({
            statusCode: '0000',
            statusMessage: 'Successful',
            originalTrxID: trxId,
            refundTrxID: refundTrx,
            transactionStatus: 'Completed',
            amount: amount,
            currency: 'BDT',
            completedTime: new Date().toISOString(),
          });
          break;
        }
      }
    }, 700);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(responseJson, null, 2));
    setCopiedRes(true);
    setTimeout(() => setCopiedRes(false), 2000);
  };

  const handleResetSandbox = () => {
    setCredentials(SANDBOX_CREDENTIALS);
  };

  const statusExplanation = BKASH_STATUS_CODES[responseCode];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
              {lang === 'bn' ? 'সরাসরি এপিআই টেস্টিং কনসোল' : 'Interactive API Console'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'বিকাশ টোকেনাইজড এপিআই প্লেগ্রাউন্ড' : 'bKash Tokenized API Playground'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn' 
              ? 'সার্ভার ছাড়াই বিকাশের Grant Token, Create, Execute এবং Query Payment এপিআই টেস্ট ও ভেরিফাই করুন।' 
              : 'Test and inspect request payloads and live response structures for bKash Tokenized Checkout APIs.'}
          </p>
        </div>

        <button
          onClick={handleResetSandbox}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-pink-400" />
          <span>{lang === 'bn' ? 'স্যান্ডবক্স কি রিস্টোর' : 'Reset Sandbox Keys'}</span>
        </button>
      </div>

      {/* Credentials Accordion / Input Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-bold text-white">
              {lang === 'bn' ? 'মার্চেন্ট এপিআই ক্রেডেনশিয়াল' : 'Merchant API Credentials'}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Merchant: <strong className="text-pink-400">{credentials.merchantNumber}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:border-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:border-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">App Key</label>
            <input
              type="text"
              value={credentials.appKey}
              onChange={(e) => setCredentials({ ...credentials, appKey: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:border-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">App Secret</label>
            <input
              type="password"
              value={credentials.appSecret}
              onChange={(e) => setCredentials({ ...credentials, appSecret: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:border-pink-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {(Object.keys(endpointsMeta) as EndpointKey[]).map((key) => {
          const item = endpointsMeta[key];
          const isSelected = selectedEndpoint === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedEndpoint(key)}
              className={`whitespace-nowrap px-3.5 py-2 text-xs font-semibold rounded-xl border transition ${
                isSelected
                  ? 'bg-pink-600/20 text-pink-300 border-pink-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
              }`}
            >
              {lang === 'bn' ? item.nameBn : item.nameEn}
            </button>
          );
        })}
      </div>

      {/* Request and Response Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Request Console */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                {endpointsMeta[selectedEndpoint].method}
              </span>
              <span className="font-mono text-xs text-slate-300 truncate max-w-xs">
                {endpointsMeta[selectedEndpoint].path}
              </span>
            </div>
            <button
              onClick={handleExecuteRequest}
              disabled={loading}
              className="px-3.5 py-1.5 bg-[#e2136e] hover:bg-[#c2105e] text-white text-xs font-bold rounded-lg shadow-md shadow-pink-900/30 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{lang === 'bn' ? 'অনুরোধ পাঠান' : 'Send Request'}</span>
            </button>
          </div>

          {/* Target Base URL */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 truncate">
            <span className="text-pink-400 font-semibold">Endpoint: </span>
            {baseUrl}{endpointsMeta[selectedEndpoint].path}
          </div>

          {/* Headers Box */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400">Request Headers</span>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
              {Object.entries(getHeaders()).map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px]">
                  <span className="text-slate-500">{k}:</span>
                  <span className="text-slate-300 font-semibold truncate max-w-[240px]">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Request Payload JSON */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400">Request Body (JSON)</span>
            <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300/90 overflow-x-auto leading-relaxed">
              {JSON.stringify(getRequestBody(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Right: Response Console */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">HTTP Response</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold border border-emerald-500/20">
                {responseStatus} OK
              </span>
              <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 font-mono text-xs font-semibold border border-pink-500/20">
                Code: {responseCode}
              </span>
            </div>

            <button
              onClick={handleCopyResponse}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              {copiedRes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRes ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Status Explanation Box */}
          {statusExplanation && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">
                  {lang === 'bn' ? statusExplanation.bn : statusExplanation.en}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  bKash Status Code <strong>{responseCode}</strong>: Standard successful execution response.
                </p>
              </div>
            </div>
          )}

          {/* Response JSON */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400">Response Payload (JSON)</span>
            <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400/90 overflow-x-auto max-h-[340px] leading-relaxed">
              {JSON.stringify(responseJson, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
