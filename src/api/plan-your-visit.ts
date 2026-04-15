import useSWR from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

// ----------------------------------------------------------------------

export interface VisaLetterPayload {
  arrivalDate: string;
  arrivalTicket: string;
  departureDate: string;
  departureTicket: string;
  needsVisaAssistance: boolean;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  nationality: string;
}

export interface VisaLetterUpdatePayload {
  arrivalDate: string;
  arrivalTicket: string;
  departureDate: string;
  departureTicket: string;
}

// ----------------------------------------------------------------------

export function useGetVisaLetter() {
  const URL = apiEndpoints.planYourVisit.get;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const reFetch = useCallback(() => mutate(), [mutate]);

  const memoizedValue = useMemo(
    () => ({
      visaLetterData: data || null,
      visaLetterLoading: isLoading,
      visaLetterError: error,
      visaLetterValidating: isValidating,
      reFetch,
    }),
    [data, error, isLoading, isValidating, reFetch]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSubmitVisaLetter() {
  const submitVisaLetter = async (payload: VisaLetterPayload) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post(
        apiEndpoints.planYourVisit.submit,
        payload,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return { submitVisaLetter };
}

// ----------------------------------------------------------------------

export function useUpdateVisaLetter() {
  const updateVisaLetter = async (payload: VisaLetterUpdatePayload) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.put(
        apiEndpoints.planYourVisit.update,
        payload,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return { updateVisaLetter };
}
