import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { fDate, fTime } from 'src/utils/format-time';

import { useEventContext } from 'src/components/event-context';

import { IUserItem } from 'src/types/user';
import { ITicketItem } from 'src/types/help-and-support';
import { IExhbitorProductionRequirements } from 'src/types/production-requirements';
import { formatINR } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IExhbitorProductionRequirements;
  onSelectRow: VoidFunction;
  onDeleteRow?: VoidFunction;
};

export default function ExhibitorProdRequirementsRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { productName, productImages, skuImage, quantity, totalPrice, status, paymentStatus } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Stack direction="row" alignItems="center">
            <Avatar
              alt={productName}
              src={skuImage || productImages[0] || ''}
              variant="rounded"
              sx={{ width: 64, height: 64, mr: 2 }}
            />

            <ListItemText
              disableTypography
              primary={
                <Typography noWrap color="inherit" variant="subtitle2" sx={{ cursor: 'pointer' }}>
                  {productName}
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
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{quantity}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{eventData?.state.eventName}</TableCell> */}

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(createdAt)}
            secondary={fTime(createdAt)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            <Iconify
              icon={
                (paymentStatus === 'PENDING' && 'eos-icons:bubble-loading') ||
                (paymentStatus === 'COMPLETED' && 'hugeicons:tick-double-01') ||
                ''
              }
              sx={{
                color: (theme) =>
                  (paymentStatus === 'COMPLETED' && theme.palette.info.main) ||
                  (paymentStatus === 'PENDING' && theme.palette.warning.main) ||
                  'inherit',
              }}
            />
            {paymentStatus}
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatINR(totalPrice)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'COMPLETED' && 'success') ||
              (status === 'REJECTED' && 'warning') ||
              (status === 'IN_PROGRESS' && 'error') ||
              (status === 'REFUNDED' && 'info') ||
              'secondary'
            }
          >
            {status}
          </Label>
        </TableCell>

        {/* <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Chat" placement="top" arrow>
            <IconButton color={chat.value ? 'inherit' : 'default'} onClick={chat.onTrue}>
              <Iconify icon="line-md:chat-twotone" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>

          <Tooltip title="View" placement="top" arrow>
            <IconButton
              color={chat.value ? 'inherit' : 'default'}
              onClick={() => {
                onEditRow();
              }}
            >
              <Iconify icon="lets-icons:view-alt-fill" />
            </IconButton>
          </Tooltip>
        </TableCell> */}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="lets-icons:view-alt-fill" />
          View
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
