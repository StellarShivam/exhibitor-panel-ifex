import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import React from 'react';
import { useEventContext } from 'src/components/event-context';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function NavEventInfo() {
  const { eventData } = useEventContext();

  return (
    <Stack
      sx={{
        px: 2,
        py: 3,
        bgcolor: 'background.neutral',
        borderRadius: 1,
        mx: 2,
        mb: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <img
          src={'/IFEX_LOGO.png'}
          alt={'IFEX'}
          width={40}
          height={40}
          style={{ objectFit: 'contain' }}
        />
        <Typography variant="h6">IFEX 2027</Typography>
      </Stack>

      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Iconify icon="mdi:calendar-month-outline" color="primary" width={20} height={20} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {format(new Date('2027-02-08'), 'dd MMM')}
            &nbsp;-&nbsp;
            {format(new Date('2027-02-10'), 'dd MMM')}
          </Typography>
        </Stack>

        {/* <Stack direction="row" alignItems="center" spacing={0.8}>
          <Iconify icon="mdi:clock-time-four-outline" color="primary" width={20} height={20} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            10:00 AM - 5:00 PM
          </Typography>
        </Stack> */}

        <Stack direction="row" alignItems="start" spacing={0.8}>
          <Iconify icon="mdi:map-marker-outline" color="primary" minWidth={20} minHeight={20} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            India Expo Centre and Mart<br />
            Plot No. 23-25 & 27-29, Knowledge Park-II, Gautam Buddha Nagar, Greater Noida - 201306
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
