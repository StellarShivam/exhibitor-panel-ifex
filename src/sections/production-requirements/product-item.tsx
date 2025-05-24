import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
// import { ColorPreview } from 'src/components/color-utils';

import { IProductItem } from 'src/types/production-requirements';

import { useAddToCart, useGetCart } from 'src/api/production-requirements';
import { useEventContext } from 'src/components/event-context';
import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

type Props = {
  product: IProductItem;
};

export default function ProductItem({ product }: Props) {
  const checkout = useCheckoutContext();
  const { eventData } = useEventContext();
  const { addToCart } = useAddToCart();
  const { cart, reFetchCart } = useGetCart(eventData?.state.eventId);
  const {
    skuId,
    productName,
    skuImage,
    price,
    description,
    status,
    category,
    subCategory,
    productImages,
    size,
    color,
    gsn,
  } = product;

  const isAvailable = status === 'ACTIVE';

  const isInCart = cart?.some((item) => item.skuId === skuId);

  const handleAddCart = async () => {
    try {
      const payload = {
        eventId: eventData?.state.eventId,
        skuId,
        price,
      };
      await addToCart(payload);

      reFetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     spacing={1}
  //     sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
  //   >
  //     {newLabel.enabled && (
  //       <Label variant="filled" color="info">
  //         {newLabel.content}
  //       </Label>
  //     )}
  //     {saleLabel.enabled && (
  //       <Label variant="filled" color="error">
  //         {saleLabel.content}
  //       </Label>
  //     )}
  //   </Stack>
  // );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {/* {!!available && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )} */}

      <Tooltip title={!isAvailable && 'Out of stock'} placement="bottom-end">
        <Image
          alt={productName}
          src={skuImage || (productImages && productImages[0])}
          ratio="16/9"
          sx={{
            borderRadius: 1.5,
            ...(!isAvailable && {
              opacity: 0.48,
              filter: 'grayscale(1)',
            }),
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2} sx={{ p: 2.5 }}>
      <Link
        // component={RouterLink}
        // href={linkTo}
        color="inherit"
        variant="subtitle2"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {productName}
      </Link>

      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between">
          <Box
            component="span"
            sx={{ color: 'primary.main', typography: 'subtitle1', fontWeight: 600 }}
          >
            {fCurrency(price)}
          </Box>
          <Box
            component="button"
            onClick={handleAddCart}
            disabled={!isAvailable || isInCart}
            sx={{
              p: '6px 10px',
              height: 35,
              minWidth: 100,
              bgcolor: isInCart ? 'action.disabledBackground' : 'common.black',
              border: 'none',
              borderRadius: 1,
              color: isInCart ? 'action.disabled' : 'common.white',
              cursor: isInCart ? 'default' : 'pointer',
              typography: 'button',
              transition: (theme) =>
                theme.transitions.create('all', {
                  duration: theme.transitions.duration.shorter,
                }),
              '&:hover': {
                bgcolor: isInCart ? 'action.disabledBackground' : '#E0E0E0',
                color: isInCart ? 'action.disabled' : 'common.black',
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
              alignSelf: 'flex-start',
            }}
          >
            {isInCart ? 'Added to Cart' : 'Add to cart'}
          </Box>
        </Stack>
        {(color || size) && (
          <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
            {color && `${color}`} {size && `• Size ${size}`}
          </Box>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Card>
      {/* {renderLabels} */}

      {renderImg}

      {renderContent}
    </Card>
  );
}
