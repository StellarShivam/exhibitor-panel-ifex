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
          width: 150,
          height: 100,
          display: 'inline-flex',
          position: 'relative',
          ...sx,
        }}
        {...other}
      >
        <Image
          src="/IFEX_LOGO.png"
          alt="IFEX Logo"
          fill
          priority
          // sizes="250px"
          style={{
            objectFit: 'contain',
            filter: 'none',
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
