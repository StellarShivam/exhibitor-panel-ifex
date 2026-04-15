import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { varHover } from 'src/components/animate';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

const RESOURCE_OPTIONS = [
  {
    label: 'Get Venue Directions',
    icon: 'eva:navigation-2-outline',
    linkTo:
      'https://share.google/vr4kaJj3LzFhD3nLg',
  },
  // {
  //   label: 'Hotel List',
  //   icon: 'eva:home-outline',
  //   linkTo:
  //     'https://upinternationaltradeshow.com/wp-content/uploads/2025/08/IFEX-2025-Hotel-List-.pdf',
  // },
  // {
  //   label: 'Download Kit',
  //   icon: 'eva:folder-outline',
  //   linkTo: 'https://upinternationaltradeshow.com/media-kit/',
  // },
  {
    // label: 'Contact Us',
    // icon: 'eva:phone-outline',
    // linkTo: 'https://bharat-tex.com/contact-us/',
  },
  //   {
  //     label: 'FAQs',
  //     icon: 'eva:question-mark-circle-outline',
  //     linkTo: '#',
  //   },
];

// ----------------------------------------------------------------------

export default function ResourcesPopover() {
  const popover = usePopover();
  const theme = useTheme();
  const handleClickItem = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    popover.onClose();
  };

  return (
    <>
      <Button
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          minWidth: 'auto',
          px: 2,
          py: 1,
          ...bgGradient({
            direction: '135deg',
            startColor: alpha(theme.palette.primary.light, 0.2),
            endColor: alpha(theme.palette.primary.main, 0.2),
          }),
          color: 'primary.darker',
          fontSize: '1rem',
          fontWeight: 600,
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'common.white',
          }),
        }}
      >
        Event Information
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 230, p: 0 }}>
        {/* <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            Resources
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <Stack sx={{ p: 1 }}>
          {RESOURCE_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleClickItem(option.linkTo)}
              disabled={option.linkTo === '#'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1,
                px: 1.5,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                ...(option.linkTo === '#' && {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                }),
              }}
            >
              <Iconify icon={option.icon} />
              <Typography variant="body2">{option.label}</Typography>
              {/* {option.linkTo !== '#' && (
                <Iconify
                  icon="eva:external-link-outline"
                  width={16}
                  sx={{ ml: 'auto', opacity: 0.6 }}
                />
              )} */}
            </MenuItem>
          ))}
        </Stack>
      </CustomPopover>
    </>
  );
}
