import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
// import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
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
  RHFUpload,
  RHFPhoneField,
} from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';

import { IUserItem } from 'src/types/user';
import {
  usecreateExhibitorUser,
  useupdateExhibitorUser,
  useFileUpload,
  useGetExhibitorUsers,
} from 'src/api/team-management';
import { useEventContext } from 'src/components/event-context';
import { Upload } from 'src/components/upload';
import Divider from '@mui/material/Divider';
import { useGetExhibitor } from 'src/api/exhibitor-profile';
import InfoIcon from '@mui/icons-material/Info';
import Iconify from 'src/components/iconify';
import { IExhibitorFormData, IFormListItem, IGetFormDataResponse } from 'src/types/forms';
import theme from 'src/theme';
import {
  useExhibitorForm,
  useGetFormData,
  useGetFormsList,
  useResubmitForm,
  useSaveForm,
} from 'src/api/forms';
import { fDateTime } from 'src/utils/format-time';
import { getFormSchema, getFormDefaultValues, getFormStructure } from './config/form-fields-config';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { Autocomplete, TextField } from '@mui/material';
import { title } from 'process';
import PaymentDialog from './payment-dialog';

// ----------------------------------------------------------------------

const itPricing = {
  '1mbps': {
    title: 'Cost for 1 Mbps',
    price: 2400,
    inputField: 'numberOf1MbpsPorts',
  },
  '5mbps': {
    title: 'Cost for 5 Mbps',
    price: 7200,
    inputField: 'numberOf5MbpsPorts',
  },
  '10mbps': {
    title: 'Cost for 10 Mbps',
    price: 10800,
    inputField: 'numberOf10MbpsPorts',
  },
  '20mbps': {
    title: 'Cost for 20 Mbps',
    price: 16800,
    inputField: 'numberOf20MbpsPorts',
  },
  '30mbps': {
    title: 'Cost for 30 Mbps',
    price: 27600,
    inputField: 'numberOf30MbpsPorts',
  },
  '40mbps': {
    title: 'Cost for 40 Mbps',
    price: 38400,
    inputField: 'numberOf40MbpsPorts',
  },
  '50mbps': {
    title: 'Cost for 50 Mbps',
    price: 49200,
    inputField: 'numberOf50MbpsPorts',
  },
};

type Props = {
  currentForm?: IFormListItem;
  formData?: IGetFormDataResponse;
  formList?: IFormListItem[];
  exhibitorForm?: IExhibitorFormData;
};

export default function FormsNewEditForm({
  currentForm,
  formData,
  formList,
  exhibitorForm,
}: Props) {
  const router = useRouter();

  const { uploadFile } = useFileUpload();
  const { saveForm } = useSaveForm();
  const { resubmitForm } = useResubmitForm();
  const { reFetchForms } = useGetFormsList();
  const { reFetchFormData } = useGetFormData(currentForm?.exhibitorFormId || null);
  const { enqueueSnackbar } = useSnackbar();

  const [formDefaultValues, setFormDefaultValues] = useState<any | null>(null);
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const formatAllowedTypes = (allowed?: { [key: string]: string[] }): string => {
    if (!allowed) return '';
    const allExts = Object.values(allowed).flat();
    const uniqueExts = Array.from(new Set(allExts));
    return uniqueExts.map((ext) => `*${ext}`).join(', ');
  };

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
    let flattenedData;
    let countryTemp: ICountry;
    let stateTemp: IState;
    let cityTemp: ICity;
    if (currentForm?.status === 'PENDING' || currentForm?.status === 'APPROVED') {
      if (formData) {
        flattenedData = {
          ...formData?.formDetail,
          ...(formData?.formDetail?.data || {}),
          finalConfirmation: true,
        };
        setFormDefaultValues(flattenedData);
      }
    } else {
      flattenedData = {
        ...exhibitorForm,
        ...(exhibitorForm?.data || {}),
      };
      setFormDefaultValues(flattenedData);
    }
    if (flattenedData?.standContractorCountry) {
      countryTemp = flattenedData?.standContractorCountry;
      stateTemp = flattenedData?.standContractorStateProvinceRegion;
      cityTemp = flattenedData?.standContractorCity;
    } else {
      countryTemp = flattenedData?.billingCountry || flattenedData?.country;
      stateTemp = flattenedData?.billingStateProvinceRegion || flattenedData?.stateProvinceRegion;
      cityTemp = flattenedData?.billingCity || flattenedData?.city;
    }

    if (!(formId === '4' && !flattenedData?.standContractorCountry)) {
      const defaultCountry = Country.getAllCountries().find(
        (country) => country.name === countryTemp
      );
      if (defaultCountry) {
        setSelectedCountry(defaultCountry);

        const countryStates = State.getStatesOfCountry(defaultCountry.isoCode);
        setStates(countryStates);
        const defaultState = countryStates.find((state) => state.name === stateTemp);
        if (defaultState) {
          setSelectedState(defaultState);
          const stateCities = City.getCitiesOfState(defaultCountry.isoCode, defaultState.isoCode);
          setCities(stateCities);
          const defaultCity = stateCities.find((city) => city.name === cityTemp);
          if (defaultCity) {
            setSelectedCity(defaultCity);
          }
        }
      }
    } else {
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
      setStates([]);
      setCities([]);
    }
  }, [formData, exhibitorForm, currentForm?.status]);

  const getFormIdentifier = (id?: number) => {
    const formMap: { [key: number]: string } = {
      5: '5',
      2: '2',
      3: '3',
    };
    return formMap[id || 0] || '1';
  };

  const formId = currentForm?.formId?.toString() || '1';
  const FormSchema = getFormSchema(formId);
  const formStructure = getFormStructure(formId);

  const defaultValues = useMemo(
    () => getFormDefaultValues(formId, formDefaultValues),
    [formId, formDefaultValues]
  );

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    mode: 'onChange',
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const watchSelectedCountry = watch('country');

  useEffect(() => {
    if (watchSelectedCountry) {
      const countryData = countries.find((country) => country.label === watchSelectedCountry);
      if (countryData?.phone) {
        const currentPhone = watch('phone') || '';
        const newCountryCode = `+${countryData.phone}`;
        const currentCountryCode = currentPhone.startsWith('+')
          ? currentPhone.substring(
              0,
              currentPhone.length -
                (currentPhone.replace(/[^0-9]/g, '').length - countryData.phone.length)
            )
          : '';

        if (currentCountryCode !== newCountryCode) {
          setValue('phone', `${newCountryCode}`);
        }
      }
    }
  }, [watchSelectedCountry, setValue, watch]);

  useEffect(() => {
    if (formDefaultValues) {
      reset(defaultValues);
    }
  }, [formDefaultValues, defaultValues, reset]);

  const values = watch();

  // useEffect(() => {
  //   if (exhibitorForm) {
  //     reset(defaultValues);
  //     const defaultCountry = Country.getAllCountries().find(
  //       (country) => country.name === exhibitorForm.data.country
  //     );
  //     if (defaultCountry) {
  //       setSelectedCountry(defaultCountry);
  //       setValue('country', defaultCountry.name);

  //       const countryStates = State.getStatesOfCountry(defaultCountry.isoCode);
  //       setStates(countryStates);
  //       const defaultState = countryStates.find(
  //         (state) => state.name === exhibitorForm.data.stateProvinceRegion
  //       );
  //       if (defaultState) {
  //         setSelectedState(defaultState);
  //         setValue('stateProvinceRegion', defaultState.name);
  //         const stateCities = City.getCitiesOfState(defaultCountry.isoCode, defaultState.isoCode);
  //         setCities(stateCities);
  //         const defaultCity = stateCities.find((city) => city.name === exhibitorForm.data.city);
  //         if (defaultCity) {
  //           setSelectedCity(defaultCity);
  //           setValue('city', defaultCity.name);
  //         }
  //       }
  //     }
  //   }
  // }, [exhibitorForm, defaultValues, setValue, reset]);

  // Calculate base amount whenever form values change
  useEffect(() => {
    if (formId === '8') {
      const temporaryPowerCost =
        values.temporaryPowerDates && values.temporaryPowerDates.length > 0
          ? 2000 * values.temporaryPowerDates.length
          : 0;

      const permanent12hrCost =
        values.permanentPower?.includes('12hr') && values.permanentPower12hrKW
          ? Number(values.permanentPower12hrKW) * 6000
          : 0;

      const permanent24hrCost =
        values.permanentPower?.includes('24hr') && values.permanentPower24hrKW
          ? Number(values.permanentPower24hrKW) * 12000
          : 0;

      const totalBaseAmount = temporaryPowerCost + permanent12hrCost + permanent24hrCost;
      setBaseAmount(totalBaseAmount);
    }
  }, [
    values.temporaryPowerDates,
    values.permanentPower,
    values.permanentPower12hrKW,
    values.permanentPower24hrKW,
    formId,
  ]);

  useEffect(() => {
    if (formId === '7') {
      const totalBaseAmount =
        (values.dayShifts.length + values.nightShifts.length) * values.totalNumberOfGuards * 1725;
      setBaseAmount(totalBaseAmount);
    }
  }, [values.dayShifts, values.nightShifts, values.totalNumberOfGuards, formId]);

  useEffect(() => {
    if (formId === '9') {
      const totalBaseAmount = values.dates.length * values.totalNumberOfHousekeepers * 1250;
      setBaseAmount(totalBaseAmount);
    }
  }, [values.dates, values.totalNumberOfHousekeepers, formId]);

  useEffect(() => {
    if (formId === '8') {
      const totalBaseAmount = values.requiredKW * 2250;
      setBaseAmount(totalBaseAmount);
    }
  }, [values.requiredKW, formId]);

  useEffect(() => {
    if (formId === '5') {
      const dedicatedPortsCost = values.dedicatedPorts
        ? values.dedicatedPorts.reduce((total: number, port: string) => {
            const portInfo = itPricing[port as keyof typeof itPricing];
            const numberOfPorts = values[portInfo.inputField] || 0;
            return total + portInfo.price * numberOfPorts * 5;
          }, 0)
        : 0;

      const wifiVoucherCost = values.noOfWifiVocher ? values.noOfWifiVocher * 1100 : 0;

      const totalBaseAmount = dedicatedPortsCost + wifiVoucherCost;
      setBaseAmount(totalBaseAmount);
    }
  }, [
    values.noOfWifiVocher,
    values.numberOf1MbpsPorts,
    values.numberOf5MbpsPorts,
    values.numberOf10MbpsPorts,
    values.numberOf20MbpsPorts,
    values.numberOf30MbpsPorts,
    values.numberOf40MbpsPorts,
    values.numberOf50MbpsPorts,
    formId,
  ]);

  const gstAmount = Number(baseAmount) * 0.18;
  const totalAmount = Number(baseAmount) + Number(gstAmount);

  useEffect(() => {
    if (!values.dedicatedPorts || !values.dedicatedPorts.includes('1mbps')) {
      if (values.numberOf1MbpsPorts && values.numberOf1MbpsPorts > 0) {
        setValue('numberOf1MbpsPorts', 0);
      }
    }
  }, [values.dedicatedPorts, values.numberOf1MbpsPorts, setValue]);

  useEffect(() => {
    if (!values.dedicatedPorts || !values.dedicatedPorts.includes('5mbps')) {
      if (values.numberOf5MbpsPorts && values.numberOf5MbpsPorts > 0) {
        setValue('numberOf5MbpsPorts', 0);
      }
    }
  }, [values.dedicatedPorts, values.numberOf5MbpsPorts, setValue]);

  useEffect(() => {
    if (!values.dedicatedPorts || !values.dedicatedPorts.includes('10mbps')) {
      if (values.numberOf10MbpsPorts && values.numberOf10MbpsPorts > 0) {
        setValue('numberOf10MbpsPorts', 0);
      }
    }
  }, [values.dedicatedPorts, values.numberOf10MbpsPorts, setValue]);

  useEffect(() => {
    if (!values.dedicatedPorts || !values.dedicatedPorts.includes('20mbps')) {
      if (values.numberOf20MbpsPorts && values.numberOf20MbpsPorts > 0) {
        setValue('numberOf20MbpsPorts', 0);
      }
    }
  }, [values.dedicatedPorts, values.numberOf20MbpsPorts, setValue]);

  useEffect(() => {
    if (!values.dedicatedPorts || !values.dedicatedPorts.includes('30mbps')) {
      if (values.numberOf30MbpsPorts && values.numberOf30MbpsPorts > 0) {
        setValue('numberOf30MbpsPorts', 0);
      }
    }
  }, [values.dedicatedPorts, values.numberOf30MbpsPorts, setValue]);

  useEffect(() => {
    if (!values.dedicatedPorts || !values.dedicatedPorts.includes('40mbps')) {
      if (values.numberOf40MbpsPorts && values.numberOf40MbpsPorts > 0) {
        setValue('numberOf40MbpsPorts', 0);
      }
    }
  }, [values.dedicatedPorts, values.numberOf40MbpsPorts, setValue]);

  useEffect(() => {
    if (!values.dedicatedPorts || !values.dedicatedPorts.includes('50mbps')) {
      if (values.numberOf50MbpsPorts && values.numberOf50MbpsPorts > 0) {
        setValue('numberOf50MbpsPorts', 0);
      }
    }
  }, [values.dedicatedPorts, values.numberOf50MbpsPorts, setValue]);

  console.log(errors, 'errors*******');
  const onSubmit = handleSubmit(async (data) => {
    console.log(data, 'JIHUGYFTR^T&Y*U(Y*YFYGUHI');
    try {
      const fileUploadTasks = Object.entries(data)
        .filter(([, fieldValue]) => Array.isArray(fieldValue) && fieldValue.length > 0)
        .filter(([, fieldValue]) => (fieldValue as any[]).some((item) => item instanceof File))
        .map(async ([fieldName, fieldValue]) => {
          const fileUploadPromises = (fieldValue as any[]).map(async (file: any) => {
            if (file instanceof File) {
              const uploadResponse = await uploadFile(file);
              return uploadResponse.data.storeUrl;
            }
            return file;
          });
          const uploadedFileUrls = await Promise.all(fileUploadPromises);
          return { fieldName, uploadedFileUrls };
        });

      const uploadResults = await Promise.all(fileUploadTasks);

      const allUploadedFiles: string[] = [];

      uploadResults.forEach(({ fieldName, uploadedFileUrls }) => {
        data[fieldName] = uploadedFileUrls;
        allUploadedFiles.push(...uploadedFileUrls);
      });

      const { finalConfirmation, ...restData } = data;
      const payload = {
        ...(formData?.logs && formData?.logs?.length > 0
          ? {
              formDetailId: currentForm?.exhibitorFormId,
            }
          : { formId: currentForm?.formId }),
        data: {
          ...restData,
          ...(allUploadedFiles.length > 0 && { files: allUploadedFiles }),
          // fullName: `${data.title} ${data.firstName} ${data.lastName}`,
          ...((currentForm?.formId === 8 ||
            currentForm?.formId === 5 ||
            currentForm?.formId === 7 ||
            currentForm?.formId === 9) && {
            baseAmount,
            gstAmount,
            totalAmount,
          }),
        },
      };
      console.log(payload, 'payload*******');
      let response;
      if (formData?.logs && formData?.logs?.length > 0) {
        response = await resubmitForm(payload);
      } else {
        response = await saveForm(payload);
      }

      if (response?.data?.status === 'success') {
        // enqueueSnackbar('Form submitted successfully', { variant: 'success' });
        reFetchForms();
        reFetchFormData();
        if (formId === '5' || formId === '8' || formId === '7' || formId === '9') {
          setTimeout(() => {
            setPaymentDialogOpen(true);
          }, 1000);
        }
      } else {
        enqueueSnackbar('Form submission failed', { variant: 'error' });
      }
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error.message || 'Something went wrong', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[], fieldName: string) => {
      const newFiles = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue(fieldName, [...(values[fieldName] || []), ...newFiles], { shouldValidate: true });
    },
    [setValue, values]
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

  console.log(currentForm, 'currentForm*******');
  const isFormDisabled = currentForm?.status != null && currentForm?.status !== 'REJECTED';

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6">{currentForm?.name}</Typography>
              <Divider sx={{ mb: 3, mt: 2, borderBottom: '1px dashed rgba(0, 0, 0, 0.12)' }} />
              <Grid container spacing={2}>
                {formStructure?.fields.map(
                  (field: {
                    name: string;
                    label: string;
                    type: string;
                    maxSize?: number;
                    allowedTypes?: {
                      [key: string]: string[];
                    };
                    disabled?: boolean;
                    gridItem?: {
                      xs?: number;
                      sm?: number;
                      md?: number;
                    };
                  }) => {
                    const commonProps = {
                      key: field.name,
                      name: field.name,
                      label: field.label,
                      disabled: isFormDisabled || field.disabled,
                    };

                    const renderField = () => {
                      switch (field.type) {
                        case 'phone':
                          return <RHFPhoneField {...commonProps} />;
                        case 'checkbox':
                          return (
                            <Controller
                              name={field.name}
                              control={control}
                              render={({ field: controllerField, fieldState: { error } }) => (
                                <Stack spacing={1}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={controllerField.value || false}
                                        onChange={(e) => controllerField.onChange(e.target.checked)}
                                        disabled={commonProps.disabled}
                                      />
                                    }
                                    label={field.label}
                                  />
                                  {error && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'error.main',
                                        ml: 4,
                                      }}
                                    >
                                      {error.message}
                                    </Typography>
                                  )}
                                </Stack>
                              )}
                            />
                          );
                        case 'textarea':
                          return (
                            <RHFTextField
                              {...commonProps}
                              multiline
                              rows={4}
                              inputProps={{ maxLength: 120 }}
                              helperText={`${values[field.name]?.length || 0}/120`}
                            />
                          );
                        case 'country':
                          return (
                            <Controller
                              name={field.name}
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
                                  disabled={isFormDisabled}
                                  renderOption={(props, option) => (
                                    <Box component="li" {...props} key={option.isoCode}>
                                      {option.name} ({option.isoCode})
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Country"
                                      error={!!methods.formState.errors[field.name]}
                                      helperText={methods.formState.errors[field.name]?.message}
                                      InputProps={{
                                        ...params.InputProps,
                                        readOnly: isFormDisabled,
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />
                          );
                        case 'state':
                          return (
                            <Controller
                              name={field.name}
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
                                  disabled={isFormDisabled || !selectedCountry}
                                  renderOption={(props, option) => (
                                    <Box component="li" {...props} key={option.isoCode}>
                                      {option.name}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder={
                                        selectedCountry ? 'Select State' : 'Select Country First'
                                      }
                                      error={!!methods.formState.errors[field.name]}
                                      helperText={methods.formState.errors[field.name]?.message}
                                      InputProps={{
                                        ...params.InputProps,
                                        readOnly: isFormDisabled,
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />
                          );
                        case 'city':
                          return (
                            <Controller
                              name={field.name}
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
                                  disabled={isFormDisabled || !selectedState}
                                  renderOption={(props, option) => (
                                    <Box component="li" {...props} key={option.name}>
                                      {option.name}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder={
                                        selectedState ? 'Select City' : 'Select State First'
                                      }
                                      error={!!methods.formState.errors[field.name]}
                                      helperText={methods.formState.errors[field.name]?.message}
                                      InputProps={{
                                        ...params.InputProps,
                                        readOnly: isFormDisabled,
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />
                          );
                        case 'grouped-select':
                          return (
                            <RHFTextField {...commonProps} select SelectProps={{ native: true }}>
                              {(() => {
                                type GroupedOption = {
                                  label: string;
                                  options: Array<{ value: string; label: string }>;
                                };

                                const groupedField = field as {
                                  groupedOptions?: {
                                    [key: string]: GroupedOption;
                                  };
                                };

                                return (
                                  groupedField.groupedOptions &&
                                  Object.entries(groupedField.groupedOptions).map(
                                    ([key, group]: [string, GroupedOption]) => (
                                      <optgroup key={key} label={group.label}>
                                        {group.options.map(
                                          (option: { value: string; label: string }) => (
                                            <option key={option.value} value={option.value}>
                                              {option.label}
                                            </option>
                                          )
                                        )}
                                      </optgroup>
                                    )
                                  )
                                );
                              })()}
                            </RHFTextField>
                          );
                        case 'select':
                          return (
                            <RHFTextField {...commonProps} select SelectProps={{ native: false }}>
                              {(field as { options?: string[] }).options?.map((option: string) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </RHFTextField>
                          );
                        case 'checkbox-group':
                          return (
                            <>
                              {field.name === 'dayShifts' && (
                                <>
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Rate for 12 Hours INR (Security Guard – Rs 1,725/-)
                                  </Typography>
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Select Date(s)*:
                                  </Typography>
                                </>
                              )}
                              {field.name === 'dates' && (
                                <>
                                  <Typography variant="subtitle2">
                                    Charges for 12 Hours per Housekeeping Boy - Rs. 1250
                                  </Typography>
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    (Note:- This is only manpower cost. Cost of
                                    Consumables/Equipment requirement will be extra).
                                  </Typography>
                                </>
                              )}
                              <Controller
                                name={field.name}
                                control={control}
                                render={({ field: controllerField, fieldState: { error } }) => (
                                  <FormControl
                                    component="fieldset"
                                    disabled={commonProps.disabled}
                                    fullWidth
                                    error={!!error}
                                  >
                                    <FormLabel component="legend" sx={{ mb: 2 }}>
                                      {field.label}
                                    </FormLabel>
                                    {field.name === 'dayShifts' ||
                                    field.name === 'nightShifts' ||
                                    field.name === 'dates' ||
                                    field.name === 'temporaryPowerDates' ? (
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          gap: 1,
                                          flexWrap: 'wrap',
                                          justifyContent: 'flex-start',
                                        }}
                                      >
                                        {(field as { options?: string[] }).options?.map(
                                          (option: string) => {
                                            const [day, date, fullDate] = option.split('|');
                                            const isSelected =
                                              controllerField.value?.includes(fullDate) || false;

                                            return (
                                              <Box
                                                key={option}
                                                onClick={() => {
                                                  if (commonProps.disabled) return;
                                                  const currentValues = controllerField.value || [];
                                                  if (currentValues.includes(fullDate)) {
                                                    controllerField.onChange(
                                                      currentValues.filter(
                                                        (val: string) => val !== fullDate
                                                      )
                                                    );
                                                  } else {
                                                    controllerField.onChange([
                                                      ...currentValues,
                                                      fullDate,
                                                    ]);
                                                  }
                                                }}
                                                sx={{
                                                  width: 60,
                                                  height: 80,
                                                  border: '2px solid',
                                                  borderColor: isSelected
                                                    ? 'primary.main'
                                                    : 'grey.300',
                                                  borderRadius: 3,
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  cursor: commonProps.disabled
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                                  backgroundColor: isSelected
                                                    ? 'grey.50'
                                                    : 'background.paper',
                                                  opacity: commonProps.disabled ? 0.6 : 1,
                                                  transition: 'all 0.2s ease-in-out',
                                                  '&:hover': !commonProps.disabled && {
                                                    borderColor: 'primary.main',
                                                    backgroundColor: isSelected
                                                      ? 'grey.200'
                                                      : 'grey.50',
                                                  },
                                                }}
                                              >
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    color: isSelected
                                                      ? 'primary.main'
                                                      : 'text.secondary',
                                                    fontWeight: 500,
                                                  }}
                                                >
                                                  {day}
                                                </Typography>
                                                <Typography
                                                  variant="h6"
                                                  sx={{
                                                    color: isSelected
                                                      ? 'primary.main'
                                                      : 'text.primary',
                                                    fontWeight: 600,
                                                  }}
                                                >
                                                  {date}
                                                </Typography>
                                              </Box>
                                            );
                                          }
                                        )}
                                      </Box>
                                    ) : field.name === 'dedicatedPorts' ? (
                                      <Grid container spacing={2}>
                                        {(field as { options?: string[] }).options?.map(
                                          (option: string) => {
                                            const [value, label] = option.split('|');
                                            const isChecked =
                                              controllerField.value?.includes(value) || false;
                                            const valueToFieldName: Record<string, string> = {
                                              '1mbps': 'numberOf1MbpsPorts',
                                              '5mbps': 'numberOf5MbpsPorts',
                                              '10mbps': 'numberOf10MbpsPorts',
                                              '20mbps': 'numberOf20MbpsPorts',
                                              '30mbps': 'numberOf30MbpsPorts',
                                              '40mbps': 'numberOf40MbpsPorts',
                                              '50mbps': 'numberOf50MbpsPorts',
                                            };
                                            const associatedFieldName = valueToFieldName[value];
                                            return (
                                              <Grid key={option} xs={12}>
                                                <Stack spacing={1}>
                                                  <FormControlLabel
                                                    control={
                                                      <Checkbox
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                          const currentValues =
                                                            controllerField.value || [];
                                                          if (e.target.checked) {
                                                            controllerField.onChange([
                                                              ...currentValues,
                                                              value,
                                                            ]);
                                                          } else {
                                                            controllerField.onChange(
                                                              currentValues.filter(
                                                                (val: string) => val !== value
                                                              )
                                                            );
                                                          }
                                                        }}
                                                        disabled={commonProps.disabled}
                                                      />
                                                    }
                                                    label={label}
                                                  />

                                                  {isChecked && (
                                                    <RHFTextField
                                                      name={associatedFieldName}
                                                      label={
                                                        label.includes('Mbps')
                                                          ? `Number of ${label.split(' ')[0]} ${label.split(' ')[1]} Ports`
                                                          : 'Number of Ports'
                                                      }
                                                      disabled={commonProps.disabled || !isChecked}
                                                      type="number"
                                                      inputProps={{ min: 1, step: 1 }}
                                                    />
                                                  )}
                                                </Stack>
                                              </Grid>
                                            );
                                          }
                                        )}
                                      </Grid>
                                    ) : (
                                      <Grid container spacing={0.5}>
                                        {(field as { options?: string[] }).options?.map(
                                          (option: string) => {
                                            const [value, label] = option.split('|');
                                            return (
                                              <Grid key={option} xs={12} md={6}>
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      checked={
                                                        controllerField.value?.includes(value) ||
                                                        false
                                                      }
                                                      onChange={(e) => {
                                                        const currentValues =
                                                          controllerField.value || [];
                                                        if (e.target.checked) {
                                                          controllerField.onChange([
                                                            ...currentValues,
                                                            value,
                                                          ]);
                                                        } else {
                                                          controllerField.onChange(
                                                            currentValues.filter(
                                                              (val: string) => val !== value
                                                            )
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  }
                                                  label={label}
                                                />
                                              </Grid>
                                            );
                                          }
                                        )}
                                      </Grid>
                                    )}
                                    {error && (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: 'error.main',
                                          mt: 1,
                                          ml: 2,
                                        }}
                                      >
                                        {error.message}
                                      </Typography>
                                    )}
                                  </FormControl>
                                )}
                              />
                            </>
                          );
                        case 'radio-group':
                          return (
                            <Controller
                              name={field.name}
                              control={control}
                              render={({ field: controllerField }) => (
                                <FormControl
                                  component="fieldset"
                                  disabled={commonProps.disabled}
                                  fullWidth
                                >
                                  <FormLabel component="legend">{field.label}</FormLabel>
                                  <RadioGroup
                                    value={controllerField.value || ''}
                                    onChange={(e) => controllerField.onChange(e.target.value)}
                                  >
                                    <Grid container spacing={0.5}>
                                      {(field as { options?: string[] }).options?.map(
                                        (option: string) => {
                                          const [value, label] = option.includes('|')
                                            ? option.split('|')
                                            : [option, option];

                                          return (
                                            <Grid key={option} xs={12} md={6}>
                                              <FormControlLabel
                                                value={value}
                                                control={<Radio />}
                                                label={label}
                                              />
                                            </Grid>
                                          );
                                        }
                                      )}
                                    </Grid>
                                  </RadioGroup>
                                </FormControl>
                              )}
                            />
                          );
                        case 'number': {
                          return (
                            <>
                              {field.name === 'contractorBadge' && (
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  The above person will collect following number of Contractor
                                  Badges on my behalf.
                                </Typography>
                              )}
                              {field.name === 'powerLoad' && (
                                <>
                                  <Typography variant="subtitle2">
                                    Power Load Required (KW)*
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 2 }}>
                                    Rs.2250/- per KW + 18% GST, For the entire setup and event
                                    duration as per the exhibitor's requirements.
                                  </Typography>
                                </>
                              )}
                              {field.name === 'noOfWifiVocher' && (
                                <>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Wi-Fi Connection Per voucher speed up to 2 Mbps (Rs.1100/- per
                                    voucher for all event days)
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                  >
                                    (1 Wi-Fi Voucher 2 Device can be connected one time for entire
                                    event days)
                                  </Typography>
                                </>
                              )}
                              <RHFTextField
                                {...commonProps}
                                type="number"
                                inputProps={{
                                  min: 1,
                                  step: 1,
                                }}
                              />
                            </>
                          );
                        }
                        case 'file':
                          return (
                            <>
                              {formId === '3' && field.name === 'topView' && (
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Layout Upload
                                </Typography>
                              )}
                              <Stack
                                spacing={1.5}
                                sx={{
                                  mt: formId === '3' && field.name === 'frontElevation' ? 4 : 0,
                                }}
                              >
                                <Typography variant="subtitle2">{field.label}</Typography>
                                {formId === '6' && field.name === 'authorityLetter' && (
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    (Note: Must be on the company's letterhead)
                                  </Typography>
                                )}
                                {formId === '1' && field.name === 'files' && (
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    (Note: It is recommended to upload the image in a 1:1 ratio)
                                  </Typography>
                                )}
                                {formId === '3' &&
                                  field.name === 'safeStabilityStructureCertificate' && (
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                      (Note: If the floor is a mezzanine floor, it is mandatory to
                                      upload a Safe Stability Structure Certificate issued by a
                                      Registered Structural Engineer.)
                                    </Typography>
                                  )}
                                <Controller
                                  name={field.name}
                                  control={control}
                                  render={({ field: controllerField, fieldState: { error } }) => (
                                    <div>
                                      <Upload
                                        multiple
                                        maxSize={field.maxSize}
                                        files={isFormDisabled ? [] : controllerField.value}
                                        {...(!isFormDisabled && {
                                          onDrop: (acceptedFiles: File[]) =>
                                            handleDrop(acceptedFiles, field.name),
                                          onRemove: (inputFile: File | string) =>
                                            handleRemoveFile(inputFile, field.name),
                                          // onRemoveAll: () => handleRemoveAllFiles(field.name),
                                        })}
                                        disabled={
                                          isFieldUploadDisabled(field.name, field.type) ||
                                          isFormDisabled
                                        }
                                        accept={field.allowedTypes}
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
                                                Allowed {formatAllowedTypes(field.allowedTypes)}
                                                <br /> max size of {fData(field.maxSize || 0)}
                                              </>
                                            )}
                                          </Typography>
                                        }
                                        error={!!error}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              {defaultValues?.[field.name] &&
                                defaultValues?.[field.name]?.length > 0 && (
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                      Uploaded File:
                                    </Typography>
                                    {defaultValues?.[field.name]?.map(
                                      (file: any, index: number) => (
                                        <Typography
                                          key={index}
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
                                      )
                                    )}
                                  </Box>
                                )}
                            </>
                          );
                        case 'file-multiple':
                          return (
                            <>
                              <Stack spacing={1.5} sx={{ mt: 3 }}>
                                <Typography variant="subtitle2">{field.label}</Typography>
                                <Controller
                                  name={field.name}
                                  control={control}
                                  render={({ field: controllerField, fieldState: { error } }) => (
                                    <div>
                                      <Upload
                                        multiple
                                        maxSize={field.maxSize || 0}
                                        files={isFormDisabled ? [] : controllerField.value}
                                        {...(!isFormDisabled && {
                                          onDrop: (acceptedFiles: File[]) =>
                                            handleDrop(acceptedFiles, field.name),
                                          onRemove: (inputFile: File | string) =>
                                            handleRemoveFile(inputFile, field.name),
                                          onRemoveAll: () => handleRemoveAllFiles(field.name),
                                        })}
                                        disabled={isFormDisabled}
                                        accept={field.allowedTypes}
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
                                                Allowed {formatAllowedTypes(field.allowedTypes)}
                                                <br /> max size of {fData(field.maxSize || 0)}
                                              </>
                                            )}
                                          </Typography>
                                        }
                                        error={!!error}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>

                              {defaultValues?.[field.name] &&
                                defaultValues?.[field.name]?.length > 0 && (
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                      Uploaded Files:
                                    </Typography>
                                    {defaultValues?.[field.name]?.map(
                                      (file: any, index: number) => (
                                        <Typography
                                          key={index}
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
                                      )
                                    )}
                                  </Box>
                                )}
                            </>
                          );
                        case 'text':
                        case 'email':
                        default:
                          return (
                            <>
                              {field.name === 'standContractorCompanyName' && (
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  We have appointed the following agency for stand construction: -
                                </Typography>
                              )}

                              <RHFTextField {...commonProps} />
                            </>
                          );
                      }
                    };

                    return (
                      <Grid key={field.name} {...(field.gridItem || { xs: 12 })}>
                        {renderField()}
                      </Grid>
                    );
                  }
                )}
              </Grid>

              {(formId === '7' || formId === '9' || formId === '8') && (
                <Card sx={{ mt: 3, p: 3, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Cost Calculation
                  </Typography>
                  <Grid container spacing={2}>
                    {values?.totalNumberOfGuards > 0 &&
                      (values?.dayShifts?.length > 0 || values?.nightShifts?.length > 0) && (
                        <Grid xs={12}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                              Base Amount:
                            </Typography>
                            <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                              Rs. {baseAmount}
                            </Typography>
                          </Stack>
                          <Divider sx={{ my: 2 }} />
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                              GST Amount (18%):
                            </Typography>
                            <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                              Rs. {gstAmount}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" sx={{ textAlign: 'left' }}>
                              Estimated Total Cost:
                            </Typography>
                            <Typography variant="h6" sx={{ textAlign: 'right' }}>
                              Rs. {totalAmount}
                            </Typography>
                          </Stack>
                        </Grid>
                      )}
                    {values?.totalNumberOfHousekeepers > 0 && values?.dates?.length > 0 && (
                      <Grid xs={12}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                            Base Amount:
                          </Typography>
                          <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                            Rs. {baseAmount}
                          </Typography>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                            GST Amount (18%):
                          </Typography>
                          <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                            Rs. {gstAmount}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="h6" sx={{ textAlign: 'left' }}>
                            Estimated Total Cost:
                          </Typography>
                          <Typography variant="h6" sx={{ textAlign: 'right' }}>
                            Rs. {totalAmount}
                          </Typography>
                        </Stack>
                      </Grid>
                    )}
                    {values?.requiredKW > 0 && (
                      <Grid xs={12}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                            Base Amount:
                          </Typography>
                          <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                            Rs. {baseAmount}
                          </Typography>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                            GST Amount (18%):
                          </Typography>
                          <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                            Rs. {gstAmount}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="h6" sx={{ textAlign: 'left' }}>
                            Estimated Total Cost:
                          </Typography>
                          <Typography variant="h6" sx={{ textAlign: 'right' }}>
                            Rs. {totalAmount}
                          </Typography>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              )}

              {formId === '5' && (
                <Card sx={{ mt: 3, p: 3, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Cost Calculation
                  </Typography>
                  <Grid container spacing={2}>
                    {values.dedicatedPorts.length > 0 &&
                      values.dedicatedPorts.map((val) => (
                        <Grid xs={12} sm={12}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2">
                              {itPricing[val].title}
                              {values[itPricing[val].inputField] > 1 ? ' Ports' : ' Port'}
                              {` (Rs. ${itPricing[val].price} x ${values[itPricing[val].inputField]} ${values[itPricing[val].inputField] > 1 ? ' Ports' : ' Port'} x 5 Days)`}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              Rs.{' '}
                              {itPricing[val].price * values[itPricing[val].inputField] * 5 || 0}
                            </Typography>
                          </Stack>
                        </Grid>
                      ))}

                    {values.noOfWifiVocher > 0 && (
                      <Grid xs={12} sm={12}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2">
                            Cost for Wi-Fi Voucher (Entire Event)
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Rs. {values.noOfWifiVocher * 1100 || 0}
                          </Typography>
                        </Stack>
                      </Grid>
                    )}

                    {baseAmount > 0 && (
                      <Grid xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                            Base Amount:
                          </Typography>
                          <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                            Rs. {baseAmount}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                            GST Amount (18%):
                          </Typography>
                          <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                            Rs. {gstAmount}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="h6" sx={{ textAlign: 'left' }}>
                            Estimated Total Cost:
                          </Typography>
                          <Typography variant="h6" sx={{ textAlign: 'right' }}>
                            Rs. {totalAmount}
                          </Typography>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              )}
              {/* 
            {formStructure?.fileUpload && (
              <Stack spacing={1.5} sx={{ mt: 3 }}>
                <Typography variant="subtitle2">Layout Upload</Typography>
                <Controller
                  name="files"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Upload
                        multiple
                        maxSize={formStructure.fileUpload.maxSize}
                        files={isFormDisabled ? [] : field.value}
                        {...(!isFormDisabled && {
                          onDrop: handleDrop,
                          onRemove: handleRemoveFile,
                          onRemoveAll: handleRemoveAllFiles,
                        })}
                        disabled={isFormDisabled}
                        accept={formStructure.fileUpload.allowedTypes}
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
                                Allowed *.pdf, *.jpg, *.jpeg
                                <br /> max size of {fData(formStructure.fileUpload.maxSize)}
                              </>
                            )}
                          </Typography>
                        }
                        error={!!error}
                      />
                    </div>
                  )}
                />
              </Stack>
            )}
            {defaultValues?.files && defaultValues?.files?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Uploaded Files:
                </Typography>
                {defaultValues?.files?.map((file: any, index: number) => (
                  <Typography
                    key={index}
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
                ))}
              </Box>
            )} */}

              {(currentForm?.status == null || currentForm?.status === 'REJECTED') && (
                <>
                  {formStructure?.declaration && (
                    <Stack sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Declaration
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" required={formStructure.declaration.required} />
                        }
                        label={formStructure.declaration.text}
                      />
                    </Stack>
                  )}
                  <Divider sx={{ my: 3, borderBottom: '1px dashed rgba(0, 0, 0, 0.12)' }} />

                  <Stack sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {formId === '5' || formId === '8' || formId === '7' || formId === '9'
                        ? 'Submit & Pay'
                        : 'Submit'}
                    </LoadingButton>
                  </Stack>
                </>
              )}

              {(formId === '5' || formId === '8' || formId === '7' || formId === '9') &&
                formData &&
                formData?.formDetail &&
                formData?.formDetail?.paymentStatus !== 'captured' &&
                formData?.formDetail?.paymentStatus !== 'approved' &&
                formData?.formDetail?.paymentStatus !== 'pending' && (
                  <>
                    <Divider sx={{ my: 3, borderBottom: '1px dashed rgba(0, 0, 0, 0.12)' }} />
                    <Stack sx={{ mt: 3 }}>
                      <Button variant="contained" onClick={() => setPaymentDialogOpen(true)}>
                        Pay Now
                      </Button>
                    </Stack>
                  </>
                )}
            </Card>
          </Grid>
          <Grid xs={12} md={4} spacing={3}>
            {formId === '5' && (
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Note:</Typography>
                <Typography variant="body1">
                  For dedicated Internet Bandwidth, Please contact to
                </Typography>
                <Typography variant="body1">
                  <br />
                  Charan Singh (Senior Manager | IT)
                  <br />
                  {/* <br /> */}
                  India Exposition Mart Limited
                  <br />
                  <b>Mob :</b> +91-9289137552
                  <br />
                  <b>Email :</b> it1@indiaexpocentre.com
                </Typography>
              </Card>
            )}

            {/* <Card sx={{ p: 3 }}>
            <Chip label="Information" variant="outlined" color="info" sx={{ mb: 2 }} />
            <Typography variant="h6">For Further Inquiry Please Contact</Typography>
            <Typography variant="body1">
              <b>Name :</b> Mr. Virendra Pratap Singh
              <br />
              <b>Email :</b> IFEX@indiaexpocentre.com
              <br />
              <b>Phone:</b> +91-92897 33490
            </Typography>
          </Card> */}
            {/* <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6">Please Note</Typography>
            <Box
              component="ul"
              sx={{
                listStyleType: 'disc',
                listStylePosition: 'outside',
                paddingLeft: 2,
                margin: 0,
                '& li': {
                  marginBottom: 1,
                },
              }}
            >
              <Typography component="li" variant="body1">
                Please submit drawings duly certified by Structural Engineer (elevations, layout
                plan and perspective) with dimensions, illustrating the design of your stand for the
                Expo before given date along with the form. Pl keep 2 (two) sets of drawings
                approved by organizer with dimensions, illustrating the design of your stand. The
                Organizers reserves the right to check the same at any time during the expo.
              </Typography>
              <Typography component="li" variant="body1">
                Both the exhibitor & contractor must abide by all rules and regulations of the
                organizers
              </Typography>
            </Box>
          </Card> */}
            {formData?.logs && formData?.logs.length > 0 && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h6">Last Form Submissions</Typography>
                <Scrollbar
                  sx={{
                    maxHeight: 500,
                  }}
                >
                  {formData?.logs?.map((log, index) => (
                    <Box key={index} sx={{ mt: index > 0 ? 3 : 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify
                          icon="mingcute:time-fill"
                          width={24}
                          height={24}
                          color="text.secondary"
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Submitted On {fDateTime(log.createdAt)}
                        </Typography>
                      </Stack>

                      {log.changeType === 'REJECTED' && (
                        <>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                              backgroundColor: '#FFE3E3',
                              color: 'error.main',
                              border: '2px solid #FFE3E3',
                              borderRadius: 1,
                              px: 1,
                              py: 1,
                              mb: 1,
                              mt: 1,
                              width: '100%',
                              cursor: 'pointer',
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Iconify
                                icon="solar:danger-bold"
                                width={24}
                                height={24}
                                color="error.main"
                              />
                              <Typography variant="body2" sx={{ color: 'error.main' }}>
                                Form Rejected
                              </Typography>
                            </Stack>
                          </Stack>

                          {log.reason && (
                            <Stack direction="column" alignItems="flex-start" spacing={1}>
                              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                Reason
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  backgroundColor: 'background.neutral',
                                  border: '1px solid #FFE3E3',
                                  borderRadius: 1,
                                  px: 1,
                                  py: 1,
                                }}
                              >
                                {log.reason}
                              </Typography>
                            </Stack>
                          )}
                        </>
                      )}

                      {log.changeType === 'CREATED' && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            backgroundColor: '#E3F2FD',
                            color: 'info.main',
                            border: '2px solid #E3F2FD',
                            borderRadius: 1,
                            px: 1,
                            py: 1,
                            mb: 1,
                            mt: 1,
                            width: '100%',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify
                              icon="mdi:file-document-outline"
                              width={24}
                              height={24}
                              color="info.main"
                            />
                            <Typography variant="body2" sx={{ color: 'info.main' }}>
                              Form Submitted
                            </Typography>
                          </Stack>
                        </Stack>
                      )}
                      {log.changeType === 'RESUBMITTED' && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            backgroundColor: '#FFF3E0',
                            color: 'warning.main',
                            border: '2px solid #FFF3E0',
                            borderRadius: 1,
                            px: 1,
                            py: 1,
                            mb: 1,
                            mt: 1,
                            width: '100%',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify
                              icon="mdi:file-document-outline"
                              width={24}
                              height={24}
                              color="warning.main"
                            />
                            <Typography variant="body2" sx={{ color: 'warning.main' }}>
                              Form Resubmitted
                            </Typography>
                          </Stack>
                        </Stack>
                      )}

                      {log.changeType === 'APPROVED' && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            backgroundColor: '#E8F5E9',
                            color: 'success.main',
                            border: '2px solid #E8F5E9',
                            borderRadius: 1,
                            px: 1,
                            py: 1,
                            mb: 1,
                            mt: 1,
                            width: '100%',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify
                              icon="mdi:check-circle-outline"
                              width={24}
                              height={24}
                              color="success.main"
                            />
                            <Typography variant="body2" sx={{ color: 'success.main' }}>
                              Form has been approved
                            </Typography>
                          </Stack>
                        </Stack>
                      )}
                    </Box>
                  ))}
                </Scrollbar>
              </Card>
            )}
          </Grid>
        </Grid>
      </FormProvider>
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        totalAmount={totalAmount}
        exhibitorFormDetailId={currentForm?.exhibitorFormId}
        email={values?.email}
        reFetchFormData={reFetchFormData}
      />
    </>
  );
}
