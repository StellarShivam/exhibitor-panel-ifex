import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface PaymentCalculationTableProps {
  totalProductIndexNumbers: number;
  logoOption: string;
  totalNumberOfWords: number;
}

export default function PaymentCalculationTable({
  totalProductIndexNumbers,
  logoOption,
  totalNumberOfWords,
}: PaymentCalculationTableProps) {
  const subtotal =
    (totalProductIndexNumbers || 0) * 5500 +
    (logoOption === 'with_logo' ? 1100 : 0) +
    (totalNumberOfWords || 0) * 55;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <Card sx={{ mt: 3, mb: 3, p: 3, backgroundColor: '#f5f5f5', boxShadow: 2 }}>
      <Typography variant="h6" align="left" sx={{ mb: 2, fontWeight: 'bold', letterSpacing: 1 }}>
        Payment Calculations
      </Typography>
      <Table size="small" sx={{ mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 16 }}></TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 16 }}>Amount<br/>(in Rs)</TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 16 }}>TOTAL<br/>(in Rs)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="left">1) Total product index numbers</TableCell>
            <TableCell align="left">{totalProductIndexNumbers} x 5500</TableCell>
            <TableCell align="left">
              {totalProductIndexNumbers > 0 ? `${totalProductIndexNumbers * 5500}` : '-'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">2) Company Logo (Single Color)</TableCell>
            <TableCell align="left">{logoOption === 'with_logo' ? '1 x 1100' : '0 x 1100'}</TableCell>
            <TableCell align="left">
              {logoOption === 'with_logo' ? '1100' : '-'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">3) Total number of words</TableCell>
            <TableCell align="left">{totalNumberOfWords} x 55</TableCell>
            <TableCell align="left">
              {totalNumberOfWords > 0 ? `${totalNumberOfWords * 55}` : '-'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left" colSpan={2} sx={{ fontWeight: 'bold', fontSize: 15, backgroundColor: '#f0f0f0' }}>Sub-Total</TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 15, backgroundColor: '#f0f0f0' }}>
              {subtotal > 0 ? `${subtotal}` : '-'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left" colSpan={2} sx={{ backgroundColor: '#f0f0f0' }}>GST* @ 18%</TableCell>
            <TableCell align="left" sx={{ backgroundColor: '#f0f0f0' }}>
              {subtotal > 0 ? `${gst.toFixed(2)}` : '-'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left" colSpan={2} sx={{ fontWeight: 'bold', fontSize: 16, backgroundColor: '#e0e0e0' }}>TOTAL</TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 16, backgroundColor: '#e0e0e0' }}>
              {subtotal > 0 ? `${total.toFixed(2)}` : '-'}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="caption" align="left" sx={{ fontStyle: 'italic', display: 'block' }}>
        *Subject to be changed as per government norms.
      </Typography>
    </Card>
  );
}
