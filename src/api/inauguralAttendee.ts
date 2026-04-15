import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

import { IAttendee, ICheckAttendee, ICreateAttendee } from 'src/types/inauguralAttendee';

// ----------------------------------------------------------------------

export function useGetAttendees(exhibitorId: number) {
  const URL = apiEndpoints.inauguralAttendee.getAttendees + exhibitorId;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchAttendees = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      attendees: (data as IAttendee[]) || [],
      attendeesLoading: isLoading,
      attendeesError: error,
      attendeesValidating: isValidating,
      attendeesEmpty: !isLoading && !data?.length,
      reFetchAttendees,
    }),
    [data, error, isLoading, isValidating, reFetchAttendees]
  );

  return memoizedValue;
}

export function useAddAttendee() {
  const addAttendee = async (payload: ICreateAttendee) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<ICreateAttendee>(
        apiEndpoints.inauguralAttendee.addAttendee,
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
    addAttendee,
  };
}

export function useCheckAttendee() {
  const checkAttendee = async (user: ICheckAttendee) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<ICheckAttendee>(
        apiEndpoints.inauguralAttendee.checkAttendee,
        user,
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
    checkAttendee,
  };
}
