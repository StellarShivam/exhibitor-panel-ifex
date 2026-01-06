import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';
import {
  ICreatePaymentPayload,
  IVerifyPaymentPayload,
  IGetFormTransactionsResponse,
} from 'src/types/request-forms-payment';

export function useCreatePayment() {
  const createPayment = async (payload: ICreatePaymentPayload) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post(
        apiEndpoints.requestFormPayments.createPayment,
        payload,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response?.data;
    } catch (err: any) {
      return err;
    }
  };

  return {
    createPayment,
  };
}

export function useVerifyPayment() {
  const verifyPayment = async (payload: IVerifyPaymentPayload) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post(
        apiEndpoints.requestFormPayments.verifyPayment,
        payload,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response?.data;
    } catch (err: any) {
      return err;
    }
  };

  return {
    verifyPayment,
  };
}

export function useGetFormTransactions(exhibitorId: number | null) {
  const URL = exhibitorId ? apiEndpoints.requestFormPayments.formTransactions + exhibitorId : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchFormTransactions = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      formTransactions: (data as IGetFormTransactionsResponse) || [],
      formTransactionsLoading: isLoading,
      formTransactionsError: error,
      formTransactionsValidating: isValidating,
      formTransactionsEmpty: !isLoading && !data?.length,
      reFetchFormTransactions,
    }),
    [data, error, isLoading, isValidating, reFetchFormTransactions]
  );

  return memoizedValue;
}
