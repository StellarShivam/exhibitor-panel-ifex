import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import CardHeader from '@mui/material/CardHeader';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFUpload,
} from 'src/components/hook-form';

import { useResponsive } from 'src/hooks/use-responsive';

import { IProductItemNew } from 'src/types/product';

import { useEventContext } from 'src/components/event-context';
import {
  createProduct,
  updateProduct,
  useGetProductPortfolio,
  useImageUpload,
} from 'src/api/product-portfolio';

import { ITicket } from 'src/types/ticket';
import { ITicketCreateItem } from 'src/types/help-and-support';
import { createTicket } from 'src/api/help-and-support';

// ----------------------------------------------------------------------

type Props = {
  currentTicket?: ITicket;
};

export default function TicketNewEditForm({ currentTicket }: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { uploadImage } = useImageUpload();
  const { eventData } = useEventContext();
  const { enqueueSnackbar } = useSnackbar();

  const { reFetchProductPortfolio } = useGetProductPortfolio(eventData?.state.exhibitorId);

  // const [includeTaxes, setIncludeTaxes] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  // const [isPublished, setIsPublished] = useState(currentTicket?.status === 'PUBLISHED');

  const NewTicketSchema = Yup.object().shape({
    event: Yup.string().required('Event is required'),
    subject: Yup.string().required('Subject is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array().min(1, 'Images is required'),
  });

  const defaultValues = useMemo(
    () => ({
      event: eventData?.state.eventName || '',
      subject: currentTicket?.subject || '',
      description: currentTicket?.description || '',
      images: currentTicket?.images || [],
      // salePrice: currentTicket?.salePrice || 0,
    }),
    [currentTicket, eventData?.state.eventName]
  );

  const methods = useForm({
    resolver: yupResolver(NewTicketSchema),
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

  const values = watch();

  useEffect(() => {
    if (currentTicket) {
      reset(defaultValues);
      // setIsPublished(currentTicket.status === 'PUBLISHED');
    }
  }, [currentTicket, defaultValues, reset]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];
      console.log(files);

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  // const handleRemoveAllFiles = useCallback(() => {
  //   setValue('images', []);
  //   setHasUploadedImage(false);
  // }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data.images);
    try {
      const uploadPromises = (data.images || []).map((file: any) => {
        if (typeof file === 'string') return file;
        return uploadImage(file);
      });

      const uploadedImages = await Promise.all(uploadPromises);

      const imageUrls = uploadedImages.map((response: any) => response.data.storeUrl);

      const ticketData: ITicketCreateItem = {
        eventId: eventData?.state.eventId,
        subject: data?.subject,
        description: data?.description,
        attachments: imageUrls,
      };

      await createTicket(ticketData);

      enqueueSnackbar('Ticket created successfully!', { variant: 'success' });
      router.push(paths.dashboard.helpAndSupport.root);
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar(error.message || 'Error creating ticket', {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {mdUp && (
          <Grid md={4}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Title, short description, image...
            </Typography>
          </Grid>
        )}
        <Grid xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title="Details" />}

            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField disabled name="event" label="Event" />

              <RHFTextField name="subject" label="Subject" rows={4} />

              <RHFTextField name="description" label="Description" multiline rows={4} />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Images</Typography>
                <RHFUpload
                  multiple
                  thumbnail
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  // onRemoveAll={handleRemoveAllFiles}
                  // onUpload={() => console.info('ON UPLOAD')}
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
                      Allowed *.jpeg, *.jpg, *.png
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {mdUp && <Grid md={4} />}
        <Grid
          xs={12}
          md={8}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
        >
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {!currentTicket ? 'Create Ticket' : 'Save Changes'}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
