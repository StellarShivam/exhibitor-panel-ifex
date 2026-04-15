import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Collapse,
  styled,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import { Add, Remove } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  COUNTRY_PARTNER_DATA_FEATURES,
  EXHIBITOR_PACKAGE_FEATURES,
  KNOWLEDGE_SESSIONS_FEATURES_DATA,
  STATE_PARTNER_DATA_FEATURES,
} from './data';
import {
  CountryPartnerPackage,
  ExhibitionPackage,
  KnowledgeSessionsPackage,
  SponsorshipCategory,
  StatePartnerPackage,
} from './enums';

// --- Styled Components ---

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderRight: '1px solid #e0e0e0',
  maxWidth: '250px',
  '&:last-child': { borderRight: 'none' },
  // Header Row Styles
  '&.header-cell': {
    backgroundColor: '#fff3e0',
    fontWeight: '800',
    color: '#d84315',
    textAlign: 'center',
    verticalAlign: 'bottom',
    fontSize: '0.9rem',
    padding: '12px 8px',
  },
  // The first column (Feature Name)
  '&.feature-col': {
    backgroundColor: '#fafafa',
    fontWeight: '600',
    textAlign: 'left',
  },
  // Child rows (indented)
  '&.sub-feature-col': {
    paddingLeft: theme.spacing(4),
    color: '#555',
    textAlign: 'left',
    fontSize: '0.85rem',
  },
  // Data columns (Center aligned)
  '&.data-cell': {
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  // The Group Header (e.g., "Pre-Event")
  '&.group-header': {
    backgroundColor: '#eeeeee',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    cursor: 'default',
    userSelect: 'none',
    padding: '10px 16px',
    color: '#333',
    // Ensure group header bottom border is consistent
    borderBottom: '1px solid #e0e0e0 !important',
  },
}));

export const PACKAGE_ICONS = {
  [ExhibitionPackage.PLATINUM]: '/icons/platinum.png',
  [ExhibitionPackage.GOLD]: '/icons/Gold medal.png',
  [ExhibitionPackage.SILVER]: '/icons/Silver medal.png',
  [ExhibitionPackage.TEXTILE_TECHNOLOGY]: "/icons/Textile Technology.png",
	[ExhibitionPackage.TEXTILE_INNOVATION]: "/icons/Textile Innovation.png",
  [ExhibitionPackage.ASSOCIATE]: '/icons/Associate.png',
  [ExhibitionPackage.LOUNGE]: '/icons/Lounge.png',
  [StatePartnerPackage.PARTNER_STATE]: '/icons/Partner State.png',
  [StatePartnerPackage.SUPPORTING_STATE_PARTNERSHIP]: '/icons/Supporting state partnership.png',
  [StatePartnerPackage.KNOWLEDGE_PARTNER_STATE]: '/icons/Knowledge partner state.png',
  [CountryPartnerPackage.PARTNER_COUNTRY]: '/icons/Partner Country.png',
  [CountryPartnerPackage.SUPPORTING_COUNTRY_PARTNERSHIP]:
    '/icons/Supporting country partnership.png',
  [CountryPartnerPackage.KNOWLEDGE_COUNTRY_PARTNER]: '/icons/Knowledge partner country.png',
  [KnowledgeSessionsPackage.ROUNDTABLE]: '/icons/Roundtable.png',
  [KnowledgeSessionsPackage.FIRESIDE_CHAT]: '/icons/Firesidechat.png',
  [KnowledgeSessionsPackage.PANEL_DISCUSSION]: '/icons/Panel discussion.png',
  [KnowledgeSessionsPackage.MASTERCLASS_PODCAST]: '/icons/Podcast.png',
};

// --- Data Definitions (REMAINS THE SAME) ---

const EXHIBITOR_DATA = EXHIBITOR_PACKAGE_FEATURES;

const STATE_PARTNER_DATA = STATE_PARTNER_DATA_FEATURES;

const COUNTRY_PARTNER_DATA = COUNTRY_PARTNER_DATA_FEATURES;

const KNOWLEDGE_SESSIONS_DATA = KNOWLEDGE_SESSIONS_FEATURES_DATA;

// --- Helper: Render Checkmarks/Text ---
const renderValue = (val) => {
  if (val === true) return <CheckCircleIcon color="success" fontSize="small" />;
  if (val === false || val === null || val === '-')
    return <RemoveIcon sx={{ color: '#ccc' }} fontSize="small" />;
  return (
    <Typography variant="body2" fontWeight="500">
      {val}
    </Typography>
  );
};

// --- Sub-Component: Expandable Group ---
const RowGroup = ({ groupData, colSpan, isOpen, showToggle, onToggleAll, allGroupsOpen, selectedPackage, headers }) => {
  return (
    <>
      {/* 1. The Header Row with toggle button and group title */}
      {showToggle && (
        <TableRow
          sx={{
            border: '1px solid #e0e0e0',
          }}
        >
          <StyledTableCell
            colSpan={colSpan}
            className="group-header"
            sx={{
              textAlign: 'center',
              // width: "100%",
            }}
          >
            <Box display="flex" alignItems="center" justifyContent={'center'} gap={1}>
              <IconButton
                onClick={onToggleAll}
                size="small"
                sx={{
                  backgroundColor: 'transparent',
                }}
              >
                {allGroupsOpen ? <Remove /> : <Add />}
              </IconButton>
            </Box>
          </StyledTableCell>
        </TableRow>
      )}
      {isOpen && groupData.title && (
        <TableRow
          sx={{
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <StyledTableCell
            colSpan={colSpan}
            className="group-header"
            sx={{
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#333' }}>
                {groupData.title}
              </Typography>
            </Box>
          </StyledTableCell>
        </TableRow>
      )}

      {/* 3. The Children Rows (Animated) */}
      {isOpen &&
        groupData.children.map((childRow, idx) => (
          <TableRow
            key={idx}
            sx={{
              // Only apply bottom border if the row is visible and it's not the very last row in the whole table
              '& td': { borderBottom: isOpen ? '1px solid #e0e0e0' : 'none' },
            }}
          >
            {/* Feature Name Column */}
            <StyledTableCell
              component="th"
              scope="row"
              className="sub-feature-col"
              sx={{
                paddingY: 0,
                borderRight: isOpen ? '1px solid #e0e0e0' : 'none',
              }}
            >
              <Collapse in={isOpen} timeout={300} unmountOnExit>
                <Box py={1.5}>{childRow.feature}</Box>
              </Collapse>
            </StyledTableCell>

            {/* Value Columns */}
            {childRow.values.filter((val, vIdx) => headers[vIdx + 1].icon === selectedPackage).map((val, vIdx) => (
              <StyledTableCell key={vIdx} className="data-cell" sx={{ paddingY: 0 }}>
                <Collapse in={isOpen} timeout={300} unmountOnExit>
                  <Box py={1.5}>{renderValue(val)}</Box>
                </Collapse>
              </StyledTableCell>
            ))}
          </TableRow>
        ))}
    </>
  );
};

// --- Main Component ---

export default function PackageTable({ type, selectedPackage }) {
  const [openedGroups, setOpenedGroups] = useState<Set<number>>(new Set([]));

  // Reset open state when type changes and open first group
  useEffect(() => {
    setOpenedGroups(new Set([]));
  }, [type]);

  if (!type) return null;
  const getData = () => {
    switch (type) {
      case SponsorshipCategory.EXHIBITION:
        return EXHIBITOR_DATA;
      case SponsorshipCategory.STATE_PARTNER:
        return STATE_PARTNER_DATA;
      case SponsorshipCategory.COUNTRY_PARTNER:
        return COUNTRY_PARTNER_DATA;
      case SponsorshipCategory.KNOWLEDGE_SESSIONS:
        return KNOWLEDGE_SESSIONS_DATA;
      default:
        return null;
    }
  };

  const data = getData();

  if (!data) return <Box p={3}>Select a valid sponsorship category</Box>;

  const groupIndices = data.body
    .filter((item) => item.type === 'group')
    .map((item) => item.sequence);

  const allGroupsOpen =
    groupIndices.length > 0 && groupIndices.every((index) => openedGroups.has(index));

  const toggleAllGroups = () => {
    setOpenedGroups((prev) => {
      if (allGroupsOpen) {
        return new Set<number>();
      }
      return new Set<number>(groupIndices);
    });
  };

  return (
    // PRIMARY BOX: Handles horizontal scrolling for responsiveness
    <Box sx={{ mb: 4, width: '100%', overflowX: 'auto' }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 0,
          width: 'max-content',
          minWidth: '100%',
          overflowX: 'initial',
          overflowY: 'hidden',
        }}
      >
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {data.headers
                .filter(({ label, icon }, index) => icon === selectedPackage || index === 0)
                .map(({ label, icon }, index) => {
                  return (
                    <StyledTableCell
                      key={index}
                      className={index === 0 ? 'feature-col header-cell' : 'header-cell'}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        {icon && (
                          <img
                            src={PACKAGE_ICONS[icon]}
                            alt={label}
                            style={{ width: 40, height: 40 }}
                          />
                        )}
                        <Typography>{label}</Typography>
                      </Box>
                    </StyledTableCell>
                  );
                })}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.body.map((rowItem) => {
              const index = rowItem.sequence;
              if (rowItem.type === 'group') {
                const isOpen = openedGroups.has(index);

                return (
                  <RowGroup
                    key={index}
                    groupData={rowItem}
                    colSpan={data.headers.length}
                    isOpen={isOpen}
                    showToggle={index === groupIndices[0]}
                    onToggleAll={toggleAllGroups}
                    allGroupsOpen={allGroupsOpen}
                    selectedPackage={selectedPackage}
                    headers={data.headers}
                  />
                );
              }
              // Standard Row
              return (
                <TableRow key={index}>
                  <StyledTableCell className="feature-col">{rowItem.feature}</StyledTableCell>
                  {rowItem.values
                  ?.filter((val, vIdx) => {console.log(data.headers[vIdx + 1].icon === selectedPackage); return data.headers[vIdx + 1].icon === selectedPackage})
                  ?.map((val, vIdx) => (
                    <StyledTableCell key={vIdx} className="data-cell">
                      {renderValue(val)}
                    </StyledTableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
