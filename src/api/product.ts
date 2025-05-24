import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { IProductItem } from 'src/types/product';
// Import mock data
import { PRODUCTS as mockProducts } from 'src/_mock/_product';

// ----------------------------------------------------------------------

export function useGetProducts() {
  // Temporarily return mock data
  const memoizedValue = useMemo(
    () => ({
      products: mockProducts,
      productsLoading: false,
      productsError: null,
      productsValidating: false,
      productsEmpty: !mockProducts.length,
    }),
    []
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId: string) {
  // Temporarily return mock data
  const memoizedValue = useMemo(
    () => ({
      product: mockProducts.find((p) => p.id === productId) as IProductItem,
      productLoading: false,
      productError: null,
      productValidating: false,
    }),
    [productId]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query: string) {
  // Temporarily return filtered mock data based on search query
  const filteredProducts = useMemo(() => {
    if (!query) return [];
    return mockProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const memoizedValue = useMemo(
    () => ({
      searchResults: filteredProducts,
      searchLoading: false,
      searchError: null,
      searchValidating: false,
      searchEmpty: !filteredProducts.length,
    }),
    [filteredProducts]
  );

  return memoizedValue;
}

// When you have your API URL, simply uncomment the original code and remove the mock implementation
/*
export function useGetProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: (data?.products as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}
*/
