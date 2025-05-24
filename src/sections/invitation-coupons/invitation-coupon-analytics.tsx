import { Card, CardHeader, Button, Stack, Box } from '@mui/material';
import Chart, { useChart } from 'src/components/chart';
import { useTheme } from '@mui/material/styles';

interface Props {
  totalCoupons: number;
  usedCoupons: number;
}
export default function InvitationCouponAnalytics({ totalCoupons, usedCoupons }: Props) {
  const theme = useTheme();
  const chartData = [totalCoupons - usedCoupons, usedCoupons];
  const chartLabels = ['Remaining Coupons', 'Used Coupons'];
  const chartOptions = useChart({
    labels: chartLabels,
    colors: [theme.palette.primary.main, theme.palette.info.main],
    plotOptions: {
      pie: {
        donut: {
          size: '90%', // Adjust the size of the donut
        },
      },
    },
    legend: {
      show: false, // Hide the default legend
    },
  });

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader title="Invitation Coupons" />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{ p: 3 }}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Chart Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Chart
            type="donut"
            series={chartData}
            options={chartOptions}
            height={300}
            width={'100%'}
          />
        </Box>

        {/* Custom Legend Section */}
          <Stack direction={{ xs: 'row', md: 'column' }} spacing={2} alignItems="flex-start">
            <Box>
              <Box
                sx={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              >
                {totalCoupons - usedCoupons}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '100%',
                    backgroundColor: theme.palette.primary.main,
                    marginRight: 1,
                  }}
                />
                <Box sx={{ fontSize: 14, color: theme.palette.text.primary }}>
                  Remaining&nbsp;Coupons
                </Box>
              </Box>
            </Box>

            <Box>
              <Box sx={{ fontSize: 32, fontWeight: 'bold', color: theme.palette.info.main, mb: 2 }}>
                {usedCoupons}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '100%',
                    backgroundColor: theme.palette.info.main,
                    marginRight: 1,
                  }}
                />
                <Box sx={{ fontSize: 14, color: theme.palette.text.primary }}>
                  Used&nbsp;Coupons
                </Box>
              </Box>
            </Box>
          </Stack>
      </Stack>
    </Card>
  );
}
