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
          src={eventData?.state.eventLogo}
          alt={eventData?.state.eventName}
          width={40}
          height={40}
          style={{ objectFit: 'cover' }}
        />
        <Typography variant="h6">{eventData?.state.eventName || 'Event Name'}</Typography>
      </Stack>

      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Iconify icon="mdi:calendar-month-outline" color="primary" width={20} height={20} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {eventData?.state.startDate && format(new Date(eventData?.state.startDate), 'dd MMM')}
            &nbsp;-&nbsp;
            {eventData?.state.endDate && format(new Date(eventData?.state.endDate), 'dd MMM yy')}
          </Typography>
        </Stack>

        {/* <Stack direction="row" alignItems="center" spacing={0.8}>
          <Iconify icon="mdi:clock-time-four-outline" color="primary" width={20} height={20} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            10:00 AM - 5:00 PM
          </Typography>
        </Stack> */}

        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Iconify icon="mdi:map-marker-outline" color="primary" minWidth={20} minHeight={20} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {eventData?.state.location || 'Location'}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
