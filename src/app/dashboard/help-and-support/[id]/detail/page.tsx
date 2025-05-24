import axios, { endpoints } from 'src/utils/axios';
import { TicketDetailsView } from 'src/sections/help-and-support/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Ticket Details',
};

type Props = {
  params: {
    id: string;
  };
};

// export async function generateStaticParams() {
//   // Temporarily return hardcoded IDs
//   return [
//     { id: '1' },
//     { id: '2' },
//     { id: '3' },
//   ];
// }

export default function TicketDetailsPage({ params }: Props) {
  const { id } = params;

  return <TicketDetailsView id={id} />;
}


