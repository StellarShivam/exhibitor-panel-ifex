// import OverviewView from 'src/sections/overview/view';
// ----------------------------------------------------------------------

import PaymentSummaryListView from 'src/sections/form-transactions/view/payment-list-view';

export const metadata = {
  title: 'Dashboard: Form Transactions',
};

export default function Page() {
  return <PaymentSummaryListView />;
}
