import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { createTicket } from 'src/api/help-and-support';
import { ITicketCreateItem } from 'src/types/help-and-support';
import { useEventContext } from 'src/components/event-context';
import IncrementerButton from './common/incrementer-button';

// ----------------------------------------------------------------------

type ItemRequest = {
  id: string;
  name: string;
  quantity: number;
  error?: boolean;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export default function SpecialRequestForm({ open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { eventData } = useEventContext();
  const [items, setItems] = useState<ItemRequest[]>([
    { id: '1', name: '', quantity: 1, error: false },
  ]);

  const handleAddItem = () => {
    const newId = (items.length + 1).toString();
    setItems([...items, { id: newId, name: '', quantity: 1, error: false }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1 || id === '1') return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleNameChange = (id: string, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, name: value, error: false } : item)));
  };

  const handleIncreaseQuantity = (id: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleDecreaseQuantity = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  const validateForm = () => {
    let isValid = true;
    const updatedItems = items.map((item) => {
      if (!item.name.trim()) {
        isValid = false;
        return { ...item, error: true };
      }
      return { ...item, error: false };
    });

    setItems(updatedItems);
    return isValid;
  };

  const generateTableDescription = (requestItems: ItemRequest[]) => {
    const tableRows = requestItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        </tr>`
      )
      .join('');

    return `
      <table>
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f8f9fa;">Item Name</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f8f9fa;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      enqueueSnackbar('Please fill in all item names', { variant: 'error' });
      return;
    }

    try {
      const ticketData: ITicketCreateItem = {
        eventId: eventData?.state.eventId,
        subject: 'SPECIAL REQUEST',
        description: generateTableDescription(items),
      };

      onClose();
      await createTicket(ticketData);

      setItems([{ id: '1', name: '', quantity: 1, error: false }]);

      enqueueSnackbar('Request sent successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar(error.message || 'Error sending request', {
        variant: 'error',
      });
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6">We&apos;ve got you covered!</Typography>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }} onClose={() => {}}>
          If the item you need isn&apos;t listed in our inventory, just let us know and we&apos;re
          happy to help source special items on request.
        </Alert>

        <Stack spacing={3}>
          {items.map((item) => (
            <Stack key={item.id} direction="row" alignItems="center" spacing={2}>
              <TextField
                fullWidth
                required
                placeholder="Item Name"
                value={item.name}
                onChange={(e) => handleNameChange(item.id, e.target.value)}
                error={item.error}
                helperText={item.error ? 'Item name is required' : ''}
              />

              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', minWidth: 'max-content' }}
                >
                  Quantity
                </Typography>

                <IncrementerButton
                  quantity={item.quantity}
                  onIncrease={() => handleIncreaseQuantity(item.id)}
                  onDecrease={() => handleDecreaseQuantity(item.id)}
                  disabledDecrease={item.quantity <= 1}
                />
              </Stack>

              <IconButton
                onClick={() => handleRemoveItem(item.id)}
                sx={{
                  color: 'error.main',
                  '&.Mui-disabled': {
                    color: 'action.disabled',
                  },
                }}
                disabled={item.id === '1'}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Stack>
          ))}
        </Stack>

        <Button
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAddItem}
          sx={{ mt: 3 }}
        >
          Add
        </Button>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: 'success.main',
            '&:hover': {
              bgcolor: 'success.dark',
            },
          }}
        >
          Send Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}
