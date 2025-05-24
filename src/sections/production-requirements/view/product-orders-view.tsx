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

import { ITicketTableFilterValue } from 'src/types/help-and-support';

import { useGetOrdersList } from 'src/api/production-requirements';

import {
  IExhbitorProductionRequirements,
  IExhibitorProductionRequirementsFilters,
} from 'src/types/production-requirements';

import ExhibitorProdRequirementsRow from '../exhibitor-prod-requirements-row';
import ExhibitorProdRequirementsToolbar from '../exhibitor-prod-requirements-toolbar';
import ExhibitorProdRequirementsFilterResults from '../exhibitor-prod-requirements-filter-results';

import { ComingSoonIllustration } from 'src/assets/illustrations';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const paymentStatusOptions = ['PENDING', 'COMPLETED'];

// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'PENDING', label: 'Pending' },
];

const TABLE_HEAD = [
  { id: 'item', label: 'Item', width: 120 },
  { id: 'quantity', label: 'Quantity', width: 80, align: 'center' },
  // { id: 'event', label: 'Event', width: 220 },
  // { id: 'bookedOn', label: 'Booked On', width: 80 },
  { id: 'paymentStatus', label: 'Payment Status', width: 100 },
  { id: 'totalPrice', label: 'Total Price', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  // { id: 'actions', label: 'Actions', width: 88 },
];

const defaultFilters: IExhibitorProductionRequirementsFilters = {
  name: '',
  paymentStatus: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function HelpAndSupportList() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const { eventData } = useEventContext();

  const { productionRequirementsOrders, productionRequirementsOrdersLoading } = useGetOrdersList(
    eventData?.state.exhibitorId
  );

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IExhbitorProductionRequirements[]>(
    productionRequirementsOrders
  );

  useEffect(() => {
    setTableData(productionRequirementsOrders);
  }, [productionRequirementsOrders]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleFilters = useCallback(
    (name: string, value: ITicketTableFilterValue) => {
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

  // const handleDeleteRow = useCallback(
  //   (id: number) => {
  //     const deleteRow = tableData.filter((row) => row.skuId !== id);

  //     enqueueSnackbar('Delete success!');

  //     setTableData(deleteRow);

  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, enqueueSnackbar, table, tableData]
  // );

  // const handleDeleteRows = useCallback(() => {
  //   const deleteRows = tableData.filter((row) => !table.selected.includes(String(row.skuId)));

  //   enqueueSnackbar('Delete success!');

  //   setTableData(deleteRows);

  //   table.onUpdatePageDeleteRows({
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: dataFiltered.length,
  //   });
  // }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

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

  // return (
  //   <>
  //     <Container maxWidth={settings.themeStretch ? false : 'lg'}>
  //       <CustomBreadcrumbs
  //         heading="Production Requirements"
  //         links={[
  //           { name: 'Dashboard', href: paths.dashboard.root },
  //           { name: 'Production Requirements', href: paths.dashboard.productionRequirements.root },
  //           { name: 'Orders' },
  //         ]}
  //         sx={{
  //           mb: { xs: 3, md: 5 },
  //         }}
  //       />

  //       <Card>
  //         <Tabs
  //           value={filters.status}
  //           onChange={handleFilterStatus}
  //           sx={{
  //             px: 2.5,
  //             boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
  //           }}
  //         >
  //           {STATUS_OPTIONS.map((tab) => (
  //             <Tab
  //               key={tab.value}
  //               iconPosition="end"
  //               value={tab.value}
  //               label={tab.label}
  //               icon={
  //                 <Label
  //                   variant={
  //                     ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
  //                   }
  //                   color={
  //                     (tab.value === 'COMPLETED' && 'success') ||
  //                     (tab.value === 'REJECTED' && 'error') ||
  //                     (tab.value === 'IN_PROGRESS' && 'warning') ||
  //                     (tab.value === 'REFUNDED' && 'info') ||
  //                     (tab.value === 'PENDING' && 'secondary') ||
  //                     'default'
  //                   }
  //                 >
  //                   {['COMPLETED', 'REJECTED', 'IN_PROGRESS', 'REFUNDED'].includes(tab.value)
  //                     ? tableData.filter((user) => user.status === tab.value).length
  //                     : tableData.length}
  //                 </Label>
  //               }
  //             />
  //           ))}
  //         </Tabs>

  //         <ExhibitorProdRequirementsToolbar
  //           filters={filters}
  //           onFilters={handleFilters}
  //           //
  //           paymentStatusOptions={paymentStatusOptions}
  //         />

  //         {canReset && (
  //           <ExhibitorProdRequirementsFilterResults
  //             filters={filters}
  //             onFilters={handleFilters}
  //             //
  //             onResetFilters={handleResetFilters}
  //             //
  //             results={dataFiltered.length}
  //             sx={{ p: 2.5, pt: 0 }}
  //           />
  //         )}

  //         <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
  //           <TableSelectedAction
  //             dense={table.dense}
  //             numSelected={table.selected.length}
  //             rowCount={dataFiltered.length}
  //             onSelectAllRows={(checked) =>
  //               table.onSelectAllRows(
  //                 checked,
  //                 dataFiltered.map((row) => String(row.skuId))
  //               )
  //             }
  //             // action={
  //             //   <Tooltip title="Delete">
  //             //     <IconButton color="primary" onClick={confirm.onTrue}>
  //             //       <Iconify icon="solar:trash-bin-trash-bold" />
  //             //     </IconButton>
  //             //   </Tooltip>
  //             // }
  //           />

  //           <Scrollbar>
  //             <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
  //               <TableHeadCustom
  //                 order={table.order}
  //                 orderBy={table.orderBy}
  //                 headLabel={TABLE_HEAD}
  //                 rowCount={dataFiltered.length}
  //                 numSelected={table.selected.length}
  //                 onSort={table.onSort}
  //                 onSelectAllRows={(checked) =>
  //                   table.onSelectAllRows(
  //                     checked,
  //                     dataFiltered.map((row, idx) => String(idx))
  //                   )
  //                 }
  //               />

  //               <TableBody>
  //                 {dataFiltered
  //                   .slice(
  //                     table.page * table.rowsPerPage,
  //                     table.page * table.rowsPerPage + table.rowsPerPage
  //                   )
  //                   .map((row, idx) => (
  //                     <ExhibitorProdRequirementsRow
  //                       key={idx}
  //                       row={row}
  //                       selected={table.selected.includes(String(idx))}
  //                       onSelectRow={() => table.onSelectRow(String(idx))}
  //                       // onViewRow={() => handleDeleteRow(idx)}
  //                       onEditRow={() => handleEditRow(String(idx))}
  //                     />
  //                   ))}

  //                 <TableEmptyRows
  //                   height={denseHeight}
  //                   emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
  //                 />

  //                 <TableNoData notFound={notFound} />
  //               </TableBody>
  //             </Table>
  //           </Scrollbar>
  //         </TableContainer>

  //         <TablePaginationCustom
  //           count={dataFiltered.length}
  //           page={table.page}
  //           rowsPerPage={table.rowsPerPage}
  //           onPageChange={table.onChangePage}
  //           onRowsPerPageChange={table.onChangeRowsPerPage}
  //           //
  //           dense={table.dense}
  //           onChangeDense={table.onChangeDense}
  //         />
  //       </Card>
  //     </Container>

  //     <ConfirmDialog
  //       open={confirm.value}
  //       onClose={confirm.onFalse}
  //       title="Delete"
  //       content={
  //         <>
  //           Are you sure want to delete <strong> {table.selected.length} </strong> items?
  //         </>
  //       }
  //       action={
  //         <Button
  //           variant="contained"
  //           color="error"
  //           onClick={() => {
  //             // handleDeleteRows();
  //             confirm.onFalse();
  //           }}
  //         >
  //           Delete
  //         </Button>
  //       }
  //     />
  //   </>
  // );

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Center the entire content
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        alignItems: 'center', // Center items horizontally
        textAlign: 'center', // Center text
      }}
    >
      <ComingSoonIllustration
        sx={{
          width: '150%',
          height: '150%',
          objectFit: 'contain',
        }}
      />
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          marginTop: 2, // Add spacing between the illustration and text
        }}
      >
        Coming Soon!
      </Typography>
    </Box>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IExhbitorProductionRequirements[];
  comparator: (a: any, b: any) => number;
  filters: IExhibitorProductionRequirementsFilters;
}) {
  const { status, paymentStatus, name } = filters;
  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis?.map((el) => el[0]);
  if (name) {
    inputData = inputData.filter(
      (user) => user.productName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }
  if (paymentStatus.length) {
    inputData = inputData.filter((user) => paymentStatus.includes(user.status));
  }
  return inputData;
}
