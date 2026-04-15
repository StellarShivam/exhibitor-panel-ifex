export interface IPaymentSummaryTransaction {
  email: string;
  eventId: number;
  finalAmount: string;
  actualAmount: string;
  gst: string;
  paymentMethod: string | null;
  orderId: string;
  purchaseId: number;
  data: any;
  paymentStatus: string;
  paymentOption?: string; // Legacy field, kept for backward compatibility
  paymentMode?: string; // New field matching API response
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
  transactionId?: string | null;
  paymentId?: string | null;
  paymentReceiptUrl?: string | null;
}

export interface IPaymentSummaryData {
  country: string;
  accountPersonFirstName: string;
  tds: string;
  billingAddressLine1: string;
  city: string;
  billingAddressLine2: string;
  postalCode: string;
  signatureUrl: string;
  totalAreaRequired: number;
  productCategory: string;
  interestedInSponsorship: string;
  boothDisplayName: string;
  departmentCategory: string;
  registeredWithMsme: string;
  stateProvinceRegion: string;
  boothTypePreference: string;
  alternateMobileNumber: string;
  addressLine1: string;
  billingCountry: string;
  addressLine2: string;
  mainObjectives: string[];
  accountPersonLastName: string;
  participatedEarlier: string;
  accountPersonMobileNumber: string;
  billingStateProvinceRegion: string;
  contactPersonDesignation: string;
  hasGstNumber: string;
  tanNumber: string;
  calculatedTotalCost: number;
  billingPostalCode: string;
  additionalDirectors: string[];
  bookingViaAssociation: string;
  accountPersonEmailAddress: string;
  billingCity: string;
  boothAreaCost: string;
  boothElectricityCost: string;
}

export interface IPaymentSummaryDetailsData {
  paymentTransactions: IPaymentSummaryTransaction[];
  paymentData: IPaymentSummaryData;
}

export type IPaymentSummaryTableFilters = {
  status: string;
  paymentMode: string;
  paymentMethod: string;
  paymentReferenceNumber: string;
};
