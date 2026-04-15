import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, {
  fetcher,
  apiEndpoints,
  tokenManager,
  axiosInstance2,
  fetcherWithMeta,
} from 'src/utils/axios';

import { IConnectItem } from 'src/types/connect';

interface UseGetPeoplesOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean>;
}

interface NetworkingUser {
  userCohort: string;
  firstName: string;
  lastName: string;
  email: string;
  eventId: number;
  exhibitorId: number | null;
  eventMemberId: number | null;
  recommendedScore: number | null;
  bookmark: boolean;
  walletId: string | null;
  companyName: string;
  designation: string;
  profileUrl: string;
  data: any;
  recommendedReason: string | null;
  hallNo: string | null;
  stallNo: string | null;
  agendas: any | null;
  bio: string;
}

export function useGetPeoples(id: number, options?: UseGetPeoplesOptions) {
  const queryParams = new URLSearchParams();

  if (options?.page) queryParams.set('pageNumber', String(options.page));
  if (options?.pageSize) queryParams.set('pageSize', String(options.pageSize));
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== '' && value !== 'all') {
        queryParams.set(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const URL = `${apiEndpoints.networking.listing}${id}${queryString ? `?${queryString}` : ''}`;

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: reFetchPeoples,
  } = useSWR(URL, fetcherWithMeta, {
    revalidateOnFocus: false,
  });

  console.log(data, '********************887');

  const memoizedValue = useMemo(
    () => ({
      peoples: data?.data || [],
      peoplesLoading: isLoading,
      peoplesError: error,
      peoplesValidating: isValidating,
      peoplesEmpty: !isLoading && !data?.data?.length,
      totalCount: data?.meta?.userCount || 0,
      currentPage: data?.meta?.currentPage || 1,
      pageSize: data?.meta?.pageSize || 10,
      reFetchPeoples,
    }),
    [data, error, isLoading, isValidating, reFetchPeoples]
  );

  return memoizedValue;
}
