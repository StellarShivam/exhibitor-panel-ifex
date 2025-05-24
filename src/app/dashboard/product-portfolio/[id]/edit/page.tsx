import axios, { endpoints } from 'src/utils/axios';

import { ProductEditView } from 'src/sections/product-portfolio/view/index';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProductEditPage({ params }: Props) {
  const { id } = params;

  return <ProductEditView id={id} />;
}

// export async function generateStaticParams() {
//   // Temporarily return hardcoded IDs
//   return [
//     { id: '1' },
//     { id: '2' },
//     { id: '3' },
//   ];
// }