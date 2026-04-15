import { useCallback, useMemo } from 'react';
import { IPaymentSummaryDetailsData } from 'src/types/payment-summary';
import { apiEndpoints, axiosInstance2, fetcher, tokenManager } from 'src/utils/axios';
import useSWR, { mutate } from 'swr';

export async function updatePaymentDetails(status: string, orderId: string) {
  const token = tokenManager.getToken(); // Assuming tokenManager handles token retrieval
  const url = apiEndpoints.paymentSummary.updatePaymentStatus;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axiosInstance2.post(
      url,
      {
        status: status,
        orderId: orderId,
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating registration details:', error);
    throw error;
  }
}

export function usePaymentByExhibitorID() {
  const URL = apiEndpoints.paymentSummary.payment ;
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

export function useGetPaymentDetails() {
  const URL = apiEndpoints.paymentSummary.getPaymentDetails ;
  const { data, isLoading, error, isValidating } = useSWR<any>(
    URL,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

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

export function useTransactionsByExhibitorID(exhibitorID: number) {
  const URL = apiEndpoints.paymentSummary.transactionList + exhibitorID;
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

export async function generateReceipt(purchaseId: number) {
  const token = tokenManager.getToken();
  const url = apiEndpoints.paymentSummary.generateReceipt + purchaseId;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axiosInstance2.get(url, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw error;
  }
}
export async function generateSponsorReceipt(purchaseId: number) {
  const token = tokenManager.getToken();
  const url = apiEndpoints.paymentSummary.generateSponsorReceipt + purchaseId;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axiosInstance2.get(url, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw error;
  }
}
export async function generateMultiReceipt(purchaseId: number) {
  const token = tokenManager.getToken();
  const url = apiEndpoints.paymentSummary.generateMultiReceipt + purchaseId;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axiosInstance2.get(url, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw error;
  }
}
