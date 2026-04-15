import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { hideScroll } from 'src/theme/css';

import Logo from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';
import SponsorContactDialog from 'src/components/sponsor-contact-dialog';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';
import Image from 'next/image';
import BuyerInviteDialog from 'src/components/buyer-invite-dialog';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useMockedUser();

  const { data: navData, sponsorDialog, buyerDialog } = useNavData();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Box
          sx={{
            width: 70,
            height: 70,
            display: 'inline-flex',
            position: 'relative',
            mx: 'auto',
            my: 2,
          }}
        >
          <Image
            src="/IFEX_LOGO.png"
            alt="Logo"
            fill
            priority
            // sizes="250px"
            style={{
              objectFit: 'contain',
              filter: 'none',
            }}
          />
        </Box>

        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: user?.role,
          }}
        />
      </Stack>
      
      <SponsorContactDialog open={sponsorDialog.value} onClose={sponsorDialog.onFalse} />
      <BuyerInviteDialog open={buyerDialog.value} onClose={buyerDialog.onFalse} />
    </Box>
  );
}
