import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

import { IConnectItem } from 'src/types/connect';

// ----------------------------------------------------------------------

export function useGetConnects(id: number) {
  const URL = apiEndpoints.connect.listing + id;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchConnects = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      connects: (data as IConnectItem[]) || [],
      connectsLoading: isLoading,
      connectsError: error,
      connectsValidating: isValidating,
      connectsEmpty: !isLoading && !data?.length,
      reFetchConnects,
    }),
    [data, error, isLoading, isValidating, reFetchConnects]
  );

  return memoizedValue;
}
