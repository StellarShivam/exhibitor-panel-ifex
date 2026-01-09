import { Stack, TextField, MenuItem } from '@mui/material';
import React, { useCallback } from 'react';
import { UseSetStateReturn } from 'src/hooks/use-set-state';
import { IPaymentSummaryTableFilters } from 'src/types/payment-summary';

type Props = {
  filters: UseSetStateReturn<IPaymentSummaryTableFilters>;
  onResetPage: () => void;
};

export function PaymentSummaryTableToolbar({ filters, onResetPage }: Props) {
  const handleFilterChange = useCallback(
    (field: keyof IPaymentSummaryTableFilters) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ [field]: event.target.value });
    },
    [filters, onResetPage]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <TextField
        label="Form Name"
        value={filters.state.formName}
        onChange={handleFilterChange('formName')}
        fullWidth
      />
      <TextField
        label="Payment Mode"
        select
        value={filters.state.paymentMode}
        onChange={handleFilterChange('paymentMode')}
        fullWidth
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="online">Online</MenuItem>
        <MenuItem value="offline">Offline</MenuItem>
      </TextField>
      {/* <TextField
        label="Payment Methods"
        select
        value={filters.state.paymentMethod}
        onChange={handleFilterChange('paymentMethod')}
        fullWidth
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="ppd">Pre-Paid</MenuItem>
        <MenuItem value="cheque">Cheque</MenuItem>
        <MenuItem value="upi">UPI</MenuItem>
        <MenuItem value="neft / rtgs">NEFT/RTGS</MenuItem>
        <MenuItem value="demand_draft">Demand Draft</MenuItem>
        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
      </TextField> */}

      <TextField
        label="Payment Reference Number"
        value={filters.state.paymentReferenceNumber}
        onChange={handleFilterChange('paymentReferenceNumber')}
        fullWidth
      />
    </Stack>
  );
}
