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

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItemNew;
};

const PERMISSION_OPTIONS = ['Team Management', 'Product Listing', 'Tasks and Booth Setup'];

export default function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { uploadImage } = useImageUpload();
  const { eventData } = useEventContext();
  const { enqueueSnackbar } = useSnackbar();

  const { reFetchProductPortfolio } = useGetProductPortfolio(eventData?.state.exhibitorId);

  const [includeTaxes, setIncludeTaxes] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [isPublished, setIsPublished] = useState(currentProduct?.status === 'PUBLISHED');

  const NewProductSchema = Yup.object().shape({
    productName: Yup.string().required('Name is required'),
    subDescription: Yup.string().required('SubDescription is required'),
    images: Yup.array().min(1, 'Image is required'),
    regularPrice: Yup.number().moreThan(0, 'Price should not be $0.00'),
    salePrice: Yup.number().moreThan(0, 'Price should not be $0.00'),
    tax: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      productName: currentProduct?.productName || '',
      subDescription: currentProduct?.subDescription || '',
      images: currentProduct?.images || [],
      regularPrice: currentProduct?.regularPrice || 0,
      salePrice: currentProduct?.salePrice || 0,
      tax: currentProduct?.tax || 0,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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
    if (currentProduct) {
      reset(defaultValues);
      setIsPublished(currentProduct.status === 'PUBLISHED');
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('tax', 0);
    } else {
      setValue('tax', currentProduct?.tax || 0);
    }
  }, [currentProduct?.tax, includeTaxes, setValue]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (hasUploadedImage) {
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setValue('images', [fileWithPreview], { shouldValidate: true });
        setHasUploadedImage(true);
      }
    },
    [setValue, hasUploadedImage]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
      setHasUploadedImage(false);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
    setHasUploadedImage(false);
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let imageUrl = '';

      if (data.images?.[0] instanceof File) {
        const uploadResponse = await uploadImage(data.images[0]);
        if (!uploadResponse?.data?.storeUrl) {
          enqueueSnackbar('Error uploading image', { variant: 'error' });
          return;
        }
        imageUrl = uploadResponse.data.storeUrl;
      } else {
        imageUrl = data.images?.[0] || '';
      }

      const productData = {
        exhibitorId: eventData?.state.exhibitorId,
        productName: data.productName,
        subDescription: data.subDescription,
        imgUrl: imageUrl,
        regularPrice: Number(data.regularPrice),
        salePrice: Number(data.salePrice),
        tax: Number(data.tax),
        isPublish: isPublished,
      };

      console.log(productData);

      if (currentProduct) {
        const response = await updateProduct({
          ...productData,
          id: currentProduct.id!,
          status: isPublished ? 'PUBLISHED' : 'DRAFT',
        });

        if (response?.status === 'success') {
          enqueueSnackbar('Product updated successfully!');
          reFetchProductPortfolio();
          router.push(paths.dashboard.productPortfolio.root);
        } else {
          enqueueSnackbar(response?.message || 'Error updating product', { variant: 'error' });
        }
      } else {
        const response = await createProduct(productData);

        if (response?.status === 'success') {
          enqueueSnackbar('Product created successfully!');
          reFetchProductPortfolio();
          // router.push(paths.dashboard.productPortfolio.root);

          reset(defaultValues);
          setIsPublished(false);
          setHasUploadedImage(false);
          setIncludeTaxes(false);
          handleRemoveAllFiles();
        } else {
          enqueueSnackbar(response?.message || 'Error creating product', { variant: 'error' });
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      enqueueSnackbar(error.message || 'Something went wrong', { variant: 'error' });
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
              <RHFTextField name="productName" label="Product Name" />

              <RHFTextField name="subDescription" label="Sub Description" multiline rows={4} />

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
                  disabled={hasUploadedImage}
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

        {mdUp && (
          <Grid md={4}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Pricing
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Price related inputs
            </Typography>
          </Grid>
        )}

        <Grid xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title="Pricing" />}

            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField
                name="regularPrice"
                label="Regular Price"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        ₹
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="salePrice"
                label="Sale Price"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        ₹
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
                label="Price includes taxes"
              />

              {!includeTaxes && (
                <RHFTextField
                  name="tax"
                  label="Tax (%)"
                  placeholder="0.00"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          %
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Stack>
          </Card>
        </Grid>

        {mdUp && <Grid md={4} />}
        <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
              />
            }
            label="Publish"
            sx={{ flexGrow: 1, pl: 3 }}
          />

          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {!currentProduct ? 'Create Product' : 'Save Changes'}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
