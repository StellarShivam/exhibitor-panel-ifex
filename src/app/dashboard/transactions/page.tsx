// import OverviewView from 'src/sections/overview/view';
// ----------------------------------------------------------------------

import PaymentSummaryListView from "src/sections/payment-summary/view/payment-list-view";

export const metadata = {
  title: 'Dashboard: Transactions',
};

export default function Page() {
  return <PaymentSummaryListView />;
}
