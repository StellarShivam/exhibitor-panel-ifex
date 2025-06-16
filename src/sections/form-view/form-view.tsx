'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useRef } from 'react';

import {
  Box,
  TextField,
  Typography,
  Paper,
  Grid,
  styled,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Backdrop,
  Button,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useSnackbar } from 'src/components/snackbar';

import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
import { useExhibitorForm, updateRegistrationDetails } from 'src/api/form';
import { useEventContext } from 'src/components/event-context';
import { useGetExhibitor } from 'src/api/exhibitor-profile';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const StyledRHFTextField = styled(RHFTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#262626',
    },
    '&:hover fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
      fontSize: '1.1rem',
      borderColor: 'black',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '1rem',
    '&.Mui-focused': {
      fontSize: '1rem',
    },
    '&.MuiInputLabel-shrink': {
      fontSize: '1rem',
    },
  },
}));

const capitalizeFirstLetter = (string: string | undefined | null): string => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function ExhibitorForm() {
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [pdfGenerating, setPdfGenerating] = useState(false); // State to manage PDF generation

  const { eventData } = useEventContext();
  //   const { emailId } = useParams<{ emailId: string }>();

  const [data, setData] = useState<any>(null); // State to hold exhibitor data

  const { exhibitor } = useGetExhibitor(eventData.state.exhibitorId);

  useEffect(() => {
    if (exhibitor) {
      setData(exhibitor);
    } else if (exhibitor) {
      console.error('Failed to fetch exhibitor data');
    }
    // eslint-disable-next-line
  }, [exhibitor]);

  const { exhibitorForm, exhibitorFormLoading } = useExhibitorForm(
    exhibitor?.supportEmail,
    eventData.state.eventId
  );

  // --- 1. Update Yup schema to match payload fields ---
  const ExhibitorSchema = Yup.object().shape({
    phone: Yup.string().required('Phone is required'),
    eventId: Yup.number().required('Event ID is required'),
    exhibitorId: Yup.number(),
    userCohort: Yup.string().required('User Cohort is required'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    image: Yup.string().nullable(),
    imgUrl: Yup.string().nullable(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    companyOrganizationName: Yup.string().required('Company name is required'),
    companyAddress: Yup.string().required('Company address is required'),
    companyEmail: Yup.string().required('Company email is required').email('Invalid email format'),
    companyContact: Yup.string().required('Company contact is required'),
    companyPanNo: Yup.string().required('PAN number is required'),
    companyGstin: Yup.string().required('GST number is required'),
    directorName: Yup.string().nullable(),
    data: Yup.object().shape({
      secondaryContactPersonEmail: Yup.string(),
      country: Yup.string().required('Country is required'),
      tds: Yup.string().required('TDS is required'),
      buyPremiumLocation: Yup.string(),
      billingAddressLine1: Yup.string().required('Billing address is required'),
      city: Yup.string().required('City is required'),
      accountsPersonEmail: Yup.string(),
      weProvide: Yup.string(),
      fasciaName: Yup.string(),
      postalCode: Yup.string().required('Postal code is required'),
      accountsPersonDesignation: Yup.string(),
      msmeUdyogNumber: Yup.string(),
      accountsPersonPhone: Yup.string(),
      primaryContactPersonEmail: Yup.string(),
      secondaryContactPersonDesignation: Yup.string(),
      iifMember: Yup.string(),
      stateProvinceRegion: Yup.string().required('State is required'),
      participationInterest: Yup.string(),
      corporateWebsite: Yup.string(),
      areaType: Yup.string(),
      addressLine1: Yup.string().required('Address is required'),
      billingCountry: Yup.string(),
      secondaryContactPersonPhone: Yup.string(),
      currency: Yup.string(),
      pricePerSqm: Yup.string(),
      iifMembershipNumber: Yup.string(),
      otherBusinessEntityType: Yup.string(),
      primaryContactPersonDesignation: Yup.string(),
      billingStateProvinceRegion: Yup.string(),
      businessEntityType: Yup.string(),
      accountsPersonName: Yup.string(),
      hasMsmeNumber: Yup.string(),
      secondaryContactPersonName: Yup.string(),
      hasGstNumber: Yup.string(),
      tanNumber: Yup.string(),
      calculatedTotalCost: Yup.string(),
      areaRequired: Yup.string(),
      billingPostalCode: Yup.string(),
      corporateEmail: Yup.string(),
      billingCity: Yup.string(),
      proformaInvoice: Yup.string(),
    }),
  });

  // --- 2. Update defaultValues to match payload fields ---
  console.log(exhibitorForm);
  const defaultValues = useMemo(
    () => ({
      phone: exhibitorForm?.phone || '',
      eventId: exhibitorForm?.eventId || '',
      exhibitorId: exhibitorForm?.exhibitorId || '',
      userCohort: exhibitorForm?.userCohort || '',
      email: exhibitorForm?.email || '',
      image: exhibitorForm?.image || '',
      imgUrl: exhibitorForm?.imgUrl || '',
      firstName: exhibitorForm?.firstName || '',
      lastName: exhibitorForm?.lastName || '',
      companyOrganizationName: exhibitorForm?.companyOrganizationName || '',
      companyAddress: exhibitorForm?.companyAddress || '',
      companyEmail: exhibitorForm?.companyEmail || '',
      companyContact: exhibitorForm?.companyContact || '',
      companyPanNo: exhibitorForm?.companyPanNo || '',
      companyGstin: exhibitorForm?.companyGstin || '',
      directorName: exhibitorForm?.directorName || '',
      data: {
        accountPersonEmailAddress: exhibitorForm?.data?.accountsPersonEmail || '',
        country: exhibitorForm?.data?.country || '',
        tds: exhibitorForm?.data?.tds || '',
        buyPremiumLocation: capitalizeFirstLetter(exhibitorForm?.data?.buyPremiumLocation) || '',
        billingAddressLine1: exhibitorForm?.data?.billingAddressLine1 || '',
        city: exhibitorForm?.data?.city || '',
        accountsPersonName: exhibitorForm?.data?.accountsPersonName || '',
        accountsPersonPhone: exhibitorForm?.data?.accountsPersonPhone || '',
        accountsPersonEmail: exhibitorForm?.data?.accountsPersonEmail || '',
        accountsPersonDesignation: exhibitorForm?.data?.accountsPersonDesignation || '',
        msmeUdyogNumber: exhibitorForm?.data?.msmeUdyogNumber || '',
        contactPersonEmailAddress: exhibitorForm?.data?.primaryContactPersonEmail || '',
        contactPersonDesignation: exhibitorForm?.data?.primaryContactPersonDesignation || '',
        iifMember: capitalizeFirstLetter(exhibitorForm?.data?.iifMember) || '',
        stateProvinceRegion: exhibitorForm?.data?.stateProvinceRegion || '',
        participationInterest: exhibitorForm?.data?.participationInterest || '',
        corporateWebsite: exhibitorForm?.data?.corporateWebsite || '',
        areaType: exhibitorForm?.data?.areaType || '',
        addressLine1: exhibitorForm?.data?.addressLine1 || '',
        addressLine2: exhibitorForm?.data?.addressLine2 || '',
        billingCountry: exhibitorForm?.data?.billingCountry || '',
        contactPersonMobileNumber: exhibitorForm?.data?.secondaryContactPersonPhone || '',
        currency: exhibitorForm?.data?.currency || '',
        pricePerSqm: exhibitorForm?.data?.pricePerSqm || '',
        iifMembershipNumber: exhibitorForm?.data?.iifMembershipNumber || '',
        otherBusinessEntityType: exhibitorForm?.data?.otherBusinessEntityType || '',
        primaryContactPersonDesignation: exhibitorForm?.data?.primaryContactPersonDesignation || '',
        billingStateProvinceRegion: exhibitorForm?.data?.billingStateProvinceRegion || '',
        businessEntityType: exhibitorForm?.data?.businessEntityType || '',
        accountsPersonName: exhibitorForm?.data?.accountsPersonName || '',
        hasMsmeNumber: capitalizeFirstLetter(exhibitorForm?.data?.hasMsmeNumber) || '',
        secondaryContactPersonName: exhibitorForm?.data?.secondaryContactPersonName || '',
        secondaryContactPersonEmail: exhibitorForm?.data?.secondaryContactPersonEmail || '',
        secondaryContactPersonDesignation:
          exhibitorForm?.data?.secondaryContactPersonDesignation || '',
        secondaryContactPersonPhone: exhibitorForm?.data?.secondaryContactPersonPhone || '',
        hasGstNumber: capitalizeFirstLetter(exhibitorForm?.data?.hasGstNumber) || '',
        tanNumber: exhibitorForm?.data?.tanNumber || '',
        calculatedTotalCost: exhibitorForm?.data?.calculatedTotalCost || '',
        areaRequired: exhibitorForm?.data?.areaRequired || '',
        billingPostalCode: exhibitorForm?.data?.billingPostalCode || '',
        corporateEmail: exhibitorForm?.data?.corporateEmail || '',
        billingCity: exhibitorForm?.data?.billingCity || '',
        proformaInvoice: exhibitorForm?.data?.proformaInvoice || '',
        postalCode: exhibitorForm?.data?.postalCode || '',
        weProvide: exhibitorForm?.data?.weProvide || '',
        otherWeProvide: exhibitorForm?.data?.otherWeProvide || '',
        fasciaName: exhibitorForm?.data?.fasciaName || '',
      },
    }),
    [exhibitorForm]
  );

  const methods = useForm({
    resolver: yupResolver(ExhibitorSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (exhibitorForm && !exhibitorFormLoading) {
      reset(defaultValues);
    }
  }, [exhibitorForm, exhibitorFormLoading, reset, defaultValues]);

  // --- 3. Update onSubmit to match payload structure ---
  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await updateRegistrationDetails(data);
      enqueueSnackbar('Form submitted successfully!');
      setIsEditable(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar('Form submission failed!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  });

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev);
  };

  const pdfContentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [userIp, setUserIp] = useState<string>(''); // State to hold user's IP address

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setUserIp(data.ip))
      .catch(() => setUserIp('Unavailable'));
  }, []);

  const handleDownloadPdf = async () => {
    const elementToCapture = pdfContentRef.current;
    if (!elementToCapture) {
      enqueueSnackbar('Error: Could not find the content to print.', { variant: 'error' });
      return;
    }

    setPdfGenerating(true);

    // Store original styles
    const originalStyles = {
      overflow: elementToCapture.style.overflow,
      height: elementToCapture.style.height,
      maxHeight: elementToCapture.style.maxHeight,
      width: elementToCapture.style.width,
      transform: elementToCapture.style.transform,
      transformOrigin: elementToCapture.style.transformOrigin,
    };

    // Set a fixed width for A4 (210mm at 96dpi ≈ 794px) and scale to 100%
    elementToCapture.style.width = '1080px'; // Fixed width for A4
    elementToCapture.style.transform = 'scale(1)';
    elementToCapture.style.transformOrigin = 'top left';
    elementToCapture.style.overflow = 'visible';
    elementToCapture.style.height = 'auto';
    elementToCapture.style.maxHeight = 'none';

    elementToCapture.scrollIntoView({ behavior: 'instant', block: 'start' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        logging: process.env.NODE_ENV === 'development',
        width: 1080, // Fixed width for A4
        // height: elementToCapture.scrollHeight, // Let html2canvas calculate height
        windowWidth: 1080, // Fixed width for A4
        // windowHeight: elementToCapture.scrollHeight,
        x: 0,
        y: 0,
      });

      // Restore original styles immediately after canvas capture
      elementToCapture.style.overflow = originalStyles.overflow;
      elementToCapture.style.height = originalStyles.height;
      elementToCapture.style.maxHeight = originalStyles.maxHeight;
      elementToCapture.style.width = originalStyles.width;
      elementToCapture.style.transform = originalStyles.transform;
      elementToCapture.style.transformOrigin = originalStyles.transformOrigin;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true,
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      const sourceCanvas = canvas;
      const sourceWidthPx = sourceCanvas.width;
      const sourceHeightPx = sourceCanvas.height;

      // Margins
      const FIRST_PAGE_TOP_MARGIN = 4;
      const SUBSEQUENT_PAGE_TOP_MARGIN = 4;
      const ALL_PAGE_BOTTOM_MARGIN = 10;
      const xPositionOnPdf = 0;

      let yPosOnSourceCanvas = 0;
      let pageNum = 0;

      // Get current timestamp and site URL
      const timestamp = new Date().toLocaleString();
      const siteUrl = window.location.origin + window.location.pathname;
      const ipText = `IP: ${userIp}`;

      while (yPosOnSourceCanvas < sourceHeightPx) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        const currentTopMargin = pageNum === 0 ? FIRST_PAGE_TOP_MARGIN : SUBSEQUENT_PAGE_TOP_MARGIN;
        const imageYPositionOnPdf = currentTopMargin;

        let availableHeightOnPdf = pdfPageHeight - currentTopMargin - ALL_PAGE_BOTTOM_MARGIN;

        if (availableHeightOnPdf <= 0) {
          console.error('Error: PDF page margins are too large, no space for content.');
          enqueueSnackbar('Error: PDF page margins are too large to fit content.', {
            variant: 'error',
          });
          break;
        }

        const remainingSourceHeightPx = sourceHeightPx - yPosOnSourceCanvas;
        const scaledHeightOfRemainingSourceOnPdf =
          (remainingSourceHeightPx * pdfPageWidth) / sourceWidthPx;

        let sliceHeightOnPdf = Math.min(availableHeightOnPdf, scaledHeightOfRemainingSourceOnPdf);

        if (sliceHeightOnPdf <= 0.001) {
          break;
        }

        let sliceHeightOnSourcePx = (sliceHeightOnPdf * sourceWidthPx) / pdfPageWidth;

        if (yPosOnSourceCanvas + sliceHeightOnSourcePx > sourceHeightPx) {
          sliceHeightOnSourcePx = sourceHeightPx - yPosOnSourceCanvas;
          sliceHeightOnPdf = (sliceHeightOnSourcePx * pdfPageWidth) / sourceWidthPx;
        }

        if (sliceHeightOnSourcePx <= 0.001) {
          break;
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceWidthPx;
        tempCanvas.height = sliceHeightOnSourcePx;
        const tempCtx = tempCanvas.getContext('2d');

        if (!tempCtx) {
          console.error('Error: Could not get 2D context from temporary canvas.');
          enqueueSnackbar('Error: Failed to prepare image slice for PDF.', { variant: 'error' });
          break;
        }

        tempCtx.drawImage(
          sourceCanvas,
          0,
          yPosOnSourceCanvas,
          sourceWidthPx,
          sliceHeightOnSourcePx,
          0,
          0,
          sourceWidthPx,
          sliceHeightOnSourcePx
        );

        const pageImageDataUrl = tempCanvas.toDataURL('image/png');

        pdf.addImage(
          pageImageDataUrl,
          'PNG',
          xPositionOnPdf,
          imageYPositionOnPdf,
          pdfPageWidth,
          sliceHeightOnPdf
        );

        // --- Add footer and header ---
        pdf.setFontSize(8);
        // Bottom left: site URL
        pdf.text(siteUrl, 8, pdfPageHeight - 4, { align: 'left' });
        // Bottom right: page number
        pdf.text(`Page ${pageNum + 1}`, pdfPageWidth - 8, pdfPageHeight - 4, { align: 'right' });
        // Top left: timestamp
        pdf.text(timestamp, 4, 3, { align: 'left' });
        // Top right: IP address
        pdf.text(ipText, pdfPageWidth - 8, 3, { align: 'right' });

        yPosOnSourceCanvas += sliceHeightOnSourcePx;
        pageNum++;
      }

      pdf.save(
        exhibitorForm?.companyOrganizationName
          ? exhibitorForm?.companyOrganizationName + '_Exhibitor_Submission_Overview.pdf'
          : 'Exhibitor_Submission_Overview.pdf'
      );
      enqueueSnackbar('PDF downloaded successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      enqueueSnackbar(`Error generating PDF: ${errorMessage}. Check console.`, {
        variant: 'error',
      });
      // Restore original styles in case of error too
      elementToCapture.style.overflow = originalStyles.overflow;
      elementToCapture.style.height = originalStyles.height;
      elementToCapture.style.maxHeight = originalStyles.maxHeight;
    } finally {
      setPdfGenerating(false);
    }
  };

  // Function to open a PDF link in a new window
  const openPdfFromLink = (pdfUrl: string) => {
    if (pdfUrl && pdfUrl.trim() !== '') {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      enqueueSnackbar('Proforma invoice not available.', { variant: 'warning' });
    }
  };

  const premiumLocation = watch('data.buyPremiumLocation');

  const [amountPostPremium, setAmountPostPremium] = useState<number>(watch('data.calculatedTotalCost'));

  console.log('amountPostPremium', amountPostPremium);

  useEffect(() => {
    const totalCost = Number(watch('data.calculatedTotalCost')) || 0;
    if (premiumLocation === 'Yes') {
      const premiumPercentage = 0.125; // 12.5%
      const premiumAmount = totalCost * premiumPercentage;
      setAmountPostPremium(totalCost + premiumAmount);
    } else {
      setAmountPostPremium(totalCost);
    }
  }, [watch('data.buyPremiumLocation'), watch('data.calculatedTotalCost')]);

  return (
    <>
      <></>
      <div id="pdf-content" ref={pdfContentRef}>
        {' '}
        {(loading || isSubmitting) && (
          <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 4 }}>
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <Box sx={{ bgcolor: '#3090C8', color: 'white', p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
            Exhibitor Submission Overview
          </Typography>
          <Typography variant="body1">
            Here are the details submitted by the exhibitor during registration. Use this view to
            verify booth preferences, company info, documents, and payment structure.
          </Typography>
        </Box>
        <img src="/frame.png" alt="logo" />
        <Box sx={{ px: 3, py: 2, display: 'flex', gap: 1 }}>
          {!pdfGenerating && (
            <>
              {/* <Button
                variant="contained"
                startIcon={<Box component="img" src="/Edit.svg" sx={{ width: 20, height: 20 }} />}
                onClick={toggleEditMode}
                sx={{
                  bgcolor: isEditable ? '#3090C8' : '#2D3250',
                  '&:hover': { bgcolor: isEditable ? '#FF3A0A' : '#1a1e30' },
                  textTransform: 'none',
                  px: 2,
                }}
              >
                {isEditable ? 'Cancel Edit' : 'Edit'}
              </Button> */}
              <Button
                variant="contained"
                startIcon={
                  <Box component="img" src="/logo/Export_Pdf.svg" sx={{ width: 20, height: 20 }} />
                }
                sx={{
                  bgcolor: '#2D3250',
                  '&:hover': { bgcolor: '#1a1e30' },
                  textTransform: 'none',
                  px: 2,
                }}
                onClick={handleDownloadPdf}
                ref={buttonRef}
              >
                Download PDF Summary
              </Button>
              <Button
                variant="contained"
                startIcon={
                  <Box component="img" src="/logo/Export_Pdf.svg" sx={{ width: 20, height: 20 }} />
                }
                sx={{
                  bgcolor: '#2D3250',
                  '&:hover': { bgcolor: '#1a1e30' },
                  textTransform: 'none',
                  px: 2,
                }}
                onClick={() => openPdfFromLink(exhibitorForm?.data?.proformaInvoice)}
                ref={buttonRef}
              >
                Proforma Invoice
              </Button>
            </>
          )}
        </Box>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box sx={{ py: 2 }}>
            {/* Top-level fields */}
            <StyledPaper>
              <Typography sx={{ pb: 1 }} variant="h6" gutterBottom>
                Exhibitor Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Company Name*
                  </Typography>
                  <StyledRHFTextField
                    name="companyOrganizationName"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Are you an existing member for IIF?*
                  </Typography>
                  <StyledRHFTextField
                    name="data.iifMember"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    IIF Company Membership Number*
                  </Typography>
                  <StyledRHFTextField
                    name="data.iifMembershipNumber"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
            <StyledPaper>
              <Typography sx={{ pb: 1 }} variant="h6" gutterBottom>
                Company Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Company Email *
                  </Typography>
                  <StyledRHFTextField
                    name="companyEmail"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Company PAN Number*
                  </Typography>
                  <StyledRHFTextField
                    name="companyPanNo"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Do you have a GST Number?*
                  </Typography>
                  <StyledRHFTextField
                    name="data.hasGstNumber"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    If Yes, Please Specify your GST Number*
                  </Typography>
                  <StyledRHFTextField
                    name="companyGstin"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                {/* <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Company Contact *
                  </Typography>
                  <RHFTextField
                    name="companyContact"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Director Name
                  </Typography>
                  <RHFTextField
                    name="directorName"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    MSME Udyog Number
                  </Typography>
                  <RHFTextField
                    name="data.msmeUdyogNumber"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    TAN Number
                  </Typography>
                  <RHFTextField
                    name="data.tanNumber"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid> */}
              </Grid>
            </StyledPaper>
            <StyledPaper>
              <Typography sx={{ pb: 1 }} variant="h6" gutterBottom>
                Company Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Address Line 1*
                  </Typography>
                  <StyledRHFTextField
                    name="data.addressLine1"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Address Line 2 (Optional)
                  </Typography>
                  <StyledRHFTextField
                    name="data.addressLine2"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Country *
                  </Typography>
                  <StyledRHFTextField
                    name="data.country"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    State / Province / Region*
                  </Typography>
                  <StyledRHFTextField
                    name="data.stateProvinceRegion"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    City / Town*
                  </Typography>
                  <StyledRHFTextField
                    name="data.city"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Postal Code / ZIP Code*
                  </Typography>
                  <StyledRHFTextField
                    name="data.postalCode"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Billing Address Section */}
            <StyledPaper>
              <Typography sx={{ pb: 1 }} variant="h6" gutterBottom>
                Billing Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Address Line 1*
                  </Typography>
                  <StyledRHFTextField
                    name="data.billingAddressLine1"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Address Line 2 (Optional)
                  </Typography>
                  <StyledRHFTextField
                    name="data.billingAddressLine2"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Country*
                  </Typography>
                  <StyledRHFTextField
                    name="data.billingCountry"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    State / Province / Region*
                  </Typography>
                  <StyledRHFTextField
                    name="data.billingStateProvinceRegion"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    City / Town*
                  </Typography>
                  <StyledRHFTextField
                    name="data.billingCity"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Postal Code / ZIP Code*
                  </Typography>
                  <StyledRHFTextField
                    name="data.billingPostalCode"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>
            </StyledPaper>

            <StyledPaper>
              <Typography sx={{ pb: 1 }} variant="h6" gutterBottom>
                Communication Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Corporate Email Id*
                  </Typography>
                  <StyledRHFTextField
                    name="data.corporateEmail"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Corporate Phone Number*
                  </Typography>
                  <StyledRHFTextField
                    name="companyContact"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Corporate Website*
                  </Typography>
                  <StyledRHFTextField
                    name="data.corporateWebsite"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Contact Person Details Section */}
            <StyledPaper>
              <Typography sx={{ pb: 1 }} variant="h6" gutterBottom>
                Contact Person Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Primary Contact Person Name*
                  </Typography>
                  <StyledRHFTextField
                    name="firstName"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Primary Contact : Designation*
                  </Typography>
                  <StyledRHFTextField
                    name="data.primaryContactPersonDesignation"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Primary Contact : Mobile Number*
                  </Typography>
                  <StyledRHFTextField
                    name="phone"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Primary Contact : Email*
                  </Typography>
                  <StyledRHFTextField
                    name="email"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Secondary Contact Person Name
                  </Typography>
                  <StyledRHFTextField
                    name="data.secondaryContactPersonName"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Secondary Contact : Designation
                  </Typography>
                  <StyledRHFTextField
                    name="data.secondaryContactPersonDesignation"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Secondary Contact : Mobile Number
                  </Typography>
                  <StyledRHFTextField
                    name="data.secondaryContactPersonPhone"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Secondary Contact : Email
                  </Typography>
                  <StyledRHFTextField
                    name="data.secondaryContactPersonEmail"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>
            </StyledPaper>

            <StyledPaper>
              <Typography sx={{ pb: 1 }} variant="h6" gutterBottom>
                Accounts Person Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Accounts Person Name*
                  </Typography>
                  <StyledRHFTextField
                    name="data.accountsPersonName"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Accounts Person : Designation*
                  </Typography>
                  <StyledRHFTextField
                    name="data.accountsPersonDesignation"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Accounts Person : Mobile Number*
                  </Typography>
                  <StyledRHFTextField
                    name="data.accountsPersonPhone"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Accounts Person : Email*
                  </Typography>
                  <StyledRHFTextField
                    name="data.accountsPersonEmail"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Fascia Name*
                  </Typography>
                  <StyledRHFTextField
                    name="data.fasciaName"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>
            </StyledPaper>

            <StyledPaper>
              <Typography sx={{ pb: 1 }} variant="h6" gutterBottom>
                Business Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Are you registered with MSME?*
                  </Typography>
                  <StyledRHFTextField
                    name="data.hasMsmeNumber"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Enter Udyog Aadhaar Number*
                  </Typography>
                  <StyledRHFTextField
                    name="data.msmeUdyogNumber"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    We are*
                  </Typography>
                  <StyledRHFTextField
                    name="data.businessEntityType"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Please Specify*
                  </Typography>
                  <StyledRHFTextField
                    name="data.otherBusinessEntityType"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    We Deal with*
                  </Typography>
                  <StyledRHFTextField
                    name="data.weProvide"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Please Specify*
                  </Typography>
                  <StyledRHFTextField
                    name="data.otherWeProvide"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select the event you will be participating in*
                  </Typography>
                  <StyledRHFTextField
                    name="data.participationInterest"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Nested data fields */}

            <StyledPaper>
              <Typography sx={{ pb: 1 }} variant="h6" gutterBottom>
                Booth Type
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Are you an exhibitor from India or an International exhibitor?*
                  </Typography>
                  <StyledRHFTextField
                    name="data.participationInterest"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>
              <FormControl component="fieldset" fullWidth>
                <FormLabel sx={{ pt: 2 }} component="legend">
                  Select your booth type *
                </FormLabel>
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell>Booth Type</StyledTableCell>
                        <StyledTableCell>Min. Area</StyledTableCell>
                        <StyledTableCell>Rate (INR/sqm)</StyledTableCell>
                        <StyledTableCell>Rate (Euro/sqm)</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>
                          <Radio
                            value="Shell"
                            checked={watch('data.areaType') === 'Shell'}
                            onChange={(e) =>
                              setValue('data.areaType', e.target.value, { shouldValidate: true })
                            }
                            name="boothType-radio"
                            disabled={!isEditable}
                          />
                        </StyledTableCell>
                        <StyledTableCell>Shell</StyledTableCell>
                        <StyledTableCell>12 sqm</StyledTableCell>
                        <StyledTableCell>₹10500</StyledTableCell>
                        <StyledTableCell>€300</StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell>
                          <Radio
                            value="Bare Space"
                            checked={watch('data.areaType') === 'Bare Space'}
                            onChange={(e) =>
                              setValue('data.areaType', e.target.value, { shouldValidate: true })
                            }
                            name="boothType-radio"
                            disabled={!isEditable}
                          />
                        </StyledTableCell>
                        <StyledTableCell>Bare Space</StyledTableCell>
                        <StyledTableCell>18 sqm</StyledTableCell>
                        <StyledTableCell>₹10000</StyledTableCell>
                        <StyledTableCell>€275</StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* <FormLabel component="legend">
                  * Premium location charges (2-side, 3-side, or 4-side open) will incur an
                  additional 12.5% fee.
                </FormLabel>
                <FormLabel component="legend">* GST extra as applicable</FormLabel> */}
              </FormControl>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Do you want to buy a prefered location?*
                  </Typography>
                  <StyledRHFTextField
                    name="data.buyPremiumLocation"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Area Required? (sqm) *
                  </Typography>
                  <StyledRHFTextField
                    name="data.areaRequired"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Currency
                  </Typography>
                  <StyledRHFTextField
                    name="data.currency"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Estimated Total Cost
                  </Typography>
                  <StyledRHFTextField
                    name="data.calculatedTotalCost"
                    InputProps={{ readOnly: !isEditable }}
                    value={amountPostPremium}
                  />
                  {premiumLocation === 'Yes' ? (
                    <FormLabel component="legend" sx={{ mt: 2 }}>
                      {/* * Premium location charges (2-side, 3-side, or 4-side open) will incur an
                      additional 12.5% fee. */}

                      *Price is inclusive of 12.5% prefered location charges (2-side, 3-side, or 4-side open).
                    </FormLabel>) : null
                  }
                  <FormLabel component="legend" sx={{ mt: 2 }}>* GST extra as applicable</FormLabel>

                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    TDS Percentage*
                  </Typography>
                  <StyledRHFTextField
                    name="data.tds"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    TAN Number
                  </Typography>
                  <StyledRHFTextField
                    name="data.tanNumber"
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
            {/* {!pdfGenerating && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, px: 3 }}>
                <LoadingButton
                  disabled={!isEditable}
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  Submit Form
                </LoadingButton>
              </Box>
            )} */}
          </Box>
        </FormProvider>
      </div>
    </>
  );
}
