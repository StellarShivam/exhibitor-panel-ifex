import axios from "axios";
import { useEffect, useState } from "react";
import {BASE_URL} from 'src/config-global';


const API_URL = `${BASE_URL}/api/v1/exhibitor`;

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
      "https://doc-verification.eventstrat.ai/api/v1/document/verify",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Document verification failed"
      );
    }
    throw error;
  }
};

export const getCouncils = async (): Promise<Council[]> => {
  try {
    const response = await axios.get<{ data: Council[] }>(`${API_URL}/councils`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch councils"
      );
    }
    throw error;
  }
};

export const getProductGroups = async (): Promise<ProductGroup[]> => {
  try {
    const response = await axios.get<{ data: ProductGroup[] }>(
      `${API_URL}/product-groups`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch product groups"
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
    const response = await axios.get<GstRegistrationResponse>(
      `${API_URL}/gst-registered`,
      {
        params: {
          gstNumber,
          productGroupId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.msg ||
          error.message ||
          "Failed to check GST registration"
      );
    }
    throw error;
  }
};

export const checkEmailRegistered = async (
  email: string
): Promise<EmailRegistrationResponse> => {
  try {
    const response = await axios.get<EmailRegistrationResponse>(
      `${API_URL}/email-registered`,
      {
        params: {
          email,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.msg ||
          error.message ||
          "Failed to check email registration"
      );
    }
    throw error;
  }
};

export const checkMobileRegistered = async (
  mobile: string
): Promise<MobileRegistrationResponse> => {
  try {
    const response = await axios.get<MobileRegistrationResponse>(
      `${API_URL}/mobile-registered`,
      {
        params: {
          mobile,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.msg ||
          error.message ||
          "Failed to check mobile registration"
      );
    }
    throw error;
  }
};

export const registerExhibitor = async (
  data: ExhibitorRegistrationRequest
): Promise<ExhibitorRegistrationResponse> => {
  try {
    const response = await axios.post<ExhibitorRegistrationResponse>(
      `${API_URL}/register`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.msg ||
          error.message ||
          "Failed to register exhibitor"
      );
    }
    throw error;
  }
};

export interface CalculatePricingRequest {
  preferredStallSides: number;
  participationType: string;
  preferredFloor: string;
  scheme: string;
  area: number;
  tds: boolean;
  tdsPercentage: number;
  billingState?: string;
  eventType: string;
  hasPreferredLocation: boolean;
  iifMember: boolean;
}

export interface CalculatePricingData {
  currency: string;
  calculatedAmount: number;
  totalAmount: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  tdsAmount: number;
  calculatedAmountPlc: number;
  gstAmountPlc: number;
  calculatedAmountIifMember: number;
}

export interface CalculatePricingResponse {
  status: boolean;
  data: CalculatePricingData;
}

export const calculatePricing = async (
  payload: CalculatePricingRequest
): Promise<CalculatePricingResponse> => {
  const response = await axios.post<CalculatePricingResponse>(
    `${BASE_URL}/calculate-pricing`,
    payload,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export interface BusinessOption {
  id: string;
  name: string;
  value: string;
  label: string;
}

export const useBusinessOptions = () => {
  const [options, setOptions] = useState<BusinessOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/business`);
        const formattedOptions = response?.data?.data?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setOptions(formattedOptions);
      } catch (err) {
        setError("Failed to fetch business options");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessOptions();
  }, []);

  return { options, loading, error };
};

export interface CategoryOption {
  id: string;
  name: string;
  value: string;
  label: string;
}

export const useCategoryOptions = () => {
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/categories`);
        const formattedOptions = response?.data?.data?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setOptions(formattedOptions);
      } catch (err) {
        setError("Failed to fetch category options");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryOptions();
  }, []);

  return { options, loading, error };
};