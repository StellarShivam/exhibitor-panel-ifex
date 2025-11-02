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
import { useExhibitorForm, updateRegistrationDetails } from 'src/api/form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date' },
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
  const { payment, paymentLoading, refetchPayment } = usePaymentByExhibitorID(exhibitorId);
  const { exhibitor } = useGetExhibitor(exhibitorId);
  const [finalAmountInput, setFinalAmountInput] = useState('');
  const [finalAmountError] = useState('');

  const table = useTable({ defaultOrderBy: 'companyName' });

  const [tableData, setTableData] = useState<IPaymentSummaryTransaction[]>(
    payment?.paymentTransactions ?? []
  );
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [manualOrderId, setManualOrderId] = useState('');

  const { exhibitorForm, exhibitorFormLoading } = useExhibitorForm(
    exhibitor?.supportEmail,
    eventData.state.eventId
  );

  const csvHeaders = TABLE_HEAD.map((header) => ({
    label: header.label,
    key: header.id,
  }));

  const csvData = tableData.map((row) => {
    const rowData: Record<string, any> = {};
    TABLE_HEAD.forEach((header) => {
      // For button columns, leave blank or add a placeholder
      if (header.id === 'viewForm' || header.id === 'viewPayment') {
        rowData[header.id] = '';
      } else {
        rowData[header.id] = row[header.id as keyof IPaymentSummaryTransaction] || '';
      }
    });
    return rowData;
  });

  useEffect(() => {
    if (!paymentLoading) {
      setTableData(payment?.paymentTransactions ?? []); // Update table data when spaces are loaded
    }
  }, [payment, paymentLoading]);
  useEffect(() => {
    console.log('Exhibitor ID:', exhibitorId);
    console.log('Payment Data:', payment);
    console.log('Exhibitor Details:', exhibitor);
  }, [payment, exhibitor]);

  // Update: Add all filter fields to initial state
  const filters = useSetState({
    status: 'All',
    paymentOption: '',
    paymentMethod: '',
    paymentReferenceNumber: '',
  });

  const handleFilterReset = useCallback(() => {
    filters.setState({
      status: filters.state.status,
      paymentOption: '',
      paymentMethod: '',
      paymentReferenceNumber: '',
    });
    table.onResetPage();
  }, [table, filters]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator<keyof IPaymentSummaryTransaction>(
      table.order,
      table.orderBy as keyof IPaymentSummaryTransaction
    ),
    filters: filters.state,
  });

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const isOfflineTxnPending = (payment?.paymentTransactions ?? []).some(
    (txn) =>
      txn?.paymentStatus?.toLowerCase() === 'pending' &&
      txn?.paymentOption?.toLowerCase() === 'offline'
  );

  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingForApproval, setPendingForApproval] = useState(0);

  const [tdsAmount, setTdsAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [premiumLocationAmount, setPremiumLocationAmount] = useState(0);

  useEffect(() => {
    const amount = Number(payment?.paymentData.calculatedTotalCost || 0);
    let tds = Number(payment?.paymentData?.tds);
    let isPremium = payment?.paymentData.buyPremiumLocation === 'Yes' ? 1 : 0;
    const premiumCharge = Number((isPremium ? payment?.paymentData?.plcAmount : 0).toFixed(2));

    if (isNaN(tds)) {
      tds = 0;
    }

    // Calculate total paid amount using fold (reduce)
    const paid = (payment?.paymentTransactions ?? []).reduce(
      (sum, transaction) =>
        transaction?.paymentStatus?.toLowerCase().includes('captured') ||
        transaction?.paymentStatus?.toLowerCase().includes('approved')
          ? sum + Number(transaction.finalAmount || 0)
          : sum,
      0
    );

    const pending = (payment?.paymentTransactions ?? []).reduce(
      (sum, transaction) =>
        transaction?.paymentStatus?.toLowerCase().includes('pending')
          ? sum + Number(transaction.finalAmount || 0)
          : sum,
      0
    );

    // GST and TDS calculations (unchanged)
    const gst = Number((payment?.paymentData.gstAmount || 0).toFixed(2));
    const postGst = amount + premiumCharge + gst;
    const tdsValue = Number((payment?.paymentData.tdsAmount || 0).toFixed(2));
    const postTdsAmount = Number((postGst - tdsValue).toFixed(2));

    // Round all values to 2 decimals
    setTdsAmount(Number(tdsValue.toFixed(2)));
    setGstAmount(Number(gst.toFixed(2)));
    setPremiumLocationAmount(Number(premiumCharge.toFixed(2)));

    setPendingForApproval(Number(pending.toFixed(2)));
    setTotalAmount(Number(postTdsAmount.toFixed(2)));
    setPaidAmount(Number(paid.toFixed(2)));
    setPendingAmount(Number((postTdsAmount - paid).toFixed(2)));
  }, [payment]);

  const getCurrencySymbol = () => {
    const currency = exhibitorForm?.data?.currency || 'INR';
    console.log(currency);
    switch (currency.toUpperCase()) {
      case 'EUR':
        return '€';
      case 'INR':
      default:
        return '₹';
    }
  };

  const currencySymbol = getCurrencySymbol();

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
        // heading={payment?.paymentData?.boothDisplayName ?? exhibitor?.companyName ?? 'Payment Details'}
        links={[{ name: '', href: '' }]}
        action={
          <Box display="flex" gap={1}>
            {/* <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="material-symbols:payments-rounded" />}
              // onClick={() => setOpenPaymentModal(true)}
              disabled={isOfflineTxnPending || pendingAmount <= 0}
              onClick={() =>
                window.open(
                  'https://register.upinternationaltradeshow.com/payment?email=' +
                    exhibitor?.supportEmail,
                  '_blank'
                )
              }
            >
              Pay Now
            </Button> */}
            {/* <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="bx:bxs-download" />}
              disabled={tableData.length === 0}
            >
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="space_booking_data.csv"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Export Data
              </CSVLink>
            </Button> */}
          </Box>
        }
        sx={{ mb: { xs: 0, md: 0 } }}
      />
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={2}
        my={3}
      >
        <Card
          sx={{
            flex: 2,
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Box fontWeight={'bold'} fontSize={14} color="text.secondary">
              Total&nbsp;Payment
            </Box>
            <Box fontSize={20} fontWeight="bold">
              {currencySymbol}
              {Number(payment?.paymentData?.totalAmount || 0).toFixed(2)}
            </Box>
          </Box>
          <Box>
            <Box fontWeight={'bold'} fontSize={10} color="text.primary">
              Base Amount : {currencySymbol}
              {Number(payment?.paymentData.calculatedTotalCost || 0).toFixed(2)}{' '}
            </Box>
            <Box fontWeight={'bold'} fontSize={10} color="text.primary">
              GST: {currencySymbol}
              {Number(payment?.paymentData.gstAmount || 0).toFixed(2)}{' '}
            </Box>
            <Box fontWeight={'bold'} fontSize={10} color="text.primary">
              TDS : {currencySymbol}
              {Number(payment?.paymentData.tdsAmount || 0).toFixed(2)}{' '}
            </Box>
            {payment?.paymentData.buyPremiumLocation === 'Yes' && (
              <Box fontWeight={'bold'} fontSize={10} color="text.primary">
                Prefered Location Charge : {currencySymbol}
                {Number(payment?.paymentData?.plcAmount || 0).toFixed(2)}{' '}
              </Box>
            )}
          </Box>
          <Iconify icon="solar:bill-list-bold-duotone" width={46} color="#3ec1f3" />
        </Card>

        <Card
          sx={{
            flex: 1,
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Box fontWeight={'bold'} fontSize={14} color="text.secondary">
              Paid
            </Box>
            <Box fontSize={20} fontWeight="bold">
              {currencySymbol}
              {paidAmount.toFixed(2)}
            </Box>
          </Box>
          <Iconify icon="eva:checkmark-circle-2-fill" width={32} color="#61e294" />
        </Card>

        <Card
          sx={{
            flex: 1,
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Box fontWeight={'bold'} fontSize={14} color="text.secondary">
              Pending
            </Box>
            <Box fontSize={20} fontWeight="bold">
              {currencySymbol}
              {pendingForApproval.toFixed(2)}
            </Box>
          </Box>
          <Iconify icon="eva:clock-outline" width={32} color="#ffcf77" />
        </Card>

        <Card
          sx={{
            flex: 1,
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Box fontWeight={'bold'} fontSize={14} color="text.secondary">
              Outstanding
            </Box>
            <Box fontSize={20} fontWeight="bold">
              {currencySymbol}
              {pendingAmount.toFixed(2)}
            </Box>
          </Box>
          <Iconify icon="solar:wallet-money-outline" width={32} color="#A400FF" />
        </Card>
      </Box>

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
                    currencySymbol={currencySymbol}
                    row={row}
                    refetch={() => {
                      refetchPayment(); // Refetch payment data when needed
                    }}
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
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Box>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box fontWeight="bold" fontSize={18}>
              Payment Terms & Conditions for Exhibitors
            </Box>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="material-symbols:payments-rounded" />}
              disabled={isOfflineTxnPending || pendingAmount <= 0}
              onClick={() =>
                window.open(
                  'https://register.ifexindia.com/payment?email=' + exhibitor?.supportEmail,
                  '_blank'
                )
              }
            >
              Pay Now
            </Button>
          </Box>
          <Box fontSize={14} color="text.secondary">
            To ensure a smooth and confirmed participation, all exhibitors are required to adhere to
            the following payment milestones:
          </Box>
          <Box component="ol" sx={{ pl: 3, mt: 1, mb: 0 }}>
            <li className="list-disc mt-1">25% at the time of booking</li>
            <li className="list-disc mt-1">25% before 20/Jul/2025</li>
            <li className="list-disc mt-1">25% before 18/Oct/2025</li>
            <li className="list-disc mt-1">25% before 16/Dec/2025</li>
          </Box>
        </Box>
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
            label={`Maximum Amount: ${currencySymbol}${pendingAmount.toFixed(2)}`}
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
    paymentOption = '',
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
        (payment: IPaymentSummaryTransaction) =>
          (payment.paymentStatus || '').toLowerCase() === 'pending'
      );
      break;
    case 'non-pending':
      inputData = inputData.filter(
        (payment: IPaymentSummaryTransaction) =>
          (payment.paymentStatus || '').toLowerCase() !== 'pending'
      );
      break;
    default:
    // No status filter
  }

  if (paymentOption) {
    inputData = inputData.filter(
      (payment: IPaymentSummaryTransaction) => (payment.paymentOption || '') === paymentOption
    );
  }
  if (paymentMethod) {
    inputData = inputData.filter((payment: IPaymentSummaryTransaction) => {
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
    inputData = inputData.filter((payment: IPaymentSummaryTransaction) =>
      (payment.orderId || '').toLowerCase().includes(paymentReferenceNumber.toLowerCase())
    );
  }

  return inputData;
}
