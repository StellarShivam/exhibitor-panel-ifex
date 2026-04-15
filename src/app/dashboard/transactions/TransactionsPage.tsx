'use client';

import { useEventContext } from 'src/components/event-context';
import PaymentSummaryListView from 'src/sections/payment-summary/view/payment-list-view';
import SponsorPaymentSummaryListView from 'src/sections/sponsor/overview/payment-summary/view/payment-list-view';



export default function TransactionsPage() {
  const { eventData } = useEventContext();

  return <PaymentSummaryListView />;
}
