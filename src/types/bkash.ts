export type Language = 'bn' | 'en';
export type Environment = 'sandbox' | 'production';

export interface BkashCredentials {
  merchantNumber: string;
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  environment: Environment;
}

export interface BkashTokenResponse {
  statusCode: string;
  statusMessage: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface BkashCreatePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  createTime: string;
  orgLogo?: string;
  orgName?: string;
}

export interface BkashExecutePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  payerReference?: string;
  customerMsisdn: string;
  trxID: string;
  amount: string;
  transactionStatus: 'Completed' | 'Initiated' | 'Failed' | 'Refunded';
  paymentExecuteTime: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
}

export interface BkashQueryPaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  mode: string;
  payerReference: string;
  customerMsisdn: string;
  trxID: string;
  amount: string;
  transactionStatus: string;
  verificationStatus: string;
  initiationTime: string;
  executionTime: string;
  currency: string;
}

export interface BkashRefundResponse {
  statusCode: string;
  statusMessage: string;
  originalTrxID: string;
  refundTrxID: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  completedTime: string;
}

export interface TransactionRecord {
  id: string;
  paymentId: string;
  trxId: string;
  merchantNumber: string;
  customerNumber: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  reference: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  timestamp: string;
  environment: Environment;
  refundTrxId?: string;
  lineStatus?: 'Up' | 'Down';
  customerName?: string;
}

export interface MikrotikConfig {
  host: string;
  username: string;
  port: number;
}

export interface ApiCallLog {
  id: string;
  endpoint: string;
  method: string;
  status: number;
  timestamp: string;
  requestHeaders: Record<string, string>;
  requestBody: unknown;
  responseBody: unknown;
  durationMs: number;
}

export interface ISP {
  id: string;
  name: string;
  billerCode: string;
  category: string;
}

export interface RechargeOperator {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface Aggregator {
  id: string;
  name: string;
  website: string;
  icon: string;
}
