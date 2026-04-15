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
  website: yup.string().url("Invalid URL format").optional(),
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
    billingWebsiteAddress: yup.string().url("Invalid URL format").optional(),

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
  tanNumber: yup.string().when("participationType", {
    is: (val: string) => val === "INDIAN_PARTICIPANT",
    then: (schema) =>
      schema
        .required("TAN Number is required")
        .matches(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, "Enter a valid TAN Number"),
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
  // iecNumber: yup
  //   .string()
  //   .optional()
  //   .test(
  //     "is-valid-iec",
  //     "Enter a valid IEC Number",
  //     (value) => !value || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
  //   ),
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
  directorPrefix: yup.string().required("Title is required"),
  directorFirstName: yup
    .string()
    .required("First Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),
  directorMiddleName: yup
    .string()
    .optional()
    .test("only-letters-middle-name", "Only letters are allowed", (value) => {
      if (!value) return true;
      return /^[a-zA-Z\s]*$/.test(value);
    }),
  directorLastName: yup
    .string()
    .required("Last Name is required")
    .matches(/^[a-zA-Z\s]*$/, "Only letters are allowed"),

    directors: yup
    .array(
      yup.object().shape({
        id: yup.string().required(),
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
      "word-count",
      "Company Profile must be less than 300 words",
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

  scheme: yup.string().required("Booth Type is required"),
  preferredFloor: yup
    .string()
    .required("Booth Location Preference is required"),
    preferredStallSides: yup
    .string()
    .required("Number of Sides is required")
    .test(
      "island-booth-only-on-ground",
      "Island Booth (4 Side Open) is only available on the ground floor",
      function (value) {
        // this.options.context is undefined unless context is passed to validation
        // So use parent to access sibling fields
        const { preferredFloor } = this.parent;
        // only perform check if user selected 4 (could be string or number cast to string)
        if (
          value === "4" &&
          preferredFloor &&
          preferredFloor !== "GROUND_FLOOR"
        ) {
          return false;
        }
        return true;
      }
    ),
    area: yup
    .string()
    .required("Area is required")
    .test(
      "is-number",
      "Required Area must be a number",
      (value) => !isNaN(Number(value)) && Number(value) > 0
    )
    .test(
      "area-range-and-multiple",
      "Required Area must be between the allowed range and in multiples of 3 according to Booth Type and Number of Sides",
      function (value) {
        const area = Number(value);
        const { scheme, preferredStallSides, productCategory, councilId } = this.parent;
        if (!scheme || isNaN(area)) return true; // skip, handled by required/is-number

        const hasBrandsOfIndia = councilId == 3 && productCategory.includes("1.8 Brands of India");
        if(hasBrandsOfIndia) {
          return true
        }

        // If preferredStallSides is 4, min 150 & max 500 regardless of scheme
        if (preferredStallSides == 4 || preferredStallSides === "4") {
          if (area < 150 || area > 500) {
            return this.createError({
              message: "For 4 Side Open, area must be between 150 and 500 sqm",
            });
          }
        } else if (scheme === "BARE") {
          if (area < 18 || area > 500) {
            return this.createError({
              message: "For Bare Space, area must be between 18 and 500 sqm",
            });
          }
        } else if (scheme === "SHELL") {
          if (area < 18 || area > 36) {
            return this.createError({
              message: "For Shell Scheme, area must be between 18 and 36 sqm",
            });
          }
        } else {
          return true;
        }
        if (area % 3 !== 0) {
          return this.createError({
            message: "Required Area must be in multiples of 3 sqm",
          });
        }
        return true;
      }
    ),
    tds: yup.string().required("TDS Deductor is required"),
    termsAndConditions: yup.boolean().required("Please accept the terms and conditions").oneOf([true], "Please accept the terms and conditions"),
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
    "tanNumber",
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
    "termsAndConditions",
  ],
};

// export const stepFields = {1:[], 2:[], 3:[], 4:[]};
