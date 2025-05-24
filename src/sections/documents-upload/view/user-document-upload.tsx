'use client';

import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { _allFiles2, FILE_TYPE_OPTIONS2 } from 'src/_mock/file';

import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { fileFormat } from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';

import { IFile, IFileFilters, IFileFilterValue } from 'src/types/file';

import { useEventContext } from 'src/components/event-context';
import {
  useRemoveUploadUserDoc,
  useDocumentUpload,
  useRemoveUploadExhibitorDoc,
} from 'src/api/documents-upload';

import { DocumentUploadProps, IProcessedDocument } from 'src/types/documents';
import FileManagerTable from '../file-manager-table';
import FileManagerFilters from '../file-manager-filters';
import FileManagerFiltersResult from '../file-manager-filters-result';
import DocumentStats from '../document-stats';

// ----------------------------------------------------------------------

const defaultFilters: IFileFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function UserDocumentUpload({
  documents,
  documentType,
  uploadedDocuments,
  isLoading,
  onRefresh,
}: DocumentUploadProps) {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const { eventData } = useEventContext();

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  // const upload = useBoolean();

  const [view, setView] = useState('list');

  const { uploadFile } = useDocumentUpload();

  const { removeUploadUserDoc } = useRemoveUploadUserDoc();

  const { removeUploadExhibitorDoc } = useRemoveUploadExhibitorDoc();

  const [tableData, setTableData] = useState<IProcessedDocument[]>(documents);

  const [filters, setFilters] = useState(defaultFilters);

  // Add useEffect to update tableData when documents prop changes
  useEffect(() => {
    setTableData(documents);
  }, [documents]);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // const handleChangeView = useCallback(
  //   (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
  //     if (newView !== null) {
  //       setView(newView);
  //     }
  //   },
  //   []
  // );

  const handleFilters = useCallback(
    (name: string, value: IFileFilterValue) => {
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

  const handleDeleteItem = useCallback(
    async (id: string) => {
      try {
        const updatedDocuments = uploadedDocuments?.filter((doc) => doc.name !== id) || [];
        let response;
        if (documentType === 'user') {
          const documentData = {
            id: eventData?.state.exhibitorUserId,
            eventId: eventData?.state.eventId,
            documents: {
              data: updatedDocuments,
            },
          };
          response = await removeUploadUserDoc(documentData);
        } else {
          const documentData = {
            id: eventData?.state.exhibitorId,
            eventId: eventData?.state.eventId,
            documents: {
              data: updatedDocuments,
            },
          };
          response = await removeUploadExhibitorDoc(documentData);
        }

        if (response?.data?.status !== 'success') {
          enqueueSnackbar('Error uploading file', { variant: 'error' });
          return;
        }

        enqueueSnackbar('Document removed successfully!', { variant: 'success' });

        onRefresh();
      } catch (error: any) {
        console.error('Error deleting document:', error);
        enqueueSnackbar(error.message || 'Error deleting document', { variant: 'error' });
      }
    },
    [
      enqueueSnackbar,
      uploadedDocuments,
      eventData?.state.exhibitorId,
      eventData?.state.eventId,
      onRefresh,
      removeUploadUserDoc,
      removeUploadExhibitorDoc,
    ]
  );

  const handleUploadSuccess = useCallback(
    async (documentId: string, files: File[]) => {
      try {
        if (!files.length || !files[0]) {
          enqueueSnackbar('No file selected', { variant: 'error' });
          return;
        }
        const file = files[0];

        const uploadResponse = await uploadFile(file);
        if (!uploadResponse?.data?.storeUrl) {
          enqueueSnackbar('Error uploading file', { variant: 'error' });
          return;
        }

        let updateResponse;

        if (documentType === 'user') {
          const documentData = {
            id: eventData?.state.exhibitorUserId,
            eventId: eventData?.state.eventId,
            documents: {
              data: [
                {
                  name: documentId,
                  link: uploadResponse.data.storeUrl,
                  size: file.size,
                  verified: true,
                  uploadedAt: new Date().toISOString(),
                  documentName: file.name,
                },
                ...(uploadedDocuments || []),
              ],
            },
          };
          updateResponse = await removeUploadUserDoc(documentData);
        } else {
          const documentData = {
            id: eventData?.state.exhibitorId,
            eventId: eventData?.state.eventId,
            documents: {
              data: [
                {
                  name: documentId,
                  link: uploadResponse.data.storeUrl,
                  size: file.size,
                  verified: true,
                  uploadedAt: new Date().toISOString(),
                  documentName: file.name,
                },
                ...(uploadedDocuments || []),
              ],
            },
          };
          updateResponse = await removeUploadExhibitorDoc(documentData);
        }

        if (updateResponse?.data?.status !== 'success') {
          enqueueSnackbar('Error uploading file', { variant: 'error' });
          return;
        }
        enqueueSnackbar('File uploaded successfully');
        onRefresh();
      } catch (error: any) {
        console.error('Error uploading file:', error);
        enqueueSnackbar(error.message || 'Error uploading file', { variant: 'error' });
      }
    },
    [
      uploadFile,
      removeUploadUserDoc,
      eventData?.state.exhibitorId,
      eventData?.state.eventId,
      uploadedDocuments,
      enqueueSnackbar,
      onRefresh,
    ]
  );

  const handleDeleteItems = useCallback(async () => {
    try {
      const updatedDocuments =
        uploadedDocuments?.filter((doc) => !table.selected.includes(doc.name)) || [];

      let response;
      if (documentType === 'user') {
        const documentData = {
          id: eventData?.state.exhibitorUserId,
          eventId: eventData?.state.eventId,
          documents: {
            data: updatedDocuments,
          },
        };
        response = await removeUploadUserDoc(documentData);
      } else {
        const documentData = {
          id: eventData?.state.exhibitorId,
          eventId: eventData?.state.eventId,
          documents: {
            data: updatedDocuments,
          },
        };
        response = await removeUploadExhibitorDoc(documentData);
      }

      if (response?.data?.status !== 'success') {
        enqueueSnackbar('Error removing documents', { variant: 'error' });
        return;
      }

      enqueueSnackbar('Documents Removed successfully!', { variant: 'success' });

      onRefresh();
    } catch (error: any) {
      console.error('Error removing documents:', error);
      enqueueSnackbar(error.message || 'Error removing documents', { variant: 'error' });
    }
  }, [
    table,
    uploadedDocuments,
    eventData?.state.exhibitorId,
    eventData?.state.eventId,
    enqueueSnackbar,
    onRefresh,
  ]);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={FILE_TYPE_OPTIONS2}
      />

      {/* <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>

        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup> */}
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">File Manager</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={upload.onTrue}
          >
            Upload
          </Button>
        </Stack> */}

        <DocumentStats documents={tableData} />

        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 3, md: 5 },
          }}
        >
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent
            filled
            title="No Documents Found"
            sx={{
              py: 10,
            }}
          />
        ) : (
          <>
            {/* {view === 'list' ? (
              <FileManagerTable
                table={table}
                dataFiltered={dataFiltered}
                onDeleteRow={handleDeleteItem}
                onUploadSuccess={handleUploadSuccess}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
              />
            ) : (
              <FileManagerGridView
                table={table}
                dataFiltered={dataFiltered}
                onDeleteItem={handleDeleteItem}
                onOpenConfirm={confirm.onTrue}
              />
            )} */}
            <FileManagerTable
              table={table}
              dataFiltered={dataFiltered}
              onDeleteRow={handleDeleteItem}
              onUploadSuccess={handleUploadSuccess}
              notFound={notFound}
              onOpenConfirm={confirm.onTrue}
            />
          </>
        )}
      </Container>

      {/* <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} /> */}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Remove"
        content={
          <>
            Are you sure want to remove <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Remove
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IProcessedDocument[];
  comparator: (a: any, b: any) => number;
  filters: IFileFilters;
  dateError: boolean;
}) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((file) => isBetween(file.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
