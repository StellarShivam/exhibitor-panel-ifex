'use client';

import { useMemo, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { Country, State } from 'country-state-city';
import type { ICountry, IState } from 'country-state-city';

import Iconify from 'src/components/iconify';

import {
  IExhibitorDirectoryFilters,
  IProductGroup,
  useGetProductGroups,
} from 'src/api/exhibitor-directory';
import { useExhibitorCountries } from 'src/hooks/use-exhibitor-countries';
import { productGroupsAndCategories } from 'src/assets/data/productCategories';
import { useBuyerForm, useExhibitorForm } from 'src/api/form';

// ----------------------------------------------------------------------

type Props = {
  filters: IExhibitorDirectoryFilters;
  onFilters: (name: keyof IExhibitorDirectoryFilters, value: string) => void;
  onResetFilters: VoidFunction;
  canReset: boolean;
  activeTab: string;
};

export default function ExhibitorDirectoryTableToolbar({
  filters,
  onFilters,
  onResetFilters,
  canReset,
  activeTab
}: Props) {
  const { productGroups, productGroupsLoading } = useGetProductGroups();

  const {exhibitorForm: buyerForm} = useBuyerForm();

  const selectedProductGroups = useMemo(() => {
    if (!buyerForm?.formData?.productGroups) return [];
    const selectedIds = buyerForm.formData.productGroups.map((pg) => String(pg.productGroupId));
    return productGroups.filter((pg) => selectedIds.includes(String(pg.id)));
  }, [buyerForm, productGroups]);

  // ── Product Group / Category data ─────────────────────────────────────

  const selectedGroup: IProductGroup | null =
    productGroups.find((g) => String(g.id) === filters.productGroupId) ?? null;

  const categoryOptions =
    selectedGroup && selectedGroup.name in productGroupsAndCategories
      ? productGroupsAndCategories[
          selectedGroup.name as keyof typeof productGroupsAndCategories
        ]
      : [];

  const selectedCategory = categoryOptions.find((c) => c.value === filters.category) ?? null;

  // ── Country / State / City data ────────────────────────────────────────

  const { countries: dbCountries, states: dbStates } = useExhibitorCountries(productGroupsLoading ? '' : filters.productGroupId, filters.country);

  const allCountries = useMemo(() => {
    const master = Country.getAllCountries();
    if (dbCountries && dbCountries.length > 0) {
      return master.filter((c) => dbCountries.some((d) => d.name === c.name));
    }
    return master;
  }, [dbCountries]);

  const selectedCountry: ICountry | null = useMemo(
    () => allCountries.find((c) => c.name === filters.country) ?? null,
    [allCountries, filters.country]
  );

  const stateOptions: IState[] = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []),
    [selectedCountry]
  );

  const selectedState: IState | null = useMemo(
    () => stateOptions.find((s) => s.name === filters.state) ?? null,
    [stateOptions, filters.state]
  );

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleFilterCountry = useCallback(
    (_: React.SyntheticEvent, newValue: ICountry | null) => {
      onFilters('country', newValue?.name ?? '');
      onFilters('state', '');
    },
    [onFilters]
  );

  const handleFilterState = useCallback(
    (_: React.SyntheticEvent, newValue: IState | null) => {
      onFilters('state', newValue?.name ?? '');
      // clear city was removed previously but keeping empty no-op
    },
    [onFilters]
  );

  const handleFilterSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('search', e.target.value);
    },
    [onFilters]
  );


  const handleFilterProductGroup = useCallback(
    (_: React.SyntheticEvent, newValue: IProductGroup | null) => {
      onFilters('productGroupId', newValue ? String(newValue.id) : '');
      onFilters('category', '');
    },
    [onFilters]
  );

  const handleFilterCategory = useCallback(
    (_: React.SyntheticEvent, newValue: { label: string; value: string } | null) => {
      onFilters('category', newValue ? newValue.value : '');
    },
    [onFilters]
  );

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 }, pb: 0 }}
      >
        {/* Product Group — fetched from API */}
        <Autocomplete
          fullWidth
          options={activeTab === 'matchmaking' ? selectedProductGroups : productGroups}
          getOptionLabel={(option) => option.name}
          value={selectedGroup}
          onChange={handleFilterProductGroup}
          loading={productGroupsLoading}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product Group"
              placeholder="Select product group"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {productGroupsLoading ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {/* Category — disabled until a group is selected */}
        {
          selectedGroup &&
          <Autocomplete
            fullWidth
            options={categoryOptions}
            getOptionLabel={(option) => option.label}
            value={selectedCategory}
            onChange={handleFilterCategory}
            disabled={!filters.productGroupId || categoryOptions.length === 0}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            noOptionsText={
              !filters.productGroupId ? 'Select a product group first' : 'No categories available'
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                placeholder={
                  filters.productGroupId ? 'Select category' : 'Select a product group first'
                }
              />
            )}
          />
        }

        {/* Country */}
        <Autocomplete
          fullWidth
          options={allCountries}
          getOptionLabel={(option) => option.name}
          value={selectedCountry}
          onChange={handleFilterCountry}
          isOptionEqualToValue={(option, value) => option.isoCode === value.isoCode}
          renderInput={(params) => (
            <TextField {...params} label="Country" placeholder="Select country" />
          )}
        />

        {/* State — disabled until country is selected */}
        <Autocomplete
          fullWidth
          options={stateOptions}
          getOptionLabel={(option) => option.name}
          value={selectedState}
          onChange={handleFilterState}
          disabled={!selectedCountry}
          isOptionEqualToValue={(option, value) => option.isoCode === value.isoCode}
          noOptionsText={!selectedCountry ? 'Select a country first' : 'No states available'}
          renderInput={(params) => (
            <TextField
              {...params}
              label="State"
              placeholder={!selectedCountry ? 'Select a country first' : 'Select state'}
            />
          )}
        />

        {canReset && (
          <Button
            color="error"
            sx={{ flexShrink: 0 }}
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )}
      </Stack>
      {/* second row for search */}
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <TextField
          fullWidth
          label="Search"
          placeholder="Search exhibitors"
          value={filters.search || ''}
          onChange={handleFilterSearch}
        />
      </Stack>
    </>
  );
}
