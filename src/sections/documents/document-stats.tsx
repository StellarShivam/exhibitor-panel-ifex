import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { IProcessedDocument } from 'src/types/documents';
import Iconify from 'src/components/iconify';

type Props = {
  documents: IProcessedDocument[];
};

export default function DocumentStats({ documents }: Props) {
  const totalDocs = documents.length;
  const uploadedDocs = documents.filter((doc) => doc.url).length;
  const uploadPercentage = Math.round((uploadedDocs / totalDocs) * 100) || 0;

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        borderRadius: '16px',
        width: 'fit-content',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 4, sm: 8 }}>
        {/* Total Documents */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              display: 'flex',
              borderRadius: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 171, 0, 0.12)',
            }}
          >
            <Iconify
              icon="solar:folder-bold"
              sx={{
                width: 28,
                height: 28,
                color: '#FFAB00',
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: '13px',
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              Total Documents
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
              }}
            >
              {String(totalDocs).padStart(2, '0')}
            </Typography>
          </Box>
        </Stack>

        {/* Uploaded Documents */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ position: 'relative', width: 56, height: 56 }}>
            <CircularProgress
              variant="determinate"
              value={uploadPercentage}
              size={56}
              thickness={3}
              sx={{
                color: '#36B37E',
                '.MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {uploadPercentage}%
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '13px',
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              Uploaded Documents
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
              }}
            >
              {String(uploadedDocs).padStart(2, '0')}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}
