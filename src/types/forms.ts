export interface IExhibitorFormData {
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  companyGstin: string | null;
  companyOrganizationName: string;
  companyPanNo: string;
  data: {
    directorTitle: string;
    contactPersonTitle: string;
    type: string;
    alternateMobileNumber: string;
    alternateEmailAddress: string;
    addressLine2: string;
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
    existingMemberOfIda: string;
    idaNumber: string;
    currency: string;
    preferenceStallNumber: string;
    designation: string;
    industry: string;
    otherIndustry: string;
    otherDepartmentCategory: string;
    otherObjective: string;
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
}

export interface IFormListItem {
  formId: number;
  name: string;
  eventId: number;
  status: string | null;
  exhibitorFormId: number | null;
  dueDate: string | null;
  isAutoApproved: boolean;
  isMandatoryForBare: boolean;
  isMandatoryForShell: boolean;
  required: boolean;
}

export type IFormList = IFormListItem[];

export interface ISaveFormBody {
  formId: number;
  data: any;
}

export interface IFormLog {
  reason: string | null;
  changeType: string;
  createdAt: string;
  data?: any;
}

export interface IGetFormDataResponse {
  logs: IFormLog[];
  formDetail: any;
}
