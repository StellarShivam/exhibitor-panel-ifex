import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import {
  useAddToCart,
  useGetCart,
  useRemoveFromCart,
  useDeleteFromCart,
  useEmptyCart,
} from 'src/api/production-requirements';
import { useEventContext } from 'src/components/event-context';
import Iconify from 'src/components/iconify';
import { IProductCartItem } from 'src/types/production-requirements';
import { useCheckoutContext } from '../../checkout/context';
import IncrementerButton from '../common/incrementer-button';

type Props = {
  item: IProductCartItem;
};

export default function CartItem({ item }: Props) {
  const { eventData } = useEventContext();
  const { addToCart } = useAddToCart();
  const { removeFromCart } = useRemoveFromCart();
  const { deleteFromCart } = useDeleteFromCart();
  const { emptyCart } = useEmptyCart();
  const { cart, reFetchCart } = useGetCart(eventData?.state.eventId);

  const quantity = cart?.filter((cartItem) => cartItem.skuId === item.skuId).length || 0;

  const handleDecrease = async () => {
    try {
      const response = await removeFromCart(eventData?.state.eventId, Number(item.skuId));
      reFetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleIncrease = async () => {
    try {
      const payload = {
        eventId: eventData?.state.eventId,
        skuId: Number(item.skuId),
        price: item.itemPrice,
      };

      const response = await addToCart(payload);
      reFetchCart();
    } catch (error) {
      console.error('Error increasing cart quantity:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await deleteFromCart(eventData?.state.eventId, Number(item.skuId));
      await reFetchCart();
    } catch (error) {
      console.error('Error removing items from cart:', error);
    }
  };

  const truncateName = (name: string) => (name.length > 25 ? `${name.substring(0, 25)}...` : name);

  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        src={item?.skuImage || item?.productImages?.[0]}
        variant="rounded"
        sx={{ width: 80, height: 80 }}
      />

      <Stack spacing={0.5} flex={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" noWrap>
            {truncateName(item.productName)}
          </Typography>
          <IconButton size="small" onClick={handleRemove} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Stack>

        <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
          {item.color && `${item.color}`} {item.size && `• Size ${item.size}`}
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <IncrementerButton
            quantity={quantity}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
            disabledDecrease={quantity === 1}
          />

          <Typography variant="subtitle2">₹{(item.itemPrice * quantity).toFixed(2)}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
