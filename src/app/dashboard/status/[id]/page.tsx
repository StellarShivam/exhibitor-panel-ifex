import axios, { endpoints } from 'src/utils/axios';

import StatusView from 'src/sections/status/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Status',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProductEditPage({ params }: Props) {
  const { id } = params;

  console.log(id);

  return <StatusView id={id} />;
}
