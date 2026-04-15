'use client';

import { Box } from '@mui/material';
import { GuestGuard } from 'src/auth/guard';
import Footer from 'src/components/footer/footer';
import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          mb: { xs: 0, lg: '60px' },
        }}
      >
        <Box sx={{ height: 'calc(100% - 50px)' }}>
          {children}
        </Box>
        {/* <Footer left="0" /> */}
      </Box>
    </GuestGuard>
  );
}
