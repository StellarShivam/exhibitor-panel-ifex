import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

import {
  ICategoryItem,
  IProductItem,
  ISubCategoryItem,
  AddToCartPayload,
  ICartResponse,
  IExhbitorProductionRequirements,
} from 'src/types/production-requirements';

// ----------------------------------------------------------------------

export function useGetCategories() {
  const URL = apiEndpoints.productionRequirements.getCategories;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchCategories = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      categories: (data as ICategoryItem[]) || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.length,
      reFetchCategories,
    }),
    [data, error, isLoading, isValidating, reFetchCategories]
  );

  return memoizedValue;
}

export function useGetSubCategories(categoryId?: number) {
  const URL = categoryId
    ? `${apiEndpoints.productionRequirements.getSubCategories}${categoryId}`
    : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchSubCategories = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      subCategories: (data as ISubCategoryItem[]) || [],
      subCategoriesLoading: isLoading,
      subCategoriesError: error,
      subCategoriesValidating: isValidating,
      subCategoriesEmpty: !isLoading && !data?.length,
      reFetchSubCategories,
    }),
    [data, error, isLoading, isValidating, reFetchSubCategories]
  );

  return memoizedValue;
}

export function useGetProducts(eventId?: number) {
  const URL = eventId ? `${apiEndpoints.productionRequirements.getProducts}${eventId}` : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchProducts = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      products: (data?.products as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products?.length,
      reFetchProducts,
    }),
    [data?.products, error, isLoading, isValidating, reFetchProducts]
  );

  return memoizedValue;
}

export function useGetCart(eventId: number) {
  const URL = apiEndpoints.productionRequirements.getCart + eventId;

  const { data, isLoading, error, isValidating } = useSWR<ICartResponse>(URL, fetcher);

  const reFetchCart = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      cart: data?.items || [],
      totalAmount: data?.totalAmount || 0,
      cartId: data?.cartId,
      cartLoading: isLoading,
      cartError: error,
      cartValidating: isValidating,
      cartEmpty: !isLoading && !data?.items?.length,
      reFetchCart,
    }),
    [data, error, isLoading, isValidating, reFetchCart]
  );

  return memoizedValue;
}

export function useAddToCart() {
  const addToCart = async (payload: AddToCartPayload) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<AddToCartPayload>(
        apiEndpoints.productionRequirements.addToCart,
        payload,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    addToCart,
  };
}

export function useRemoveFromCart() {
  const removeFromCart = async (eventId: number, skuId: number) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.delete(
        `${apiEndpoints.productionRequirements.removeFromCart}${eventId}?skuId=${skuId}`,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    removeFromCart,
  };
}

export function useDeleteFromCart() {
  const deleteFromCart = async (eventId: number, cartItemId: number) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.delete(
        `${apiEndpoints.productionRequirements.deleteFromCart}${eventId}?skuId=${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    deleteFromCart,
  };
}

export function useEmptyCart() {
  const emptyCart = async (eventId: number) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post(
        `${apiEndpoints.productionRequirements.emptyCart}?eventId=${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    emptyCart,
  };
}

export function useGetOrdersList(exhibitorID: number) {
  const URL = `${apiEndpoints.productionRequirements.getOrders}${exhibitorID}`;

  const { data, isLoading, error, isValidating } = useSWR<IExhbitorProductionRequirements[]>(
    URL,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  console.log(data);
  const memoizedOrders = useMemo(
    () => ({
      productionRequirementsOrders: data || ([] as IExhbitorProductionRequirements[]),
      productionRequirementsOrdersLoading: isLoading,
      error,
      isValidating,
    }),
    [data, isLoading, error, isValidating]
  );
  return memoizedOrders;
}

export function useCheckout() {
  const checkoutCart = async (eventId: number) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post(
        `${apiEndpoints.productionRequirements.checkout}${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    checkoutCart,
  };
}
