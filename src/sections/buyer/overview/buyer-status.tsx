import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import Card, { CardProps } from '@mui/material/Card';
import Stack, { StackProps } from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import { bgGradient } from 'src/theme/css';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = StackProps & {
  title?: string;
  status?: string;
  paymentStatus?: string;
};

export default function BuyerStatus({ title, status, paymentStatus, ...other }: Props) {
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
    return 'APPROVED.png'
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
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: {
            xs: theme.spacing(5, 3, 0, 3),
            md: theme.spacing(3, 0, 3, 3),
          },
          textAlign: { xs: 'center', md: 'left' },
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
      </Stack>
    </Stack>
  );
}
