import { TableRow, TableCell, Button, styled } from '@mui/material';
import Label from 'src/components/label';
import { fDate, fDateTime } from 'src/utils/format-time';
import { IPaymentSummaryTransaction } from 'src/types/payment-summary';
import {
  generateMultiReceipt,
  // generateReceipt,
  updatePaymentDetails,
} from 'src/api/payment-summary';
import { enqueueSnackbar } from 'notistack';
import { IFormTransactions } from 'src/types/request-forms-payment';

// Styled components for slimmer rows and truncated content
const SlimTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(3, 2), // Add padding on both vertical and horizontal axes
  whiteSpace: 'nowrap', // Prevent wrapping
  width: 'auto', // Allow width to adjust to content
  maxWidth: 'fit-content', // Ensure width fits content
  border: `1px solid ${theme.palette.divider}`, // Add border to cells
}));

type Props = {
  row: IFormTransactions;
  refetch: () => void;
};

export const PaymentSummaryTableRow: React.FC<Props> = ({ row, refetch }) => {
  const status = (row.paymentStatus || '').toLowerCase();

  const handlePaymenStatus = (status: string, orderId: string) => {
    updatePaymentDetails(status, orderId);
  };

  const handleDownloadReceipt = async () => {
    enqueueSnackbar('Processing receipt...', { variant: 'info' });
    try {
      if (typeof row?.formPurchaseId === 'number') {
        const res = await generateMultiReceipt(row?.formPurchaseId);

        console.log('RES: ', res);

        enqueueSnackbar('Receipt processed!!', { variant: 'success' });

        if (res) {
          window.open(res, '_blank', 'noopener,noreferrer');
        }
      } else {
        enqueueSnackbar('Failed to generate receipt!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      enqueueSnackbar('Failed to generate receipt!', { variant: 'error' });
    }
  };
  return (
    <TableRow>
      {/* <SlimTableCell>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/dashboard/space/form/${row.companyEmail}`)}
        >
          View&nbsp;Form
        </Button>
      </SlimTableCell>
      <SlimTableCell>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/dashboard/space/payment/${row.companyEmail}`)}
        >
          View&nbsp;Payment
        </Button>
      </SlimTableCell> */}
      <SlimTableCell>
        {row.transactionDate ? fDate(row.transactionDate) : fDate(row.createdAt)}
      </SlimTableCell>
      <SlimTableCell>{row.formName}</SlimTableCell>
      <SlimTableCell sx={{ textDecoration: 'capitalize' }}>
        {row.paymentMode.toLowerCase().includes('online') ? 'Online' : 'Offline'}
      </SlimTableCell>
      <SlimTableCell sx={{ textDecoration: 'capitalize' }}>
        {row.paymentMethod === null
          ? 'Pre-Paid'
          : row.paymentMethod.toLowerCase().includes('bank_transfer')
            ? 'Bank Transfer'
            : row.paymentMethod.toLowerCase().includes('cheque')
              ? 'Cheque'
              : row.paymentMethod.toLowerCase().includes('upi')
                ? 'UPI'
                : row.paymentMethod.toLowerCase().includes('neft / rtgs')
                  ? 'NEFT/RTGS'
                  : row.paymentMethod.toLowerCase().includes('demand_draft')
                    ? 'Demand Draft'
                    : 'Pre-Paid'}
      </SlimTableCell>
      <SlimTableCell>{row.gatewayOrderId}</SlimTableCell>
      <SlimTableCell>{row.amount}</SlimTableCell>
      <SlimTableCell>
        <Label
          color={
            status === 'approved' || status === 'captured'
              ? 'success'
              : status === 'pending'
                ? 'warning'
                : 'error'
          }
        >
          {row.paymentStatus === 'captured' || row.paymentStatus === 'approved'
            ? 'Approved'
            : row.paymentStatus === 'failed'
              ? 'Failed'
              : 'Pending'}
        </Label>
      </SlimTableCell>
      <SlimTableCell>
        {/* {status === 'pending' && (
          <>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ mr: 1, padding: '12px 20px' }}
              // TODO: Add approve logic
              onClick={() => {updatePaymentDetails('captured', row.orderId).then(() => {
                  refetch();
                
              }) }
              }
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
               sx={{  padding: '12px 20px' }}
              // TODO: Add reject logic
             onClick={() => {updatePaymentDetails('failed', row.orderId).then(() => {
                  refetch();
                
              }) }
              }
            >
              Reject
            </Button>
          </>
        )} */}
        {(status === 'approved' || status === 'captured') && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            // TODO: Add download receipt logic
            onClick={handleDownloadReceipt}
          >
            Download Receipt
          </Button>
        )}
        {/* If failed or any other status, keep empty */}
      </SlimTableCell>
    </TableRow>
  );
};
