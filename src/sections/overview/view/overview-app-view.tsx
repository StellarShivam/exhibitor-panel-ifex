'use client';

import Image from 'next/image';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import {
  useGetTeamMembersCount,
  useGetVisitorsAndLeadsCount,
  useGetSessions,
} from 'src/api/overview';

import { useEventContext } from 'src/components/event-context';
import { _bookingsOverview } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppTasks from '../app-tasks';
import Visitors from '../app-visitors';
import AppWelcome from '../app-welcome';
import AppSessions from '../app-sessions';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  const { eventData } = useEventContext();

  const { exhibitorUsersCount, exhibitorUsers, exhibitorLoading } = useGetTeamMembersCount(
    eventData?.state?.exhibitorId
  );
  const {
    visitorsCount,
    leadsCount,
    totalCount,
    loading: visitorLoading,
  } = useGetVisitorsAndLeadsCount(eventData?.state?.exhibitorId);

  const visitorsData = [
    {
      status: 'Booth Visitors',
      quantity: visitorsCount,
      value: totalCount > 0 ? (visitorsCount / totalCount) * 100 : 0,
    },
    {
      status: 'Captured leads',
      quantity: leadsCount,
      value: totalCount > 0 ? (leadsCount / totalCount) * 100 : 0,
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <AppWelcome
            title={`Welcome back 👋 \n `}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={
              <Image
                src="/assets/illustrations/characters/character_3.png"
                alt="welcome"
                width={60}
                height={120}
              />
            }
            // action={
            //   <Button variant="contained" color="primary">
            //     Go Now
            //   </Button>
            // }
          />
        </Grid>

        {/* <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid> */}

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Visitors"
            percent={2.6}
            total={totalCount}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Team Members"
            percent={3}
            total={exhibitorUsersCount}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <AppTasks />
        </Grid>

        <Grid xs={12} md={6}>
          <Stack spacing={3}>
            <Visitors title="Visitors" data={visitorsData} />
            <AppSessions />
          </Stack>
        </Grid>

        {/* <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Downloads"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Current Download"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area Installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Asia',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'America',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Asia',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'America',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="New Invoice"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid> */}
      </Grid>
    </Container>
  );
}
