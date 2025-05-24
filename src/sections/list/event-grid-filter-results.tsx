import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import { IEventGridFilters } from 'src/types/event';
// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IEventGridFilters>;
};

export function EventGridFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
  const handleRemovekind = useCallback(() => {
    onResetPage();
    filters.setState({ kind: 'ALL' });
  }, [filters, onResetPage]);

  const handleRemoveSearch = useCallback(() => {
    onResetPage();
    filters.setState({ searchTerm: '' });
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Status:" isShow={filters.state.status !== 'ALL'}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={() => {
            onResetPage();
            filters.setState({ status: 'ALL' });
          }}
          sx={{ textTransform: 'capitalize', color: 'black' }}
        />
      </FiltersBlock>

      <FiltersBlock label="kind:" isShow={filters.state.kind !== 'ALL'}>
        <Chip
          {...chipProps}
          label={filters.state.kind}
          onDelete={handleRemovekind}
          sx={{ textTransform: 'capitalize', color: 'black' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Search:" isShow={!!filters.state.searchTerm}>
        <Chip
          {...chipProps}
          label={filters.state.searchTerm}
          onDelete={handleRemoveSearch}
          sx={{ backdrop: 'black' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Date Range:" isShow={filters.state.startDate !== 'ALL'}>
        <Chip
          {...chipProps}
          label={filters.state.startDate + ' - ' + filters.state.endDate}
          onDelete={() => {
            onResetPage();
            filters.setState({ startDate: 'ALL' });
            filters.setState({ endDate: 'ALL' });
          }}
          sx={{ textTransform: 'capitalize', color: 'black' }}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
