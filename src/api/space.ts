import useSWR, { mutate } from 'swr';
import { memo, useMemo, useCallback } from 'react';

import {
  fetcher,
  apiEndpoints,
  tokenManager,
  axiosInstance2,
  fetcherWithMeta,
} from 'src/utils/axios';
import type {
  brodcastTemplate,
  IAllotment,
  IExhibitorFormData,
  IPaymentDetailsData,
} from 'src/types/space';
import { broadCastContsantURL } from './broadcast';

export function useGetExhibitorForm() {
  const URL = apiEndpoints.form.exhibitorForm;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refetchExhibitorForm = useCallback(() => {
    if (URL) mutate(URL);
  }, [URL]);

  const memoizedExhibitorForm = useMemo(
    () => ({
      exhibitorForm: (data as IExhibitorFormData) || null,
      exhibitorFormLoading: isLoading,
      error,
      isValidating,
      refetchExhibitorForm,
    }),
    [data, isLoading, error, isValidating, refetchExhibitorForm]
  );

  return memoizedExhibitorForm;
}

export async function generateProformaInvoice(urnNumber: string) {
  const token = tokenManager.getToken();
  const url = apiEndpoints.form.generateProforma + urnNumber;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axiosInstance2.get(url, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error generating proformaInvoice:', error);
    throw error;
  }
}

export function generateAllotMentForm(exhibitorId: number) {
  const URL = apiEndpoints.form.generateAllotMentForm + '?exhibitorId=' + exhibitorId;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedAllotmentGenerated = useMemo(
    () => ({
      allotmentForm: data,
      allotmentFormLoading: isLoading,
      error,
      isValidating,
    }),
    [data, isLoading, error, isValidating]
  );
  return memoizedAllotmentGenerated;
}

export async function updateRegistrationDetails(payload: any, urnNumber: string) {
  const token = tokenManager.getToken(); // Assuming tokenManager handles token retrieval
  const url = apiEndpoints.form.updateForm + urnNumber;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axiosInstance2.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating registration details:', error);
    throw new Error(error?.response?.data?.msg || 'Failed to update registration details. Please try again.');
  }
}

export async function updateDepartmentExhibitorDetails(payload: IExhibitorFormData) {
  const token = tokenManager.getToken(); // Assuming tokenManager handles token retrieval
  const url = apiEndpoints.form.updateFormDepartmentExhibitor;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axiosInstance2.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating registration details:', error);
    throw error;
  }
}