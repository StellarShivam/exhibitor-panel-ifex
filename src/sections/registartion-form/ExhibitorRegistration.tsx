'use client';

import { useState, useEffect, SetStateAction, useRef } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import CheckIcon from '@mui/icons-material/Check';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useRouter } from 'src/routes/hooks';
import { usePrice } from './Price';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { MenuItem, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CircularProgress } from '@mui/material';
import { BASE_URL } from 'src/config-global';

// Define Zod schema for validation
const phoneRegex = /^[+]?[0-9]{12}$/; // Basic phone regex, adjust as needed
const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/; // Basic PAN regex
const msmeRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;

// Add new interface for Director
interface Director {
  id: string;
  name: string;
}

const schema = z
  .object({
    // Step 1: Exhibitor Information
    nameOfExhibitor: z.string().min(1, 'Name of Exhibitor is required'),
    boothDisplayName: z.string().min(1, 'Booth Display Name is required'),
    addressLine1: z.string().min(1, 'Address Line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    stateProvinceRegion: z.string().min(1, 'State/Province/Region is required'),
    postalCode: z.string().regex(/^\d{6}$/, 'Postal Code must be exactly 6 digits'),
    companyEmailInput: z
      .string()
      .email('Invalid email address')
      .min(1, 'Company Email is required'),
    companyPhoneInput: z.string().regex(phoneRegex, 'Invalid company phone number'),
    companyPanNoInput: z
      .string()
      .regex(panRegex, 'Invalid PAN format')
      .min(1, 'Company PAN is required'),
    directorNameInput: z
      .string()
      .min(1, 'Director Name is required')
      .regex(/^[a-zA-Z\s]+$/, 'Invalid name. Only characters are allowed'),
    additionalDirectors: z
      .array(
        z.object({
          id: z.string(),
          name: z
            .string()
            .min(1, 'Director Name is required')
            .regex(/^[a-zA-Z\s]+$/, 'Invalid name. Only characters are allowed'),
        })
      )
      .optional()
      .default([]),
    hasGstNumber: z.enum(['yes', 'no'], {
      required_error: 'Please select if you have a GST number',
    }),
    gstNumber: z.string().optional(),
    billingAddressLine1: z.string().min(1, 'Billing Address Line 1 is required'),
    billingAddressLine2: z.string().optional(),
    billingCity: z.string().min(1, 'Billing City is required'),
    billingCountry: z.string().min(1, 'Billing Country is required'),
    billingStateProvinceRegion: z.string().min(1, 'Billing State/Province/Region is required'),
    billingPostalCode: z.string().min(1, 'Billing Postal Code is required'),

    // Step 2: Contact Details
    contactPersonFirstName: z.string().min(1, 'Contact Person First Name is required'),
    contactPersonLastName: z.string().min(1, 'Contact Person Last Name is required'),
    mobileNumber: z.string().regex(phoneRegex, 'Invalid mobile number'),
    alternateMobileNumber: z
      .string()
      .regex(phoneRegex, 'Invalid alternate mobile number')
      .optional()
      .or(z.literal('')),
    emailAddress: z.string().email('Invalid email address').min(1, 'Email Address is required'),
    alternateEmailAddress: z
      .string()
      .email('Invalid alternate email address')
      .optional()
      .or(z.literal('')),
    website: z
      .string()
      .url('Invalid URL format (e.g., https://example.com)')
      .optional()
      .or(z.literal('')),
    contactPersonDesignation: z.string().min(1, 'Contact Person Designation is required'),

    accountPersonFirstName: z.string().min(1, 'Account Person First Name is required'),
    accountPersonLastName: z.string().min(1, 'Account Person Last Name is required'),
    accountPersonMobileNumber: z.string().regex(phoneRegex, 'Invalid mobile number'),
    accountPersonEmailAddress: z
      .string()
      .email('Invalid email address')
      .min(1, 'Email Address is required'),

    // Step 3: Activities
    bookingViaAssociation: z.enum(['yes', 'no'], {
      required_error: 'This selection is required',
    }),
    associationName: z.string().optional(),
    registeredWithMsme: z.enum(['yes', 'no'], {
      required_error: 'This selection is required',
    }),
    msmeNumber: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z
        .string()
        .min(1, 'Udyog Aadhaar Number is required if registered with MSME')
        .regex(msmeRegex, 'Invalid Udyog Aadhaar Number')
        .optional()
    ),
    participatedEarlier: z.enum(['yes', 'no'], {
      required_error: 'This selection is required',
    }),
    participationYear: z.string().optional(),

    // Step 4: Objective & Preferences
    productCategory: z.string().min(1, 'Product Category is required'),
    otherProductCategory: z.string().optional(),
    departmentCategory: z.string().min(1, 'Department Category is required'),
    otherDepartmentCategory: z.string().optional(),
    interestedInSponsorship: z.enum(['yes', 'no', 'maybe'], {
      required_error: 'This selection is required',
    }),
    mainObjectives: z.array(z.string()).min(1, 'Select at least one objective').max(6), // Max items if needed
    otherObjective: z.string().optional(),

    // Step 5: Booth Type
    boothTypePreference: z.enum(['pre_fitted', 'space_only'], {
      required_error: 'Please select a booth type',
    }),
    totalAreaRequired: z
      .string()
      .min(1, 'Total Area is required')
      .regex(/^\d+$/, 'Area must be a number')
      .transform(Number), // Transform to number after string validation
    tds: z.enum(['nil', '2', '10'], {
      required_error: 'Please select TDS percentage',
    }),
    tanNumber: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          return panRegex.test(val);
        },
        { message: 'Invalid TAN format' }
      ),
  })
  .refine(
    (data) => !(data.hasGstNumber === 'yes' && (!data.gstNumber || data.gstNumber.trim() === '')),
    {
      message: "GST Number is required if you select 'Yes'",
      path: ['gstNumber'],
    }
  )
  .refine(
    (data) =>
      !(
        data.bookingViaAssociation === 'yes' &&
        (!data.associationName || data.associationName.trim() === '')
      ),
    {
      message: 'Association Name is required if booking via association',
      path: ['associationName'],
    }
  )
  .refine(
    (data) => {
      if (data.registeredWithMsme === 'yes') {
        return data.msmeNumber && data.msmeNumber.trim() !== '';
      }
      return true;
    },
    {
      message: 'MSME Number is required if registered with MSME',
      path: ['msmeNumber'],
    }
  )
  .refine(
    (data) => {
      if (data.registeredWithMsme === 'yes' && data.msmeNumber) {
        return msmeRegex.test(data.msmeNumber);
      }
      return true;
    },
    {
      message: 'Invalid MSME format. Should be like UDYAM-XX-00-0000000',
      path: ['msmeNumber'],
    }
  )
  .refine(
    (data) => {
      if (data.boothTypePreference && data.totalAreaRequired) {
        if (data.boothTypePreference === 'pre_fitted' && data.totalAreaRequired < 12) return false;
        if (data.boothTypePreference === 'space_only' && data.totalAreaRequired < 36) return false;
      }
      return true;
    },
    {
      message:
        'Area does not meet minimum requirement (Pre-fitted: min 12 sqm, Space Only: min 36 sqm)',
      path: ['totalAreaRequired'],
    }
  )
  .refine(
    (data) => {
      if (data.boothTypePreference === 'space_only' && data.totalAreaRequired) {
        return data.totalAreaRequired % 3 === 0;
      }
      return true;
    },
    {
      message: 'For Space Only booth type, area must be a multiple of 3',
      path: ['totalAreaRequired'],
    }
  )
  .refine(
    (data) => {
      if (data.tds !== 'nil') {
        return data.tanNumber && data.tanNumber.trim() !== '';
      }
      return true;
    },
    {
      message: 'TAN Number is required when TDS is selected',
      path: ['tanNumber'],
    }
  )
  .refine(
    (data) => {
      if (data.participatedEarlier === 'yes') {
        return !!data.participationYear;
      }
      return true;
    },
    {
      message: 'Please select your participation year',
      path: ['participationYear'],
    }
  )
  .refine(
    (data) =>
      !(data.hasGstNumber === 'yes' && (!data.gstNumber || data.gstNumber.trim().length < 15)),
    {
      message: "GST Number must be at least 15 characters if you select 'Yes'",
      path: ['gstNumber'],
    }
  );
// .refine(
//   (data) => {
//     // If alternateMobileNumber is provided (not undefined and not an empty string)
//     if (
//       data.alternateMobileNumber &&
//       data.alternateMobileNumber.trim() !== ""
//     ) {
//       // Then it must be different from the primary mobileNumber.
//       // mobileNumber is a required field, so it should have a value.
//       return data.alternateMobileNumber.trim() !== data.mobileNumber.trim();
//     }
//     // If alternateMobileNumber is empty or not provided, this specific validation passes.
//     return true;
//   },
//   {
//     message:
//       "Alternate mobile number must be different from primary mobile number.",
//     path: ["alternateMobileNumber"],
//   }
// )
// .refine(
//   (data) => {
//     // If alternateEmailAddress is provided (not undefined and not an empty string)
//     if (
//       data.alternateEmailAddress &&
//       data.alternateEmailAddress.trim() !== ""
//     ) {
//       // Then it must be different from the primary emailAddress.
//       // emailAddress is a required field, so it should have a value.
//       return data.alternateEmailAddress.trim() !== data.emailAddress.trim();
//     }
//     // If alternateEmailAddress is empty or not provided, this specific validation passes.
//     return true;
//   },
//   {
//     message:
//       "Alternate email address must be different from primary email address.",
//     path: ["alternateEmailAddress"],
//   }
// );

// Define fields for each step to trigger validation
const stepFields = {
  1: [
    'nameOfExhibitor',
    'boothDisplayName',
    'addressLine1',
    'city',
    'stateProvinceRegion',
    'postalCode',
    'companyEmailInput',
    'companyPhoneInput',
    'companyPanNoInput',
    'directorNameInput',
    'additionalDirectors',
    'hasGstNumber',
    'gstNumber',
    'billingAddressLine1',
    'billingAddressLine2',
    'billingCity',
    'billingCountry',
    'billingStateProvinceRegion',
    'billingPostalCode',
  ],
  2: [
    'contactPersonFirstName',
    'contactPersonLastName',
    'mobileNumber',
    'emailAddress',
    'contactPersonDesignation',
    'alternateMobileNumber',
    'alternateEmailAddress',
    'website',
    'accountPersonFirstName',
    'accountPersonLastName',
    'accountPersonMobileNumber',
    'accountPersonEmailAddress',
  ],
  3: [
    'bookingViaAssociation',
    'associationName',
    'registeredWithMsme',
    'msmeNumber',
    'participatedEarlier',
    'participationYear',
  ],
  4: [
    'productCategory',
    'otherProductCategory',
    'departmentCategory',
    'otherDepartmentCategory',
    'interestedInSponsorship',
    'mainObjectives',
    'otherObjective',
  ],
  5: ['boothTypePreference', 'totalAreaRequired', 'tds', 'tanNumber'],
};

const ExhibitorRegistration = () => {
  const [steps, setSteps] = useState([
    { id: 1, label: 'Exhibitor Information', completed: false },
    { id: 2, label: 'Contact Details', completed: false },
    { id: 3, label: 'Activities', completed: false },
    { id: 4, label: 'Objective & Preferences', completed: false },
    { id: 5, label: 'Booth Type', completed: false },
    { id: 6, label: 'Payment Details', completed: false },
  ]);

  const FORM_STORAGE_KEY = 'exhibitor_registration_form';

  const saveFormData = (data: {
    formData: any;
    currentStep: any;
    steps: any;
    sameAsContact: boolean;
    billingAddressSame: boolean;
    totalCost: number;
    signatureUrl: string | null;
  }) => {
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const loadFormData = () => {
    try {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        if (parsedData.signatureUrl) {
          setSignatureUrl(parsedData.signatureUrl);
          setIsSaved(true);
          setAllowCheckout(true);
        }

        // Restore directors if they exist
        if (parsedData.formData?.additionalDirectors) {
          setDirectors(parsedData.formData.additionalDirectors);
        }

        return parsedData;
      }
      return null;
    } catch (error) {
      console.error('Error loading form data:', error);
      return null;
    }
  };

  const clearFormData = () => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  };

  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
  const [totalCost, setTotalCost] = useState(0);
  const [countryId, setCountryId] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [stateId, setStateId] = useState(0);
  const [allowCheckout, setAllowCheckout] = useState(false);
  const [sameAsContact, setSameAsContact] = useState(false);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [panData, setPanData] = useState();
  const [tanData, setTanData] = useState();
  const [verificationError, setVerificationError] = useState<boolean>(false);
  const [gstData, setGstData] = useState();
  const { setAmount } = usePrice();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const signatureRef = useRef<SignatureCanvas>(null);

  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  // State to track if the canvas is empty, to control save button
  const [isCanvasEmpty, setIsCanvasEmpty] = useState<boolean>(true);

  const [totalAmount, setTotalAmount] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [igstAmount, setIgstAmount] = useState(0);
  const [totalAfterTax, setTotalAfterTax] = useState(0);

  const calculateTaxes = (amount: number, state: string) => {
    const baseAmount = amount;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (state === 'Uttar Pradesh') {
      cgst = baseAmount * 0.09;
      sgst = baseAmount * 0.09;
    } else {
      igst = baseAmount * 0.18;
    }

    setTotalAmount(baseAmount);
    setCgstAmount(cgst);
    setSgstAmount(sgst);
    setIgstAmount(igst);
    setTotalAfterTax(baseAmount + cgst + sgst + igst);
  };

  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];
    const teens = [
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];

    if (num === 0) return 'Zero';

    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      return (
        ones[Math.floor(n / 100)] +
        ' Hundred' +
        (n % 100 !== 0 ? ' and ' + convertLessThanThousand(n % 100) : '')
      );
    };

    const convert = (n: number): string => {
      if (n === 0) return '';
      if (n < 1000) return convertLessThanThousand(n);
      if (n < 100000)
        return (
          convertLessThanThousand(Math.floor(n / 1000)) +
          ' Thousand' +
          (n % 1000 !== 0 ? ' ' + convertLessThanThousand(n % 1000) : '')
        );
      if (n < 10000000)
        return (
          convertLessThanThousand(Math.floor(n / 100000)) +
          ' Lakh' +
          (n % 100000 !== 0 ? ' ' + convert(Math.floor(n % 100000)) : '')
        );
      return (
        convertLessThanThousand(Math.floor(n / 10000000)) +
        ' Crore' +
        (n % 10000000 !== 0 ? ' ' + convert(Math.floor(n % 10000000)) : '')
      );
    };

    return convert(num) + ' Rupees Only';
  };

  // Function to clear the signature
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureUrl(null);
      setIsCanvasEmpty(true);
      setIsSaved(false);
      setAllowCheckout(false);

      const currentData = loadFormData() || {};
      const dataToSave = {
        ...currentData,
        signatureUrl: null,
      };
      saveFormData(dataToSave);
    }
  };

  // Function to handle the end of a stroke (when the user lifts the mouse/pen)
  const handleEndStroke = () => {
    if (signatureRef.current) {
      const isEmpty = signatureRef.current.isEmpty();
      setIsCanvasEmpty(isEmpty);
      if (!isEmpty) {
        const dataUrl = signatureRef.current.getCanvas().toDataURL('image/png');
        setSignatureUrl(dataUrl);
      } else {
        setSignatureUrl(null);
      }
    }
  };

  const saveSignature = async () => {
    if (signatureUrl) {
      console.log('Signature Saved:', signatureUrl);
      setIsSaved(true);

      try {
        const formData = new FormData();
        const blob = await fetch(signatureUrl).then((res) => res.blob());
        formData.append('file', blob, 'signature.png');

        const uploadResponse = await axios.post(
          `${BASE_URL}/auth/api/file/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const uploadedUrl = uploadResponse.data.data.storeUrl;
        setSignatureUrl(uploadedUrl);
        setAllowCheckout(true);

        const currentData = loadFormData() || {};
        const dataToSave = {
          ...currentData,
          signatureUrl: uploadedUrl,
        };
        saveFormData(dataToSave);

        console.log('Signature uploaded successfully:', uploadResponse.data);
      } catch (error) {
        console.error('Error uploading signature:', error);
        setIsSaved(false);
        setAllowCheckout(false);
      }
    } else {
      console.log('No signature to save.');
    }
  };

  useEffect(() => {
    if (signatureUrl) {
      console.log('Signature Data URL updated:', signatureUrl);
    }
  }, [signatureUrl]);

  const topRef = useRef<HTMLDivElement>(null);

  const [directors, setDirectors] = useState<Director[]>([]);

  // Country, State, City states
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // Set default country and state
  useEffect(() => {
    const india = Country.getAllCountries().find((country) => country.isoCode === 'IN');
    if (india) {
      setSelectedCountry(india);
      setValue('country', india.name);

      const indianStates = State.getStatesOfCountry(india.isoCode);
      setStates(indianStates);

      const up = indianStates.find((state) => state.isoCode === 'UP');
      if (up) {
        setSelectedState(up);
        setValue('stateProvinceRegion', up.name);

        const upCities = City.getCitiesOfState(india.isoCode, up.isoCode);
        setCities(upCities);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
      if (
        !selectedState ||
        !countryStates.some((state) => state.isoCode === selectedState.isoCode)
      ) {
        setSelectedState(null);
        setSelectedCity(null);
        setCities([]);
      }
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
      setCities(stateCities);
      if (!selectedCity || !stateCities.some((city) => city.name === selectedCity.name)) {
        setSelectedCity(null);
      }
    }
  }, [selectedCountry, selectedState]);

  const addDirector = () => {
    const newDirector = { id: crypto.randomUUID(), name: '' };
    setDirectors([...directors, newDirector]);
    const currentAdditionalDirectors = getValues('additionalDirectors') || [];
    const updatedDirectors = [...currentAdditionalDirectors, newDirector];
    setValue('additionalDirectors', updatedDirectors);

    const currentData = loadFormData() || {};
    const dataToSave = {
      ...currentData,
      formData: {
        ...currentData.formData,
        additionalDirectors: updatedDirectors,
      },
    };
    saveFormData(dataToSave);
  };

  const removeDirector = (id: string) => {
    const updatedDirectors = directors.filter((director) => director.id !== id);
    setDirectors(updatedDirectors);
    const currentAdditionalDirectors = getValues('additionalDirectors') || [];
    const filteredDirectors = currentAdditionalDirectors.filter((d) => d.id !== id);
    setValue('additionalDirectors', filteredDirectors);

    const currentData = loadFormData() || {};
    const dataToSave = {
      ...currentData,
      formData: {
        ...currentData.formData,
        additionalDirectors: filteredDirectors,
      },
    };
    saveFormData(dataToSave);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    control, // For controlled components like MUI select or custom radio/checkbox groups if needed
    getValues,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange', // Validate on change for better UX
    defaultValues: {
      // Initialize all fields
      nameOfExhibitor: '',
      boothDisplayName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      stateProvinceRegion: '',
      postalCode: '',
      companyEmailInput: '',
      companyPhoneInput: '',
      companyPanNoInput: '',
      directorNameInput: '',
      additionalDirectors: [],
      // hasGstNumber: "", // Let zod handle if not selected
      gstNumber: '',
      contactPersonFirstName: '',
      contactPersonLastName: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      emailAddress: '',
      alternateEmailAddress: '',
      website: '',
      contactPersonDesignation: '',
      // bookingViaAssociation: "",
      associationName: '',
      // registeredWithMsme: "",
      msmeNumber: '',
      // participatedEarlier: "",
      // interestedInSponsorship: "",
      mainObjectives: [],
      otherObjective: '',
      boothTypePreference: 'pre_fitted',
      totalAreaRequired: '',
      tds: 'nil',
      tanNumber: '',
    },
  });

  const watchedHasGstNumber = watch('hasGstNumber');
  const watchedBookingViaAssociation = watch('bookingViaAssociation');
  const watchedRegisteredWithMsme = watch('registeredWithMsme');
  const watchedBoothTypePreference = watch('boothTypePreference');
  const watchedTotalAreaRequired = watch('totalAreaRequired');

  //  useEffect(() => {
  //   if(getValues("alternateEmailAddress") === getValues("emailAddress")) {
  //     errors.alternateEmailAddress = {
  //       type: "manual",
  //       message: "Alternate email address must be different from primary email",
  //     };
  //   }else{
  //     delete errors.alternateEmailAddress;
  //   }
  // }, [getValues("alternateEmailAddress"), getValues("emailAddress"), getValues]);

  useEffect(() => {
    const area = parseFloat(watchedTotalAreaRequired);

    if (!isNaN(area) && area > 0 && watchedBoothTypePreference) {
      let rate = 0;
      let minArea = 0;

      // Determine rate and minimum area based on booth type
      if (watchedBoothTypePreference === 'pre_fitted') {
        rate = 7000;
        minArea = 12; // Minimum area for pre-fitted booths
      } else if (watchedBoothTypePreference === 'space_only') {
        rate = 6500;
        minArea = 36; // Minimum area for space-only booths
      }

      // Validate area against the minimum required
      if (area >= minArea) {
        setTotalCost(rate * area); // Calculate total cost if area is valid
      } else {
        setTotalCost(0); // Set total cost to 0 if area is less than the minimum
      }
    } else {
      setTotalCost(0); // Set total cost to 0 if area or booth type is invalid
    }
  }, [watchedBoothTypePreference, watchedTotalAreaRequired]);

  const handleGoToNextStep = async () => {
    const fieldsToValidate = stepFields[currentStep.id];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setSteps((prevSteps) =>
        prevSteps.map((step) => (step.id === currentStep.id ? { ...step, completed: true } : step))
      );
      const nextStepIndex = steps.findIndex((step) => step.id === currentStep.id) + 1;
      if (nextStepIndex < steps.length) {
        setCurrentStep(steps[nextStepIndex]);
      }
      setApiMessage({ type: '', text: '' }); // Clear previous API messages
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Errors will be displayed by react-hook-form
      setApiMessage({
        type: 'error',
        text: 'Make sure all required fields are filled out correctly.',
      });
      console.log('Validation failed for step ' + currentStep.id, errors);
    }
  };

  const handleGoToPrevStep = () => {
    const prevStepIndex = steps.findIndex((step) => step.id === currentStep.id) - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex]);
      setApiMessage({ type: '', text: '' }); // Clear any API messages
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTimelineStepClick = async (
    targetStep: SetStateAction<{
      id: number;
      label: string;
      completed: boolean;
    }>
  ) => {
    // Allow navigation to already completed steps
    // Or if it's the current step or a previous step that's not necessarily completed yet (e.g. user wants to go back)
    const currentStepIndex = steps.findIndex((s) => s.id === currentStep.id);
    const targetStepIndex = steps.findIndex((s) => s.id === targetStep.id);

    if (targetStep.completed || targetStepIndex <= currentStepIndex) {
      // If going back from a valid step, no need to re-validate current one to go back
      if (targetStepIndex < currentStepIndex) {
        setCurrentStep(targetStep);
        return;
      }
      // If clicking on current or future (but allowed) step, validate current before moving
      const fieldsToValidate = stepFields[currentStep.id];
      const isValid = await trigger(fieldsToValidate);
      if (isValid || targetStep.id === currentStep.id) {
        // Allow staying or if valid
        setCurrentStep(targetStep);
        topRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
    // Do not allow jumping to future, uncompleted steps beyond the next one
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingMessage, setSubmittingMessage] = useState(false);

  const onSubmitApi = async (formData: {
    country: any;
    contactPersonFirstName: any;
    contactPersonLastName: any;
    mobileNumber: any;
    emailAddress: any;
    nameOfExhibitor: any;
    companyEmailInput: any;
    companyPhoneInput: any;
    addressLine1: any;
    city: any;
    stateProvinceRegion: any;
    postalCode: any;
    companyPanNoInput: any;
    hasGstNumber: string;
    gstNumber: any;
    directorNameInput: any;
    boothDisplayName: any;
    addressLine2: any;
    alternateMobileNumber: any;
    alternateEmailAddress: any;
    website: any;
    contactPersonDesignation: any;
    bookingViaAssociation: string;
    associationName: any;
    registeredWithMsme: string;
    msmeNumber: any;
    participatedEarlier: any;
    participationYear: any;
    productCategory: any;
    departmentCategory: any;
    interestedInSponsorship: any;
    mainObjectives: any;
    otherObjective: any;
    boothTypePreference: any;
    totalAreaRequired: any;
    additionalDirectors: Director[];
    tds: any;
    tanNumber: any;
    signatureUrl: string;
    billingAddressLine1: any;
    billingAddressLine2: any;
    billingCity: any;
    billingCountry: any;
    billingPostalCode: any;
    otherDepartmentCategory: any;
    billingStateProvinceRegion: any;
    accountPersonFirstName: any;
    accountPersonLastName: any;
    accountPersonMobileNumber: any;
    accountPersonEmailAddress: any;
  }) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAmount(totalCost);
    console.log(formData);

    let proformaInvoice;

    try {
      if (!invoiceRef.current) {
        throw new Error('Invoice reference not found');
      }

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

      const pdfBlob = pdf.output('blob');

      const file = new File([pdfBlob], 'proforma-invoice.pdf', {
        type: 'application/pdf',
      });

      const uploadFormData = new FormData();
      const URL = `${BASE_URL}/auth/api/file/upload`;
      uploadFormData.append('file', file);

      proformaInvoice = await axios.post(URL, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(proformaInvoice);
    } catch (err) {
      setApiMessage({
        type: 'info',
        text: 'Registration Failed. Please try again',
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      firstName: formData.contactPersonFirstName,
      lastName: formData.contactPersonLastName,
      phone: formData.mobileNumber,
      eventId: 165, // As per curl
      userCohort: 'EXHIBITOR', // As per curl
      image: 'imgUrlPlaceholder', // Placeholder or get from form if added
      email: formData.emailAddress,
      companyOrganizationName: formData.nameOfExhibitor,
      companyEmail: formData.companyEmailInput,
      companyContact: formData.companyPhoneInput,
      companyAddress: `${formData.addressLine1}, ${formData.city}, ${formData.stateProvinceRegion}, ${formData.postalCode}`,
      companyPanNo: formData.companyPanNoInput,
      companyGstin: formData.hasGstNumber === 'yes' ? formData.gstNumber : undefined, // Send undefined if not applicable
      directorName: formData.directorNameInput,
      approvalStatus: 'COMPLETED', // As per curl
      data: {
        boothDisplayName: formData.boothDisplayName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city,
        country: formData.country,
        stateProvinceRegion: formData.stateProvinceRegion,
        postalCode: formData.postalCode,
        hasGstNumber: formData.hasGstNumber,
        // gstNumber: formData.hasGstNumber === "yes" ? formData.gstNumber : undefined, // Already in companyGstin

        alternateMobileNumber: formData.alternateMobileNumber || undefined,
        alternateEmailAddress: formData.alternateEmailAddress || undefined,
        website: formData.website || undefined,
        contactPersonDesignation: formData.contactPersonDesignation,

        bookingViaAssociation: formData.bookingViaAssociation,
        associationName:
          formData.bookingViaAssociation === 'yes' ? formData.associationName : undefined,
        registeredWithMsme: formData.registeredWithMsme,
        udyogAadhaarNumber: formData.registeredWithMsme === 'yes' ? formData.msmeNumber : undefined,
        participatedEarlier: formData.participatedEarlier,
        participationYear: formData.participationYear,
        otherDepartmentCategory: formData.otherDepartmentCategory,
        productCategory: formData.productCategory,
        departmentCategory: formData.departmentCategory,
        interestedInSponsorship: formData.interestedInSponsorship,
        mainObjectives: formData.mainObjectives,
        otherObjective: formData.otherObjective || undefined,
        billingAddressLine1: formData.billingAddressLine1,
        billingAddressLine2: formData.billingAddressLine2,
        billingCity: formData.billingCity,
        billingCountry: formData.billingCountry,
        billingPostalCode: formData.billingPostalCode,
        billingStateProvinceRegion: formData.billingStateProvinceRegion,
        accountPersonFirstName: formData.accountPersonFirstName,
        accountPersonLastName: formData.accountPersonLastName,
        accountPersonMobileNumber: formData.accountPersonMobileNumber,
        accountPersonEmailAddress: formData.accountPersonEmailAddress,
        boothTypePreference: formData.boothTypePreference,
        totalAreaRequired: formData.totalAreaRequired, // Already a number due to Zod transform
        calculatedTotalCost: totalCost, // Send calculated cost
        tds: 'nil',
        tanNumber: formData.tds !== 'nil' ? formData.tanNumber : undefined, // Only if TDS is not nil
        additionalDirectors: formData.additionalDirectors?.map((d) => d.name) || null,
        signatureUrl: signatureUrl || undefined, // Send signature URL if available
        proformaInvoice: proformaInvoice?.data.data.storeUrl,
      },
    };

    // Clean up undefined optional fields from data object
    for (const key in payload.data) {
      if (payload.data[key as keyof typeof payload.data] === undefined) {
        delete payload.data[key as keyof typeof payload.data];
      }
    }
    if (payload.companyGstin === undefined) {
      delete payload.companyGstin;
    }

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`${BASE_URL}/auth/register/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Submission successful:', result);
        if (result.status === 'success') {
          setApiMessage({
            type: 'success',
            text: 'Registration Successful! you will be redirected to the payment screen shortly...',
          });
          const timer = setTimeout(() => {
            router.push(`/payment/${formData.companyEmailInput}`); // Navigate to /payment with companyEmail
          }, 5000);

          // setIsSubmitting(false);
          return () => clearTimeout(timer);
        } else {
          setApiMessage({
            type: 'info',
            text: `Registration Failed: ${result.message || 'Unknown error'}`,
          });
          setIsSubmitting(false);
        }
        // Optionally reset form or redirect
      } else {
        const errorResult = await response.json().catch(() => ({ message: response.statusText }));
        console.error('Submission failed:', errorResult);
        setApiMessage({
          type: 'error',
          text: `Registration Failed: ${errorResult.message || 'Unknown error contact eventstrat.ai'
            }`,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Network error:', error);
      setApiMessage({
        type: 'error',
        text: `Registration Failed: Network error. ${error.message}`,
      });
      setIsSubmitting(false);
    }

    clearFormData();
  };

  const productCategories = [
    'Agriculture & Allied Products',
    'Animal Husbandry / Meat Products',
    'Apparels (Hosiery / Chikankari / Zari Zardozi / Silk / Readymade Garments)',
    'Auto & EV',
    'Auto Components',
    'Banks & Finance',
    'Carpets / Rugs / Durries / Bedsheets',
    'Ceramic & Pottery',
    'Dairy & Dairy Products',
    'Decorative / Gift Items',
    'Defence & Civil',
    'E-commerce, Electronics Industry',
    'Education Sector',
    'Educational Institutions',
    'Engineering Goods',
    'Fashion Jewellery & Accessories / Cosmetics',
    'Fishery',
    'Food Processing (Spices / Pickles / Honey / Grains & Rice)',
    'Food Processing / FMCG',
    'Glassware / Glass Industry',
    'Handloom & Handicrafts',
    'Hardware (Locks / Fittings / Pipes)',
    'Health & Wellness',
    'Health & Wellness (Ayush / Pharma / Ayurvedic / Drugs)',
    'Home Décor & Furnishing',
    'Horticulture',
    'Hospitals & Allied Industry',
    'Hygiene & Sanitation (Skincare / Haircare / Bodycare)',
    'Interiors & Designing / Infrastructure',
    'IT & ITeS',
    'Jute Products',
    'Labels and Hologram',
    'Large Corporates',
    'Leather Products',
    'Manufacturing Industry',
    'Marble & Stone Products',
    'Millets & Millet-based Products',
    'Moonj Products',
    'Packaged Foods (Ready to Eat / Dry Fruits)',
    'Packaging & Printing Industry',
    'Perfume Essentials (Attar / Candles / Agarbatti / Dhoopbatti / Air Fresheners)',
    'Plastic Products',
    'Real Estate',
    'Renewable, Solar & Power',
    'Seeds / Organic Vegetables',
    'Sports / Toys / Games / Stationery',
    'Tableware',
    'Textile & Khadi',
    'Urban Development / Smart City / Swachhta',
    'Warehousing & Logistics',
    'Water, Sanitation & Waste Water Management',
    'Wood Products',
  ];

  const exhibitorCategories = [
    'Agriculture & Allied Sectors',
    'Aerospace & Defense',
    'Aviation Sector',
    'Khadi Gramodyog Vikas Yojana Umbrella Scheme',
    'Defence Manufacturing Pavilion',
    'Marine Industry',
    'Leather Industry',
    'Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)',
    'Micro & Small Enterprises Cluster Development Programme (MSE-CDP)',
    'Credit Guarantee Scheme for Micro & Small Development of Infrastructure in UP',
    'Namami Gange & Jal Shakti',
    'Digital India Mission',
    'Education Sector',
    'National Manufacturing Competitiveness Programme (NMCP)',
    'E-Commerce',
    'Electronics Industry',
    'ODOP Display',
    'Entrepreneurship and Skill Development Programme (ESDP)',
    'Power Corporation (UP Power Corporation/ NCPL & Others)',
    'Film & Entertainment Industry',
    "Prime Minister's Employment Generation Programme (PMEGP)",
    'Fishery, Animal Husbandry & Dairy',
    'Procurement and Marketing Support (PMS) Scheme',
    'GI Tags Products from Uttar Pradesh-H2C',
    'Renewable Energy, EV & Mines',
    'Glass Industry',
    'Retail Sector',
    'Rural and Urban Development Scheme',
    'Handloom, Handicrafts & Textiles',
    'Sports Sector',
    'STPI (Software Technology Parks of India)',
    'Sugar & Cane Industry',
    'Health & Wellness (AYUSH/ Pharma/Naturophathy/ Diagonostic/Joga/Unani)',
    'Tourism & Hospitality Sector',
    'Highways/Industrial Park/Development Authorities',
    'Toy Association & Clusters of Uttar Pradesh',
    'Horticulture / Food Processing',
    'Transforming India (Atmanirbhar Bharat Abhiyan)',
    'Infra, Engineering & Manufacturing Industry',
    'UP Police Association',
    'International Cooperation (IC) Scheme',
    'Warehouse and Logistics',
    'IT & Smart City Mission, Uttar Pradesh',
    'Water, Sanitation & Waste Water Management',
    'Others (Please Specify)',
  ];

  const checkEmailExists = async (email: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/auth/isRegistered?email=` + email + '&eventId=165'
      );
      if (response.status === 200) {
        const data = response.data;
        console.log('Email check response:', data.message);
        if (data?.message.includes('not')) {
          setApiMessage({
            type: '',
            text: '',
          });
          setIsEmailUnique(true);
        } else {
          setApiMessage({
            type: 'error',
            text: 'Email already registered. Please use a different email.',
          });
          setIsEmailUnique(false);
        }
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  useEffect(() => {
    if (getValues('companyEmailInput') !== '') {
      checkEmailExists(getValues('companyEmailInput'));
    }
  }, [getValues('companyEmailInput')]);

  useEffect(() => {
    if (sameAsContact) {
      const contactFirstName = getValues('contactPersonFirstName');
      const contactLastName = getValues('contactPersonLastName');
      const contactMobile = getValues('mobileNumber');
      const contactEmail = getValues('emailAddress');

      setValue('accountPersonFirstName', contactFirstName);
      setValue('accountPersonLastName', contactLastName);
      setValue('accountPersonMobileNumber', contactMobile);
      setValue('accountPersonEmailAddress', contactEmail);
    }
  }, [sameAsContact, getValues, setValue]);

  const [billingAddressSame, setBillingAddressSame] = useState(false);
  const [selectedBillingCountry, setSelectedBillingCountry] = useState<ICountry | null>(null);
  const [selectedBillingState, setSelectedBillingState] = useState<IState | null>(null);
  const [selectedBillingCity, setSelectedBillingCity] = useState<ICity | null>(null);
  const [billingStates, setBillingStates] = useState<IState[]>([]);
  const [billingCities, setBillingCities] = useState<ICity[]>([]);

  useEffect(() => {
    if (billingAddressSame) {
      const businessAddress = {
        addressLine1: getValues('addressLine1'),
        addressLine2: getValues('addressLine2'),
        city: getValues('city'),
        country: getValues('country'),
        stateProvinceRegion: getValues('stateProvinceRegion'),
        postalCode: getValues('postalCode'),
      };

      setValue('billingAddressLine1', businessAddress.addressLine1);
      setValue('billingAddressLine2', businessAddress.addressLine2);
      setValue('billingCity', businessAddress.city);
      setValue('billingCountry', businessAddress.country);
      setValue('billingStateProvinceRegion', businessAddress.stateProvinceRegion);
      setValue('billingPostalCode', businessAddress.postalCode);

      setSelectedBillingCountry(selectedCountry);
      setSelectedBillingState(selectedState);
      setSelectedBillingCity(selectedCity);
      setBillingStates(states);
      setBillingCities(cities);
    }
  }, [
    billingAddressSame,
    getValues,
    setValue,
    selectedCountry,
    selectedState,
    selectedCity,
    states,
    cities,
    watch('postalCode'),
  ]);

  useEffect(() => {
    if (!billingAddressSame) {
      if (selectedBillingCountry) {
        const countryStates = State.getStatesOfCountry(selectedBillingCountry.isoCode);
        setBillingStates(countryStates);
        if (
          !selectedBillingState ||
          !countryStates.some((state) => state.isoCode === selectedBillingState.isoCode)
        ) {
          setSelectedBillingState(null);
          setSelectedBillingCity(null);
          setBillingCities([]);
        }
      }
    }
  }, [selectedBillingCountry, billingAddressSame]);

  useEffect(() => {
    if (!billingAddressSame) {
      if (selectedBillingCountry && selectedBillingState) {
        const stateCities = City.getCitiesOfState(
          selectedBillingCountry.isoCode,
          selectedBillingState.isoCode
        );
        setBillingCities(stateCities);
        if (
          !selectedBillingCity ||
          !stateCities.some((city) => city.name === selectedBillingCity.name)
        ) {
          setSelectedBillingCity(null);
        }
      }
    }
  }, [selectedBillingCountry, selectedBillingState, billingAddressSame]);
  // PAN extraction function
  const verifyPanNumber = async (pan: string) => {
    try {
      const response = await axios.post(
        'https://api.attestr.com/api/v2/public/checkx/pan',
        { pan }, // PAN number to be verified
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Basic T1gwajRlSVQ2TENUT29ZanBkLjZiY2E2YjY0ZTlhNWI0ZGVlMGQ3NWVjZTk4NDg0NWVhOjA0N2FlNzM0ZmMwZmQ2NTc2M2Q4OGNmNGNkZmY5Mzc3OTBhNWFlNzFhYTU0YWQ2ZQ==',
          },
        }
      );
      // Handle the response as needed
      console.log('PAN Verification Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('PAN Verification Error:', error);
      throw error;
    }
  };

  const gstVerification = async (gst: string, fetchFilings = false, fy?: string) => {
    try {
      const body: any = {
        gstin: gst,
        fetchFilings,
      };
      if (fetchFilings && fy) {
        body.fy = fy; // Only include fy if fetchFilings is true and fy is provided
      }

      const response = await axios.post('https://api.attestr.com/api/v2/public/corpx/gstin', body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic T1gwajRlSVQ2TENUT29ZanBkLjZiY2E2YjY0ZTlhNWI0ZGVlMGQ3NWVjZTk4NDg0NWVhOjA0N2FlNzM0ZmMwZmQ2NTc2M2Q4OGNmNGNkZmY5Mzc3OTBhNWFlNzFhYTU0YWQ2ZQ==',
        },
      });
      // Handle the response as needed
      console.log('GST Verification Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('GST Verification Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const panNumber = getValues('companyPanNoInput');
    setPanData(undefined);

    if (panNumber && errors.companyPanNoInput === undefined) {
      verifyPanNumber(panNumber)
        .then((data) => {
          console.log('PAN Verification Data:', data);
          setPanData(data);
          if (data?.valid === true) {
            setVerificationError(false);
          } else {
            setVerificationError(true);
            setPanData(undefined);
          }
        })
        .catch((error) => {
          console.error('Error verifying PAN:', error);
        });
    }
  }, [getValues('companyPanNoInput'), getValues]);

  useEffect(() => {
    const savedData = loadFormData();
    if (savedData) {
      reset(savedData.formData);

      if (savedData.currentStep) {
        setCurrentStep(savedData.currentStep);
        setSteps(savedData.steps);
      }

      if (savedData.sameAsContact) setSameAsContact(savedData.sameAsContact);
      if (savedData.billingAddressSame) setBillingAddressSame(savedData.billingAddressSame);
      if (savedData.totalCost) setTotalCost(savedData.totalCost);

      if (savedData.formData.hasGstNumber) {
        setValue('hasGstNumber', savedData.formData.hasGstNumber, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }

      if (savedData.selectedCountry) {
        setSelectedCountry(savedData.selectedCountry);
        const countryStates = State.getStatesOfCountry(savedData.selectedCountry.isoCode);
        setStates(countryStates);
      }
      if (savedData.selectedState) {
        setSelectedState(savedData.selectedState);
        if (savedData.selectedCountry) {
          const stateCities = City.getCitiesOfState(
            savedData.selectedCountry.isoCode,
            savedData.selectedState.isoCode
          );
          setCities(stateCities);
        }
      }
      if (savedData.selectedCity) {
        setSelectedCity(savedData.selectedCity);
      }

      if (savedData.selectedBillingCountry) {
        setSelectedBillingCountry(savedData.selectedBillingCountry);
        const billingCountryStates = State.getStatesOfCountry(
          savedData.selectedBillingCountry.isoCode
        );
        setBillingStates(billingCountryStates);
      }
      if (savedData.selectedBillingState) {
        setSelectedBillingState(savedData.selectedBillingState);
        if (savedData.selectedBillingCountry) {
          const billingStateCities = City.getCitiesOfState(
            savedData.selectedBillingCountry.isoCode,
            savedData.selectedBillingState.isoCode
          );
          setBillingCities(billingStateCities);
        }
      }
      if (savedData.selectedBillingCity) {
        setSelectedBillingCity(savedData.selectedBillingCity);
      }
    }
  }, []);

  useEffect(() => {
    const subscription = watch((formData) => {
      const dataToSave = {
        formData,
        currentStep,
        steps,
        sameAsContact,
        billingAddressSame,
        totalCost,

        selectedCountry,
        selectedState,
        selectedCity,
        selectedBillingCountry,
        selectedBillingState,
        selectedBillingCity,
        signatureUrl,
      };
      saveFormData(dataToSave);
    });
    return () => subscription.unsubscribe();
  }, [
    watch,
    signatureUrl,
    currentStep,
    steps,
    sameAsContact,
    billingAddressSame,
    totalCost,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedBillingCountry,
    selectedBillingState,
    selectedBillingCity,
  ]);
  // useEffect(() => {
  //   const tanNumber = getValues("tanNumber");
  //   setTanData(undefined);

  //   if (tanNumber && errors.tanNumber === undefined) {
  //     verifyPanNumber(tanNumber)
  //       .then((data) => {
  //         console.log("TAN Verification Data:", data);
  //         setTanData(data);
  //         if (data?.valid === true) {
  //           setVerificationError(false);
  //         } else {
  //           setVerificationError(true);
  //           setTanData(undefined);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error verifying TAN:", error);
  //       });
  //   }
  // }, [getValues("tanNumber"), getValues]);

  const gstNumberWatched = watch('gstNumber');
  useEffect(() => {
    setGstData(null); // Clear previous GST data
    setVerificationError(false); // Reset verification error
    if (
      gstNumberWatched &&
      gstNumberWatched.length >= 15 &&
      errors.gstNumber === undefined &&
      watchedHasGstNumber === 'yes'
    ) {
      const timer = setTimeout(() => {
        gstVerification(gstNumberWatched, true, '2024-25') // Example FY
          .then((data) => {
            console.log('GST Verification Data:', data);
            setGstData(data);
            if (data?.valid === true) {
              setVerificationError(false);
            } else {
              setVerificationError(true);
            }
          })
          .catch((error) => {
            console.error('Error verifying GST:', error);
            setGstData({
              message: 'GST verification failed. Please try again.',
            });
            setVerificationError(true);
          });
      }, 500); // Debounce API call
      return () => clearTimeout(timer);
    }
  }, [gstNumberWatched, errors.gstNumber, watchedHasGstNumber]);

  const boothTypeWatched = watch('boothTypePreference');
  const stateWatched = watch('billingStateProvinceRegion');
  const areaWatched = watch('totalAreaRequired');

  useEffect(() => {
    if (boothTypeWatched && stateWatched && areaWatched) {
      const rate = boothTypeWatched === 'pre_fitted' ? 7000 : 6500;
      const baseAmount = rate * Number(areaWatched);
      calculateTaxes(baseAmount, stateWatched);
    }
  }, [boothTypeWatched, stateWatched, areaWatched]);

  const [exhibitorCount, setExhibitorCount] = useState('0000');

  useEffect(() => {
    const fetchExhibitorCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/exhibitorCount/165`);
        const data = await response.json();
        if (data && data.data.exhibitorCount !== undefined) {
          // Format the number to always be 4 digits with leading zeros
          console.log(data);
          const formattedCount = String(data.data.exhibitorCount).padStart(4, '0');
          setExhibitorCount(formattedCount);
        }
      } catch (error) {
        console.error('Error fetching exhibitor count:', error);
      }
    };

    fetchExhibitorCount();
  }, []);

  const DEBOUNCE_DELAY = 3000; // 2 seconds

  useEffect(() => {
    const email = getValues('companyEmailInput');
    if (!email || !/\S+@\S+\.\S+/.test(email)) return; // Only trigger if email is valid

    if (signatureUrl?.includes('https://')) return; // Skip if signature URL is already set

    const timer = setTimeout(async () => {
      const formData = getValues();
      const payload = {
        firstName: formData.contactPersonFirstName,
        lastName: formData.contactPersonLastName,
        phone: formData.mobileNumber,
        eventId: 165,
        userCohort: 'EXHIBITOR',
        image: 'imgUrlPlaceholder',
        email: formData.emailAddress,
        companyOrganizationName: formData.nameOfExhibitor,
        companyEmail: formData.companyEmailInput,
        companyContact: formData.companyPhoneInput,
        companyAddress: `${formData.addressLine1}, ${formData.city}, ${formData.stateProvinceRegion}, ${formData.postalCode}`,
        companyPanNo: formData.companyPanNoInput,
        companyGstin: formData.hasGstNumber === 'yes' ? formData.gstNumber : undefined,
        directorName: formData.directorNameInput,
        approvalStatus: 'PENDING',
        data: {
          boothDisplayName: formData.boothDisplayName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city,
          country: formData.country,
          stateProvinceRegion: formData.stateProvinceRegion,
          postalCode: formData.postalCode,
          hasGstNumber: formData.hasGstNumber,
          alternateMobileNumber: formData.alternateMobileNumber || undefined,
          alternateEmailAddress: formData.alternateEmailAddress || undefined,
          website: formData.website || undefined,
          contactPersonDesignation: formData.contactPersonDesignation,
          bookingViaAssociation: formData.bookingViaAssociation,
          associationName:
            formData.bookingViaAssociation === 'yes' ? formData.associationName : undefined,
          registeredWithMsme: formData.registeredWithMsme,
          udyogAadhaarNumber:
            formData.registeredWithMsme === 'yes' ? formData.msmeNumber : undefined,
          participatedEarlier: formData.participatedEarlier,
          participationYear: formData.participationYear,
          otherDepartmentCategory: formData.otherDepartmentCategory,
          productCategory: formData.productCategory,
          departmentCategory: formData.departmentCategory,
          interestedInSponsorship: formData.interestedInSponsorship,
          mainObjectives: formData.mainObjectives,
          otherObjective: formData.otherObjective || undefined,
          billingAddressLine1: formData.billingAddressLine1,
          billingAddressLine2: formData.billingAddressLine2,
          billingCity: formData.billingCity,
          billingCountry: formData.billingCountry,
          billingPostalCode: formData.billingPostalCode,
          billingStateProvinceRegion: formData.billingStateProvinceRegion,
          accountPersonFirstName: formData.accountPersonFirstName,
          accountPersonLastName: formData.accountPersonLastName,
          accountPersonMobileNumber: formData.accountPersonMobileNumber,
          accountPersonEmailAddress: formData.accountPersonEmailAddress,
          boothTypePreference: formData.boothTypePreference,
          totalAreaRequired: formData.totalAreaRequired,
          calculatedTotalCost: totalCost,
          tds: formData.tds,
          tanNumber: formData.tds !== 'nil' ? formData.tanNumber : undefined,
          additionalDirectors: formData.additionalDirectors?.map((d) => d.name) || null,
          signatureUrl: signatureUrl || undefined,
          // proformaInvoice: ... // Only include if available
        },
      };

      // Clean up undefined fields
      for (const key in payload.data) {
        if (payload.data[key] === undefined) {
          delete payload.data[key];
        }
      }
      if (payload.companyGstin === undefined) {
        delete payload.companyGstin;
      }

      try {
        await fetch(`${BASE_URL}/auth/register/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error('Debounced API error:', err);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [watch('companyEmailInput'), watch()]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitApi)} className="w-full">
        {' '}
        <div ref={topRef} className="absolute top-0 left-0" />
        {/* Form wraps the content */}
        <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] min-h-[90vh] rounded-2xl md:w-full xl:w-5/6 mx-auto my-8">
          {' '}
          {/* Centered form */}
          <div className="flex flex-col justify-start gap-3 lg:gap-8 items-center lg:items-start lg:w-2/5 w-full bg-[#ffa206] rounded-t-2xl lg:rounded-2xl lg:pl-5 px-4 py-6 lg:py-12 text-white">
            <h1 className="text-white text-2xl lg:text-3xl font-semibold px-4">Register Now</h1>
            <Timeline
              sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
                alignItems: { xs: 'center', md: 'flex-start' }, // Center for horizontal view in mobile
                paddingLeft: { lg: 0 }, // Adjust padding for large screens
                marginLeft: { lg: '10px' }, // Space for dots in large screens
                flexDirection: { xs: 'row', md: 'column' }, // Horizontal for mobile, vertical for large screens
                overflowX: { xs: 'auto', md: 'visible' }, // Allow horizontal scrolling in mobile
                '& .MuiTimelineConnector-root': {
                  transform: { xs: 'none', md: 'none' }, // Ensure connectors are aligned
                },
                alignSelf: { xs: 'center', md: 'flex-start' }, // Center for horizontal view in mobile
              }}
            >
              {steps.map((step, index) => (
                <TimelineItem
                  key={step.id}
                  sx={{
                    minHeight: { xs: 'auto', md: '80px' }, // Adjust height for horizontal mode
                    display: 'flex',
                    flexDirection: 'row',
                    '& .MuiTimelineContent-root': {
                      marginLeft: '10px', // Space between dot and text
                      paddingTop: '10px', // Align text with dot center
                      paddingLeft: '8px', // MUI default is 16px, reduce if needed
                      paddingRight: '8px',
                    },
                    '& .MuiTimelineSeparator-root': {
                      flexDirection: { xs: 'row', md: 'column' }, // Align connectors horizontally in mobile
                    },
                  }}
                >
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        width: { xs: '36px', md: '40px' },
                        height: { xs: '36px', md: '40px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: step.completed || currentStep.id === step.id ? '#ffa206' : 'white',
                        backgroundColor:
                          step.completed || currentStep.id === step.id ? 'white' : 'transparent',
                        borderColor: 'white',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderRadius: '50%',
                        cursor:
                          step.completed || steps.findIndex((s) => s.id === currentStep.id) >= index
                            ? 'pointer'
                            : 'not-allowed',
                        opacity:
                          step.completed ||
                            currentStep.id === step.id ||
                            steps.findIndex((s) => s.id === currentStep.id) >= index
                            ? 1
                            : 0.5,
                        margin: { xs: 'none', lg: 0 }, // Remove default margin if any
                      }}
                      variant={step.completed || currentStep.id === step.id ? 'filled' : 'outlined'}
                      onClick={() => {
                        const targetStepObj = steps.find((s) => s.id === step.id);
                        if (targetStepObj) handleTimelineStepClick(targetStepObj);
                      }}
                    >
                      {step.completed && currentStep.id !== step.id ? (
                        <CheckIcon sx={{ color: '#ffa206', fontSize: '20px' }} />
                      ) : (
                        step.id
                      )}
                    </TimelineDot>
                    {index < steps.length - 1 && (
                      <TimelineConnector
                        sx={{
                          backgroundColor: 'white',
                          opacity: step.completed ? 1 : 0.5,
                          width: {
                            xs: '26px',
                            md: step.completed ? '2px' : '1px',
                          }, // Horizontal width for mobile
                          height: {
                            xs: step.completed ? '2px' : '1px',
                            md: '40px',
                          }, // Vertical height for large screens
                          flexGrow: 1, // Ensure connector fills space
                        }}
                      />
                    )}
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{
                      color: 'white',
                      fontWeight: step.completed || currentStep.id === step.id ? 'bold' : 'normal',
                      opacity:
                        step.completed ||
                          currentStep.id === step.id ||
                          steps.findIndex((s) => s.id === currentStep.id) >= index
                          ? 1
                          : 0.5,
                      display: { xs: 'none', md: 'block' },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor:
                          step.completed || steps.findIndex((s) => s.id === currentStep.id) >= index
                            ? 'pointer'
                            : 'not-allowed',
                        '&:hover': {
                          textDecoration:
                            step.completed ||
                              steps.findIndex((s) => s.id === currentStep.id) >= index
                              ? 'underline'
                              : 'none',
                        },
                      }}
                      onClick={() => {
                        const targetStepObj = steps.find((s) => s.id === step.id);
                        if (targetStepObj) handleTimelineStepClick(targetStepObj);
                      }}
                    >
                      {step.label}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
          <div className="flex flex-col w-full p-6 lg:p-8">
            {/* Step 1: Exhibitor Information */}
            {currentStep.id === 1 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4">Exhibitor Information</h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  {/* Row 1 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Name of the Company*
                      </label>
                      <input
                        type="text"
                        {...register('nameOfExhibitor')}
                        placeholder="Enter Legal Business Name"
                        className={`w-full h-[54px] border bg-white ${errors.nameOfExhibitor ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.nameOfExhibitor && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.nameOfExhibitor.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Company Name to appear on your booth*
                      </label>
                      <input
                        type="text"
                        {...register('boothDisplayName')}
                        placeholder="Enter Booth Display Name"
                        className={`w-full h-[54px] border bg-white ${errors.boothDisplayName ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.boothDisplayName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.boothDisplayName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl font-semibold mb-4 mt-4">Registered Business Address</h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  {/* Row 2 */}
                  <div className="flex flex-col md:flex-row items-start mb-7 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Address Line 1*
                      </label>
                      <input
                        type="text"
                        {...register('addressLine1')}
                        placeholder="Enter Street Address"
                        className={`w-full h-[54px] border bg-white ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.addressLine1 && (
                        <p className="text-red-500 text-sm mt-1">{errors.addressLine1.message}</p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('addressLine2')}
                        placeholder="Enter Floor / Suite / Unit"
                        className="w-full h-[54px] border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]"
                      />
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-10 w-full md:w-2/4">
                      <label className="block text-gray-700 font-medium mb-2">Country*</label>
                      <Controller
                        name="country"
                        control={control}
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
                            renderOption={(props, option) => (
                              <Box component="li" {...props} key={option.isoCode}>
                                {option.name} ({option.isoCode})
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Country"
                                error={!!errors.country}
                                helperText={errors.country?.message}
                                className={`w-full bg-white rounded-sm`}
                                sx={{
                                  /* MUI Autocomplete specific styling */
                                  '& .MuiOutlinedInput-root': {
                                    paddingRight: '39px !important',
                                    height: '53px',
                                    '& fieldset': {
                                      borderColor: errors.country ? '#EF4444' : '#D1D5DB',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#ffa206',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#ffa206',
                                      borderWidth: '2px',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    padding: '15.5px 14px !important',
                                  },
                                  '& .MuiFormHelperText-root.Mui-error': {
                                    color: '#ffa206',
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    <div className="mb-10 w-full md:w-2/4">
                      <label className="block text-gray-700 font-medium mb-2">
                        State / Province / Region*
                      </label>
                      <Controller
                        name="stateProvinceRegion"
                        control={control}
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
                                placeholder={
                                  selectedCountry ? 'Select State' : 'Select Country First'
                                }
                                error={!!errors.stateProvinceRegion}
                                helperText={errors.stateProvinceRegion?.message}
                                className={`w-full bg-white rounded-sm`}
                                sx={{
                                  /* MUI Autocomplete specific styling */
                                  '& .MuiOutlinedInput-root': {
                                    paddingRight: '39px !important',
                                    height: '53px',
                                    '& fieldset': {
                                      borderColor: errors.stateProvinceRegion
                                        ? '#EF4444'
                                        : '#D1D5DB',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#ffa206',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#ffa206',
                                      borderWidth: '2px',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    padding: '15.5px 14px !important',
                                  },
                                  '& .MuiFormHelperText-root.Mui-error': {
                                    color: '#ffa206',
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-8 w-full md:w-2/4">
                      <label className="block text-gray-700 font-medium mb-2">City / Town*</label>
                      <Controller
                        name="city"
                        control={control}
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
                                {' '}
                                {/* Assuming city name is unique enough for key here */}
                                {option.name}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={selectedState ? 'Select City' : 'Select State First'}
                                error={!!errors.city}
                                helperText={errors.city?.message}
                                className={`w-full bg-white rounded-sm`}
                                sx={{
                                  /* MUI Autocomplete specific styling */
                                  '& .MuiOutlinedInput-root': {
                                    paddingRight: '39px !important',
                                    height: '53px',
                                    '& fieldset': {
                                      borderColor: errors.city ? '#EF4444' : '#D1D5DB',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#ffa206',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#ffa206',
                                      borderWidth: '2px',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    padding: '15.5px 14px !important',
                                  },
                                  '& .MuiFormHelperText-root.Mui-error': {
                                    color: '#ffa206',
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    <div className="mb-8 w-full md:w-2/4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Postal Code / ZIP Code*
                      </label>
                      <input
                        type="text"
                        {...register('postalCode', {
                          // You can also add react-hook-form specific validations here if needed
                          // For example, to ensure it's a positive number or for custom messages.
                          // valueAsNumber: true, // if you want the value to be parsed as a number by react-hook-form
                          max: {
                            // react-hook-form validation for max value
                            value: 999999,
                            message: 'Postal code cannot be more than 6 digits',
                          },
                          // react-hook-form's own maxLength for string representation if not using valueAsNumber
                          // or if you want to validate the string length specifically
                          // maxLength: {
                          //   value: 6,
                          //   message: "Postal code cannot exceed 6 digits"
                          // }
                        })}
                        placeholder="Enter Postal or ZIP Code"
                        // maxLength={6}
                        max="999999"
                        className={`w-full h-[54px] border bg-white ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>
                  {/* Inside Step 1, after Registered Business Address section and before Company Details */}
                  <div className="mb-4 w-full">
                    <label className="flex items-center text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billingAddressSame}
                        onChange={(e) => setBillingAddressSame(e.target.checked)}
                        className="mr-2 h-5 w-5 accent-[#ffa206]"
                      />
                      <span className="font-medium">Billing address same as above</span>
                    </label>
                  </div>

                  {!billingAddressSame && (
                    <>
                      <h2 className="text-2xl font-semibold mb-4 mt-4">Billing Address</h2>
                      <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                      <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                        <div className="mb-4 w-full md:w-1/2">
                          <label className="block text-gray-700 font-medium mb-2">
                            Address Line 1*
                          </label>
                          <input
                            type="text"
                            {...register('billingAddressLine1')}
                            placeholder="Enter Street Address"
                            className={`w-full h-[54px] border bg-white ${errors.billingAddressLine1 ? 'border-red-500' : 'border-gray-300'
                              } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                          />
                          {errors.billingAddressLine1 && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.billingAddressLine1.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-4 w-full md:w-1/2">
                          <label className="block text-gray-700 font-medium mb-2">
                            Address Line 2 (Optional)
                          </label>
                          <input
                            type="text"
                            {...register('billingAddressLine2')}
                            placeholder="Enter Floor / Suite / Unit"
                            className="w-full h-[54px] border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                        <div className="mb-10 w-full md:w-2/4">
                          <label className="block text-gray-700 font-medium mb-2">Country*</label>
                          <Controller
                            name="billingCountry"
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                options={Country.getAllCountries()}
                                autoHighlight
                                getOptionLabel={(option) => option.name}
                                value={selectedBillingCountry}
                                onChange={(_, newValue) => {
                                  field.onChange(newValue?.name || '');
                                  setSelectedBillingCountry(newValue);
                                }}
                                renderOption={(props, option) => (
                                  <Box component="li" {...props} key={`${option.isoCode}-billing`}>
                                    {option.name} ({option.isoCode})
                                  </Box>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Country"
                                    error={!!errors.billingCountry}
                                    helperText={errors.billingCountry?.message}
                                    className={`w-full bg-white rounded-sm`}
                                    sx={{
                                      /* MUI Autocomplete specific styling */
                                      '& .MuiOutlinedInput-root': {
                                        paddingRight: '39px !important',
                                        height: '53px',
                                        '& fieldset': {
                                          borderColor: errors.billingCountry
                                            ? '#EF4444'
                                            : '#D1D5DB',
                                        },
                                        '&:hover fieldset': {
                                          borderColor: '#ffa206',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#ffa206',
                                          borderWidth: '2px',
                                        },
                                      },
                                      '& .MuiInputBase-input': {
                                        padding: '15.5px 14px !important',
                                      },
                                      '& .MuiFormHelperText-root.Mui-error': {
                                        color: '#ffa206',
                                      },
                                    }}
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                        <div className="mb-10 w-full md:w-2/4">
                          <label className="block text-gray-700 font-medium mb-2">
                            State / Province / Region*
                          </label>
                          <Controller
                            name="billingStateProvinceRegion"
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                options={billingStates}
                                autoHighlight
                                getOptionLabel={(option) => option.name}
                                value={selectedBillingState}
                                onChange={(_, newValue) => {
                                  field.onChange(newValue?.name || '');
                                  setSelectedBillingState(newValue);
                                }}
                                disabled={!selectedBillingCountry}
                                renderOption={(props, option) => (
                                  <Box component="li" {...props} key={`${option.isoCode}-billing`}>
                                    {option.name}
                                  </Box>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder={
                                      selectedBillingCountry
                                        ? 'Select State'
                                        : 'Select Country First'
                                    }
                                    error={!!errors.billingStateProvinceRegion}
                                    helperText={errors.billingStateProvinceRegion?.message}
                                    className={`w-full bg-white rounded-sm`}
                                    sx={{
                                      /* MUI Autocomplete specific styling */
                                      '& .MuiOutlinedInput-root': {
                                        paddingRight: '39px !important',
                                        height: '53px',
                                        '& fieldset': {
                                          borderColor: errors.billingStateProvinceRegion
                                            ? '#EF4444'
                                            : '#D1D5DB',
                                        },
                                        '&:hover fieldset': {
                                          borderColor: '#ffa206',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#ffa206',
                                          borderWidth: '2px',
                                        },
                                      },
                                      '& .MuiInputBase-input': {
                                        padding: '15.5px 14px !important',
                                      },
                                      '& .MuiFormHelperText-root.Mui-error': {
                                        color: '#ffa206',
                                      },
                                    }}
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                        <div className="mb-8 w-full md:w-2/4">
                          <label className="block text-gray-700 font-medium mb-2">
                            City / Town*
                          </label>
                          <Controller
                            name="billingCity"
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                options={billingCities}
                                autoHighlight
                                getOptionLabel={(option) => option.name}
                                value={selectedBillingCity}
                                onChange={(_, newValue) => {
                                  field.onChange(newValue?.name || '');
                                  setSelectedBillingCity(newValue);
                                }}
                                disabled={!selectedBillingState}
                                renderOption={(props, option) => (
                                  <Box component="li" {...props} key={`${option.name}-billing`}>
                                    {option.name}
                                  </Box>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder={
                                      selectedBillingState ? 'Select City' : 'Select State First'
                                    }
                                    error={!!errors.billingCity}
                                    helperText={errors.billingCity?.message}
                                    className={`w-full bg-white rounded-sm`}
                                    sx={{
                                      /* MUI Autocomplete specific styling */
                                      '& .MuiOutlinedInput-root': {
                                        paddingRight: '39px !important',
                                        height: '55px',
                                        '& fieldset': {
                                          borderColor: errors.billingCity ? '#EF4444' : '#D1D5DB',
                                        },
                                        '&:hover fieldset': {
                                          borderColor: '#ffa206',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#ffa206',
                                          borderWidth: '2px',
                                        },
                                      },
                                      '& .MuiInputBase-input': {
                                        padding: '15.5px 14px !important',
                                      },
                                      '& .MuiFormHelperText-root.Mui-error': {
                                        color: '#ffa206',
                                      },
                                    }}
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                        <div className="mb-8 w-full md:w-2/4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Postal Code / ZIP Code*
                          </label>
                          <input
                            type="text"
                            {...register('billingPostalCode')}
                            placeholder="Enter Postal or ZIP Code"
                            className={`w-full h-[54px] border bg-white ${errors.billingPostalCode ? 'border-red-500' : 'border-gray-300'
                              } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                          />
                          {errors.billingPostalCode && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.billingPostalCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Company Details for API */}
                  <h2 className="text-2xl font-semibold mb-4 mt-4">Company Details</h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">Company Email*</label>
                      <input
                        type="email"
                        {...register('companyEmailInput')}
                        placeholder="Enter Company Email"
                        className={`w-full h-[54px] border bg-white ${errors.companyEmailInput ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.companyEmailInput && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.companyEmailInput.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">Company Phone*</label>

                      <Controller
                        name="companyPhoneInput"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <PhoneInput
                            country="in"
                            value={value}
                            onChange={(phone) => {
                              const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
                              onChange(formattedPhone);
                            }}
                            placeholder="Enter Alternate Number"
                            specialLabel=""
                            inputStyle={{
                              width: '100%',
                              height: '53px',
                              borderRadius: '0.125rem',
                              borderColor: error ? '#EF4444' : '#D1D5DB',
                              backgroundColor: 'white',
                              fontSize: '1rem',
                              color: '#374151',
                            }}
                            buttonStyle={{
                              backgroundColor: 'transparent',
                              borderColor: error ? '#EF4444' : '#D1D5DB',
                              borderRadius: '0.125rem 0 0 0.125rem',
                            }}
                            dropdownStyle={{
                              backgroundColor: 'white',
                              color: '#374151',
                            }}
                            containerStyle={{
                              width: '100%',
                            }}
                            inputProps={{
                              onFocus: (e) => {
                                e.target.style.borderColor = '#ffa206';
                                e.target.style.boxShadow = '0 0 0 2px rgba(255, 140, 0, 1)';
                              },
                              onBlur: (e) => {
                                e.target.style.borderColor = error ? '#EF4444' : '#D1D5DB';
                                e.target.style.boxShadow = 'none';
                              },
                            }}
                          />
                        )}
                      />
                      {errors.companyPhoneInput && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.companyPhoneInput.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Company PAN Number*
                      </label>
                      <input
                        type="text"
                        {...register('companyPanNoInput')}
                        placeholder="Enter Company PAN"
                        maxLength={10}
                        className={`w-full h-[54px] border bg-white ${errors.companyPanNoInput ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.companyPanNoInput && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.companyPanNoInput.message}
                        </p>
                      )}
                      {panData && panData.valid && panData.name && (
                        <div className="mt-1 p-2 text-sm bg-green-50 border border-green-200 rounded-sm">
                          <span className="text-gray-500">Validated Name: </span>
                          <span className="text-green-700 font-medium">{panData.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Director Name(s)*
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="text"
                            {...register('directorNameInput')}
                            placeholder="Enter Director Name"
                            className={`w-full h-[54px] border bg-white ${errors.directorNameInput ? 'border-red-500' : 'border-gray-300'
                              } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                          />
                        </div>

                        {directors.map((director, index) => (
                          <div key={director.id} className="flex items-center gap-4">
                            <input
                              type="text"
                              {...register(`additionalDirectors.${index}.name` as const)}
                              placeholder={`Enter Director Name`}
                              className={`w-full h-[54px] border bg-white ${errors.additionalDirectors?.[index]?.name
                                ? 'border-red-500'
                                : 'border-gray-300'
                                } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                            />
                            <input
                              type="hidden"
                              {...register(`additionalDirectors.${index}.id` as const)}
                              value={director.id}
                            />
                            <button
                              type="button"
                              onClick={() => removeDirector(director.id)}
                              className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                              aria-label="Remove director"
                            >
                              <RemoveCircleOutlineIcon />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addDirector}
                          className="bg-[#ffa206] text-white px-4 py-2 rounded-full hover:scale-105 duration-300"
                        >
                          Add More Director
                        </button>
                      </div>
                      {errors.directorNameInput && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.directorNameInput.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tax Information */}
                  <h2 className="text-2xl font-semibold mb-4 mt-4">Tax Information</h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Do you have a GST Number?*
                      </label>
                      <Controller
                        name="hasGstNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            select
                            {...field}
                            defaultValue=""
                            error={!!errors.hasGstNumber}
                            helperText={errors.hasGstNumber?.message}
                            className="w-full bg-white"
                            variant="outlined"
                            size="small"
                            sx={{
                              /* MUI Autocomplete specific styling */
                              '& .MuiOutlinedInput-root': {
                                paddingRight: '39px !important',
                                height: '53px',
                                '& fieldset': {
                                  borderColor: errors.billingCountry ? '#EF4444' : '#D1D5DB',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#ffa206',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#ffa206',
                                  borderWidth: '2px',
                                },
                              },
                              '& .MuiInputBase-input': {
                                padding: '15.5px 14px !important',
                              },
                              '& .MuiFormHelperText-root.Mui-error': {
                                color: '#ffa206',
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select
                            </MenuItem>
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </div>
                    {watchedHasGstNumber === 'yes' && (
                      <div className="mb-4 w-full md:w-1/2">
                        <label className="block text-gray-700 font-medium mb-2">
                          If Yes, Please Specify your GST Number*
                        </label>
                        <input
                          type="text"
                          {...register('gstNumber')}
                          placeholder="Enter Your GST Number"
                          className={`w-full h-[54px] border bg-white ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'
                            } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                        />
                        {errors.gstNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.gstNumber.message}</p>
                        )}
                        {gstData && !gstData.valid && (
                          <p className="text-red-500 text-sm mt-1">
                            {gstData.message || 'Invalid GSTIN.'}
                          </p>
                        )}
                        {gstData && gstData.valid && gstData.tradeName && (
                          <div className="mt-1 p-2 text-sm bg-green-50 border border-green-200 rounded-sm">
                            <span className="text-gray-500">Validated Trade Name: </span>
                            <span className="text-green-700 font-medium">{gstData.tradeName}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Contact Details */}
            {currentStep.id === 2 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4">Contact Person Details</h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  {/* Row 1 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Contact Person First Name*
                      </label>
                      <input
                        type="text"
                        {...register('contactPersonFirstName')}
                        placeholder="Enter First Name"
                        className={`w-full h-[54px] border bg-white ${errors.contactPersonFirstName ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.contactPersonFirstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPersonFirstName.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Contact Person Last Name*
                      </label>
                      <input
                        type="text"
                        {...register('contactPersonLastName')}
                        placeholder="Enter Last Name"
                        className={`w-full h-[54px] border bg-white ${errors.contactPersonLastName ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.contactPersonLastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPersonLastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">Mobile Number*</label>
                      <Controller
                        name="mobileNumber"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <PhoneInput
                            country="in"
                            value={value}
                            onChange={(phone) => {
                              const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
                              onChange(formattedPhone);
                            }}
                            placeholder="Enter Mobile Number"
                            specialLabel=""
                            inputStyle={{
                              width: '100%',
                              height: '53px',
                              borderRadius: '0.125rem',
                              borderColor: error ? '#EF4444' : '#D1D5DB',
                              backgroundColor: 'white',
                              fontSize: '1rem',
                              color: '#374151',
                              outline: 'none',
                            }}
                            buttonStyle={{
                              backgroundColor: 'transparent',
                              borderColor: error ? '#EF4444' : '#D1D5DB',
                              borderRadius: '0.125rem 0 0 0.125rem',
                            }}
                            dropdownStyle={{
                              backgroundColor: 'white',
                              color: '#374151',
                            }}
                            containerStyle={{
                              width: '100%',
                            }}
                            inputProps={{
                              onFocus: (e) => {
                                e.target.style.borderColor = '#ffa206';
                                e.target.style.boxShadow = '0 0 0 2px rgba(255, 140, 0, 1)';
                              },
                              onBlur: (e) => {
                                e.target.style.borderColor = error ? '#EF4444' : '#D1D5DB';
                                e.target.style.boxShadow = 'none';
                              },
                            }}
                          />
                        )}
                      />
                      {errors.mobileNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Alternate Number (Optional)
                      </label>
                      <Controller
                        name="alternateMobileNumber"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <PhoneInput
                            country="in"
                            value={value}
                            onChange={(phone) => {
                              const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
                              onChange(formattedPhone);
                            }}
                            placeholder="Enter Alternate Number"
                            specialLabel=""
                            inputStyle={{
                              width: '100%',
                              height: '53px',
                              borderRadius: '0.125rem',
                              borderColor: error ? '#EF4444' : '#D1D5DB',
                              backgroundColor: 'white',
                              fontSize: '1rem',
                              color: '#374151',
                            }}
                            buttonStyle={{
                              backgroundColor: 'transparent',
                              borderColor: error ? '#EF4444' : '#D1D5DB',
                              borderRadius: '0.125rem 0 0 0.125rem',
                            }}
                            dropdownStyle={{
                              backgroundColor: 'white',
                              color: '#374151',
                            }}
                            containerStyle={{
                              width: '100%',
                            }}
                            inputProps={{
                              onFocus: (e) => {
                                e.target.style.borderColor = '#ffa206';
                                e.target.style.boxShadow = '0 0 0 2px rgba(255, 140, 0, 1)';
                              },
                              onBlur: (e) => {
                                e.target.style.borderColor = error ? '#EF4444' : '#D1D5DB';
                                e.target.style.boxShadow = 'none';
                              },
                            }}
                          />
                        )}
                      />
                      {errors.alternateMobileNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.alternateMobileNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">Email Address*</label>
                      <input
                        type="email"
                        {...register('emailAddress')}
                        placeholder="Enter Email Address"
                        className={`w-full h-[54px] border bg-white ${errors.emailAddress ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.emailAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.emailAddress.message}</p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Alternate Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        {...register('alternateEmailAddress')}
                        placeholder="Enter Alternate Email Address"
                        className={`w-full h-[54px] border bg-white ${errors.alternateEmailAddress ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.alternateEmailAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.alternateEmailAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Row 4 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Website (Optional)
                      </label>
                      <input
                        type="url"
                        {...register('website')}
                        placeholder="https://example.com"
                        className={`w-full h-[54px] border bg-white ${errors.website ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.website && (
                        <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Contact Person Designation*
                      </label>
                      <input
                        type="text"
                        {...register('contactPersonDesignation')}
                        placeholder="Enter Contact Person Designation"
                        className={`w-full h-[54px] border bg-white ${errors.contactPersonDesignation ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.contactPersonDesignation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPersonDesignation.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl font-semibold mb-4">Accounts/Finance Person Details</h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />

                  {/* Add checkbox here */}
                  <div className="mb-4 w-full">
                    <label className="flex items-center text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsContact}
                        onChange={(e) => setSameAsContact(e.target.checked)}
                        className="mr-2 h-5 w-5 accent-[#ffa206]"
                      />
                      <span className="font-medium">Same as Contact Person Details</span>
                    </label>
                  </div>

                  {/* Row 1 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Account Person First Name*
                      </label>
                      <input
                        type="text"
                        {...register('accountPersonFirstName')}
                        placeholder="Enter First Name"
                        disabled={sameAsContact}
                        className={`w-full h-[54px] border bg-white ${errors.accountPersonFirstName ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206] ${sameAsContact ? 'bg-gray-100' : ''
                          }`}
                      />
                      {errors.accountPersonFirstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.accountPersonFirstName.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Account Person Last Name*
                      </label>
                      <input
                        type="text"
                        {...register('accountPersonLastName')}
                        placeholder="Enter Last Name"
                        disabled={sameAsContact}
                        className={`w-full h-[54px] border bg-white ${errors.accountPersonLastName ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206] ${sameAsContact ? 'bg-gray-100' : ''
                          }`}
                      />
                      {errors.accountPersonLastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.accountPersonLastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">Mobile Number*</label>
                      <Controller
                        name="accountPersonMobileNumber"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <PhoneInput
                            country="in"
                            value={value}
                            onChange={(phone) => {
                              const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
                              onChange(formattedPhone);
                            }}
                            disabled={sameAsContact}
                            placeholder="Enter Mobile Number"
                            specialLabel=""
                            inputStyle={{
                              width: '100%',
                              height: '53px',
                              borderRadius: '0.125rem',
                              borderColor: error ? '#EF4444' : '#D1D5DB',
                              backgroundColor: sameAsContact ? '#F3F4F6' : 'white',
                              fontSize: '1rem',
                              color: '#374151',
                              outline: 'none',
                            }}
                            buttonStyle={{
                              backgroundColor: 'transparent',
                              borderColor: error ? '#EF4444' : '#D1D5DB',
                              borderRadius: '0.125rem 0 0 0.125rem',
                              opacity: sameAsContact ? 0.7 : 1,
                            }}
                            dropdownStyle={{
                              backgroundColor: 'white',
                              color: '#374151',
                            }}
                            containerStyle={{
                              width: '100%',
                            }}
                            inputProps={{
                              onFocus: (e) => {
                                if (!sameAsContact) {
                                  e.target.style.borderColor = '#ffa206';
                                  e.target.style.boxShadow = '0 0 0 2px rgba(255, 140, 0, 1)';
                                }
                              },
                              onBlur: (e) => {
                                e.target.style.borderColor = error ? '#EF4444' : '#D1D5DB';
                                e.target.style.boxShadow = 'none';
                              },
                            }}
                          />
                        )}
                      />
                      {errors.accountPersonMobileNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.accountPersonMobileNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">Email Address*</label>
                      <input
                        type="email"
                        {...register('accountPersonEmailAddress')}
                        placeholder="Enter Email Address"
                        disabled={sameAsContact}
                        className={`w-full h-[54px] border bg-white ${errors.accountPersonEmailAddress ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206] ${sameAsContact ? 'bg-gray-100' : ''
                          }`}
                      />
                      {errors.accountPersonEmailAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.accountPersonEmailAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Step 3: Activities */}
            {currentStep.id === 3 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4">Activities</h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-10">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Are you booking via an association?*
                      </label>
                      <Controller
                        name="bookingViaAssociation"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            select
                            {...field}
                            defaultValue=""
                            error={!!errors.bookingViaAssociation}
                            helperText={errors.bookingViaAssociation?.message}
                            className="w-full bg-white"
                            variant="outlined"
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                paddingRight: '39px !important',
                                height: '53px',
                                '& fieldset': {
                                  borderColor: errors.bookingViaAssociation ? '#EF4444' : '#D1D5DB',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#ffa206',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#ffa206',
                                  borderWidth: '2px',
                                },
                              },
                              '& .MuiInputBase-input': {
                                padding: '15.5px 14px !important',
                              },
                              '& .MuiFormHelperText-root.Mui-error': {
                                color: '#ffa206',
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select
                            </MenuItem>
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </TextField>
                        )}
                      />
                      {errors.bookingViaAssociation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bookingViaAssociation.message}
                        </p>
                      )}
                    </div>

                    {watchedBookingViaAssociation === 'yes' && (
                      <div className="mb-4 w-full md:w-1/2">
                        <label className="block text-gray-700 font-medium mb-2">
                          Enter association Number*
                        </label>
                        <input
                          type="number"
                          {...register('associationName')}
                          placeholder="Enter Association Number"
                          className={`w-full h-[54px] border bg-white ${errors.associationName ? 'border-red-500' : 'border-gray-300'
                            } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                        />
                        {errors.associationName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.associationName.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-10">
                    <div className="mb-4 w-full md:w-1/2 mt-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Are you registered with MSME?*
                      </label>
                      <Controller
                        name="registeredWithMsme"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            select
                            {...field}
                            defaultValue=""
                            error={!!errors.registeredWithMsme}
                            helperText={errors.registeredWithMsme?.message}
                            className="w-full bg-white"
                            variant="outlined"
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                paddingRight: '39px !important',
                                height: '53px',
                                '& fieldset': {
                                  borderColor: errors.registeredWithMsme ? '#EF4444' : '#D1D5DB',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#ffa206',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#ffa206',
                                  borderWidth: '2px',
                                },
                              },
                              '& .MuiInputBase-input': {
                                padding: '15.5px 14px !important',
                              },
                              '& .MuiFormHelperText-root.Mui-error': {
                                color: '#ffa206',
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select
                            </MenuItem>
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </TextField>
                        )}
                      />

                      {errors.registeredWithMsme && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.registeredWithMsme.message}
                        </p>
                      )}
                    </div>

                    {watchedRegisteredWithMsme === 'yes' && (
                      <div className="mb-4 w-full md:w-1/2 mt-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          Enter Udyog Aadhaar Number*
                        </label>
                        <input
                          type="text"
                          {...register('msmeNumber')}
                          placeholder="Enter Udyog Aadhaar Number"
                          className={`w-full h-[54px] border bg-white ${errors.msmeNumber ? 'border-red-500' : 'border-gray-300'
                            } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                        />
                        {errors.msmeNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.msmeNumber.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-10">
                    <div className="mb-4 w-full md:w-1/2 mt-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Have you participated in an earlier Edition?*
                      </label>
                      <Controller
                        name="participatedEarlier"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            select
                            {...field}
                            defaultValue=""
                            error={!!errors.participatedEarlier}
                            helperText={errors.participatedEarlier?.message}
                            className="w-full bg-white"
                            variant="outlined"
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                paddingRight: '39px !important',
                                height: '53px',
                                '& fieldset': {
                                  borderColor: errors.participatedEarlier ? '#EF4444' : '#D1D5DB',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#ffa206',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#ffa206',
                                  borderWidth: '2px',
                                },
                              },
                              '& .MuiInputBase-input': {
                                padding: '15.5px 14px !important',
                              },
                              '& .MuiFormHelperText-root.Mui-error': {
                                color: '#ffa206',
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select
                            </MenuItem>
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </TextField>
                        )}
                      />
                      {errors.participatedEarlier && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.participatedEarlier.message}
                        </p>
                      )}
                    </div>

                    {watch('participatedEarlier') === 'yes' && (
                      <div className="mb-4 w-full md:w-1/2 mt-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          Select your participation year*
                        </label>
                        <Controller
                          name="participationYear"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              select
                              {...field}
                              defaultValue=""
                              error={!!errors.participationYear}
                              helperText={errors.participationYear?.message}
                              className="w-full bg-white"
                              variant="outlined"
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  paddingRight: '39px !important',
                                  height: '53px',
                                  '& fieldset': {
                                    borderColor: errors.participationYear ? '#EF4444' : '#D1D5DB',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#ffa206',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#ffa206',
                                    borderWidth: '2px',
                                  },
                                },
                                '& .MuiInputBase-input': {
                                  padding: '15.5px 14px !important',
                                },
                                '& .MuiFormHelperText-root.Mui-error': {
                                  color: '#ffa206',
                                },
                              }}
                            >
                              <MenuItem value="" disabled>
                                Select Year
                              </MenuItem>
                              <MenuItem value="2024">2024</MenuItem>
                              <MenuItem value="2023">2023</MenuItem>
                              <MenuItem value="both">Both</MenuItem>
                            </TextField>
                          )}
                        />
                        {errors.participationYear && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.participationYear.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {/* Step 4: Objectives & Preferences */}
            {currentStep.id === 4 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4">Objectives & Preferences</h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  <div className="mb-4 w-full md:w-2/3">
                    <label className="block text-gray-700 font-medium mb-2">
                      Which department category do you belong to?*
                    </label>
                    <Controller
                      name="departmentCategory"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          options={exhibitorCategories}
                          value={value || null}
                          onChange={(_, newValue) => onChange(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search and select department"
                              error={!!errors.departmentCategory}
                              helperText={errors.departmentCategory?.message}
                              className={`w-full bg-white rounded-sm`}
                              sx={{
                                /* MUI Autocomplete specific styling */
                                '& .MuiOutlinedInput-root': {
                                  paddingRight: '39px !important',
                                  height: '53px',
                                  '& fieldset': {
                                    borderColor: errors.departmentCategory ? '#EF4444' : '#D1D5DB',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#ffa206',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#ffa206',
                                    borderWidth: '2px',
                                  },
                                },
                                '& .MuiInputBase-input': {
                                  padding: '15.5px 14px !important',
                                },
                                '& .MuiFormHelperText-root.Mui-error': {
                                  color: '#ffa206',
                                },
                              }}
                            />
                          )}
                          ListboxProps={{ style: { maxHeight: '200px' } }}
                        />
                      )}
                    />
                  </div>

                  {watch('departmentCategory') === 'Others (Please Specify)' && (
                    <div className="mb-4 w-full md:w-2/3">
                      <label className="block text-gray-700 font-medium mb-2">
                        Please specify your department category
                      </label>
                      <input
                        type="text"
                        {...register('otherDepartmentCategory')}
                        placeholder="Enter your department category"
                        className={`w-full h-[54px] border bg-white ${errors.otherDepartmentCategory ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.otherDepartmentCategory && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.otherDepartmentCategory.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mb-4 w-full md:w-2/3">
                    <label className="block text-gray-700 font-medium mb-2">
                      Specify your Product Category*
                    </label>
                    <Controller
                      name="productCategory"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          options={productCategories}
                          value={value || null}
                          onChange={(_, newValue) => onChange(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search and select product category"
                              error={!!errors.productCategory}
                              helperText={errors.productCategory?.message}
                              className={`w-full bg-white rounded-sm`}
                              sx={{
                                /* MUI Autocomplete specific styling */
                                '& .MuiOutlinedInput-root': {
                                  paddingRight: '39px !important',
                                  height: '53px',
                                  '& fieldset': {
                                    borderColor: errors.productCategory ? '#EF4444' : '#D1D5DB',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#ffa206',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#ffa206',
                                    borderWidth: '2px',
                                  },
                                },
                                '& .MuiInputBase-input': {
                                  padding: '15.5px 14px !important',
                                },
                                '& .MuiFormHelperText-root.Mui-error': {
                                  color: '#ffa206',
                                },
                              }}
                            />
                          )}
                          ListboxProps={{ style: { maxHeight: '200px' } }}
                        />
                      )}
                    />
                  </div>

                  {watch('productCategory') === 'Others (Please Specify)' && (
                    <div className="mb-4 w-full md:w-2/3">
                      <label className="block text-gray-700 font-medium mb-2">
                        Please specify your product category
                      </label>
                      <input
                        type="text"
                        {...register('otherProductCategory')}
                        placeholder="Enter your product category"
                        className={`w-full h-[54px] border bg-white ${errors.otherProductCategory ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      />
                      {errors.otherProductCategory && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.otherProductCategory.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Are you interested in sponsorship and branding opportunities at the show?*
                    </label>
                    <div className="flex items-center gap-4">
                      {['yes', 'no', 'maybe'].map((value) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="radio"
                            {...register('interestedInSponsorship')}
                            value={value}
                            className="mr-2 h-5 w-5 accent-[#ffa206]"
                          />
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </label>
                      ))}
                    </div>
                    {errors.interestedInSponsorship && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.interestedInSponsorship.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      What are your main objectives for exhibiting at IFEX 2025?* (Select all that
                      apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                      {' '}
                      {/* Adjusted gap */}
                      {[
                        { value: 'generate_leads', label: 'Generate Leads' },
                        {
                          value: 'launch_new_product',
                          label: 'Launch New Product',
                        },
                        {
                          value: 'brand_visibility',
                          label: 'Brand Visibility',
                        },
                        { value: 'market_research', label: 'Market Research' },
                        {
                          value: 'explore_partnerships',
                          label: 'Explore Partnership Opportunities',
                        },
                        {
                          value: 'networking',
                          label: 'Network with Industry Professionals',
                        },
                      ].map((obj) => (
                        <label key={obj.value} className="flex items-start">
                          {' '}
                          {/* Changed to items-start */}
                          <input
                            type="checkbox"
                            {...register('mainObjectives')}
                            value={obj.value}
                            className="mr-2 mt-1 h-5 w-5 accent-[#ffa206] flex-shrink-0" // Added mt-1 for alignment & flex-shrink-0
                          />
                          <span>{obj.label}</span>{' '}
                          {/* Wrapped label text in span for better control if needed */}
                        </label>
                      ))}
                    </div>
                    {errors.mainObjectives && (
                      <p className="text-red-500 text-sm mt-1">{errors.mainObjectives.message}</p>
                    )}
                  </div>
                  <div className="mb-4 w-full md:w-2/3">
                    <label className="block text-gray-500 font-normal mb-2">
                      If other, please specify:
                    </label>
                    <input
                      type="text"
                      {...register('otherObjective')}
                      placeholder="Input Text"
                      className="w-full h-[54px] border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]"
                    />
                  </div>
                </div>
              </>
            )}
            {/* Step 5: Booth Type */}
            {currentStep.id === 5 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4">Booth Type</h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  <div className="w-full my-6">
                    <label className="block text-gray-700 font-medium mb-4">
                      Which type of booth do you prefer?*
                    </label>
                    <div className="p-1">
                      <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="lg:w-full border-collapse">
                        <thead className="overflow-x-auto">
                          <tr>
                            <th className="text-left py-2 px-4 text-gray-500 font-normal">
                              Booth&nbsp;Type
                            </th>
                            <th className="text-left py-2 px-4 text-gray-500 font-normal">
                              Rate&nbsp;(INR/sqm)
                            </th>
                            <th className="text-left py-2 px-4 text-gray-500 font-normal">
                              Min.&nbsp;Area
                            </th>
                            <th className="text-left py-2 px-4 text-gray-500 font-normal">
                              What's&nbsp;Included
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b-1 border-gray-300">
                            <td className="py-4 px-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  {...register('boothTypePreference')}
                                  value="pre_fitted"
                                  className="mr-2 h-5 w-5 accent-[#ffa206]"
                                />
                                Pre-fitted
                              </label>
                            </td>
                            <td className="py-4 px-4">₹7000</td>
                            <td className="py-4 px-4">12 sqm</td>
                            <td className="py-4 px-4">
                              Wall panels, fascia with company name, carpet, 1 electricity socket, 1
                              reception counter, 3 chairs, waste basket, 4 spotlights
                            </td>
                          </tr>
                          <tr className="border-b-1 border-gray-300">
                            <td className="py-4 px-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  {...register('boothTypePreference')}
                                  value="space_only"
                                  className="mr-2 h-5 w-5 accent-[#ffa206]"
                                />
                                Space&nbsp;Only
                              </label>
                            </td>
                            <td className="py-4 px-4">₹6500</td>
                            <td className="py-4 px-4">36 sqm</td>
                            <td className="py-4 px-4">
                              Bare space only. Electricity @ ₹2250/kw (extra). Setup at your own
                              cost.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {errors.boothTypePreference && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.boothTypePreference.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-4">
                      Note: All rates are exclusive of 18% GST.
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-4 w-full gap-4">
                    <div className="w-full md:w-2/3">
                      <label className="block text-gray-700 font-medium mb-2">
                        Total Area Required? (sqm)*
                      </label>
                      {watchedBoothTypePreference === 'pre_fitted' ? (
                        <Controller
                          name="totalAreaRequired"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            const minArea = 12;
                            const options = Array.from(
                              { length: (240 - minArea) / 3 + 1 }, // Assuming max area is 240, adjust if needed
                              (_, i) => minArea + i * 3
                            ).filter((area) => area <= 240); // Ensure options don't exceed max

                            return (
                              <Autocomplete
                                options={options.map(String)} // Ensure options are strings
                                freeSolo // Allow user to type custom values
                                value={value ? String(value) : null}
                                onChange={(_, newValue) =>
                                  onChange(newValue ? String(newValue) : '')
                                }
                                onInputChange={(_, newInputValue) => {
                                  // Allow direct typing, validation will handle if it's not a multiple of 3 or below min
                                  onChange(newInputValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    type="text" // Changed to text to allow freeSolo better
                                    placeholder="Select or type area (e.g., 12, 15)"
                                    error={!!errors.totalAreaRequired}
                                    // helperText={errors.totalAreaRequired?.message} // Zod refine will show this
                                    className={`w-full bg-white rounded-sm`}
                                    sx={{
                                      /* MUI Autocomplete specific styling */
                                      '& .MuiOutlinedInput-root': {
                                        paddingRight: '39px !important',
                                        height: '53px',
                                        '& fieldset': {
                                          borderColor: errors.totalAreaRequired
                                            ? '#EF4444'
                                            : '#D1D5DB',
                                        },
                                        '&:hover fieldset': {
                                          borderColor: '#ffa206',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#ffa206',
                                          borderWidth: '2px',
                                        },
                                      },
                                      '& .MuiInputBase-input': {
                                        padding: '15.5px 14px !important',
                                      },
                                      '& .MuiFormHelperText-root.Mui-error': {
                                        color: '#ffa206',
                                      },
                                    }}
                                  />
                                )}
                                ListboxProps={{ style: { maxHeight: '200px' } }}
                              />
                            );
                          }}
                        />
                      ) : (
                        <input
                          type="number"
                          {...register('totalAreaRequired')}
                          placeholder="Enter area in sqm"
                          min={36}
                          // max="240"
                          step="3"
                          className={`w-full h-[54px] border bg-white ${errors.totalAreaRequired ? 'border-red-500' : 'border-gray-300'
                            } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                        />
                      )}

                      {errors.totalAreaRequired && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.totalAreaRequired.message}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {watchedBoothTypePreference === 'pre_fitted'
                          ? 'Area must be a multiple of 3 and minimum 12 sqm'
                          : 'Area must be a multiple of 3 and minimum 36 sqm'}
                      </p>
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="block text-gray-700 font-medium mb-2">
                        Estimated Total Cost (INR)
                      </label>
                      <input
                        type="text"
                        value={`₹${totalCost.toLocaleString()}`}
                        readOnly
                        className="w-full h-[54px] border bg-gray-100 border-gray-300 rounded-sm px-4 py-2 focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">(Excludes 18% GST)</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-4 w-full gap-4">
                    <div className="w-full md:w-2/4">
                      <label className="block text-gray-700 font-medium mb-2">
                        TDS Percentage*
                      </label>
                      <select
                        {...register('tds')}
                        defaultValue=""
                        className={`w-full h-[54px] border bg-white ${errors.tds ? 'border-red-500' : 'border-gray-300'
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                      >
                        <option value="" disabled>
                          Select TDS
                        </option>
                        <option value="nil">Nil</option>
                        <option value="2">2%</option>
                        <option value="10">10%</option>
                      </select>
                      {errors.tds && (
                        <p className="text-red-500 text-sm mt-1">{errors.tds.message}</p>
                      )}
                    </div>

                    {watch('tds') && watch('tds') !== 'nil' && (
                      <div className="w-full md:w-2/4">
                        <label className="block text-gray-700 font-medium mb-2">TAN Number*</label>
                        <input
                          type="text"
                          {...register('tanNumber')}
                          placeholder="Enter TAN Number"
                          maxLength={10}
                          className={`w-full h-[54px] border bg-white ${errors.tanNumber ? 'border-red-500' : 'border-gray-300'
                            } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                        />
                        {errors.tanNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.tanNumber.message}</p>
                        )}
                        {/* {tanData && tanData.valid && tanData.name && (
                          <div className="mt-1 p-2 text-sm bg-green-50 border border-green-200 rounded-sm">
                            <span className="text-gray-500">
                              Validated Name:{" "}
                            </span>
                            <span className="text-green-700 font-medium">
                              {tanData.name}
                            </span>
                          </div>
                        )} */}
                      </div>
                    )}
                  </div>

                  {/* <div className="mt-4">
                    <h3 className="text-gray-500 font-medium mb-2">
                      Important Guidelines
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-500">
                      <li>
                        Requests for open sides are subject to availability &
                        feasibility.
                      </li>
                      <li>
                        Final booth location is indicative and may change based
                        on safety, commercial, or technical reasons.
                      </li>
                    </ul>
                  </div> */}
                  <div className="mt-4">
                    <h3 className="text-gray-500 font-medium mb-2">
                      Terms & Conditions / General Regulations
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-500">
                      <li>
                        Please read the{' '}
                        <a
                          href="https://upinternationaltradeshow.com/wp-content/uploads/2025/05/IFEX-2025-General-Rules-and-Regulations.pdf" // Update this to the path of your PDF file
                          target="_blank" // Opens the PDF in a new tab
                          rel="noopener noreferrer" // Adds security for external links
                          className="text-[#ffa206] underline"
                        >
                          Terms and Conditions
                        </a>{' '}
                        carefully before proceeding with the registration.
                      </li>
                      <li>Sign below to confirm your acceptance of the terms and conditions.</li>
                    </ul>
                    <div className="mt-4">
                      {/* <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                        Signature Pad
                      </h1> */}

                      {/* Signature Canvas Area */}
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          {isSaved ? 'Signature Preview:' : 'Please Sign Below*'}
                        </label>

                        <div
                          className={`w-full h-[200px] border border-gray-300 rounded-md overflow-hidden ${!isSaved ? '' : 'fixed top-[9999] left-[9999]'
                            }`}
                        >
                          <SignatureCanvas
                            penColor="black"
                            ref={signatureRef}
                            canvasProps={{
                              width: 500,
                              height: 200,
                              className: 'sigCanvas bg-white cursor-crosshair w-full h-full',
                            }}
                            onEnd={handleEndStroke} // Called when a stroke is finished
                            // onBegin={handleBeginStroke} // Called when a stroke begins
                            backgroundColor="rgb(255,255,255)" // Explicit white background
                          />
                        </div>
                        <div className={`${!isSaved ? 'hidden' : ''} `}>
                          <img
                            src={signatureUrl ?? undefined}
                            alt="User's Signature"
                            className={`border border-gray-300 rounded-md max-w-full h-auto`}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2">
                        <button
                          type="button"
                          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md border border-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 cursor-pointer"
                          onClick={clearSignature}
                        >
                          Clear Signature
                        </button>
                        <button
                          type="button"
                          disabled={isCanvasEmpty || !signatureUrl || isSaved} // Disable if canvas is empty or no URL yet
                          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-white hover:text-orange-600 cursor-pointer disabled:opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed transition-colors duration-300 hover:border hover:border-orange-600"
                          onClick={saveSignature}
                        >
                          Save Signature
                        </button>
                      </div>

                      {/* Terms and Conditions Text */}
                      <p className="text-xs text-gray-500 mt-6 text-center">
                        By signing, you agree to the terms and conditions.
                      </p>

                      {/* Display Signature (Optional) */}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* API Message Display */}
            {apiMessage.text && (
              <div
                className={`mt-4 p-3 rounded-md text-center ${apiMessage.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : apiMessage.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                  }`}
              >
                {apiMessage.text}
              </div>
            )}

            <div className="flex gap-2 justify-between w-full mt-auto pt-6">
              {currentStep.id > 1 && !isSubmitting && (
                <button
                  type="button"
                  className="bg-[#ffa206] self-start w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 duration-300 disabled:opacity-50 transition-all ease-out"
                  onClick={handleGoToPrevStep}
                  disabled={isSubmitting}
                >
                  Back
                </button>
              )}

              {/* Next or Submit Button */}
              {currentStep.id < 5 ? (
                !isSubmitting && (
                  // <div className="flex justify-end w-full mt-auto pt-6">
                  <button
                    type="button"
                    className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-out"
                    onClick={handleGoToNextStep}
                    disabled={isSubmitting || !isEmailUnique || verificationError}
                  >
                    Next
                  </button>
                  // </div>
                )
              ) : (
                <div className="relative w-full lg:w-auto ml-auto">
                  {!isSubmitting ? (
                    <button
                      type="submit"
                      className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-out"
                      disabled={isSubmitting || !allowCheckout}
                    >
                      {isSubmitting ? 'Submitting...' : 'Checkout'}
                    </button>
                  ) : (
                    <div className="flex ml-auto items-center justify-end gap-3 h-14 text-base rounded-full px-6 py-2">
                      <span className="text-black font-semibold">Securing your spot</span>
                      <CircularProgress
                        size={34}
                        thickness={5}
                        sx={{
                          color: '#ffa206',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          },
                          width: '40px !important',
                          height: '40px !important',
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="performaInvoice relative overflow-hidden">
        <div
          ref={invoiceRef}
          className="absolute -left-[10000rem] w-[210mm] h-[297mm] mx-auto bg-white p-4 text-xs"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="h-16 w-32">
              {/* Logo placeholder */}
              <img
                src="/performa_logo.png"
                alt="UP International Trade Show Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-right">
              <h1 className="text-base font-bold">UP International Trade Show 2025</h1>
              <p className="text-sm pt-1">India Exposition Mart LTD</p>
            </div>
          </div>

          {/* Address */}
          <div className="text-right text-[11px] mb-1">
            PLOT NO.- 25-26, 27-28, KNOWLEDGE PARK - II, DISTRICT GAUTAM BUDHA NAGAR, GREATER NOIDA
            - 201306, UTTAR PRADESH, INDIA
          </div>
          <div className="text-right text-[11px] mb-1">
            AMIT SHARMA || +91-9667391298 || ACCOUNT@INDIAEXPOCENTRE.COM
          </div>
          <div className="text-right text-[11px] mb-6">
            PAN NO.: AAACI5873M | GSTIN: 09AAACI5873M1ZR
          </div>

          <hr className="border-black mb-2" />

          {/* Title */}
          <div className="text-center mb-5">
            <h2 className="text-lg font-bold">PROFORMA INVOICE</h2>
          </div>

          <hr className="border-black mb-3" />

          {/* Exhibitor Details */}
          <div className="mb-2">
            <h3 className="text-base font-bold mb-3">Exhibitor Details</h3>

            <div className="grid grid-cols-2 gap-x-26 text-sm mb-4">
              <div>
                <p>
                  <span>Name :</span> {getValues().nameOfExhibitor}
                </p>
              </div>
              <div>
                <p>
                  <span>Proforma No :</span> UP2025/SPC/ES/{exhibitorCount}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-26 text-sm mb-4">
              <div>
                <p>
                  <span>Address :</span> {getValues().billingAddressLine1},{' '}
                  {getValues().billingCity}, {getValues().billingStateProvinceRegion},{' '}
                  {getValues().billingCountry}, {getValues().billingPostalCode}
                </p>
              </div>
              <div>
                <p>
                  <span>Proforma Date :</span>{' '}
                  {new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-26 text-sm mb-4">
              <div>
                <p>
                  <span>City :</span> {getValues().billingCity}
                </p>
              </div>
              <div>
                <p>
                  <span>SAC/HSNCode :</span> 998596
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-26 text-sm mb-4">
              <div>
                <p>
                  <span>Pincode :</span> {getValues().billingPostalCode}
                </p>
              </div>
              <div>
                <p>
                  <span>StallType :</span>{' '}
                  {getValues().boothTypePreference === 'pre_fitted' ? 'Pre Fitted' : 'Space Only'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-26 text-sm mb-4">
              <div>
                <p>
                  <span>State : </span>
                  {getValues().billingStateProvinceRegion}
                </p>
              </div>
              <div>
                <p>
                  <span>Email :</span> {getValues().companyEmailInput}
                </p>
              </div>
            </div>

            <div className="text-sm">
              <p>
                <span>GST NO :</span> {getValues().gstNumber}
              </p>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="my-6 overflow-auto">
            <table className="w-full border-collapse text-xs bg-white">
              <thead>
                <tr className="">
                  <th className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-left text-xs font-bold">
                    Description
                  </th>
                  <th className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold">
                    Rate
                  </th>
                  <th className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold">
                    Total Area
                  </th>
                  <th className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold">
                    Taxable Value
                  </th>
                  <th
                    className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold"
                    colSpan={2}
                  >
                    CGST
                  </th>
                  <th
                    className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold"
                    colSpan={2}
                  >
                    SGST
                  </th>
                  <th
                    className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold"
                    colSpan={2}
                  >
                    IGST
                  </th>
                  <th className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold">
                    Total Tax
                  </th>
                  <th className="border-t border-b border-black px-1 pt-2 pb-4 text-center text-xs font-bold">
                    Total
                  </th>
                </tr>

                <tr className="text-xs">
                  <th className="border-b border-black px-1 py-1 border-r"></th>
                  <th className="border-b border-black px-1 py-1 border-r"></th>
                  <th className="border-b border-black px-1 py-1 border-r"></th>
                  <th className="border-b border-black px-1 py-1 border-r"></th>
                  <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                    Rate
                  </th>
                  <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                    Amt
                  </th>
                  <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                    Rate
                  </th>
                  <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                    Amt
                  </th>
                  <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                    Rate
                  </th>
                  <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                    Amt
                  </th>
                  <th className="font-bold text-xs border-b border-black px-1 pt-1 pb-3 border-r">
                    (INR)
                  </th>
                  <th className="font-bold text-xs border-b border-black px-1 pt-1 pb-3">(INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-xs">
                  <td className="border-b border-black px-1 pt-2 pb-4 border-r">Space Rent</td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {getValues().boothTypePreference === 'pre_fitted' ? '7000' : '6500'}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {getValues().totalAreaRequired}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {totalAmount.toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {getValues().billingStateProvinceRegion === 'Uttar Pradesh' ? '9.0%' : '0.0'}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {cgstAmount.toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {getValues().billingStateProvinceRegion === 'Uttar Pradesh' ? '9.0%' : '0.0'}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {sgstAmount.toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {getValues().billingStateProvinceRegion !== 'Uttar Pradesh' ? '18.0%' : '0.0'}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {igstAmount.toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {(cgstAmount + sgstAmount + igstAmount).toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center">
                    {totalAfterTax.toFixed(2)}
                  </td>
                </tr>

                <tr className="text-xs">
                  <td className="border-b border-black px-1 pt-2 pb-4">Total</td>
                  <td className="border-b border-black px-1 pt-2 pb-4 "></td>
                  <td className="border-b border-black px-1 pt-2 pb-4 "></td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center">
                    {totalAmount.toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 border-r"></td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {cgstAmount.toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 border-r"></td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {sgstAmount.toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 border-r"></td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {igstAmount.toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                    {(cgstAmount + sgstAmount + igstAmount).toFixed(2)}
                  </td>
                  <td className="border-b border-black px-1 pt-2 pb-4 text-center">
                    {totalAfterTax.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mb-6">
            <div className="flex-1 pr-4">
              <div className="text-xs">
                <p className="font-medium">Total Amount After Tax In Words:</p>
                <p>{numberToWords(Math.round(totalAfterTax))}</p>
              </div>
            </div>

            <div className="w-60">
              <div className="text-xs space-y-1">
                <div className="flex justify-between border-b pb-4">
                  <span>Total Amount Before Tax</span>
                  <span>{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span>Add CGST</span>
                  <span>{cgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span>Add SGST</span>
                  <span>{sgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span>Add IGST</span>
                  <span>{igstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-black pt-3">
                  <span>Total Amount After Tax</span>
                  <span>{totalAfterTax.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-start mb-6">
            <p className="text-xs">For UP International Trade Show 2025</p>
          </div>

          <div className="flex justify-start gap-28 items-end mt-8">
            <div className="text-center">
              <div className="mb-2">
                <img src="/signature.png" alt="Signature" className="h-16 mx-auto" />
              </div>
              <div className="pt-1">
                <p className="font-bold text-sm">AUTHORIZED SIGNATURE</p>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-2 h-12"></div>
              <div className="pt-1">
                <p className="font-bold text-sm">STAMP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExhibitorRegistration;
