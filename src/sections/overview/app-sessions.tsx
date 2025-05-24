'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
// import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import { useGetSessions } from 'src/api/overview';

// Mock data for sessions
const dummyAvatars = [
  {
    id: 1,
    name: 'Rekha Nair',
    avatar:
      'https://media-hosting.imagekit.io/016249fc40e642a8/avatar-1.png?Expires=1838193762&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=H-g3~0aidoHdMxKsVEsvSnp4rsDdKonsuIKwGTSbeoI1BU-yZHf-v8rK9e9eUBp0pU4dn6Y3i2wisilE~T2hhgz-iAuNCCZnMfG4S06iDhgaDbrJXklQl~gjGGN2aAAmxrVjqLJbfs2Zrwd3gTdE0BRh40yzPFj0PaZBAZyhCATyMgUcxdU7aGcJWew4DERSj8trdobHpMLJy-CjhGzVJI~skIcJYaTHsviwAnFrWRPJTEGY2DeJT60dTxnV4QYruEsNvvOLr~sao11H4lSUUD1qSmCYIQFGcBtgUdlETnCCK~rKf5X0UM6k1wA9vxrn~W9a4Ic7CI7N0ioDqA0WfQ__',
  },
  {
    id: 2,
    name: 'Meson',
    avatar:
      'https://media-hosting.imagekit.io/16b7c149069f447c/avatar-2.png?Expires=1838193801&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=i8zOWpa2iXnGqXPXlqto1xLRQ6xRjsEyVNNApIDaUANYSKGVqnFgmGhBSDBG6ybr33djH3s6aDbxbxcqPIOq0y0-OB2MskBFDqJnt4EEwVNoZ3hv3MTKrh-r2TNGA~cuHRvgRrDYQj~mae7C00YZB2MbtHCdCNEpuzDHcLVLu18zNB07Mq5T77ESTsgGFXomuuDYwLUrrCa2rKtJeY5kW4ryjZCaalXQd67qkuwHM3tbfi5NCRcmIwRG0F39c1aY6IIs0f5K6pSsISwbdIDvFm9n2t1v~ah3i3IHHcTgnAyir4b8ZTqFzvhgyyHn463Y1EGI~7r3V-fTKj5vKbXJMw__',
  },
  {
    id: 3,
    name: 'Taylor',
    avatar:
      'https://media-hosting.imagekit.io/a58daaa218854df1/avatar-3.png?Expires=1838193838&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=SQhWKD1ZNlRGXs5lSuVHBEuwSDd86fSLSr0ZOIWame1d91I6yxGdRsuNTquS5qqR7IEy5oSnXccVcuXnoP3u2Tgd1zvukZNBjnTIVq-the9rYSz3dB2-4Mxc1S4GG-JI-yX00m7apd5whtg07FKPH9-izmqTyFfjwZYohc3ZgXsdtw4dpYAzSsyYvlnrW1VpSJ6bHSBUlu11ZhyIi65Hy9jGh9ET5k5qTeJc46kwzt9San4LWI4KPeRrXDobT~e84~6vkQKaWOOwMl8gUwcZhkr-vtCPacH8E6-cVUoDRwfqbW7nd5tPkY4GXVfH0~5YiRi9aVOZz9Xy37B74hicBQ__',
  },
];

export default function AppSessions() {
  const { sessions, reFetchSessions } = useGetSessions();

  console.log(sessions);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const formatTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  };

  return (
    <Card sx={{ boxShadow: 'none', bgcolor: 'transparent', border: 'none' }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
        //   sx={{
        //     pb: 1,
        //     borderBottom: '1.4px dashed',
        //     borderColor: 'divider',
        //   }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            My Sessions
          </Typography>
        </Box>

        {/* <Divider /> */}

        <Stack spacing={3}>
          {sessions.length === 0 ? (
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}
            >
              No sessions scheduled for you
            </Typography>
          ) : (
            sessions.map((session) => (
              <Stack
                key={session.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {session.title}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={0.1}>
                    <CalendarMonthOutlinedIcon sx={{ width: 14, height: 14 }} />
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {formatDate(session.startTime)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {formatTime(session.startTime, session.endTime)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <AvatarGroup
                    max={3}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: 24,
                        height: 24,
                        fontSize: '0.75rem',
                      },
                    }}
                  >
                    {dummyAvatars.map((attendee) => (
                      <Avatar key={attendee.id} alt={attendee.name} src={attendee.avatar} />
                    ))}
                  </AvatarGroup>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 120,
                    }}
                  >
                    {session.inviteFrom}
                  </Typography>
                </Stack>
              </Stack>
            ))
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
