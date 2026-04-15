import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

import type {
  IBookMeeting,
  IMember,
  ISlot,
  IAllUserSlots,
  IUpdateMeetingStatus,
  IRescheduleMeeting,
} from 'src/types/meetings';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
// ----------------------------------------------------------------------

export function useGetDropDownSlots(eventId: number, exhibitorId: number) {
  const URL = `${apiEndpoints.meeting.dropDownSlots}?eventId=${eventId}&eventMemberId=${exhibitorId}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchDropDownSlots = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      dropDownSlots: (data as ISlot[]) || [],
      dropDownSlotsLoading: isLoading,
      dropDownSlotsError: error,
      dropDownSlotsValidating: isValidating,
      dropDownSlotsEmpty: !isLoading && !data?.length,
      reFetchDropDownSlots,
    }),
    [data, error, isLoading, isValidating, reFetchDropDownSlots]
  );

  return memoizedValue;
}

export function useGetDropDownMembers(eventId: number, exhibitorId: number, slotId: number) {
  const URL = `${apiEndpoints.meeting.dropDownMembers}?eventId=${eventId}&eventMemberId=${exhibitorId}&slotId=${slotId}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchDropDownMembers = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      dropDownMembers: (data as IMember[]) || [],
      dropDownMembersLoading: isLoading,
      dropDownMembersError: error,
      dropDownMembersValidating: isValidating,
      reFetchDropDownMembers,
    }),
    [data, error, isLoading, isValidating, reFetchDropDownMembers]
  );

  return memoizedValue;
}

export function useBookMeeting() {
  const bookMeeting = async (meeting: IBookMeeting) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<IBookMeeting>(
        apiEndpoints.meeting.bookMeeting,
        meeting,
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
    bookMeeting,
  };
}

export function useGetAllEventSlots(eventId: number) {
  const URL = `${apiEndpoints.meeting.allEventSlots}${eventId}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchAllEventSlots = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      allEventSlots: (data as ISlot[]) || [],
      allEventSlotsLoading: isLoading,
      allEventSlotsError: error,
      allEventSlotsValidating: isValidating,
      allEventSlotsEmpty: !isLoading && !data?.length,
      reFetchAllEventSlots,
    }),
    [data, error, isLoading, isValidating, reFetchAllEventSlots]
  );

  return memoizedValue;
}

export function useGetAllUserSlots(eventId: number) {
  const URL = `${apiEndpoints.meeting.allUserSlots}${eventId}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  console.log(data);

  const reFetchAllUserSlots = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      allUserSlots: (data as IAllUserSlots) || {},
      bookedSlots: (data as IAllUserSlots)?.bookedSlots || [],
      schedules: (data as IAllUserSlots)?.schedules || [],
      availableSlots: (data as IAllUserSlots)?.availableSlots || [],
      unavailableSlots: (data as IAllUserSlots)?.unavailableSlots || [],
      allUserSlotsLoading: isLoading,
      allUserSlotsError: error,
      allUserSlotsValidating: isValidating,
      allUserSlotsEmpty: !isLoading && !data?.length,
      reFetchAllUserSlots,
    }),
    [data, error, isLoading, isValidating, reFetchAllUserSlots]
  );

  return memoizedValue;
}

export function useUpdateMeetingStatus() {
  const updateMeetingStatus = async (meeting: IUpdateMeetingStatus) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<IUpdateMeetingStatus>(
        apiEndpoints.meeting.updateStatus,
        meeting,
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
    updateMeetingStatus,
  };
}

export function useRescheduleMeeting() {
  const rescheduleMeeting = async (meeting: IRescheduleMeeting) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post<IRescheduleMeeting>(
        apiEndpoints.meeting.rescheduleMeeting,
        meeting,
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
    rescheduleMeeting,
  };
}
