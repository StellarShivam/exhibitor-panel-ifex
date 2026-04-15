'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import CheckIcon from '@mui/icons-material/Check';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { exhibitorRegistrationSchema, stepFields } from './schema';

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import FormProvider from '../hook-form/form-provider';
import { useRef, useState, SetStateAction, useEffect } from 'react';
import { ExhibitorInformation } from './step-forms/ExhibitorInformation';
import { FormNavigationButtons } from './FormNavigationButtons';
import { ContactInformation } from './step-forms/CompanyInformation';
import { BusinessProductInformation } from './step-forms/BusinessProductInformation';
import { BoothType } from './step-forms/BoothDetails';
import {
  Council,
  getCouncils,
  getProductGroups,
  ProductGroup,
  registerExhibitor,
  ExhibitorRegistrationRequest,
} from '../apis/exhibitior-reg';
import { useExhibitorForm, generateProformaInvoice, useEditExhibitorForm, useSponsorForm, generateSponsorProformaInvoice } from 'src/api/form';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

// Default form values
const defaultValues = {
  participationType: '',
  councilId: '',
  otherCouncilName: '',
  companyName: '',
  website: '',
  address: '',
  country: '',
  city: '',
  state: '',
  postalCode: '',
  contactPersonPrefix: '',
  contactPersonFirstName: '',
  contactPersonMiddleName: '',
  contactPersonLastName: '',
  designation: '',
  email: '',
  mobile: '',
  billingAddressSame: false,
  billingCompanyName: '',
  billingWebsiteAddress: '',
  billingAddress: '',
  billingCountry: '',
  billingCity: '',
  billingState: '',
  billingPostalCode: '',
  billingContactPersonPrefix: '',
  billingContactPersonFirstName: '',
  billingContactPersonMiddleName: '',
  billingContactPersonLastName: '',
  billingContactPersonDesignation: '',
  billingEmail: '',
  billingContactNumber: '',
  panNumber: '',
  tanNumber: '',
  gstNumber: '',
  gstState: '',
  stateCode: '',
  vatNumber: '',
  exportMarkets: [],
  otherExportMarket: '',
  iecNumber: '',
  isWomenEntreprenuer: '',
  //   cinNumber: "",
  //   dinNumber: "",
  directorPrefix: '',
  directorFirstName: '',
  directorMiddleName: '',
  directorLastName: '',
  directors: [],
  isMsme: '',
  msmeNumber: '',
  companyBio: '',
  businessNature: [],
  otherBusinessNature: '',
  productGroupId: '',
  productCategory: [],
  otherProductCategory: '',
  productSubCategory: [],
  scheme: '',
  preferredFloor: '',
  preferredStallSides: '',
  area: '',
  tds: '',
  tdsPercentage: '',
  termsAndConditions: false,
  status: '',
};

// ----------------------------------------------------------------------

export default function ExhibitorRegistrationForm() {
  // const navigate = useNavigate();
  const { exhibitorForm, exhibitorFormLoading, reFetchExhibitorForm } = useSponsorForm();
  const { editExhibitorForm } = useEditExhibitorForm();
  const { enqueueSnackbar } = useSnackbar();
  const [isEditable, setIsEditable] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [userIp, setUserIp] = useState<string>('');
  const [steps, setSteps] = useState([
    { id: 1, label: 'Exhibitor Information', completed: false },
    { id: 2, label: 'Company Details', completed: false },
    { id: 3, label: 'Objective & Preferences', completed: false },
    { id: 4, label: 'Booth Details', completed: false },
    { id: 5, label: 'Payment', completed: false },
  ]);

  const pdfContentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const methods = useForm({
    resolver: yupResolver(exhibitorRegistrationSchema),
    defaultValues,
    values: {
      ...defaultValues,
      ...exhibitorForm?.metaData?.data?.formData,

      tds: exhibitorForm?.metaData?.data?.formData?.tds === true ? 'Yes' : 'No',
      isMsme: exhibitorForm?.metaData?.data?.formData?.isMsme === true ? 'Yes' : 'No',
      isWomenEntreprenuer:
        exhibitorForm?.metaData?.data?.formData?.isWomenEntreprenuer === true ? 'Yes' : 'No',
      productGroupId: exhibitorForm?.metaData?.data?.formData?.productGroupId
        ? String(exhibitorForm?.metaData?.data?.formData?.productGroupId)
        : '',
      tdsPercentage: exhibitorForm?.metaData?.data?.formData?.tdsPercentage
        ? String(exhibitorForm?.metaData?.data?.formData?.tdsPercentage)
        : '',
    },
    mode: 'onChange',
  });

  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
    trigger,
    setError,
    getValues,
  } = methods;

  const FORM_STORAGE_KEY = 'bharat_tex_sponsor_registration_form';

  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
  const topRef = useRef<HTMLDivElement>(null);

  const [panVerification, setPanVerification] = useState<{
    status: 'idle' | 'verifying' | 'success' | 'error';
    name?: string;
    error?: string;
    verifiedNumber?: string;
  }>({ status: 'idle' });

  const [gstVerification, setGstVerification] = useState<{
    status: 'idle' | 'verifying' | 'success' | 'error';
    name?: string;
    error?: string;
    verifiedNumber?: string;
  }>({ status: 'idle' });

  const [emailVerification, setEmailVerification] = useState<{
    status: 'idle' | 'checking' | 'available' | 'registered' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const [mobileVerification, setMobileVerification] = useState<{
    status: 'idle' | 'checking' | 'available' | 'registered' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const [gstRegistrationCheck, setGstRegistrationCheck] = useState<{
    status: 'idle' | 'checking' | 'available' | 'registered' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [councils, setCouncils] = useState<Council[]>([]);
  // Fetch product groups on component mount
  useEffect(() => {
    const fetchProductGroups = async () => {
      try {
        const groups = await getProductGroups();
        // Sort groups by the number at the start of the name
        groups.sort((a, b) => {
          const numA = parseInt(a.name.match(/^\d+/)?.[0] || '0');
          const numB = parseInt(b.name.match(/^\d+/)?.[0] || '0');
          return numA - numB;
        });

        setProductGroups(groups);
      } catch (error) {
        console.error('Error fetching product groups:', error);
      }
    };

    fetchProductGroups();
  }, []);

  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const councils = await getCouncils();
        setCouncils((councils || []).filter((council) => council.id !== 15));
      } catch (error) {
        console.error('Error fetching councils:', error);
      }
    };

    fetchCouncils();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const onSubmit = handleSubmit(
    async (data) => {
      setIsSubmitting(true);
      try {
        console.log('Form Data:', data);

        // Transform form data to API payload
        const payload = {
          eventId: '203',
          participationType:
            data.participationType === 'INDIAN_PARTICIPANT'
              ? 'INDIAN_PARTICIPANT'
              : 'OVERSEAS_PARTICIPANT',
          companyName: data.companyName,
          contactPersonPrefix: data.contactPersonPrefix,
          contactPersonFirstName: data.contactPersonFirstName,
          contactPersonMiddleName: data.contactPersonMiddleName || '',
          contactPersonLastName: data.contactPersonLastName,
          designation: data.designation,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          state: data.state,
          country: data.country,
          email: data.email,
          mobile: data.mobile,
          website: data.website || '',

          // Billing Information
          billingCompanyName: data.billingCompanyName,
          billingContactPersonPrefix: data.billingContactPersonPrefix,
          billingContactPersonFirstName: data.billingContactPersonFirstName,
          billingContactPersonMiddleName: data.billingContactPersonMiddleName || '',
          billingContactPersonLastName: data.billingContactPersonLastName,
          billingContactPersonDesignation: data.billingContactPersonDesignation,
          billingAddress: data.billingAddress,
          billingCity: data.billingCity,
          billingState: data.billingState,
          billingCountry: data.billingCountry,
          billingPostalCode: data.billingPostalCode,
          billingEmail: data.billingEmail,
          billingWebsiteAddress: data.billingWebsiteAddress || '',
          billingContactNumber: data.billingContactNumber,

          // Tax & Company Information
          panNumber:
            data.participationType === 'INDIAN_PARTICIPANT' ? data.panNumber || '' : undefined,
          tanNumber:
            data.participationType === 'INDIAN_PARTICIPANT' ? data.tanNumber || '' : undefined,
          gstNumber:
            data.participationType === 'INDIAN_PARTICIPANT' ? data.gstNumber || '' : undefined,
          vatNumber:
            data.participationType === 'OVERSEAS_PARTICIPANT' ? data.vatNumber || '' : undefined,
          gstState:
            data.participationType === 'INDIAN_PARTICIPANT' ? data.gstState || '' : undefined,
          stateCode:
            data.participationType === 'INDIAN_PARTICIPANT' ? data.stateCode || '' : undefined,
          exportMarkets: data.exportMarkets || [],
          otherExportMarket: data.otherExportMarket || '',
          iecNumber: data.iecNumber || '',
          // cinNumber: data.cinNumber || "",
          // dinNumber: data.dinNumber || "",
          isWomenEntreprenuer: data.isWomenEntreprenuer
            ? data.isWomenEntreprenuer === 'Yes'
            : false,

          // Director Information
          directorPrefix: data.directorPrefix,
          directorFirstName: data.directorFirstName,
          directorMiddleName: data.directorMiddleName || '',
          directorLastName: data.directorLastName,

          // Additional Directors
          directors: (data.directors || []).map(
            (director: {
              prefix?: string;
              firstName: string;
              middleName?: string;
              lastName: string;
            }) => ({
              prefix: director.prefix || '',
              firstName: director.firstName,
              middleName: director.middleName,
              lastName: director.lastName,
            })
          ),

          // MSME
          isMsme: data.isMsme === 'Yes',
          msmeNumber: data.msmeNumber || '',

          // Company Profile & Business
          companyBio: data.companyBio,
          businessNature: data.businessNature || [],
          otherBusinessNature: data.otherBusinessNature || '',

          // Product Information
          productGroupId: parseInt(data.productGroupId),
          councilId:
            data.participationType === 'OVERSEAS_PARTICIPANT'
              ? 15
              : parseInt(data.councilId || '15'),
          //   councilId: 14,
          otherCouncilName: data.otherCouncilName || '',
          productCategory: data.productCategory,
          otherProductCategory: data.otherProductCategory || '',
          productSubCategory: data.productSubCategory || [],

          // Booth Details
          scheme: data.scheme,
          area: parseFloat(data.area),
          preferredFloor: data.preferredFloor,
          preferredStallSides: parseInt(data.preferredStallSides),
          tds: data.tds === 'Yes',
          tdsPercentage: data.tdsPercentage || '',
          status: data.status,
        };

        console.log('API Payload:', payload);

        const cleanPayload = Object.entries(payload).reduce(
          (acc, [key, value]) => {
            if (
              value !== '' &&
              value !== null &&
              value !== undefined &&
              !(Array.isArray(value) && value.length === 0)
            ) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );

        // Make actual API call
        const response = await editExhibitorForm(cleanPayload);

        console.log('API Response:', response);

        if (response?.data?.status) {
          // setApiMessage({
          //   type: 'success',
          //   text: response.msg
          //     ? `${response.msg}! ${
          //         paymentUrn
          //           ? 'Redirecting to the payment page...'
          //           : 'Redirecting to the thank you page...'
          //       }`
          //     : paymentUrn
          //       ? 'Registration successful! Redirecting to the payment page...'
          //       : 'Registration successful! Redirecting to the thank you page...',
          // });
          reFetchExhibitorForm();
          setIsEditable(false);
          setIsSubmitting(false);

          enqueueSnackbar(
            data.status === 'PENDING' ? 'Form saved successfully!' : 'Form submitted successfully!',
            { variant: 'success' }
          );

          if (data.status === 'REGISTERED') {
            window.location.href = '/dashboard/transactions';
          }
        } else {
          console.log('API Response Error:', response);
          enqueueSnackbar(
            response?.response?.data?.msg || response.msg || 'Operation failed. Please try again.',
            { variant: 'error' }
          );
          // setApiMessage({
          //   type: 'error',
          //   text: response.msg || 'Operation failed. Please try again.',
          // });
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setApiMessage({
          type: 'error',
          text:
            error instanceof Error
              ? error.message
              : error?.response?.data?.msg || 'Failed to submit form. Please try again.',
        });
        setIsSubmitting(false);
      }
    },
    async (submitErrors) => {
      const isValid = await trigger();
      console.log('isValid:', isValid);
      if (!isValid) {
        enqueueSnackbar('Please fill out all required fields before submitting.', {
          variant: 'error',
        });
        setIsSubmitting(false);
        return;
      }
    }
  );

  const onSubmitDraft = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log('Form Data:', data);

      // Transform form data to API payload
      const payload = {
        eventId: '203',
        participationType:
          data.participationType === 'INDIAN_PARTICIPANT'
            ? 'INDIAN_PARTICIPANT'
            : 'OVERSEAS_PARTICIPANT',
        companyName: data.companyName,
        contactPersonPrefix: data.contactPersonPrefix,
        contactPersonFirstName: data.contactPersonFirstName,
        contactPersonMiddleName: data.contactPersonMiddleName || '',
        contactPersonLastName: data.contactPersonLastName,
        designation: data.designation,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        state: data.state,
        country: data.country,
        email: data.email,
        mobile: data.mobile,
        website: data.website || '',

        // Billing Information
        billingCompanyName: data.billingCompanyName,
        billingContactPersonPrefix: data.billingContactPersonPrefix,
        billingContactPersonFirstName: data.billingContactPersonFirstName,
        billingContactPersonMiddleName: data.billingContactPersonMiddleName || '',
        billingContactPersonLastName: data.billingContactPersonLastName,
        billingContactPersonDesignation: data.billingContactPersonDesignation,
        billingAddress: data.billingAddress,
        billingCity: data.billingCity,
        billingState: data.billingState,
        billingCountry: data.billingCountry,
        billingPostalCode: data.billingPostalCode,
        billingEmail: data.billingEmail,
        billingWebsiteAddress: data.billingWebsiteAddress || '',
        billingContactNumber: data.billingContactNumber,

        // Tax & Company Information
        panNumber:
          data.participationType === 'INDIAN_PARTICIPANT' ? data.panNumber || '' : undefined,
        tanNumber:
          data.participationType === 'INDIAN_PARTICIPANT' ? data.tanNumber || '' : undefined,
        gstNumber:
          data.participationType === 'INDIAN_PARTICIPANT' ? data.gstNumber || '' : undefined,
        vatNumber:
          data.participationType === 'OVERSEAS_PARTICIPANT' ? data.vatNumber || '' : undefined,
        gstState: data.participationType === 'INDIAN_PARTICIPANT' ? data.gstState || '' : undefined,
        stateCode:
          data.participationType === 'INDIAN_PARTICIPANT' ? data.stateCode || '' : undefined,
        exportMarkets: data.exportMarkets || [],
        otherExportMarket: data.otherExportMarket || '',
        iecNumber: data.iecNumber || '',
        // cinNumber: data.cinNumber || "",
        // dinNumber: data.dinNumber || "",
        isWomenEntreprenuer: data.isWomenEntreprenuer ? data.isWomenEntreprenuer === 'Yes' : false,

        // Director Information
        directorPrefix: data.directorPrefix,
        directorFirstName: data.directorFirstName,
        directorMiddleName: data.directorMiddleName || '',
        directorLastName: data.directorLastName,

        // Additional Directors
        directors: (data.directors || []).map(
          (director: {
            prefix?: string;
            firstName: string;
            middleName?: string;
            lastName: string;
          }) => ({
            prefix: director.prefix || '',
            firstName: director.firstName,
            middleName: director.middleName,
            lastName: director.lastName,
          })
        ),

        // MSME
        isMsme: data.isMsme === 'Yes',
        msmeNumber: data.msmeNumber || '',

        // Company Profile & Business
        companyBio: data.companyBio,
        businessNature: data.businessNature || [],
        otherBusinessNature: data.otherBusinessNature || '',

        // Product Information
        productGroupId: data.productGroupId ? parseInt(data.productGroupId) : '',
        councilId:
          data.participationType === 'OVERSEAS_PARTICIPANT' ? 15 : parseInt(data.councilId || '15'),
        //   councilId: 14,
        otherCouncilName: data.otherCouncilName || '',
        productCategory: data.productCategory,
        otherProductCategory: data.otherProductCategory || '',
        productSubCategory: data.productSubCategory || [],

        // Booth Details
        scheme: data.scheme,
        area: data.area ? parseFloat(data.area) : '',
        preferredFloor: data.preferredFloor,
        preferredStallSides: data.preferredStallSides ? parseInt(data.preferredStallSides) : '',
        tds: data.tds === 'Yes',
        tdsPercentage: data.tds === 'Yes' ? data.tdsPercentage : '',
        status: data.status,
      };

      console.log('API Payload:', payload);

      const cleanPayload = Object.entries(payload).reduce(
        (acc, [key, value]) => {
          if (
            value !== '' &&
            value !== null &&
            value !== undefined &&
            !(Array.isArray(value) && value.length === 0)
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

      // Make actual API call
      const response = await editExhibitorForm(cleanPayload);

      console.log('API Response:', response);

      if (response?.data?.status) {
        // setApiMessage({
        //   type: 'success',
        //   text: response.msg
        //     ? `${response.msg}! ${
        //         paymentUrn
        //           ? 'Redirecting to the payment page...'
        //           : 'Redirecting to the thank you page...'
        //       }`
        //     : paymentUrn
        //       ? 'Registration successful! Redirecting to the payment page...'
        //       : 'Registration successful! Redirecting to the thank you page...',
        // });
        reFetchExhibitorForm();
        setIsEditable(false);
        setIsSubmitting(false);

        enqueueSnackbar(
          data.status === 'PENDING' ? 'Form saved successfully!' : 'Form submitted successfully!',
          { variant: 'success' }
        );

        if (data.status === 'REGISTERED') {
          window.location.href = '/dashboard/transactions';
        }
      } else {
        console.log('API Response Error:', response);
        enqueueSnackbar(
          response?.response?.data?.msg || response.msg || 'Operation failed. Please try again.',
          { variant: 'error' }
        );
        // setApiMessage({
        //   type: 'error',
        //   text: response.msg || 'Operation failed. Please try again.',
        // });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setApiMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : error?.response?.data?.msg || 'Failed to submit form. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  // useEffect(() => {
  //   const savedData = loadFormData();
  //   console.log('exhibitorForm', exhibitorForm?.metaData?.data?.formData);
  //   // if (exhibitorForm) {
  //   const formData = exhibitorForm?.metaData?.data?.formData;
  //   reset({
  //     ...formData,
  //     tds: formData?.tds === true ? 'Yes' : 'No',
  //     isMsme: formData?.isMsme === true ? 'Yes' : 'No',
  //     isWomenEntreprenuer: formData?.isWomenEntreprenuer === true ? 'Yes' : 'No',
  //     productGroupId: formData?.productGroupId ? String(formData?.productGroupId) : '',
  //     tdsPercentage: formData?.tdsPercentage ? String(formData?.tdsPercentage) : '',
  //   });

  //   // if (savedData.currentStep) {
  //   //   setCurrentStep(savedData.currentStep);
  //   //   setSteps(savedData.steps);
  //   // }
  //   // }
  // }, [exhibitorForm]);
  // console.log('errors', errors);

  //   useEffect(() => {
  //     const subscription = watch((formData) => {
  //       const dataToSave = {
  //         formData,
  //         currentStep,
  //         steps,
  //       };
  //       saveFormData(dataToSave);
  //     });
  //     return () => subscription.unsubscribe();
  //   }, [watch, currentStep, steps]);

  // Fetch user IP address
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
        windowWidth: 1080, // Fixed width for A4
        x: 0,
        y: 0,
        onclone: (clonedDoc) => {
          // Ensure all elements are visible in the cloned document
          const clonedElement = clonedDoc.querySelector('#pdf-content');
          if (clonedElement) {
            clonedElement.style.overflow = 'visible';
            clonedElement.style.height = 'auto';
            clonedElement.style.maxHeight = 'none';
          }
        },
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

      // Margins - increased for better content visibility
      const FIRST_PAGE_TOP_MARGIN = 8;
      const SUBSEQUENT_PAGE_TOP_MARGIN = 8;
      const ALL_PAGE_BOTTOM_MARGIN = 12;
      const xPositionOnPdf = 0;

      let yPosOnSourceCanvas = 0;
      let pageNum = 0;

      // Get current timestamp and site URL
      const timestamp = new Date().toLocaleString();
      const siteUrl = window.location.origin + window.location.pathname;
      const ipText = `IP: ${userIp}`;

      // Calculate scale factor
      const scaleFactor = pdfPageWidth / sourceWidthPx;

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
        const scaledHeightOfRemainingSourceOnPdf = remainingSourceHeightPx * scaleFactor;

        let sliceHeightOnPdf = Math.min(availableHeightOnPdf, scaledHeightOfRemainingSourceOnPdf);

        if (sliceHeightOnPdf <= 0.001) {
          break;
        }

        let sliceHeightOnSourcePx = sliceHeightOnPdf / scaleFactor;

        // Ensure we don't exceed the remaining content
        if (yPosOnSourceCanvas + sliceHeightOnSourcePx > sourceHeightPx) {
          sliceHeightOnSourcePx = sourceHeightPx - yPosOnSourceCanvas;
          sliceHeightOnPdf = sliceHeightOnSourcePx * scaleFactor;
        }

        if (sliceHeightOnSourcePx <= 0.001) {
          break;
        }

        // Create a temporary canvas for this slice
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceWidthPx;
        tempCanvas.height = Math.ceil(sliceHeightOnSourcePx);
        const tempCtx = tempCanvas.getContext('2d', { alpha: true });

        if (!tempCtx) {
          console.error('Error: Could not get 2D context from temporary canvas.');
          enqueueSnackbar('Error: Failed to prepare image slice for PDF.', { variant: 'error' });
          break;
        }

        // Fill with white background to prevent transparency issues
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the slice from the source canvas
        tempCtx.drawImage(
          sourceCanvas,
          0,
          Math.floor(yPosOnSourceCanvas),
          sourceWidthPx,
          Math.ceil(sliceHeightOnSourcePx),
          0,
          0,
          sourceWidthPx,
          Math.ceil(sliceHeightOnSourcePx)
        );

        const pageImageDataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);

        pdf.addImage(
          pageImageDataUrl,
          'JPEG',
          xPositionOnPdf,
          imageYPositionOnPdf,
          pdfPageWidth,
          sliceHeightOnPdf
        );

        // --- Add footer and header ---
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
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

        // Safety check to prevent infinite loops
        if (pageNum > 100) {
          console.error('Error: Too many pages generated, stopping to prevent infinite loop.');
          enqueueSnackbar('Warning: PDF generation stopped due to excessive page count.', {
            variant: 'warning',
          });
          break;
        }
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
      elementToCapture.style.width = originalStyles.width;
      elementToCapture.style.transform = originalStyles.transform;
      elementToCapture.style.transformOrigin = originalStyles.transformOrigin;
    } finally {
      setPdfGenerating(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev); // Toggle edit mode
  };

  const handleDownloadProformaInvoice = async () => {
    enqueueSnackbar('Processing proforma invoice...', { variant: 'info' });
    try {
      if (exhibitorForm?.metaData?.data?.urn) {
        const res = await generateSponsorProformaInvoice(exhibitorForm?.metaData?.data?.urn);

        enqueueSnackbar('Proforma invoice processed!!', { variant: 'success' });

        if (res) {
          window.open(res?.proformaUrl, '_blank', 'noopener,noreferrer');
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

  return (
    <>
      <div ref={topRef} className="absolute top-0 left-0" />
      <div id="pdf-content" ref={pdfContentRef}>
        {' '}
        {/* This id is on the outer div, pdfContentRef is on the inner Box */}
        {(exhibitorFormLoading || isSubmitting) && (
          <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 4 }}>
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <Box sx={{ bgcolor: '#ffa206', color: 'white', p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
            {exhibitorForm?.metaData?.data?.status === 'PENDING'
              ? 'Resume Application'
              : ' Sponsor Submission Overview'}
          </Typography>
          <Typography variant="body1">
            {exhibitorForm?.metaData?.data?.status === 'PENDING'
              ? 'Please carefully verify & update your details below. Once you have reviewed everything, you must submit your final details.'
              : 'Here are the details submitted by the sponsor during registration. Use this view to verify booth preferences, company info, documents, and payment structure.'}
          </Typography>
        </Box>
        {/* <img src="/logo/frame.png" alt="logo" /> */}
        <Box sx={{ px: 3, py: 2, display: 'flex', gap: 1 }}>
          {!pdfGenerating && (
            <>
              {/* {exhibitorForm?.metaData?.data?.status === 'PENDING' && (
                <Button
                  variant="contained"
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
                  {isEditable ? 'Cancel' : 'Resume Application'}
                </Button>
              )} 
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
              </Button>*/}
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
                disabled={exhibitorForm?.metaData?.data?.status === 'PENDING'}
              >
                Proforma Invoice
              </Button>
            </>
          )}
        </Box>
        <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] min-h-[100vh] rounded-2xl mx-6 mb-8">
          <div className="min-h-full w-full p-6 lg:p-8">
            <FormProvider methods={methods} onSubmit={onSubmit}>
              {/* {currentStep.id === 1 && ( */}
              <ExhibitorInformation
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
                councils={councils}
                emailVerification={emailVerification}
                setEmailVerification={setEmailVerification}
                mobileVerification={mobileVerification}
                setMobileVerification={setMobileVerification}
                disabled={!isEditable}
              />
              {/* )} */}
              {/* {currentStep.id === 2 && ( */}
              <ContactInformation
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
                panVerification={panVerification}
                setPanVerification={setPanVerification}
                gstVerification={gstVerification}
                setGstVerification={setGstVerification}
                disabled={!isEditable}
              />
              {/* )} */}

              {/* {currentStep.id === 3 && ( */}
              <BusinessProductInformation
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
                productGroups={productGroups}
                gstRegistrationCheck={gstRegistrationCheck}
                setGstRegistrationCheck={setGstRegistrationCheck}
                disabled={!isEditable}
              />
              {/* )} */}

              {/* {currentStep.id === 4 && ( */}
              <BoothType
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
                setError={setError}
                disabled={!isEditable}
              />
              {/* )} */}
              <div className="flex flex-col justify-end mt-auto">
                {/* {apiMessage.text && (
                  <div
                    className={`my-4 p-3 rounded-md text-center ${
                      apiMessage.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : apiMessage.type === 'error'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {apiMessage.text}
                  </div>
                )} */}
                {exhibitorForm?.metaData?.data?.status === 'PENDING' && isEditable && (
                  <div className="flex gap-3 justify-end my-4">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setValue('status', 'PENDING');
                        onSubmitDraft(getValues());
                      }}
                      disabled={isSubmitting}
                      sx={{
                        bgcolor: '#6c757d',
                        '&:hover': { bgcolor: '#5a6268' },
                        textTransform: 'none',
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      {isSubmitting && getValues('status') === 'PENDING' ? 'Saving...' : 'SAVE'}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setShowSubmitDialog(true);
                      }}
                      disabled={isSubmitting}
                      sx={{
                        bgcolor: '#ffa206',
                        '&:hover': { bgcolor: '#c01e6f' },
                        textTransform: 'none',
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      {isSubmitting && getValues('status') === 'REGISTERED'
                        ? 'Submitting...'
                        : 'SUBMIT'}
                    </Button>
                  </div>
                )}
              </div>
            </FormProvider>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        aria-labelledby="submit-dialog-title"
        aria-describedby="submit-dialog-description"
      >
        <DialogTitle id="submit-dialog-title">Are you sure you want to submit?</DialogTitle>
        <DialogContent>
          <DialogContentText id="submit-dialog-description">
            Once submitted, you will not be able to make any changes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowSubmitDialog(false)}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setShowSubmitDialog(false);
              setValue('status', 'REGISTERED');
              await onSubmit();
            }}
            variant="contained"
            sx={{
              bgcolor: '#ffa206',
              '&:hover': { bgcolor: '#c01e6f' },
              textTransform: 'none',
            }}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
