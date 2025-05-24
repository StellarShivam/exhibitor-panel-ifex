'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { Tab, Tabs, Badge, Grid } from '@mui/material';
import Label from 'src/components/label';
import InvitationUnusedCouponTable from '../invitation-unused-coupon-table';
import InvitationCouponAnalytics from '../invitation-coupon-analytics';
import InvitationUsedCouponTable from '../invitation-used-coupon-table';
import { useEventContext } from 'src/components/event-context';
import { useGetCoupons } from 'src/api/invitation-coupons';
import { useSetState } from 'src/hooks/use-set-state';
import { IInvitationCoupons } from 'src/types/invitation-coupons';

// ----------------------------------------------------------------------

export default function InvitationCouponsListView() {
  const settings = useSettingsContext();
  const [activeTab, setActiveTab] = useState('unused');
  const [usedCoupons, setUsedCoupons] = useState<IInvitationCoupons[]>([]);
  const [unusedCoupons, setUnusedCoupons] = useState<IInvitationCoupons[]>([]);

  const { exhibitorId } = useEventContext().eventData.state;

  const { coupons } = useGetCoupons(exhibitorId);

  const couponsData = useSetState<IInvitationCoupons[]>([]);

  useEffect(() => {
    if (coupons) {
      couponsData.setState(coupons);
      setUsedCoupons(coupons.filter((coupon) => coupon.userName !== null));
      setUnusedCoupons(coupons.filter((coupon) => coupon.userName === null));
    }
  }, [coupons]);

  const unusedCount = unusedCoupons?.length; // Dynamically calculate unused count
  const usedCount = usedCoupons?.length; // Dynamically calculate used count

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Invitation Coupons </Typography>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          pt: 2.5,
          px: 2.5,
        }}
      >
        <Tab
          key={'unused'}
          value={'unused'}
          label={'Unused '}
          iconPosition="end"
          icon={
            <Label variant={'soft'} color={'info'}>
              {unusedCount}
            </Label>
          }
        />
        <Tab
          key={'used'}
          value={'used'}
          label={'Used '}
          iconPosition="end"
          icon={
            <Label variant={'soft'} color={'success'}>
              {usedCount}
            </Label>
          }
        />
      </Tabs>

      <Grid container mt={0} spacing={2} alignContent={'space-between'} width={'100&'}>
        <Grid item xs={12} md={6}>
          {activeTab === 'unused' && <InvitationUnusedCouponTable coupons={unusedCoupons} />}
          {activeTab === 'used' && <InvitationUsedCouponTable coupons={usedCoupons} />}
        </Grid>
        <Grid item xs={12} md={6}>
          <InvitationCouponAnalytics
            totalCoupons={unusedCount + usedCount}
            usedCoupons={usedCount}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
