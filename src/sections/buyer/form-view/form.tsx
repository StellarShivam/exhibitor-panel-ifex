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

import { buyerRegistrationSchema, stepFields } from './schema';

import { Box, Typography } from '@mui/material';

import FormProvider from 'src/sections/form-view/hook-form/form-provider';
import { useRef, useState, SetStateAction, useEffect } from 'react';
import { BuyerDetails } from './sub-forms/BuyerDetails';
// import { FormNavigationButtons } from "src/sections/space-booking/form-view/ExhibitorRegistration/FormNavigationButtons";
import {
  getProductGroups,
  ProductGroup,
  // registerBuyer,
  getCouncils,
  Council,
} from 'src/sections/form-view/apis/exhibitior-reg';
import { useBuyerForm } from 'src/api/form';

// ----------------------------------------------------------------------

// Default form values
const defaultValues = {
  councilId: '',
  otherCouncilName: '',
  participationType: '',
  email: '',
  companyName: '',
  prefix: '',
  firstName: '',
  middleName: '',
  lastName: '',
  designation: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  mobileNumber: '',
  whatsAppSame: false,
  whatsappMobileNumber: '',
  website: '',
  landlineNumber: '',
  isFirstVisiting: '',
  visitedYear: [],
  sourceOfRegistration: [],
  natureOfBusiness: [],
  otherNatureOfBusiness: '',
  turnOver2223: '',
  turnOver2324: '',
  turnOver2425: '',
  productGroups: [],
  socialMediaComms: [],
  buyerCompanyName: '',
  buyerCompanyCountries: [],
  gstNumber: '',
  isOnlineSeller: '',
  onlineSellerAccounts: [],
  otherOnlineSellerPlatform: '',
  passportNumber: '',
  dateOfIssueForPassport: "",
  dateOfExpiryForPassport: "",
  passportFrontUrl: '',
  passportBackUrl: '',

  profilePhotoUrl: '',
  businessCardUrl: '',

  isImportIndia: '',
  importValue: '',

  linkedInUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  pinterestUrl: '',
  youtubeUrl: '',
};

// ----------------------------------------------------------------------

interface VerificationState {
  status: 'idle' | 'checking' | 'available' | 'registered' | 'error' | 'verifying' | 'success';
  message?: string;
  name?: string;
  error?: string;
  verifiedNumber?: string;
}

export default function BuyerRegistrationForm() {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [councils, setCouncils] = useState<Council[]>([]);
  const [emailVerification, setEmailVerification] = useState<VerificationState>({ status: 'idle' });
  const [mobileVerification, setMobileVerification] = useState<VerificationState>({
    status: 'idle',
  });
  const [gstVerification, setGstVerification] = useState<VerificationState>({
    status: 'idle',
  });

  const { exhibitorForm, exhibitorFormLoading, reFetchExhibitorForm } = useBuyerForm();

  const formData = exhibitorForm?.formData
  const buyerType = formData?.participationType;
  const detransformProductGroups = (apiProductGroups: any[]) => {
    if (!apiProductGroups || !Array.isArray(apiProductGroups)) {
      return [];
    }

    return apiProductGroups.map((group) => ({
      title: group.productGroupName || '',
      values: group.productCategories || [],
    }));
  };

  const methods = useForm({
    resolver: yupResolver(buyerRegistrationSchema),
    defaultValues,
    values: {
      ...defaultValues,
      ...formData,
      isFirstVisiting:
        formData?.isFirstVisiting !== undefined ? (formData?.isFirstVisiting ? 'Yes' : 'No') : '',
      isImportIndia:
        formData?.isImportIndia !== undefined ? (formData?.isImportIndia ? 'Yes' : 'No') : '',
      productGroups: formData?.productGroups
        ? detransformProductGroups(formData.productGroups)
        : [],
      isOnlineSeller:
        formData?.isOnlineSeller !== undefined ? (formData?.isOnlineSeller ? 'Yes' : 'No') : '',
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
  } = methods;

  console.log(errors);

  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const councils = await getCouncils();
        console.log('Councils:', councils);
        setCouncils(
          (councils || [])
            .filter((council) => council.id !== 14 && council.id !== 15 && council.id !== 16)
            .reverse()
        );
      } catch (error) {
        console.error('Error fetching councils:', error);
      }
    };

    fetchCouncils();
  }, []);

  const scrollToFirstError = (errorFields?: Record<string, unknown>) => {
    const errorObject = errorFields || errors;
    const firstErrorField = Object.keys(errorObject)[0];

    if (firstErrorField) {
      setTimeout(() => {
        let element = document.getElementById(firstErrorField);

        if (!element) {
          element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
        }

        if (!element) {
          const fieldset = document.querySelector(`fieldset[name="${firstErrorField}"]`);
          if (fieldset) {
            element = (fieldset.querySelector('input, select, textarea') ||
              fieldset) as HTMLElement;
          }
        }

        if (!element) {
          const radioGroup = document.querySelector(
            `input[type="radio"][name="${firstErrorField}"]`
          );
          if (radioGroup) {
            element = radioGroup as HTMLElement;
          }
        }

        if (!element) {
          const checkboxInputs = document.querySelectorAll(
            `input[type="checkbox"][name="${firstErrorField}"]`
          );
          if (checkboxInputs.length) {
            let checkboxContainer = (checkboxInputs[0] as HTMLElement).closest(
              'fieldset, .MuiFormGroup-root, .MuiFormControl-root, div[class*="Box"]'
            );
            if (checkboxContainer) {
              element = checkboxContainer as HTMLElement;
            } else {
              element = checkboxInputs[0] as HTMLElement;
            }
          }
        }

        if (!element) {
          const label = document.querySelector(`label[for="${firstErrorField}"]`);
          if (label) {
            const container = label.closest('div[class*="Box"], fieldset, .MuiFormControl-root');
            if (container) {
              element = container as HTMLElement;
            } else {
              element = label as HTMLElement;
            }
          }
        }

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          // if (
          //   element instanceof HTMLInputElement ||
          //   element instanceof HTMLSelectElement ||
          //   element instanceof HTMLTextAreaElement
          // ) {
          //   setTimeout(() => element.focus(), 100);
          // }
        }
      }, 100);
    }
  };

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });

  const onSubmit = handleSubmit(
    async (data) => {
      setIsSubmitting(true);
      try {
        // Transform productGroups to match API format
        const transformedProductGroups = (data.productGroups || []).map(
          (group: { title: string; values: (string | number | undefined)[] }) => {
            // Find matching product group by title/name
            const matchedGroup = productGroups.find(
              (pg) =>
                pg.name === group.title || pg.name.includes(group.title.replace(/^\d+\.\s*/, ''))
            );

            return {
              productGroupId: matchedGroup?.id || null,
              productGroupName: group.title,
              productCategories: group.values.filter(
                (v): v is string => typeof v === 'string' && v !== undefined
              ),
            };
          }
        );

        // Prepare final payload
        const payload = {
          eventId: '203',
          participationType: data.participationType,
          councilId: data.councilId ? Number(data.councilId) : '',
          otherCouncilName: data.otherCouncilName,
          email: data.email,
          companyName: data.companyName,
          prefix: data.prefix,
          firstName: data.firstName,
          middleName: data.middleName || '',
          lastName: data.lastName,
          designation: data.designation,
          address: data.address,
          country: data.country,
          state: data.state,
          city: data.city,
          postalCode: data.postalCode,
          mobileNumber: data.mobileNumber,
          whatsappMobileNumber: data.whatsappMobileNumber || data.mobileNumber,
          website: data.website || '',
          landlineNumber: data.landlineNumber || '',
          isFirstVisiting: data.isFirstVisiting
            ? data.isFirstVisiting === 'Yes'
              ? true
              : false
            : '',
          visitedYear: data.visitedYear || [],
          sourceOfRegistration: data.sourceOfRegistration || '',
          natureOfBusiness: Array.isArray(data.natureOfBusiness) ? data.natureOfBusiness : [],
          otherNatureOfBusiness: data.otherNatureOfBusiness || '',
          turnOver2223: data.turnOver2223 || '',
          turnOver2324: data.turnOver2324 || '',
          turnOver2425: data.turnOver2425 || '',
          buyerCompanyName: data.buyerCompanyName || '',
          buyerCompanyCountries: data.buyerCompanyCountries || [],
          productGroups: transformedProductGroups,
          socialMediaComms: data.socialMediaComms || [],
          passportNumber: data.passportNumber || '',
          dateOfIssueForPassport: data.dateOfIssueForPassport || "",
          dateOfExpiryForPassport: data.dateOfExpiryForPassport || "",
          gstNumber: data.gstNumber || '',
          passportFrontUrl: data.passportFrontUrl || '',
          passportBackUrl: data.passportBackUrl || '',
          isOnlineSeller: data.isOnlineSeller ? (data.isOnlineSeller === 'Yes' ? true : false) : '',
          onlineSellerAccounts: data.onlineSellerAccounts || [],
          otherOnlineSellerPlatform: data.otherOnlineSellerPlatform || '',

          profilePhotoUrl: data.profilePhotoUrl || '',
          isImportIndia: data.isImportIndia ? (data.isImportIndia === 'Yes' ? true : false) : '',
          importValue: data.importValue ? Number(data.importValue) : '',
          linkedInUrl: data.linkedInUrl || '',
          twitterUrl: data.twitterUrl || '',
          instagramUrl: data.instagramUrl || '',
          facebookUrl: data.facebookUrl || '',
          pinterestUrl: data.pinterestUrl || '',
          youtubeUrl: data.youtubeUrl || '',
          businessCardUrl: data.businessCardUrl || '',
        };

        console.log('Form Data:', data);
        console.log('Transformed Payload:', payload);
        // Simulate API call
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
        // const response = await registerBuyer(cleanPayload);
        const response = {
          status: true,
          msg: 'Form submitted successfully!',
        };
        console.log('API Response:', response);
        if (response.status) {
          // alert("Form submitted successfully! Check console for data.");

          if (buyerType === 'DOMESTIC_VOLUME_BUYER') {
            window.parent.postMessage(
              {
                type: 'REDIRECT',
                href: 'https://bharat-tex.com/thank-you-domestic-buyers/',
              },
              '*'
            );
          } else if (buyerType === 'OVERSEAS_BUYER') {
            window.parent.postMessage(
              {
                type: 'REDIRECT',
                href: 'https://bharat-tex.com/thank-you-overseas-buyers',
              },
              '*'
            );
          } else if (buyerType === 'BUYING_CONSULTANT') {
            window.parent.postMessage(
              {
                type: 'REDIRECT',
                href: 'https://bharat-tex.com/thank-you-buying-consultant/',
              },
              '*'
            );
          }
        } else {
          setApiMessage({
            type: 'error',
            text: response.msg || 'Registration failed. Please try again.',
          });
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
      } finally {
        setIsSubmitting(false);
      }
    },
    (submitErrors) => {
      scrollToFirstError(submitErrors);
    }
  );

  console.log('buyerType', buyerType);

  if (
    buyerType !== 'DOMESTIC_VOLUME_BUYER' &&
    buyerType !== 'OVERSEAS_BUYER' &&
    buyerType !== 'BUYING_CONSULTANT'
  ) {
    return;
  }

  console.log(watch('productGroups'));

  return (
    <>
      <Box sx={{ bgcolor: '#ffa206', color: 'white', p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          Buyer Submission Overview
        </Typography>
        <Typography variant="body1">
          Here are the details submitted by the buyer during registration.
        </Typography>
      </Box>
      <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] min-h-[100vh] rounded-2xl mx-6 mb-8">
        {/* <div className="flex flex-col w-full justify-start gap-8 items-center lg:w-1/4 bg-[#ffa206] lg:min-h-full rounded-t-2xl lg:rounded-2xl px-5 py-12 text-white">
          <h1 className="text-2xl font-bold text-center">
            {buyerType === "DOMESTIC_VOLUME_BUYER"
              ? "Domestic Buyer Registration"
              : buyerType === "OVERSEAS_BUYER"
              ? "Overseas Buyer Registration"
              : "Buying/Sourcing Consultant Registration"}
          </h1>
        </div> */}
        <div className="w-full p-6 lg:p-8">
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <BuyerDetails
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              trigger={trigger}
              emailVerification={emailVerification}
              setEmailVerification={setEmailVerification}
              mobileVerification={mobileVerification}
              setMobileVerification={setMobileVerification}
              gstVerification={gstVerification}
              setGstVerification={setGstVerification}
              councils={councils}
            />
            <div className="flex flex-col justify-end mt-auto">
              {apiMessage.text && (
                <div
                  className={`my-4 p-3 rounded-md text-center ${apiMessage.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : apiMessage.type === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                    }`}
                >
                  {apiMessage.text}
                </div>
              )}
              {/* {watch("participationType") && (
                <FormNavigationButtons
                  currentStepId={1}
                  totalSteps={2}
                  isSubmitting={isSubmitting}
                  showSaveAndNext={false}
                  onBack={() => {}}
                  onNext={() => {}}
                  onSubmit={onSubmit}
                  submitDisabled={false}
                />
              )} */}
            </div>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
