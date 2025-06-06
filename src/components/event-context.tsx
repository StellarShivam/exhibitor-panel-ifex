'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useSetState, UseSetStateReturn } from 'src/hooks/use-set-state';
import { IEventItem } from 'src/types/event';

// Define the shape of the context
type EventContextType = {
  eventData: UseSetStateReturn<IEventItem>;
};

// Create the context
const EventContext = createContext<EventContextType | undefined>(undefined);

// Create the provider component
export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to manage the event data
  const storedEventData = typeof window !== 'undefined' ? localStorage.getItem('eventData') : null;
  const initialEventData: IEventItem = storedEventData
    ? JSON.parse(storedEventData)
    : {
        exhibitorUserId: 0,
        exhibitorId: 0,
        eventId: 0,
        location: '',
        eventLogo: '',
        startDate: '',
        endDate: '',
        fullName: '',
        mobile: '',
        status: '',
      };

  const eventData = useSetState<IEventItem>(initialEventData);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eventData', JSON.stringify(eventData?.state));
    }
  }, [eventData.state]);

  const value = useMemo(() => ({ eventData }), [eventData]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

// Custom hook to use the EventContext
export const useEventContext = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
