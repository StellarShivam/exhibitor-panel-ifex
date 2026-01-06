import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Iconify from 'src/components/iconify';

export default function ExhibitorManual() {
  const dummyLink =
    'https://sit-event-backend-public.s3.amazonaws.com/event/img/ad_ur/1/1767611198208_IFEX-2026-Exhibitors_final_manual.pdf';

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Exhibitor Manual
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          The official exhibitor manual for IFEX 2026 is now available here.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
          <Button
            component="a"
            href={dummyLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="success"
            startIcon={<Iconify icon="eva:cloud-download-fill" width={24} />}
            sx={{ width: '100%' }}
          >
            Download Exhibitor Manual
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
