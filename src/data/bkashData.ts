import { BkashCredentials, ISP, RechargeOperator, Aggregator } from '../types/bkash';

export const DEFAULT_MERCHANT_NUMBER = '01339562083';

// Official bKash Tokenized Checkout Sandbox credentials for testing
export const SANDBOX_CREDENTIALS: BkashCredentials = {
  merchantNumber: DEFAULT_MERCHANT_NUMBER,
  appKey: '4f6o02dd2rf4oqd5kv37tuceia',
  appSecret: '2is7hdktrekvrflbfbhqiuvbgvfiofcbhnjqadnea04sfqcnt0f0',
  username: 'sandboxTokenizedUser02',
  password: 'sandboxTokenizedUser02@123',
  environment: 'sandbox',
};

export const BKASH_ENDPOINTS = {
  sandbox: {
    baseUrl: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    checkoutUrl: 'https://sandbox.payment.bka.sh/redirect/tokenized',
  },
  production: {
    baseUrl: 'https://tokenized.pay.bka.sh/v1.2.0-beta',
    checkoutUrl: 'https://payment.bka.sh/redirect/tokenized',
  },
};

export const BKASH_STATUS_CODES: Record<string, { en: string; bn: string; type: 'success' | 'error' | 'warning' }> = {
  '0000': {
    en: 'Successful',
    bn: 'লেনদেন সফল হয়েছে',
    type: 'success',
  },
  '2001': {
    en: 'Invalid App Key',
    bn: 'ভুল অ্যাপ কি (App Key সঠিক নয়)',
    type: 'error',
  },
  '2002': {
    en: 'Invalid Payment ID',
    bn: 'পেমেন্ট আইডি খুঁজে পাওয়া যায়নি বা মেয়াদোত্তীর্ণ',
    type: 'error',
  },
  '2003': {
    en: 'Process Failed',
    bn: 'প্রসেসিং ব্যর্থ হয়েছে, পুনরায় চেষ্টা করুন',
    type: 'error',
  },
  '2005': {
    en: 'Invalid Verification Code / OTP',
    bn: 'ভুল ওটিপি (OTP) প্রদান করা হয়েছে',
    type: 'error',
  },
  '2006': {
    en: 'Invalid PIN',
    bn: 'ভুল বিকাশ পিন (PIN) কোড দেওয়া হয়েছে',
    type: 'error',
  },
  '2008': {
    en: 'Insufficient Balance in Customer Account',
    bn: 'গ্রাহকের বিকাশ অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই',
    type: 'error',
  },
  '2023': {
    en: 'Insufficient Balance',
    bn: 'অ্যাকাউন্টে পর্যাপ্ত টাকা নেই',
    type: 'error',
  },
  '2029': {
    en: 'Duplicate Payment Request / Already Executed',
    bn: 'এই পেমেন্টটি ইতিমধ্যে সম্পন্ন করা হয়েছে (ডুপ্লিকেট)',
    type: 'warning',
  },
  '2056': {
    en: 'Transaction Limit Exceeded',
    bn: 'দৈনিক বা মাসিক লেনদেনের সীমা অতিক্রম করেছে',
    type: 'error',
  },
  '5003': {
    en: 'Merchant IP Not Whitelisted',
    bn: 'আপনার সার্ভার আইপি (IP) বিকাশ সিস্টেমে অনুমোদিত নয়',
    type: 'error',
  },
};

export const OFFICIAL_BKASH_CONTACTS = {
  merchantHelpline: '16247',
  corporateHelpline: '+880255663001',
  supportEmail: 'merchant@bkash.com',
  developerSupportEmail: 'pgw@bkash.com',
  portalUrl: 'https://merchant.bkash.com',
  developerPortalUrl: 'https://developer.bkash.com',
  headOffice: 'Shadhinata Tower, Bir Sreshtha Shaheed Jahangir Gate, Dhaka Cantonment, Dhaka 1206',
};

export const INITIAL_TRANSACTIONS: any[] = [];

export const ISP_LIST: ISP[] = [];

export const RECHARGE_OPERATORS: RechargeOperator[] = [];

export const AGGREGATORS: Aggregator[] = [];
