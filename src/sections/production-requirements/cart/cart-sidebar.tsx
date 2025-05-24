import { useEffect, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';
import { useGetCart, useEmptyCart } from 'src/api/production-requirements';
import { useEventContext } from 'src/components/event-context';
import { useCheckoutContext } from '../../checkout/context';
import CartItem from './cart-item';

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export default function CartSidebar({ open, onClose }: Props) {
  const { eventData } = useEventContext();
  const { cart, reFetchCart, totalAmount } = useGetCart(eventData?.state.eventId);
  const { emptyCart } = useEmptyCart();

  const uniqueCartItems = useMemo(() => {
    if (!cart) return [];

    const uniqueSkuIds = Array.from(new Set(cart.map((item) => item.skuId)));

    return uniqueSkuIds.map((skuId) => cart.find((item) => item.skuId === skuId)!);
  }, [cart]);

  const handleEmptyCart = async () => {
    try {
      await emptyCart(eventData?.state.eventId);
      await reFetchCart();
    } catch (error) {
      console.error('Error emptying cart:', error);
    }
  };

  const renderEmpty = (
    <Box sx={{ py: 10 }}>
      <EmptyContent
        title="Cart is empty"
        description="Looks like you haven't added any items to your cart yet."
        imgUrl="/assets/icons/empty/ic_cart.svg"
        sx={{
          '& span.MuiBox-root': { height: 160 },
        }}
      />
    </Box>
  );

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: 400 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="solar:cart-large-4-bold-duotone" width={24} />
          <Typography variant="h6">Your Cart ({cart?.length || 0})</Typography>
        </Stack>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>

      <Scrollbar>
        {uniqueCartItems.length > 0 ? (
          <Stack spacing={3} sx={{ p: 2.5 }}>
            {uniqueCartItems.map((item) => (
              <CartItem key={item.skuId} item={item} />
            ))}
          </Stack>
        ) : (
          renderEmpty
        )}
      </Scrollbar>

      <Stack spacing={2} sx={{ p: 2.5 }}>
        {uniqueCartItems.length > 0 && (
          <>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1">Subtotal:</Typography>
              <Typography variant="subtitle1" color="primary.main">
                ₹{(totalAmount || 0).toFixed(2)}
              </Typography>
            </Stack>

            <Divider />

            <Button
              size="medium"
              color="error"
              variant="outlined"
              onClick={handleEmptyCart}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            >
              Empty Cart
            </Button>

            <Button
              component={RouterLink}
              href={paths.dashboard.productionRequirements.checkout}
              size="large"
              variant="contained"
              color="warning"
              disabled={!cart?.length}
              onClick={onClose}
            >
              Book Now
            </Button>
          </>
        )}
      </Stack>
    </Drawer>
  );
}
