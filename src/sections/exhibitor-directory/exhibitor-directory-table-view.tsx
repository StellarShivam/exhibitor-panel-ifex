import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';

import Scrollbar from 'src/components/scrollbar';
import {
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import { useState } from 'react';

// ----------------------------------------------------------------------

type TableColumn = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
};

type TableState = {
  dense: boolean;
  order: 'asc' | 'desc';
  orderBy: string;
  page: number;
  rowsPerPage: number;
  selected: string[];
  onSort: (id: string) => void;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDense: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type Props = {
  /** Column definitions passed to TableHeadCustom */
  headLabel: TableColumn[];
  /** useTable() state object */
  table: TableState;
  /** Show skeleton rows while data is fetching */
  loading: boolean;
  /** Show empty-state illustration */
  notFound: boolean;
  /** Total record count used for pagination */
  totalElements: number;
  /** Row count for select-all checkbox in header */
  rowCount?: number;
  /** Actual <ExhibitorDirectoryTableRow /> elements */
  children: React.ReactNode;
  /** Optional toolbar rendered above the table (e.g. filters) */
  toolbar?: React.ReactNode;
};

// Design tokens
const BASE_ACCENT = '#ffa206'; // primary pink from the banner
const GROUP_COLOR_PALETTE = [
  '#0f4c81', // deep blue
  '#0ea5a4', // teal
  '#f59e0b', // amber
  '#10b981', // green
  '#2563eb', // blue
  '#7c3aed', // violet
  '#ef4444', // red
  '#f97316', // orange
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#e11d48', // pink red
  '#ffa206', // banner pink
];

function pickColor(key?: string | null, idx = 0) {
  if (!key) return GROUP_COLOR_PALETTE[idx % GROUP_COLOR_PALETTE.length];
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return GROUP_COLOR_PALETTE[sum % GROUP_COLOR_PALETTE.length];
}

function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ----------------------------------------------------------------------

export default function ExhibitorDirectoryTableView({
  headLabel,
  table,
  loading,
  notFound,
  totalElements,
  rowCount = 0,
  children,
  toolbar,
}: Props) {
  const denseHeight = table.dense ? 52 : 72;
  const [noteOpen, setNoteOpen] = useState(false);

  return (
    <>
      {toolbar}

      <div
        className="mb-6 rounded-xl overflow-hidden mx-5"
        style={{ border: `1px solid ${hexToRgba(BASE_ACCENT, 0.2)}`, background: '#fff', boxShadow: `0 2px 12px ${hexToRgba(BASE_ACCENT, 0.06)}` }}
      >
        {/* Header / toggle */}
        <button
          type="button"
          onClick={() => setNoteOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200"
          style={{ background: noteOpen ? hexToRgba(BASE_ACCENT, 0.06) : hexToRgba(BASE_ACCENT, 0.03), borderBottom: noteOpen ? `1px solid ${hexToRgba(BASE_ACCENT, 0.15)}` : 'none' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: hexToRgba(BASE_ACCENT, 0.12) }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke={BASE_ACCENT} strokeWidth="1.8" />
                <rect x="9.1" y="8.5" width="1.8" height="6" rx="0.9" fill={BASE_ACCENT} />
                <circle cx="10" cy="6.2" r="1" fill={BASE_ACCENT} />
              </svg>
            </div>
            <div>

              <span className="text-sm font-bold tracking-wide" style={{ color: BASE_ACCENT }}>Note on &ldquo;Combined&rdquo; Product Category</span>
              <p className="text-sm text-gray-600 leading-relaxed">
                If an exhibitor is listed under the{' '}
                <span className="font-semibold px-1.5 py-0.5 rounded" style={{ background: hexToRgba(BASE_ACCENT, 0.09), color: BASE_ACCENT }}>&ldquo;Combined&rdquo;</span>{' '}
                product category within any Product Group, it indicates they are a manufacturer of multiple sub-categories (typically 2–3) within that specific group.
              </p>
            </div>
          </div>
          {noteOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
              <line x1="5" y1="10" x2="15" y2="10" stroke={BASE_ACCENT} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
              <line x1="10" y1="5" x2="10" y2="15" stroke={BASE_ACCENT} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="5" y1="10" x2="15" y2="10" stroke={BASE_ACCENT} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Body */}
        {noteOpen && (
          <div className="px-5 pb-5 pt-4">
            {/* <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      If an exhibitor is listed under the{' '}
                      <span className="font-semibold px-1.5 py-0.5 rounded" style={{ background: hexToRgba(BASE_ACCENT, 0.09), color: BASE_ACCENT }}>&ldquo;Combined&rdquo;</span>{' '}
                      category within any Product Group, it indicates they are a manufacturer of multiple sub-categories (typically 2–3) within that specific group.
                  </p> */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">For instance</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { group: 'Apparel & Fashion', desc: 'Menswear, Womenswear & Kidswear' },
                { group: 'Fabrics & Accessories', desc: 'Knitted and Woven products' },
                { group: 'Home Textiles', desc: 'Bed, Bath and Kitchen Linen' },
                { group: 'Fibres & Yarns', desc: 'Fiber, Filament and Recycled Yarns' },
                { group: 'Technical Textiles', desc: 'Fabric, Functional Wear and Footwear' },
                { group: 'Carpets & Floorcoverings', desc: 'Hand Knotted, Dari and Machine Made' },
              ].map(({ group, desc }) => (
                <div key={group} className="flex items-start gap-2 rounded-lg px-3 py-2.5" style={{ background: hexToRgba(BASE_ACCENT, 0.04), border: `1px solid ${hexToRgba(BASE_ACCENT, 0.10)}` }}>
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BASE_ACCENT, marginTop: 6 }} />
                  <div>
                    <span className="text-xs font-bold" style={{ color: BASE_ACCENT }}>{group}</span>
                    <span className="text-xs text-gray-500"> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={headLabel}
              rowCount={rowCount}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {loading
                ? Array.from({ length: table.rowsPerPage }, (_, index) => (
                  <TableRow key={index}>
                    {headLabel.map((col) => (
                      <TableCell key={col.id} maxWidth={col.id === 'name' ? 300 : 160}>
                        <Skeleton variant="text" sx={{ width: '80%' }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
                : children}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, totalElements)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={totalElements}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </>
  );
}
