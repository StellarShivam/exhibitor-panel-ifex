import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { keyframes } from '@mui/system';

import Iconify from 'src/components/iconify';

import { IExhibitorDirectoryItem } from 'src/api/exhibitor-directory';
import { featureFlags } from 'src/config-global';

// ----------------------------------------------------------------------

const heartPop = keyframes`
  0%   { transform: scale(1); }
  30%  { transform: scale(1.5); }
  60%  { transform: scale(0.85); }
  100% { transform: scale(1); }
`;

type Props = {
  row: IExhibitorDirectoryItem;
  isFavourited: boolean;
  onToggleFavourite: VoidFunction;
  isToggling?: boolean;
  /** When provided, renders the extra "Meeting" action cell */
  onRequestMeeting?: VoidFunction;
};

// ----------------------------------------------------------------------

export default function ExhibitorDirectoryTableRow({
  row,
  isFavourited,
  onToggleFavourite,
  isToggling = false,
  onRequestMeeting,
}: Props) {
  const { urn, email, phone, exhibitorName, contactPersonName, hallNumber, stallNumber, productGroupName, productCategory, city } = row;
  return (
    <TableRow hover>
      {/* Exhibitor Name + Avatar */}
      <TableCell sx={{ display: 'flex', alignItems: 'center', maxWidth: 250 }}>
        <Avatar alt={exhibitorName} sx={{ mr: 2 }}>
          {exhibitorName?.charAt(0)?.toUpperCase() || 'E'}
        </Avatar>

        <ListItemText
          disableTypography
          primary={
            <Typography variant="body2" noWrap fontWeight={600}>
              {exhibitorName || '—'}
            </Typography>
          }
          // secondary={
          //   <Typography noWrap variant="body2" sx={{ color: 'text.disabled' }}>
          //     {urn}
          //   </Typography>
          // }
        />
      </TableCell>

      {/* Hall No */}
      {/* <TableCell>
        <Typography variant="body2">{hallNumber || '—'}</Typography>
      </TableCell> */}

      {/* Stall No */}
      {/* <TableCell>
        <Typography variant="body2">{stallNumber || '—'}</Typography>
      </TableCell> */}

      {/* Product Group */}
      <TableCell>
        <Typography variant="body2">{productGroupName || '—'}</Typography>
      </TableCell>

      {/* Product Category */}
      <TableCell>
        <Typography variant="body2">{productCategory ? JSON.parse(productCategory).map((category: string) => category).join(', ') : '—'}</Typography>
      </TableCell>

      {/* Contact Person */}
      <TableCell>
        <Typography variant="body2">{contactPersonName || '—'}</Typography>
      </TableCell>

      {/* Email */}
      <TableCell>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {email || '—'}
        </Typography>
      </TableCell>

      {/* Phone */}
      {/* <TableCell>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {phone || '—'}
        </Typography>
      </TableCell> */}

      {/* City */}
      <TableCell>
        <Typography variant="body2">{city || '—'}</Typography>
      </TableCell>

      {/* Favourite */}
      <TableCell align="center">
        {isToggling ? (
          <CircularProgress size={20} />
        ) : (
          <Tooltip title={isFavourited ? 'Saved to favourites' : 'Add to favourites'}>
            <IconButton onClick={onToggleFavourite} disabled={isToggling || isFavourited} size="small">
              <Iconify
                icon={isFavourited ? 'solar:heart-bold' : 'solar:heart-outline'}
                sx={{
                  color: isFavourited ? 'error.main' : 'text.disabled',
                  width: 22,
                  height: 22,
                  animation: isFavourited ? `${heartPop} 0.4s ease` : 'none',
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>

      {/* Meeting — only rendered in Matchmaking tab via onRequestMeeting prop */}
      {featureFlags.matchmakingMeetingButton && onRequestMeeting !== undefined && (
        <TableCell align="center">
          <Tooltip title="Request meeting">
            <IconButton onClick={onRequestMeeting} size="small">
              <Iconify
                icon="solar:calendar-add-bold"
                sx={{ color: 'primary.main', width: 22, height: 22 }}
              />
            </IconButton>
          </Tooltip>
        </TableCell>
      )}
    </TableRow>
  );
}

