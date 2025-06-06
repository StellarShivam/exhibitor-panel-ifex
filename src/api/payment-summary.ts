import { useCallback, useMemo } from "react";
import { IPaymentSummaryDetailsData } from "src/types/payment-summary";
import { apiEndpoints, axiosInstance2, fetcher, tokenManager } from "src/utils/axios";
import useSWR, { mutate } from "swr";

export async function updatePaymentDetails(status: string, orderId: string) {
  const token = tokenManager.getToken(); // Assuming tokenManager handles token retrieval
  const url = apiEndpoints.paymentSummary.updatePaymentStatus;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axiosInstance2.post(url, {
      
    "status": status,
    "orderId": orderId

    }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating registration details:', error);
    throw error;
  }
}

export function usePaymentByExhibitorID(exhibitorID: number) {
  const URL = apiEndpoints.paymentSummary.payment + exhibitorID;
  const { data, isLoading, error, isValidating } = useSWR<IPaymentSummaryDetailsData>(URL, fetcher, {
    keepPreviousData: true,
  });

  const refetchPayment = useCallback(() => {
    mutate(URL);
  }
, [URL]);

  const memoizedPayment = useMemo(
    () => ({
      payment: data,
      paymentLoading: isLoading,
      error,
      isValidating,
      refetchPayment
    }),
    [data, isLoading, error, isValidating,refetchPayment]
  );

  return memoizedPayment;
}