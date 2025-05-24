'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { _userList } from 'src/_mock';

import { useState, useEffect } from 'react';

import { Button, LinearProgress } from '@mui/material';

import { useGetExhibitor } from 'src/api/exhibitor-profile';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IExhibitorItem } from 'src/types/team';

import { useEventContext } from 'src/components/event-context';
import { Box, Card, CardContent, Grid, TextField, Typography } from '@mui/material';

export default function FaciaEditView() {
  const settings = useSettingsContext();
  const [currentUser, setCurrentUser] = useState<IExhibitorItem | undefined>(undefined);
  const { eventData } = useEventContext();

  const { exhibitor, exhibitorLoading } = useGetExhibitor(eventData?.state.exhibitorId);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Facia Information"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Facia',
            href: paths.dashboard.facia,
          },
          { name: currentUser?.companyName || 'Edit Profile' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Grid container spacing={3}>
        {/* Left Column: Input Field */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Facia Name
            </Typography>
            <TextField
              fullWidth
              label="Enter Facia Name"
              variant="outlined"
              // value={currentUser?.faciaName || ''}
              // onChange={(e) => setCurrentUser({ ...currentUser, faciaName: e.target.value })}
            />
          </Box>
          <Button 
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              // Handle save action
              console.log('Save button clicked');
            }}
            >
            Save
            </Button>
        </Grid>

        {/* Right Column: Card with Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facia Details
              </Typography>
              <Typography variant="body1">
                <strong>Hall No:</strong> { 'Ground Floor Hall 4'}
              </Typography>
              <Typography variant="body1">
                <strong>Stall No:</strong> {'14'}
              </Typography>
              <Typography variant="body1">
                <strong>Scheme:</strong> { 'Shell'}
              </Typography>
              <Typography variant="body1">
                <strong>Area:</strong> {'80 sq. mtr.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
