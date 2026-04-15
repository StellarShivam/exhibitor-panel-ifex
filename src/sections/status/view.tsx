'use client';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Image from 'next/image';
import { useEventContext } from 'src/components/event-context';
import { useRouter } from 'src/routes/hooks';
import { useGetTeamMembersCount } from 'src/api/overview';
import { useGetEventList1 } from 'src/api/event';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSettingsContext } from 'src/components/settings';
import PaymentSummaryListView from '../payment-summary/view/payment-list-view';
import { usePaymentByExhibitorID } from 'src/api/payment-summary';
import { BASE_URL } from 'src/config-global';

// ----------------------------------------------------------------------
type Props = {
  id: string;
};

export default function StatusView() {
  const settings = useSettingsContext();
  const { eventData } = useEventContext();
  const router = useRouter();
  const { events, reFetchEventList } = useGetEventList1();
  const { exhibitor } = useGetTeamMembersCount(eventData?.state?.exhibitorId);
  const { payment } = usePaymentByExhibitorID(eventData?.state?.exhibitorId);
  const [exhibitorDetails, setExhibitorDetails] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [gstAmount, setGstAmount] = useState(0); // State for GST amount
  const [totalPrice, setTotalPrice] = useState(0);
  console.log('PAYMENT LIST PLEASE AAJA', payment);
  const [postGstPrice, setPostGstPrice] = useState(0);
  const [tdsAmout, setTdsAmount] = useState<number>();

  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const paid = (payment?.paymentTransactions ?? []).reduce(
      (sum, transaction) =>
        transaction?.paymentStatus?.toLowerCase().includes('captured') ||
        transaction?.paymentStatus?.toLowerCase().includes('approved')
          ? sum + Number(transaction.finalAmount || 0)
          : sum,
      0
    );

    const isApprove = paid >= payment?.paymentData?.totalAmount;
    setIsApproved(isApprove);
  }, [payment?.paymentTransactions]);

  useEffect(() => {
    const updateEventContext = async () => {
      // await reFetchEventList();
      const updatedEvent = events.find((event) => event.eventId === eventData.state.eventId);
      console.log('Updated Event:', updatedEvent);

      if (updatedEvent) {
        console.log('Updated Event:', updatedEvent);
        eventData.setState(updatedEvent);
      }
    };
    updateEventContext();
  }, [events]);

  useEffect(() => {
    console.log('Inithjg');
    const getExhibitorDetails = async () => {
      const res = await axios.get(
        BASE_URL +
          '/pub/exhibitorDetails/' +
          exhibitor.supportEmail +
          '?eventId=' +
          exhibitor.eventId
      );

      console.log(res.data.data);
      setExhibitorDetails(res.data.data as any); // Use the interface
    };

    const getTrasactionHistory = async () => {
      const res = await axios.get(
        BASE_URL +
          '/pub/userPaymentDetails?email=' +
          exhibitor.supportEmail +
          '&eventId=' +
          exhibitor.eventId
      );
      console.log(res.data.data);
      setTransactions(res.data.data as any); // Use the interface
    };

    getExhibitorDetails();
    getTrasactionHistory();
  }, [exhibitor.supportEmail]);

  useEffect(() => {
    const amount = Number(exhibitorDetails?.amount || 0);
    let tds = Number(transactions?.tds);

    // Check if `tds` is a valid number
    if (isNaN(tds)) {
      console.warn('Invalid TDS value:', transactions?.tds);
      tds = 0; // Default to 0 if invalid
    }

    const gst = amount * 0.18; // Calculate 18% GST
    const postGst = amount + gst; // Add GST to the base amount
    const tdsValue = (amount * tds) / 100; // Calculate TDS value
    const postTdsAmount = postGst - tdsValue; // Subtract TDS from post-GST amoun

    // console.log("Exhibitor Data************",exhibitor)

    setTotalPrice(amount);
    setGstAmount(gst);
    setPostGstPrice(postTdsAmount);
    setTdsAmount(tdsValue);

    console.log('Total Price: ', amount);
    console.log('Post GST Price: ', postGst);
    console.log('GST Amount: ', gst);
  }, [exhibitorDetails, transactions]);

  const userName = eventData.state.fullName;
  const status = eventData.state.status;

  console.log('ojihugfhj', eventData.state.status);

  function formatCurrency(amount: number, currency: string = 'INR'): string {
    console.log('Formatted Amount: ', amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount || 0);
  }

  const isCompleted = status === 'COMPLETED';
  const isToBeApproved = status === 'TO_BE_APPROVED';

  // --- Installment-based flow logic start ---
  const { installments = [], currentDate, paymentStatus } = eventData.state || {};
  // const status = eventData.state.status;

  // Sort installments by dueDate ascending
  const sortedInstallments = [...(installments || [])].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Find the nearest installment whose dueDate is <= currentDate
  const now = new Date(currentDate);
  const nearestInstallmentIdx = sortedInstallments.findIndex(
    (inst) => new Date(inst.dueDate).getTime() <= now.getTime()
  );
  const nearestInstallment =
    nearestInstallmentIdx !== -1
      ? sortedInstallments[nearestInstallmentIdx]
      : sortedInstallments[0];

  // Find all installmentTypes from nearestInstallment onwards (including higher)
  const allowedInstallmentTypes = sortedInstallments
    .slice(nearestInstallmentIdx)
    .map((inst) => inst.installmentType);

  // If status is approved, or matches nearestInstallment or any higher, skip this screen
  // const isApproved =
  //   status === 'APPROVED' ||
  //   status === 'AUTO_APPROVED' ||
  //   (allowedInstallmentTypes && allowedInstallmentTypes.includes(status));

  if (isApproved) {
    router.push(`/dashboard`);
    return null;
  }

  // Check if current date >= nearest installment's due date
  const isDeadlineReached =
    nearestInstallment && new Date(nearestInstallment.dueDate).getTime() <= now.getTime();

  // If deadline is reached, show payment screen logic
  if (isDeadlineReached) {
    // Show pay now screen, and if transaction list is not empty, show the table
    const hasTransactions = payment?.paymentTransactions?.length > 0;
    const paymentStatusLower = paymentStatus?.toLowerCase();

    return (
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'transparent',
          }}
        >
          <Box
            sx={{
              width: 600,
              height: 350,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3),
              boxShadow: 0,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 0,
            }}
          >
            <Stack spacing={1.5} sx={{ maxWidth: 480, pl: 4, pr: 2, py: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0, fontSize: 16 }}>
                Welcome{' '}
                <span role="img" aria-label="wave">
                  👋
                </span>
                <br />
                {eventData.state.fullName}
              </Typography>
              <Chip
                label={
                  hasTransactions &&
                  payment?.paymentTransactions[payment?.paymentTransactions.length - 1]
                    ?.paymentStatus === 'pending'
                    ? 'To Be Approved'
                    : 'Registration Complete'
                }
                color={
                  hasTransactions &&
                  payment?.paymentTransactions[payment?.paymentTransactions.length - 1]
                    ?.paymentStatus === 'pending'
                    ? 'secondary'
                    : 'info'
                }
                sx={{ fontWeight: 700, fontSize: 16, px: 1, py: 0.6, width: 'fit-content', mb: 0 }}
              />
              <Typography
                variant="body1"
                sx={{ color: (theme) => theme.palette.primary.dark, mb: 0, fontSize: 13 }}
              >
                {hasTransactions &&
                payment?.paymentTransactions[payment?.paymentTransactions.length - 1]
                  ?.paymentStatus === 'pending'
                  ? `Your payment for this installment has been received and is pending approval from the admin.`
                  : `Thank you for filling out the form, To enable all the functionalities of the Exhibitor Panel, please make a payment of 100% of the total amount.`}
              </Typography>
              {!hasTransactions && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    window.open(
                      'https://register.upinternationaltradeshow.com/payment?email=' +
                        exhibitor?.supportEmail,
                      '_blank'
                    );
                  }}
                  sx={{
                    fontWeight: 700,
                    fontSize: 16,
                    borderRadius: 1.5,
                    width: '100%',
                    mt: 1,
                    backgroundColor: (theme) => theme.palette.primary.main,
                  }}
                >
                  Pay Now
                </Button>
              )}
            </Stack>
            {/* <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <img
                src="/assets/illustration_seo.svg"
                alt="Illustration"
                style={{ maxWidth: 320, width: '100%', height: 'auto' }}
              />
            </Box> */}
          </Box>
        </Box>
        {/* Show payment table if transaction list is not empty */}
        {hasTransactions && <PaymentSummaryListView />}
      </>
    );
  }
  // --- Installment-based flow logic end ---

  let chipLabel: string;
  let chipColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  let messageText: string;

  if (isCompleted) {
    chipLabel = 'Registration Complete';
    chipColor = 'info';
    messageText =
      'Thank you for filling out the form. To enable all the functionalities of the Exhibitor Panel, please make a payment of 100% of the total amount.';
  } else if (isToBeApproved) {
    chipLabel = 'To Be Approved';
    chipColor = 'secondary';
    const pendingTransaction = payment?.paymentTransactions?.find(
      (transaction) => transaction?.paymentStatus?.toLowerCase() === 'pending'
    );
    const paymentAmount = pendingTransaction?.finalAmount || 0;
    messageText = `Your payment of ₹${paymentAmount} has been received. It is currently pending approval from the admin.`;
  } else if (isApproved) {
    chipLabel = 'Approved';
    chipColor = 'success';
    messageText = 'Your registration has been approved.';
    router.push(`/dashboard`);
  } else {
    chipLabel = 'Pending';
    chipColor = 'warning';
    messageText = 'Your status is still pending. To continue, please fill out the required form.';
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          // justifyContent: 'center',
          bgcolor: 'transparent',
        }}
      >
        <Box
          sx={{
            width: 900,
            height: 480,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3),
            boxShadow: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 0,
          }}
        >
          <Stack spacing={1.5} sx={{ maxWidth: 480, pl: 4, pr: 2, py: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0, fontSize: 16 }}>
              Welcome back{' '}
              <span role="img" aria-label="wave">
                👋
              </span>
              <br />
              {/* {userName} */}
            </Typography>
            <Chip
              label={chipLabel}
              color={chipColor}
              sx={{ fontWeight: 700, fontSize: 16, px: 1, py: 0.5, width: 'fit-content', mb: 0 }}
            />
            <Typography
              variant="body1"
              sx={{ color: (theme) => theme.palette.primary.dark, mb: 0, fontSize: 13 }}
            >
              {messageText}
            </Typography>
            {exhibitorDetails?.exhibitorData && status !== 'PENDING' && (
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Selected Booth Details
                </Typography>
                <Stack direction="row" spacing={5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Area: {exhibitorDetails.exhibitorData.totalAreaRequired} sq m
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Booth Type:{' '}
                    {exhibitorDetails.exhibitorData.boothTypePreference === 'space_only'
                      ? 'Bare'
                      : 'Fitted'}
                  </Typography>
                </Stack>
              </Stack>
            )}
            {exhibitorDetails?.exhibitorData && status !== 'PENDING' && (
              <Stack spacing={1} sx={{ mt: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Amount Details
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={5}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Base Fee: {formatCurrency(totalPrice)}
                      </Typography>
                      {exhibitorDetails?.exhibitorData.billingStateProvinceRegion ===
                      'Uttar Pradesh' ? (
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          CGST (9%): {formatCurrency(gstAmount / 2)}
                        </Typography>
                      ) : (
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          IGST (18%): {formatCurrency(gstAmount)}
                        </Typography>
                      )}
                    </Stack>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        TDS (
                        {transactions?.tds === 'nil' ? transactions?.tds : `${transactions?.tds}%`}
                        ): {formatCurrency(tdsAmout || 0)}
                      </Typography>
                      {exhibitorDetails?.exhibitorData.billingStateProvinceRegion ===
                        'Uttar Pradesh' && (
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          SGST (9%): {formatCurrency(gstAmount / 2)}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Total amount post taxes: {formatCurrency(postGstPrice)}
                  </Typography>
                </Stack>
              </Stack>
            )}
            {!isToBeApproved && (
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  if (isCompleted) {
                    // router.push(`/payment/${exhibitor.supportEmail}`);
                    window.open(
                      'https://register.upinternationaltradeshow.com/payment?email=' +
                        exhibitor?.supportEmail,
                      '_blank'
                    );
                  } else {
                    router.push('/registration');
                  }
                }}
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 1.5,
                  width: '100%',
                  mt: 1,
                  backgroundColor: (theme) => theme.palette.primary.main,
                }}
              >
                {isCompleted ? 'Make Payment' : 'Fill Form'}
              </Button>
            )}
          </Stack>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <img
              src="/assets/illustration_seo.svg"
              alt="Illustration"
              style={{ maxWidth: 320, width: '100%', height: 'auto' }}
            />
          </Box>
        </Box>
      </Box>
      {isToBeApproved && (
        <Container
          sx={{
            mt: 4,
            // p: 2,
            // bgcolor: (theme) => alpha(theme.palette.primary.light, 0.1),
            // borderRadius: 2,
            // boxShadow: 0,
          }}
        >
          <PaymentSummaryListView />
        </Container>
      )}
    </>
  );
}
