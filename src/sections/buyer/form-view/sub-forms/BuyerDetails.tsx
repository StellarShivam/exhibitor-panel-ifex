import RHFTextField from "src/sections/form-view/hook-form/rhf-text-field";
import {
  RHFCountrySelect,
  RHFStateSelect,
  RHFCitySelect,
} from "src/sections/form-view/hook-form/rhf-country-state-city";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  UseFormTrigger,
} from "react-hook-form";

import { RHFCheckbox, RHFMultiCheckbox } from "src/sections/form-view/hook-form/rhf-checkbox";
import { useEffect, ChangeEvent, useCallback } from "react";
import { RHFSelect } from "src/sections/form-view/hook-form/rhf-select";
import { MenuItem } from "@mui/material";
import RHFPhone from "src/sections/form-view/hook-form/rhf-phone";

import RHFRadioGroup from "src/sections/form-view/hook-form/rhf-radio-group";
const productCategoriesForAccordion = []
import { RHFAccordionCheckbox } from "src/sections/form-view/hook-form/rhf-accordion-checkbox";
import { FileUploadBox } from "src/sections/form-view/hook-form/FileUploadBox";
import { RHFMultiSearchSelect } from "src/sections/form-view/hook-form/rhf-search-select";
import { Country } from "country-state-city";
import {
  checkEmailRegistered,
  checkMobileRegistered,
  Council,
  verifyDocument,
} from "src/sections/form-view/apis/exhibitior-reg";
import RHFSearchSelect2 from "src/sections/form-view/hook-form/rhf-search-select2";

interface VerificationState {
  status:
    | "idle"
    | "checking"
    | "available"
    | "registered"
    | "error"
    | "verifying"
    | "success";
  message?: string;
  name?: string;
  error?: string;
  verifiedNumber?: string;
}

interface BuyerDetailsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  trigger: UseFormTrigger<any>;
  emailVerification: VerificationState;
  setEmailVerification: React.Dispatch<React.SetStateAction<VerificationState>>;
  mobileVerification: VerificationState;
  setMobileVerification: React.Dispatch<
    React.SetStateAction<VerificationState>
  >;
  gstVerification: VerificationState;
  setGstVerification: React.Dispatch<React.SetStateAction<VerificationState>>;
  councils: Council[];
}
const titleOptions = [
  { label: "Mr.", value: "Mr." },
  { label: "Mrs.", value: "Mrs." },
  { label: "Ms.", value: "Ms." },
  { label: "Dr.", value: "Dr." },
  { label: "Prof.", value: "Prof." },
];

const yearOfVisitOptions = [
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
];

const sourceOfInformationOptions = [
  { label: "Advertisement", value: "Advertisement" },
  { label: "Email from organiser", value: "Email from organiser" },
  { label: "Invitation by Exhibitor", value: "Invitation by Exhibitor" },
  {
    label: "Invitation from India Representative / buying agent in India",
    value: "Invitation from India Representative / buying agent in India",
  },
  { label: "Phone call from organiser", value: "Phone call from organiser" },
  { label: "IFEX website", value: "IFEX website" },
  { label: "Social media", value: "Social media" },
];

const natureOfBusinessOptions = [
  { label: "Manufacturer", value: "Manufacturer" },
  { label: "Exporter", value: "Exporter" },
  { label: "Sole Agent", value: "Sole Agent" },
  { label: "Wholesaler", value: "Wholesaler" },
  { label: "Product Designer", value: "Product Designer" },
  { label: "Publisher", value: "Publisher" },
  { label: "Others (Please specify)", value: "Others" },
];

// Products of Interest options (from provided image)
const productsOfInterestOptions = [
  {
    label: "Furniture, Furniture Hardware & Accessories (Please Select)",
    value: "Furniture, Furniture Hardware & Accessories",
  },
  {
    label: "House ware, Tableware, Kitchenware and Hotel ware including EPNS",
    value: "House ware, Tableware, Kitchenware and Hotel ware including EPNS",
  },
  {
    label: "Decorative and Gifts (including Corporate Gifts)",
    value: "Decorative and Gifts (including Corporate Gifts)",
  },
  { label: "Bathroom Accessories", value: "Bathroom Accessories" },
  {
    label: "Lawn, Garden Ornaments & Accessories",
    value: "Lawn, Garden Ornaments & Accessories",
  },
  {
    label: "Lamps & Lighting Accessories",
    value: "Lamps & Lighting Accessories",
  },
  {
    label: "Home Furnishings & Made-ups",
    value: "Home Furnishings & Made-ups",
  },
  {
    label:
      "Carpets, Rugs & Flooring Coverings including made from Coir & Jute and Natural Fibers",
    value:
      "Carpets, Rugs & Flooring Coverings including made from Coir & Jute and Natural Fibers",
  },
  {
    label:
      "Fashion Jewellery, Canvas/Cotton/Jute Bags, Leather Bags, Scarves, Tie & Accessories, Garments including Chikankari & Zardozi",
    value:
      "Fashion Jewellery, Canvas/Cotton/Jute Bags, Leather Bags, Scarves, Tie & Accessories, Garments including Chikankari & Zardozi",
  },
  {
    label: "Christmas and Festive Decor",
    value: "Christmas and Festive Decor",
  },
  {
    label:
      "Handmade Paper, Products & Stationery, Gift Wraps & Ribbons and Toys",
    value:
      "Handmade Paper, Products & Stationery, Gift Wraps & Ribbons and Toys",
  },
  {
    label:
      "Candles, Incense, Dried Flowers & Potpourri, Spa Therapy & Aromatics",
    value:
      "Candles, Incense, Dried Flowers & Potpourri, Spa Therapy & Aromatics",
  },
];

// Social media preference options (from provided image)
const socialMediaPreferenceOptions = [
  { label: "LinkedIn", value: "LinkedIn" },
  { label: "Twitter", value: "Twitter" },
  { label: "Instagram", value: "Instagram" },
  { label: "Facebook", value: "Facebook" },
  { label: "Pinterest", value: "Pinterest" },
  { label: "YouTube", value: "YouTube" },
];

const ecommercePlatformOptions = [
  { label: "Amazon", value: "Amazon" },
  { label: "Flipkart", value: "Flipkart" },
  { label: "Myntra", value: "Myntra" },
  { label: "Ajio", value: "Ajio" },
  { label: "Meesho", value: "Meesho" },
  { label: "Others", value: "Others" },
];
const buyerCategoryOptions = [
  { label: "OVERSEAS_BUYER", value: "OVERSEAS_BUYER" },
  {
    label: "BUYING_CONSULTANT",
    value: "BUYING_CONSULTANT",
  },
  { label: "DOMESTIC_VOLUME_BUYER", value: "DOMESTIC_VOLUME_BUYER" },
];

export const BuyerDetails = ({
  register,
  errors,
  setValue,
  watch,
  trigger,
  emailVerification,
  setEmailVerification,
  mobileVerification,
  setMobileVerification,
  gstVerification,
  setGstVerification,
  councils,
}: BuyerDetailsProps) => {
  const formatGSTNumber = (value: string) =>
    value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 15);

  const handleNumericChange =
    (fieldName: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = event.target.value.replace(/\D/g, "");
      setValue(fieldName, sanitizedValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };

  // Watch values
  const watchedEmail = watch("email");
  const watchedMobile = watch("mobileNumber");
  const watchedGstNumber = watch("gstNumber");
  const participationType = watch("participationType");

  // Email verification
  const checkEmail = useCallback(
    async (email: string) => {
      if (!email || errors.email) {
        setEmailVerification({ status: "idle" });
        return;
      }

      setEmailVerification({
        status: "checking",
        message: "Checking email...",
      });

      try {
        const response = await checkEmailRegistered(email);

        const responseData = response as {
          data?: { isRegistered?: boolean } | boolean;
          isRegistered?: boolean;
        };
        const isRegistered =
          (responseData?.data &&
            typeof responseData.data === "object" &&
            responseData.data.isRegistered) ??
          responseData?.isRegistered ??
          responseData?.data === true;

        if (isRegistered) {
          setEmailVerification({
            status: "registered",
            message:
              "This email is already registered. Please use a different email.",
          });
        } else {
          setEmailVerification({
            status: "available",
            message: "Email is available.",
          });
        }
      } catch (error) {
        const err = error as {
          response?: { data?: { msg?: string } };
          message?: string;
        };
        const errorMessage = err?.response?.data?.msg || err?.message;

        setEmailVerification({
          status: "error",
          message: errorMessage || "Failed to verify email. Please try again.",
        });
      }
    },
    [errors.email, setEmailVerification]
  );

  // Mobile verification
  const checkMobile = useCallback(
    async (mobile: string) => {
      if (!mobile || errors.mobileNumber) {
        setMobileVerification({ status: "idle" });
        return;
      }

      setMobileVerification({
        status: "checking",
        message: "Checking mobile number...",
      });

      try {
        const response = await checkMobileRegistered(mobile);

        const responseData = response as {
          data?: { isRegistered?: boolean } | boolean;
          isRegistered?: boolean;
        };
        const isRegistered =
          (responseData?.data &&
            typeof responseData.data === "object" &&
            responseData.data.isRegistered) ??
          responseData?.isRegistered ??
          responseData?.data === true;

        if (isRegistered) {
          setMobileVerification({
            status: "registered",
            message:
              "This mobile number is already registered. Please use a different mobile number.",
          });
        } else {
          setMobileVerification({
            status: "available",
            message: "Mobile number is available.",
          });
        }
      } catch (error) {
        const err = error as {
          response?: { data?: { msg?: string } };
          message?: string;
        };
        const errorMessage = err?.response?.data?.msg || err?.message;

        setMobileVerification({
          status: "error",
          message:
            errorMessage || "Failed to verify mobile number. Please try again.",
        });
      }
    },
    [errors.mobileNumber, setMobileVerification]
  );

  // // Debounced email check
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (watchedEmail && !errors.email) {
  //       checkEmail(watchedEmail);
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timeoutId);
  // }, [watchedEmail, checkEmail, errors.email]);

  // // Debounced mobile check
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (watchedMobile && !errors.mobileNumber) {
  //       checkMobile(watchedMobile);
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timeoutId);
  // }, [watchedMobile, checkMobile, errors.mobileNumber]);

  // GST verification
  useEffect(() => {
    if (!watchedGstNumber || !watchedEmail) {
      setGstVerification({ status: "idle" });
      return;
    }

    if (
      watchedGstNumber &&
      typeof watchedGstNumber === "string" &&
      watchedGstNumber.length === 15
    ) {
      const gstUpper = watchedGstNumber.toUpperCase();

      // Skip API call if this GST was already verified successfully
      if (
        gstVerification.status === "success" &&
        gstVerification.verifiedNumber === gstUpper
      ) {
        return;
      }

      const verifyGst = async () => {
        setGstVerification({ status: "verifying" });
        try {
          const response = await verifyDocument({
            eventId: 203,
            email: watchedEmail as string,
            docType: "GSTIN",
            docNumber: gstUpper,
          });

          const responseData = response as Record<string, unknown>;
          const data = responseData.data as Record<string, unknown> | undefined;
          if (responseData && data && data.valid === true) {
            const name =
              (responseData.name as string) || (data?.name as string);
            if (name) {
              setGstVerification({
                status: "success",
                name,
                verifiedNumber: gstUpper,
              });
              setValue("gstVerifiedName", name);
            } else {
              setGstVerification({
                status: "error",
                error: "This GST does not exist",
              });
            }
          } else {
            setGstVerification({
              status: "error",
              error: "This GST does not exist",
            });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "This GST does not exist";
          setGstVerification({
            status: "error",
            error: errorMessage,
          });
        }
      };

      const timeoutId = setTimeout(verifyGst, 1000);
      return () => clearTimeout(timeoutId);
    } else if (
      watchedGstNumber &&
      typeof watchedGstNumber === "string" &&
      watchedGstNumber.length > 0
    ) {
      setGstVerification({ status: "idle" });
    }
  }, [
    watchedGstNumber,
    watchedEmail,
    // setValue,
    // setGstVerification,
    // gstVerification.status,
    // gstVerification.verifiedNumber,
  ]);

  // useEffect(() => {
  //   if (watch("participationType") === "DOMESTIC_VOLUME_BUYER") {
  //     setValue("country", "India");
  //   } else {
  //     setValue("country", "");
  //   }
  // }, [watch("participationType"), setValue]);

  useEffect(() => {
    if (watch("whatsAppSame")) {
      setValue("whatsappMobileNumber", watch("mobileNumber"));
    }
  }, [watch("whatsAppSame"), watch("mobileNumber"), setValue]);
  const annualTurnoverCurrency =
    participationType === "OVERSEAS_BUYER" ? "USD" : "INR";
  const annualTurnoverPlaceholder = `Enter Annual Turnover in ${annualTurnoverCurrency}`;

  const countries = Country.getAllCountries();
  const watchedCountry = watch("country");
  const watchedBuyerCouncil = watch("councilId");



    const findphonecountry = (countryName: string) => {
        const selectedCountryObj = countries.find(
            (c) => c.name.toLowerCase() === (countryName || "").toLowerCase()
          );
          return selectedCountryObj?.isoCode.toLowerCase() || "";
    }

  return (
    <>
      {/* <h2 className="text-xl font-semibold mb-4">Select Your Category</h2>
            <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />

            <RHFRadioGroup
                name="participationType"
                options={buyerCategoryOptions}
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                    gap: { xs: "4px", md: "6px" },
                }}
            /> */}
      {participationType && (
        <>

          <h2 className="text-base font-semibold mb-4 mt-2">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="flex flex-col">
              <RHFTextField
                name="email"
                label="Email"
                placeholder="Enter Email"
                required
                disabled
              />
              {emailVerification.status !== "idle" && (
                <div
                  className={`text-sm mt-1 ${
                    emailVerification.status === "checking"
                      ? "text-blue-600"
                      : emailVerification.status === "available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {emailVerification.status === "checking" && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {emailVerification.message}
                    </span>
                  )}
                  {(emailVerification.status === "registered" ||
                    emailVerification.status === "error") && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {emailVerification.message}
                    </span>
                  )}
                </div>
              )}
            </div>
            <RHFTextField
              name="companyName"
              label="Company Name"
              placeholder="Enter Company Name"
              required
              disabled
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
            <div className="flex flex-col md:flex-row gap-x-4 w-full">
              <div className="w-full md:w-1/3">
                <RHFSelect
                  name="prefix"
                  label="Title"
                  placeholder="Select Title"
                  required
                  disabled
                >
                  {titleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </div>
              <div className="w-full md:w-2/3">
                <RHFTextField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter First Name"
                  required
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-x-4 w-full">
              <RHFTextField
                name="middleName"
                label="Middle Name"
                placeholder="Enter Middle Name"
                disabled 
              />
              <RHFTextField
                name="lastName"
                label="Last Name"
                placeholder="Enter Last Name"
                required
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
            <RHFTextField
              name="designation"
              label="Position/ Designation"
              placeholder="Enter Position/ Designation"
              required
              disabled
            />
            <RHFTextField
              name="address"
              label="Address"
              placeholder="Enter Address"
              required
              disabled
            />
            <RHFCountrySelect
              name="country"
              label="Country"
              placeholder="Select Country"
              required
              excludeCountries={
                watch("participationType") === "OVERSEAS_BUYER" ? ["India"] : []
              }
              // disabled={watch("participationType") === "DOMESTIC_VOLUME_BUYER"}
              disabled
            />
            <RHFStateSelect
              name="state"
              countryFieldName="country"
              label="State"
              placeholder="Select State"
              required
              disabled
            />
            <RHFCitySelect
              name="city"
              countryFieldName="country"
              stateFieldName="state"
              label="City"
              placeholder="Select City"
              required
              disabled
            />
            <RHFTextField
              name="postalCode"
              type="number"
              label="Zipcode/ Postal code"
              placeholder="Enter Zipcode/ Postal code"
              required
              disabled
            />
            <div className="flex flex-col">
              <RHFPhone
                name="mobileNumber"
                label="Mobile Number"
                placeholder="Enter Mobile Number"
                required
                country={
                  watch("participationType") === "OVERSEAS_BUYER" ? findphonecountry(watchedCountry) : "in"
                }
                disabled
              />
              {mobileVerification.status !== "idle" && (
                <div
                  className={`text-sm mt-1 ${
                    mobileVerification.status === "checking"
                      ? "text-blue-600"
                      : mobileVerification.status === "available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {mobileVerification.status === "checking" && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {mobileVerification.message}
                    </span>
                  )}
                  {(mobileVerification.status === "registered" ||
                    mobileVerification.status === "error") && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {mobileVerification.message}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <RHFPhone
                name="whatsappMobileNumber"
                label="WhatsApp Number"
                placeholder="Enter WhatsApp Number"
                country={
                  watch("participationType") === "OVERSEAS_BUYER" ? findphonecountry(watchedCountry) : "in"
                }
                disabled
              />
              <RHFCheckbox name="whatsAppSame" label="Same as Mobile Number" disabled />
            </div>
            <RHFTextField
              name="website"
              label="Website"
              placeholder="Enter Website"
              disabled
            />
            <RHFTextField
              name="landlineNumber"
              type="number"
              label="Landline Number"
              placeholder="Enter Landline Number"
              disabled
            />
            {watch("participationType") === "DOMESTIC_VOLUME_BUYER" && (
              <div className="flex flex-col">
                <RHFTextField
                  name="gstNumber"
                  label="GST Number"
                  placeholder="Enter GST Number"
                  required
                  helperText="GSTIN must be 15 characters (A-Z & 0-9)"
                  inputProps={{
                    maxLength: 15,
                    style: { textTransform: "uppercase" },
                  }}
                  //   valueFormatter={formatGSTNumber}
                  disabled
                />
                {gstVerification.status === "verifying" && (
                  <p className="text-blue-500 text-sm mt-1">Verifying GST...</p>
                )}
                {gstVerification.status === "success" &&
                  gstVerification.name && (
                    <p className="text-green-600 text-sm mt-1 font-medium">
                      ✓ Verified: {gstVerification.name}
                    </p>
                  )}
                {gstVerification.status === "error" && (
                  <p className="text-red-500 text-sm mt-1">
                    {gstVerification.error || "This GST does not exist"}
                  </p>
                )}
              </div>
            )}

            <RHFSearchSelect2
              name="isFirstVisiting"
              label="Is this your first visit to IFEX?"
              placeholder="Select Yes or No"
              required
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
              disabled
            />
            {watch("isFirstVisiting") === "No" && (
              <RHFMultiCheckbox
                label="Please specify the year of your previous visit to IFEX"
                name="visitedYear"
                options={yearOfVisitOptions}
                row
                required
                disabled
              ></RHFMultiCheckbox>
            )}
          </div>

          {participationType === "BUYING_CONSULTANT" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
              <RHFTextField
                name="buyerCompanyName"
                label="Name of the buyer’s company you are representing"
                placeholder="Enter Company"
                disabled
              />
              <RHFMultiSearchSelect
                name="buyerCompanyCountries"
                label="Name of the buyer’s countries you are representing"
                placeholder="Select Country"
                options={countries.map((country) => country.name)}
                disabled
              />
            </div>
          )}

{participationType === "OVERSEAS_BUYER" && (
    <div className="mt-4">
        <RHFSearchSelect2
          name="councilId"
          label="Please select the Council/Association you are affiliated with (if applicable)"
          placeholder="Select Council/ Association"
          options={councils.map((council: Council) => ({
            label: council.name as string,
            value: council.id as string,
          }))}
          required
          disabled
        />

    </div>
      )}
      {participationType === "OVERSEAS_BUYER" && watchedBuyerCouncil === 16 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-4">
          <RHFTextField
            name="otherCouncilName"
            label="Please specify other"
            placeholder="Enter other"
            required
            disabled
          />
          <div />
        </div>
      )}

          {(participationType === "OVERSEAS_BUYER" ||
            participationType === "DOMESTIC_VOLUME_BUYER") && (
            <div className="mt-6">
              <h2 className="text-base font-semibold mb-2">
                I came to know about the fair through (please select)
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <RHFMultiCheckbox
                name="sourceOfRegistration"
                options={sourceOfInformationOptions}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                  },
                  gap: { xs: "4px", md: "6px" },
                }}
                disabled
              />
            </div>
          )}

          {(participationType === "OVERSEAS_BUYER" ||
            participationType === "DOMESTIC_VOLUME_BUYER") && (
            <div className="mt-6">
              <h2 className="text-base font-semibold mb-2">
                Nature of business (please select)
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <RHFMultiCheckbox
                name="natureOfBusiness"
                options={natureOfBusinessOptions}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                  },
                  gap: { xs: "4px", md: "6px" },
                }}
                disabled
              />
              {watch("natureOfBusiness")?.includes("Others") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-2">
                  <RHFTextField
                    name="otherNatureOfBusiness"
                    label="Please specify Others"
                    placeholder="Enter Other Nature of Business"
                    required
                    disabled
                  />
                  <div />
                </div>
              )}
            </div>
          )}

          {participationType === "DOMESTIC_VOLUME_BUYER" && (
            <div className="mt-8">
              <h2 className="text-base font-semibold mb-2">
                Are you an Online Seller on Ecommerce platforms?
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <RHFRadioGroup
                name="isOnlineSeller"
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
                row
                disabled
              />
            </div>
          )}

          {watch("isOnlineSeller") === "Yes" && (
            <div className="mt-8">
              <h2 className="text-base font-semibold mb-2">
                Which Ecommerce platform you have Seller Accounts?
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <RHFMultiCheckbox
                name="onlineSellerAccounts"
                options={ecommercePlatformOptions}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(3, 1fr)",
                  },
                  gap: { xs: "4px", md: "6px" },
                }}
                disabled
              />
              {watch("onlineSellerAccounts")?.includes("Others") && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 mt-2">
                  {/* <div /> */}
                  {/* <div /> */}
                  <RHFTextField
                    name="otherOnlineSellerPlatform"
                    label="Please specify"
                    placeholder="Enter Other Ecommerce Platform"
                    required
                    disabled
                  />
                </div>
              )}
            </div>
          )}

          {participationType === "OVERSEAS_BUYER" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-4">
                      <RHFSearchSelect2
          name="isImportIndia"
          label="Are you presently importing from India?"
          placeholder="Select Yes or No"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          required
          disabled
        />
        {watch("isImportIndia") === "Yes" && (
            <RHFTextField
              name="importValue"
              label="Import Value (USD)"
              type="number"
              required
              placeholder="Enter Import Value"
              disabled
            />
        )}
            </div>
          )}

          {(participationType === "DOMESTIC_VOLUME_BUYER" ||
            participationType === "OVERSEAS_BUYER") && (
            <>
              {" "}
              <h2 className="text-base font-semibold mt-4">
                Annual turnover in {annualTurnoverCurrency} (3 years)
                {participationType === "DOMESTIC_VOLUME_BUYER" && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 mt-2">
                <RHFTextField
                  name="turnOver2223"
                  label="2022-23"
                  placeholder={annualTurnoverPlaceholder}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  onChange={handleNumericChange("turnOver2223")}
                  disabled
                />
                <RHFTextField
                  name="turnOver2324"
                  label="2023-24"
                  placeholder={annualTurnoverPlaceholder}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  onChange={handleNumericChange("turnOver2324")}
                  disabled
                />
                <RHFTextField
                  name="turnOver2425"
                  label="2024-25"
                  placeholder={annualTurnoverPlaceholder}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  onChange={handleNumericChange("turnOver2425")}
                  disabled
                />
              </div>
            </>
          )}

          {/* Products Of Interest */}
          <div className="mt-8">
            <h2 className="text-base font-semibold mb-2">
              Products Of Interest (Please Specify)
              <span className="text-red-500 ml-1">*</span>
            </h2>
            {/* <RHFMultiCheckbox
              name="productCategory"
              options={productsOfInterestOptions}
              required
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr" },
                gap: { xs: "2px", md: "4px" },
              }}
            /> */}
            <RHFAccordionCheckbox
              name="productGroups"
              categories={productCategoriesForAccordion}
              required
              disabled
            />
          </div>

          {/* Social Media Profile Preference */}
          {(participationType === "OVERSEAS_BUYER" ||
            participationType === "DOMESTIC_VOLUME_BUYER") && (
            <div className="mt-8">
              <h2 className="text-base font-semibold mb-2">
                {watch("participationType") === "DOMESTIC_VOLUME_BUYER"
                  ? "YOUR SOCIAL MEDIA PRESENCE"
                  : "Social Media Platform You Prefer For Communication From Us?"}
              </h2>
              <RHFMultiCheckbox
                name="socialMediaComms"
                options={socialMediaPreferenceOptions}
                required
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(3, 1fr)",
                  },
                  gap: { xs: "8px", md: "10px" },
                }}
                disabled
              />
            </div>
          )}

{(participationType === "OVERSEAS_BUYER" ||
            participationType === "DOMESTIC_VOLUME_BUYER") && (
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-4">
{watch("socialMediaComms")?.includes("LinkedIn") && (
  <RHFTextField
    name="linkedInUrl"
    label="Your LinkedIn URL"
      placeholder="Enter LinkedIn URL"
      required
      disabled
    />
  )}
  {watch("socialMediaComms")?.includes("Twitter") && (
    <RHFTextField
    name="twitterUrl"
    label="Your Twitter URL"
    placeholder="Enter Twitter URL"
    required
    disabled
  />
  )}
  {watch("socialMediaComms")?.includes("Instagram") && (
  <RHFTextField
    name="instagramUrl"
    label="Your Instagram URL"
    placeholder="Enter Instagram URL"
    required
    disabled
  />
  )}
  {watch("socialMediaComms")?.includes("Facebook") && (
  <RHFTextField
    name="facebookUrl"
    label="Your Facebook URL"
    placeholder="Enter Facebook URL"
    required
    disabled
  />
  )}
  {watch("socialMediaComms")?.includes("Pinterest") && (
  <RHFTextField
    name="pinterestUrl"
    label="Your Pinterest URL"
    placeholder="Enter Pinterest URL"
    required
    disabled
  />
  )}
  {watch("socialMediaComms")?.includes("YouTube") && (
  <RHFTextField
    name="youtubeUrl"
    label="Your YouTube URL"
    placeholder="Enter YouTube URL"
    required
    disabled
  />
  )}
</div>
)}



<div className="flex flex-col md:flex-row items-start mt-4 w-full gap-x-2">
                <FileUploadBox
                  label="Upload Business Card"
                  accept=".pdf,.png,.jpg,.jpeg"
                  error={!!errors.businessCardUrl}
                  helperText="Supported formats: PDF, PNG, JPG, JPEG (Max 5MB)"
                  preview={watch("businessCardUrl")}
                  errorMessage={errors.businessCardUrl?.message}
                  onDelete={() => {
                    setValue("businessCardUrl", "");
                  }}
                  onChange={(fileUrl) => {
                    setValue("businessCardUrl", fileUrl);
                    trigger("businessCardUrl");
                  }}
                  disabled
                />
              </div>

{participationType === "OVERSEAS_BUYER" && (
            <>
              <div className="flex flex-col md:flex-row items-start mt-4 w-full gap-x-2">
                <FileUploadBox
                  label="Upload passport size photograph"
                  accept=".png,.jpg,.jpeg"
                  error={!!errors.profilePhotoUrl}
                  helperText="Supported formats: PNG, JPG, JPEG (Max 5MB)"
                  preview={watch("profilePhotoUrl")}
                  errorMessage={errors.profilePhotoUrl?.message}
                  onDelete={() => {
                    setValue("profilePhotoUrl", "");
                  }}
                  onChange={(fileUrl) => {
                    setValue("profilePhotoUrl", fileUrl);
                    trigger("profilePhotoUrl");
                  }}
                  required
                  disabled
                />
              </div>
              </>
          )}

          {participationType === "OVERSEAS_BUYER" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
              <RHFTextField
                name="passportNumber"
                label="Passport Number"
                placeholder="Enter Passport Number"
                required
                disabled
              />
              <div />
              <RHFTextField
                name="dateOfIssueForPassport"
                label="Passport Date of Issue"
                type="date"
                required
              />
              <RHFTextField
                name="dateOfExpiryForPassport"
                label="Passport Date of Expiry"
                type="date"
                required
              />
            </div>
          )}

          {participationType === "OVERSEAS_BUYER" && (
            <>
              <div className="flex flex-col md:flex-row items-start mt-4 w-full gap-x-2">
                <FileUploadBox
                  label="Upload Passport Front"
                  accept=".pdf,.png,.jpg,.jpeg"
                  error={!!errors.passportFrontUrl}
                  helperText="Supported formats: PDF, PNG, JPG, JPEG (Max 5MB)"
                  preview={watch("passportFrontUrl")}
                  errorMessage={errors.passportFrontUrl?.message}
                  onDelete={() => {
                    setValue("passportFrontUrl", "");
                  }}
                  onChange={(fileUrl) => {
                    setValue("passportFrontUrl", fileUrl);
                    trigger("passportFrontUrl");
                  }}
                  required
                  disabled
                />
              </div>
              <div className="flex flex-col md:flex-row items-start mt-4 w-full gap-x-2">
                <FileUploadBox
                  label="Upload Passport Back"
                  accept=".pdf,.png,.jpg,.jpeg"
                  error={!!errors.passportBackUrl}
                  helperText="Supported formats: PDF, PNG, JPG, JPEG (Max 5MB)"
                  preview={watch("passportBackUrl")}
                  errorMessage={errors.passportBackUrl?.message}
                  onDelete={() => {
                    setValue("passportBackUrl", "");
                  }}
                  onChange={(fileUrl) => {
                    setValue("passportBackUrl", fileUrl);
                    trigger("passportBackUrl");
                  }}
                  disabled
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};
