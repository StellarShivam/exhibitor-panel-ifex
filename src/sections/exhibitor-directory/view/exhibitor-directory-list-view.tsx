'use client';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { useTable } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import {
  useGetExhibitorDirectory,
  useGetMatchmakingList,
  useGetFavourites,
  addToFavourite,
  IExhibitorDirectoryFilters,
} from 'src/api/exhibitor-directory';

import ExhibitorDirectoryTableRow from '../exhibitor-directory-table-row';
import ExhibitorDirectoryTableView from '../exhibitor-directory-table-view';
import ExhibitorDirectoryTableToolbar from '../exhibitor-directory-table-toolbar';
import ExportFavouritesButton from './export-favourites-button';
import { featureFlags } from 'src/config-global';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'exhibitorName', label: 'Exhibitor Name' },
  // { id: 'hallNumber', label: 'Hall No' },
  // { id: 'stallNumber', label: 'Stall No' },
  { id: 'productGroupName', label: 'Product Group' },
  { id: 'productCategory', label: 'Product Category' },
  { id: 'contactPersonName', label: 'Contact Person' },
  { id: 'email', label: 'Email' },
  { id: 'city', label: 'City' },
  // { id: 'phone', label: 'Phone' },
  { id: 'action', label: 'Favourite', align: 'center' as const },
];

// Extends TABLE_HEAD with the extra Meeting column for the matchmaking tab
const MATCHMAKING_TABLE_HEAD = 
featureFlags.matchmakingMeetingButton ? [
  ...TABLE_HEAD,
  { id: 'meeting', label: 'Meeting', align: 'center' as const },
] : TABLE_HEAD;

const defaultFilters: IExhibitorDirectoryFilters = {
  country: '',
  state: '',
  category: '',
  productGroupId: '',
  search: '',
};

// ----------------------------------------------------------------------

export default function ExhibitorDirectoryListView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 20 });
  const favTable = useTable({ defaultRowsPerPage: 20 });
  const matchmakingTable = useTable({ defaultRowsPerPage: 20 });

  const [activeTab, setActiveTab] = useState<'directory' | 'favourites' | 'matchmaking'>('directory');
  const [filters, setFilters] = useState<IExhibitorDirectoryFilters>(defaultFilters);
  const [togglingUrns, setTogglingUrns] = useState<Set<string>>(new Set());
  const [selectedMeeting, setSelectedMeeting] = useState<{ urn: string; name: string } | null>(null);
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);

  const { exhibitors, exhibitorsLoading, exhibitorsEmpty, totalElements } =
    useGetExhibitorDirectory({
      page: table.page + 1,
      pageSize: table.rowsPerPage,
      filters,
    });

  const {
    exhibitors: matchmakingExhibitors,
    exhibitorsLoading: matchmakingLoading,
    exhibitorsEmpty: matchmakingEmpty,
    totalElements: matchmakingTotalElements,
  } = useGetMatchmakingList({
    page: matchmakingTable.page + 1,
    pageSize: matchmakingTable.rowsPerPage,
    filters,
  });

  const { favourites, favouritesLoading, reFetchFavourites } = useGetFavourites();

  const favouriteUrns = new Set(favourites.map((f) => f.urn));

  const canReset =
    !!filters.country || !!filters.state || !!filters.category || !!filters.productGroupId || !!filters.search;

  const notFound =
    (!exhibitorsLoading && exhibitorsEmpty) ||
    (!exhibitorsLoading && !exhibitors.length && canReset);

  const favNotFound = !favouritesLoading && !favourites.length;

  const paginatedFavourites = favourites.slice(
    favTable.page * favTable.rowsPerPage,
    favTable.page * favTable.rowsPerPage + favTable.rowsPerPage
  );

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleFilters = useCallback(
    (name: keyof IExhibitorDirectoryFilters, value: string) => {
      table.onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleToggleFavourite = useCallback(
    async (urn: string) => {
      setTogglingUrns((prev) => new Set(prev).add(urn));
      try {
        await addToFavourite(urn);
        await reFetchFavourites();
        enqueueSnackbar('Added to favourites!', { variant: 'success' });
      } catch (err: any) {
        enqueueSnackbar(err?.message || 'Failed to add to favourites', { variant: 'error' });
      } finally {
        setTogglingUrns((prev) => {
          const next = new Set(prev);
          next.delete(urn);
          return next;
        });
      }
    },
    [enqueueSnackbar, reFetchFavourites]
  );

  const handleOpenMeetingModal = useCallback((urn: string, name: string) => {
    setSelectedMeeting({ urn, name });
    setMeetingModalOpen(true);
  }, []);

  const handleCloseMeetingModal = useCallback(() => {
    setMeetingModalOpen(false);
    setSelectedMeeting(null);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 2 }}>
      <CustomBreadcrumbs
        heading="Pre-fair Directory"
        links={[
          { name: 'Dashboard' },
          { name: 'Pre-fair Directory', href: paths.dashboard.buyer.exhibitorDirectory },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={<ExportFavouritesButton />}
      />

      <Card>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          <Tab value="directory" label="All Exhibitors" />
          <Tab value="matchmaking" label="Matchmaking" />
          <Tab
            value="favourites"
            label={`Favourites${favourites.length ? ` (${favourites.length})` : ''}`}
          />
        </Tabs>

        {/* ── Directory Tab ── */}
        {activeTab === 'directory' && (
          <ExhibitorDirectoryTableView
            headLabel={TABLE_HEAD}
            table={table}
            loading={exhibitorsLoading}
            notFound={notFound}
            totalElements={totalElements}
            rowCount={exhibitors.length}
            toolbar={
              <ExhibitorDirectoryTableToolbar
                filters={filters}
                onFilters={handleFilters}
                onResetFilters={handleResetFilters}
                canReset={canReset}
                activeTab={activeTab}
              />
            }
          >
            {exhibitors.map((row) => (
              <ExhibitorDirectoryTableRow
                key={row.urn}
                row={row}
                isFavourited={favouriteUrns.has(row.urn)}
                onToggleFavourite={() => handleToggleFavourite(row.urn)}
                isToggling={togglingUrns.has(row.urn)}
              />
            ))}
          </ExhibitorDirectoryTableView>
        )}

        {/* ── Favourites Tab ── */}
        {activeTab === 'favourites' && (
          <ExhibitorDirectoryTableView
            headLabel={TABLE_HEAD}
            table={favTable}
            loading={favouritesLoading}
            notFound={favNotFound}
            totalElements={favourites.length}
            rowCount={paginatedFavourites.length}
          >
            {paginatedFavourites.map((row) => (
              <ExhibitorDirectoryTableRow
                key={row.urn}
                row={row}
                isFavourited
                onToggleFavourite={() => {}}
                isToggling={false}
              />
            ))}
          </ExhibitorDirectoryTableView>
        )}

        {/* ── Matchmaking Tab ── */}
        {activeTab === 'matchmaking' && (
          <ExhibitorDirectoryTableView
            headLabel={MATCHMAKING_TABLE_HEAD}
            table={matchmakingTable}
            loading={matchmakingLoading}
            notFound={!matchmakingLoading && !matchmakingExhibitors.length}
            totalElements={matchmakingTotalElements}
            rowCount={matchmakingExhibitors.length}
            toolbar={
              <ExhibitorDirectoryTableToolbar
                filters={filters}
                onFilters={handleFilters}
                onResetFilters={handleResetFilters}
                canReset={canReset}
                activeTab={activeTab}
              />
            }
          >
            {matchmakingExhibitors.map((row) => (
              <ExhibitorDirectoryTableRow
                key={row.urn}
                row={row}
                isFavourited={favouriteUrns.has(row.urn)}
                onToggleFavourite={() => handleToggleFavourite(row.urn)}
                isToggling={togglingUrns.has(row.urn)}
                onRequestMeeting={() => handleOpenMeetingModal(row.urn, row.exhibitorName)}
              />
            ))}
          </ExhibitorDirectoryTableView>
        )}
      </Card>

      {/* ── Meeting Modal ── */}
      <Dialog open={meetingModalOpen} onClose={handleCloseMeetingModal} maxWidth="sm" fullWidth>
        <DialogTitle>Request Meeting</DialogTitle>
        <DialogContent sx={{ minHeight: 200, py: 3 }}>
          {selectedMeeting && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Exhibitor: <strong>{selectedMeeting.name}</strong>
            </Typography>
          )}
          {/* Modal content will be added here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMeetingModal}>Cancel</Button>
          <Button variant="contained">Request</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
