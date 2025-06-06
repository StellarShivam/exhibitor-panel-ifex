import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useEventContext } from 'src/components/event-context';

import { IUserProfileCover } from 'src/types/user';

// ----------------------------------------------------------------------

export default function ProfileCover({ name, avatarUrl, role, coverUrl }: IUserProfileCover) {
  const theme = useTheme();
  const router = useRouter();
  const { eventData } = useEventContext();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.primary.darker, 0.8),
          imgUrl: coverUrl,
        }),
        height: 1,
        color: 'common.white',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          left: { md: 24 },
          bottom: { md: -60 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            alt={name}
            src={avatarUrl}
            sx={{
              mx: 'auto',
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
              textAlign: 'center',
              fontSize: { xs: '0.75rem' },
            }}
          >
            {/* {name?.charAt(0).toUpperCase()} */}
            Upload
            <br />
            Company&nbsp;Logo
          </Avatar>
          <IconButton
            onClick={() =>
              router.push(
                paths.dashboard.exhibitorProfile.edit(String(eventData?.state.exhibitorId))
              )
            }
            sx={{
              position: 'absolute',
              bottom: -8,
              right: -8,
              bgcolor: 'background.paper',
              width: 34,
              height: 34,
              zIndex: 9,
              boxShadow: (t) => t.customShadows?.z8,
              '&:hover': {
                bgcolor: 'background.paper',
              },
              '&:hover svg': {
                transform: 'scale(1.4)',
              },
              '& svg': {
                transition: 'transform 0.2s',
                width: 28,
                height: 28,
              },
            }}
          >
            <Iconify icon="eva:edit-2-fill" />
          </IconButton>
        </Box>

        {/* <ListItemText
          sx={{
            mt: 3,
            ml: { md: 3 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
          primary={name}
          secondary={role}
          primaryTypographyProps={{
            typography: 'h4',
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: 'inherit',
            component: 'span',
            typography: 'body2',
            sx: { opacity: 0.48 },
          }}
        /> */}
      </Stack>
    </Box>
  );
}
