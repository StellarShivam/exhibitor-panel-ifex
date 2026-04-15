'use client';

import Image from 'next/image';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import {
  useGetTeamMembersCount,
  useGetVisitorsAndLeadsCount,
  useGetSessions,
} from 'src/api/overview';

import { useEventContext } from 'src/components/event-context';
import { _bookingsOverview } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppTasks from '../app-tasks';
import Visitors from '../app-visitors';
import AppWelcome from '../app-welcome';
import AppSessions from '../app-sessions';
import AppWidgetSummary from '../app-widget-summary';
import StallAllotmentCard from '../StallAllotmentCard';
import AllotmentInfoCard from '../AllotmentInfoCard';
import ExhibitorManual from '../exhibitor-manual';
import { useExhibitorForm } from 'src/api/form';
import ExhibitorStatus from '../exhibitor-status';
import CompanyProfile from '../company-profile';
import { featureFlags } from 'src/config-global';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  const { eventData } = useEventContext();

  const { exhibitorForm, exhibitorFormLoading, reFetchExhibitorForm } = useExhibitorForm();

  console.log(exhibitorForm, 'exhibitorForm');

  const contactPersonName = exhibitorForm?.formData?.name;

  const contactPersonAddress =  exhibitorForm?.formData?.completeAddress || `${exhibitorForm?.formData?.address?.city || ''}, ${exhibitorForm?.formData?.address?.state || ''}, ${exhibitorForm?.formData?.address?.country || ''}`;

  const hallNumber = exhibitorForm?.formData?.hallNumber;
  const stallNumber = exhibitorForm?.formData?.stallNumber;
  const plc = exhibitorForm?.formData?.preferredStallSides;
  const allotmentLetterUrl = exhibitorForm?.formData?.allotmentLetter;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={4}>
          <ExhibitorStatus
            title="Application Status"
            status={exhibitorForm?.metaData?.data?.status}
            paymentStatus={exhibitorForm?.metaData?.data?.paymentStatus}
            waitlisted={exhibitorForm?.metaData?.data?.waitingList}
          />
        </Grid> */}

        <Grid xs={12}>
          <AppWelcome
            title={`Welcome back 👋`}
            contactPersonName={contactPersonName}
            companyName={exhibitorForm?.formData?.companyName}
            contactPersonAddress={contactPersonAddress}
          />
        </Grid>

        {/* <Grid xs={12}>
          <CompanyProfile description={exhibitorForm?.formData?.companyBio} />
        </Grid> */}
        {
          featureFlags.showStallAllotmentCard && (
            <Grid xs={12} md={6}>
              <AllotmentInfoCard 
                hallNumber={hallNumber}
                stallNumber={stallNumber}
                plc={plc}
                allotmentLetterUrl={allotmentLetterUrl}
              />
            </Grid>
          )
        }
        
      </Grid>
    </Container>
  );
}