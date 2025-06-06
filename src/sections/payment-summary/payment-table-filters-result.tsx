import { Chip } from '@mui/material';
import React from 'react';
import { FiltersResult, FiltersBlock } from 'src/components/filters-result';
import { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { Theme, SxProps } from '@mui/material/styles';
import { IPaymentSummaryTableFilters } from 'src/types/payment-summary';

type Props = {
  filters: UseSetStateReturn<IPaymentSummaryTableFilters>;
  totalResults: number;
  sx?: SxProps<Theme>;
};

export function PaymentSummaryTableFiltersResult({ filters, totalResults, sx }: Props) {

  const defaultFilters: IPaymentSummaryTableFilters =
  {
    status: 'All',
    paymentOption: '',
    paymentMethod: '',
    paymentReferenceNumber: '',
  }

  return (
    !filters.state || Object.keys(filters.state).length === 0 || JSON.stringify(filters.state) === JSON.stringify(defaultFilters)
      ? null
      :
      <FiltersResult totalResults={totalResults} onReset={() => {
        filters.setState({
          status: filters.state.status,
          paymentOption: '',
          paymentMethod: '',
          paymentReferenceNumber: '',
        })
      }} sx={sx}>
        <FiltersBlock label="Payment Mode" isShow={!!filters.state.paymentOption}>
          <Chip label={filters.state.paymentOption?.toLowerCase().includes('ppd') ? 'Online' : 'Offline'} onDelete={() => filters.setState({ paymentOption: '' })} />
        </FiltersBlock>
        <FiltersBlock label="Payment Method" isShow={!!filters.state.paymentMethod}>
          <Chip
            label={
              filters.state.paymentMethod === 'null'
                ? 'Pre-Paid'
                : filters.state.paymentMethod?.toLowerCase().includes('cheque')
                  ? 'Cheque'
                  : filters.state.paymentMethod?.toLowerCase().includes('upi')
                    ? 'UPI'
                    : filters.state.paymentMethod?.toLowerCase().includes('neft / rtds')
                      ? 'NEFT/RTDS'
                      : filters.state.paymentMethod?.toLowerCase().includes('demand_draft')
                        ? 'Demand Draft'
                        : filters.state.paymentMethod
            }
            onDelete={() => filters.setState({ paymentMethod: '' })}
          />
        </FiltersBlock>
        <FiltersBlock label="payment Reference Number" isShow={!!filters.state.paymentReferenceNumber}>
          <Chip label={filters.state.paymentReferenceNumber} onDelete={() => filters.setState({ paymentReferenceNumber: '' })} />
        </FiltersBlock>
      </FiltersResult>
  );
}
