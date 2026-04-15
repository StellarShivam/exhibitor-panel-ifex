import useSWR, { mutate } from 'swr';
import { memo, useMemo, useCallback } from 'react';

import { fetcher, apiEndpoints, tokenManager, axiosInstance2, endpoints } from 'src/utils/axios';
import { useEventContext } from 'src/components/event-context';
import type {
  IExhibitorFormData,
  IFormListItem,
  IGetFormDataResponse,
  ISaveFormBody,
} from 'src/types/forms';
import { ITeamMemberCreate } from 'src/types/team';

export function useExhibitorForm(companyEmail: string, eventId: number) {
  const URL =
    apiEndpoints.forms.exhibitorForm +
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

export function useGetFormsList() {
  const URL = apiEndpoints.forms.listing;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchForms = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      forms: (data as IFormListItem[]) || [],
      formsLoading: isLoading,
      formsError: error,
      formsValidating: isValidating,
      formsEmpty: !isLoading && !data?.length,
      reFetchForms,
    }),
    [data, error, isLoading, isValidating, reFetchForms]
  );

  return memoizedValue;
}

export function useGetFormData(formDetailId: number | null) {
  const URL = formDetailId ? apiEndpoints.forms.formData + formDetailId : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchFormData = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      formData: (data as IGetFormDataResponse) || [],
      formDataLoading: isLoading,
      formDataError: error,
      formDataValidating: isValidating,
      formDataEmpty: !isLoading && !data?.length,
      reFetchFormData,
    }),
    [data, error, isLoading, isValidating, reFetchFormData]
  );

  return memoizedValue;
}

export function useSaveForm() {
  const saveForm = async (form: ISaveFormBody) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<ISaveFormBody>(apiEndpoints.forms.saveForm, form, {
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
    saveForm,
  };
}

export function useResubmitForm() {
  const resubmitForm = async (form: ISaveFormBody) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<ISaveFormBody>(apiEndpoints.forms.resubmit, form, {
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
    resubmitForm,
  };
}
