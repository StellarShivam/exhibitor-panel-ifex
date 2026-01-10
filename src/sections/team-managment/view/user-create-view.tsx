'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useGetEventList1 } from 'src/api/event';
import { useEventContext } from 'src/components/event-context';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();
  const { events, reFetchEventList } = useGetEventList1();
  const [totalBadgeCount, setTotalBadgeCount] = useState(0);
  const [usedBadgeCount, setUsedBadgeCount] = useState(0);
  const { eventData } = useEventContext();

  useEffect(() => {
    const totalCount = events.find(
      (event) => event.eventId === eventData.state.eventId
    )?.totalBadgeCount;
    const usedCount = events.find(
      (event) => event.eventId === eventData.state.eventId
    )?.usedBadgeCount;

    setTotalBadgeCount(totalCount);
    setUsedBadgeCount(usedCount);
  }, [events, eventData.state.eventId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Add New Member"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Team Management',
            href: paths.dashboard.teamManagement.root,
          },
          { name: 'Add Member' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        direction="row"
        // alignItems="center"
        gap={2}
        // justifyContent="space-between"
        sx={{
          backgroundColor: '#00B8D929',
          color: 'info.main',
          border: '2px solid #00B8D920',
          borderRadius: 1,
          px: 2,
          py: 1,
          mb: 1,
          width: '100%',
        }}
      >
        <Stack direction="row" alignItems="start" spacing={1}>
          <Iconify icon="fa7-solid:people-group" />
          <Typography variant="subtitle2" sx={{ color: 'info.main' }}>
            Total Members Allowed : <strong>{totalBadgeCount}</strong>
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 4 }}>
          <Iconify icon="ic:twotone-add-box" />
          <Typography variant="subtitle2" sx={{ color: 'info.main'}}>
            Members Added: <strong>{usedBadgeCount}</strong>
          </Typography>
        </Stack>
      </Stack>

      {totalBadgeCount > 0 && usedBadgeCount >= totalBadgeCount && (
        <Stack
          direction="row"
          // alignItems="center"
          gap={2}
          // justifyContent="space-between"
          sx={{
            backgroundColor: 'warning.lighter',
            color: 'info.main',
            border: '2px solid #ffdb91',
            borderRadius: 1,
            px: 2,
            py: 1,
            mb: 3,
            width: '100%',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>
          Your Badge limit has been exhausted, to increase the limit contact: Ritesh Bhati (Email: dba1@indiaexpocentre.com)
          </Typography>
        </Stack>
      )}

      <UserNewEditForm />
    </Container>
  );
}
