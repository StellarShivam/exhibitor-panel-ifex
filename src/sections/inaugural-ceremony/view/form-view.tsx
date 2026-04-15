'use client';
import * as Yup from 'yup';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useExhibitorForm } from 'src/api/forms';
import { useGetExhibitor } from 'src/api/exhibitor-profile';
import { useEventContext } from 'src/components/event-context';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { useDebounce } from 'src/hooks/use-debounce';
import FormProvider, {
  RHFPhoneField,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import Upload from 'src/components/upload/upload';
import { fData } from 'src/utils/format-number';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { useFileUpload } from 'src/api/team-management';
import { useAddAttendee, useCheckAttendee } from 'src/api/inauguralAttendee';
import InfoIcon from '@mui/icons-material/Info';
import { useGetEventList1 } from 'src/api/event';

const baseDefaultValues = {
  companyName: '',
  hallNo: '',
  stallNo: '',
  title: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  designation: '',
  gender: '',
  addressLine1: '',
  country: '',
  state: '',
  city: '',
  postalCode: '',
  aadhaarNumber: '',
  aadhaarFrontView: [],
  aadhaarBackView: [],
};

const InauguralCeremonyForm: NextPage = () => {
  const settings = useSettingsContext();
  const { eventData } = useEventContext();
  const { exhibitor } = useGetExhibitor(eventData?.state.exhibitorId);
  const { exhibitorForm } = useExhibitorForm(exhibitor?.supportEmail, eventData?.state.eventId);
  const { events, reFetchEventList } = useGetEventList1();
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const { uploadFile } = useFileUpload();
  const { addAttendee } = useAddAttendee();
  const { checkAttendee } = useCheckAttendee();

  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const formatAllowedTypes = (allowed?: { [key: string]: string[] }): string => {
    if (!allowed) return '';
    const allExts = Object.values(allowed).flat();
    const uniqueExts = Array.from(new Set(allExts));
    return uniqueExts.map((ext) => `*${ext}`).join(', ');
  };

  const ExhibitorSchema = Yup.object().shape({
    companyName: Yup.string(),
    hallNo: Yup.string(),
    stallNo: Yup.string(),

    title: Yup.string().required('Title is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string().required('Phone number is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    designation: Yup.string().required('Designation is required'),
    gender: Yup.string().required('Gender is required'),

    addressLine1: Yup.string().required('Address line 1 is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal code is required'),
    aadhaarNumber: Yup.string()
      .matches(/^[2-9]{1}[0-9]{11}$/, 'Invalid Aadhaar number')
      .required('Aadhaar number is required'),
    // aadhaarFrontView: Yup.array().of(Yup.string()).min(1, 'Aadhaar front view is required'),
    // aadhaarBackView: Yup.array().of(Yup.string()).min(1, 'Aadhaar back view is required'),
  });

  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

  const loadDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(
      `draftInauguralCeremonyForm_${eventData?.state?.exhibitorUserId}`
    );
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft);

        let countryName = parsedData.country || '';
        let stateName = parsedData.state || '';
        let cityName = parsedData.city || '';

        // Resolve country
        if (parsedData.country) {
          const defaultCountry = Country.getAllCountries().find(
            (country) => country.name === parsedData.country
          );
          if (defaultCountry) {
            countryName = defaultCountry.name;
            setSelectedCountry(defaultCountry);

            // Resolve state
            if (parsedData.state) {
              const countryStates = State.getStatesOfCountry(defaultCountry.isoCode);
              const defaultState = countryStates.find((state) => state.name === parsedData.state);
              if (defaultState) {
                stateName = defaultState.name;
                setSelectedState(defaultState);
                // Resolve city
                if (parsedData.city) {
                  const stateCities = City.getCitiesOfState(
                    defaultCountry.isoCode,
                    defaultState.isoCode
                  );
                  const defaultCity = stateCities.find((city) => city.name === parsedData.city);
                  if (defaultCity) {
                    cityName = defaultCity.name;
                    setSelectedCity(defaultCity);
                  }
                }
              }
            }
          }
        }

        return {
          ...baseDefaultValues,
          ...parsedData,

          country: countryName,
          state: stateName,
          city: cityName,
          // aadhaarFrontView: [],
          // aadhaarBackView: [],
        };
      } catch (error) {
        console.error('Error parsing saved draft:', error);
        return baseDefaultValues;
      }
    }
    return {
      ...baseDefaultValues,
      companyName: exhibitorForm?.companyOrganizationName || '',
      hallNo: exhibitorForm?.hallNo || '',
      stallNo: exhibitorForm?.stallNo || '',
    };
  }, [exhibitorForm, eventData?.state?.exhibitorUserId]);

  // Memoized initialValues to avoid recalculation on every render
  const initialValues = useMemo(() => loadDraft(), [loadDraft, exhibitorForm]);

  const methods = useForm({
    resolver: yupResolver(ExhibitorSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (exhibitorForm) {
      const updatedValues = loadDraft();
      reset(updatedValues);
    }
  }, [exhibitorForm, reset, loadDraft]);

  const values = watch();

  const debouncedPhone = useDebounce(values?.phone, 700);
  const debouncedEmail = useDebounce(values?.email, 700);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
      if (
        !selectedState ||
        !countryStates.some((state: IState) => state.isoCode === selectedState.isoCode)
      ) {
        setSelectedState(null);
        setSelectedCity(null);
        setCities([]);
      }
    }
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
      setCities(stateCities);
      if (!selectedCity || !stateCities.some((city: ICity) => city.name === selectedCity.name)) {
        setSelectedCity(null);
      }
    }
  }, [selectedCountry, selectedState, selectedCity]);

  useEffect(() => {
    const checkAttendeeResponse = async () => {
      if (!debouncedPhone || debouncedPhone.length < 10) {
        return;
      }

      try {
        const response = await checkAttendee({
          eventId: eventData?.state?.eventId,
          phone: debouncedPhone,
        });
        console.log('CheckAttendee response:', response);

        if (response?.status === 400) {
          setError('phone', { message: 'Attendee with this phone number already exists' });
        }
      } catch (error) {
        console.error('Error checking attendee:', error);
      }
    };

    checkAttendeeResponse();
  }, [debouncedPhone]);

  useEffect(() => {
    const checkAttendeeResponse = async () => {
      if (!debouncedEmail) {
        return;
      }

      try {
        const response = await checkAttendee({
          eventId: eventData?.state?.eventId,
          email: debouncedEmail,
        });
        console.log('CheckAttendee response:', response);

        if (response?.status === 400) {
          setError('email', { message: 'Attendee with this email already exists' });
        }
      } catch (error) {
        console.error('Error checking attendee:', error);
      }
    };

    checkAttendeeResponse();
  }, [debouncedEmail]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[], fieldName: string) => {
      const newFiles = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (newFiles?.length > 0) {
        try {
          enqueueSnackbar('Uploading file...', {
            variant: 'info',
          });
          const uploadedFiles = await uploadFile(newFiles?.[0]);

          if (uploadedFiles?.status === 'success') {
            setValue(
              fieldName,
              uploadedFiles?.data?.storeUrl ? [uploadedFiles?.data?.storeUrl] : [],
              {
                shouldValidate: true,
              }
            );
            enqueueSnackbar(uploadedFiles?.message || 'File uploaded successfully', {
              variant: 'success',
            });
          } else {
            enqueueSnackbar('Error uploading file', { variant: 'error' });
          }
        } catch (error) {
          enqueueSnackbar('Error uploading file', { variant: 'error' });
        }
      }
    },
    [setValue, uploadFile]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string, fieldName: string) => {
      const filtered =
        values[fieldName] && values[fieldName]?.filter((file: File | string) => file !== inputFile);
      setValue(fieldName, filtered);
    },
    [setValue, values]
  );

  const handleRemoveAllFiles = useCallback(
    (fieldName: string) => {
      setValue(fieldName, []);
    },
    [setValue]
  );

  const extractFileNameFromUrl = (url: string): string => {
    const fileName = url?.split('/').pop() || '';
    return decodeURIComponent(fileName.split('_').slice(1).join('_'));
  };

  const isFieldUploadDisabled = (fieldName: string, fieldType: string) => {
    const fieldValue = values[fieldName];
    if (fieldType === 'file') {
      return fieldValue && fieldValue.length >= 1;
    }
    return false;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        exhibitorId: eventData?.state?.exhibitorId,
        email: data.email,
        phone: data.phone,
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        address:
          `${data.addressLine1}, ${data.city}, ${data.state}, ${data.country}, ${data.postalCode}`.trim(),
        designation: data.designation,
        gender: data.gender,
        documents: {
          aadhaarNumber: data.aadhaarNumber,
          // aadhaarFrontView: data.aadhaarFrontView,
          // aadhaarBackView: data.aadhaarBackView,
          // addressLine1: data.addressLine1,
          // city: data.city,
          // country: data.country,
          // state: data.state,
          // postalCode: data.postalCode,
        },
        status: 'SUBMITTED',
      };
      const response = await addAttendee(payload);
      console.log('AddAttendee response:', response);
      if (response?.data?.status === 'success') {
        enqueueSnackbar('Attendee added successfully!');
        localStorage.removeItem(`draftInauguralCeremonyForm_${eventData?.state?.exhibitorUserId}`);
        const resetValues = {
          ...baseDefaultValues,
          companyName: exhibitorForm?.companyOrganizationName || '',
          hallNo: exhibitorForm?.hallNo || '',
          stallNo: exhibitorForm?.stallNo || '',
        };
        reset(resetValues);
        // Clear selected location states
        setSelectedCountry(null);
        setSelectedState(null);
        setSelectedCity(null);
        setStates([]);
        setCities([]);
        reFetchEventList();
      } else {
        enqueueSnackbar(response?.response?.data?.message || 'Error adding attendee!', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar('Form submission failed!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  });

  const handleSaveDraft = useCallback(() => {
    const formData = methods.getValues();

    // Serialize image fields before saving
    // const aadhaarFrontView = serializeFiles(formData.aadhaarFrontView || []);
    // const aadhaarBackView = serializeFiles(formData.aadhaarBackView || []);

    const dataToSave = {
      ...formData,
      //   aadhaarFrontView: [],
      //   aadhaarBackView: [],
    };

    localStorage.setItem(
      `draftInauguralCeremonyForm_${eventData?.state?.exhibitorUserId}`,
      JSON.stringify(dataToSave)
    );
    enqueueSnackbar('Draft saved!');
  }, [methods, eventData?.state?.exhibitorUserId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Add Attendee"
        links={[
          {
            name: 'VVIP Registration',
            href: paths.dashboard.inauguralCeremony.form,
          },
          {
            name: 'Add Attendee',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Stack
        direction="row"
        // alignItems="center"
        gap={2}
        // justifyContent="space-between"
        sx={{
          backgroundColor: '#00B8D929',
          color: 'info.main',
          border: '2px solid #00B8D920',
          borderRadius: 1,
          px: 2,
          py: 1,
          mb: 3,
          width: '100%',
        }}
      >
        <Stack direction="row" alignItems="start" spacing={1}>
          {/* <InfoIcon sx={{ color: 'info.main' }} /> */}
          <Typography variant="subtitle2" sx={{ color: 'info.main' }}>
            <strong>•</strong> Total Attendees Allowed :{' '}
            <strong>
              {events.find((event) => event.eventId === eventData.state.eventId)?.totalNomineeCount}
            </strong>
          </Typography>
        </Stack>
        <Typography variant="subtitle2" sx={{ color: 'info.main', ml: 4 }}>
          <strong>•</strong> Attendees Added:{' '}
          <strong>
            {events.find((event) => event.eventId === eventData.state.eventId)?.usedNomineeCount}
          </strong>
        </Typography>
      </Stack>
      <Card sx={{ p: 3 }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Company Details</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="companyName" label="Company Name" disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="hallNo" label="Hall No" disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="stallNo" label="Stall No" disabled />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Attendee Details</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <RHFSelect name="title" label="Title*">
                <MenuItem value="Mr">Mr</MenuItem>
                <MenuItem value="Mrs">Mrs</MenuItem>
                <MenuItem value="Ms">Ms</MenuItem>
                <MenuItem value="Dr">Dr</MenuItem>
                <MenuItem value="Prof">Prof</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={5}>
              <RHFTextField name="firstName" label="First Name*" />
            </Grid>
            <Grid item xs={12} md={5}>
              <RHFTextField name="lastName" label="Last Name*" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="email" label="Email*" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFPhoneField name="phone" label="Mobile Number*" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="designation" label="Designation*" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFRadioGroup
                name="gender"
                label="Gender*"
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
                row
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="addressLine1" label="Address Line 1*" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={'country'}
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    options={Country.getAllCountries()}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    value={selectedCountry}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.name || '');
                      setSelectedCountry(newValue);
                    }}
                    // disabled={}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.isoCode}>
                        {option.name} ({option.isoCode})
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country*"
                        placeholder="Select Country*"
                        error={!!methods.formState.errors['country']}
                        helperText={methods.formState.errors['country']?.message}
                        InputProps={{
                          ...params.InputProps,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={'state'}
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    options={states}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    value={selectedState}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.name || '');
                      setSelectedState(newValue);
                    }}
                    disabled={!selectedCountry}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.isoCode}>
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="State*"
                        placeholder={selectedCountry ? 'Select State*' : 'Select Country First'}
                        error={!!methods.formState.errors['state']}
                        helperText={methods.formState.errors['state']?.message}
                        InputProps={{
                          ...params.InputProps,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={'city'}
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    options={cities}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    value={selectedCity}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.name || '');
                      setSelectedCity(newValue);
                    }}
                    disabled={!selectedState}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} key={option.name}>
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City*"
                        placeholder={selectedState ? 'Select City*' : 'Select State First'}
                        error={!!methods.formState.errors['city']}
                        helperText={methods.formState.errors['city']?.message}
                        InputProps={{
                          ...params.InputProps,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="postalCode" label="Postal Code*" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="aadhaarNumber" label="Aadhaar Number*" />
            </Grid>
            <Grid item xs={12} />
            {/* <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Aadhaar Front View*
              </Typography>
              <Controller
                name="aadhaarFrontView"
                control={methods.control}
                render={({ field: controllerField, fieldState: { error } }) => (
                  <div>
                    <Upload
                      multiple
                      maxSize={4194304}
                      files={[]}
                      {...{
                        onDrop: (acceptedFiles: File[]) =>
                          handleDrop(acceptedFiles, 'aadhaarFrontView'),
                        onRemove: (inputFile: File | string) =>
                          handleRemoveFile(inputFile, 'aadhaarFrontView'),
                        // onRemoveAll: () => handleRemoveAllFiles(field.name),
                      }}
                      disabled={isFieldUploadDisabled('aadhaarFrontView', 'file')}
                      accept={{
                        'image/jpeg': ['.jpeg', '.jpg'],
                        'image/png': ['.png'],
                        'image/webp': ['.webp'],
                      }}
                      helperText={
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 3,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color: error ? 'error.main' : 'text.disabled',
                          }}
                        >
                          {error ? (
                            error?.message
                          ) : (
                            <>
                              Allowed{' '}
                              {formatAllowedTypes({
                                'image/jpeg': ['.jpeg', '.jpg'],
                                'image/png': ['.png'],
                                'image/webp': ['.webp'],
                              })}
                              <br /> max size of {fData(4194304)}
                            </>
                          )}
                        </Typography>
                      }
                      error={!!error}
                    />
                  </div>
                )}
              />
              {values.aadhaarFrontView && values.aadhaarFrontView?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Uploaded File:
                  </Typography>
                  {values.aadhaarFrontView?.map((file: any, index: number) => (
                    <Stack direction="row" justifyContent="space-between" spacing={1} key={index}>
                      <Typography
                        sx={{
                          color: 'primary.main',
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        }}
                        onClick={() => window.open(file, '_blank')}
                      >
                        {extractFileNameFromUrl(file)}
                      </Typography>
                      <Button
                        color="inherit"
                        variant="outlined"
                        size="small"
                        onClick={() => handleRemoveAllFiles('aadhaarFrontView')}
                      >
                        Remove
                      </Button>
                    </Stack>
                  ))}
                </Box>
              )}
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Aadhaar Back View*
              </Typography>
              <Controller
                name="aadhaarBackView"
                control={methods.control}
                render={({ field: controllerField, fieldState: { error } }) => (
                  <div>
                    <Upload
                      multiple
                      maxSize={4194304}
                      files={[]}
                      {...{
                        onDrop: (acceptedFiles: File[]) =>
                          handleDrop(acceptedFiles, 'aadhaarBackView'),
                        onRemove: (inputFile: File | string) =>
                          handleRemoveFile(inputFile, 'aadhaarBackView'),
                        // onRemoveAll: () => handleRemoveAllFiles(field.name),
                      }}
                      disabled={isFieldUploadDisabled('aadhaarBackView', 'file')}
                      accept={{
                        'image/jpeg': ['.jpeg', '.jpg'],
                        'image/png': ['.png'],
                        'image/webp': ['.webp'],
                      }}
                      helperText={
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 3,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color: error ? 'error.main' : 'text.disabled',
                          }}
                        >
                          {error ? (
                            error?.message
                          ) : (
                            <>
                              Allowed{' '}
                              {formatAllowedTypes({
                                'image/jpeg': ['.jpeg', '.jpg'],
                                'image/png': ['.png'],
                                'image/webp': ['.webp'],
                              })}
                              <br /> max size of {fData(4194304)}
                            </>
                          )}
                        </Typography>
                      }
                      error={!!error}
                    />
                  </div>
                )}
              />
              {values.aadhaarBackView && values.aadhaarBackView?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Uploaded File:
                  </Typography>
                  {values.aadhaarBackView?.map((file: any, index: number) => (
                    <Stack direction="row" justifyContent="space-between" spacing={1} key={index}>
                      <Typography
                        sx={{
                          color: 'primary.main',
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        }}
                        onClick={() => window.open(file, '_blank')}
                      >
                        {extractFileNameFromUrl(file)}
                      </Typography>
                      <Button
                        color="inherit"
                        variant="outlined"
                        size="small"
                        onClick={() => handleRemoveAllFiles('aadhaarBackView')}
                      >
                        Remove
                      </Button>
                    </Stack>
                  ))}
                </Box>
              )}
            </Grid> */}
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:save-fill" />}
              type="button"
              onClick={() => handleSaveDraft()}
            >
              Save As Draft
            </Button>
            <LoadingButton
              variant="contained"
              type="submit"
              startIcon={<Iconify icon="eva:checkmark-fill" />}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </Container>
  );
};

export default InauguralCeremonyForm;
