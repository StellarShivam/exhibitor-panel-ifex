import { useCallback, useMemo } from 'react';
import { IPaymentSummaryDetailsData } from 'src/types/payment-summary';
import { apiEndpoints, axiosInstance2, fetcher, tokenManager } from 'src/utils/axios';
import useSWR, { mutate } from 'swr';

export function usePaymentBySponsorID() {
  const URL = apiEndpoints.paymentSummary.sponsorPayment;
  const { data, isLoading, error, isValidating } = useSWR<IPaymentSummaryDetailsData>(
    URL,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const refetchPayment = useCallback(() => {
    mutate(URL);
  }, [URL]);

  const memoizedPayment = useMemo(
    () => ({
      payment: data,
      paymentLoading: isLoading,
      error,
      isValidating,
      refetchPayment,
    }),
    [data, isLoading, error, isValidating, refetchPayment]
  );

  return memoizedPayment;
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

export function useGetPaymentDetails() {
  const URL = apiEndpoints.paymentSummary.getPaymentDetails;
  const { data, isLoading, error, isValidating } = useSWR<any>(URL, fetcher, {
    keepPreviousData: true,
  });

  const refetchPaymentDetails = useCallback(() => {
    mutate(URL);
  }, [URL]);

  const memoizedPaymentDetails = useMemo(
    () => ({
      paymentDetails: data,
      paymentDetailsLoading: isLoading,
      error,
      isValidating,
      refetchPaymentDetails,
    }),
    [data, isLoading, error, isValidating, refetchPaymentDetails]
  );

  return memoizedPaymentDetails;
}

export function useTransactionsBySponsorID(sponsorID: number) {
  const URL = apiEndpoints.paymentSummary.transactionList + sponsorID;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  console.log(data);

  const refetchPayment = useCallback(() => {
    mutate(URL);
  }, [URL]);

  const memoizedPayment = useMemo(
    () => ({
      payment: data,
      paymentLoading: isLoading,
      error,
      isValidating,
      refetchPayment,
    }),
    [data, isLoading, error, isValidating, refetchPayment]
  );

  return memoizedPayment;
}
