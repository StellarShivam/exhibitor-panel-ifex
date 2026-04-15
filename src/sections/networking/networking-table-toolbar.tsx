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
import Box from '@mui/material/Box';

import { format } from 'date-fns';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

interface NetworkingUser {
  userCohort: string;
  firstName: string;
  lastName: string;
  email: string;
  eventId: number;
  exhibitorId: number | null;
  eventMemberId: number | null;
  recommendedScore: number | null;
  bookmark: boolean;
  walletId: string | null;
  companyName: string;
  designation: string;
  profileUrl: string;
  data: any;
  recommendedReason: string | null;
  hallNo: string | null;
  stallNo: string | null;
  agendas: any | null;
  bio: string;
}

interface NetworkingTableFilters extends Record<string, string | number | boolean> {
  name: string;
  country: string;
  userCohort: string;
  companyName: string;
}

// ----------------------------------------------------------------------

type Props = {
  filters: NetworkingTableFilters;
  onFilters: (name: string, value: string) => void;
  tableData: NetworkingUser[];
};

export default function NetworkingTableToolbar({ filters, onFilters, tableData }: Props) {
  const popover = usePopover();

  const USER_TYPES = [
    { label: 'All', value: 'all' },
    { label: 'Exhibitor', value: 'EXHIBITOR' },
    { label: 'Visitor', value: 'VISITOR' },
    // { label: 'Buyer', value: 'BUYER' },
  ];

  const uniqueCompanies = Array.from(
    new Set(tableData.map((item) => item.companyName).filter(Boolean))
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

  const handleFilterUserType = useCallback(
    (event: SyntheticEvent, newValue: string) => {
      onFilters('userCohort', newValue);
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
        {/* <Autocomplete
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
        /> */}

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
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <Box sx={{ px: 2.5, pb: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Box
            component="span"
            sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}
          >
            Users Types
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 0,
            backgroundColor: 'background.paper',
            borderRadius: 1,
            p: 0.5,
            width: '100%',
            border: '1px solid #e0e0e0',
          }}
        >
          {USER_TYPES.map((type, index) => (
            <Box
              key={type.value}
              onClick={() => handleFilterUserType({} as SyntheticEvent, type.value)}
              sx={{
                flex: 1,
                textAlign: 'center',
                py: 1.5,
                px: 2,
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 0.5,
                transition: 'all 0.2s ease-in-out',
                backgroundColor:
                  (filters.userCohort || 'all') === type.value
                    ? 'background.neutral'
                    : 'transparent',
                color:
                  (filters.userCohort || 'all') === type.value ? 'text.primary' : 'text.secondary',
                boxShadow:
                  (filters.userCohort || 'all') === type.value
                    ? '0 1px 3px rgba(0,0,0,0.12)'
                    : 'none',
                '&:hover': {
                  backgroundColor:
                    (filters.userCohort || 'all') === type.value ? '#fff' : 'background.neutral',
                },
                ...(index === 0 && {
                  borderTopLeftRadius: 0.5,
                  borderBottomLeftRadius: 0.5,
                }),
                ...(index === USER_TYPES.length - 1 && {
                  borderTopRightRadius: 0.5,
                  borderBottomRightRadius: 0.5,
                }),
              }}
            >
              {type.label}
            </Box>
          ))}
        </Box>
      </Box>

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
