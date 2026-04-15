'use client';

import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { format, parseISO, isValid, getMonth } from 'date-fns';

import {
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
    Autocomplete,
    TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Iconify from 'src/components/iconify';
import Upload from 'src/components/upload/upload';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFRadioGroup, RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import { useFileUpload } from 'src/api/team-management';
import { useGetVisaLetter, useSubmitVisaLetter, useUpdateVisaLetter } from 'src/api/plan-your-visit';
import { paths } from 'src/routes/paths';
import { Country } from 'country-state-city';

// ----------------------------------------------------------------------

const VISA_OPTIONS = [
    { label: 'Yes', value: 'YES' },
    { label: 'No', value: 'NO' },
];

// Only July (month index 6) dates are selectable
const shouldDisableDate = (date: Date | null) => {
    if (!date || !isValid(date)) return false;
    return getMonth(date) !== 6; // 6 = July
};

// Restrict calendar navigation to July of current/next year
const JULY_MIN = new Date(new Date().getFullYear(), 6, 1);
const JULY_MAX = new Date(new Date().getFullYear() + 1, 6, 31);

// Format Date to YYYY-MM-DD for API
const formatDateForApi = (date: Date | null | undefined): string => {
    if (!date || !isValid(date)) return '';
    return format(date, 'yyyy-MM-dd');
};

// Parse YYYY-MM-DD from API to Date
const parseDateFromApi = (dateStr: string | null | undefined): Date | undefined => {
    if (!dateStr) return undefined;
    try {
        const parsed = parseISO(dateStr);
        return isValid(parsed) ? parsed : undefined;
    } catch {
        return undefined;
    }
};

// ----------------------------------------------------------------------

const schema = Yup.object().shape({
    arrivalDate: Yup.date().nullable().required('Date of Arrival is required'),
    arrivalTicket: Yup.string().optional(),
    departureDate: Yup.date().nullable().required('Date of Departure is required'),
    departureTicket: Yup.string().optional(),
    needsVisaAssistance: Yup.string().nullable().required('Please select an option'),

    // Visa fields — required only when visa assistance is Yes
    passportNumber: Yup.string().when('needsVisaAssistance', {
        is: 'YES',
        then: (s) => s.required('Passport Number is required'),
        otherwise: (s) => s.nullable(),
    }),
    passportIssueDate: Yup.date()
        .nullable()
        .when('needsVisaAssistance', {
            is: 'YES',
            then: (s) => s.required('Passport Issue Date is required'),
            otherwise: (s) => s.nullable(),
        }),
    passportExpiryDate: Yup.date()
        .nullable()
        .when('needsVisaAssistance', {
            is: 'YES',
            then: (s) => s.required('Passport Expiry Date is required'),
            otherwise: (s) => s.nullable(),
        }),
    nationality: Yup.string().when('needsVisaAssistance', {
        is: 'YES',
        then: (s) => s.required('Nationality is required'),
        otherwise: (s) => s.nullable(),
    }),
});

type FormValues = Yup.InferType<typeof schema>;

// ----------------------------------------------------------------------

export default function PlanYourVisitView() {
    const settings = useSettingsContext();
    const { uploadFile } = useFileUpload();
    const { visaLetterData, visaLetterLoading, reFetch } = useGetVisaLetter();
    const { submitVisaLetter } = useSubmitVisaLetter();
    const { updateVisaLetter } = useUpdateVisaLetter();

    // Track uploading state per field
    const [uploading, setUploading] = useState<Record<string, boolean>>({});

    const isEditMode = useMemo(() => !!visaLetterData?.arrivalDate, [visaLetterData]);

    const methods = useForm<FormValues>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            arrivalDate: undefined,
            arrivalTicket: '',
            departureDate: undefined,
            departureTicket: '',
            needsVisaAssistance: undefined,
            passportNumber: '',
            passportIssueDate: undefined,
            passportExpiryDate: undefined,
            nationality: '',
        },
        mode: 'onChange',
    });

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: { isSubmitting, errors },
    } = methods;

    // Populate form when data is fetched — merge with current values
    // so incoming partial data does not clear user-entered fields (e.g. dates).
    useEffect(() => {
        if (!visaLetterData) return;

        const current = getValues();

        reset({
            arrivalDate: visaLetterData.arrivalDate
                ? parseDateFromApi(visaLetterData.arrivalDate)
                : current.arrivalDate,
            arrivalTicket: visaLetterData.arrivalTicket ?? current.arrivalTicket ?? '',
            departureDate: visaLetterData.departureDate
                ? parseDateFromApi(visaLetterData.departureDate)
                : current.departureDate,
            departureTicket: visaLetterData.departureTicket ?? current.departureTicket ?? '',
            needsVisaAssistance:
                visaLetterData.needsVisaAssistance !== undefined && visaLetterData.needsVisaAssistance !== null
                    ? visaLetterData.needsVisaAssistance
                        ? 'YES'
                        : 'NO'
                    : current.needsVisaAssistance,
            passportNumber: visaLetterData.passportNumber ?? current.passportNumber ?? '',
            passportIssueDate: visaLetterData.passportIssueDate
                ? parseDateFromApi(visaLetterData.passportIssueDate)
                : current.passportIssueDate,
            passportExpiryDate: visaLetterData.passportExpiryDate
                ? parseDateFromApi(visaLetterData.passportExpiryDate)
                : current.passportExpiryDate,
            nationality: visaLetterData.nationality ?? current.nationality ?? '',
        });
    }, [visaLetterData, reset, getValues]);

    const needsVisaAssistance = watch('needsVisaAssistance');
    const arrivalTicket = watch('arrivalTicket');
    const departureTicket = watch('departureTicket');

    // Load list of countries once (client-side). Using useMemo to avoid re-computation.
    const countries = useMemo(() => {
        try {
            return Country.getAllCountries() || [];
        } catch (err) {
            return [];
        }
    }, []);

    // ------------------ File upload helpers ------------------

    const handleDrop = useCallback(
        async (acceptedFiles: File[], fieldName: 'arrivalTicket' | 'departureTicket') => {
            if (!acceptedFiles.length) return;
            const file = acceptedFiles[0];
            setUploading((prev) => ({ ...prev, [fieldName]: true }));
            enqueueSnackbar('Uploading file…', { variant: 'info' });

            try {
                const result = await uploadFile(file);
                if (result?.status === true && result?.metaData?.storeUrl) {
                    setValue(fieldName, result.metaData.storeUrl, { shouldValidate: true });
                    enqueueSnackbar(result?.message || 'File uploaded successfully', { variant: 'success' });
                } else {
                    enqueueSnackbar('Error uploading file', { variant: 'error' });
                }
            } catch {
                enqueueSnackbar('Error uploading file', { variant: 'error' });
            } finally {
                setUploading((prev) => ({ ...prev, [fieldName]: false }));
            }
        },
        [uploadFile, setValue]
    );

    const extractFileName = (url: string) => {
        const fileName = url?.split('/').pop() || '';
        return decodeURIComponent(fileName.split('_').slice(1).join('_')) || fileName;
    };

    // ------------------ Submit ------------------

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEditMode) {
                // PUT — only editable travel fields
                const payload = {
                    arrivalDate: formatDateForApi(data.arrivalDate),
                    arrivalTicket: data.arrivalTicket || null,
                    departureDate: formatDateForApi(data.departureDate),
                    departureTicket: data.departureTicket || null,
                };

                const response = await updateVisaLetter(payload);
                if (response?.data?.status === 'success' || response?.status === 200) {
                    enqueueSnackbar('Travel details updated successfully!');
                    reFetch();
                } else {
                    enqueueSnackbar(
                        response?.response?.data?.message || response?.data?.message || 'Update failed!',
                        { variant: 'error' }
                    );
                }
            } else {
                // POST — all fields
                const payload = {
                    arrivalDate: formatDateForApi(data.arrivalDate),
                    arrivalTicket: data.arrivalTicket || null,
                    departureDate: formatDateForApi(data.departureDate),
                    departureTicket: data.departureTicket || null,
                    needsVisaAssistance: data.needsVisaAssistance === 'YES',
                    passportNumber: data.passportNumber || '',
                    passportIssueDate: formatDateForApi(data.passportIssueDate),
                    passportExpiryDate: formatDateForApi(data.passportExpiryDate),
                    nationality: data.nationality || '',
                };

                const response = await submitVisaLetter(payload);
                if (response?.data?.status === 'success' || response?.status === 200 || response?.status === 201) {
                    enqueueSnackbar('Plan Your Travel submitted successfully!');
                    reFetch();
                } else {
                    enqueueSnackbar(
                        response?.response?.data?.message || response?.data?.message || 'Submission failed!',
                        { variant: 'error' }
                    );
                }
            }
        } catch (error) {
            console.error('Error submitting Plan Your Travel:', error);
            enqueueSnackbar('Form submission failed!', { variant: 'error' });
        }
    });

    // ------------------ Render ------------------

    const showVisaFields = needsVisaAssistance === 'YES';

    if (visaLetterLoading) {
        return (
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Plan Your Travel"
                    links={[
                        { name: 'Overview', href: paths.dashboard.buyer.overview },
                        { name: 'Plan Your Travel' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Plan Your Travel"
                links={[
                    { name: 'Overview', href: paths.dashboard.buyer.overview },
                    { name: 'Plan Your Travel' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Travel Details
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        {/* Date of Arrival */}
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="arrivalDate"
                                control={control}
                                render={({ field, fieldState: { error: fieldError } }) => (
                                    <DatePicker
                                        label="Date of Arrival *"
                                        value={field.value ?? null}
                                        onChange={(val) => field.onChange(val)}
                                        shouldDisableDate={shouldDisableDate}
                                        minDate={JULY_MIN}
                                        maxDate={JULY_MAX}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!fieldError,
                                                helperText: fieldError?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Date of Departure */}
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="departureDate"
                                control={control}
                                render={({ field, fieldState: { error: fieldError } }) => (
                                    <DatePicker
                                        label="Date of Departure *"
                                        value={field.value ?? null}
                                        onChange={(val) => field.onChange(val)}
                                        shouldDisableDate={shouldDisableDate}
                                        minDate={JULY_MIN}
                                        maxDate={JULY_MAX}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!fieldError,
                                                helperText: fieldError?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Upload: Flight Ticket to India */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>
                                Upload Flight Ticket to India
                            </Typography>

                            {arrivalTicket ? (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        px: 2,
                                        py: 1.5,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'primary.main',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '75%',
                                            '&:hover': { color: 'primary.dark' },
                                        }}
                                        onClick={() => window.open(arrivalTicket, '_blank')}
                                    >
                                        {extractFileName(arrivalTicket)}
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="inherit"
                                        variant="outlined"
                                        onClick={() => setValue('arrivalTicket', '', { shouldValidate: true })}
                                    >
                                        Remove
                                    </Button>
                                </Stack>
                            ) : (
                                <Upload
                                    onDrop={(files) => handleDrop(files, 'arrivalTicket')}
                                    accept={{
                                        'application/pdf': ['.pdf'],
                                        'image/jpeg': ['.jpg', '.jpeg'],
                                        'image/png': ['.png'],
                                    }}
                                    disabled={uploading['arrivalTicket']}
                                    helperText={
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: 3,
                                                display: 'block',
                                                textAlign: 'center',
                                                color: errors.arrivalTicket ? 'error.main' : 'text.disabled',
                                            }}
                                        >
                                            {errors.arrivalTicket
                                                ? errors.arrivalTicket.message
                                                : 'Allowed: *.pdf, *.jpg, *.png — Max size 5 MB'}
                                        </Typography>
                                    }
                                    error={!!errors.arrivalTicket}
                                    maxSize={5 * 1024 * 1024}
                                />
                            )}
                        </Grid>

                        {/* Upload: Return / Onward Flight Ticket */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>
                                Upload Return / Onward Flight Ticket
                            </Typography>

                            {departureTicket ? (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        px: 2,
                                        py: 1.5,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'primary.main',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '75%',
                                            '&:hover': { color: 'primary.dark' },
                                        }}
                                        onClick={() => window.open(departureTicket, '_blank')}
                                    >
                                        {extractFileName(departureTicket)}
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="inherit"
                                        variant="outlined"
                                        onClick={() => setValue('departureTicket', '', { shouldValidate: true })}
                                    >
                                        Remove
                                    </Button>
                                </Stack>
                            ) : (
                                <Upload
                                    onDrop={(files) => handleDrop(files, 'departureTicket')}
                                    accept={{
                                        'application/pdf': ['.pdf'],
                                        'image/jpeg': ['.jpg', '.jpeg'],
                                        'image/png': ['.png'],
                                    }}
                                    disabled={uploading['departureTicket']}
                                    helperText={
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: 3,
                                                display: 'block',
                                                textAlign: 'center',
                                                color: errors.departureTicket ? 'error.main' : 'text.disabled',
                                            }}
                                        >
                                            {errors.departureTicket
                                                ? errors.departureTicket.message
                                                : 'Allowed: *.pdf, *.jpg, *.png — Max size 5 MB'}
                                        </Typography>
                                    }
                                    error={!!errors.departureTicket}
                                    maxSize={5 * 1024 * 1024}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Card>
                <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Visa Invitation Assistance
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box
                        component={isEditMode ? 'fieldset' : 'div'}
                        disabled={isEditMode || undefined}
                        sx={{ border: 'none', p: 0, m: 0, ...(isEditMode && { opacity: 0.7 }) }}
                    >
                        <RHFRadioGroup
                            name="needsVisaAssistance"
                            label="Do you need assistance for Visa Invitation? *"
                            options={VISA_OPTIONS}
                            row
                        />

                        {showVisaFields && (
                            <Box sx={{ mt: 3 }}>
                                <Grid container spacing={3}>
                                    {/* Passport Number */}
                                    <Grid item xs={12} md={6}>
                                        <RHFTextField name="passportNumber" label="Passport Number *" />
                                    </Grid>

                                    {/* Passport Issue Date */}
                                    <Grid item xs={12} md={6}>
                                        <Controller
                                            name="passportIssueDate"
                                            control={control}
                                            render={({ field, fieldState: { error: fieldError } }) => (
                                                <DatePicker
                                                    label="Passport Issue Date *"
                                                    value={field.value ?? null}
                                                    onChange={(val) => field.onChange(val)}
                                                    maxDate={new Date()}
                                                    disabled={isEditMode}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!fieldError,
                                                            helperText: fieldError?.message,
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Passport Expiry Date */}
                                    <Grid item xs={12} md={6}>
                                        <Controller
                                            name="passportExpiryDate"
                                            control={control}
                                            render={({ field, fieldState: { error: fieldError } }) => (
                                                <DatePicker
                                                    label="Passport Expiry Date *"
                                                    value={field.value ?? null}
                                                    onChange={(val) => field.onChange(val)}
                                                    minDate={new Date()}
                                                    disabled={isEditMode}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!fieldError,
                                                            helperText: fieldError?.message,
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Nationality */}
                                    <Grid item xs={12} md={6}>
                                        <Controller
                                            name="nationality"
                                            control={control}
                                            render={({ field, fieldState: { error: fieldError } }) => (
                                                <Autocomplete
                                                    options={countries}
                                                    getOptionLabel={(option) => option?.name || ''}
                                                    value={countries.find((c) => c.name === field.value) || null}
                                                    onChange={(_, newValue) => field.onChange(newValue ? newValue.name : '')}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Nationality *"
                                                            fullWidth
                                                            error={!!fieldError}
                                                            helperText={fieldError?.message}
                                                        />
                                                    )}
                                                    autoHighlight
                                                    autoComplete
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Card>

                {/* ─── Submit / Update Button ─── */}
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                    <LoadingButton
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        startIcon={<Iconify icon={isEditMode ? 'eva:edit-fill' : 'eva:checkmark-fill'} />}
                    >
                        {isEditMode ? 'Update' : 'Submit'}
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </Container>
    );
}
