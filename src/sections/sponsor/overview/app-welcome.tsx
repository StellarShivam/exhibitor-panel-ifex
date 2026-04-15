import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import Stack, { StackProps } from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import { bgGradient } from 'src/theme/css';
import { Box, Grid } from '@mui/material';
import { PACKAGE_ICONS } from 'src/sections/form-view/SponsorRegistration/SponsorPackageTable';

// ----------------------------------------------------------------------

type Props = StackProps & {
  title?: string;
  contactPersonName?: string;
  companyName?: string;
  contactPersonAddress?: string;
  sponsorshipType?: string;
  sponsorshipPricingCategory?: keyof typeof PACKAGE_ICONS;
};

export default function AppWelcome({
  title,
  contactPersonName,
  companyName,
  contactPersonAddress,
  sponsorshipPricingCategory,
  sponsorshipType,
  ...other
}: Props) {
  const theme = useTheme();

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{
        height: { md: 1 },
        borderRadius: 2,
        position: 'relative',
        color: 'white',
        backgroundColor: '#D43D88',
      }}
      {...other}
    >
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: { xs: 2, md: 3 },
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {title}
        </Typography>

        <Grid container rowSpacing={1}>
          <Grid item xs={5} md={4}>
            <Typography variant="body2">Contact Person :</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">{contactPersonName || 'Full Name'}</Typography>
          </Grid>

          <Grid item xs={5} md={4}>
            <Typography variant="body2">Company Name :</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">{companyName || 'Name'}</Typography>
          </Grid>

          <Grid item xs={5} md={4}>
            <Typography variant="body2">Complete Address:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">{contactPersonAddress || 'Address'}</Typography>
          </Grid>

          <Grid item xs={5} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Sponsorship opted for:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Box  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {sponsorshipPricingCategory && (
                <img
                  src={PACKAGE_ICONS[sponsorshipPricingCategory]}
                  alt={sponsorshipPricingCategory}
                  style={{ width: 40, height: 40 }}
                />
              )}
              <Typography variant="body2">
                {sponsorshipPricingCategory?.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || ""}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}
