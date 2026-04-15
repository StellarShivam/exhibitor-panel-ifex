import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { featureFlags } from 'src/config-global';

interface AllotmentInfoCardProps {
  hallNumber?: string | null;
  stallNumber?: string | null;
  plc?: string | null;
  allotmentLetterUrl?: string | null;
}

const plcMapping: { [key: string]: string } = {
  '1': 'One Side',
  '2': 'Two Sides',
  '3': 'Three Sides',
  '4': 'Four Sides',
};

const featureOn = featureFlags.enableStallAllotmentCard // toggle this to enable/disable the allotment letter download feature

export default function AllotmentInfoCard({
  hallNumber,
  stallNumber,
  plc,
  allotmentLetterUrl,
}: AllotmentInfoCardProps) {
  const { enqueueSnackbar } = useSnackbar();

  // Check if all values are present
  const allValuesPresent = featureOn && hallNumber && stallNumber && plc;
  const displayPlaceholder = !allValuesPresent;

  const handleDownloadAllotment = () => {
    if (!featureOn) {
      enqueueSnackbar('This feature is coming soon!', { variant: 'info' });
      return;
    }
    if (!allotmentLetterUrl) {
      enqueueSnackbar('Allotment letter is not available yet.', { variant: 'info' });
      return;
    }
    window.open(allotmentLetterUrl, '_blank', 'noopener,noreferrer');
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
        alignItems: 'center',
        height: '100%',
        border: '2px #B6B6E2 solid', // pastel purple
        borderBottom: '8px #B6B6E2 solid',
        borderRadius: 2,
        p: 2,
        background: '#F6F7FB', // pastel background
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          bgcolor: '#B6E2D3', // pastel green
          color: '#3A3A3A',
          borderRadius: 0.75,
          px: 2,
          py: 1,
          mb: 1,
        }}
      >
        <Iconify icon="mdi:ticket-confirmation-outline" width={24} style={{ marginRight: 8 }} />
        <Typography fontWeight={700} fontSize={16}>
          Allotment Details
        </Typography>
      </Box>

      <Stack spacing={2} width={'100%'} px={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600} color="#6C6C6C">
            Hall No
          </Typography>
          <Typography color={displayPlaceholder ? "#A3A3A3" : "#3A3A3A"} fontStyle={displayPlaceholder ? "italic" : "normal"}>
            {displayPlaceholder ? "To be Allotted" : hallNumber}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600} color="#6C6C6C">
            Stall No
          </Typography>
          <Typography color={displayPlaceholder ? "#A3A3A3" : "#3A3A3A"} fontStyle={displayPlaceholder ? "italic" : "normal"}>
            {displayPlaceholder ? "To be Allotted" : stallNumber}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600} color="#6C6C6C">
            PLC
          </Typography>
          <Typography color={displayPlaceholder ? "#A3A3A3" : "#3A3A3A"} fontStyle={displayPlaceholder ? "italic" : "normal"}>
            {displayPlaceholder ? "To be Allotted" : plcMapping[plc || '']}
          </Typography>
        </Box>
      </Stack>

      <Button
        variant="contained"
        sx={{
          width: '100%',
          mt: 1,
          bgcolor: '#B6E2D3', // pastel green
          color: '#3A3A3A',
          '&:hover': { bgcolor: '#A7D7C5' },
          boxShadow: 'none',
        }}
        disabled={!featureOn || !allotmentLetterUrl}
        onClick={handleDownloadAllotment}
      >
        <Iconify icon="mdi:download" width={20} style={{ marginRight: 8 }} />
        Download Allotment Letter
      </Button>
    </Box>
  );
}
