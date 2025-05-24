import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import Image from 'src/components/image';
import { ITeamMember } from 'src/types/team';

// ----------------------------------------------------------------------

const MEMBERS = [
  {
    id: 1,
    name: 'Mr.Arun',
    role: 'Managing Director',
    avatarUrl:
      'https://media-hosting.imagekit.io/a58daaa218854df1/avatar-3.png?Expires=1838193838&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=SQhWKD1ZNlRGXs5lSuVHBEuwSDd86fSLSr0ZOIWame1d91I6yxGdRsuNTquS5qqR7IEy5oSnXccVcuXnoP3u2Tgd1zvukZNBjnTIVq-the9rYSz3dB2-4Mxc1S4GG-JI-yX00m7apd5whtg07FKPH9-izmqTyFfjwZYohc3ZgXsdtw4dpYAzSsyYvlnrW1VpSJ6bHSBUlu11ZhyIi65Hy9jGh9ET5k5qTeJc46kwzt9San4LWI4KPeRrXDobT~e84~6vkQKaWOOwMl8gUwcZhkr-vtCPacH8E6-cVUoDRwfqbW7nd5tPkY4GXVfH0~5YiRi9aVOZz9Xy37B74hicBQ__',
  },
  {
    id: 2,
    name: 'Mr.Arun',
    role: 'Managing Director',
    avatarUrl:
      'https://media-hosting.imagekit.io/a58daaa218854df1/avatar-3.png?Expires=1838193838&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=SQhWKD1ZNlRGXs5lSuVHBEuwSDd86fSLSr0ZOIWame1d91I6yxGdRsuNTquS5qqR7IEy5oSnXccVcuXnoP3u2Tgd1zvukZNBjnTIVq-the9rYSz3dB2-4Mxc1S4GG-JI-yX00m7apd5whtg07FKPH9-izmqTyFfjwZYohc3ZgXsdtw4dpYAzSsyYvlnrW1VpSJ6bHSBUlu11ZhyIi65Hy9jGh9ET5k5qTeJc46kwzt9San4LWI4KPeRrXDobT~e84~6vkQKaWOOwMl8gUwcZhkr-vtCPacH8E6-cVUoDRwfqbW7nd5tPkY4GXVfH0~5YiRi9aVOZz9Xy37B74hicBQ__',
  },
  {
    id: 3,
    name: 'Mr.Arun',
    role: 'Managing Director',
    avatarUrl:
      'https://media-hosting.imagekit.io/a58daaa218854df1/avatar-3.png?Expires=1838193838&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=SQhWKD1ZNlRGXs5lSuVHBEuwSDd86fSLSr0ZOIWame1d91I6yxGdRsuNTquS5qqR7IEy5oSnXccVcuXnoP3u2Tgd1zvukZNBjnTIVq-the9rYSz3dB2-4Mxc1S4GG-JI-yX00m7apd5whtg07FKPH9-izmqTyFfjwZYohc3ZgXsdtw4dpYAzSsyYvlnrW1VpSJ6bHSBUlu11ZhyIi65Hy9jGh9ET5k5qTeJc46kwzt9San4LWI4KPeRrXDobT~e84~6vkQKaWOOwMl8gUwcZhkr-vtCPacH8E6-cVUoDRwfqbW7nd5tPkY4GXVfH0~5YiRi9aVOZz9Xy37B74hicBQ__',
  },
  {
    id: 4,
    name: 'Mr.Arun',
    role: 'Managing Director',
    avatarUrl:
      'https://media-hosting.imagekit.io/a58daaa218854df1/avatar-3.png?Expires=1838193838&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=SQhWKD1ZNlRGXs5lSuVHBEuwSDd86fSLSr0ZOIWame1d91I6yxGdRsuNTquS5qqR7IEy5oSnXccVcuXnoP3u2Tgd1zvukZNBjnTIVq-the9rYSz3dB2-4Mxc1S4GG-JI-yX00m7apd5whtg07FKPH9-izmqTyFfjwZYohc3ZgXsdtw4dpYAzSsyYvlnrW1VpSJ6bHSBUlu11ZhyIi65Hy9jGh9ET5k5qTeJc46kwzt9San4LWI4KPeRrXDobT~e84~6vkQKaWOOwMl8gUwcZhkr-vtCPacH8E6-cVUoDRwfqbW7nd5tPkY4GXVfH0~5YiRi9aVOZz9Xy37B74hicBQ__',
  },
];

// ----------------------------------------------------------------------
type AssociatedMembersProps = {
  members: ITeamMember[];
};

export default function AssociatedMembers({ members }: AssociatedMembersProps) {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, mt: 6 }}>
        Associated Members
      </Typography>

      <Grid container spacing={3}>
        {members.map((member) => (
          <Grid key={member.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                p: 0,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: theme.customShadows.z8,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ pt: '100%', position: 'relative' }}>
                <Avatar
                  alt={member?.fullName}
                  src={member?.profileUrl}
                  sx={{
                    top: 0,
                    width: 1,
                    height: 1,
                    position: 'absolute',
                    bgcolor: theme.palette.primary.main,
                    fontSize: '4rem',
                    borderRadius: 0,
                    '& .MuiAvatar-img': {
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    },
                  }}
                >
                  {member?.fullName?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>

              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {member.fullName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {member.designation}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
