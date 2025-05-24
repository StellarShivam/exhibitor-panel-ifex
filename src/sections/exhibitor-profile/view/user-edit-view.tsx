'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { _userList } from 'src/_mock';

import { useState, useEffect } from 'react';

import { LinearProgress } from '@mui/material';

import { useGetExhibitor } from 'src/api/exhibitor-profile';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IExhibitorItem } from 'src/types/team';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string | number;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();
  const [currentUser, setCurrentUser] = useState<IExhibitorItem | undefined>(undefined);

  const { exhibitor, exhibitorLoading } = useGetExhibitor(Number(id));

  useEffect(() => {
    setCurrentUser(exhibitor);
  }, [exhibitor]);

  if (exhibitorLoading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Exhibitor Profile',
            href: paths.dashboard.exhibitorProfile.root,
          },
          { name: currentUser?.companyName || 'Edit Profile' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={currentUser} />
    </Container>
  );
}
