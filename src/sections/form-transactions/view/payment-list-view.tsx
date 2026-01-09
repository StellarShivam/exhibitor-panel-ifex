'use client';
import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Button, Container } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

import { useSetState } from 'src/hooks/use-set-state';

import {
  useTable,
  TableHeadCustom,
  TableEmptyRows,
  TableNoData,
  TablePaginationCustom,
  emptyRows,
  getComparator,
} from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// import { CSVLink } from 'react-csv';
import Iconify from 'src/components/iconify';
import { PaymentSummaryTableToolbar } from '../payment-table-toolbar';
import { PaymentSummaryTableRow } from '../payment-table-row';
import { PaymentSummaryTableFiltersResult } from '../payment-table-filters-result';
import { useParams } from 'react-router';
import { use } from 'i18next';
import { set } from 'lodash';
import { IPaymentSummaryTransaction } from 'src/types/payment-summary';
import { usePaymentByExhibitorID } from 'src/api/payment-summary';
import { useGetExhibitor } from 'src/api/exhibitor-profile';
import { useEventContext } from 'src/components/event-context';
import { useGetFormTransactions } from 'src/api/request-form-payments';
import { IFormTransactions } from 'src/types/request-forms-payment';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [  
  { id: 'date', label: 'Date' },
  { id: 'formName', label: 'Form' },
  { id: 'paymentMode', label: 'Payment Mode' },
  { id: 'paymentMethod', label: 'Payment Method' },
  { id: 'paymentReferenceNumber', label: 'Payment Reference No.' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' },
  // { id: 'viewForm', label: 'View Form' },
  // { id: 'viewPayment', label: 'View Payment' },
];

// ----------------------------------------------------------------------

export default function PaymentSummaryListView() {
  // const theme = useTheme();
  // const { eventData } = useEventContext();
  //   const { spaces, spacesLoading } = useSpacesByEventID(eventData.state.eventId);
  const { eventData } = useEventContext();
  const exhibitorId = eventData.state.exhibitorId;

  const { formTransactions, formTransactionsLoading } = useGetFormTransactions(exhibitorId);

  const { exhibitor } = useGetExhibitor(exhibitorId);
  const [finalAmountInput, setFinalAmountInput] = useState('');
  const [finalAmountError] = useState('');

  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

  const [tableData, setTableData] = useState<IFormTransactions[]>(
    formTransactions?.transactions ?? []
  );
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [manualOrderId, setManualOrderId] = useState('');

  const csvHeaders = TABLE_HEAD.map((header) => ({
    label: header.label,
    key: header.id,
  }));

  // const csvData = tableData.map((row) => {
  //   const rowData: Record<string, any> = {};
  //   TABLE_HEAD.forEach((header) => {
  //     // For button columns, leave blank or add a placeholder
  //     if (header.id === 'viewForm' || header.id === 'viewPayment') {
  //       rowData[header.id] = '';
  //     } else {
  //       rowData[header.id] = row[header.id as keyof IPaymentSummaryTransaction] || '';
  //     }
  //   });
  //   return rowData;
  // });

  useEffect(() => {
    if (!formTransactionsLoading) {
      const transformedData = (formTransactions?.transactions ?? []).map((item) => ({
        ...item,
        date: item?.transactionDate ? item?.transactionDate : item.createdAt,
      }));
      setTableData(transformedData);
    }
  }, [formTransactions, formTransactionsLoading]);

  // Update: Add all filter fields to initial state
  const filters = useSetState({
    status: 'All',
    formName: '',
    paymentMode: '',
    paymentMethod: '',
    paymentReferenceNumber: '',
  });

  const handleFilterReset = useCallback(() => {
    filters.setState({
      status: filters.state.status,
      paymentMode: '',
      paymentMethod: '',
      paymentReferenceNumber: '',
    });
    table.onResetPage();
  }, [table, filters]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator<keyof IFormTransactions>(
      table.order,
      table.orderBy as keyof IFormTransactions
    ),
    filters: filters.state,
  });

  console.log(dataFiltered, 'dataFiltered*****');

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const isOfflineTxnPending = (formTransactions?.transactions ?? []).some(
    (txn) =>
      txn?.paymentStatus?.toLowerCase() === 'pending' &&
      txn?.paymentMode?.toLowerCase() === 'offline'
  );

  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingForApproval, setPendingForApproval] = useState(0);

  const [tdsAmount, setTdsAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);

  return (
    <Container
      maxWidth="lg"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs
        heading="Request Forms Transactions"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Request Forms Transactions' },
        ]}
        // action={}
        sx={{
          mb: { xs: 1, md: 2 },
        }}
      />

      <Card>
        {/* <Tabs
          value={filters.state.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: 'inset 0 -2px 0 0 rgba(0, 0, 0, 0.08)',
          }}
        >
          <Tab value="All" label="Payment Summary" />
           <Tab value="Non-Pending" label="Payment History" /> 

        </Tabs>*/}

        <PaymentSummaryTableToolbar filters={filters} onResetPage={table.onResetPage} />

        <PaymentSummaryTableFiltersResult
          filters={filters}
          onResetPage={handleFilterReset}
          totalResults={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />

        <Box sx={{ position: 'relative', overflowX: 'auto' }}>
          {' '}
          {/* Add overflowX: 'auto' */}
          <Table>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              //   onSelectAllRows={(checked) =>
              //     table.onSelectAllRows(
              //       checked,
              //       dataFiltered.map((row) => row.eventId.toString())
              //     )
              //   }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <PaymentSummaryTableRow
                    key={row.eventId}
                    row={row}
                    // refetch={() => {
                    //   refetchFormTransactions();
                    // }}
                    // onSelectRow={() => table.onSelectRow(row.eventId.toString())}
                  />
                ))}

              <TableEmptyRows
                height={56}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={!dataFiltered.length} />
            </TableBody>
          </Table>
        </Box>
        <TablePaginationCustom
          page={table.page}
          // dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          // onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      <Dialog
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Pay for this Exhibitor</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Order ID (Offline)"
            value={manualOrderId}
            onChange={(e) => setManualOrderId(e.target.value)}
            fullWidth
          />
          <TextField
            label={`Maximum Amount: ₹${pendingAmount.toFixed(2)}`}
            type="number"
            value={finalAmountInput}
            onChange={(e) => setFinalAmountInput(e.target.value)}
            error={!!finalAmountError}
            helperText={finalAmountError}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenPaymentModal(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!manualOrderId || !finalAmountInput}
            onClick={async () => {
              // try {
              //   const actualAmount = Number(payment?.paymentData?.calculatedTotalCost || 0);
              //   const gst = Number(payment?.paymentTransactions?.[0]?.gst);
              //   const enteredFinalAmount = Number(finalAmountInput);
              //   // Allow submit for any amount <= pendingAmount
              //   if (enteredFinalAmount > pendingAmount) {
              //     setFinalAmountError(`Amount can't exceed pending amount ₹${pendingAmount.toFixed(2)}`);
              //     return;
              //   }
              //   setFinalAmountError('');
              //   const payload = {
              //     email: exhibitorDetailResponse?.exhibitorDetails?.supportEmail ?? '',
              //     eventId: Number(exhibitorDetailResponse?.exhibitorDetails?.eventId ?? 0),
              //     actualAmount,
              //     gst,
              //     finalAmount: enteredFinalAmount,
              //     orderId: manualOrderId,
              //     data: {},
              //   };
              //   console.log('Payload for offline order:', payload);
              //   await createOfflineOrder(payload);
              //   setOpenPaymentModal(false);
              //   setManualOrderId('');
              //   setFinalAmountInput('');
              //   refetchPayment();
              // } catch (error) {
              //   console.error('Failed to submit offline order:', error);
              // }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }: any) {
  // Destructure all possible filter fields with fallback to empty string
  const {
    formName = '',
    paymentMode = '',
    paymentMethod = '',
    paymentReferenceNumber = '',
    status = '',
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Fix: Normalize status for comparison and handle undefined/null
  const normalizedStatus = (status || '').toLowerCase();
  switch (normalizedStatus) {
    case 'pending':
      inputData = inputData.filter(
        (payment: IFormTransactions) => (payment.paymentStatus || '').toLowerCase() === 'pending'
      );
      break;
    case 'non-pending':
      inputData = inputData.filter(
        (payment: IFormTransactions) => (payment.paymentStatus || '').toLowerCase() !== 'pending'
      );
      break;
    default:
    // No status filter
  }

  if (formName) {
    inputData = inputData.filter((payment: IFormTransactions) =>
      (payment.formName || '').toLowerCase().includes(formName.toLowerCase())
    );
  }

  if (paymentMode) {
    inputData = inputData.filter(
      (payment: IFormTransactions) =>
        (payment.paymentMode?.toLowerCase() || '') === paymentMode?.toLowerCase()
    );
  }
  console.log(paymentMethod, 'paymentMethod*****');
  if (paymentMethod) {
    inputData = inputData.filter((payment: IFormTransactions) => {
      // Handle both null and string "null" for Pre-Paid
      if (paymentMethod === 'null') {
        return payment.paymentMethod === null || payment.paymentMethod === 'null';
      }
      // Normalize both sides for comparison
      const filterValue = (paymentMethod || '').toLowerCase().trim();
      const dataValue = (payment.paymentMethod || '').toLowerCase().trim();
      return dataValue === filterValue;
    });
  }
  if (paymentReferenceNumber) {
    inputData = inputData.filter((payment: IFormTransactions) =>
      (payment.gatewayOrderId || '').toLowerCase().includes(paymentReferenceNumber.toLowerCase())
    );
  }

  return inputData;
}
