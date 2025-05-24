'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TicketNewEditForm from '../ticket-new-edit-form';

// ----------------------------------------------------------------------

export default function TicketCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Ticket"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Help & Support',
            href: paths.dashboard.helpAndSupport.root,
          },
          { name: 'New Ticket' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TicketNewEditForm />
    </Container>
  );
}
