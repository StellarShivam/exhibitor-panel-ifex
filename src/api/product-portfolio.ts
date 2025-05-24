import type {
  IProductItem,
  IProductItemGet,
  IProductCreateItem,
  IProductUpdateItem,
  IProductItemNew,
  ISavePortfolioRequest,
  IPortfolioResponse,
} from 'src/types/product';

import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, {
  fetcher,
  endpoints,
  apiEndpoints,
  axiosInstance2,
  tokenManager,
} from 'src/utils/axios';
import { PRODUCTS } from 'src/_mock/_product';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetProductPortfolio(exhibitorId: number) {
  const API_URL = apiEndpoints.productPortfolio.list + exhibitorId;

  const { data, isLoading, error } = useSWR<IProductItemGet[]>(API_URL, fetcher, swrOptions);

  const reFetchProductPortfolio = useCallback(() => mutate(API_URL), [API_URL]);

  const memoizedValue = useMemo(
    () => ({
      products: data
        ? (data.map((item) => ({
            id: item.id,
            exhibitorId: item.exhibitorId,
            productName: item.productName,
            subDescription: item.subDescription,
            images: item.imgUrl ? [item.imgUrl] : [],
            regularPrice: item.regularPrice,
            salePrice: item.salePrice,
            tax: item.tax,
            status: item.status,
            updatedBy: item.updatedBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })) as IProductItemNew[])
        : [],
      productsLoading: isLoading,
      productsError: error,
      reFetchProductPortfolio,
    }),
    [data, error, isLoading, reFetchProductPortfolio]
  );

  return memoizedValue;
}

export function useGetPortfolio(exhibitorId: number) {
  const API_URL = apiEndpoints.productPortfolio.getPortfolio + exhibitorId;

  const {
    data,
    isLoading,
    error,
    mutate: reFetchPortfolio,
  } = useSWR<IPortfolioResponse>(API_URL, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      portfolio: data || null,
      portfolioLoading: isLoading,
      portfolioError: error,
      reFetchPortfolio,
    }),
    [data, error, isLoading, reFetchPortfolio]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export const createProduct = async (body: IProductCreateItem) => {
  const URL = apiEndpoints.productPortfolio.create;

  // console.log('The data sent is : ', body);
  const AUTH_TOKEN = tokenManager.getToken();
  const response = await axiosInstance2.post(URL, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });

  return response.data;
};

export const updateProduct = async (body: IProductUpdateItem) => {
  const URL = apiEndpoints.productPortfolio.update;

  // console.log('The data sent is : ', body);
  const AUTH_TOKEN = tokenManager.getToken();
  const response = await axiosInstance2.post(URL, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });

  return response.data;
};

export const deleteProduct = async (productID: number) => {
  try {
    const AUTH_TOKEN = tokenManager.getToken();

    const response = await axiosInstance2.get(apiEndpoints.productPortfolio.delete + productID, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    console.log(response);
  } catch (error) {
    console.error('Error deleting coupon', error);
    throw error;
  }
};

export function useImageUpload() {
  const uploadImage = async (file: File) => {
    const URL = `${apiEndpoints.base}${apiEndpoints.common.fileUpload}`;
    const AUTH_TOKEN = tokenManager.getToken();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log('File upload response:', response);

      return response.data;
    } catch (err: any) {
      console.error('File upload error:', err);
      return err;
    }
  };

  return {
    uploadImage,
  };
}

export const savePortfolio = async (body: ISavePortfolioRequest) => {
  const URL = apiEndpoints.productPortfolio.savePortfolio;

  try {
    const AUTH_TOKEN = tokenManager.getToken();
    const response = await axiosInstance2.post(URL, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error saving portfolio:', error);
    throw error;
  }
};
