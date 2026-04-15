import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Avatar, ListItemText, MenuItem, Radio, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';

import DialogTitle from '@mui/material/DialogTitle';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ColorPicker } from 'src/components/color-utils';

import { ICalendarEvent } from 'src/types/calendar';
import { IExhibitor } from 'src/types/exhibitors';
import {
  useGetDropDownSlots,
  useGetDropDownMembers,
  useBookMeeting,
  useRescheduleMeeting,
  useGetAllUserSlots,
} from 'src/api/meetings';
import { ISlot, IMember, IBookedSlot } from 'src/types/meetings';
import { useEventContext } from 'src/components/event-context';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  colorOptions: string[];
  onClose: VoidFunction;
  open: boolean;
  currentExhibitor?: IExhibitor;
  currentMeeting?: IBookedSlot;
};

export default function MeetingForm({
  currentExhibitor,
  title,
  colorOptions,
  onClose,
  open,
  currentMeeting,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { bookMeeting } = useBookMeeting();
  const { rescheduleMeeting } = useRescheduleMeeting();
  const { eventData } = useEventContext();
  const { reFetchAllUserSlots } = useGetAllUserSlots(eventData?.state.eventId || 0);

  const { dropDownSlots } = useGetDropDownSlots(
    eventData?.state.eventId || 0,
    title === 'Schedule Meeting'
      ? currentExhibitor?.id || currentExhibitor?.eventMemberId || 0
      : currentMeeting?.inviteToEventMemberId || 0
  );

  console.log(currentMeeting);

  const EventSchema = Yup.object().shape({
    location: Yup.string().required('Location is required'),
    notes: Yup.string().required('Title is required'),
    meetingDate: Yup.string().required('Meeting date is required'),
    meetingTime: Yup.string().required('Meeting time is required'),
    memberEmail: Yup.string().email().required('Member selection is required'),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: {
      location: currentMeeting?.meetingLocation || '',
      notes: currentMeeting?.meetingTitle || '',
      meetingDate: '',
      meetingTime: '',
      memberEmail: currentMeeting?.inviteToEmail || '',
    },
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const selectedSlot = useMemo(() => {
    if (!values.meetingDate || !values.meetingTime || !dropDownSlots) {
      return null;
    }
    return dropDownSlots.find((slot) => {
      const slotDate = new Date(slot.startTime).toISOString().split('T')[0];
      return slotDate === values.meetingDate && slot.slotId.toString() === values.meetingTime;
    });
  }, [dropDownSlots, values.meetingDate, values.meetingTime]);

  const { dropDownMembers, dropDownMembersLoading } = useGetDropDownMembers(
    eventData?.state.eventId || 0,
    title === 'Schedule Meeting'
      ? currentExhibitor?.id || currentExhibitor?.eventMemberId || 0
      : currentMeeting?.inviteToEventMemberId || 0,
    selectedSlot?.slotId || 0
  );

  const availableDates = useMemo(() => {
    if (!dropDownSlots || dropDownSlots.length === 0) {
      return [];
    }

    const uniqueDates = Array.from(
      new Set(dropDownSlots.map((slot) => new Date(slot.startTime).toISOString().split('T')[0]))
    ).sort();

    return uniqueDates.map((date) => ({
      value: date,
      label: new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }));
  }, [dropDownSlots]);

  const timeSlotsForSelectedDate = useMemo(() => {
    if (!values.meetingDate || !dropDownSlots) {
      return [];
    }

    return dropDownSlots
      .filter((slot) => new Date(slot.startTime).toISOString().split('T')[0] === values.meetingDate)
      .map((slot) => ({
        slotId: slot.slotId,
        label: `${new Date(slot.startTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })} - ${new Date(slot.endTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}`,
      }));
  }, [dropDownSlots, values.meetingDate]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!selectedSlot) {
        enqueueSnackbar('Please select a valid time slot', { variant: 'error' });
        return;
      }
      let response;
      if (title === 'Schedule Meeting') {
        const meetingData = {
          eventId: currentExhibitor?.eventId || 0,
          slotId: selectedSlot.slotId,
          email: data.memberEmail,
          location: data.location,
          title: data.notes,
        };
        response = await bookMeeting(meetingData);
      } else if (title === 'Reschedule Meeting') {
        const meetingData = {
          meetingId: currentMeeting?.meetingId || 0,
          slotId: selectedSlot.slotId,
          location: data.location,
          title: data.notes,
          // email: data.memberEmail,
        };
        response = await rescheduleMeeting(meetingData);
      }

      if (response?.data.status === 'success') {
        enqueueSnackbar('Meeting request sent successfully!');
        onClose();
        reset();
        reFetchAllUserSlots();
      } else {
        console.log(response);
        enqueueSnackbar(response?.data?.message || 'Something went wrong', { variant: 'error' });
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || 'Failed to send meeting request';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  });

  const onDelete = useCallback(async () => {
    try {
      // await deleteEvent(`${currentEvent?.id}`);
      enqueueSnackbar('Delete success!');
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [enqueueSnackbar, onClose]);

  console.log('***********currentMeeting: ', currentMeeting);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 520 },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <Stack direction="row" alignItems="start" sx={{ px: 3, pb: 3 }}>
        <Avatar
          alt={currentExhibitor?.companyName}
          src={currentExhibitor?.imgUrl || currentExhibitor?.profileUrl}
          sx={{ mr: 2 }}
        />
        <ListItemText
          primary={
            title === 'Schedule Meeting'
              ? currentExhibitor?.companyName
              : currentMeeting?.toCompanyName || currentExhibitor?.companyName
          }
          secondary={
            <>
              {title === 'Schedule Meeting'
                ? `${currentExhibitor?.firstName || ''} ${currentExhibitor?.lastName || ''}`
                : `${currentMeeting?.inviteToName || ''}`}{' '}
              <br />{' '}
              {/* {title === 'Schedule Meeting'
                ? `Booth No : ${currentExhibitor?.stallNo || 'N/A'}`
                : `Location : ${currentMeeting?.meetingLocation || 'N/A'}`} */}
            </>
          }
          primaryTypographyProps={{ typography: 'subtitle1' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </Stack>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ px: 3 }}>
          {/* <Stack spacing={1}>
            <Typography variant="subtitle2" color={'gray'}>
              Booth No
            </Typography>
            <Stack direction={'row'} alignItems="center" spacing={1}>
              <Typography variant="body1">
                <Iconify
                  icon="weui:location-filled"
                  sx={{ color: 'inherit', width: 20, height: 20 }}
                />
                Booth {currentExhibitor?.stallNo || 'N/A'}
              </Typography>
            </Stack>
          </Stack> */}
          <Typography variant="subtitle2" color={'gray'}>
            Meeting Date
          </Typography>
          <Controller
            name="meetingDate"
            control={control}
            render={({ field: controllerField }) => (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                }}
              >
                {availableDates.map((date) => {
                  const [day, d, fullDate] = [
                    new Date(date.value).toLocaleDateString('en-US', { weekday: 'short' }),
                    new Date(date.value).toLocaleDateString('en-US', { day: '2-digit' }),
                    date.value,
                  ];
                  const isSelected = controllerField.value === fullDate;

                  return (
                    <Box
                      key={date.value}
                      onClick={() => {
                        controllerField.onChange(fullDate);
                      }}
                      sx={{
                        width: 60,
                        height: 80,
                        border: '2px solid',
                        borderColor: isSelected ? 'primary.main' : 'grey.300',
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'grey.50' : 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: isSelected ? 'grey.200' : 'grey.50',
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: isSelected ? 'primary.main' : 'text.secondary',
                          fontWeight: 500,
                        }}
                      >
                        {day}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: isSelected ? 'primary.main' : 'text.primary',
                          fontWeight: 600,
                        }}
                      >
                        {d}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          />

          <Typography variant="subtitle2" color={'gray'}>
            Meeting Time
          </Typography>
          {values.meetingDate ? (
            <Controller
              name="meetingTime"
              control={control}
              render={({ field: controllerField }) => (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                  }}
                >
                  {timeSlotsForSelectedDate.map((slot) => {
                    const isSelected = controllerField.value === slot.slotId.toString();

                    return (
                      <Box
                        key={slot.slotId}
                        onClick={() => {
                          controllerField.onChange(slot.slotId.toString());
                        }}
                        sx={{
                          flexGrow: 1,
                          minWidth: '140px',
                          height: 60,
                          border: '2px solid',
                          borderColor: isSelected ? 'primary.main' : 'grey.300',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'grey.50' : 'background.paper',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: isSelected ? 'grey.200' : 'grey.50',
                          },
                          padding: 0.4,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: isSelected ? 'primary.main' : 'text.primary',
                            fontWeight: 600,
                            textAlign: 'center',
                          }}
                        >
                          {slot.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            />
          ) : (
            <Box
              sx={{
                color: 'text.disabled',
                p: 2,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="body2">Select a date to see available time slots</Typography>
            </Box>
          )}

          <Typography variant="subtitle1">Team on Ground</Typography>

          <Controller
            name="memberEmail"
            control={control}
            render={({ field }) => (
              <Stack spacing={1}>
                {Array.isArray(dropDownMembers) &&
                  dropDownMembers.map((member: IMember) => (
                    <Box
                      key={member.email}
                      onClick={() => field.onChange(member.email)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: field.value === member.email ? 'primary.default' : 'grey.300',
                        cursor: 'pointer',
                        backgroundColor:
                          field.value === member.email ? 'action.selected' : 'background.paper',
                      }}
                    >
                      <Avatar alt={member.name} sx={{ width: 32, height: 32, mr: 1 }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2">{member.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.designation}
                        </Typography>
                      </Box>
                      <Radio checked={field.value === member.email} />
                    </Box>
                  ))}
                {Array.isArray(dropDownMembers) &&
                  dropDownMembers.length === 0 &&
                  !dropDownMembersLoading && <Typography>No members available</Typography>}
              </Stack>
            )}
          />

          <RHFTextField name="location" label="Location*" />

          <RHFTextField name="notes" label="Title*" />
        </Stack>

        <DialogActions>
          {/* {!!currentEvent?.id && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )} */}

          <Box sx={{ flexGrow: 1 }} />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Send Request
          </LoadingButton>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
