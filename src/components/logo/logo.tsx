import Image from 'next/image';
import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// import logoImage from 'src/assets/Eventstart_logo.png';

// ------------------------------[----------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const filter = theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none';

    const logo = (
      <Box
        ref={ref}
        sx={{
          width: 166,
          height: 47,
          display: 'inline-flex',
          position: 'relative',
          ...sx,
        }}
        {...other}
      >
        <Image
          src="/logo/wfi_black_logo-new.png"
          alt="Logo"
          fill
          priority
          sizes="166px"
          style={{
            objectFit: 'contain',
            filter,
          }}
        />
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
