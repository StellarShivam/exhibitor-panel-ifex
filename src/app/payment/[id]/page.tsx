import axios, { endpoints } from 'src/utils/axios';

import PaymentPage from 'src/sections/registartion-form/Payment';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Payment',
};

type Props = {
  params: {
    id: string;
  };
};

export default function PaymentViewPage({ params }: Props) {
  const { id } = params;

  return <PaymentPage id={id} />;
}
