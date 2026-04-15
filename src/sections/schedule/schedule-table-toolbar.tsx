import { SyntheticEvent, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from '@mui/material/Autocomplete';

import { format } from 'date-fns';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IBookedSlot } from 'src/types/buyer/meetings';
import { IScheduleTableFilters, IScheduleTableFilterValue } from 'src/types/buyer/schedule';

// ----------------------------------------------------------------------

type Props = {
  filters: IScheduleTableFilters;
  onFilters: (name: string, value: IScheduleTableFilterValue) => void;
  //
  dateError: boolean;
  serviceOptions: string[];
  tableData: IBookedSlot[];
};

export default function ScheduleTableToolbar({
  filters,
  onFilters,
  //
  dateError,
  serviceOptions,
  tableData,
}: Props) {
  const popover = usePopover();

  // Extract unique dates from tableData
  const uniqueDates = Array.from(
    new Set(
      tableData.map((item) => {
        const date = new Date(item.startTime);
        return format(date, 'yyyy-MM-dd');
      })
    )
  ).sort();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterCountry = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('country', event.target.value);
    },
    [onFilters]
  );

  const handleFilterMeetingDate = useCallback(
    (
      event: SyntheticEvent<Element, Event>,
      value: string | string[] | null,
      reason: AutocompleteChangeReason,
      details?: AutocompleteChangeDetails<string>
    ) => {
      // Handle both single and multiple values
      const singleValue = Array.isArray(value) ? value[0] || '' : value || '';
      onFilters('meetingDate', singleValue);
    },
    [onFilters]
  );

  // const handleFilterEndDate = useCallback(
  //   (newValue: Date | null) => {
  //     onFilters('endDate', newValue);
  //   },
  //   [onFilters]
  // );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Autocomplete
          fullWidth
          value={filters.meetingDate || null}
          onChange={handleFilterMeetingDate}
          options={uniqueDates}
          getOptionLabel={(option) => format(new Date(option), 'MMM dd, yyyy')}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {format(new Date(option), 'MMM dd, yyyy')}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Meeting Date" placeholder="Select meeting date" />
          )}
        />

        {/* <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.country}
            onChange={handleFilterCountry}
            placeholder="Search country..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack> */}

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search exhibitor..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}
