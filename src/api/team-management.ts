import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

import { ITeamMember, ITeamMemberCreate } from 'src/types/team';
import { BASE_URL } from 'src/config-global';

// ----------------------------------------------------------------------

export function useGetExhibitorUsers() {
  const URL = apiEndpoints.teamManagement.listing;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchExhibitorUsers = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      exhibitorUsers: (data?.members as ITeamMember[]) || [],
      exhibitorUsersMemberCapping: data?.memberCapping || 0,
      exhibitorUsersLoading: isLoading,
      exhibitorUsersError: error,
      exhibitorUsersValidating: isValidating,
      exhibitorUsersEmpty: !isLoading && !data?.exhibitorUsers?.length,
      reFetchExhibitorUsers,
    }),
    [data?.exhibitorUsers, error, isLoading, isValidating, reFetchExhibitorUsers]
  );

  return memoizedValue;
}

export function useGetExhibitorUser(id: number) {
  const URL = apiEndpoints.teamManagement.details + id;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchExhibitorUser = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      exhibitorUser: (data as ITeamMember) || {},
      exhibitorUserLoading: isLoading,
      exhibitorUserError: error,
      exhibitorUserValidating: isValidating,
      reFetchExhibitorUser,
    }),
    [data, error, isLoading, isValidating, reFetchExhibitorUser]
  );

  return memoizedValue;
}

export function useupdateExhibitorUser() {
  const updateExhibitorUser = async (user: ITeamMemberCreate) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<ITeamMemberCreate>(
        apiEndpoints.teamManagement.update,
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
      throw err;
    }
  };

  return {
    updateExhibitorUser,
  };
}

export function usecreateExhibitorUser() {
  const createExhibitorUser = async (user: ITeamMemberCreate) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<ITeamMemberCreate>(
        apiEndpoints.teamManagement.create,
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
      throw err.response?.data?.msg || 'Failed to create user';
    }
  };

  return {
    createExhibitorUser,
  };
}

const API_BASE_URL = `${BASE_URL}/bts/api/v1`;

export function useDeleteExhibitorUser() {
  const deleteExhibitorUser = async (memberId: number) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.delete(`/api/v1/exhibitors/member/${memberId}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    deleteExhibitorUser,
  };
}

export function useFileUpload() {
  const uploadFile = async (file: File) => {
    const URL = `${API_BASE_URL}${apiEndpoints.common.fileUpload}`;
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
    uploadFile,
  };
}
