import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

import { ITeamMember, IExhibitorItem } from 'src/types/team';

// ----------------------------------------------------------------------

export function useGetExhibitor(id: number) {
  const URL = apiEndpoints.teamManagement.listing + id;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchExhibitor = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      exhibitor: (data?.exhibitorDetails as IExhibitorItem) || {},
      exhibitorUsers: (data?.exhibitorUsers as ITeamMember[]) || [],
      exhibitorLoading: isLoading,
      exhibitorError: error,
      exhibitorValidating: isValidating,
      reFetchExhibitor,
    }),
    [data?.exhibitorDetails, data?.exhibitorUsers, error, isLoading, isValidating, reFetchExhibitor]
  );

  return memoizedValue;
}

export function useupdateExhibitor() {
  const updateExhibitor = async (user: IExhibitorItem) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<IExhibitorItem>(
        apiEndpoints.exhibitorProfile.update,
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
    updateExhibitor,
  };
}
