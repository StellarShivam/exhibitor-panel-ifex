import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';
import { IInvitationCoupons } from 'src/types/invitation-coupons';

// ----------------------------------------------------------------------

export function useGetCoupons(exhibitorId: number) {
  const URL = apiEndpoints.invitationCoupon.listing + exhibitorId;

  const { data, isLoading, error, isValidating } = useSWR<IInvitationCoupons[]>(URL, fetcher);

  console.log('data', data);

  const reFetchCoupons = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      coupons: (data as IInvitationCoupons[]) || [],
      couponsLoading: isLoading,
      couponsError: error,
      couponsValidating: isValidating,
      couponsEmpty: !isLoading && !data?.length,
      reFetchCoupons,
    }),
    [data, error, isLoading, isValidating, reFetchCoupons]
  );

  return memoizedValue;
}
