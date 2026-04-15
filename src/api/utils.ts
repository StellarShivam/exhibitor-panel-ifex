import axios from "axios";
import { BASE_URL } from "src/config-global";
const API_URL = `${BASE_URL}/api/v1`; // You can set this to your actual API base URL
import { useState, useEffect } from "react";
import type { FieldOption } from "src/context/SchemaFormRenderer";

// ─── Document Verification ────────────────────────────────────────────────────

export interface DocumentVerificationRequest {
  eventId: number;
  email: string;
  docType: "PAN" | "GST" | "TAN" | "MSME" | string;
  docNumber: string;
}

export interface DocumentVerificationData {
  status: string | null;
  docNumber: string;
  name: string | null;
  valid: boolean;
  branch: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
}

export interface DocumentVerificationResponse {
  status: boolean;
  msg: string;
  timestamp: string;
  data: DocumentVerificationData;
}

export interface EmailRegistrationResponse {
  [key: string]: unknown;
}

export interface MobileRegistrationResponse {
  [key: string]: unknown;
}

export const verifyDocument = async (
  request: DocumentVerificationRequest
): Promise<DocumentVerificationResponse> => {
  const response = await axios.post<DocumentVerificationResponse>(
    "https://doc-verification.eventstrat.ai/api/v1/document/verify",
    request,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic T1gwajRlSVQ2TENUT29ZanBkLjZiY2E2YjY0ZTlhNWI0ZGVlMGQ3NWVjZTk4NDg0NWVhOjA0N2FlNzM0ZmMwZmQ2NTc2M2Q4OGNmNGNkZmY5Mzc3OTBhNWFlNzFhYTU0YWQ2ZQ==",
      },
    }
  );
  return response.data;
};

export const checkEmailRegistered = async (
  email: string
): Promise<EmailRegistrationResponse> => {
  try {
    const response = await axios.get<EmailRegistrationResponse>(
      `${API_URL}/exhibitor/email-registered`,
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
      // 409 Conflict means email is already registered
      if (error.response?.status === 409) {
        return {
          registered: true,
          data: { registered: true },
        } as unknown as EmailRegistrationResponse;
      }
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
      `${API_URL}/exhibitor/mobile-registered`,
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
      // 409 Conflict means mobile is already registered
      if (error.response?.status === 409) {
        return {
          registered: true,
          data: { registered: true },
        } as unknown as MobileRegistrationResponse;
      }
      throw new Error(
        error.response?.data?.msg ||
          error.message ||
          "Failed to check mobile registration"
      );
    }
    throw error;
  }
};

// ─── File Upload to S3 ────────────────────────────────────────────────────────

export interface FileUploadResponse {
  status: boolean;
  msg: string;
  data: {
    storeUrl: string;
    [key: string]: unknown;
  };
}

export const uploadFileToS3 = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<FileUploadResponse>(
      'https://upits-web.eventstrat.ai/api/auth/api/file/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data.data.storeUrl) {
      throw new Error('No store URL returned from upload service');
    }

    return response.data.data.storeUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.msg ||
          error.message ||
          'Failed to upload file to S3'
      );
    }
    throw error;
  }
};


export interface MembershipPricingOption {
  id: number;
  name: string;
}

export const useMembershipPricingOptions = (
  participationType: string = "INDIAN_PARTICIPANT"
) => {
  const [options, setOptions] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembershipPricing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/membership-pricing`, {
          params: { participationType },
        });
        const formattedOptions = (response?.data?.data ?? []).map((item: MembershipPricingOption) => ({
          label: item.name,
          value: item.id,
        }));
        setOptions(formattedOptions);
      } catch (err) {
        setError("Failed to fetch membership pricing options");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPricing();
  }, [participationType]);

  return { options, loading, error };
};