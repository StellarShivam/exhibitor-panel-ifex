import * as yup from "yup";

export const buyerRegistrationSchema = yup.object().shape({
  participationType: yup.string().required("Buyer Category is required"),

  councilId: yup.string().when("participationType", {
    is: (val: string) => val === "OVERSEAS_BUYER",
    then: (schema) => schema.required("Exhibitor Council is required"),
    otherwise: (schema) => schema.optional(),
  }),

  otherCouncilName: yup.string().when("councilId", {
    is: (val: string) => val === "16",
    then: (schema) =>
      schema.required("Please specify the other buyer council"),
    otherwise: (schema) => schema.optional(),
  }),

  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  companyName: yup
    .string()
    .required("Company Name is required")
    .matches(
      /^[a-zA-Z0-9\s.,&'()-/]*$/,
      "Company name can only contain letters, numbers, spaces, and characters like . , & ' ( ) - /"
    ),
  prefix: yup.string().required("Title is required"),
  firstName: yup
    .string()
    .required("First Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  middleName: yup.string().optional(),
  lastName: yup
    .string()
    .required("Last Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  designation: yup
    .string()
    .required("Designation is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postalCode: yup
    .string()
    .required("Postal code is required")
    .when("country", {
      is: (val: string) => val === "India",
      then: (schema) =>
        schema.matches(/^[1-9][0-9]{5}$/, "Enter a valid postal code"),
      otherwise: (schema) => schema,
    }),
  country: yup.string().required("Country is required"),
  mobileNumber: yup
    .string()
    .min(6, "Mobile Number is required")
    .test("valid-mobile", "Enter a valid 10 digit mobile number", (value) => {
      if (!value) return false;
      if (value.startsWith("+91")) {
        return /^\+91\d{10}$/.test(value);
      }
      return true;
    }),
  whatsAppSame: yup.boolean().optional(),
  whatsappMobileNumber: yup.string().optional(),
  website: yup.string().url("Invalid website URL").optional(),
  landlineNumber: yup.string().optional(),
  isFirstVisiting: yup.string().required("This field is required"),
  visitedYear: yup.array(yup.string()).when("isFirstVisiting", {
    is: (val: string) => val === "No",
    then: (schema) => schema.min(1, "Year of Visit is required"),
    otherwise: (schema) => schema.optional(),
  }),
  sourceOfRegistration: yup.array(yup.string()).when("participationType", {
    is: (val: string) =>
      val === "OVERSEAS_BUYER" || val === "DOMESTIC_VOLUME_BUYER",
    then: (schema) => schema.min(1, "Source of Information is required"),
    otherwise: (schema) => schema.optional(),
  }),
  natureOfBusiness: yup.array(yup.string()).when("participationType", {
    is: (val: string) =>
      val === "OVERSEAS_BUYER" || val === "DOMESTIC_VOLUME_BUYER",
    then: (schema) => schema.min(1, "Nature of Business is required"),
    otherwise: (schema) => schema.optional(),
  }),
  otherNatureOfBusiness: yup.string().when("natureOfBusiness", {
    is: (val: string) => val?.includes("Others"),
    then: (schema) => schema.required("Please specify Others"),
    otherwise: (schema) => schema.optional(),
  }),
  turnOver2223: yup.string().when("participationType", {
    is: (val: string) => val === "DOMESTIC_VOLUME_BUYER",
    then: (schema) => schema.required("Turnover for 2022-23 is required"),
    otherwise: (schema) => schema.optional(),
  }),
  turnOver2324: yup.string().when("participationType", {
    is: (val: string) => val === "DOMESTIC_VOLUME_BUYER",
    then: (schema) => schema.required("Turnover for 2023-24 is required"),
    otherwise: (schema) => schema.optional(),
  }),
  turnOver2425: yup.string().when("participationType", {
    is: (val: string) => val === "DOMESTIC_VOLUME_BUYER",
    then: (schema) => schema.required("Turnover for 2024-25 is required"),
    otherwise: (schema) => schema.optional(),
  }),
  productGroups: yup
    .array(
      yup.object().shape({
        title: yup.string().required(),
        values: yup.array(yup.mixed<string | number>()).min(1).required(),
      })
    )
    .min(1, "Product Category is required"),
  socialMediaComms: yup.array(yup.string()).optional(),

  buyerCompanyName: yup.string().optional(),
  buyerCompanyCountries: yup.array(yup.string()).optional(),
  gstNumber: yup.string().when("participationType", {
    is: (val: string) => val === "DOMESTIC_VOLUME_BUYER",
    then: (schema) =>
      schema
        .required("GST Number is required")
        .matches(
          /^[0-9A-Z]{15}$/,
          "Enter a valid GST Number"
        ),
    otherwise: (schema) => schema.optional(),
  }),

  isOnlineSeller: yup.string().when("participationType", {
    is: (val: string) => val === "DOMESTIC_VOLUME_BUYER",
    then: (schema) => schema.required("Online Seller is required"),
    otherwise: (schema) => schema.optional(),
  }),
  onlineSellerAccounts: yup
    .array(yup.string())
    .when(["participationType", "isOnlineSeller"], {
      is: (participationType: string, isOnlineSeller: string) =>
        participationType === "DOMESTIC_VOLUME_BUYER" &&
        isOnlineSeller === "Yes",
      then: (schema) => schema.min(1, "Ecommerce Platform is required"),
      otherwise: (schema) => schema.optional(),
    }),
  otherOnlineSellerPlatform: yup
    .string()
    .when(["participationType", "isOnlineSeller", "onlineSellerAccounts"], {
      is: (
        participationType: string,
        isOnlineSeller: string,
        onlineSellerAccounts: string[]
      ) =>
        participationType === "DOMESTIC_VOLUME_BUYER" &&
        isOnlineSeller === "Yes" &&
        onlineSellerAccounts?.includes("Others"),
      then: (schema) =>
        schema.required("Please specify Other Ecommerce Platform"),
      otherwise: (schema) => schema.optional(),
    }),
  passportNumber: yup.string().when("participationType", {
    is: (val: string) => val === "OVERSEAS_BUYER",
    then: (schema) =>
      schema
        .required("Passport number is required")
        .matches(/^[A-Z0-9]{6,15}$/, "Enter a valid passport number"),
    otherwise: (schema) => schema.optional(),
  }),
  dateOfIssueForPassport: yup.string().when("participationType", {
    is: (val: string) => val === "OVERSEAS_BUYER",
    then: (schema) => schema.required("Passport date of issue is required"),
    otherwise: (schema) => schema.optional(),
  }),
  dateOfExpiryForPassport: yup.string().when("participationType", {
    is: (val: string) => val === "OVERSEAS_BUYER",
    then: (schema) =>
      schema
        .required("Passport date of expiry is required")
        .test(
          "expiry-after-issue",
          "Expiry date must be after the date of issue",
          function (value) {
            const { dateOfIssueForPassport } = this.parent;
            if (!dateOfIssueForPassport || !value) return true;
            return new Date(value) > new Date(dateOfIssueForPassport);
          }
        ),
    otherwise: (schema) => schema.optional(),
  }),
  passportFrontUrl: yup.string().when("participationType", {
    is: (val: string) => val === "OVERSEAS_BUYER",
    then: (schema) => schema.required("Passport Front upload is required"),
    otherwise: (schema) => schema.optional(),
  }),
  passportBackUrl: yup.string().optional(),

  profilePhotoUrl: yup.string().when("participationType", {
    is: (val: string) => val === "OVERSEAS_BUYER",
    then: (schema) => schema.required("Passport Photograph upload is required"),
    otherwise: (schema) => schema.optional(),
  }),

  isImportIndia: yup.string().when("participationType", {
    is: (val: string) => val === "OVERSEAS_BUYER",
    then: (schema) => schema.required("This field is required"),
    otherwise: (schema) => schema.optional(),
  }),
  importValue: yup
    .string()
    .when("isImportIndia", {
      is: (val: string) => val === "Yes",
      then: (schema) =>
        schema
          .required("Import Value is required")
          .test(
            "greater-than-zero",
            "Enter a valid Import Value",
            (value) => {
              if (!value) return false;
              return parseFloat(value) > 0;
            }
          ),
      otherwise: (schema) => schema.optional(),
    }),

    businessCardUrl: yup.string().optional(),
    linkedInUrl: yup.string().when("socialMediaComms", {
      is: (val: string[] = []) => Array.isArray(val) && val.includes("LinkedIn"),
      then: (schema) =>
        schema
          .required("LinkedIn URL is required")
          .url("Enter a valid LinkedIn URL"),
      otherwise: (schema) => schema.optional(),
    }),
    twitterUrl: yup.string().when("socialMediaComms", {
      is: (val: string[] = []) => Array.isArray(val) && val.includes("Twitter"),
      then: (schema) =>
        schema
          .required("Twitter URL is required")
          .url("Enter a valid Twitter URL"),
      otherwise: (schema) => schema.optional(),
    }),
    instagramUrl: yup.string().when("socialMediaComms", {
      is: (val: string[] = []) => Array.isArray(val) && val.includes("Instagram"),
      then: (schema) =>
        schema
          .required("Instagram URL is required")
          .url("Enter a valid Instagram URL"),
      otherwise: (schema) => schema.optional(),
    }),
    facebookUrl: yup.string().when("socialMediaComms", {
      is: (val: string[] = []) => Array.isArray(val) && val.includes("Facebook"),
      then: (schema) =>
        schema
          .required("Facebook URL is required")
          .url("Enter a valid Facebook URL"),
      otherwise: (schema) => schema.optional(),
    }),
    pinterestUrl: yup.string().when("socialMediaComms", {
      is: (val: string[] = []) => Array.isArray(val) && val.includes("Pinterest"),
      then: (schema) =>
        schema
          .required("Pinterest URL is required")
          .url("Enter a valid Pinterest URL"),
      otherwise: (schema) => schema.optional(),
    }),
    youtubeUrl: yup.string().when("socialMediaComms", {
      is: (val: string[] = []) => Array.isArray(val) && val.includes("YouTube"),
      then: (schema) =>
        schema
          .required("YouTube URL is required")
          .url("Enter a valid YouTube URL"),
      otherwise: (schema) => schema.optional(),
    }),
});

export const stepFields = {
  1: [
    "companyName",
    "companyEmail",
    "companyPhone",
    "companyAddressLine1",
    "companyAddressLine2",
    "companyCountry",
    "companyCity",
    "companyState",
    "companyPostalCode",
    "billingAddressSame",
    "billingAddressLine1",
    "billingAddressLine2",
    "billingCountry",
    "billingCity",
    "billingState",
    "billingPostalCode",
  ],
  2: [
    "contactPersonTitle",
    "contactPersonFirstName",
    "contactPersonLastName",
    "contactPersonEmail",
    "contactPersonMobileNumber",
    "accountPersonSame",
    "accountPersonTitle",
    "accountPersonFirstName",
    "accountPersonLastName",
    "accountPersonEmail",
    "accountPersonMobileNumber",
  ],
  3: [
    "bookingViaAssociation",
    "associationName",
    "registeredWithMsme",
    "msmeNumber",
    "participatedEarlier",
    "participationYear",
  ],
  4: [
    "industry",
    "otherIndustry",
    "productCategory",
    "otherProductCategory",
    "departmentCategory",
    "otherDepartmentCategory",
    "interestedInSponsorship",
    "mainObjectives",
    "otherObjective",
  ],
  5: ["boothTypePreference", "totalAreaRequired", "tds", "tanNumber"],
};
