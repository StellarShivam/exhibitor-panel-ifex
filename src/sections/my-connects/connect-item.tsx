import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { IConnectItem } from 'src/types/connect';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  connect: IConnectItem;
  onConnectClick?: (connect: IConnectItem) => void;
};

export default function ConnectItem({ connect, onConnectClick }: Props) {
  const { name, type, profileUrl } = connect;

  const handleClick = () => {
    if (onConnectClick) {
      onConnectClick(connect);
    }
  };

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
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Stack spacing={1.5}>
        {/* Header with more options */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -1 }}>
          <IconButton size="small" sx={{ mr: -1, mt: -1 }}>
            <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
          </IconButton>
        </Box>

        {/* Profile Image */}
        <Box sx={{ position: 'relative', textAlign: 'center', mb: 0.5 }}>
          <Avatar
            src={profileUrl}
            alt={name}
            onClick={handleClick}
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Name and Role */}
        <Stack spacing={0.5} alignItems="center">
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              color: 'text.primary',
            }}
            onClick={handleClick}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: 14,
            }}
          >
            <Iconify icon="solar:user-bold" width={16} height={16} />
            {type}
          </Typography>
        </Stack>

        <Divider
          sx={{
            borderColor: '#E4E4E7',
            borderStyle: 'dashed',
            borderWidth: '0px 0px thin',
            mx: -2,
          }}
        />

        {/* Action Buttons */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
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
      </Stack>
    </Card>
  );
}
