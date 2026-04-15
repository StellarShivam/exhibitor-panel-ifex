'use client';

import React from 'react'

import OverviewAppView from './overview-app-view';
import BuyerOverviewAppView from '../../buyer/overview/view/overview-app-view';
import { useEventContext } from 'src/components/event-context';
import SponsorOverviewAppView from 'src/sections/sponsor/overview/view/overview-app-view';

const Overview = () => {
  const { eventData } = useEventContext();

    return <OverviewAppView />;
};

export default Overview;