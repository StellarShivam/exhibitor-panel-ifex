import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { paths } from 'src/routes/paths';
import { IBookedSlot } from 'src/types/buyer/meetings';
import Chip from '@mui/material/Chip';

// ----------------------------------------------------------------------

type Props = {
  row: IBookedSlot;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ScheduleTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const {
    slotId,
    startTime,
    endTime,
    inviteFromEmail,
    inviteFromName,
    inviteToName,
    inviteToEmail,
    fromCompanyName,
    toCompanyName,
    meetingTitle,
    meetingId,
    meetingStatus,
    meetingLocation,
    country,
    inviteToEventMemberId,
    productCategory,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={toCompanyName} sx={{ mr: 2 }}>
            {toCompanyName.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {toCompanyName}
              </Typography>
            }
            secondary={
              <Typography noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                {inviteToName}
              </Typography>
            }
          />
        </TableCell>

        {/* <TableCell align="left">{meetingLocation}</TableCell> */}
        <TableCell align="left">
          <Chip
            label={productCategory || 'N/A'}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
        </TableCell>
        <TableCell align="left">{country || 'N/A'}</TableCell>

        <TableCell>
          <ListItemText
            primary={`${fTime(startTime)} - ${fTime(endTime)}`}
            secondary={fDate(startTime)}
            primaryTypographyProps={{ typography: 'caption', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
              noWrap: true,
            }}
          />
        </TableCell>
        <TableCell align="left">{meetingLocation}</TableCell>

        {/* <TableCell>
          <ListItemText
            primary={fDate(dueDate)}
            secondary={fTime(dueDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell> */}

        {/* <TableCell>{fCurrency(totalAmount)}</TableCell> */}

        {/* <TableCell align="center">{sent}</TableCell> */}

        <TableCell>
          <Label
            variant="soft"
            color={
              (meetingStatus === 'ACCEPTED' && 'success') ||
              (meetingStatus === 'REJECTED' && 'error') ||
              (meetingStatus === 'CANCELLED' && 'error') ||
              'default'
            }
          >
            {meetingStatus}
          </Label>
        </TableCell>

        <TableCell align="center" sx={{ px: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            component={RouterLink}
            href={paths.dashboard.buyer.exhibitors.detail(inviteToEventMemberId)}
          >
            <Iconify icon="solar:eye-bold" sx={{ mr: 1, fontSize: 30 }} />
            <Typography variant="body" noWrap>
              View Profile
            </Typography>
          </Button>
          {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </TableCell>
      </TableRow>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

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
      </CustomPopover> */}

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
