import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { IConnectItem } from 'src/types/connect';
import { fDateTime } from 'src/utils/format-time';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  connect: IConnectItem | null;
};

export default function ConnectDetailsSlider({ open, onClose, connect }: Props) {
  if (!connect) {
    return null;
  }

  const commonButtonSx = {
    height: 32,
    fontSize: 14,
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: 1.2,
    px: 2,
    minWidth: 'unset',
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: {
          width: 300,
          bgcolor: '#FAFAFA',
        },
      }}
    >
      <Stack sx={{ height: 1 }}>
        {/* Header */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontSize: 16, fontWeight: 600 }}>
            Profile
          </Typography>
        </Box>

        <Scrollbar sx={{ px: 3, py: 3, flexGrow: 1 }}>
          <Stack spacing={3}>
            {/* Profile Image and Basic Info */}
            <Stack spacing={2} alignItems="center">
              <Avatar
                src={connect.profileUrl}
                alt={connect.name}
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '12px',
                }}
              />
              <Stack spacing={0.5} alignItems="center">
                <Typography
                  variant="h6"
                  sx={{ color: 'text.primary', fontSize: 16, fontWeight: 600 }}
                >
                  {connect.name}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: 14,
                  }}
                >
                  <Iconify icon="solar:user-bold" width={16} height={16} />
                  {connect.type}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  fontSize: 14,
                  maxWidth: 280,
                }}
              >
                &ldquo;
                {connect.about ||
                  'The process is more important than the results. And if you take care of the process, you will get the results.'}
                &rdquo;
              </Typography>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', mx: -3, borderColor: '#E4E4E7' }} />

            {/* Interests */}
            <Stack spacing={1.5}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.primary', fontSize: 14, fontWeight: 600 }}
              >
                Interests
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {connect.interests?.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    size="small"
                    sx={{
                      bgcolor: '#F4F4F5',
                      color: '#71717A',
                      fontWeight: 500,
                      fontSize: 12,
                      height: 24,
                      borderRadius: '6px',
                      '& .MuiChip-label': {
                        px: 1.5,
                      },
                    }}
                  />
                ))}
              </Box>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', mx: -3, borderColor: '#E4E4E7' }} />

            {/* Contact Info */}
            <Stack spacing={1.5}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.primary', fontSize: 14, fontWeight: 600 }}
              >
                Contact Info
              </Typography>

              <Stack spacing={2}>
                <Link
                  href="tel:+91 98765 43210"
                  underline="none"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#18181B',
                    gap: 1.5,
                    fontSize: 14,
                  }}
                >
                  <Iconify icon="eva:phone-fill" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontSize: 14, color: 'text.primary' }}>
                    {connect.mobile}
                  </Typography>
                </Link>

                <Link
                  href="mailto:khalid_watsica@reed.ca"
                  underline="none"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#18181B',
                    gap: 1.5,
                    fontSize: 14,
                  }}
                >
                  <Iconify icon="eva:email-fill" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontSize: 14, color: 'text.primary' }}>
                    {connect.email}
                  </Typography>
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Scrollbar>

        {/* Action Buttons */}
        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: '#E4E4E7' }}>
          <Stack direction="row" spacing={2}>
            <Button
              size="small"
              variant="contained"
              disableElevation
              sx={{
                ...commonButtonSx,
                bgcolor: '#18181B',
                color: 'common.white',
                '&:hover': { bgcolor: '#18181B' },
              }}
            >
              Chat
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{
                ...commonButtonSx,
                borderColor: '#E4E4E7',
                color: '#18181B',
                bgcolor: 'common.white',
                '&:hover': {
                  borderColor: '#E4E4E7',
                  bgcolor: 'common.white',
                },
              }}
            >
              Schedule Meeting
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
}
