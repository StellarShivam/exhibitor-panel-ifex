import React from 'react';
import {
  Box,
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
import EmptyContent from 'src/components/empty-content';
import { IInvitationCoupons } from 'src/types/invitation-coupons';

interface Props {
  coupons: IInvitationCoupons[];
}

export default function InvitationUsedCouponTable({ coupons }: Props) {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: { xs: 300, md: 600 }, overflowY: 'auto' }}>
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
              <Typography variant="subtitle2">Used By</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">User Details</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.map((coupon, index) => (
            <TableRow key={index}>
              <TableCell
                sx={{
                  color: 'text.primary',
                  fontSize: 14,
                }}
              >
                {coupon.couponCode}
              </TableCell>
              <TableCell>
                <Label variant="soft" color="success">
                  Used
                </Label>
              </TableCell>
              <TableCell
                sx={{
                  color: 'text.primary',
                  fontSize: 14,
                }}
              >
                {coupon.userName}
              </TableCell>
              <TableCell>
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: 14,
                  }}
                >
                  {coupon.email}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                  }}
                >
                  {coupon.phone}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
          {coupons?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <EmptyContent />
                <Typography variant="subtitle2" color="gray">
                  No used coupons available.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
