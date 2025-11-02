import * as Yup from 'yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Iconify from 'src/components/iconify';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { capitalizeFirstLetter } from 'src/utils/change-case';

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

import {
  usecreateExhibitorUser,
  useupdateExhibitorUser,
  useFileUpload,
  useGetExhibitorUsers,
} from 'src/api/team-management';
import { useEventContext } from 'src/components/event-context';
import { IExhibitorItem } from 'src/types/team';
import { useGetExhibitor, useupdateExhibitor } from 'src/api/exhibitor-profile';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IExhibitorItem;
};

const socialLinks = [
  {
    type: 'facebook',
    icon: 'eva:facebook-fill',
    color: '#1877F2',
  },
  // {
  //   type: 'twitter',
  //   icon: 'eva:twitter-fill',
  //   color: '#DF3E30',
  // },
  {
    type: 'linkedin',
    icon: 'eva:linkedin-fill',
    color: '#006097',
  },
  // {
  //   type: 'instagram',
  //   icon: 'ant-design:instagram-filled',
  //   color: '#1C9CEA',
  // },
  {
    type: 'youtube',
    icon: 'ant-design:youtube-filled',
    color: '#FF0000',
  },
  // {
  //   type: 'website',
  //   icon: 'ant-design:global',
  //   color: '#FF0000',
  // },
];

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const { uploadFile } = useFileUpload();

  const { enqueueSnackbar } = useSnackbar();

  const { updateExhibitor } = useupdateExhibitor();

  const { eventData } = useEventContext();

  const NewUserSchema = Yup.object().shape({
    companyName: Yup.string(),
    companyAddress: Yup.string(),
    gstNo: Yup.string(),
    panNo: Yup.string(),
    about: Yup.string(),
    directorName: Yup.string(),
    supportEmail: Yup.string().email('Email must be a valid email address'),
    supportPhone: Yup.string(),
    facebookUrl: Yup.string(),
    linkedinUrl: Yup.string(),
    youtubeUrl: Yup.string(),
    videos: Yup.array(Yup.string().required('This is required').url('Must be a valid URL')),
    // permissions: Yup.array().min(1, 'At least one permission is required'),
    imgUrl: Yup.mixed<any>().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      companyName: currentUser?.companyName || '',
      companyAddress: currentUser?.companyAddress || '',
      gstNo: currentUser?.gstNo || '',
      panNo: currentUser?.panNo || '',
      about: currentUser?.about || '',
      directorName: currentUser?.directorName || '',
      supportEmail: currentUser?.supportEmail || '',
      supportPhone: currentUser?.supportPhone || '',
      imgUrl: currentUser?.imgUrl || '',
      facebookUrl: currentUser?.facebookUrl || '',
      linkedinUrl: currentUser?.linkedinUrl || '',
      youtubeUrl: currentUser?.youtubeUrl || '',
      videos: currentUser?.videos || [],
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'videos',
  });

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    if (data.imgUrl instanceof File) {
      try {
        const uploadResponse = await uploadFile(data.imgUrl);
        console.log('aaaaaaaaa : ', uploadResponse);
        data.imgUrl = uploadResponse.data.storeUrl;
      } catch (error) {
        console.error('Logo upload failed:', error);
        enqueueSnackbar('Failed to upload logo', { variant: 'error' });
        return;
      }
    }

    try {
      const formData = {
        id: eventData?.state.exhibitorId,
        eventId: eventData?.state.eventId,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        gstNo: data.gstNo,
        panNo: data.panNo,
        about: data.about,
        directorName: data.directorName,
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        facebookUrl: data.facebookUrl,
        linkedinUrl: data.linkedinUrl,
        youtubeUrl: data.youtubeUrl,
        videos: data.videos,
        imgUrl: data.imgUrl?.preview || data.imgUrl,
      };

      console.log(formData);

      const response = await updateExhibitor({
        ...formData,
      });

      if (response?.data.status === 'success') {
        enqueueSnackbar('Profile updated successfully!');
        router.push(paths.dashboard.exhibitorProfile.root);
      } else {
        enqueueSnackbar(response?.data?.message || 'Something went wrong', { variant: 'error' });
      }
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error.message || 'Something went wrong', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('imgUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
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

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="imgUrl"
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
                    Upload Company Logo
                    <br />
                    <br />
                    Allowed *.jpeg, *.jpg, *.png
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

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
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
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
              <RHFTextField name="companyName" label="Company Name" disabled />
              <RHFTextField name="directorName" label="Director Name" disabled />
              <RHFTextField
                name="gstNo"
                label="GST No"
                disabled
                inputProps={{
                  maxLength: 15,
                  style: { textTransform: 'uppercase' },
                }}
              />
              <RHFTextField
                name="panNo"
                label="PAN No"
                disabled
                inputProps={{
                  maxLength: 10,
                  style: { textTransform: 'uppercase' },
                }}
              />
              <RHFTextField name="supportEmail" label="Support Email" disabled />
              <RHFPhoneField name="supportPhone" label="Support Phone" disabled />
            </Box>

            <Box sx={{ mt: 3 }}>
              <RHFTextField
                name="companyAddress"
                label="Company Address"
                multiline
                rows={3}
                fullWidth
                disabled
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <RHFTextField name="about" label="About" multiline rows={4} fullWidth />
            </Box>

            <Typography sx={{ mt: 3, mb: 2 }} variant="subtitle2">
              Social Media Links
            </Typography>

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(1, 1fr)',
              }}
            >
              {socialLinks.map(({ type, icon, color }) => (
                <RHFTextField
                  key={type}
                  name={type === 'website' ? type : `${type}Url`}
                  placeholder={`${capitalizeFirstLetter(type)} Link`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify width={24} icon={icon} color={color} />
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                YouTube Videos
              </Typography>
              <Stack spacing={2}>
                {fields.map((field, index) => (
                  <Stack key={field.id} direction="row" spacing={2} alignItems="center">
                    <RHFTextField
                      name={`videos.${index}`}
                      label={`Video ${index + 1}`}
                      fullWidth
                      placeholder="Enter YouTube video URL"
                    />
                    <IconButton onClick={() => remove(index)} color="error">
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={() => append('')}
                  variant="soft"
                >
                  Add Video
                </Button>
              </Stack>
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
