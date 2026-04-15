import { Box, Typography } from '@mui/material';
import React from 'react';

type TProps = {
  description: React.ReactNode;
};

function CompanyProfile({ description }: TProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
        alignItems: 'center',
        height: '100%',
        border: '2px #D43D88 solid',
        borderBottom: '8px #D43D88 solid',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        bgcolor={'#31B896'}
        color={'white'}
        width={'100%'}
        textAlign={'left'}
        px={2}
        py={1}
        borderRadius={0.75}
        fontWeight={700}
        fontSize={16}
      >
        Company Profile
      </Typography>

      <Typography width={'100%'} textAlign={'left'} pl={1}>
        {description}
      </Typography>
    </Box>
  );
}

export default CompanyProfile;
