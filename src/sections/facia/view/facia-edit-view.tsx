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
  const [faciaNameError, setFaciaNameError] = useState<string>('');

  const { exhibitor, exhibitorLoading } = useGetExhibitor(eventData?.state.exhibitorId);

  const handleFaciaNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 30) {
      setFaciaNameError('Maximum 30 characters allowed');
    } else {
      setFaciaNameError('');
    }
    setCurrentUser({ ...currentUser, faciaName: value });
  };

  const isSaveDisabled = faciaNameError !== '' || !currentUser?.faciaName;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Fascia Information"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Fascia',
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
              Fascia Name
            </Typography>
            <TextField
              fullWidth
              label="Enter Fascia Name (Max 30 characters)"
              variant="outlined"
              value={currentUser?.faciaName || ''}
              onChange={handleFaciaNameChange}
              error={faciaNameError !== ''}
              helperText={faciaNameError}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isSaveDisabled}
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
                Fascia Details
              </Typography>
              <Typography variant="body1">
                <strong>Hall No:</strong> {currentUser?.hallNo || 'Ground Floor Hall 4'}
              </Typography>
              <Typography variant="body1">
                <strong>Stall No:</strong> {currentUser?.stallNo || '1'}
              </Typography>
              <Typography variant="body1">
                <strong>Scheme:</strong> {currentUser?.scheme || 'Shell'}
              </Typography>
              <Typography variant="body1">
                <strong>Area:</strong> {currentUser?.area || '80 sq. mtr.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
