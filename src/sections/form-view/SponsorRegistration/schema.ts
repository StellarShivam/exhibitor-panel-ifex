import * as yup from "yup";

export const exhibitorRegistrationSchema = yup.object().shape({
  participationType: yup.string().required("Exhibitor Category is required"),
  councilId: yup.string().when("participationType", {
    is: (val: string) => val === "INDIAN_PARTICIPANT",
    then: (schema) => schema.required("Exhibitor Council is required"),
    otherwise: (schema) => schema.optional(),
  }),

  otherCouncilName: yup.string().when("councilId", {
    is: (val: string) => val === "16",
    then: (schema) =>
      schema.required("Please specify the other exhibitor council"),
    otherwise: (schema) => schema.optional(),
  }),

  companyName: yup
    .string()
    .required("Company Name is required")
    .matches(
      /^[a-zA-Z0-9\s.,&'()-/]*$/,
      "Company name can only contain letters, numbers, spaces, and characters like . , & ' ( ) - /"
    ),
  website: yup
    .string()
    .optional()
    .test(
      "no-protocol",
      "Please enter only the domain name without http:// or https://",
      (value) => {
        if (!value) return true;
        return !value.startsWith("http://") && !value.startsWith("https://");
      }
    )
    .test("valid-url", "Invalid URL format", (value) => {
      if (!value) return true;
      try {
        new URL(`https://${value}`);
        return true;
      } catch {
        return false;
      }
    })
    .transform((value) => {
      if (!value) return value;
      // Remove any protocol if accidentally added
      return value.replace(/^https?:\/\//, "");
    }),
  address: yup.string().required("Address is required"),
  country: yup.string().required("Country is required"),
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

  contactPersonPrefix: yup.string().required("Title is required"),
  contactPersonFirstName: yup
    .string()
    .required("First Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  contactPersonMiddleName: yup
    .string()
    .test("only-letters-middle-name", "Only letters are allowed", (value) => {
      if (!value) return true;
      return /^[a-zA-Z\s]*$/.test(value);
    })
    .optional(),
  contactPersonLastName: yup
    .string()
    .required("Last Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  designation: yup
    .string()
    .required("Designation is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile: yup
    .string()
    .min(6, "Mobile Number is required")
    .test("valid-mobile", "Enter a valid mobile number", (value) => {
      if (!value) return false;
      if (value.startsWith("+91")) {
        return /^\+91\d{10}$/.test(value);
      }
      return true;
    }),

  billingAddressSame: yup.boolean().optional(),

  billingCompanyName: yup
    .string()
    .required("Billing Company Name is required")
    .matches(
      /^[a-zA-Z0-9\s.,&'()-/]*$/,
      "Company name can only contain letters, numbers, spaces, and characters like . , & ' ( ) - /"
    ),
  billingWebsiteAddress: yup
    .string()
    .optional()
    .test(
      "no-protocol",
      "Please enter only the domain name without http:// or https://",
      (value) => {
        if (!value) return true;
        return !value.startsWith("http://") && !value.startsWith("https://");
      }
    )
    .test("valid-url", "Invalid URL format", (value) => {
      if (!value) return true;
      try {
        new URL(`https://${value}`);
        return true;
      } catch {
        return false;
      }
    })
    .transform((value) => {
      if (!value) return value;
      // Remove any protocol if accidentally added
      return value.replace(/^https?:\/\//, "");
    }),

  billingAddress: yup.string().required("Billing Address is required"),
  billingCountry: yup.string().required("Billing Country is required"),
  billingCity: yup.string().required("Billing City is required"),
  billingState: yup.string().required("Billing State is required"),
  billingPostalCode: yup
    .string()
    .required("Billing Postal Code is required")
    .when("billingCountry", {
      is: (val: string) => val === "India",
      then: (schema) =>
        schema.matches(/^[1-9][0-9]{5}$/, "Enter a valid postal code"),
      otherwise: (schema) => schema,
    }),

  billingContactPersonPrefix: yup.string().required("Title is required"),
  billingContactPersonFirstName: yup
    .string()
    .required("First Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  billingContactPersonMiddleName: yup
    .string()
    .optional()
    .test("only-letters-middle-name", "Only letters are allowed", (value) => {
      if (!value) return true;
      return /^[a-zA-Z\s]*$/.test(value);
    }),
  billingContactPersonLastName: yup
    .string()
    .required("Last Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  billingContactPersonDesignation: yup
    .string()
    .required("Designation is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  billingEmail: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  billingContactNumber: yup
    .string()
    .min(6, "Mobile Number is required")
    .test("valid-mobile", "Enter a valid mobile number", (value) => {
      if (!value) return false;
      if (value.startsWith("+91")) {
        return /^\+91\d{10}$/.test(value);
      }
      return true;
    }),

  panNumber: yup.string().when("participationType", {
    is: (val: string) => val === "INDIAN_PARTICIPANT",
    then: (schema) =>
      schema
        .required("PAN Number is required")
        .test(
          "is-valid-pan",
          "Enter a valid PAN Number",
          (value) => !value || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)
        ),
    otherwise: (schema) => schema.optional(),
  }),
  gstNumber: yup.string().when("participationType", {
    is: (val: string) => val === "INDIAN_PARTICIPANT",
    then: (schema) =>
      schema
        .required("GST Number is required")
        .matches(
          /^[0-9A-Z]{15}$/,
          "Enter a valid GST Number"
        ),
    otherwise: (schema) => schema.optional(),
  }),
  vatNumber: yup.string().when("participationType", {
    is: (val: string) => val === "OVERSEAS_PARTICIPANT",
    then: (schema) => schema.required("VAT Number is required"),
    otherwise: (schema) => schema.optional(),
  }),
  gstState: yup.string().when("participationType", {
    is: (val: string) => val === "INDIAN_PARTICIPANT",
    then: (schema) => schema.required("GST State is required"),
    otherwise: (schema) => schema.optional(),
  }),
  stateCode: yup.string().when("participationType", {
    is: (val: string) => val === "INDIAN_PARTICIPANT",
    then: (schema) =>
      schema
        .required("GST State Code is required")
        .matches(/^(0[1-9]|1[0-9]|2[0-9]|3[0-8])$/, "Enter a valid state code"),
    otherwise: (schema) => schema.optional(),
  }),
  exportMarkets: yup.array(yup.string()).optional(),
  otherExportMarket: yup.string().when("exportMarkets", {
    is: (val: string[] | undefined) =>
      Array.isArray(val) && val.includes("Others"),
    then: (schema) => schema.required("Specify Other Export Market"),
    otherwise: (schema) => schema.optional(),
  }),
  iecNumber: yup
    .string()
    .optional()
    .test(
      "is-valid-iec",
      "Enter a valid IEC Number",
      (value) => !value || /^[A-Z0-9]{10}$/.test(value)
    ),

    isWomenEntreprenuer:yup.string().optional(),
  // cinNumber: yup
  //   .string()
  //   .optional()
  //   .test(
  //     "is-valid-cin",
  //     "Enter a valid CIN Number",
  //     (value) =>
  //       !value ||
  //       /^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value)
  //   ),
  // dinNumber: yup
  //   .string()
  //   .optional()
  //   .test(
  //     "is-valid-din",
  //     "Enter a valid DIN Number",
  //     (value) => !value || /^[0-9]{8}$/.test(value)
  //   ),
  directorPrefix: yup.string().optional(),
  directorFirstName: yup
    .string()
    .optional()
    .test("only-letters-first-name", "Only letters are allowed", (value) => {
      if (!value) return true;
      return /^[a-zA-Z\s]*$/.test(value);
    }),
  directorMiddleName: yup
    .string()
    .optional()
    .test("only-letters-middle-name", "Only letters are allowed", (value) => {
      if (!value) return true;
      return /^[a-zA-Z\s]*$/.test(value);
    }),
  directorLastName: yup
    .string()
    .optional()
    .test("only-letters-last-name", "Only letters are allowed", (value) => {
      if (!value) return true;
      return /^[a-zA-Z\s]*$/.test(value);
    }),
  directors: yup
    .array(
      yup.object().shape({
        id: yup.string().optional(),
        prefix: yup.string().required("Title is required"),
        firstName: yup
          .string()
          .required("First Name is required")
          .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
        middleName: yup
          .string()
          .optional()
          .test(
            "only-letters-middle-name",
            "Only letters are allowed",
            (value) => {
              if (!value) return true;
              return /^[a-zA-Z\s]*$/.test(value);
            }
          ),
        lastName: yup
          .string()
          .required("Last Name is required")
          .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
      })
    )
    .optional()
    .default([]),

  isMsme: yup.string().required("Registered with MSME is required"),
  msmeNumber: yup.string().when("isMsme", {
    is: (val: string) => val === "Yes",
    then: (schema) =>
      schema
        .required("MSME Number is required")
        .matches(/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/, "Enter a valid MSME Number"),
    otherwise: (schema) => schema.optional(),
  }),
  companyBio: yup
    .string()
    .required("Company Profile is required")
    .test(
      "min-words",
      "Company Profile must be at least 75 words",
      (value) => {
        if (!value) return true;
        const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
        return wordCount >= 75;
      }
    )
    .test(
      "max-words",
      "Company Profile must not exceed 300 words",
      (value) => {
        if (!value) return true;
        const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
        return wordCount <= 300;
      }
    ),

  businessNature: yup
    .array(yup.string())
    .min(1, "Nature of Business is required"),
  otherBusinessNature: yup.string().when("businessNature", {
    is: (val: string[] | undefined) =>
      Array.isArray(val) && val.includes("Others"),
    then: (schema) => schema.required("Specify Other"),
    otherwise: (schema) => schema.optional(),
  }),
  productGroupId: yup.string().required("Product Group is required"),
  productCategory: yup
    .array(yup.string())
    .min(1, "Product Category is required"),
  otherProductCategory: yup.string().when("productCategory", {
    is: (val: string[] | undefined) =>
      Array.isArray(val) && val.includes("Others"),
    then: (schema) => schema.required("Specify Other Product Category"),
    otherwise: (schema) => schema.optional(),
  }),
  productSubCategory: yup.array(yup.string()).optional(),

  sponsorshipType: yup.string().required("Sponsorship Category is required"),
  sponsorshipPricingCategory: yup
    .string()
    .required("Sponsorship Package is required"),
  tds: yup.string().required("TDS Deductor is required"),
  tanNumber: yup.string().when([ "tds"], {
    is: (tds: string) => tds === "Yes",
    then: (schema) =>
      schema
        .required("TAN Number is required")
        .matches(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, "Enter a valid TAN Number"),
    otherwise: (schema) => schema.optional(),
  }),
  tdsPercentage: yup.string().when("tds", {
    is: (val: string) => val === "Yes",
    then: (schema) => schema.required("TDS Percentage is required"),
    otherwise: (schema) => schema.optional(),
  }),
  termsAndConditions: yup
    .boolean()
    .optional(),
    status: yup.string().required("Status is required"),
});

export const stepFields = {
  1: [
    "participationType",
    "councilId",
    "otherCouncilName",
    "companyName",
    "website",
    "address",
    "country",
    "city",
    "state",
    "postalCode",
    "contactPersonPrefix",
    "contactPersonFirstName",
    "contactPersonMiddleName",
    "contactPersonLastName",
    "designation",
    "email",
    "mobile",
    "billingAddressSame",
    "billingCompanyName",
    "billingWebsiteAddress",
    "billingAddress",
    "billingCountry",
    "billingCity",
    "billingState",
    "billingPostalCode",
    "billingContactPersonPrefix",
    "billingContactPersonFirstName",
    "billingContactPersonMiddleName",
    "billingContactPersonLastName",
    "billingContactPersonDesignation",
    "billingEmail",
    "billingContactNumber",
  ],
  2: [
    "panNumber",
    "gstNumber",
    "gstState",
    "stateCode",
    "vatNumber",
    "exportMarkets",
    "otherExportMarkets",
    "iecNumber",
    "cinNumber",
    "dinNumber",
    "directorPrefix",
    "directorFirstName",
    "directorMiddleName",
    "directorLastName",
    "directors",
    "isMsme",
    "msmeNumber",
    "companyBio",
  ],
  3: [
    "businessNature",
    "otherBusinessNature",
    "productGroupId",
    "productCategory",
    "otherProductCategory",
    "productSubCategory",
  ],
  4: [
    "scheme",
    "preferredFloor",
    "preferredStallSides",
    "area",
    "tds",
    "tanNumber",
    "tdsPercentage",
    "termsAndConditions",
  ],
};

// export const stepFields = {1:[], 2:[], 3:[], 4:[]};
