'use client';
import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Button, Container, Typography } from '@mui/material';
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
import { useGetPaymentDetails, usePaymentByExhibitorID, useTransactionsByExhibitorID } from 'src/api/payment-summary';
import { useGetExhibitor } from 'src/api/exhibitor-profile';
import { useEventContext } from 'src/components/event-context';
import { TransactionTableRow } from '../transaction-table-row';
import PaymentDialog from '../payment-dialog';
import { fCurrencyWithType } from 'src/utils/format-number';
import { useExhibitorForm } from 'src/api/form';

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
  const { payment, paymentLoading, refetchPayment } = usePaymentByExhibitorID();
  const { paymentDetails, paymentDetailsLoading, refetchPaymentDetails } = useGetPaymentDetails();
  const [finalAmountInput, setFinalAmountInput] = useState('');
  const [finalAmountError] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);
  const { exhibitorForm } = useExhibitorForm();

  const table = useTable({ defaultOrderBy: 'transactionDate', defaultOrder: 'desc' });
  console.log(payment)


  const [tableData, setTableData] = useState<any>(
    payment?.transactions ?? []
  );

  useEffect(() => {
    setTableData(payment?.transactions ?? []);
  }, [payment]);

  console.log(paymentDetails, 'paymentDetails*****');

  // Update: Add all filter fields to initial state
  const filters = useSetState({
    status: 'All',
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
    comparator: getComparator<keyof IPaymentSummaryTransaction>(
      table.order,
      table.orderBy as keyof IPaymentSummaryTransaction
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
  const isOfflineTxnPending = (payment?.paymentTransactions ?? []).some(
    (txn) =>
      txn?.paymentStatus?.toLowerCase() === 'pending' &&
      (txn?.paymentMode?.toLowerCase() === 'offline' ||
        txn?.paymentOption?.toLowerCase() === 'offline')
  );

  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingForApproval, setPendingForApproval] = useState(0);

  const [tdsAmount, setTdsAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);

  useEffect(() => {

    // Calculate total paid amount using fold (reduce)
    const paid = (payment?.metaData?.data ?? []).reduce(
      (sum, transaction) =>
        transaction?.paymentStatus?.includes('SUCCESS')
          ? sum + Number(transaction.totalAmount || 0)
          : sum,
      0
    );

    const pending = (payment?.metaData?.data ?? []).reduce(
      (sum, transaction) =>
        transaction?.paymentStatus?.toUpperCase?.() === 'INITIATED' &&
          transaction?.paymentMode?.toUpperCase?.() === 'OFFLINE'
          ? sum + Number(transaction.totalAmount || 0)
          : sum,
      0
    );
    setPaidAmount(paid);
    setPendingForApproval(pending);
    setPendingAmount(paymentDetails?.totalAmount - paid);


  }, [payment, paymentDetails]);

  const getMembershipAmount = () => {
    const calculatedAmount = paymentDetails?.calculatedAmount || 0;
    const gst = paymentDetails?.gstAmount || 0;
    const total = paymentDetails?.totalAmount || 0;
    const membershipAmount = total - (calculatedAmount + gst);
    return membershipAmount > 0 ? membershipAmount : 0;
  };

  const membershipAmount = getMembershipAmount();

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
        heading='Transactions'
        links={[{ name: '', href: '' }]}
        action={
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="material-symbols:payments-rounded" />}
              disabled={pendingForApproval > 0 || pendingAmount <= 0}
              onClick={() => setPaymentDialogOpen(true)}
            >
              Pay Now
            </Button>
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
        my={1}
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
              {fCurrencyWithType(paymentDetails?.totalAmount, paymentDetails?.currency || "INR").formatted}
            </Box>
            {/* <Box fontSize={12} color="text.secondary">
              {paymentDetails?.preferredFloor ? paymentDetails?.preferredFloor === 'GROUND_FLOOR' ? 'Location - Ground Floor' : 'Location - First Floor' : ''}
            </Box> */}
          </Box>
          <Box>
            <Box fontWeight={'bold'} fontSize={12} color="text.primary">
              Base Amount : {fCurrencyWithType(paymentDetails?.calculatedAmount, paymentDetails?.currency || "INR").formatted}{' '}
            </Box>

            <Box fontWeight={'bold'} fontSize={12} color="text.primary">
              GST: {fCurrencyWithType((paymentDetails?.gstAmount + paymentDetails?.gstAmountPlc), paymentDetails?.currency || "INR").formatted}{' '}
            </Box>

            {
              // exhibitorForm?.metaData?.data?.formData?.hallNumber &&
              // exhibitorForm?.metaData?.data?.formData?.stallNumber &&
              <>
                <Box fontWeight={'bold'} fontSize={12} color="text.primary">
                  PLC : {fCurrencyWithType((paymentDetails?.calculatedAmountPlc), paymentDetails?.currency || "INR").formatted}{' '}
                </Box>

                {/* <Box fontWeight={'bold'} fontSize={12} color="text.primary">
                  GST (PLC Amount) : {fCurrencyWithType(paymentDetails?.gstAmountPlc || 0, paymentDetails?.currency || "INR").formatted}{' '}
                </Box> */}
              </>
            }


            {paymentDetails?.tdsAmount > 0 && <Box fontWeight={'bold'} fontSize={12} color="text.primary">
              TDS : {fCurrencyWithType(paymentDetails?.tdsAmount || 0, paymentDetails?.currency || "INR").formatted}{' '}
            </Box>}

            {paymentDetails?.calculatedAmountIifMember > 0 && (
              <Box fontWeight={'bold'} fontSize={12} color="text.primary">
                Membership Fee :{' '}
                {fCurrencyWithType((paymentDetails?.calculatedAmountIifMember + paymentDetails?.gstAmountIifMember), paymentDetails?.currency || 'INR').formatted}{' '}
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
              {fCurrencyWithType(paidAmount, paymentDetails?.currency || "INR").formatted}
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
              {fCurrencyWithType(pendingForApproval, paymentDetails?.currency || "INR").formatted}
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
              {fCurrencyWithType(pendingAmount, paymentDetails?.currency || "INR").formatted}
            </Box>
          </Box>
          <Iconify icon="solar:wallet-money-outline" width={32} color="#A400FF" />
        </Card>
      </Box>

      <Card sx={{ mt: 1 }}>
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
            // dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            // onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Box>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box fontWeight="bold" fontSize={18}>
              Payment Terms & Conditions for Exhibitors
            </Box>
            {/* <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="material-symbols:payments-rounded" />}
              disabled={pendingForApproval > 0 || pendingAmount <= 0}
              onClick={() => setPaymentDialogOpen(true)}
            >
              Pay Now
            </Button> */}
          </Box>
          <Box fontSize={14} color="text.secondary">
            To ensure a smooth and confirmed participation, all exhibitors are required to adhere to
            the following payment milestones:
          </Box>
          <ul className="space-y-2 w-full">
            <li>
              <strong className="text-lg ">First Payment – 25%</strong>
              <br />
              <span className="text-gray-600">
                At the time of booking
              </span>
            </li>
            <li>
              <strong className="text-lg">Second Payment – 25%</strong>
              <br />
              <span className="text-gray-600">
                Due By: 20 July 2026
              </span>
            </li>
            <li>
              <strong className="text-lg">Third Payment – 25%</strong>
              <br />
              <span className="text-gray-600">Due By: 20 Oct 2026</span>
            </li>
            <li>
              <strong className="text-lg">Fourth Payment – 25%</strong>
              <br />
              <span className="text-gray-600">Due By: 16 Dec 2026</span>
            </li>
          </ul>
        </Box>
      </Card>

      {/* <Typography variant="h4" sx={{ mt: 5}}>Service Request Transactions</Typography>
      <TransactionTable exhibitorId={exhibitorId} /> */}

      {/* <Dialog
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
      </Dialog> */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        paymentDetails={paymentDetails}
        reFetchPayment={refetchPayment}
        reFetchPaymentDetails={refetchPaymentDetails}
        exhibitorForm={exhibitorForm}
        isOffline={true}
      // exhibitorFormDetailId={currentForm?.exhibitorFormId}
      // email={values?.email}
      // reFetchFormData={reFetchFormData}
      />
    </Container>
  );
}

// const TXN_TABLE_HEAD = [
//   { id: 'date', label: 'Date' },
//   { id: 'form', label: 'Form Name' },
//   { id: 'paymentMode', label: 'Payment Mode' },
//   { id: 'paymentMethod', label: 'Payment Method' },
//   { id: 'paymentReferenceNumber', label: 'Transaction ID' },
//   { id: 'amount', label: 'Amount' },
//   { id: 'status', label: 'Status' },
//   { id: 'action', label: 'Action' },
//   // { id: 'viewForm', label: 'View Form' },
//   // { id: 'viewPayment', label: 'View Payment' },
// ];

// function TransactionTable({exhibitorId} : {exhibitorId : number}) {

//   const { payment, paymentLoading, refetchPayment } = useTransactionsByExhibitorID(exhibitorId);
//   const filters = useSetState({
//     status: 'All',
//     paymentOption: '', // was paymentMode
//     paymentMethod: '',
//     paymentReferenceNumber: '',
//   });

//   const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

//   const [tableData, setTableData] = useState(
//     payment?.transactions ?? []
//   );

//   useEffect(() => {
//     if (!paymentLoading) {
//       const transformedData = (payment?.transactions ?? []).map((item) => ({
//         ...item,
//         date: item.data?.transactionDate ? item.data?.transactionDate : item.createdAt,
//       }));
//       setTableData(transformedData);
//     }
//   }, [payment, paymentLoading]);

//   const handleFilterReset = useCallback(() => {
//     filters.setState({
//       status: filters.state.status,
//       paymentOption: '', // was paymentMode
//       paymentMethod: '',
//       paymentReferenceNumber: '',
//     });
//     table.onResetPage();
//   }, [table, filters]);

// const dataFiltered = applyFilter({
//   inputData: tableData,
//   comparator: getComparator<keyof IPaymentTransaction>(
//     table.order,
//     table.orderBy as keyof IPaymentTransaction
//   ),
//   filters: filters.state,
// });

//   return (
//     <Card sx={{ mt: 2 }}>
//       {/* <PaymentTableToolbar filters={filters} onResetPage={table.onResetPage} /> */}
//       {/* <PaymentTableFiltersResult
//         filters={filters}
//         onResetPage={handleFilterReset}
//         totalResults={dataFiltered.length}
//         sx={{ p: 2.5, pt: 0 }}
//       /> */}

//       <Box sx={{ position: 'relative', overflowX: 'auto' }}>
//         {' '}
//         {/* Add overflowX: 'auto' */}
//         <Table>
//           <TableHeadCustom
//             order={table.order}
//             orderBy={table.orderBy}
//             headLabel={TXN_TABLE_HEAD}
//             rowCount={dataFiltered.length}
//             numSelected={table.selected.length}
//             onSort={table.onSort}
//           //   onSelectAllRows={(checked) =>
//           //     table.onSelectAllRows(
//           //       checked,
//           //       dataFiltered.map((row) => row.eventId.toString())
//           //     )
//           //   }
//           />

//           <TableBody>
//             {dataFiltered
//               .slice(
//                 table.page * table.rowsPerPage,
//                 table.page * table.rowsPerPage + table.rowsPerPage
//               )
//               .map((row) => (
//                 <TransactionTableRow
//                   key={row.eventId}
//                   row={row}
//                   // setOpenPaymentModal={handleOpenPaymentModal}
//                   refetch={() => {
//                     refetchPayment();
//                   }}
//                   showFormName
//                 // onSelectRow={() => table.onSelectRow(row.eventId.toString())}
//                 />
//               ))}

//             <TableEmptyRows
//               height={56}
//               emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
//             />

//             <TableNoData notFound={!dataFiltered.length} />
//           </TableBody>
//         </Table>
//         <TablePaginationCustom
//           page={table.page}
//           dense={table.dense}
//           count={dataFiltered.length}
//           rowsPerPage={table.rowsPerPage}
//           onPageChange={table.onChangePage}
//           onChangeDense={table.onChangeDense}
//           onRowsPerPageChange={table.onChangeRowsPerPage}
//         />
//       </Box>
//     </Card>
//   )
// }

// // ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }: any) {
  // Destructure all possible filter fields with fallback to empty string
  const {
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

  if (paymentMode) {
    inputData = inputData.filter((payment: IPaymentSummaryTransaction) =>
      (payment.paymentMode?.toLowerCase() || '') === paymentMode?.toLowerCase()
    );
  }

  if (paymentMethod) {
    inputData = inputData.filter((payment: IPaymentSummaryTransaction) =>
      (payment.paymentMethod?.toLowerCase() || '') === paymentMethod?.toLowerCase()
    );
  }

  if (paymentReferenceNumber) {
    const query = paymentReferenceNumber.toLowerCase();
    inputData = inputData.filter((payment: IPaymentSummaryTransaction) =>
      (payment.orderId?.toLowerCase() || '').includes(query)
    );
  }

  return inputData;
}
