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
import { useGetExhibitor } from 'src/api/exhibitor-profile';
import { useExhibitorForm } from 'src/api/forms';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();
  const { eventData } = useEventContext();

  const { exhibitor } = useGetExhibitor(eventData?.state.exhibitorId);
  const { exhibitorForm } = useExhibitorForm(exhibitor?.supportEmail, eventData?.state.eventId);



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
            Total Members Allowed : <strong>{exhibitorForm?.totalBadgeCount}</strong>
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 4 }}>
          <Iconify icon="ic:twotone-add-box" />
          <Typography variant="subtitle2" sx={{ color: 'info.main'}}>
            Members Added: <strong>{exhibitorForm?.usedBadgeCount}</strong>
          </Typography>
        </Stack>
      </Stack>

      {exhibitorForm?.totalBadgeCount > 0 && exhibitorForm?.usedBadgeCount >= exhibitorForm?.totalBadgeCount && (
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
