import { CheckoutView } from 'src/sections/checkout/view';

import { ProductOrdersListView } from 'src/sections/production-requirements/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Orders',
};

export default function CheckoutPage() {
  return <ProductOrdersListView />;
}
