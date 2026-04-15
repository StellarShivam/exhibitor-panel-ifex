import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useMockedUser } from 'src/hooks/use-mocked-user';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';
import SponsorContactDialog from 'src/components/sponsor-contact-dialog';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavEventInfo from '../common/nav-event-info';
import NavToggleButton from '../common/nav-toggle-button';
import SocialMediaIcons from '../common/social-media-icons';
import BuyerInviteDialog from 'src/components/buyer-invite-dialog';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useMockedUser();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const { data: navData, sponsorDialog, buyerDialog } = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Logo sx={{ mt: 3, ml: 3, mb: 1 }} />
      </Box>

      <Box sx={{ position: 'relative' }}>
        <NavEventInfo />
        <NavSectionVertical
          data={navData}
          slotProps={{
            currentRole: user?.role,
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* <NavUpgrade /> */}
      {/* Sticky Follow Us Box */}
      {/* <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          py: 1.5,
          px: 3,
          bgcolor: 'background.paper',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          textAlign: 'left',
          fontWeight: 'bold',
          color: 'text.secondary',
        }}
      >
        <SocialMediaIcons />
      </Box> */}
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
      
      <SponsorContactDialog open={sponsorDialog.value} onClose={sponsorDialog.onFalse} />
      <BuyerInviteDialog open={buyerDialog.value} onClose={buyerDialog.onFalse} />
    </Box>
  );
}
