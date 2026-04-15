export type ISpaceData = {
  cgstAmount: string;
  sgstAmount: string;
  igstAmount: string;
  gstAmount: string;
  boothAreaCost: string;
  boothElectricityCost: string;
  balanceAmount: string;
  gstNumber: string;
  panNumber: string;
  tanNumber: string;
  phone: string;
  eventId: number;
  exhibitorId: number;
  companyName: string;
  status: string;
  email: string;
  userCohort: string;
  personName: string;
  city: string;
  gst: string;
  area: string;
  msme: string;
  boothType: string;
  participatedEarlier: string;
  state: string;
  isAssociationBooking: string;
  sponsorshipInterested: string;
  productCategory: string;
  areaRequired: string;
  deptCategory: string;
  bothType: string;
  tds: string;
  billingState: string;
  country: string;
  basePrice: number;
  tdsAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  revenue: number;
  totalAmount: number;
  paymentOption: string | null;
  pendingAmount: number | null;
  successfulAmount: number | null;
  createdDate: string;
  companyEmail: string;
  hallNo?: string;
  stallNo?: string;
  totalPaymentAmount: number;
  latestPaymentStatus: string;
  totalPaidAmount: number;
  currency: string;
  invoiceNumber: string;
};

export type ISpaceTableFilters = {
  companyName: string;
  contact: string;
  status: string;
  scheme: string;
  city: string;
  name: string;
  minArea: string;
  maxArea: string;
};

export type IAllotment = {
  exhibitorId: number;
  hallNo: string;
  stallNo: string;
};

export type brodcastTemplate = {
  eventId: number;
  featureName: string;
  title: string;
  body: string;
  imageUrl: string | null;
  dataForUi: {};
  ctaName: string;
};
export interface IExhibitorFormData {
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  companyGstin: string | null;
  companyOrganizationName: string;
  companyPanNo: string;
  data: {
    udyogAadhaarNumber: string;
    accountPersonEmailAddress: string;
    accountPersonFirstName: string;
    accountPersonLastName: string;
    accountPersonMobileNumber: string;
    additionalDirectors: string[];
    addressLine1: string;
    billingAddressLine1: string;
    billingAddressLine2: string;
    billingCity: string;
    billingCountry: string;
    billingPostalCode: string;
    billingStateProvinceRegion: string;
    bookingViaAssociation: string;
    boothDisplayName: string;
    boothTypePreference: string;
    calculatedTotalCost: number;
    city: string;
    contactPersonDesignation: string;
    country: string;
    departmentCategory: string;
    hasGstNumber: string;
    interestedInSponsorship: string;
    mainObjectives: string[];
    participatedEarlier: string;
    postalCode: string;
    productCategory: string;
    registeredWithMsme: string;
    signatureUrl: string;
    stateProvinceRegion: string;
    tanNumber: string;
    tds: string;
    totalAreaRequired: number;
    proformaInvoice: string;
  };
  directorName: string;
  email: string;
  eventId: number;
  firstName: string;
  image: string;
  imgUrl: string | null;
  lastName: string;
  phone: string;
  userCohort: string;
  exhibitorId: number;
}

export interface IPaymentTransaction {
  id?: number;
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
  paymentOption: string;
  paymentRecieptUrl: string;
  createdAt: string;
  updatedAt: string;
  paymentId: string | null;
  transactionId?: string | null;
  transactionDate?: string;
  paymentMode?: string;
  totalAmount?: number;
  proofUrl?: string | null;
  bankName?: string | null;
  branchName?: string | null;
  paymentReceiptUrl?: string | null;
}

export interface IPaymentData {
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

export interface IPaymentDetailsData {
  paymentTransactions: IPaymentTransaction[];
  paymentData: IPaymentData;
}

export type IPaymentTableFilters = {
  status: string;
  paymentOption: string;
  paymentMethod: string;
  paymentReferenceNumber: string;
};
