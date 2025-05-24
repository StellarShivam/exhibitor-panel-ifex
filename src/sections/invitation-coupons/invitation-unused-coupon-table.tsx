import React from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';
import Label from 'src/components/label';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmptyContent from 'src/components/empty-content';
import { IInvitationCoupons } from 'src/types/invitation-coupons';

interface Props {
  coupons: IInvitationCoupons[];
}

export default function InvitationUnusedCouponTable({ coupons }: Props) {
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };

  console.log('coupons', coupons);

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: { xs: 300, md: 600 }, overflowY: 'auto' }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">Coupon Code</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Status</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Action</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons?.map((coupon, index) => (
            <TableRow key={index}>
              <TableCell>{coupon.couponCode}</TableCell>
              <TableCell>
                <Label variant="soft" color="info">
                  Unused
                </Label>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => handleCopy(coupon.couponCode)}
                >
                  Copy Code
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {coupons.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <EmptyContent />
                <Typography variant="subtitle2" color={'gray'} sx={{ mt: 2 }}>
                  No coupons available.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
