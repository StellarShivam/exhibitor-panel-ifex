'use client';

import sumBy from 'lodash/sumBy';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { format } from 'date-fns';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useEventContext } from 'src/components/event-context';

import { IBookedSlot } from 'src/types/meetings';

import { ISchedule, IScheduleTableFilters, IScheduleTableFilterValue } from 'src/types/schedule';

import { useGetAllEventSlots, useGetAllUserSlots, useUpdateMeetingStatus } from 'src/api/meetings';

import MeetingForm from '../../networking/meeting-schedule-form';

import ScheduleTableCard from '../schedule-table-card';
import ScheduleTableRow from '../schedule-table-row';
import ScheduleTableToolbar from '../schedule-table-toolbar';
import ScheduleTableFiltersResult from '../schedule-table-filters-result';
import { Typography } from '@mui/material';

const schedule = [
  {
    id: 1,
    companyName: 'Tech Innovators Ltd.',
    exhibitorName: 'Alice Johnson',
    boothNo: 'A12',
    country: 'USA',
    meetingDate: '2024-07-10',
    meetingTime: '10:00 AM',
    status: 'accepted',
  },
  {
    id: 2,
    companyName: 'Green Energy Corp.',
    exhibitorName: 'Bob Smith',
    boothNo: 'B34',
    country: 'Germany',
    meetingDate: '2024-07-11',
    meetingTime: '2:00 PM',
    status: 'pending',
  },
  {
    id: 3,
    companyName: 'HealthFirst Solutions',
    exhibitorName: 'Carla Mendes',
    boothNo: 'C21',
    country: 'Brazil',
    meetingDate: '2024-07-12',
    meetingTime: '11:30 AM',
    status: 'declined',
  },
  {
    id: 4,
    companyName: 'AutoMakers Inc.',
    exhibitorName: 'David Lee',
    boothNo: 'D15',
    country: 'South Korea',
    meetingDate: '2024-07-13',
    meetingTime: '9:00 AM',
    status: 'accepted',
  },
  {
    id: 5,
    companyName: 'AgroTech Pvt.',
    exhibitorName: 'Elena Petrova',
    boothNo: 'E08',
    country: 'Russia',
    meetingDate: '2024-07-14',
    meetingTime: '3:00 PM',
    status: 'pending',
  },
  {
    id: 6,
    companyName: 'FinServe Group',
    exhibitorName: 'Frank Müller',
    boothNo: 'F22',
    country: 'Switzerland',
    meetingDate: '2024-07-15',
    meetingTime: '1:00 PM',
    status: 'accepted',
  },
  {
    id: 7,
    companyName: 'EduWorld',
    exhibitorName: 'Grace Kim',
    boothNo: 'G19',
    country: 'South Korea',
    meetingDate: '2024-07-16',
    meetingTime: '4:00 PM',
    status: 'pending',
  },
  {
    id: 8,
    companyName: 'MedEquip Co.',
    exhibitorName: 'Hassan Ali',
    boothNo: 'H05',
    country: 'UAE',
    meetingDate: '2024-07-17',
    meetingTime: '10:30 AM',
    status: 'declined',
  },
  {
    id: 9,
    companyName: 'SmartHome Solutions',
    exhibitorName: 'Isabella Rossi',
    boothNo: 'I11',
    country: 'Italy',
    meetingDate: '2024-07-18',
    meetingTime: '12:00 PM',
    status: 'accepted',
  },
  {
    id: 10,
    companyName: 'BioLife Sciences',
    exhibitorName: 'Jack Chen',
    boothNo: 'J07',
    country: 'China',
    meetingDate: '2024-07-19',
    meetingTime: '2:30 PM',
    status: 'pending',
  },
];

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'companyName', label: 'Exhibitor' },
  { id: 'category', label: 'Category' },
  { id: 'country', label: 'Country' },
  { id: 'startTime', label: 'Time' },
  { id: 'meetingLocation', label: 'Location' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const defaultFilters: IScheduleTableFilters = {
  name: '',
  country: '',
  meetingDate: '',
  status: 'all',
};

// ----------------------------------------------------------------------

type Props = {
  isOverview?: boolean;
};

export default function ScheduleListView({ isOverview = false }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const { eventData } = useEventContext();

  // const { allEventSlots } = useGetAllEventSlots(eventData?.state.eventId || 0);
  const { updateMeetingStatus } = useUpdateMeetingStatus();
  const {
    allUserSlots,
    bookedSlots,
    schedules,
    availableSlots,
    unavailableSlots,
    reFetchAllUserSlots,
  } = useGetAllUserSlots(eventData?.state.eventId || 0);

  const table = useTable({ defaultOrderBy: 'startTime' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IBookedSlot[]>(bookedSlots);
  const [selectedMeeting, setSelectedMeeting] = useState<IBookedSlot | null>(null);

  useEffect(() => {
    setTableData(bookedSlots);
  }, [bookedSlots]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters.name || !!filters.country || filters.status !== 'all' || !!filters.meetingDate;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status: string) =>
    tableData.filter((item) => item.meetingStatus === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item.meetingStatus === status),
      'totalAmount'
    );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    {
      value: 'ACCEPTED',
      label: 'Accepted',
      color: 'success',
      count: getInvoiceLength('ACCEPTED'),
    },
    {
      value: 'REJECTED',
      label: 'Declined',
      color: 'error',
      count: getInvoiceLength('REJECTED'),
    },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: IScheduleTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id: number) => {
      // const deleteRow = tableData.filter((row) => row.slotId !== id);

      try {
        const response = await updateMeetingStatus({
          meetingId: id,
          status: 'REJECTED',
        });
        if (response.status === 'success') {
          enqueueSnackbar('Meeting cancelled successfully!');
        } else {
          enqueueSnackbar('Meeting cancellation failed!');
        }
        reFetchAllUserSlots();
      } catch (error) {
        enqueueSnackbar('Meeting cancellation failed!');
      }

      // setTableData(deleteRow);

      // table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [enqueueSnackbar, updateMeetingStatus]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.buyer.schedule);
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.buyer.schedule);
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleRescheduleClick = (meeting: IBookedSlot) => {
    setSelectedMeeting(meeting);
  };

  const handleCloseForm = () => {
    setSelectedMeeting(null);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 2 }}>
        {!isOverview && (
          <CustomBreadcrumbs
            heading="My Schedule"
            links={[
              {
                name: 'Dashboard',
              },
              {
                name: 'Schedule',
                href: paths.dashboard.schedule,
              },
            ]}
            // action={
            //   <Button
            //     component={RouterLink}
            //     href={paths.dashboard.buyer.schedule}
            //     variant="contained"
            //     startIcon={<Iconify icon="mingcute:add-line" />}
            //   >
            //     New Invoice
            //   </Button>
            // }
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
        )}

        <Card>
          {isOverview && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 2, pt: 1 }}
            >
              <Typography variant="h6">My Schedule</Typography>
              <Button
                variant="text"
                color="info"
                component={RouterLink}
                href={paths.dashboard.buyer.schedule}
              >
                View All
              </Button>
            </Stack>
          )}
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          {!isOverview && (
            <ScheduleTableToolbar
              filters={filters}
              onFilters={handleFilters}
              //
              dateError={dateError}
              serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option.name)}
              tableData={tableData}
            />
          )}

          {canReset && !isOverview && (
            <ScheduleTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          {!isOverview &&
            dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <ScheduleTableCard
                  key={row.slotId.toString()}
                  row={row}
                  selected={table.selected.includes(row.slotId.toString())}
                  onSelectRow={() => table.onSelectRow(row.slotId.toString())}
                  onRescheduleClick={() => handleRescheduleClick(row)}
                  onEditRow={() => handleEditRow(row.slotId.toString())}
                  onDeleteRow={() => handleDeleteRow(row.meetingId)}
                  // onOpenConfirm={confirm.onTrue}
                />
              ))}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.boothNo)
                );
              }}
              // action={
              //   <Stack direction="row">
              //     <Tooltip title="Sent">
              //       <IconButton color="primary">
              //         <Iconify icon="iconamoon:send-fill" />
              //       </IconButton>
              //     </Tooltip>

              //     <Tooltip title="Download">
              //       <IconButton color="primary">
              //         <Iconify icon="eva:download-outline" />
              //       </IconButton>
              //     </Tooltip>

              //     <Tooltip title="Print">
              //       <IconButton color="primary">
              //         <Iconify icon="solar:printer-minimalistic-bold" />
              //       </IconButton>
              //     </Tooltip>

              //     <Tooltip title="Delete">
              //       <IconButton color="primary" onClick={confirm.onTrue}>
              //         <Iconify icon="solar:trash-bin-trash-bold" />
              //       </IconButton>
              //     </Tooltip>
              //   </Stack>
              // }
            />

            {isOverview && (
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    // onSelectAllRows={(checked) =>
                    //   table.onSelectAllRows(
                    //     checked,
                    //     dataFiltered.map((row) => row.id)
                    //   )
                    // }
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <ScheduleTableRow
                          key={row.slotId}
                          row={row}
                          selected={table.selected.includes(row.slotId)}
                          onSelectRow={() => table.onSelectRow(row.slotId)}
                          onViewRow={() => handleViewRow(row.slotId)}
                          onEditRow={() => handleEditRow(row.slotId)}
                          onDeleteRow={() => handleDeleteRow(row.slotId)}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />

                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            )}
          </TableContainer>

          {!isOverview && (
            <TablePaginationCustom
              count={dataFiltered.length}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          )}
        </Card>
        {selectedMeeting && (
          <MeetingForm
            title="Reschedule Meeting"
            currentMeeting={selectedMeeting}
            onClose={handleCloseForm}
            open={Boolean(selectedMeeting)}
            colorOptions={[]} // or whatever is needed
          />
        )}
      </Container>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Cancel Meeting"
        content={
          <>
            Are you sure want to cancel meeting with{' '}
            <strong> {selectedMeeting?.toCompanyName} </strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Cancel Meeting
          </Button>
        }
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IBookedSlot[];
  comparator: (a: any, b: any) => number;
  filters: IScheduleTableFilters;
  dateError: boolean;
}) {
  const { name, status, country, meetingDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (val) =>
        val.toCompanyName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        val.inviteToName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((val) => val.meetingStatus === status);
  }

  if (country) {
    inputData = inputData.filter(
      (val) => val.meetingLocation.toLowerCase().indexOf(country.toLowerCase()) !== -1
    );
  }

  if (meetingDate) {
    inputData = inputData.filter((val) => val.startTime.split('T')[0] === meetingDate);
  }

  return inputData;
}
