import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  const priceWithTax = params.row.salePrice * (1 + (params.row.tax || 0) / 100);

  return (
    <Stack spacing={0.5} justifyContent="center" sx={{ width: 1, height: 1 }}>
      <Typography variant="body2">{fCurrency(priceWithTax)}</Typography>
      {params.row.tax > 0 && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          (Incl. {params.row.tax}% tax)
        </Typography>
      )}
    </Stack>
  );
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ width: 1, height: 1 }}>
      <Label variant="soft" color={(params.row.status === 'PUBLISHED' && 'info') || 'default'}>
        {params.row.status}
      </Label>
    </Stack>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Stack alignItems="left" justifyContent="center" sx={{ width: 1, height: 1 }}>
      <Stack spacing={0.5} alignItems="left">
        <Box sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>{fDate(params.row.createdAt)}</Box>
        <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
          {fTime(params.row.createdAt)}
        </Box>
      </Stack>
    </Stack>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack justifyContent="center" sx={{ width: 1, height: 1 }}>
      <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
        <LinearProgress
          value={(params.row.available * 100) / params.row.quantity}
          variant="determinate"
          color={
            (params.row.inventoryType === 'out of stock' && 'error') ||
            (params.row.inventoryType === 'low stock' && 'warning') ||
            'success'
          }
          sx={{ mb: 1, height: 6, maxWidth: 80 }}
        />
        {!!params.row.available && params.row.available} {params.row.inventoryType}
      </Stack>
    </Stack>
  );
}

export function RenderCellProduct({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.productName}
        src={params.row.images?.[0]}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Typography
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={params.row.onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.productName}
          </Typography>
        }
        // secondary={
        //   <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
        //     {params.row.category}
        //   </Box>
        // }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
