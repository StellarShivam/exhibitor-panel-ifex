import useSWR, { mutate } from 'swr';
import { memo, useMemo, useCallback } from 'react';

import { fetcher, apiEndpoints, tokenManager, axiosInstance2, endpoints } from 'src/utils/axios';
import { useEventContext } from 'src/components/event-context';
import type { IExhibitorFormData } from 'src/types/form';


export function useExhibitorForm(companyEmail: string, eventId: number) {
  const URL =
    apiEndpoints.form.exhibitorForm +
    `?companyEmail=${encodeURIComponent(companyEmail)}&eventId=${eventId}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedExhibitorForm = useMemo(
    () => ({
      exhibitorForm: (data as IExhibitorFormData) || null,
      exhibitorFormLoading: isLoading,
      error,
      isValidating,
    }),
    [data, isLoading, error, isValidating]
  );

  return memoizedExhibitorForm;
}

export async function updateRegistrationDetails(payload: IExhibitorFormData) {
  const token = tokenManager.getToken(); // Assuming tokenManager handles token retrieval
  const url = apiEndpoints.form.updateForm;
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

export async function generateProformaInvoice(exhibitorId: number) {
  const token = tokenManager.getToken();
  const url = apiEndpoints.form.generateProforma + '?exhibitorId=' + exhibitorId;
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