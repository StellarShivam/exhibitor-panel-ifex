'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useEventContext } from 'src/components/event-context';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useGetExhibitorUsers } from 'src/api/team-management';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();
  const { exhibitorUsers, exhibitorUsersMemberCapping, exhibitorUsersLoading, reFetchExhibitorUsers } = useGetExhibitorUsers();
  const { eventData } = useEventContext();
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
          mb: 3,
          width: '100%',
        }}
      >
        <Stack direction="row" alignItems="start" spacing={1}>
          {/* <InfoIcon sx={{ color: 'info.main' }} /> */}
          <Typography variant="subtitle2" sx={{ color: 'info.main' }}>
            <strong>•</strong> Total Members Allowed :{' '}
            <strong>
              {exhibitorUsersMemberCapping}
            </strong>
          </Typography>
        </Stack>
        <Typography variant="subtitle2" sx={{ color: 'info.main', ml: 4 }}>
          <strong>•</strong> Members Added:{' '}
          <strong>
            {exhibitorUsers?.length}
          </strong>
        </Typography>
      </Stack>

      <UserNewEditForm />
    </Container>
  );
}
