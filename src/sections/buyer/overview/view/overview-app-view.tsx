'use client';

import Image from 'next/image';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import {
  useGetTeamMembersCount,
  useGetVisitorsAndLeadsCount,
  useGetSessions,
} from 'src/api/overview';

import { useEventContext } from 'src/components/event-context';
import { _bookingsOverview } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import { enqueueSnackbar } from 'notistack';
import { useGetVisaLetter } from 'src/api/plan-your-visit';


import AppWelcome from '../app-welcome';

import { useBuyerForm } from 'src/api/form';
import BuyerStatus from '../buyer-status';
import ProductGroupsCard from '../product-groups-card';
import { featureFlags } from 'src/config-global';


// ----------------------------------------------------------------------

export default function BuyerOverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  const { eventData } = useEventContext();

  const { exhibitorForm, exhibitorFormLoading, reFetchExhibitorForm } = useBuyerForm();

  // If buyer is overseas, fetch visa-letter data
  const isOverseasBuyer = exhibitorForm?.formData?.participationType === 'OVERSEAS_BUYER';
  const { visaLetterData, visaLetterLoading, reFetch } = useGetVisaLetter();

  const contactPersonName = `${exhibitorForm?.formData?.prefix || ''} ${exhibitorForm?.formData?.firstName || ''} ${exhibitorForm?.formData?.middleName || ''} ${exhibitorForm?.formData?.lastName || ''  }`;

  const contactPersonAddress =  exhibitorForm?.completeAddress || `${exhibitorForm?.formData?.city || ''}, ${exhibitorForm?.formData?.state || ''}, ${exhibitorForm?.formData?.country || ''}`;

  const productGroups = exhibitorForm?.formData?.productGroups || [];

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
            />
        </Grid>

        <Grid xs={12}>
          <ProductGroupsCard productGroups={productGroups} />
        </Grid>

        {isOverseasBuyer && featureFlags.planYourVisit && (
          <Grid xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
                alignItems: 'center',
                height: '100%',
                border: '2px #B6B6E2 solid',
                borderBottom: '8px #B6B6E2 solid',
                borderRadius: 2,
                p: 2,
                background: '#F6F7FB',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  bgcolor: '#B6E2D3',
                  color: '#3A3A3A',
                  borderRadius: 0.75,
                  px: 2,
                  py: 1,
                  mb: 1,
                }}
              >
                {/* You can use an icon here if desired, e.g., <Iconify icon="mdi:airplane" .../> */}
                <Typography fontWeight={700} fontSize={16}>
                  Plan Your Travel
                </Typography>
              </Box>

              <Stack spacing={2} width={'100%'} px={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={600} color="#6C6C6C">
                    Visa Letter Status
                  </Typography>
                  <Typography color="#3A3A3A">
                    {visaLetterData?.formStatus ? visaLetterData.formStatus : 'Not started'}
                  </Typography>
                </Box>
              </Stack>

              {/* Button logic */}
              {(() => {
                const status = (visaLetterData?.formStatus || '').toUpperCase();
                if (status === 'SUBMITTED') {
                  return (
                    <Button
                      variant="contained"
                      sx={{
                        width: '100%',
                        mt: 1,
                        bgcolor: '#B6E2D3',
                        color: '#3A3A3A',
                        '&:hover': { bgcolor: '#A7D7C5' },
                        boxShadow: 'none',
                      }}
                      disabled
                    >
                      Submitted. Awaiting Approval
                    </Button>
                  );
                }
                if (status === 'APPROVED') {
                  return (
                    <Button
                      variant="contained"
                      sx={{
                        width: '100%',
                        mt: 1,
                        bgcolor: '#B6E2D3',
                        color: '#3A3A3A',
                        '&:hover': { bgcolor: '#A7D7C5' },
                        boxShadow: 'none',
                      }}
                      onClick={() => {
                        const url = visaLetterData?.visaLetterUrl;
                        if (!url) return;
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      disabled={!visaLetterData?.visaLetterUrl || visaLetterLoading}
                    >
                      Download Visa Letter
                    </Button>
                  );
                }
                // Default: show button to go to plan your travel form
                return (
                  <Button
                    variant="contained"
                    sx={{
                      width: '100%',
                      mt: 1,
                      bgcolor: '#B6E2D3',
                      color: '#3A3A3A',
                      '&:hover': { bgcolor: '#A7D7C5' },
                      boxShadow: 'none',
                    }}
                    onClick={() => {
                      window.location.href = '/dashboard/buyer/plan-your-visit';
                    }}
                  >
                    Fill Plan Your Travel Form
                  </Button>
                );
              })()}
            </Box>
          </Grid>
        )}

        {/* Pre-fair Directory Card */}
        {
          featureFlags.exhibitorDirectory && 
          <Grid xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
                alignItems: 'center',
                height: '100%',
                border: '2px #B6B6E2 solid',
                borderBottom: '8px #B6B6E2 solid',
                borderRadius: 2,
                p: 2,
                background: '#F6F7FB',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  bgcolor: '#B6E2D3',
                  color: '#3A3A3A',
                  borderRadius: 0.75,
                  px: 2,
                  py: 1,
                  mb: 1,
                }}
              >
                {/* You can use an icon here if desired, e.g., <Iconify icon="mdi:book-open-page-variant" .../> */}
                <Typography fontWeight={700} fontSize={16}>
                  Pre-fair Directory
                </Typography>
              </Box>

              <Stack spacing={2} width={'100%'} px={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={600} color="#6C6C6C">
                    Directory Access
                  </Typography>
                  <Typography color="#3A3A3A">
                    Available
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                sx={{
                  width: '100%',
                  mt: 1,
                  bgcolor: '#B6E2D3',
                  color: '#3A3A3A',
                  '&:hover': { bgcolor: '#A7D7C5' },
                  boxShadow: 'none',
                }}
                onClick={() => {
                  window.location.href = '/dashboard/buyer/exhibitor-directory/';
                }}
              >
                Go to Directory
              </Button>
            </Box>
          </Grid>
        }

      </Grid>
    </Container>
  );
}
