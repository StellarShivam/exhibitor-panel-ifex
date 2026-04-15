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
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';
import { format, parseISO } from 'date-fns';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { paths } from 'src/routes/paths';
import { IBookedSlot } from 'src/types/buyer/meetings';

// ----------------------------------------------------------------------

type Props = {
  row: IBookedSlot;
  selected: boolean;
  onSelectRow: VoidFunction;
  onRescheduleClick: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ScheduleTableCard({
  row,
  selected,
  onSelectRow,
  onRescheduleClick,
  onEditRow,
  onDeleteRow,
}: Props) {
  const {
    slotId,
    toCompanyName,
    inviteToName,
    meetingLocation,
    startTime,
    endTime,
    meetingStatus,
    meetingTitle,
    inviteToEventMemberId,
    productCategory,
    country,
  } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const formatTimeSlot = (startTimeStr: string, endTimeStr: string) =>
    `${fTime(startTimeStr, 'hh:mm a')}-${fTime(endTimeStr, 'hh:mm a')}`;

  const meetingDate = formatDate(startTime);
  const timeSlot = formatTimeSlot(startTime, endTime);

  return (
    <>
      {/* <TableRow hover selected={selected}> */}
      {/* <TableCell sx={{ p: 0 }}> */}
      <Box
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          m: 3,
          bgcolor: 'background.paper',
          position: 'relative',
        }}
      >
        {/* Status Badge */}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 2 }}
          alignItems="start"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={toCompanyName}
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'primary.main',
                fontSize: '1.25rem',
                fontWeight: 'bold',
              }}
            >
              {toCompanyName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {toCompanyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {inviteToName}
              </Typography>
            </Box>
          </Stack>
          <Label
            variant="soft"
            color={
              (meetingStatus === 'ACCEPTED' && 'success') ||
              (meetingStatus === 'REJECTED' && 'error') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {meetingStatus}
          </Label>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ mb: 2, ml: { xs: 0, sm: 8 } }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="line-md:calendar" sx={{ color: 'inherit', width: 20, height: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {meetingDate}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="lucide:clock" sx={{ color: 'inherit', width: 20, height: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {timeSlot}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="weui:location-filled" sx={{ color: 'inherit', width: 20, height: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {meetingLocation}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 2, ml: { xs: 0, sm: 8 } }}>
          <Chip
            icon={<Iconify icon="weui:location-outlined" sx={{ width: 16, height: 16 }} />}
            label={country || 'N/A'}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
          <Chip
            label={productCategory || 'N/A'}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
          <Chip label="30 min" size="small" variant="outlined" sx={{ borderRadius: 1 }} />
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.6, ml: { xs: 0, sm: 8 } }}
        >
          {meetingTitle}
        </Typography>

        <Divider sx={{ borderStyle: 'dashed', width: '100%', my: 2 }} />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          sx={{
            '& .MuiButton-root': {
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
          justifyContent="space-between"
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{
              '& .MuiButton-root': {
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:eye-bold" />}
              component={RouterLink}
              href={paths.dashboard.buyer.exhibitors.detail(inviteToEventMemberId)}
              // sx={{ flex: { xs: 1, sm: 'auto' } }}
            >
              View Profile
            </Button>

            {/* <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="line-md:chat-round-dots-filled" />}
              // sx={{ flex: { xs: 1, sm: 'auto' } }}
            >
              Chat
            </Button> */}
          </Stack>
          {meetingStatus === 'ACCEPTED' && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{
                '& .MuiButton-root': {
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                },
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="solar:pen-bold" />}
                onClick={onRescheduleClick}
                // sx={{ flex: { xs: 1, sm: 'auto' } }}
              >
                Reschedule Meeting
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-minimalistic-bold" />}
                onClick={() => confirm.onTrue()}
                // sx={{ flex: { xs: 1, sm: 'auto' } }}
              >
                Cancel Meeting
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
      {/* </TableCell> */}
      {/* </TableRow> */}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Cancel Meeting"
        content={
          <>
            Are you sure want to cancel this meeting with <strong> {toCompanyName} </strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Cancel Meeting
          </Button>
        }
      />
    </>
  );
}
