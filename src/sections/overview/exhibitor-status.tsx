import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import Card, { CardProps } from '@mui/material/Card';
import Stack, { StackProps } from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import { bgGradient } from 'src/theme/css';
import { Box } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  title?: string;
  status?: string;
  paymentStatus?: string;
  waitlisted?: boolean;
};

export default function ExhibitorStatus({ title, status, paymentStatus, waitlisted, ...other }: Props) {
  const theme = useTheme();

  const statusImage = () => {
    if (paymentStatus === 'INITIATED') {
      return 'UNDER REVIEW.png';
    }
    if (status === 'PENDING') {
      return 'PENDING.png';
    }
    if (status === 'REGISTERED') {
      return 'SUBMITTED.png';
    }
    return 'ACTIVE.png';
  };

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{
        height: { md: 1 },
        borderRadius: 2,
        position: 'relative',
        color: 'primary.darker',
        backgroundColor: 'common.white',
      }}
      {...other}
    >
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
        sx={{
          p: {
            xs: theme.spacing(5, 3, 0, 3),
            md: theme.spacing(3, 0, 3, 3),
          },
        }}
      >
        <Typography variant="h4" sx={{ whiteSpace: 'pre-line' }} color={'black'}>
          {title}
        </Typography>

        <Box
          component={'img'}
          src={`/assets/status/${statusImage()}`}
          sx={{
            width: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        {waitlisted && (
          <Chip
            icon={<Iconify icon="mdi:timer-sand" width={18} />}
            label="Waitlisted"
            variant="outlined"
            size="medium"
            sx={{
              mt: 2,
              fontWeight: 900,
              fontSize: '0.875rem',
              px: 1.25,
              height: 36,
              borderWidth: 1.25,
              borderColor: '#F5E6A3',
              color: '#B8860B',
              backgroundColor: '#FFFACD',
              '& .MuiChip-icon': {
                color: 'inherit',
              },
            }}
          />
        )}
      </Stack>
    </Stack>
  );
}
