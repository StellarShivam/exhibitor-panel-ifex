import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Iconify from 'src/components/iconify';
import { useEventContext } from 'src/components/event-context';
import { useGetExhibitor } from 'src/api/exhibitor-profile';
import { useExhibitorForm } from 'src/api/form';
import { useSnackbar } from 'notistack';
import { generateAllotmentLetterApi } from 'src/api/overview';

export default function StallAllotmentCard() {
  const { enqueueSnackbar } = useSnackbar();
  const [totalAreaRequired, setTotalAreaRequired] = useState(0);
  const [boothTypePreference, setBoothTypePreference] = useState('');

  const { eventData } = useEventContext();

  const { exhibitor } = useGetExhibitor(eventData.state.exhibitorId);

  const { exhibitorForm, exhibitorFormLoading } = useExhibitorForm(
    exhibitor?.supportEmail,
    eventData.state.eventId
  );

  const handleDownloadAllotment = async () => {
    enqueueSnackbar('Processing allotment letter...', { variant: 'info' });
    try {
      const res = await generateAllotmentLetterApi(eventData?.state.exhibitorId);

      enqueueSnackbar('Allotment letter processed!!', { variant: 'success' });

      if (res?.allotmentLetterUrl) {
        window.open(res.allotmentLetterUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to generate allotment letter:', error);
      enqueueSnackbar('Failed to generate allotment letter!', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (exhibitorForm) {
      let boothTypeLabel = exhibitorForm?.data.boothTypePreference;
      if (boothTypeLabel === 'space_only') boothTypeLabel = 'Space Only';
      else if (boothTypeLabel === 'pre_fitted') boothTypeLabel = 'Pre-Fitted';
      setTotalAreaRequired(exhibitorForm?.data.totalAreaRequired);
      setBoothTypePreference(boothTypeLabel);
    }
  }, [exhibitorForm]);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          My Stall Allotment – IFEX 2025
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Below are the details of your stall allotment for IFEX 2025, scheduled from 25th to 29th
          September 2025 at India Expo Centre & Mart, Greater Noida.
        </Typography>
        <Stack spacing={2} mb={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Stall Number</Typography>
            <Typography>{eventData?.state?.stallNo}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Hall Number</Typography>
            <Typography>{eventData?.state?.hallNo}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Size of Stall</Typography>
            <Typography>{totalAreaRequired} sqm</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Stall Type</Typography>
            <Typography>{boothTypePreference}</Typography>
          </Box>
          {eventData?.state?.hallManagerName && (
            <Box display="flex" justifyContent="space-between">
              <Typography color="text.secondary">Hall Manager Name</Typography>
              <Typography>{eventData?.state?.hallManagerName}</Typography>
            </Box>
          )}
          {eventData?.state?.hallManagerContact && (
            <Box display="flex" justifyContent="space-between">
              <Typography color="text.secondary">Hall Manager Contact</Typography>
              <Typography>{eventData?.state?.hallManagerContact}</Typography>
            </Box>
          )}
          {/* <Box display="flex" justifyContent="space-between">
            <Typography color="error">Reference</Typography>
            <Typography color="error">
              IFEX /2026/{eventData?.state?.hallNo}/{eventData?.state?.stallNo}
            </Typography>
          </Box> */}
        </Stack>
        {/* <Divider sx={{ my: 2 }} /> */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            color="success"
            // startIcon={<Iconify icon="mingcute:arrow-down-line" width={24} />}
            onClick={handleDownloadAllotment}
            sx={{ width: '100%' }}
          >
            Download Allotment Letter
          </Button>
          {/* <Button variant="outlined" color="inherit" fullWidth>
            View Exhibitor Guidelines
          </Button> */}
        </Stack>
      </CardContent>
    </Card>
  );
}
