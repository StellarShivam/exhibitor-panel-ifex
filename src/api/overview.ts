import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

import { ITeamMember, IExhibitorItem } from 'src/types/team';
import { ISession, ITask } from 'src/types/overview';
// ----------------------------------------------------------------------

export function useGetTeamMembersCount(id: number) {
  const URL = apiEndpoints.teamManagement.listing + id;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchExhibitor = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      exhibitor: (data?.exhibitorDetails as IExhibitorItem) || {},
      exhibitorUsers: data?.exhibitorUsers || [],
      exhibitorUsersCount: data?.exhibitorUsers?.length || 0,
      exhibitorLoading: isLoading,
      exhibitorError: error,
      exhibitorValidating: isValidating,
      reFetchExhibitor,
    }),
    [data?.exhibitorDetails, data?.exhibitorUsers, error, isLoading, isValidating, reFetchExhibitor]
  );

  return memoizedValue;
}

export function useGetVisitorsAndLeadsCount(id: number) {
  const URL = apiEndpoints.overview.scannedUsers + id;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchCounts = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(() => {
    const visitors = data?.filter((item: { type: string }) => item.type === 'VISITOR') || [];
    const leads = data?.filter((item: { type: string }) => item.type === 'LEADS') || [];

    return {
      visitorsCount: visitors?.length,
      leadsCount: leads?.length,
      totalCount: data?.length || 0,
      visitors,
      leads,
      loading: isLoading,
      error,
      isValidating,
      reFetchCounts,
    };
  }, [data, error, isLoading, isValidating, reFetchCounts]);

  return memoizedValue;
}

export function useGetSessions() {
  const URL = apiEndpoints.overview.sessions;

  const { data, isLoading, error, isValidating } = useSWR<ISession[]>(URL, fetcher);

  const reFetchSessions = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      sessions: data || [],
      sessionsCount: data?.length || 0,
      sessionsLoading: isLoading,
      sessionsError: error,
      sessionsValidating: isValidating,
      reFetchSessions,
    }),
    [data, error, isLoading, isValidating, reFetchSessions]
  );

  return memoizedValue;
}

export function useGetTasks(eventId: number) {
  const URL = apiEndpoints.overview.tasks + eventId;

  const { data, isLoading, error, isValidating } = useSWR<ITask[]>(URL, fetcher);

  const reFetchTasks = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      tasks: data || [],
      tasksCount: data?.length || 0,
      tasksLoading: isLoading,
      tasksError: error,
      tasksValidating: isValidating,
      reFetchTasks,
    }),
    [data, error, isLoading, isValidating, reFetchTasks]
  );

  return memoizedValue;
}

export function useUpdateTask() {
  const updateTask = async (taskId: number, status: boolean) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<{ id: number; status: boolean }>(
        apiEndpoints.overview.updateTask,
        {
          id: taskId,
          status,
        },
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
    updateTask,
  };
}
