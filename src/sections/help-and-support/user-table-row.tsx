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

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { fDate, fTime } from 'src/utils/format-time';

import { useEventContext } from 'src/components/event-context';

import { IUserItem } from 'src/types/user';
import { ITicketItem } from 'src/types/help-and-support';

import ChatDetailsSlider from './chat-details-slider';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: ITicketItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { id, subject, createdAt, priority, status, email, assignTo } = row;

  const confirm = useBoolean();

  const chat = useBoolean();

  const popover = usePopover();

  const { eventData } = useEventContext();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{id}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{subject}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{eventData?.state.eventName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
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
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            <Iconify
              icon={
                (priority === 'LOW' && 'eva:arrow-down-fill') ||
                (priority === 'MEDIUM' && 'eva:arrow-right-fill') ||
                (priority === 'HIGH' && 'eva:arrow-up-fill') ||
                ''
              }
              sx={{
                color: (theme) =>
                  (priority === 'LOW' && theme.palette.info.main) ||
                  (priority === 'MEDIUM' && theme.palette.warning.main) ||
                  (priority === 'HIGH' && theme.palette.error.main) ||
                  'inherit',
              }}
            />
            {priority}
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{assignTo}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'CLOSED' && 'success') ||
              (status === 'ON_HOLD' && 'warning') ||
              (status === 'IN_PROGRESS' && 'error') ||
              (status === 'OPENED' && 'info') ||
              (status === 'NEW' && 'secondary') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Chat" placement="top" arrow>
            <IconButton color={chat.value ? 'inherit' : 'default'} onClick={chat.onTrue}>
              <Iconify icon="line-md:chat-twotone" />
            </IconButton>
          </Tooltip>

          {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}

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
        </TableCell>
      </TableRow>

      <ChatDetailsSlider data={row} open={chat.value} onClose={chat.onFalse} />

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
