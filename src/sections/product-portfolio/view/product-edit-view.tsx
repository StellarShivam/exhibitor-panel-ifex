'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetProductPortfolio } from 'src/api/product-portfolio';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useEventContext } from 'src/components/event-context';
import { LoadingScreen } from 'src/components/loading-screen';

import ProductNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ProductEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { eventData } = useEventContext();

  const { products, productsLoading } = useGetProductPortfolio(eventData?.state.exhibitorId);

  const currentProduct = products.find((product) => product.id === Number(id));

  console.log(currentProduct);

  if (productsLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Product Portfolio',
            href: paths.dashboard.productPortfolio.root,
          },
          { name: currentProduct?.productName || '' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <ProductNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}
