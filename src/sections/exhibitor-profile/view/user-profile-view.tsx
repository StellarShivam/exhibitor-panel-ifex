'use client';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { Button, LinearProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { _userAbout, _userFeeds } from 'src/_mock';
import { useEventContext } from 'src/components/event-context';
import { useGetExhibitor } from 'src/api/exhibitor-profile';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { RouterLink } from 'src/routes/components';
import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProductPortfolio from '../product-portfolio';
import AssociatedMembers from '../associated-members';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  // {
  //   value: 'associatedMembers',
  //   label: 'Associated Members',
  //   icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  // },
  // {
  //   value: 'productPortfolio',
  //   label: 'Product Portfolio',
  //   icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  // },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const { user } = useMockedUser();
  const { eventData } = useEventContext();
  const [currentTab, setCurrentTab] = useState('profile');

  const { exhibitor, exhibitorUsers, exhibitorLoading } = useGetExhibitor(
    eventData?.state.exhibitorId
  );

  console.log('exhibitorUsers***********', exhibitorUsers);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  if (exhibitorLoading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Profile' },
          { name: exhibitor?.companyName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.exhibitorProfile.edit(String(eventData?.state.exhibitorId))}
            variant="contained"
            startIcon={<Iconify icon="line-md:edit-twotone" />}
          >
            Edit Profile
          </Button>
        }
      />

      <Card
        sx={{
          mb: 0,
          height: 240,
          position: 'relative',
          boxShadow: 'none',
          bgcolor: 'transparent',
          border: 'none',
          overflow: 'visible',
        }}
      >
        <ProfileCover
          role={_userAbout.role}
          name={exhibitor?.companyName}
          avatarUrl={exhibitor?.imgUrl}
          coverUrl={user?.coverUrl}
        />
      </Card>

      <Card
        sx={{
          mb: 3,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: 'none',
          bgcolor: 'transparent',
          border: 'none',
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,

            [`& .${tabsClasses.flexContainer}`]: {
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && <ProfileHome info={exhibitor} posts={_userFeeds} />}

      {/* {currentTab === 'associatedMembers' && <AssociatedMembers members={exhibitorUsers} />} */}

      {/* {currentTab === 'productPortfolio' && <ProductPortfolio />} */}
    </Container>
  );
}
