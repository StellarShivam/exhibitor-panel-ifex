import { Dialog, DialogTitle, IconButton, Stack, Button, Typography, Box } from '@mui/material';
import Iconify from 'src/components/iconify';
import FileThumbnail from 'src/components/file-thumbnail';
import { paths } from 'src/routes/paths';

import { RouterLink } from 'src/routes/components';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onUploadClick: VoidFunction;
  onCreateClick: VoidFunction;
};

export default function PortfolioUploadModal({
  open,
  onClose,
  onUploadClick,
  onCreateClick,
}: Props) {
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: { xs: '100%', md: '800px' },
          maxWidth: { xs: '100%', md: '800px' },
        },
      }}
    >
      <DialogTitle sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">New Portfolio</Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Stack spacing={3} sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {/* Upload PDF Option */}
          <Stack
            sx={{
              p: 3,
              borderRadius: 1,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'common.white',
            }}
          >
            <Stack alignItems="center" spacing={1.5}>
              <FileThumbnail file="sample.pdf" sx={{ width: 40, height: 40 }} />

              <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 'normal' }}>
                Already have a portfolio?
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Upload Portfolio PDF
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Supported formats: PDF (Max size: 20MB)
              </Typography>

              <Button
                onClick={onUploadClick}
                sx={{
                  mt: 1,
                  py: 1,
                  px: 3,
                  bgcolor: 'grey.900',
                  color: 'common.white',
                  borderRadius: 1,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'grey.900',
                    opacity: 0.8,
                  },
                }}
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              >
                Upload
              </Button>
            </Stack>
          </Stack>

          {/* Create Portfolio Option */}
          <Stack
            sx={{
              p: 3,
              borderRadius: 1,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'common.white',
            }}
          >
            <Stack alignItems="center" spacing={1.5}>
              <FileThumbnail
                file="folder.jpg"
                sx={{
                  width: 40,
                  height: 40,
                  '& .MuiBox-root': {
                    bgcolor: 'success.main',
                  },
                }}
              />

              <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 'normal' }}>
                Build a organized portfolio in minutes
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Create Portfolio with Us
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                You can edit or update your portfolio anytime.
              </Typography>

              <Button
                component={RouterLink}
                href={paths.dashboard.productPortfolio.new}
                sx={{
                  mt: 1,
                  py: 1,
                  px: 3,
                  bgcolor: 'grey.900',
                  color: 'common.white',
                  borderRadius: 1,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'grey.900',
                    opacity: 0.8,
                  },
                }}
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Create
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Dialog>
  );
}
