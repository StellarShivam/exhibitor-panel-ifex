import { TableRow, TableCell, Button, styled } from '@mui/material';
import Label from 'src/components/label';
import { fDate, fDateTime } from 'src/utils/format-time';
import { IPaymentSummaryTransaction } from 'src/types/payment-summary';
import { generateReceipt, generateSponsorReceipt, updatePaymentDetails } from 'src/api/payment-summary';
import { enqueueSnackbar } from 'notistack';

// Styled components for slimmer rows and truncated content
const SlimTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(3, 2), // Add padding on both vertical and horizontal axes
  whiteSpace: 'nowrap', // Prevent wrapping
  width: 'auto', // Allow width to adjust to content
  maxWidth: 'fit-content', // Ensure width fits content
  border: `1px solid ${theme.palette.divider}`, // Add border to cells
}));

type Props = {
  row: IPaymentSummaryTransaction;
  refetch: () => void;
};

export const PaymentSummaryTableRow: React.FC<Props> = ({ row, refetch }) => {
  const status = (row?.paymentStatus || '');
  console.log(row, 'row*****');

  const handlePaymenStatus = (status: string, orderId: string) => {
    updatePaymentDetails(status, orderId);
  };

  const handleDownloadReceipt = async () => {
    enqueueSnackbar('Processing receipt...', { variant: 'info' });
    try {
      if (typeof row.id === 'number') {
        const res = await generateSponsorReceipt(row.id);

        enqueueSnackbar('Receipt processed!!', { variant: 'success' });
        console.log(res, 'res*****');

        if (res?.receiptUrl) {
          window.open(res?.receiptUrl, '_blank', 'noopener,noreferrer');
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
      <SlimTableCell>{row.transactionDate ? fDate(row.transactionDate) : ''}</SlimTableCell>
      <SlimTableCell sx={{ textDecoration: 'capitalize' }}>
        {row.paymentMode}
      </SlimTableCell>
      <SlimTableCell sx={{ textDecoration: 'capitalize' }}>
        {row?.paymentMethod === null
          ? 'Pre-Paid'
          : row?.paymentMethod?.toLowerCase().includes('bank_transfer')
            ? 'Bank Transfer'
            : row?.paymentMethod?.toLowerCase().includes('cheque')
              ? 'Cheque'
              : row?.paymentMethod?.toLowerCase().includes('upi')
                ? 'UPI'
                : row?.paymentMethod?.toLowerCase().includes('neft / rtgs')
                  ? 'NEFT/RTGS'
                  : row?.paymentMethod?.toLowerCase().includes('demand_draft')
                    ? 'Demand Draft'
                    : 'Pre-Paid'}
      </SlimTableCell>
      <SlimTableCell>{row.orderId}</SlimTableCell>
      <SlimTableCell>{row.totalAmount}</SlimTableCell>
      <SlimTableCell>
        {(() => {
          const isOnlineAndInitiated =
            (row.paymentMode?.toUpperCase?.() === 'ONLINE' ||
              row.paymentMode?.toLowerCase?.() === 'online') &&
            (status === 'INITIATED' || row.paymentStatus === 'INITIATED');
          const finalStatus = isOnlineAndInitiated
            ? 'FAILED'
            : status || row.paymentStatus;

          let color: 'warning' | 'success' | 'error';
          let label: string;

          if (finalStatus === 'INITIATED') {
            color = 'warning';
            label = 'Pending';
          } else if (finalStatus === 'SUCCESS') {
            color = 'success';
            label = 'Approved';
          } else {
            color = 'error';
            label = 'Failed';
          }

          return (
            <Label color={color}>
              {label}
            </Label>
          );
        })()}
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
        {(status === 'SUCCESS') && (
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
