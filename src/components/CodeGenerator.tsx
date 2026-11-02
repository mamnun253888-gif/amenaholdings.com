import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Server, Globe } from 'lucide-react';
import { BkashCredentials, Language } from '../types/bkash';

interface CodeGeneratorProps {
  credentials: BkashCredentials;
  lang: Language;
}

type CodeTab = 'node' | 'php' | 'python' | 'curl' | 'webhook';

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ credentials, lang }) => {
  const [activeTab, setActiveTab] = useState<CodeTab>('node');
  const [copied, setCopied] = useState<boolean>(false);

  const merchantNo = credentials.merchantNumber || '01339562083';
  const appKey = credentials.appKey || 'YOUR_APP_KEY';
  const appSecret = credentials.appSecret || 'YOUR_APP_SECRET';
  const username = credentials.username || 'YOUR_USERNAME';
  const password = credentials.password || 'YOUR_PASSWORD';
  const baseUrl = credentials.environment === 'sandbox'
    ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
    : 'https://tokenized.pay.bka.sh/v1.2.0-beta';

  const snippets: Record<CodeTab, { title: string; filename: string; code: string }> = {
    node: {
      title: 'Node.js & Express Integration',
      filename: 'bkashService.js',
      code: `// ========================================================
// bKash Tokenized Checkout API v1.2.0-beta (Node.js/Express)
// Merchant Account: ${merchantNo}
// ========================================================

const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const BKASH_CONFIG = {
  baseUrl: '${baseUrl}',
  appKey: '${appKey}',
  appSecret: '${appSecret}',
  username: '${username}',
  password: '${password}',
  merchantNumber: '${merchantNo}'
};

// In-memory token cache (refresh every 50 minutes)
let tokenCache = {
  idToken: null,
  expiresAt: 0
};

// 1. Grant Token Helper
async function getBkashToken() {
  const now = Date.now();
  if (tokenCache.idToken && tokenCache.expiresAt > now) {
    return tokenCache.idToken;
  }

  const response = await axios.post(
    \`\${BKASH_CONFIG.baseUrl}/tokenized/checkout/token/grant\`,
    {
      app_key: BKASH_CONFIG.appKey,
      app_secret: BKASH_CONFIG.appSecret
    },
    {
      headers: {
        'Content-Type': 'application/json',
        username: BKASH_CONFIG.username,
        password: BKASH_CONFIG.password
      }
    }
  );

  if (response.data && response.data.id_token) {
    tokenCache.idToken = response.data.id_token;
    tokenCache.expiresAt = now + (response.data.expires_in - 300) * 1000;
    return tokenCache.idToken;
  }
  throw new Error(response.data.statusMessage || 'Failed to grant bKash token');
}

// 2. Create Payment Endpoint
app.post('/api/bkash/create-payment', async (req, res) => {
  try {
    const { amount, invoiceNumber } = req.body;
    const token = await getBkashToken();

    const response = await axios.post(
      \`\${BKASH_CONFIG.baseUrl}/tokenized/checkout/create\`,
      {
        mode: '0011',
        payerReference: '${merchantNo}',
        callbackURL: 'https://yourdomain.com/api/bkash/callback',
        amount: String(amount),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: invoiceNumber || \`INV-\${Date.now()}\`
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`,
          'X-APP-Key': BKASH_CONFIG.appKey
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Callback & Execute Payment
app.get('/api/bkash/callback', async (req, res) => {
  const { paymentID, status } = req.query;

  if (status === 'cancel' || status === 'failure') {
    return res.redirect(\`/payment-failed?reason=\${status}\`);
  }

  try {
    const token = await getBkashToken();
    const executeResponse = await axios.post(
      \`\${BKASH_CONFIG.baseUrl}/tokenized/checkout/execute\`,
      { paymentID },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`,
          'X-APP-Key': BKASH_CONFIG.appKey
        }
      }
    );

    if (executeResponse.data.statusCode === '0000') {
      const { trxID, amount, customerMsisdn } = executeResponse.data;
      // Save order status as PAID in database
      console.log(\`Payment Successful! TrxID: \${trxID}, Amount: \${amount}\`);
      return res.redirect(\`/payment-success?trxID=\${trxID}\`);
    } else {
      return res.redirect(\`/payment-failed?code=\${executeResponse.data.statusCode}\`);
    }
  } catch (error) {
    res.status(500).send('Payment execution error');
  }
});

app.listen(3000, () => console.log('bKash Merchant Server running on port 3000'));
`,
    },
    php: {
      title: 'PHP & Laravel Integration',
      filename: 'BkashController.php',
      code: `<?php
// ========================================================
// bKash Tokenized Checkout API v1.2.0-beta (PHP / Laravel)
// Merchant Account: ${merchantNo}
// ========================================================

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Cache;

class BkashPaymentController extends Controller
{
    private $baseUrl = '${baseUrl}';
    private $appKey = '${appKey}';
    private $appSecret = '${appSecret}';
    private $username = '${username}';
    private $password = '${password}';

    // 1. Get or Refresh Bearer Token
    private function getToken()
    {
        return Cache::remember('bkash_token', 3000, function () {
            $response = Http::withHeaders([
                'username' => $this->username,
                'password' => $this->password,
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/tokenized/checkout/token/grant", [
                'app_key' => $this->appKey,
                'app_secret' => $this->appSecret,
            ]);

            if ($response->successful() && isset($response['id_token'])) {
                return $response['id_token'];
            }
            throw new \\Exception('bKash Token Grant Failed: ' . $response->body());
        });
    }

    // 2. Create Payment
    public function createPayment(Request $request)
    {
        $token = $this->getToken();
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'X-APP-Key' => $this->appKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/tokenized/checkout/create", [
            'mode' => '0011',
            'payerReference' => '${merchantNo}',
            'callbackURL' => route('bkash.callback'),
            'amount' => $request->amount,
            'currency' => 'BDT',
            'intent' => 'sale',
            'merchantInvoiceNumber' => 'INV-' . time(),
        ]);

        return response()->json($response->json());
    }

    // 3. Execute Payment Callback
    public function callback(Request $request)
    {
        $paymentID = $request->get('paymentID');
        $status = $request->get('status');

        if ($status !== 'success') {
            return redirect()->route('checkout.failed')->with('error', 'Payment cancelled');
        }

        $token = $this->getToken();
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'X-APP-Key' => $this->appKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/tokenized/checkout/execute", [
            'paymentID' => $paymentID,
        ]);

        $data = $response->json();

        if (isset($data['statusCode']) && $data['statusCode'] === '0000') {
            // Save TrxID in DB
            $trxID = $data['trxID'];
            return redirect()->route('checkout.success')->with('trxID', $trxID);
        }

        return redirect()->route('checkout.failed')->with('error', $data['statusMessage'] ?? 'Failed');
    }
}
`,
    },
    python: {
      title: 'Python (FastAPI / Requests)',
      filename: 'bkash_service.py',
      code: `# ========================================================
# bKash Tokenized Checkout API v1.2.0-beta (Python FastAPI)
# Merchant Account: ${merchantNo}
# ========================================================

import httpx
from fastapi import FastAPI, HTTPException

app = FastAPI()

BASE_URL = "${baseUrl}"
APP_KEY = "${appKey}"
APP_SECRET = "${appSecret}"
USERNAME = "${username}"
PASSWORD = "${password}"

cached_token = None

async def get_token() -> str:
    global cached_token
    if cached_token:
        return cached_token
    
    url = f"{BASE_URL}/tokenized/checkout/token/grant"
    headers = {
        "Content-Type": "application/json",
        "username": USERNAME,
        "password": PASSWORD
    }
    payload = {
        "app_key": APP_KEY,
        "app_secret": APP_SECRET
    }
    
    async with httpx.AsyncClient() as client:
        res = await client.post(url, headers=headers, json=payload)
        data = res.json()
        if data.get("statusCode") == "0000":
            cached_token = data.get("id_token")
            return cached_token
        raise HTTPException(status_code=400, detail="Token grant failed")

@app.post("/api/bkash/create-payment")
async def create_payment(amount: float, invoice_number: str):
    token = await get_token()
    url = f"{BASE_URL}/tokenized/checkout/create"
    headers = {
        "Authorization": f"Bearer {token}",
        "X-APP-Key": APP_KEY,
        "Content-Type": "application/json"
    }
    body = {
        "mode": "0011",
        "payerReference": "${merchantNo}",
        "callbackURL": "https://yourdomain.com/api/bkash/callback",
        "amount": str(amount),
        "currency": "BDT",
        "intent": "sale",
        "merchantInvoiceNumber": invoice_number
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, headers=headers, json=body)
        return res.json()

@app.post("/api/bkash/execute-payment")
async def execute_payment(payment_id: str):
    token = await get_token()
    url = f"{BASE_URL}/tokenized/checkout/execute"
    headers = {
        "Authorization": f"Bearer {token}",
        "X-APP-Key": APP_KEY,
        "Content-Type": "application/json"
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, headers=headers, json={"paymentID": payment_id})
        return res.json()
`,
    },
    curl: {
      title: 'cURL Terminal Test Commands',
      filename: 'bkash_terminal_tests.sh',
      code: `#!/bin/bash
# ========================================================
# bKash API cURL Scripts for Merchant: ${merchantNo}
# ========================================================

# 1. Grant Token
curl -X POST "${baseUrl}/tokenized/checkout/token/grant" \\
  -H "Content-Type: application/json" \\
  -H "username: ${username}" \\
  -H "password: ${password}" \\
  -d '{
    "app_key": "${appKey}",
    "app_secret": "${appSecret}"
  }'

# 2. Create Payment (Replace <ID_TOKEN> with token from step 1)
curl -X POST "${baseUrl}/tokenized/checkout/create" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <ID_TOKEN>" \\
  -H "X-APP-Key: ${appKey}" \\
  -d '{
    "mode": "0011",
    "payerReference": "${merchantNo}",
    "callbackURL": "https://yourwebsite.com/api/bkash/callback",
    "amount": "1250",
    "currency": "BDT",
    "intent": "sale",
    "merchantInvoiceNumber": "INV-1002"
  }'

# 3. Execute Payment (Replace <PAYMENT_ID> with paymentID from step 2)
curl -X POST "${baseUrl}/tokenized/checkout/execute" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <ID_TOKEN>" \\
  -H "X-APP-Key: ${appKey}" \\
  -d '{
    "paymentID": "<PAYMENT_ID>"
  }'

# 4. Query Payment Status
curl -X POST "${baseUrl}/tokenized/checkout/payment/status" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <ID_TOKEN>" \\
  -H "X-APP-Key: ${appKey}" \\
  -d '{
    "paymentID": "<PAYMENT_ID>"
  }'
`,
    },
    webhook: {
      title: 'Webhook & IPN Listener',
      filename: 'bkashWebhook.js',
      code: `// ========================================================
// bKash IPN (Instant Payment Notification) Webhook Listener
// Merchant: ${merchantNo}
// ========================================================

const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/bkash/webhook', (req, res) => {
  const ipnData = req.body;

  console.log('Received bKash IPN Event:', ipnData);

  // Expected Fields from bKash IPN:
  // {
  //   "dateTime": "2026-10-10 14:30:00",
  //   "debitMSISDN": "017XXXXXXXX",
  //   "creditOrganizationName": "Merchant ${merchantNo}",
  //   "creditShortCode": "${merchantNo}",
  //   "trxID": "BLA98G2X91",
  //   "transactionStatus": "Completed",
  //   "amount": "1250.00",
  //   "currency": "BDT",
  //   "transactionReference": "INV-2026-8921"
  // }

  if (ipnData.transactionStatus === 'Completed') {
    // 1. Verify TrxID in your database
    // 2. Mark order as Paid
    // 3. Send SMS or confirmation email to customer
  }

  // Acknowledge bKash system with HTTP 200
  res.status(200).json({ status: 'ACKNOWLEDGED' });
});

app.listen(4000, () => console.log('IPN Webhook Listener running on port 4000'));
`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Intro card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-pink-400" />
            <span>{lang === 'bn' ? 'প্রস্তুত কোড লাইব্রেরি ও ইন্টিগ্রেশন স্ক্রিপ্ট' : 'Ready Integration Code Library'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {lang === 'bn'
              ? `মার্চেন্ট ${merchantNo} এর জন্য তৈরি সম্পূর্ণ প্রোডাকশন কোড। কপি করে আপনার প্রজেক্টে পেস্ট করুন।`
              : `Production-ready integration scripts customized for merchant ${merchantNo}. Copy and plug into your application.`}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-[#e2136e] hover:bg-[#c2105e] text-white text-xs font-bold rounded-xl shadow-md shadow-pink-900/30 flex items-center gap-2 transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'কোড কপি করুন' : 'Copy Code')}</span>
        </button>
      </div>

      {/* Code Language Switcher */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'node', label: 'Node.js / Express' },
          { id: 'php', label: 'PHP / Laravel' },
          { id: 'python', label: 'Python (FastAPI)' },
          { id: 'curl', label: 'cURL Scripts' },
          { id: 'webhook', label: 'Webhook / IPN' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CodeTab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-slate-800 text-pink-400 border border-slate-700 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Viewer */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-2 text-slate-300 font-bold">{snippets[activeTab].filename}</span>
          </div>

          <span className="text-[11px] text-pink-400 font-mono">
            Tokenized Checkout v1.2.0-beta
          </span>
        </div>

        <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
          <code>{snippets[activeTab].code}</code>
        </pre>
      </div>
    </div>
  );
};
