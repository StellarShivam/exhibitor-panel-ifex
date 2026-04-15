import RHFTextField from "../../hook-form/rhf-text-field";
import {
  RHFCountrySelect,
  RHFStateSelect,
  RHFCitySelect,
} from "../../hook-form/rhf-country-state-city";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  UseFormTrigger,
} from "react-hook-form";

import { RHFCheckbox } from "../../hook-form/rhf-checkbox";
import { useEffect, useCallback, useRef } from "react";
import RHFRadioGroup from "../../hook-form/rhf-radio-group";
import RHFSearchSelect from "../../hook-form/rhf-search-select";
import RHFPhone from "../../hook-form/rhf-phone";
import RHFSearchSelect2 from "../../hook-form/rhf-search-select2";
import {
  Council,
  checkEmailRegistered,
  checkMobileRegistered,
} from "../../apis/exhibitior-reg";
import { InputAdornment } from "@mui/material";

interface ExhibitorInformationProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  trigger: UseFormTrigger<any>;
  councils: Council[];
  emailVerification: {
    status: "idle" | "checking" | "available" | "registered" | "error";
    message?: string;
  };
  setEmailVerification: React.Dispatch<
    React.SetStateAction<{
      status: "idle" | "checking" | "available" | "registered" | "error";
      message?: string;
    }>
  >;
  mobileVerification: {
    status: "idle" | "checking" | "available" | "registered" | "error";
    message?: string;
  };
  setMobileVerification: React.Dispatch<
    React.SetStateAction<{
      status: "idle" | "checking" | "available" | "registered" | "error";
      message?: string;
    }>
  >;
  disabled?: boolean;
}

const exhibitorCategoryOptions = [
  { label: "Indian Participant", value: "INDIAN_PARTICIPANT" },
  { label: "Overseas Participant", value: "OVERSEAS_PARTICIPANT" },
];

const exhibitorCouncilOptions = [
  { label: "Apparel Export Promotion Council (AEPC)", value: "AEPC" },
  { label: "Carpet Export Promotion Council (CEPC)", value: "CEPC" },
  {
    label: "Clothing Manufacturers Association of India (CMAI)",
    value: "CMAI",
  },
  { label: "Confederation of Indian Textile Industry (CITI)", value: "CITI" },
  { label: "Export Promotion Council for Handicrafts (EPCH)", value: "EPCH" },
  { label: "Handloom Export Promotion Council (HEPC)", value: "HEPC" },
  { label: "Indian Silk Export Promotion Council (ISEPC)", value: "ISEPC" },
  {
    label: "Jute Products Development & Export Promotion Council (JPDEPC)",
    value: "JPDEPC",
  },
  {
    label: "Powerloom Development & Export Promotion Council (PDEXCIL)",
    value: "PDEXCIL",
  },
  {
    label: "The Cotton Textiles Export Promotion Council (TEXPROCIL)",
    value: "TEXPROCIL",
  },
  {
    label:
      "Manmade and Technical Textiles Export Promotion Council (MATEXIL) – (Formerly STEPC)",
    value: "MATEXIL",
  },
  {
    label: "Wool and Woolens Export Promotion Council (WWEPC)",
    value: "WWEPC",
  },
  {
    label: "Wool Industry Export Promotion Council (WOOLTEXPRO)",
    value: "WOOLTEXPRO",
  },
  { label: "Individual ( Non-EPC/Association )", value: "Individual" },
  { label: "Other", value: "Other" },
];

const titleOptions = [
  { label: "Mr.", value: "Mr." },
  { label: "Mrs.", value: "Mrs." },
  { label: "Ms.", value: "Ms." },
  { label: "Dr.", value: "Dr." },
  { label: "Prof.", value: "Prof." },
];

export const ExhibitorInformation = ({
  register,
  errors,
  setValue,
  watch,
  trigger,
  councils,
  emailVerification,
  setEmailVerification,
  mobileVerification,
  setMobileVerification,
  disabled = false,
}: ExhibitorInformationProps) => {
  // Extract all watched values to avoid recreating references
  const watchedBillingAddressSame = watch("billingAddressSame");
  const watchedEmail = watch("email");
  const watchedMobile = watch("mobile");
  const watchedExhibitorCategory = watch("participationType");
  const watchedExhibitorCouncil = watch("councilId");

  // Watch all company fields for billing address sync
  const watchedCompanyName = watch("companyName");
  const watchedWebsite = watch("website");
  const watchedAddress = watch("address");
  const watchedCountry = watch("country");
  const watchedCity = watch("city");
  const watchedState = watch("state");
  const watchedPostalCode = watch("postalCode");
  const watchedContactPersonTitle = watch("contactPersonPrefix");
  const watchedContactPersonFirstName = watch("contactPersonFirstName");
  const watchedContactPersonMiddleName = watch("contactPersonMiddleName");
  const watchedContactPersonLastName = watch("contactPersonLastName");
  const watchedContactPersonDesignation = watch("designation");

  // Refs to track previous values and prevent running on mount
  const prevBillingAddressSameRef = useRef<boolean | undefined>(undefined);
  const prevExhibitorCategoryRef = useRef<string | undefined>(undefined);
  const isFirstRenderRef = useRef(true);

  const checkMobile = useCallback(
    async (mobile: string) => {
      if (!mobile || errors.mobile) {
        setMobileVerification({ status: "idle" });
        return;
      }

      setMobileVerification({
        status: "checking",
        message: "Checking mobile number...",
      });

      try {
        const response = await checkMobileRegistered(mobile);

        // Check if email is already registered
        // API may return response.data.isRegistered or response.isRegistered or response.data as boolean
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
        // If the API returns an error, it might mean the mobile number is available or there was a server error
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
    [errors.mobile, setMobileVerification]
  );
  // Debounced email check
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

        // Check if email is already registered
        // API may return response.data.isRegistered or response.isRegistered or response.data as boolean
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
        // If the API returns an error, it might mean the email is available or there was a server error
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

  // Debounce effect for email
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (watchedEmail && !errors.email) {
  //       checkEmail(watchedEmail);
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timeoutId);
  // }, [watchedEmail, checkEmail, errors.email]);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (watchedMobile && !errors.mobile) {
  //       checkMobile(watchedMobile);
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timeoutId);
  // }, [watchedMobile, checkMobile, errors.mobile]);

  // If billingAddressSame is true, sync billing fields to company fields
  useEffect(() => {
    // Skip on first render
    if (isFirstRenderRef.current) {
      prevBillingAddressSameRef.current = watchedBillingAddressSame;
      return;
    }

    // Only sync if billingAddressSame actually changed
    if (prevBillingAddressSameRef.current !== watchedBillingAddressSame) {
      if (watchedBillingAddressSame) {
        setValue("billingCompanyName", watchedCompanyName);
        setValue("billingWebsiteAddress", watchedWebsite);
        setValue("billingAddress", watchedAddress);
        setValue("billingCountry", watchedCountry);
        setValue("billingCity", watchedCity);
        setValue("billingState", watchedState);
        setValue("billingPostalCode", watchedPostalCode);

        setValue("billingContactPersonPrefix", watchedContactPersonTitle);
        setValue(
          "billingContactPersonFirstName",
          watchedContactPersonFirstName
        );
        setValue(
          "billingContactPersonMiddleName",
          watchedContactPersonMiddleName
        );
        setValue("billingContactPersonLastName", watchedContactPersonLastName);
        setValue(
          "billingContactPersonDesignation",
          watchedContactPersonDesignation
        );
        setValue("billingEmail", watchedEmail);
        setValue("billingContactNumber", watchedMobile);
      }
      prevBillingAddressSameRef.current = watchedBillingAddressSame;
    }
  }, [
    watchedBillingAddressSame,
    watchedCompanyName,
    watchedWebsite,
    watchedAddress,
    watchedCountry,
    watchedCity,
    watchedState,
    watchedPostalCode,
    watchedContactPersonTitle,
    watchedContactPersonFirstName,
    watchedContactPersonMiddleName,
    watchedContactPersonLastName,
    watchedContactPersonDesignation,
    watchedEmail,
    watchedMobile,
    setValue,
  ]);

  // Handle exhibitor category changes
  // Only run when participationType actually changes, not on mount
  useEffect(() => {
    // Skip on first render
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevExhibitorCategoryRef.current = watchedExhibitorCategory;
      return;
    }

    // Only update if participationType actually changed
    if (prevExhibitorCategoryRef.current !== watchedExhibitorCategory) {
      if (watchedExhibitorCategory === "INDIAN_PARTICIPANT") {
        setValue("country", "India");
        setValue("billingCountry", "India");
      }
      if (watchedExhibitorCategory === "OVERSEAS_PARTICIPANT" && watchedCountry === "India") {
        setValue("country", "");
        setValue("billingCountry", "");
      }
      prevExhibitorCategoryRef.current = watchedExhibitorCategory;
    }
  }, [watchedExhibitorCategory, setValue]);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Sponsor Information</h2>
      <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mb-4">
        <div>
          <h2 className="text-base font-semibold">
            Your participation category
            <span className="text-red-500 ml-1">*</span>
          </h2>
          <RHFRadioGroup
            name="participationType"
            options={exhibitorCategoryOptions}
            row
            disabled={disabled}
          />
        </div>
      </div>
      {watchedExhibitorCategory === "INDIAN_PARTICIPANT" && (
        <RHFSearchSelect2
          name="councilId"
          label="Your Export Promotion Council/ Association"
          placeholder="Select Council/ Association"
          options={councils.map((council: Council) => ({
            label: council.name as string,
            value: council.id as string,
          }))}
          required
          disabled={disabled}
        />
      )}
      {watchedExhibitorCategory === "INDIAN_PARTICIPANT" && watchedExhibitorCouncil === 16 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-4">
          <RHFTextField
            name="otherCouncilName"
            label="Please specify other"
            placeholder="Enter other"
            required
            disabled={disabled}
          />
          <div />
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 mt-6">
        Company Name & Address
      </h2>
      <hr className="w-full border-t-1 border-[#B1B1B1]" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-6">
        <RHFTextField
          name="companyName"
          label="Company Name"
          placeholder="Enter Company Name"
          required
          disabled={disabled}
        />
        <RHFTextField
          name="website"
          label="Website"
          placeholder="Enter Website"
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{
                  color: "#000",
                  pointerEvents: "none",
                  userSelect: "none",
                  mr: 0,
                }}
              >
                https://
              </InputAdornment>
            ),
          }}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-6">
        <RHFTextField
          name="address"
          label="Address"
          placeholder="Enter Address"
          required
          disabled={disabled}
        />
        <RHFCountrySelect
          name="country"
          label="Country"
          placeholder="Select Country"
          required
          excludeCountries={
            watchedExhibitorCategory === "OVERSEAS_PARTICIPANT" ? ["India"] : []
          }
          disabled={watchedExhibitorCategory === "INDIAN_PARTICIPANT" || disabled}
        />
        <RHFStateSelect
          name="state"
          countryFieldName="country"
          label="State"
          placeholder="Select State"
          required
          disabled={disabled}
        />
        <RHFCitySelect
          name="city"
          countryFieldName="country"
          stateFieldName="state"
          label="City"
          placeholder="Select City"
          required
          disabled={disabled}
        />
        <RHFTextField
          name="postalCode"
          type="number"
          label="Postal Code"
          placeholder="Enter Postal Code"
          required
          disabled={disabled}
        />
      </div>

      <h2 className="text-base font-semibold mt-6">Contact Person</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-2">
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full">
          <div className="w-full md:w-1/3">
            <RHFSearchSelect
              name="contactPersonPrefix"
              label=" Title"
              placeholder="Title"
              required
              options={titleOptions.map((option) => option.value)}
              disabled={disabled}
            />
          </div>
          <div className="w-full md:w-2/3">
            <RHFTextField
              name="contactPersonFirstName"
              label="First Name"
              placeholder="Enter First Name"
              required
              disabled={disabled}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full">
          <RHFTextField
            name="contactPersonMiddleName"
            label="Middle Name"
            placeholder="Enter Middle Name"
            disabled={disabled}
          />
          <RHFTextField
            name="contactPersonLastName"
            label="Last Name"
            placeholder="Enter Last Name"
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-6">
        <RHFTextField
          name="designation"
          label="Designation"
          placeholder="Enter Designation"
          required
          disabled={disabled}
        />
        <div className="flex flex-col">
          <RHFTextField
            name="email"
            label="Email"
            placeholder="Enter Email"
            required
            disabled={disabled}
          />
          {/* {emailVerification.status !== "idle" && (
            <div
              className={`text-sm mt-1 ${
                emailVerification.status === "checking"
                  ? "text-blue-600"
                  : emailVerification.status === "available"
                  ? "text-green-600"
                  : emailVerification.status === "registered"
                  ? "text-red-600"
                  : "text-orange-600"
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
          )} */}
        </div>

        <div className="flex flex-col">
          <RHFPhone
            name="mobile"
            label="Mobile Number"
            placeholder="Enter Mobile Number"
            required
            disabled={disabled}
          />
          {/* {mobileVerification.status !== "idle" && (
            <div
              className={`text-sm mt-1 ${
                mobileVerification.status === "checking"
                  ? "text-blue-600"
                  : mobileVerification.status === "available"
                  ? "text-green-600"
                  : mobileVerification.status === "registered"
                  ? "text-red-600"
                  : "text-orange-600"
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
          )} */}
        </div>
      </div>

      <div className="mt-4 w-full">
        <RHFCheckbox
          name="billingAddressSame"
          label="Billing Details Same as above"
          // fieldLabel="Billing address same as above"
          disabled={disabled}
        />
      </div>
      <h2 className="text-2xl font-semibold mb-4 mt-4">
        Billing Name & Address
      </h2>
      <hr className="w-full border-t-1 border-[#B1B1B1]" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-6">
        <RHFTextField
          name="billingCompanyName"
          label="Company Name"
          placeholder="Enter Company Name"
          required
          disabled={disabled}
        />
        <RHFTextField
          name="billingWebsiteAddress"
          label="Website"
          placeholder="Enter Website"
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{
                  color: "#000",
                  pointerEvents: "none",
                  userSelect: "none",
                  mr: 0,
                }}
              >
                https://
              </InputAdornment>
            ),
          }}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-6">
        <RHFTextField
          name="billingAddress"
          label="Address"
          placeholder="Enter Address"
          required
          disabled={disabled}
        />
        <RHFCountrySelect
          name="billingCountry"
          label="Country"
          placeholder="Select Country"
          excludeCountries={
            watchedExhibitorCategory === "OVERSEAS_PARTICIPANT" ? ["India"] : []
          }
          disabled={watchedExhibitorCategory === "INDIAN_PARTICIPANT" || disabled}
          required
        />
        <RHFStateSelect
          name="billingState"
          countryFieldName="billingCountry"
          label="State"
          placeholder="Select State"
          required
          disabled={disabled}
        />
        <RHFCitySelect
          name="billingCity"
          countryFieldName="billingCountry"
          stateFieldName="billingState"
          label="City"
          placeholder="Select City"
          required
          disabled={disabled}
        />
        <RHFTextField
          name="billingPostalCode"
          type="number"
          label="Postal Code"
          placeholder="Enter Postal Code"
          required
          disabled={disabled}
        />
      </div>

      <h2 className="text-base font-semibold mt-6">Contact Person</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-2">
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full">
          <div className="w-full md:w-1/3">
            <RHFSearchSelect
              name="billingContactPersonPrefix"
              label="Title"
              placeholder="Title"
              required
              options={titleOptions.map((option) => option.value)}
              disabled={disabled}
            />
          </div>
          <div className="w-full md:w-2/3">
            <RHFTextField
              name="billingContactPersonFirstName"
              label="First Name"
              placeholder="Enter First Name"
              required
              disabled={disabled}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full">
          <RHFTextField
            name="billingContactPersonMiddleName"
            label="Middle Name"
            placeholder="Enter Middle Name"
            disabled={disabled}
          />
          <RHFTextField
            name="billingContactPersonLastName"
            label="Last Name"
            placeholder="Enter Last Name"
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-6">
        <RHFTextField
          name="billingContactPersonDesignation"
          label="Designation"
          placeholder="Enter Designation"
          required
          disabled={disabled}
        />
        <RHFTextField
          name="billingEmail"
          label="Email"
          placeholder="Enter Email"
          required
          disabled={disabled}
          />
        <RHFPhone
          name="billingContactNumber"
          label="Mobile Number"
          placeholder="Enter Mobile Number"
          required
          disabled={disabled}
          />
      </div>
    </>
  );
};
