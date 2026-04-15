import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useAuthContext } from 'src/auth/hooks';

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

// ----------------------------------------------------------------------

type Props = {
  row: NetworkingUser;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onScheduleClick: (exhibitor: any) => void;
};

export default function NetworkingTableCard({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onScheduleClick,
}: Props) {
  const { firstName, lastName, companyName, designation, userCohort, profileUrl, data } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  const { user } = useAuthContext();

  const userRole = user?.role || '';

  const isBuyer =
    userRole.includes('BUYER_ADMIN') ||
    userRole.includes('BUYER_USER') ||
    userRole.includes('DOMESTIC_BUYER_ADMIN') ||
    userRole.includes('DOMESTIC_BUYER_USER') ||
    userRole.includes('INTERNATIONAL_BUYER_ADMIN') ||
    userRole.includes('INTERNATIONAL_BUYER_USER');

  const getStatusColor = (cohort: string) => {
    switch (cohort) {
      case 'EXHIBITOR':
        return 'info';
      case 'VISITOR':
        return 'success';
      case 'BUYER':
        return 'warning';
      default:
        return 'default';
    }
  };

  const fullName = `${firstName} ${lastName}`.trim();
  const stallInfo = data?.stallNo ? `${data.stallNo}` : '';
  const hallInfo = data?.hallNo ? `${data.hallNo}` : '';

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Box
          sx={{
            p: 2,
            // border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            position: 'relative',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Label
              variant="soft"
              color={getStatusColor(userCohort)}
              sx={{ textTransform: 'capitalize' }}
            >
              {userCohort === 'EXHIBITOR_USER' ? 'Exhibitor' : userCohort.toLowerCase()}
            </Label>

            {/* <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton> */}
          </Stack>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                src={profileUrl || data?.profilePhoto || ''}
                alt={fullName}
                sx={{ width: 48, height: 48 }}
              >
                {fullName.charAt(0).toUpperCase()}
              </Avatar>

              <Stack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {companyName}
                </Typography>
              </Stack>
            </Stack>

            {(stallInfo || hallInfo) && (
              <Box>
                {stallInfo && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    <strong>Stall No. :</strong> {stallInfo}
                  </Typography>
                )}
                {hallInfo && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    <strong>Hall No. :</strong> {hallInfo}
                  </Typography>
                )}
              </Box>
            )}
            {data?.areaOfInterest && (
              <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Area of Interest:</strong>
                </Typography>
                <Chip
                  label={data?.areaOfInterest}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              </Box>
            )}

            {data?.productInterests &&
              Array.isArray(data.productInterests) &&
              data.productInterests.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    <strong>Product Interests:</strong>
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {data.productInterests.slice(0, 2).map((category: string, index: number) => (
                      <Chip
                        key={index}
                        label={category}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                    {data.productInterests.length > 2 && (
                      <Chip
                        label={`+${data.productInterests.length - 2} more`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Stack>
                </Box>
              )}

            {data?.productCategory &&
              Array.isArray(data.productCategory) &&
              data.productCategory.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    <strong>Categories:</strong>
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {data.productCategory.slice(0, 2).map((category: string, index: number) => (
                      <Chip
                        key={index}
                        label={category}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                    {data.productCategory.length > 2 && (
                      <Chip
                        label={`+${data.productCategory.length - 2} more`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Stack>
                </Box>
              )}
          </Stack>
        </Box>
        {isBuyer && userCohort === 'EXHIBITOR' && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 0, p: 2, borderTop: '1px solid', borderColor: 'divider' }}
          >
            {/* <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="mingcute:user-add-line" />}
              sx={{ flex: 1 }}
            >
              Connect
            </Button> */}
            <Button
              variant="contained"
              size="small"
              // startIcon={<Iconify icon="mingcute:calendar-line" />}
              onClick={() => onScheduleClick(row)}
              sx={{ flex: 1 }}
            >
              Schedule Meeting
            </Button>
          </Stack>
        )}
        {!isBuyer &&
          (userCohort === 'VISITOR' || userCohort === 'EXHIBITOR' || userCohort === 'BUYER') && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 0, p: 2, borderTop: '1px solid', borderColor: 'divider' }}
            >
              {/* <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="mingcute:user-add-line" />}
              sx={{ flex: 1 }}
            >
              Connect
            </Button> */}
              <Button
                variant="contained"
                size="small"
                // startIcon={<Iconify icon="mingcute:calendar-line" />}
                onClick={() => onScheduleClick(row)}
                sx={{ flex: 1 }}
              >
                Schedule Meeting
              </Button>
            </Stack>
          )}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View Profile
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Remove
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Remove Contact"
        content={`Are you sure you want to remove ${fullName} from your networking list?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Remove
          </Button>
        }
      />
    </>
  );
}
