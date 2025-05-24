'use client';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';

import { useGetConnects } from 'src/api/connect';
import { IConnectItem } from 'src/types/connect';
import { useEventContext } from 'src/components/event-context';

import ConnectList from '../connect-list';
import ConnectDetailsSlider from '../connect-details-slider';
import { ComingSoonIllustration } from 'src/assets/illustrations';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function MyConnectsView() {
  return (
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
  )
  // const settings = useSettingsContext();
  // const [searchQuery, setSearchQuery] = useState('');
  // const [selectedConnect, setSelectedConnect] = useState<IConnectItem | null>(null);

  // const { eventData } = useEventContext();

  // const { connects, connectsLoading } = useGetConnects(eventData?.state?.exhibitorId);

  // const handleConnectClick = (connect: IConnectItem) => {
  //   setSelectedConnect(connect);
  // };

  // const handleCloseDetails = () => {
  //   setSelectedConnect(null);
  // };

  // const dataFiltered = applyFilter({
  //   inputData: connects,
  //   searchQuery,
  // });

  // const renderFilters = (
  //   <Stack spacing={2} sx={{ mb: 2 }}>
  //     <Stack
  //       spacing={3}
  //       justifyContent="space-between"
  //       alignItems={{ xs: 'flex-end', sm: 'center' }}
  //       direction={{ xs: 'column', sm: 'row' }}
  //     >
  //       <TextField
  //         fullWidth
  //         value={searchQuery}
  //         onChange={(e) => setSearchQuery(e.target.value)}
  //         placeholder="Search connect..."
  //         InputProps={{
  //           startAdornment: (
  //             <InputAdornment position="start">
  //               <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
  //             </InputAdornment>
  //           ),
  //         }}
  //       />
  //     </Stack>
  //   </Stack>
  // );

  // const renderNotFound = (
  //   <EmptyContent
  //     filled
  //     title="No Connects Found"
  //     sx={{ py: 10 }}
  //     description={
  //       searchQuery
  //         ? `No results found for "${searchQuery}". Try checking for typos or using complete words.`
  //         : 'No connects found.'
  //     }
  //   />
  // );

  // return (
  //   <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 15 }}>
  //     <CustomBreadcrumbs
  //       heading="My Connects"
  //       links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'My Connects' }]}
  //       sx={{
  //         mb: { xs: 3, md: 5 },
  //       }}
  //     />

  //     <ConnectDetailsSlider
  //       open={Boolean(selectedConnect)}
  //       onClose={handleCloseDetails}
  //       connect={selectedConnect}
  //     />

  //     {renderFilters}

  //     {connectsLoading ? (
  //       <Typography>Loading...</Typography>
  //     ) : (
  //       <>
  //         {dataFiltered.length > 0 ? (
  //           <ConnectList
  //             connects={dataFiltered}
  //             loading={connectsLoading}
  //             onConnectClick={handleConnectClick}
  //           />
  //         ) : (
  //           renderNotFound
  //         )}
  //       </>
  //     )}
  //   </Container>
  // );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  searchQuery,
}: {
  inputData: IConnectItem[];
  searchQuery: string;
}) {
  let filteredData = [...inputData];

  // Search filter
  if (searchQuery) {
    filteredData = filteredData.filter(
      (connect) =>
        connect.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
        connect.email.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
    );
  }

  return filteredData;
}
