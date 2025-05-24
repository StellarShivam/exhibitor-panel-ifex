import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axiosInstance, {
  fetcher,
  endpoints,
  apiEndpoints,
  tokenManager,
  axiosInstance2,
} from 'src/utils/axios';

export function useGetEventList1() {
  const URL = apiEndpoints.event.listing;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });
  console.log('Event Listing : ', data);

  const reFetchEventList = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      events: (data as any[]) || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      reFetchEventList,
    }),
    [data, error, isLoading, isValidating, reFetchEventList]
  );
  console.log(memoizedValue);

  return memoizedValue;
}
