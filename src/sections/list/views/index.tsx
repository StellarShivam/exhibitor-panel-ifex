'use client';

import React, { useCallback, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// import { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Scrollbar from 'src/components/scrollbar';
import { SxProps, Theme } from '@mui/material/styles';
import { set, sumBy } from 'lodash';

import { useSettingsContext } from 'src/components/settings';
// import AnalyticsWidgetSummary from '../../analytics/analytics-widget-summary';
import { useGetEventList1 } from 'src/api/event';
import { Button, Chip, IconButton, LinearProgress } from '@mui/material';
import { format } from 'date-fns';
import Iconify from 'src/components/iconify';
// import { useNavigate } from 'react-router';
import { useRouter } from 'src/routes/hooks';

import { useEventContext } from 'src/components/event-context';
// import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';
import { useSetState } from 'src/hooks/use-set-state';
import { IEventGridFilters, IEventItem, IEventListItem } from 'src/types/event';
// import { EventGridToolBar } from '../event-grid-toolbar';
import { EventGridFiltersResult } from '../event-grid-filter-results';
import { ref } from 'yup';
// import { EventsAnalytics } from '../events-analytics';

// ----------------------------------------------------------------------

export default function EventCardsGrid() {
  const settings = useSettingsContext();

  // const navigate = useNavigate();

  const router = useRouter();

  const { eventData } = useEventContext();

  // const { updateStatus } = useUpdateEventStatus();

  const { enqueueSnackbar } = useSnackbar();

  const { events, eventsLoading, reFetchEventList } = useGetEventList1();

  useEffect(() => {
    reFetchEventList();
  }, []); // Fetches events once on component mount

  useEffect(() => {
    // Wait until loading is finished and events are available
    if (!eventsLoading && events && events.length > 0) {
      console.log('Events fetched being set:', events);
      eventData.setState(events[events.length - 1]); // Set the last event as the current event
      if (events[events.length - 1]?.status === 'APPROVED') {
        router.push('/dashboard');
      } else {
        router.push(`/dashboard/status`);
      }
    }
  }, [events, eventsLoading]);

  // const popOver = usePopover();

  const [eventStatus, setEventStatus] = React.useState<string>('null'); 

  const selectEvent = (event: IEventItem) => {
    console.log('Selected Event:', event);
    eventData.setState(event);

    if (event.status === 'APPROVED') {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard/status`);
    }
  };

  // const handleUpdateStatus = useCallback(
  //   async (id: number, currentStatus: string) => {
  //     try {
  //       popOver.onClose();
  //       const newStatus = currentStatus === 'LIVE' ? 'DRAFT' : 'LIVE';
  //       await updateStatus(newStatus, id);

  //       enqueueSnackbar(`Status updated to ${newStatus}!`, { variant: 'success' });
  //       reFetchEventList();
  //     } catch (error) {
  //       enqueueSnackbar('Failed to update status.', { variant: 'error' });
  //     }
  //   },
  //   [enqueueSnackbar, updateStatus]
  // );

  const filters = useSetState<IEventGridFilters>({
    status: 'ALL',
    kind: 'ALL',
    searchTerm: '',
    startDate: 'ALL',
    endDate: 'ALL',
  });

  const filteredEvents = ApplyFilters({
    filters: filters.state,
    inputData: events,
  });

  const canResetFilters =
    filters.state.status !== 'ALL' ||
    filters.state.kind !== 'ALL' ||
    filters.state.searchTerm !== '' ||
    filters.state.startDate !== 'ALL' ||
    filters.state.endDate !== 'ALL';

  const notFound = (!filteredEvents.length && canResetFilters) || !filteredEvents.length;

  // const getEventsLength = (status: string) => {
  //   return filteredEvents.filter((event: IEventItem) => event.status === status).length;
  // };

  // const getPercentByStatus = (status: string) => {
  //   const total = filteredEvents.length;
  //   const count = getEventsLength(status);
  //   return total > 0 ? Math.round((count / total) * 100) : 0;
  // };

  return (
    <>
      {eventsLoading && <LinearProgress />}
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 5, mt: 3 }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            Hi, Welcome back 👋
          </Typography>{' '}
          {/* <Button
            variant="contained"
            onClick={() => {
              navigate('/list/new-event');
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create New Event
          </Button> */}
        </Stack>

        {/* <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <EventsAnalytics
                title="Total Registrations"
                registrations={190000}
                percent={100}
                icon="solar:user-check-bold-duotone"
                color="#F44336"
              />

              <EventsAnalytics
                title="Total Revenue"
                percent={75}
                price={514589}
                icon="solar:money-bag-bold-duotone"
                color="#9E9E9E"
              />

              <EventsAnalytics
                title="Total Events"
                total={events.length}
                percent={100}
                icon="solar:bill-list-bold-duotone"
                color="#FFC107"
              />

              <EventsAnalytics
                title="Live Events"
                total={getEventsLength('LIVE')}
                percent={getPercentByStatus('LIVE')}
                icon="solar:file-check-bold-duotone"
                color="#4CAF50"
              />

              <EventsAnalytics
                title="Draft and Closed Events"
                total={getEventsLength('DRAFT') + getEventsLength('CLOSED')}
                percent={getPercentByStatus('DRAFT') + getPercentByStatus('CLOSED')}
                icon="solar:sort-by-time-bold-duotone"
                color="#FF9800"
              />
            </Stack>
          </Scrollbar>
        </Card> */}

        {/* <EventGridToolBar filters={filters} options={{}} onResetPage={() => {}} /> */}

        {canResetFilters && (
          <EventGridFiltersResult
            filters={filters}
            totalResults={filteredEvents.length}
            onResetPage={() => { }}
            sx={{ mb: 3 }}
          />
        )}

        <Grid container spacing={3}>
          {filteredEvents?.map((event) => (
            <Grid xs={12} sm={6} md={3} key={event?.eventId}>
              <Stack
                alignItems="start"
                sx={{
                  p: 2,
                  height: '100%',
                  borderRadius: 2,
                  textAlign: 'start',
                  gap: 1,
                  boxShadow: (theme) => theme.customShadows.z16,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: (theme) => theme.customShadows.z24,
                  },
                  justifyContent: 'space-between',
                }}
                onClick={() => {
                  selectEvent(event);
                }}
              >
                <Box sx={{ width: '100%', height: 150, mb: 1, position: 'relative' }}>
                  <img
                    src={event?.eventLogo}
                    alt="icon"
                    style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'contain' }}
                  />
                  {/* <Chip
                    label={event?.status}
                    color={
                      event?.status === 'LIVE'
                        ? 'success'
                        : event?.status === 'DRAFT'
                          ? 'info'
                          : 'default'
                    }
                    size="small"
                    sx={{ position: 'absolute', top: 3, left: 3 }}
                    variant="filled"
                  /> */}
                  {/* <Chip
                    label={event?.kind}
                    color="default"
                    size="small"
                    sx={{ position: 'absolute', top: 35, left: 3 }}
                    variant="filled"
                  /> */}
                  {/* <Chip
                  label={event?.kind}
                  color= 'default'
                  size="small"
                  sx={{ position: 'absolute', top: 3, right: 3 }}
                  variant="filled"
                /> */}
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline', // Add underline on hover
                      },
                    }}
                  >
                    {event?.eventName}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      alignItems: 'start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                      }}
                    >
                      <Iconify
                        icon="mingcute:location-fill"
                        width={20}
                        height={20}
                        sx={{
                          color: 'grey.600',
                          flexShrink: 0,
                        }}
                      />
                      {/* {event?.address.slice(0, 12)}... */}
                      {event?.location}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ gap: 1, display: 'flex', alignItems: 'center' }}
                    >
                      <Iconify
                        icon="mingcute:time-fill"
                        width={20}
                        height={20}
                        sx={{ color: 'grey.600' }}
                      />
                      {event?.startDate && format(new Date(event?.startDate), 'dd MMM yy')}
                      &nbsp;-&nbsp;
                      {event?.endDate && format(new Date(event?.endDate), 'dd MMM yy')}
                    </Typography>
                  </Box>

                  {/* <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ gap: 1, display: 'flex', alignItems: 'center' }}
                    >
                      <img
                        alt="icon"
                        src="/assets/icons/components/ic_people.svg"
                        style={{ width: 20, height: 20 }}
                      />
                      <div>
                        Registrations
                        <br />
                        <strong>1900</strong>
                      </div>
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ gap: 1, display: 'flex', alignItems: 'center' }}
                    >
                      <img
                        alt="icon"
                        src="/assets/icons/components/ic_revenue.svg"
                        style={{ width: 20, height: 20 }}
                      />
                      <div>
                        Revenue
                        <br />
                        <strong>{formatINR(19000)}</strong>
                      </div>
                    </Typography>

                    <IconButton
                      aria-label="more"
                      onClick={(e) => {
                        e.stopPropagation();
                        eventData.setState(event);
                        setEventStatus(event?.status);
                        popOver.onOpen(e);
                      }}
                    >
                      <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
                    </IconButton>
                  </Box> */}
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
        {/* <CustomPopover open={popOver.open} onClose={popOver.onClose}>
          <Stack sx={{ p: 1 }}>
            <Typography
              variant="body1"
              onClick={() => {
                if (eventData.state) {
                  handleUpdateStatus(eventData.state.eventId, eventStatus);
                }
                popOver.onClose();
              }}
              sx={{ p: 1, cursor: 'pointer', fontWeight: 'bold' }}
            >
              {eventStatus === 'LIVE' ? 'Set to Draft' : 'Set to Live'}
            </Typography>
          </Stack>
        </CustomPopover> */}
      </Container>
    </>
  );
}

type ApplyFiltersProps = {
  filters: IEventGridFilters;
  inputData: IEventItem[];
};

function ApplyFilters({ filters, inputData }: ApplyFiltersProps) {
  const { status, kind, searchTerm, startDate, endDate } = filters;

  return inputData.filter((event: IEventItem) => {
    // const isStatusMatch = status === 'ALL' || event.status === status;
    // const isKindMatch = kind === 'ALL' || event.kind === kind;
    const isSearchTermMatch =
      searchTerm === '' || event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    // const isDateRangeMatch =
    //   startDate === 'ALL' ||
    //   endDate === 'ALL' ||
    //   (new Date(event.startDate) <= new Date(endDate) &&
    //     new Date(event.endDate) >= new Date(startDate));

    return isSearchTermMatch;
  });
}
