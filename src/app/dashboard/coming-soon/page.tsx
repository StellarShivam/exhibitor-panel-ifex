'use client';
import { Box, Typography } from "@mui/material";
import { ComingSoonIllustration } from "src/assets/illustrations";

// ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Dashboard: Comming Soon!',
// };
export default function Page() {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Center the entire content
          display: 'flex',
          flexDirection: 'column', // Stack items vertically
          alignItems: 'center', // Center items horizontally
          textAlign: 'center', // Center text
        }}
      >
        <ComingSoonIllustration
          sx={{
            width: '150%',
            height: '150%',
            objectFit: 'contain',
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            marginTop: 2, // Add spacing between the illustration and text
          }}
        >
          Coming Soon!
        </Typography>
      </Box>
    </>
  );
}