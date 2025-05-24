// import React, { useCallback } from 'react';
// import {
//   Stack,
//   TextField,
//   InputAdornment,
//   Select,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   OutlinedInput,
//   SelectChangeEvent,
//   Box,
// } from '@mui/material';
// import Iconify from 'src/components/iconify';
// // import { DateRangePicker } from '@mui/x-date-pickers-pro';
// import type { UseSetStateReturn } from 'src/hooks/use-set-state';
// import { IEventGridFilters } from 'src/types/event';
// // import { useGetEventTypesList } from 'src/api/event-types';

// type Props = {
//   onResetPage: () => void;
//   filters: UseSetStateReturn<IEventGridFilters>;
//   options: {};
// };

// export function EventGridToolBar({ filters, options, onResetPage }: Props) {
//   // const { eventType } = useGetEventTypesList();

//   const handleFilterNameAddress = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       onResetPage();
//       filters.setState({ searchTerm: event.target.value });
//     },
//     [filters, onResetPage]
//   );

//   // const handleFilterStatus = useCallback(
//   //   (event: SelectChangeEvent) => {
//   //     onResetPage();
//   //     filters.setState({ status: event.target.value });
//   //   },
//   //   [filters, onResetPage]
//   // );

//   // const handleDateRangeChange = (newValue: [Date | null, Date | null]) => {
//   //   onResetPage();
//   //   filters.setState({
//   //     startDate: newValue[0] ? newValue[0].toISOString() : 'ALL',
//   //     endDate: newValue[1] ? newValue[1].toISOString() : 'ALL',
//   //   });
//   // };

//   // const handleFilterKind = useCallback(
//   //   (event: SelectChangeEvent) => {
//   //     onResetPage();
//   //     filters.setState({ kind: event.target.value });
//   //   },
//   //   [filters, onResetPage]
//   // );

//   return (
//     <Stack
//       spacing={2}
//       alignItems={{ xs: 'flex-end', md: 'center' }}
//       direction={{ xs: 'column', md: 'row' }}
//       sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
//     >
//       {/* <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
//         <InputLabel htmlFor="events-filter-status-select-label">Status</InputLabel>
//         <Select
//           value={filters.state.status}
//           onChange={handleFilterStatus}
//           input={<OutlinedInput label="Status" />}
//           fullWidth
//         >
//           <MenuItem value="ALL">ALL</MenuItem>
//           <MenuItem value="LIVE">Live</MenuItem>
//           <MenuItem value="DRAFT">Draft</MenuItem>
//           <MenuItem value="CLOSED">CLOSED</MenuItem>
//         </Select>
//       </FormControl> */}
//       {/* <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
//         <InputLabel htmlFor="events-filter-kind-select-label">Event Kind</InputLabel>
//         <Select
//           value={filters.state.kind}
//           onChange={handleFilterKind}
//           input={<OutlinedInput label="Event Kind" />}
//           fullWidth
//         >
//           <MenuItem value="ALL">ALL</MenuItem>
//           {eventType.map((option: any) => (
//             <MenuItem key={option.id} value={option.name}>
//               {option.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl> */}
//       {/* <DateRangePicker
//         //   startText="Start Date"
//         //   endText="End Date"
//         value={[
//           filters.state.startDate !== 'ALL' ? new Date(filters.state.startDate) : null,
//           filters.state.endDate !== 'ALL' ? new Date(filters.state.endDate) : null,
//         ]}
//         onChange={handleDateRangeChange}
//         slots={{
//           textField: TextField,
//         }}
//         slotProps={{
//           textField: {
//             fullWidth: true,
//           },
//         }}
//       /> */}
//       <TextField
//         label="Search"
//         value={filters.state.searchTerm || ''}
//         onChange={handleFilterNameAddress}
//         fullWidth
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
//             </InputAdornment>
//           ),
//         }}
//       />
//     </Stack>
//   );
// }
