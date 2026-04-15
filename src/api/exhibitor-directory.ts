import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';
import { BASE_URL } from 'src/config-global';

// ----------------------------------------------------------------------

export interface ProductGroup {
  optLock: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  cohort: string;
  deleted: boolean;
}

export interface IProductGroup {
  id: number;
  name: string;
  cohort: string;
}

export interface IExhibitorDirectoryItem {
  urn: string;
  email: string;
  phone: string;
  exhibitorName: string;
  contactPersonName: string;
  hallNumber?: string;
  stallNumber?: string;
  productGroupName?: string;
}

export interface IExhibitorDirectoryFilters {
  country: string;
  state: string;
  category: string;
  productGroupId: string;
  search?: string;
}

interface UseGetExhibitorDirectoryOptions {
  page?: number;
  pageSize?: number;
  filters?: IExhibitorDirectoryFilters;
}

// ----------------------------------------------------------------------

const API_URL = `${BASE_URL}/bts/api/v1`;
export const getProductGroups = async (): Promise<ProductGroup[]> => {
  try {
    const response = await axios.get<{ data: ProductGroup[] }>(
      `${API_URL}/exhibitor/product-groups`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Return product groups sorted by name for consistent ordering
    return (response.data.data || []).slice().sort((a, b) =>
      String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' })
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch product groups"
      );
    }
    throw error;
  }
};

export function useGetExhibitorDirectory(options?: UseGetExhibitorDirectoryOptions) {
  const queryParams = new URLSearchParams();

  if (options?.page) queryParams.set('pageNumber', String(options.page));
  if (options?.pageSize) queryParams.set('pageSize', String(options.pageSize));

  if (options?.filters) {
    const { country, state, category, productGroupId, search } = options.filters as any;
    if (country) queryParams.set('country', country);
    if (state) queryParams.set('state', state);
    if (category) queryParams.set('category', category);
    if (productGroupId) queryParams.set('productGroupId', productGroupId);
    if (search) queryParams.set('search', search);
  }

  const queryString = queryParams.toString();
  const URL = `${apiEndpoints.exhibitorDirectory.list}${queryString ? `?${queryString}` : ''}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      exhibitors: (data?.items as IExhibitorDirectoryItem[]) || [],
      exhibitorsLoading: isLoading,
      exhibitorsError: error,
      exhibitorsValidating: isValidating,
      exhibitorsEmpty: !isLoading && !data?.items?.length,
      totalElements: data?.totalElements || 0,
      totalPages: data?.totalPages || 0,
      reFetchExhibitors: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProductGroups() {
  const URL = apiEndpoints.exhibitorDirectory.productGroups;

  const { data, isLoading, error } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      productGroups: (data as IProductGroup[]) || [],
      productGroupsLoading: isLoading,
      productGroupsError: error,
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export interface ILeadWalletItem {
  urn: string;
  email?: string;
  phone?: string;
  exhibitorName?: string;
  contactPersonName?: string;
}

export function useGetFavourites() {
  const URL = apiEndpoints.leadWallet.get;

  const { data, isLoading, error, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      favourites: (data as ILeadWalletItem[]) || [],
      favouritesLoading: isLoading,
      favouritesError: error,
      reFetchFavourites: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

export async function addToFavourite(urn: string) {
  const AUTH_TOKEN = tokenManager.getToken();

  const response = await axiosInstance2.post(
    apiEndpoints.leadWallet.add,
    { userId: urn },
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

// ----------------------------------------------------------------------

interface UseGetMatchmakingOptions {
  page?: number;
  pageSize?: number;
  filters?: IExhibitorDirectoryFilters;
}

export function useGetMatchmakingList(options?: UseGetMatchmakingOptions) {
  const queryParams = new URLSearchParams();

  if (options?.page) queryParams.set('pageNumber', String(options.page));
  if (options?.pageSize) queryParams.set('pageSize', String(options.pageSize));

  if (options?.filters) {
    const { country, state, category, productGroupId, search } = options.filters as any;
    if (country) queryParams.set('country', country);
    if (state) queryParams.set('state', state);
    if (category) queryParams.set('category', category);
    if (productGroupId) queryParams.set('productGroupId', productGroupId);
    if (search) queryParams.set('search', search);
  }

  const queryString = queryParams.toString();
  const URL = `${apiEndpoints.exhibitorDirectory.matchmaking}${queryString ? `?${queryString}` : ''}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      exhibitors: (data?.items as IExhibitorDirectoryItem[]) || [],
      exhibitorsLoading: isLoading,
      exhibitorsError: error,
      exhibitorsValidating: isValidating,
      exhibitorsEmpty: !isLoading && !data?.items?.length,
      totalElements: data?.totalElements || 0,
      totalPages: data?.totalPages || 0,
      reFetchExhibitors: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
