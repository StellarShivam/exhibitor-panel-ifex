'use client';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Box, Container } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useEventContext } from 'src/components/event-context';
import { useTable, TablePaginationCustom } from 'src/components/table';

import { useGetPeoples } from 'src/api/networking';

import NetworkingTableCard from '../networking-table-card';
import NetworkingTableToolbar from '../networking-table-toolbar';
import NetworkingTableFiltersResult from '../networking-table-filters-result';
import MeetingForm from '../meeting-schedule-form';

// ----------------------------------------------------------------------

interface NetworkingTableFilters extends Record<string, string | number | boolean> {
  name: string;
  country: string;
  userCohort: string;
  companyName: string;
}

const defaultFilters: NetworkingTableFilters = {
  name: '',
  country: '',
  userCohort: 'all',
  companyName: '',
};

// ----------------------------------------------------------------------

type Props = {
  isOverview?: boolean;
};

export default function NetworkingListView({ isOverview = false }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const { eventData } = useEventContext();

  const table = useTable({ defaultOrderBy: 'firstName', defaultRowsPerPage: 12 });

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedExhibitor, setSelectedExhibitor] = useState<any | null>(null);

  const { peoples, peoplesLoading, totalCount, reFetchPeoples } = useGetPeoples(
    eventData?.state.eventId || 0,
    {
      page: table.page + 1,
      pageSize: table.rowsPerPage,
      filters,
    }
  );

  console.log(peoples, '********************8');

  const canReset =
    !!filters.name || !!filters.country || filters.userCohort !== 'all' || !!filters.companyName;

  const getCountByUserCohort = (cohort: string) =>
    cohort === 'all' ? totalCount : peoples.filter((item) => item.userCohort === cohort).length;

  const TABS = [
    { value: 'all', label: 'Discover', color: 'default', count: totalCount },
    // {
    //   value: 'EXHIBITOR',
    //   label: 'Exhibitors',
    //   color: 'info',
    //   count: getCountByUserCohort('EXHIBITOR'),
    // },
    // {
    //   value: 'SPEAKER',
    //   label: 'Speakers',
    //   color: 'success',
    //   count: getCountByUserCohort('SPEAKER'),
    // },
    // { value: 'BUYER', label: 'Buyers', color: 'warning', count: getCountByUserCohort('BUYER') },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id: number) => {
      enqueueSnackbar('User removed from list!');
      reFetchPeoples();
    },
    [enqueueSnackbar, reFetchPeoples]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.schedule);
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('userCohort', newValue);
    },
    [handleFilters]
  );

  const handleScheduleClick = (exhibitor: any) => {
    setSelectedExhibitor(exhibitor);
  };

  const handleCloseForm = () => {
    setSelectedExhibitor(null);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 2 }}>
      <CustomBreadcrumbs
        heading="Networking"
        links={[
          {
            name: 'Dashboard',
          },
          {
            name: 'Networking',
            href: paths.dashboard.networking,
          },
        ]}
        // action={
        //   <Button
        //     component={RouterLink}
        //     href={paths.dashboard.buyer.schedule}
        //     variant="contained"
        //     startIcon={<Iconify icon="mingcute:add-line" />}
        //   >
        //     New Invoice
        //   </Button>
        // }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <Tabs
          value={filters.userCohort}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.userCohort) && 'filled') ||
                    'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <NetworkingTableToolbar filters={filters} onFilters={handleFilters} tableData={peoples} />

        {canReset && (
          <NetworkingTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={peoples.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}
        <Box
          gap={2}
          display="grid"
          sx={{ p: 2 }}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {peoplesLoading
            ? Array.from({ length: table.rowsPerPage }, (_, index) => (
                <Box key={index} sx={{ height: 200, bgcolor: 'grey.100', borderRadius: 1 }} />
              ))
            : peoples.map((row) => (
                <NetworkingTableCard
                  key={`${row.eventMemberId || row.exhibitorId || row.email}-${row.userCohort}`}
                  onScheduleClick={handleScheduleClick}
                  row={row}
                  selected={table.selected.includes(row.email)}
                  onSelectRow={() => table.onSelectRow(row.email)}
                  onEditRow={() => handleEditRow(row.email)}
                  onDeleteRow={() => handleDeleteRow(row.exhibitorId || 0)}
                />
              ))}
        </Box>

        <TablePaginationCustom
          count={totalCount}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          // dense={table.dense}
          // onChangeDense={table.onChangeDense}
        />
      </Card>

      {selectedExhibitor && (
        <MeetingForm
          title="Schedule Meeting"
          currentExhibitor={selectedExhibitor}
          onClose={handleCloseForm}
          open={Boolean(selectedExhibitor)}
          colorOptions={[]} // or whatever is needed
        />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------
