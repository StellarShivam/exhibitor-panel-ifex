'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
// import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetExhibitorUsers } from 'src/api/team-management';

import { useEventContext } from 'src/components/event-context';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { IUserItem, IUserTableFilters, IUserTableFilterValue } from 'src/types/user';

import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { useGetFormsList } from 'src/api/forms';
import { IFormListItem } from 'src/types/forms';
import Label from 'src/components/label';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const getStatusColor = (status: string | null) => {
  if (status === null) return 'default';
  if (status === 'PENDING') return 'warning';
  if (status === 'REJECTED') return 'error';
  if (status === 'APPROVED') return 'success';
  return 'default';
};

const getStatusColorAutoApprove = (status: string | null) => {
  if (status === null) return 'warning';
  if (status === 'APPROVED') return 'success';
  return 'default';
};

const getStatusTextAutoApprove = (status: string | null) => {
  if (status === 'APPROVED') {
    return 'Completed';
  }
  return 'Pending';
};

const getStatusText = (status: string | null) => {
  if (status === 'PENDING') {
    return 'Pending for Organizer Approval';
  }
  if (status === 'REJECTED') {
    return 'Rejected';
  }
  if (status === 'APPROVED') {
    return 'Approved';
  }
  return 'Not Started';
};

const getFormRequirement = (formId: number, scheme: string | undefined) => {
  const normalizedScheme = scheme?.toLowerCase();

  switch (formId) {
    case 1:
      return { isMandatory: true, isClickable: true };
    case 2:
      if (normalizedScheme === 'pre_fitted') {
        return { isMandatory: true, isClickable: true };
      }
      return { isMandatory: false, isClickable: false };
    case 3:
      if (normalizedScheme === 'space_only') {
        return { isMandatory: true, isClickable: true };
      }
      return { isMandatory: false, isClickable: true };
    case 4:
      if (normalizedScheme === 'space_only') {
        return { isMandatory: true, isClickable: true };
      }
      return { isMandatory: false, isClickable: true };
    case 5:
      return { isMandatory: false, isClickable: true };
    case 6:
    case 7:
    case 8:
    case 9:
      return { isMandatory: false, isClickable: true };
    default:
      return { isMandatory: false, isClickable: true };
  }
};

const TABLE_HEAD = [
  { id: 'name', label: 'Team Member' },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'lastUpdated', label: 'Last updated', width: 180 },
  // { id: 'permissions', label: 'Permissions', width: 320 },
  { id: '', label: 'Action', width: 80 },
];

const defaultFilters: IUserTableFilters = {
  name: '',
  permissions: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function FormsListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const { eventData } = useEventContext();

  const scheme = (eventData?.state as any)?.scheme?.toLowerCase();

  const { forms, formsLoading, reFetchForms } = useGetFormsList();

  console.log(forms, '******************8');

  const [formList, setFormList] = useState<IFormListItem[]>([]);

  useEffect(() => {
    setFormList(forms);
  }, [forms]);

  // const [filters, setFilters] = useState(defaultFilters);

  // const dataFiltered = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  // });

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Forms"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            // { name: 'User', href: paths.dashboard.user.root },
            { name: 'Forms', href: paths.dashboard.forms.root },
            // { name: 'Members' },
          ]}
          // action={}
          sx={{
            mb: { xs: 1, md: 2 },
          }}
        />
        <Stack
          direction="column"
          // alignItems="center"
          justifyContent="space-between"
          sx={{
            backgroundColor: '#00B8D929',
            color: 'info.main',
            border: '2px solid #00B8D920',
            borderRadius: 1,
            px: 2,
            py: 1,
            mb: 3,
            width: '100%',
          }}
        >
          <Stack direction="row" alignItems="start" spacing={1}>
            <InfoIcon sx={{ color: 'info.main' }} />
            <Typography variant="body2" sx={{ color: 'info.main' }}>
              • Please ensure that all details are entered accurately, as they cannot be edited
              after submission.
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'info.main', ml: 4 }}>
            • We will review and verify the information before approving the forms, so it is
            important to provide correct details.
          </Typography>
          <Typography variant="body2" sx={{ color: 'info.main', ml: 4 }}>
            • Forms marked with <strong>*</strong> are mandatory.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ p: 2, border: '1px solid #00B8D920' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Iconify icon="fluent:form-28-filled" width={40} height={40} color="currentColor" />
                <Chip label="Approved" color="success" variant="outlined" />
              </Stack>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Exhibitor Directory Listing Form
              </Typography>
            </Card>
          </Grid> */}
          {formList.map((form) => {
            // if (form.formId === 5 || form.formId === 7 || form.formId === 8 || form.formId === 9)
            //   return null;

            const formRequirement = getFormRequirement(form.formId, scheme);
            const isClickable = formRequirement.isClickable;

            return (
              <Grid item xs={12} md={6} lg={4} key={form.formId}>
                <Card
                  sx={{
                    p: 2,
                    border: `1.5px solid ${!form.status || form.status === 'REJECTED' ? 'red' : '#00B8D920'}`,
                    height: 170,
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: isClickable ? 'pointer' : 'not-allowed',
                    opacity: isClickable ? 1 : 0.6,
                    backgroundColor: isClickable ? 'background.paper' : 'action.disabledBackground',
                    '&:hover': isClickable
                      ? {
                          scale: 1.05,
                          transition: 'all 0.3s ease',
                        }
                      : {},
                  }}
                  onClick={() => {
                    if (isClickable) {
                      router.push(paths.dashboard.forms.detail(form.formId.toString()));
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Iconify icon="fluent:form-28-filled" width={40} height={40} />
                    <Label
                      color={
                        form.isAutoApproved
                          ? getStatusColorAutoApprove(form.status)
                          : getStatusColor(form.status)
                      }
                    >
                      {form.isAutoApproved
                        ? getStatusTextAutoApprove(form.status)
                        : getStatusText(form.status)}
                    </Label>
                  </Stack>

                  <Stack
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                    spacing={0}
                  >
                    <Typography variant="h6" sx={{ mt: 1, flex: 1 }}>
                      {form.name}
                      {formRequirement.isMandatory ? '*' : ''}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0,
                      flex: 1,
                      color: !form.status || form.status === 'REJECTED' ? 'red' : 'text.primary',
                    }}
                  >
                    {/* {form.dueDate ? `Due : ${fDate(form.dueDate)}` : ''} */}
                    Due : 10 Sep 2025
                  </Typography>
                </Card>
              </Grid>
            );
          })}
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                p: 2,
                border: `1.5px solid #00B8D920`,
                // border: `1.5px solid ${!form.status || form.status === 'REJECTED' ? 'red' : '#00B8D920'}`,
                height: 170,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                // opacity: isClickable ? 1 : 0.6,
                backgroundColor: 'background.paper',
                '&:hover': {
                      scale: 1.05,
                      transition: 'all 0.3s ease',
                    }
              }}
              onClick={() => {
                router.push('/dashboard/team-management/new/');
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Iconify icon="fluent:form-28-filled" width={40} height={40} />
                {/* <Label
                  // color={
                  //   form.isAutoApproved
                  //     ? getStatusColorAutoApprove(form.status)
                  //     : getStatusColor(form.status)
                  // }
                > */}
                  {/* {form.isAutoApproved
                    ? getStatusTextAutoApprove(form.status)
                    : getStatusText(form.status)} */}
                {/* </Label> */}
              </Stack>

              <Stack
                direction="column"
                justifyContent="space-between"
                height="100%"
                spacing={0}
              >
                <Typography variant="h6" sx={{ mt: 1, flex: 1 }}>
                  Form 10. Exhibitor Badges
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  mt: 0,
                  flex: 1,
                  color: 'text.primary',
                }}
              >
                Due : 10 Sep 2025
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* <Card>
          <CardHeader title="Forms" />
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Forms</Typography>
              <Button variant="contained" color="primary">
                Add Form
              </Button>
            </Stack>
          </CardContent>
        </Card> */}
      </Container>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}
