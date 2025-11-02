export interface IPaymentSummaryTransaction {
  email: string;
  eventId: number;
  finalAmount: string;
  actualAmount: string;
  gst: string;
  paymentMethod: string;
  orderId: string;
  data: any; 
  paymentStatus:  string;
  paymentOption: string;
  createdAt: string;
  updatedAt: string;
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
  plcAmount: number;
  gstAmount: number;
  tdsAmount: number;
  totalAmount: number;
  buyPremiumLocation: string;
}

export interface IPaymentSummaryDetailsData {
  paymentTransactions: IPaymentSummaryTransaction[];
  paymentData: IPaymentSummaryData;
}

export type IPaymentSummaryTableFilters = {
    status: string;
    paymentOption: string;
    paymentMethod: string;
    paymentReferenceNumber: string;
};

