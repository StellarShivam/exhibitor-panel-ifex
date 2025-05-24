import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

import {
  ITicketCreateItem,
  ITicketDetails,
  ITicketItem,
  ITicketMessageItem,
} from 'src/types/help-and-support';

// ----------------------------------------------------------------------

export function useGetTickets(eventId: number) {
  const URL = apiEndpoints.helpAndSupport.listing + eventId;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchTickets = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      tickets: (data?.tickets as ITicketItem[]) || [],
      ticketsLoading: isLoading,
      ticketsError: error,
      ticketsValidating: isValidating,
      ticketsEmpty: !isLoading && !data?.tickets?.length,
      reFetchTickets,
    }),
    [data, error, isLoading, isValidating, reFetchTickets]
  );

  return memoizedValue;
}

export function useGetTicketDetails(ticketId: number) {
  const URL = apiEndpoints.helpAndSupport.detailsTicket + ticketId;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchTicketDetails = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      ticketDetails: (data as ITicketDetails) || {},
      ticketDetailsLoading: isLoading,
      ticketDetailsError: error,
      ticketDetailsValidating: isValidating,
      reFetchTicketDetails,
    }),
    [data, error, isLoading, isValidating, reFetchTicketDetails]
  );

  return memoizedValue;
}

export const createTicket = async (body: ITicketCreateItem) => {
  const URL = apiEndpoints.helpAndSupport.createTicket;

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

export const sendExhibitorMessage = async (body: ITicketMessageItem) => {
  const URL = apiEndpoints.helpAndSupport.exhibitorMessage;

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
