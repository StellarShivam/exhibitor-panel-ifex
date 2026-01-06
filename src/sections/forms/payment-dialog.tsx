import { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { Grid, MenuItem, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useCreatePayment, useVerifyPayment } from 'src/api/request-form-payments';
import { useSnackbar } from 'src/components/snackbar';
import { useRazorpay } from 'react-razorpay';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  open: boolean;
  onClose: VoidFunction;
  totalAmount: number;
  exhibitorFormDetailId: number;
  email: string;
  reFetchFormData?: () => void;
}

const paymentMethodOptions = [
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'Cheque', value: 'cheque' },
  { label: 'UPI', value: 'upi' },
  { label: 'Demand Draft', value: 'demand_draft' },
  { label: 'NEFT / RTGS', value: 'NEFT / RTGS' },
];

const offlinePaymentSchema = Yup.object().shape({
  paymentMethod: Yup.string().required('Payment method is required'),
  finalAmount: Yup.number().required('Final amount is required'),
  transactionDate: Yup.string().required('Transaction date is required'),
  bankName: Yup.string().required('Bank name is required'),
  ifscCode: Yup.string().required('IFSC code is required'),
  transactionNumber: Yup.string().required('Transaction number is required'),
  confirmTransactionNumber: Yup.string()
    .required('Confirm transaction number is required')
    .oneOf([Yup.ref('transactionNumber')], 'Transaction numbers do not match'),
});

export default function PaymentDialog({
  open,
  onClose,
  totalAmount,
  exhibitorFormDetailId,
  email,
  reFetchFormData,
}: Props) {
  const { createPayment } = useCreatePayment();
  const { verifyPayment } = useVerifyPayment();
  const { enqueueSnackbar } = useSnackbar();
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [onlinePaymentLoading, setOnlinePaymentLoading] = useState(false);
  const { Razorpay } = useRazorpay();
  console.log('Total Amount: ', totalAmount);
  console.log('Exhibitor Form Detail ID: ', exhibitorFormDetailId);

  const completePayment = async (response: any) => {
    const payload = {
      signature: response.razorpay_signature,
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
    };

    try {
      const res = await verifyPayment(payload);
      if (res?.status === 'success') {
        enqueueSnackbar('Payment was successful.', { variant: 'success' });
        reFetchFormData?.();
        onClose();
      } else {
        enqueueSnackbar(`${res?.response?.data?.message || 'Payment submission failed '}`, {
          variant: 'error',
        });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`${error?.message || 'Payment submission failed '}`, { variant: 'error' });
    } finally {
      setOnlinePaymentLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    setOnlinePaymentLoading(true);
    const payload = {
      exhibitorFormDetailId,
      amount: totalAmount,
      paymentOption: 'online',
    };

    console.log('Payload for online payment: ', payload);

    const res = await createPayment(payload);

    if (res?.status !== 'success') {
      enqueueSnackbar(`${res?.response?.data?.message || 'Payment submission failed '}`, {
        variant: 'error',
      });
      setOnlinePaymentLoading(false);
      return;
    }

    const orderId = res?.data?.orderId;

    console.log('Order ID:', orderId);

    const options = {
      key: 'rzp_live_GHhmgYt95hvTQp',
      amount: Number(totalAmount?.toFixed(2)) * 100,
      currency: 'INR',
      name: 'India Expo Mart Limited',
      description: 'UP International Trade Show Registration',
      order_id: orderId,
      handler: (response: any) => {
        console.log(response);
        completePayment(response);
      },
      prefill: {
        email,
      },
      theme: {
        color: '#FF4421',
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
    setOnlinePaymentLoading(false);
  };

  const defaultValues = useMemo(
    () => ({
      paymentMethod: '',
      finalAmount: totalAmount,
      transactionDate: '',
      bankName: '',
      ifscCode: '',
      transactionNumber: '',
      confirmTransactionNumber: '',
    }),
    [totalAmount]
  );

  const methods = useForm({
    resolver: yupResolver(offlinePaymentSchema),
    mode: 'onChange',
    defaultValues,
    values: defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      exhibitorFormDetailId,
      orderId: data.transactionNumber,
      paymentMethod: data.paymentMethod,
      transactionDate: data.transactionDate,
      bankName: data.bankName,
      ifscCode: data.ifscCode,
      amount: data.finalAmount,
      paymentOption: 'offline',
    };

    try {
      const response = await createPayment(payload);
      if (response?.status === 'success') {
        enqueueSnackbar('Payment submitted successfully', { variant: 'success' });
        reFetchFormData?.();
        onClose();
      } else {
        enqueueSnackbar(`${response?.response?.data?.message || 'Payment submission failed '}`, {
          variant: 'error',
        });
      }
      console.log('Response for offline order:', response);
    } catch (error) {
      console.error('Error for offline order:', error);
      enqueueSnackbar(`${error?.message || 'Payment submission failed '}`, { variant: 'error' });
    }
  });

  const renderContent = (
    <Stack
      spacing={1}
      sx={{
        // m: 'auto',
        // maxWidth: 580,
        // bgcolor: '#4208861A',
        // textAlign: 'center',
        p: { xs: 2, md: 4 },
        borderRadius: 2,
      }}
    >
      <Scrollbar>
        <Typography variant="h4">How would you like to Pay?</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Stack spacing={1} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
            <Typography variant="h5">Option 1: Pay Online</Typography>
            <Typography variant="body1">
              Use UPI, debit/credit card, or net banking, get instant confirmation.
            </Typography>
            <Stack spacing={1} direction="row" alignItems="center">
              <TextField label="Amount" value={totalAmount} fullWidth disabled />
              <LoadingButton
                variant="contained"
                size="large"
                sx={{ whiteSpace: 'nowrap' }}
                onClick={() => handleOnlinePayment()}
                loading={onlinePaymentLoading}
              >
                Pay Online
              </LoadingButton>
            </Stack>
          </Stack>
          <Stack spacing={2} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => setShowOfflineForm(!showOfflineForm)}
              sx={{ cursor: 'pointer' }}
            >
              <Box>
                <Typography variant="h5">Option 2: Pay Offline</Typography>
                <Typography variant="body1">
                  Submit details of your manual payment (bank transfer, cheque, etc.)
                </Typography>
              </Box>
              <IconButton
                sx={{
                  transform: showOfflineForm ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <Iconify icon="eva:arrow-down-fill" />
              </IconButton>
            </Stack>

            <Collapse in={showOfflineForm}>
              <FormProvider methods={methods} onSubmit={onSubmit}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="ifscCode" label="IFSC Code" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="bankName" label="Bank Name" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFSelect name="paymentMethod" label="Payment method">
                      {paymentMethodOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Transaction Date"
                        name="transactionDate"
                        format="DD-MM-YYYY"
                        onChange={(date) =>
                          setValue('transactionDate', date ? date.format('YYYY-MM-DD') : '')
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                        // maxDate={dayjs()}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="transactionNumber" label="Transaction Number" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="confirmTransactionNumber"
                      label="Confirm Transaction Number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="finalAmount" label="Amount" disabled />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                        Submit
                      </LoadingButton>
                    </Stack>
                  </Grid>
                </Grid>
              </FormProvider>
            </Collapse>
          </Stack>
        </Stack>
      </Scrollbar>
    </Stack>
  );

  return (
    <Dialog
      fullWidth
      fullScreen
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'background.neutral',
          px: 4,
          py: 4,
        },
        py: { xs: 2, md: 10 },
        px: { xs: 2, md: 20 },
      }}
    >
      {renderContent}
    </Dialog>
  );
}
