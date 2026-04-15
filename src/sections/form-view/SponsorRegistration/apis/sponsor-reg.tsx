import axios from 'axios';
import { BASE_URL as API_URL } from 'src/config-global';

const BASE_URL = `${API_URL}/sponsor`;
const EXHIBITOR_BASE_URL = `${API_URL}/exhibitor`;

export interface DocumentVerificationRequest {
  eventId: number;
  email: string;
  docType: string;
  docNumber: string;
}

export interface DocumentVerificationResponse {
  [key: string]: unknown;
}

export interface Council {
  [key: string]: unknown;
}

export interface ProductGroup {
  optLock: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  cohort: string;
  deleted: boolean;
}

export interface GstRegistrationResponse {
  [key: string]: unknown;
}

export interface EmailRegistrationResponse {
  [key: string]: unknown;
}

export interface MobileRegistrationResponse {
  [key: string]: unknown;
}

export interface CalculatePricingRequest {
  sponsorshipType: string;
  sponsorshipPricingCategory: string;
  tds: boolean;
  tdsPercentage: number;
  participationType: string;
  billingState: string;
}

export interface CalculatePricingResponse {
  status: boolean;
  timestamp: string;
  data: {
    optLock: number;
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    id: string | null;
    user: string | null;
    currency: string;
    totalAmount: number;
    calculatedAmount: number;
    gstAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    tdsAmount: number;
    plcAmount: number;
    vatAmount: number | null;
    paidAmount: number;
    proformaInvoiceUrl: string | null;
    preferredStallSides: number;
    preferredFloor: string;
    deleted: boolean;
  };
}

export interface AdditionalDirector {
  prefix: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface ExhibitorRegistrationRequest {
  eventId: string;
  participationType: string;
  companyName: string;
  contactPersonPrefix: string;
  contactPersonFirstName: string;
  contactPersonMiddleName?: string;
  contactPersonLastName: string;
  designation: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  email: string;
  mobile: string;
  billingContactPersonPrefix: string;
  billingContactPersonFirstName: string;
  billingContactPersonMiddleName?: string;
  billingContactPersonLastName: string;
  billingContactPersonDesignation: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingPostalCode: string;
  billingEmail: string;
  billingWebsiteAddress?: string;
  billingContactNumber: string;
  panNumber?: string;
  tanNumber?: string;
  gstNumber?: string;
  vatNumber?: string;
  gstState?: string;
  stateCode?: string;
  exportMarkets?: string;
  iecNumber?: string;
  cinNumber?: string;
  dinNumber?: string;
  directorPrefix: string;
  directorFirstName: string;
  directorMiddleName?: string;
  directorLastName: string;
  additionalDirectors?: AdditionalDirector[];
  isMsme: boolean;
  msmeNumber?: string;
  companyBio: string;
  businessNature: string[];
  otherBusinessNature?: string;
  productGroupId: number;
  councilId: number;
  productCategory: string[];
  productSubCategory?: string[];
  scheme: string;
  area: number;
  preferredFloor: string;
  preferredStallSides: number;
  tds: boolean;
}

export interface ExhibitorRegistrationResponse {
  status: boolean;
  timestamp: string;
  message?: string;
  data?: {
    id: string;
    registrationNumber?: string;
    [key: string]: unknown;
  };
}

export const verifyDocument = async (
  data: DocumentVerificationRequest
): Promise<DocumentVerificationResponse> => {
  try {
    const response = await axios.post<DocumentVerificationResponse>(
      'https://doc-verification.eventstrat.ai/api/v1/document/verify',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || error.message || 'Document verification failed'
      );
    }
    throw error;
  }
};

export const getCouncils = async (): Promise<Council[]> => {
  try {
    const response = await axios.get<{ data: Council[] }>(`${EXHIBITOR_BASE_URL}/councils`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch councils');
    }
    throw error;
  }
};

export const getProductGroups = async (): Promise<ProductGroup[]> => {
  try {
    const response = await axios.get<{ data: ProductGroup[] }>(
      `${EXHIBITOR_BASE_URL}/product-groups`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || error.message || 'Failed to fetch product groups'
      );
    }
    throw error;
  }
};

export const checkGstRegistered = async (
  gstNumber: string,
  productGroupId: number
): Promise<GstRegistrationResponse> => {
  try {
    const response = await axios.get<GstRegistrationResponse>(`${BASE_URL}/gst-registered`, {
      params: {
        gstNumber,
        productGroupId,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.msg || error.message || 'Failed to check GST registration'
      );
    }
    throw error;
  }
};

export const checkEmailRegistered = async (email: string): Promise<EmailRegistrationResponse> => {
  try {
    const response = await axios.get<EmailRegistrationResponse>(`${BASE_URL}/email-registered`, {
      params: {
        email,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.msg || error.message || 'Failed to check email registration'
      );
    }
    throw error;
  }
};

export const checkMobileRegistered = async (
  mobile: string
): Promise<MobileRegistrationResponse> => {
  try {
    const response = await axios.get<MobileRegistrationResponse>(`${BASE_URL}/mobile-registered`, {
      params: {
        mobile,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.msg || error.message || 'Failed to check mobile registration'
      );
    }
    throw error;
  }
};

export const calculatePricing = async (
  data: CalculatePricingRequest
): Promise<CalculatePricingResponse> => {
  try {
    const response = await axios.post<CalculatePricingResponse>(
      `${BASE_URL}/calculate-pricing`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || error.message || 'Failed to calculate pricing'
      );
    }
    throw error;
  }
};

export const registerExhibitor = async (
  data: ExhibitorRegistrationRequest
): Promise<ExhibitorRegistrationResponse> => {
  try {
    const response = await axios.post<ExhibitorRegistrationResponse>(`${BASE_URL}/register`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.msg || error.message || 'Failed to register exhibitor');
    }
    throw error;
  }
};

export interface BuyerProductGroup {
  productGroupId: number | null;
  productGroupName: string;
  productCategories: string[];
}

export interface BuyerRegistrationRequest {
  eventId: string;
  participationType: string;
  email: string;
  companyName: string;
  prefix: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  designation: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  mobileNumber: string;
  whatsappMobileNumber?: string;
  website?: string;
  landlineNumber?: string;
  isFirstVisiting: boolean;
  visitedYear?: string[];
  sourceOfRegistration?: string;
  natureOfBusiness?: string[];
  otherNatureOfBusiness?: string;
  turnOver2223?: string;
  turnOver2324?: string;
  turnOver2425?: string;
  buyerCompanyName?: string;
  buyerCompanyCountries?: string[];
  productGroups: BuyerProductGroup[];
  socialMediaComms?: string[];
  passportNumber?: string;
  gstNumber?: string;
  passportFrontUrl?: string;
  passportBackUrl?: string;
  isOnlineSeller?: boolean;
  onlineSellerAccounts?: string[];
  otherOnlineSellerPlatform?: string;
}

export interface BuyerRegistrationResponse {
  status: boolean;
  timestamp: string;
  message?: string;
  data?: {
    id: string;
    registrationNumber?: string;
    [key: string]: unknown;
  };
}

export const registerBuyer = async (
  data: BuyerRegistrationRequest
): Promise<BuyerRegistrationResponse> => {
  try {
    const response = await axios.post<BuyerRegistrationResponse>(
      `${API_URL}/buyer/register`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message ||
          'Failed to register buyer'
      );
    }
    throw error;
  }
};
