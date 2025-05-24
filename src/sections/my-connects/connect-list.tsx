import Box, { BoxProps } from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { IConnectItem } from 'src/types/connect';

import ConnectItem from './connect-item';
import { ConnectItemSkeleton } from './connect-skeleton';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  connects: IConnectItem[];
  loading?: boolean;
  onConnectClick?: (connect: IConnectItem) => void;
};

export default function ConnectList({ connects, loading, onConnectClick, ...other }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <ConnectItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {connects.map((connect) => (
        <ConnectItem key={connect.email} connect={connect} onConnectClick={onConnectClick} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        {...other}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {connects.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
