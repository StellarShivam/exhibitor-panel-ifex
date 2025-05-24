'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

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

import { useGetTickets } from 'src/api/help-and-support';

import {
  ITicketItem,
  ITicketTableFilters,
  ITicketTableFilterValue,
} from 'src/types/help-and-support';

import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';

// ----------------------------------------------------------------------

const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

export const allTickets: ITicketItem[] = [
  {
    id: 1,
    appUserId: 101,
    eventId: 501,
    subject: 'Issue with login',
    priority: 'High',
    status: 'Opened',
    assignTo: 'John Doe',
    email: 'user1@example.com',
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-01T10:30:00Z',
  },
  {
    id: 2,
    appUserId: 102,
    eventId: 502,
    subject: 'Payment not reflected',
    priority: 'Medium',
    status: 'In Progress',
    assignTo: 'Jane Smith',
    email: 'user2@example.com',
    createdAt: '2025-04-02T09:15:00Z',
    updatedAt: '2025-04-02T11:00:00Z',
  },
  {
    id: 3,
    appUserId: 103,
    eventId: 503,
    subject: 'Error on event registration',
    priority: 'Low',
    status: 'Closed',
    assignTo: 'Mark Lee',
    email: 'user3@example.com',
    createdAt: '2025-04-03T08:45:00Z',
    updatedAt: '2025-04-04T08:45:00Z',
  },
  {
    id: 4,
    appUserId: 104,
    eventId: 504,
    subject: 'Account suspended by mistake',
    priority: 'High',
    status: 'Opened',
    assignTo: 'Emily Rose',
    email: 'user4@example.com',
    createdAt: '2025-04-04T12:30:00Z',
    updatedAt: '2025-04-04T12:45:00Z',
  },
  {
    id: 5,
    appUserId: 105,
    eventId: 505,
    subject: 'Unable to update profile',
    priority: 'Medium',
    status: 'Closed',
    assignTo: 'David Kim',
    email: 'user5@example.com',
    createdAt: '2025-04-05T14:00:00Z',
    updatedAt: '2025-04-06T10:00:00Z',
  },
];

// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'OPENED', label: 'Opened' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'ON_HOLD', label: 'On Hold' },
];

const TABLE_HEAD = [
  { id: 'ticket', label: 'Ticket ID', width: 120 },
  { id: 'subject', label: 'Subject', width: 200 },
  { id: 'event', label: 'Event', width: 220 },
  { id: 'created', label: 'Created On', width: 100 },
  { id: 'priority', label: 'Priority', width: 80 },
  { id: 'assigned', label: 'Assigned to', width: 220 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'actions', label: 'Actions', width: 88 },
];

const defaultFilters: ITicketTableFilters = {
  name: '',
  priority: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function HelpAndSupportList() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const { eventData } = useEventContext();

  const { tickets, reFetchTickets } = useGetTickets(eventData?.state.eventId);

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<ITicketItem[]>(tickets);

  useEffect(() => {
    setTableData(tickets);
  }, [tickets]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: ITicketTableFilterValue) => {
      // console.log('********8', name, value);
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
    (id: number) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(String(row.id)));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.helpAndSupport.detail(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Help & Support"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Help & Support', href: paths.dashboard.helpAndSupport.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.helpAndSupport.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create Ticket
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'CLOSED' && 'success') ||
                      (tab.value === 'ON_HOLD' && 'warning') ||
                      (tab.value === 'IN_PROGRESS' && 'error') ||
                      (tab.value === 'OPENED' && 'info') ||
                      (tab.value === 'NEW' && 'secondary') ||
                      'default'
                    }
                  >
                    {['CLOSED', 'ON_HOLD', 'IN_PROGRESS', 'OPENED', 'NEW'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            priorityOptions={priorityOptions}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => String(row.id))
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => String(row.id))
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(String(row.id))}
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
          </TableContainer>

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
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
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
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: ITicketItem[];
  comparator: (a: any, b: any) => number;
  filters: ITicketTableFilters;
}) {
  const { status, priority, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.subject.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (priority.length) {
    inputData = inputData.filter((user) => priority.includes(user.priority));
  }

  return inputData;
}
