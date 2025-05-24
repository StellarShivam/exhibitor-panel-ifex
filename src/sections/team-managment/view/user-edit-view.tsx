'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { _userList } from 'src/_mock';

import { useState, useEffect } from 'react';

import { LinearProgress } from '@mui/material';

import { useGetExhibitorUser } from 'src/api/team-management';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IUserItem } from 'src/types/user';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string | number;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();
  const [currentUser, setCurrentUser] = useState<IUserItem | undefined>(undefined);

  const { exhibitorUser, exhibitorUserLoading } = useGetExhibitorUser(Number(id));

  console.log(exhibitorUser);

  useEffect(() => {
    setCurrentUser(exhibitorUser);
  }, [exhibitorUser]);

  if (exhibitorUserLoading) {
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
            name: 'Team Management',
            href: paths.dashboard.teamManagement.root,
          },
          { name: currentUser?.fullName || 'Edit Member' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={currentUser} />
    </Container>
  );
}
