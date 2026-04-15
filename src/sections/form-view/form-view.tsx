'use client';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useRef } from 'react';
import { exhibitorRegistrationSchema } from './ExhibitorRegistration/schema';

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
  MenuItem,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useSnackbar } from 'src/components/snackbar';

import FormProvider, { RHFTextField, RHFRadioGroup, RHFSelect } from 'src/components/hook-form';
import { RHFMultiCheckbox } from 'src/components/hook-form/rhf-checkbox';
import { useExhibitorForm, updateRegistrationDetails, generateProformaInvoice, getViewFormData } from 'src/api/form';
import { useEventContext } from 'src/components/event-context';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Iconify from 'src/components/iconify';
import { useGetExhibitor } from 'src/api/exhibitor-profile';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

// Product Categories Data Structure
const productCategories = {
  '1': {
    id: '1',
    name: 'APPAREL & FASHION',
    subCategories: [
      { id: '1.1', label: '1.1 Menswear', value: '1.1' },
      { id: '1.2', label: '1.2 Womenswear', value: '1.2' },
      { id: '1.3', label: '1.3 Kidswear', value: '1.3' },
      { id: '1.4', label: '1.4 Sarees', value: '1.4' },
      { id: '1.5', label: '1.5 Innerwear & Sleepwear', value: '1.5' },
      { id: '1.6', label: '1.6 Scarfs, Stoles and Shawls', value: '1.6' },
      { id: '1.7', label: '1.7 Accessories', value: '1.7' },
      { id: '1.8', label: '1.8 Brands of India', value: '1.8' },
      { id: '1.9', label: '1.9 Combined', value: '1.9' },
      { id: '1.10', label: '1.10 Others', value: '1.10' },
    ],
  },
  '2': {
    id: '2',
    name: 'FABRICS & ACCESSORIES',
    subCategories: [
      { id: '2.1', label: '2.1 Knitted', value: '2.1' },
      { id: '2.2', label: '2.2 Woven', value: '2.2' },
      { id: '2.3', label: '2.3 Denim', value: '2.3' },
      { id: '2.4', label: '2.4 Trim/Embellishments & Accessories', value: '2.4' },
      { id: '2.5', label: '2.5 Recycled', value: '2.5' },
      { id: '2.6', label: '2.6 Integrated (Units of Complete value chain)', value: '2.6' },
      { id: '2.7', label: '2.7 Combined', value: '2.7' },
      { id: '2.8', label: '2.8 Others', value: '2.8' },
    ],
  },
  '3': {
    id: '3',
    name: 'HOME TEXTILES',
    subCategories: [
      { id: '3.1', label: '3.1 Bed Linen', value: '3.1' },
      { id: '3.2', label: '3.2 Bath Linen', value: '3.2' },
      { id: '3.3', label: '3.3 Kitchen Linen', value: '3.3' },
      { id: '3.4', label: '3.4 Curtains & Drapes/Furnishing', value: '3.4' },
      { id: '3.5', label: '3.5 Wall Decor', value: '3.5' },
      { id: '3.6', label: '3.6 Combined', value: '3.6' },
      { id: '3.7', label: '3.7 Others', value: '3.7' },
    ],
  },
  '4': {
    id: '4',
    name: 'FIBRES & YARNS',
    subCategories: [
      { id: '4.1', label: '4.1 Fiber/Filament', value: '4.1' },
      { id: '4.2', label: '4.2 Recycled', value: '4.2' },
      { id: '4.3', label: '4.3 Yarns', value: '4.3' },
      { id: '4.4', label: '4.4 Combined', value: '4.4' },
      { id: '4.5', label: '4.5 Others', value: '4.5' },
    ],
  },
  '5': {
    id: '5',
    name: 'TECHNICAL TEXTILES',
    subCategories: [
      { id: '5.1', label: '5.1 Fabric', value: '5.1' },
      { id: '5.2', label: '5.2 Functional Wear', value: '5.2' },
      { id: '5.3', label: '5.3 Footwear', value: '5.3' },
      { id: '5.4', label: '5.4 Combined', value: '5.4' },
      { id: '5.5', label: '5.5 Others', value: '5.5' },
    ],
  },
};

export default function ExhibitorForm() {
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false); // State to toggle edit mode - always false for view-only
  const [pdfGenerating, setPdfGenerating] = useState(false); // State to manage PDF generation
  const { enqueueSnackbar } = useSnackbar();
  const [userIp, setUserIp] = useState<string>('');
  const [viewFormData, setViewFormData] = useState<any>(null);
  const [viewFormLoading, setViewFormLoading] = useState(true);

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

  // Fetch view form data
  useEffect(() => {
    const fetchViewFormData = async () => {
      try {
        setViewFormLoading(true);
        const formData = await getViewFormData();
        setViewFormData(formData);
        console.log('View Form Data:', formData);
      } catch (error) {
        console.error('Error fetching view form data:', error);
        enqueueSnackbar('Failed to fetch form data', { variant: 'error' });
      } finally {
        setViewFormLoading(false);
      }
    };

    fetchViewFormData();
  }, [enqueueSnackbar]);

  const { exhibitorForm, exhibitorFormLoading } = useExhibitorForm(
    exhibitor?.supportEmail,
    eventData.state.eventId
  );

  const defaultValues = useMemo(
    () => {
      const formData = viewFormData || {};
      
      return {
        participationType: formData.participationType || '',
        councilId: formData.councilId ? String(formData.councilId) : '',
        otherCouncilName: formData.otherCouncilName || '',
        companyName: formData.companyName || '',
        website: formData.website || '',
        address: formData.address || '',
        country: formData.country || '',
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.postalCode ? String(formData.postalCode) : '',
        contactPersonPrefix: formData.contactPersonPrefix || '',
        contactPersonFirstName: formData.contactPersonFirstName || '',
        contactPersonMiddleName: formData.contactPersonMiddleName || '',
        contactPersonLastName: formData.contactPersonLastName || '',
        designation: formData.designation || '',
        email: formData.email || '',
        mobile: formData.mobile || '',
        billingAddressSame: formData.billingAddressSame || false,
        billingCompanyName: formData.billingCompanyName || '',
        billingWebsiteAddress: formData.billingWebsiteAddress || '',
        billingAddress: formData.billingAddress || '',
        billingCountry: formData.billingCountry || '',
        billingCity: formData.billingCity || '',
        billingState: formData.billingState || '',
        billingPostalCode: formData.billingPostalCode ? String(formData.billingPostalCode) : '',
        billingContactPersonPrefix: formData.billingContactPersonPrefix || '',
        billingContactPersonFirstName: formData.billingContactPersonFirstName || '',
        billingContactPersonMiddleName: formData.billingContactPersonMiddleName || '',
        billingContactPersonLastName: formData.billingContactPersonLastName || '',
        billingContactPersonDesignation: formData.billingContactPersonDesignation || '',
        billingEmail: formData.billingEmail || '',
        billingContactNumber: formData.billingContactNumber || '',
        panNumber: formData.panNumber || '',
        tanNumber: formData.tanNumber || '',
        gstNumber: formData.gstNumber || '',
        vatNumber: formData.vatNumber || '',
        gstState: formData.gstState || '',
        stateCode: formData.stateCode ? String(formData.stateCode) : '',
        exportMarkets: Array.isArray(formData.exportMarkets) ? formData.exportMarkets : [],
        otherExportMarket: formData.otherExportMarket || '',
        directorPrefix: formData.directorPrefix || '',
        directorFirstName: formData.directorFirstName || '',
        directorMiddleName: formData.directorMiddleName || '',
        directorLastName: formData.directorLastName || '',
        directors: Array.isArray(formData.directors) ? formData.directors : [],
        isMsme: formData.isMsme === true || formData.isMsme === 'Yes' ? 'Yes' : 'No',
        msmeNumber: formData.msmeNumber || '',
        companyBio: formData.companyBio || '',
        businessNature: Array.isArray(formData.businessNature) ? formData.businessNature : [],
        otherBusinessNature: formData.otherBusinessNature || '',
        productGroupId: formData.productGroupId ? String(formData.productGroupId) : '',
        productCategory: Array.isArray(formData.productCategory) ? formData.productCategory : [],
        otherProductCategory: formData.otherProductCategory || '',
        productSubCategory: Array.isArray(formData.productSubCategory) ? formData.productSubCategory : [],
        scheme: formData.scheme || '',
        preferredFloor: formData.preferredFloor || '',
        preferredStallSides: formData.preferredStallSides ? String(formData.preferredStallSides) : '',
        area: formData.area ? String(formData.area) : '',
        tds: formData.tds === true || formData.tds === 'Yes' ? 'Yes' : 'No',
        termsAndConditions: formData.termsAndConditions || false,
      };
    },
    [viewFormData]
  );

  const methods = useForm<any>({
    resolver: yupResolver(exhibitorRegistrationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (viewFormData && !viewFormLoading) {
      reset(defaultValues); // Reset form with viewFormData values
    }
  }, [viewFormData, viewFormLoading, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);

      // Construct the payload in the required format
      const directorName = `${data.directorPrefix} ${data.directorFirstName} ${data.directorMiddleName || ''} ${data.directorLastName}`.trim();

      const payload = {
        phone: data.mobile || '',
        eventId: exhibitorForm?.eventId || 0,
        userCohort: exhibitorForm?.userCohort || '',
        email: data.email || '',
        image: exhibitorForm?.image || 'imgUrlPlaceholder',
        imgUrl: exhibitorForm?.imgUrl || null,
        firstName: data.contactPersonFirstName?.trim() || '',
        lastName: data.contactPersonLastName?.trim() || '',
        companyOrganizationName: data.companyName || '',
        companyAddress: `${data.address || ''}, ${data.city || ''}, ${data.state || ''}, ${data.postalCode || ''}`.trim(),
        companyEmail: data.email || '',
        companyContact: data.mobile || '',
        companyPanNo: data.panNumber || '',
        companyGstin: data.gstNumber || null,
        directorName: directorName || '',
        data: {
          country: data.country || '',
          accountPersonFirstName: data.billingContactPersonFirstName?.trim() || '',
          accountPersonLastName: data.billingContactPersonLastName?.trim() || '',
          accountPersonMobileNumber: data.billingContactNumber || '',
          accountPersonEmailAddress: data.billingEmail || '',
          addressLine1: data.address || '',
          addressLine2: '',
          billingAddressLine1: data.billingAddress || '',
          billingAddressLine2: '',
          billingCity: data.billingCity || '',
          billingCountry: data.billingCountry || '',
          billingPostalCode: data.billingPostalCode || '',
          billingStateProvinceRegion: data.billingState || '',
          boothDisplayName: data.companyName || '',
          boothTypePreference: data.scheme || '',
          city: data.city || '',
          contactPersonDesignation: data.designation || '',
          productCategory: Array.isArray(data.productCategory) ? data.productCategory.join(', ') : (data.productCategory || ''),
          registeredWithMsme: data.isMsme === 'Yes' ? 'yes' : 'no',
          stateProvinceRegion: data.state || '',
          tanNumber: data.tanNumber || '',
          tds: data.tds || '',
          totalAreaRequired: parseInt(data.area || '0', 10),
          additionalDirectors: data.directors || [],
          proformaInvoice: exhibitorForm?.data.proformaInvoice || '',
          udyogAadhaarNumber: data.msmeNumber || '',
          bookingViaAssociation: '',
          calculatedTotalCost: 0,
          departmentCategory: '',
          hasGstNumber: data.gstNumber ? 'yes' : 'no',
          interestedInSponsorship: '',
          mainObjectives: [],
          participatedEarlier: '',
          postalCode: data.postalCode || '',
          signatureUrl: exhibitorForm?.data.signatureUrl || '',
        },
      };

      // Call the API with the updated payload
      await updateRegistrationDetails(payload);

      enqueueSnackbar('Form submitted successfully!');
      setIsEditable(false); // Disable edit mode after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar('Form submission failed!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  });

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev); // Toggle edit mode
  };

  const handleDownloadProformaInvoice = async () => {
    enqueueSnackbar('Processing proforma invoice...', { variant: 'info' });
    try {
      if (typeof eventData.state.exhibitorId === 'number') {
        const res = await generateProformaInvoice(eventData.state.exhibitorId);

        enqueueSnackbar('Proforma invoice processed!!', { variant: 'success' });

        if (res) {
          window.open(res, '_blank', 'noopener,noreferrer');
        }
        // Optionally, refresh data or show a notification here
      } else {
        enqueueSnackbar('Failed to generate proforma invoice!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Failed to generate proforma invoice:', error);
      enqueueSnackbar('Failed to generate proforma invoice!', { variant: 'error' });
    }
  };

  const pdfContentRef = useRef<HTMLDivElement>(null); // Ref for the PDF content
  const buttonRef = useRef<HTMLButtonElement>(null); // Ref for the button

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

  const participationType = watch('participationType');
  const councilId = watch('councilId');
  const isMsme = watch('isMsme');
  const exportMarkets = watch('exportMarkets');
  const businessNature = watch('businessNature');
  const productCategory = watch('productCategory');
  const productGroupId = watch('productGroupId');
  
  // Get subcategories based on selected product group
  const selectedProductGroup = productGroupId ? productCategories[productGroupId as keyof typeof productCategories] : null;
  const productSubCategories = selectedProductGroup?.subCategories || [];

  // Clear product categories when product group changes
  useEffect(() => {
    if (productGroupId) {
      const currentCategories = methods.getValues('productCategory');
      if (Array.isArray(currentCategories) && currentCategories.length > 0) {
        // Check if any selected category belongs to a different group
        const belongsToCurrentGroup = currentCategories.some((cat) => {
          const catGroupId = cat.split('.')[0];
          return catGroupId === productGroupId;
        });
        if (!belongsToCurrentGroup) {
          setValue('productCategory', []);
          setValue('otherProductCategory', '');
        }
      }
    }
  }, [productGroupId, setValue, methods]);

  if (viewFormLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <div id="pdf-content" ref={pdfContentRef}>
        {' '}
        {/* This id is on the outer div, pdfContentRef is on the inner Box */}
        {(loading || isSubmitting) && (
          <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 4 }}>
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <Box sx={{ bgcolor: '#FF4D1C', color: 'white', p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
            Exhibitor Submission Overview
          </Typography>
          <Typography variant="body1">
            Here are the details submitted by the exhibitor during registration. Use this view to
            verify booth preferences, company info, documents, and payment structure.
          </Typography>
        </Box>
        <img src="/logo/frame.png" alt="logo" />
        <Box sx={{ px: 3, py: 2, display: 'flex', gap: 1 }}>
          {!pdfGenerating && (
            <>
              {/* <Button
                variant="contained"
                ref={buttonRef}
                startIcon={
                  <Box component="img" src="/logo/Edit.svg" sx={{ width: 20, height: 20 }} />
                }
                onClick={toggleEditMode}
                sx={{
                  bgcolor: isEditable ? '#FF4D1C' : '#2D3250',
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
                onClick={handleDownloadProformaInvoice}
                ref={buttonRef}
                disabled
              >
                Proforma Invoice
              </Button>
            </>
          )}
        </Box>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box sx={{ p: 3 }}>
            {/* This Box is what pdfContentRef points to */}
            
            {/* Step 1: Basic Information */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                mb: 1,
                mx: 3,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: '#000000',
              }}
            >
              Exhibitor Information
            </Typography>
            {/* Participation Type & Council */}
            <StyledPaper>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Exhibitor Category *
                  </Typography>
                  <Box sx={{ pointerEvents: 'none', opacity: 0.7 }}>
                    <RHFRadioGroup
                      name="participationType"
                      options={[
                        { label: 'Indian Participant', value: 'INDIAN_PARTICIPANT' },
                        { label: 'Overseas Participant', value: 'OVERSEAS_PARTICIPANT' },
                      ]}
                    />
                  </Box>
                </Grid>
                {participationType === 'INDIAN_PARTICIPANT' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Your Export Promotion Council/ Association *
                      </Typography>
                      <RHFSelect
                        name="councilId"
                        disabled
                      >
                        <MenuItem value="">Select Council/ Association</MenuItem>
                        <MenuItem value="AEPC">Apparel Export Promotion Council (AEPC)</MenuItem>
                        <MenuItem value="CEPC">Carpet Export Promotion Council (CEPC)</MenuItem>
                        <MenuItem value="CMAI">Clothing Manufacturers Association of India (CMAI)</MenuItem>
                        <MenuItem value="CITI">Confederation of Indian Textile Industry (CITI)</MenuItem>
                        <MenuItem value="EPCH">Export Promotion Council for Handicrafts (EPCH)</MenuItem>
                        <MenuItem value="16">Others</MenuItem>
                      </RHFSelect>
                    </Grid>
                    {councilId === '16' && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Other Council Name *
                        </Typography>
                        <RHFTextField name="otherCouncilName" InputProps={{ readOnly: true }} />
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </StyledPaper>

            {/* Company Information */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Company Name *
                  </Typography>
                  <RHFTextField name="companyName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Website
                  </Typography>
                  <RHFTextField name="website" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Address *
                  </Typography>
                  <RHFTextField name="address" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Country *
                  </Typography>
                  <RHFTextField name="country" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    City *
                  </Typography>
                  <RHFTextField name="city" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    State *
                  </Typography>
                  <RHFTextField name="state" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Postal Code *
                  </Typography>
                  <RHFTextField name="postalCode" InputProps={{ readOnly: true }} />
                </Grid>
              </Grid>
            </StyledPaper>
            {/* Contact Person Details */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Contact Person Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Title *
                  </Typography>
                  <RHFSelect name="contactPersonPrefix" disabled>
                    <MenuItem value="">Select Title</MenuItem>
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Dr.">Dr.</MenuItem>
                    <MenuItem value="Prof.">Prof.</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    First Name *
                  </Typography>
                  <RHFTextField name="contactPersonFirstName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Middle Name
                  </Typography>
                  <RHFTextField name="contactPersonMiddleName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Last Name *
                  </Typography>
                  <RHFTextField name="contactPersonLastName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Designation *
                  </Typography>
                  <RHFTextField name="designation" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Email *
                  </Typography>
                  <RHFTextField name="email" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Mobile *
                  </Typography>
                  <RHFTextField name="mobile" InputProps={{ readOnly: true }} />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Billing Information */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Billing Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Billing Company Name *
                  </Typography>
                  <RHFTextField name="billingCompanyName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Billing Website Address
                  </Typography>
                  <RHFTextField name="billingWebsiteAddress" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Billing Address *
                  </Typography>
                  <RHFTextField name="billingAddress" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Billing Country *
                  </Typography>
                  <RHFTextField name="billingCountry" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Billing City *
                  </Typography>
                  <RHFTextField name="billingCity" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Billing State *
                  </Typography>
                  <RHFTextField name="billingState" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Billing Postal Code *
                  </Typography>
                  <RHFTextField name="billingPostalCode" InputProps={{ readOnly: true }} />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Billing Contact Person */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Billing Contact Person Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Title *
                  </Typography>
                  <RHFSelect name="billingContactPersonPrefix" disabled>
                    <MenuItem value="">Select Title</MenuItem>
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Dr.">Dr.</MenuItem>
                    <MenuItem value="Prof.">Prof.</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    First Name *
                  </Typography>
                  <RHFTextField name="billingContactPersonFirstName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Middle Name
                  </Typography>
                  <RHFTextField name="billingContactPersonMiddleName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Last Name *
                  </Typography>
                  <RHFTextField name="billingContactPersonLastName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Designation *
                  </Typography>
                  <RHFTextField name="billingContactPersonDesignation" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Email *
                  </Typography>
                  <RHFTextField name="billingEmail" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Contact Number *
                  </Typography>
                  <RHFTextField name="billingContactNumber" InputProps={{ readOnly: true }} />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Step 2: Tax & Registration Information */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                mb: 3,
                mx: 3,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: '#000000',
                mt: 4,
              }}
            >
              Company Details
            </Typography>
            {/* Tax Information */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Tax Information
              </Typography>
              <Grid container spacing={2}>
                {participationType === 'INDIAN_PARTICIPANT' && (
                  <>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        PAN Number *
                      </Typography>
                      <RHFTextField name="panNumber" InputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        TAN Number *
                      </Typography>
                      <RHFTextField name="tanNumber" InputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        GST Number *
                      </Typography>
                      <RHFTextField name="gstNumber" InputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                      State(where GST is registered) *
                      </Typography>
                      <RHFTextField name="gstState" InputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                      State Code(where GST is registered) *
                      </Typography>
                      <RHFTextField name="stateCode" InputProps={{ readOnly: true }} />
                    </Grid>
                  </>
                )}
                {participationType === 'OVERSEAS_PARTICIPANT' && (
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      VAT Number *
                    </Typography>
                    <RHFTextField name="vatNumber" InputProps={{ readOnly: true }} />
                  </Grid>
                )}
              </Grid>
            </StyledPaper>

            {/* Export Markets */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Export Markets
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Export Markets
                  </Typography>
                  <RHFMultiCheckbox
                    name="exportMarkets"
                    options={[
                      { label: 'North America', value: 'North America' },
                      { label: 'South America', value: 'South America' },
                      { label: 'Europe', value: 'Europe' },
                      { label: 'Asia', value: 'Asia' },
                      { label: 'Oceania', value: 'Oceania' },
                      { label: 'Africa', value: 'Africa' },
                      { label: 'Others', value: 'Others' },
                    ]}
                    disabled
                  />
                </Grid>
                {Array.isArray(exportMarkets) && exportMarkets.includes('Others') && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Other Export Market *
                    </Typography>
                    <RHFTextField name="otherExportMarket" InputProps={{ readOnly: true }} />
                  </Grid>
                )}
              </Grid>
            </StyledPaper>

            {/* Director Information */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Director Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Title *
                  </Typography>
                  <RHFSelect name="directorPrefix" disabled>
                    <MenuItem value="">Select Title</MenuItem>
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Dr.">Dr.</MenuItem>
                    <MenuItem value="Prof.">Prof.</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    First Name *
                  </Typography>
                  <RHFTextField name="directorFirstName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Middle Name
                  </Typography>
                  <RHFTextField name="directorMiddleName" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Last Name *
                  </Typography>
                  <RHFTextField name="directorLastName" InputProps={{ readOnly: true }} />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* MSME Registration */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                MSME Registration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Registered with MSME? *
                  </Typography>
                  <Box sx={{ pointerEvents: 'none', opacity: 0.7 }}>
                    <RHFRadioGroup
                      name="isMsme"
                      options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' },
                      ]}
                    />
                  </Box>
                </Grid>
                {isMsme === 'Yes' && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      MSME Number *
                    </Typography>
                    <RHFTextField name="msmeNumber" InputProps={{ readOnly: true }} />
                  </Grid>
                )}
              </Grid>
            </StyledPaper>

            {/* Company Bio */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Company Profile
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Company Profile (max 300 words) *
                  </Typography>
                  <RHFTextField
                    name="companyBio"
                    multiline
                    rows={6}
                  />
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Step 3: Business & Product Information */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                mb: 3,
                mx: 3,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: '#000000',
                mt: 4,
              }}
            >
              Business & Product Information
            </Typography>

            {/* Business Nature */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Nature of Business
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Nature of Business *
                  </Typography>
                  <RHFMultiCheckbox
                    name="businessNature"
                    options={[
                      { label: 'Manufacturer', value: 'Manufacturer' },
                      { label: 'Sole Agent', value: 'Sole Agent' },
                      { label: 'Product Designer', value: 'Product Designer' },
                      { label: 'Wholesaler', value: 'Wholesaler' },
                      { label: 'Exporter', value: 'Exporter' },
                      { label: 'Publisher', value: 'Publisher' },
                      { label: 'Others', value: 'Others' },
                    ]}
                    disabled
                  />
                </Grid>
                {Array.isArray(businessNature) && businessNature.includes('Others') && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Other Business Nature *
                    </Typography>
                    <RHFTextField name="otherBusinessNature" InputProps={{ readOnly: true }} />
                  </Grid>
                )}
              </Grid>
            </StyledPaper>

            {/* Product Information */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Product Group *
                  </Typography>
                  <RHFSelect name="productGroupId" disabled>
                    <MenuItem value="">Select Product Group</MenuItem>
                    {Object.values(productCategories).map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.id}. {group.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                {productGroupId && selectedProductGroup && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Select Product Categories *
                    </Typography>
                    <RHFMultiCheckbox
                      name="productCategory"
                      options={productSubCategories.map((subCat) => ({
                        label: subCat.label,
                        value: subCat.value,
                      }))}
                      row
                      disabled
                    />
                  </Grid>
                )}
                {productGroupId && selectedProductGroup && Array.isArray(productCategory) && 
                 productSubCategories.some((subCat) => subCat.label.includes('Others') && productCategory.includes(subCat.value)) && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Other Product Category *
                    </Typography>
                    <RHFTextField name="otherProductCategory" InputProps={{ readOnly: true }} />
                  </Grid>
                )}
              </Grid>
            </StyledPaper>

            {/* Step 4: Booth Preferences */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                mb: 3,
                mx: 3,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: '#000000',
                mt: 4,
              }}
            >
              Booth Details
            </Typography>

            {/* Pricing Information Table */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Booth Pricing Information
              </Typography>
              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Booth Type / Location
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Rate (per sqm)
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Additional Conditions
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <StyledTableCell>Shell Scheme - Ground Floor (One Side)</StyledTableCell>
                      <StyledTableCell>₹ 11,000/sqm + Taxes</StyledTableCell>
                      <StyledTableCell>Standard rate</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell>Shell Scheme - Upper Floor (One Side)</StyledTableCell>
                      <StyledTableCell>₹ 8,500/sqm + Taxes</StyledTableCell>
                      <StyledTableCell>Standard rate</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell>Ground / Upper Floor (Two Side Open)</StyledTableCell>
                      <StyledTableCell>+ 15% additional on total space cost</StyledTableCell>
                      <StyledTableCell>Applied after base calculation</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell>Ground / Upper Floor (Three Side Open)</StyledTableCell>
                      <StyledTableCell>+ 25% additional on total space cost</StyledTableCell>
                      <StyledTableCell>Applied after base calculation</StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell>Island Booth (4 Side Open) (Min. 150 sqm)</StyledTableCell>
                      <StyledTableCell>₹ 20,000/sqm + Taxes</StyledTableCell>
                      <StyledTableCell>Priority to sponsors</StyledTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                ** For Bare Space Rs. 500/sqm to be reduced (Min Size 18 sqm)
              </Typography>
            </StyledPaper>

            {/* Booth Type & Preferences */}
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Booth Type & Preferences
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Booth Type *
                  </Typography>
                  <Box sx={{ pointerEvents: 'none', opacity: 0.7 }}>
                    <RHFRadioGroup
                      name="scheme"
                      options={[
                        { label: 'Shell Scheme', value: 'SHELL' },
                        { label: 'Bare Space', value: 'BARE' },
                      ]}
                      row
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Booth Location Preference *
                  </Typography>
                  <Box sx={{ pointerEvents: 'none', opacity: 0.7 }}>
                    <RHFRadioGroup
                      name="preferredFloor"
                      options={[
                        { label: 'Ground Floor', value: 'GROUND_FLOOR' },
                        { label: 'Upper Floor', value: 'UPPER_FLOOR' },
                      ]}
                      row
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Number of Open Sides *
                  </Typography>
                  <Box sx={{ pointerEvents: 'none', opacity: 0.7 }}>
                    <RHFRadioGroup
                      name="preferredStallSides"
                      options={[
                        { label: 'One Side', value: '1' },
                        { label: 'Two Sides', value: '2' },
                        { label: 'Three Sides', value: '3' },
                        { label: 'Four Sides', value: '4' },
                      ]}
                      row
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Required Area (sqm) *
                  </Typography>
                  <RHFTextField name="area" placeholder="Enter Required Area" InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Are you a TDS Deductor? *
                  </Typography>
                  <Box sx={{ pointerEvents: 'none', opacity: 0.7 }}>
                    <RHFRadioGroup
                      name="tds"
                      options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' },
                      ]}
                      row
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={methods.watch('termsAndConditions') || false}
                        onChange={(e) => setValue('termsAndConditions', e.target.checked)}
                        disabled
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I confirm that I agree to the terms and conditions of the exhibition *
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </StyledPaper>
            {isEditable && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={toggleEditMode}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  Save Changes
                </LoadingButton>
              </Box>
            )}
          </Box>
        </FormProvider>
      </div>
    </>
  );
}
