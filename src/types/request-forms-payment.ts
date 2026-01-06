export type ICreatePaymentPayload = {
  exhibitorFormDetailId: number;
  orderId?: string;
  paymentOption?: string;
  paymentMethod?: string;
  transactionDate?: string;
  bankName?: string;
  ifscCode?: string;
  amount: number;
  data?: any;
};

export type IVerifyPaymentPayload = {
  signature: string;
  paymentId: string;
  orderId: string;
};

export type IGetFormTransactionsResponse = {
  exhibitorId: number;
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  transactions: IFormTransactions[];
};

export type IFormTransactions = {
  formPurchaseId: number;
  eventId: number;
  exhibitorId: number;
  exhibitorFormId: number | null;
  formName: string;
  exhibitorFormDetailId: number;
  amount: number;
  paymentMode: string;
  paymentMethod: string;
  paymentStatus: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  transactionDate: string;
  gatewayOrderId: string;
  paymentId: string;
  gatewayTransactionId: string;
  currency: string;
  paymentReceiptUrl: string;
  createdAt: string;
  updatedAt: string;
};
