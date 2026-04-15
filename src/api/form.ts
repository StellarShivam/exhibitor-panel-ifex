import useSWR, { mutate } from 'swr';
import { memo, useMemo, useCallback } from 'react';

import { fetcher, apiEndpoints, tokenManager, axiosInstance2, endpoints } from 'src/utils/axios';
import { useEventContext } from 'src/components/event-context';
import type { IExhibitorFormData } from 'src/types/form';

export function useExhibitorForm() {
  const URL = apiEndpoints.form.exhibitorForm;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const reFetchExhibitorForm = useCallback(() => mutate(URL), [URL]);

  const memoizedExhibitorForm = useMemo(
    () => ({
      exhibitorForm: (data as any) || null,
      exhibitorFormLoading: isLoading,
      error,
      isValidating,
      reFetchExhibitorForm,
    }),
    [data, isLoading, error, isValidating, reFetchExhibitorForm]
  );

  return memoizedExhibitorForm;
}

export function useBuyerForm() {
  const URL = apiEndpoints.form.buyerForm;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const reFetchExhibitorForm = useCallback(() => mutate(URL), [URL]);

  const memoizedExhibitorForm = useMemo(
    () => ({
      exhibitorForm: (data as any) || null,
      exhibitorFormLoading: isLoading,
      error,
      isValidating,
      reFetchExhibitorForm,
    }),
    [data, isLoading, error, isValidating, reFetchExhibitorForm]
  );

  return memoizedExhibitorForm;
}

export function useSponsorForm() {
  const URL = apiEndpoints.form.sponsorForm;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const reFetchExhibitorForm = useCallback(() => mutate(URL), [URL]);

  const memoizedExhibitorForm = useMemo(
    () => ({
      exhibitorForm: (data as any) || null,
      exhibitorFormLoading: isLoading,
      error,
      isValidating,
      reFetchExhibitorForm,
    }),
    [data, isLoading, error, isValidating, reFetchExhibitorForm]
  );

  return memoizedExhibitorForm;
}


export async function generateSponsorProformaInvoice(urn: string) {
  const token = tokenManager.getToken();
  const url = apiEndpoints.form.generateSponsorsProforma + urn;
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

export async function generateProformaInvoice(urn: string) {
  const token = tokenManager.getToken();
  const url = apiEndpoints.form.generateProforma + urn;
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

export async function getViewFormData() {
  const token = tokenManager.getToken();
  const url = apiEndpoints.form.buyerForm;
  console.log(token)
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axiosInstance2.get(url, { headers });
    return response.data.metaData?.data?.formData || null;
  } catch (error) {
    console.error('Error fetching view form data:', error);
    throw error;
  }
}

export function useEditExhibitorForm() {
  const editExhibitorForm = async (form: any) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post(apiEndpoints.form.editForm, form, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    editExhibitorForm,
  };
}
export function useEditSponsorForm() {
  const editExhibitorForm = async (form: any) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post(apiEndpoints.form.editForm, form, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    editExhibitorForm,
  };
}
