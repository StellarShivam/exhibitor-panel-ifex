import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

// import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFPhoneField,
} from 'src/components/hook-form';

import { IUserItem } from 'src/types/user';
import {
  usecreateExhibitorUser,
  useupdateExhibitorUser,
  useFileUpload,
  useGetExhibitorUsers,
} from 'src/api/team-management';
import { useEventContext } from 'src/components/event-context';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

const PERMISSION_OPTIONS = ['Team Management', 'Product Listing', 'Tasks and Booth Setup'];

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const { uploadFile } = useFileUpload();

  const { enqueueSnackbar } = useSnackbar();
  const { createExhibitorUser } = usecreateExhibitorUser();
  const { updateExhibitorUser } = useupdateExhibitorUser();
  const { eventData } = useEventContext();

  const { reFetchExhibitorUsers } = useGetExhibitorUsers(eventData?.state.exhibitorId);

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    designation: Yup.string().required('Designation is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // country: Yup.string().required('Country is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    // permissions: Yup.array().min(1, 'At least one permission is required'),
    // image: Yup.mixed<any>().nullable().required('Avatar is required'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      designation: currentUser?.designation || '',
      email: currentUser?.email || '',
      // country: currentUser?.country || '',
      phoneNumber: currentUser?.phone || '',
      // state: currentUser?.state || '',
      // city: currentUser?.city || '',
      // permissions: currentUser?.permissions || [],
      // image: currentUser?.profileUrl || null,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Reset form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    // if (data.image instanceof File) {
    //   try {
    //     const uploadResponse = await uploadFile(data.image);
    //     console.log('aaaaaaaaa : ', uploadResponse);
    //     data.image = uploadResponse.data.storeUrl;
    //   } catch (error) {
    //     console.error('Logo upload failed:', error);
    //     enqueueSnackbar('Failed to upload logo', { variant: 'error' });
    //     return;
    //   }
    // }

    try {
      const formData = {
        exhibitorId: eventData?.state.exhibitorId,
        eventId: eventData?.state.eventId,
        firstName: data.firstName,
        lastName: data.lastName,
        designation: data.designation,
        email: data.email,
        // country: data.country,
        phone: data.phoneNumber,
        // state: data.state,
        // city: data.city,
        // permissions: data.permissions,
        // image: data.image?.preview || data.image,
      };

      console.log(formData);

      if (currentUser) {
        const response = await updateExhibitorUser({
          ...formData,
          id: currentUser.id,
        });
        if (response?.data.status === 'success') {
          enqueueSnackbar('User updated successfully!');
          router.push(paths.dashboard.teamManagement.root);
        } else {
          enqueueSnackbar(response?.data?.message || 'Something went wrong', { variant: 'error' });
        }
      } else {
        const response = await createExhibitorUser(formData);
        if (response?.data.status === 'success') {
          enqueueSnackbar('User created successfully!');
          router.push(paths.dashboard.teamManagement.root);
        } else {
          console.log(response);
          enqueueSnackbar(response?.data?.message || 'Something went wrong', { variant: 'error' });
        }
      }
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error.message || 'Something went wrong', { variant: 'error' });
    }

    reFetchExhibitorUsers();
  });

  // const handleDrop = useCallback(
  //   (acceptedFiles: File[]) => {
  //     const file = acceptedFiles[0];

  //     const newFile = Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     });
  //     if (file) {
  //       setValue('image', newFile, { shouldValidate: true });
  //     }
  //   },
  //   [setValue]
  // );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}> */}
        {/* {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )} */}

        {/* <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="image"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box> */}

        {/* {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )} */}

        {/* <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}

        {/* {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )} */}
        {/* </Card>
        </Grid> */}

        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name*" />
              <RHFTextField name="lastName" label="Last Name*" />
              <RHFTextField name="designation" label="Designation*" />
              <RHFTextField
                name="email"
                label="Email Address*"
                disabled={Boolean(currentUser)}
                InputProps={{
                  sx: {
                    bgcolor: (theme) =>
                      currentUser ? theme.palette.background.neutral : 'transparent',
                  },
                }}
              />
              {/* <RHFAutocomplete
                name="country"
                type="country"
                label="Country"
                placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              /> */}
              <RHFPhoneField name="phoneNumber" label="Phone Number*" />
              {/* <RHFTextField name="state" label="State" /> */}
              {/* <RHFTextField name="city" label="City" /> */}
            </Box>

            {/* <Box sx={{ mt: 3, ml: 1 }}>
              <FormLabel
                component="legend"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'text.primary',
                }}
              >
                Permissions
              </FormLabel>
              <Controller
                name="permissions"
                control={control}
                render={({ field }) => (
                  <FormGroup>
                    {PERMISSION_OPTIONS.map((permission) => (
                      <FormControlLabel
                        key={permission}
                        control={
                          <Checkbox
                            checked={field.value?.includes(permission)}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...(field.value || []), permission]
                                : (field.value || []).filter((p: string) => p !== permission);
                              field.onChange(newPermissions);
                            }}
                          />
                        }
                        label={permission}
                      />
                    ))}
                  </FormGroup>
                )}
              />
            </Box> */}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Add Member' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
