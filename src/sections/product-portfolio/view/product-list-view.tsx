'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  useGetProductPortfolio,
  deleteProduct,
  updateProduct,
  useGetPortfolio,
  savePortfolio,
} from 'src/api/product-portfolio';
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import {
  IProductItem,
  IProductItemNew,
  IProductTableFilters,
  IProductTableFilterValue,
} from 'src/types/product';

import { useEventContext } from 'src/components/event-context';
import ProductTableToolbar from '../product-table-toolbar';
import ProductTableFiltersResult from '../product-table-filters-result';
import {
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellCreatedAt,
} from '../product-table-row';
import PortfolioUploadModal from '../portfolio-upload-modal';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';
import PortfolioViewModal from '../portfolio-view-modal';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'PUBLISHED', label: 'PUBLISHED' },
  { value: 'DRAFT', label: 'DRAFT' },
];

const defaultFilters: IProductTableFilters = {
  publish: [],
  stock: [],
};

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function ProductListView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();
  const portfolioModal = useBoolean();
  const uploadDialog = useBoolean();
  const viewPortfolioModal = useBoolean();

  const router = useRouter();

  const settings = useSettingsContext();

  const { eventData } = useEventContext();

  const { products, productsLoading, productsError, reFetchProductPortfolio } =
    useGetProductPortfolio(eventData?.state.exhibitorId);

  const { portfolio, portfolioLoading, portfolioError, reFetchPortfolio } = useGetPortfolio(
    eventData?.state.exhibitorId
  );

  console.log('portfolio', portfolio);

  const [tableData, setTableData] = useState<IProductItemNew[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (!productsError) {
      setTableData(products || []);
    } else {
      setTableData([]);
    }
  }, [products, productsError]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((name: string, value: IProductTableFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id: number) => {
      try {
        await deleteProduct(id);
        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
        await reFetchProductPortfolio();
        enqueueSnackbar('Delete success!');
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Delete failed!', { variant: 'error' });
      }
    },
    [enqueueSnackbar, tableData, reFetchProductPortfolio]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const deletePromises = selectedRowIds.map((id) => deleteProduct(id as number));
      await Promise.all(deletePromises);

      const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id as number));
      setTableData(deleteRows);
      await reFetchProductPortfolio();
      enqueueSnackbar('Delete success!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Delete failed!', { variant: 'error' });
    }
  }, [enqueueSnackbar, selectedRowIds, tableData, reFetchProductPortfolio]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.productPortfolio.edit(id));
    },
    [router]
  );

  const handleToggleStatus = useCallback(
    async (id: number, currentStatus: string) => {
      try {
        const newStatus = currentStatus === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
        const product = tableData.find((row) => row.id === id);

        if (!product) {
          throw new Error('Product not found');
        }

        await updateProduct({
          id,
          status: newStatus,
        });

        await reFetchProductPortfolio();
        enqueueSnackbar('Status updated successfully!');
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Failed to update status', { variant: 'error' });
      }
    },
    [enqueueSnackbar, reFetchProductPortfolio, tableData]
  );

  const handleUploadPortfolio = useCallback(() => {
    portfolioModal.onFalse();
    uploadDialog.onTrue();
  }, [portfolioModal, uploadDialog]);

  const handleCreatePortfolio = useCallback(() => {
    console.log('Create portfolio clicked');
    portfolioModal.onFalse();
  }, [portfolioModal]);

  const handleViewPortfolio = useCallback(() => {
    console.log('View portfolio clicked', portfolio);
    console.log('Products', tableData);

    if (!portfolio && (!tableData || tableData.length === 0)) {
      enqueueSnackbar('Please create a portfolio first', { variant: 'warning' });
      return;
    }

    if (
      !portfolio?.pdfUrl &&
      tableData &&
      tableData.length > 0 &&
      tableData.filter((p) => p.status === 'PUBLISHED').length === 0
    ) {
      enqueueSnackbar('Please make some products published to view portfolio', {
        variant: 'warning',
      });
      return;
    }

    if (!portfolio?.pdfUrl && (!tableData || tableData.length === 0)) {
      enqueueSnackbar('Please create a portfolio first', { variant: 'warning' });
      return;
    }

    viewPortfolioModal.onTrue();
  }, [portfolio, tableData, enqueueSnackbar, viewPortfolioModal]);

  const handleCreatePortfolioFromList = useCallback(async () => {
    console.log('tableData', tableData);
    const publishedProducts = tableData?.filter((product) => product.status === 'PUBLISHED') || [];

    if (publishedProducts.length === 0) {
      enqueueSnackbar('Please make some products published to create portfolio', {
        variant: 'warning',
      });
      return;
    }

    try {
      const portfolioData = {
        portfolioName: 'Portfolio',
        exhibitorId: eventData?.state.exhibitorId,
      };

      await savePortfolio(portfolioData);
      await reFetchPortfolio?.();
      enqueueSnackbar('Portfolio Created successfully!');
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  }, [tableData, enqueueSnackbar, eventData?.state.exhibitorId, reFetchPortfolio]);

  const columns: GridColDef[] = [
    {
      field: 'productName',
      headerName: 'Product',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Create at',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'regularPrice',
      headerName: 'Price',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: PUBLISH_OPTIONS,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Actions',
      align: 'right',
      headerAlign: 'right',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="jam:refresh-reverse" />}
          label={params.row.status === 'DRAFT' ? 'PUBLISH' : 'DRAFT'}
          onClick={() => handleToggleStatus(params.row.id, params.row.status)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Product Portfolio"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Product Portfolio',
              href: paths.dashboard.productPortfolio.root,
            },
            { name: 'List' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                onClick={portfolioModal.onTrue}
                variant="contained"
                color="secondary"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Portfolio
              </Button>
              {portfolio && (
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="hugeicons:view" />}
                  onClick={handleViewPortfolio}
                >
                  View Portfolio
                </Button>
              )}
            </Stack>
          }
          sx={{
            mb: {
              xs: 3,
              md: 3,
            },
          }}
        />

        <Card
          sx={{
            // height: { xs: 800, md: 2 },
            height: { xs: 800, md: '65vh' },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={productsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            sx={{
              '& .MuiDataGrid-cell': {
                borderColor: 'divider',
                borderWidth: '1px',
              },
              '& .MuiDataGrid-row': {
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
              '& .MuiDataGrid-columnHeaders': {
                borderColor: 'divider',
              },
            }}
            slots={{
              toolbar: () => (
                <>
                  <GridToolbarContainer>
                    <ProductTableToolbar
                      filters={filters}
                      onFilters={handleFilters}
                      stockOptions={PRODUCT_STOCK_OPTIONS}
                      publishOptions={PUBLISH_OPTIONS}
                    />

                    <GridToolbarQuickFilter />

                    <Stack
                      spacing={1}
                      flexGrow={1}
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      {!!selectedRowIds.length && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          onClick={confirmRows.onTrue}
                        >
                          Delete ({selectedRowIds.length})
                        </Button>
                      )}

                      <GridToolbarColumnsButton />
                      <GridToolbarFilterButton />
                      {/* <GridToolbarExport /> */}
                    </Stack>
                  </GridToolbarContainer>

                  {canReset && (
                    <ProductTableFiltersResult
                      filters={filters}
                      onFilters={handleFilters}
                      onResetFilters={handleResetFilters}
                      results={dataFiltered.length}
                      sx={{ p: 2.5, pt: 0 }}
                    />
                  )}
                </>
              ),
              noRowsOverlay: () => <EmptyContent title="No Data" />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            // getRowId={(row) => row.id || ''}
            // slotProps={{
            //   toolbar: {
            //     showQuickFilter: true,
            //   },
            // }}
            // quickFilterProps={{ debounceMs: 500 }}
          />
        </Card>

        {tableData.length > 0 && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              ml: 'auto',
              mt: 2,
            }}
          >
            <Button
              component={RouterLink}
              href={paths.dashboard.productPortfolio.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add More Product
            </Button>
            {portfolio?.pdfUrl && (
              <Button
                onClick={handleCreatePortfolioFromList}
                variant="contained"
                // startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Create Portfolio From List
              </Button>
            )}
          </Stack>
        )}
      </Container>

      <PortfolioViewModal
        open={viewPortfolioModal.value}
        onClose={viewPortfolioModal.onFalse}
        pdfUrl={portfolio?.pdfUrl}
        products={products?.filter((p) => p.status === 'PUBLISHED')}
      />

      <PortfolioUploadModal
        open={portfolioModal.value}
        onClose={portfolioModal.onFalse}
        onUploadClick={handleUploadPortfolio}
        onCreateClick={handleCreatePortfolio}
      />

      <FileManagerNewFolderDialog
        open={uploadDialog.value}
        onClose={uploadDialog.onFalse}
        title="Upload Portfolio PDF"
      />

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
}: {
  inputData: IProductItemNew[];
  filters: IProductTableFilters;
}) {
  const { stock, publish } = filters;

  // if (stock.length) {
  //   inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  // }

  console.log(publish);

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.status));
  }

  return inputData;
}
