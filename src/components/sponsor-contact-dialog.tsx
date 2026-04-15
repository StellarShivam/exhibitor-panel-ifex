import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export default function SponsorContactDialog({ open, onClose }: Props) {
  const sponsorContact = {
    name: 'Mr. Shishir Lahoti',
    email: 'event@bharat-tex.com',
    phone: '+91-8527313193',
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6">Sponsorship Contact Information</Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>

      <Stack spacing={3} sx={{ p: 3, pt: 0 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          For sponsorship opportunities and inquiries, please contact:
        </Typography>

        <Stack spacing={2}>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:user-bold" width={20} sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Name
                  </Typography>
                  <Typography variant="subtitle1">{sponsorContact.name}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:letter-bold" width={20} sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Email
                  </Typography>
                  <Typography variant="subtitle1">{sponsorContact.email}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:phone-bold" width={20} sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Phone
                  </Typography>
                  <Typography variant="subtitle1">{sponsorContact.phone}</Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:letter-bold" />}
            href={`mailto:${sponsorContact.email}`}
          >
            Send Email
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
