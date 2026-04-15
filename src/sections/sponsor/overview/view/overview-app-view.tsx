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


import AppWelcome from '../app-welcome';

import { useSponsorForm } from 'src/api/form';
import BuyerStatus from '../buyer-status';


// ----------------------------------------------------------------------

export default function SponsorOverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  const { eventData } = useEventContext();

  const { exhibitorForm : sponsorForm, exhibitorFormLoading, reFetchExhibitorForm } = useSponsorForm();
  const exhibitorForm = sponsorForm?.metaData?.data;

  const contactPersonName = `${exhibitorForm?.formData?.billingContactPersonPrefix || ''} ${exhibitorForm?.formData?.billingContactPersonFirstName || ''} ${exhibitorForm?.formData?.billingContactPersonMiddleName || ''} ${exhibitorForm?.formData?.billingContactPersonLastName || ''  }`;

  const contactPersonAddress =  exhibitorForm?.completeAddress || `${exhibitorForm?.formData?.city || ''}, ${exhibitorForm?.formData?.state || ''}, ${exhibitorForm?.formData?.country || ''}`;

  const sponsorshipType = exhibitorForm?.formData?.sponsorshipType || '';
  const sponsorshipPricingCategory = exhibitorForm?.formData?.sponsorshipPricingCategory || '';


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <BuyerStatus
            title="Application Status"
            status={exhibitorForm?.status}
            paymentStatus={exhibitorForm?.paymentStatus}
          />
        </Grid>

        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋`}
            contactPersonName={contactPersonName}
            companyName={exhibitorForm?.formData?.companyName}
            contactPersonAddress={contactPersonAddress}
            sponsorshipType={sponsorshipType}
            sponsorshipPricingCategory={sponsorshipPricingCategory}
    
          />
        </Grid>

        {/* <Grid xs={12} md={8}>
          <CompanyProfile description={exhibitorForm?.formData?.companyBio} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
