import * as yup from "yup";
import { ParticipationCategory } from "./config";

// ─── Area Validation Rules ────────────────────────────────────────────────────

/** Event/Space-Type specific area minimums (organiser rules). Override general minimum. */
export const AREA_MINIMUMS_BY_EVENT_TYPE: Record<string, Record<"SHELL" | "BARE", number>> = {
  IFEX: {
    SHELL: 12,
    BARE: 18,
  },
  CAST_INDIA_EXPO: {
    SHELL: 12,
    BARE: 36,
  },
};

/** General area validation rules */
export const AREA_VALIDATION_RULES = {
  GENERAL_MINIMUM: 12,  // Absolute minimum for any space
  MULTIPLE_OF: 3,       // Must be multiple of 3 sqm
} as const;

export function getAreaMinimumRequirement(eventKey: string, scheme: string): number {
  const normalizedAreaType: "SHELL" | "BARE" = scheme === "BARE" ? "BARE" : "SHELL";
  const eventRules = AREA_MINIMUMS_BY_EVENT_TYPE[eventKey];
  const eventSpecificMinimum = eventRules?.[normalizedAreaType] ?? 0;
  return Math.max(AREA_VALIDATION_RULES.GENERAL_MINIMUM, eventSpecificMinimum);
}

export function getAreaValidationMessage(eventKey: string, scheme: string): string {
  const normalizedAreaType: "SHELL" | "BARE" = scheme === "BARE" ? "BARE" : "SHELL";
  const minimum = getAreaMinimumRequirement(eventKey, normalizedAreaType);
  const spaceTypeLabel = normalizedAreaType === "BARE" ? "Bare Space" : "Shell Scheme";
  if (minimum > AREA_VALIDATION_RULES.GENERAL_MINIMUM) {
    return `Minimum area for ${spaceTypeLabel} under ${eventKey} is ${minimum} sqm`;
  }
  return `Area must be at least ${AREA_VALIDATION_RULES.GENERAL_MINIMUM} sqm`;
}

// ─── Exported regex patterns ──────────────────────────────────────────────────

export const panRegex  = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const gstRegex  = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const msmeRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
export const tanRegex  = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;

// ─── Address sub-schemas ──────────────────────────────────────────────────────

const addressSchema = yup.object({
  addressLine1: yup.string().required("Address Line 1 is required"),
  addressLine2: yup.string().optional(),
  city        : yup.string().required("City is required"),
  state       : yup.string().required("State/Province/Region is required"),
  country     : yup.string().required("Country is required"),
  zipCode     : yup
    .string()
    .required("Postal Code is required")
    .matches(/^[a-zA-Z0-9]{4,10}$/, "Postal Code must be 4-10 alphanumeric characters"),
});

const billingAddressSchema = yup.object({
  addressLine1: yup.string().optional(),
  addressLine2: yup.string().optional(),
  city        : yup.string().optional(),
  state       : yup.string().optional(),
  country     : yup.string().optional(),
  zipCode     : yup.string().optional(),
});

// ─── Schema ───────────────────────────────────────────────────────────────────

export const exhibitorRegistrationSchema = yup
  .object({
    // ── Step 1: Company & Contact Information ─────────────────────────────────

    participationType: yup
      .string()
      .required("Participation Category is required"),

    companyName: yup
      .string()
      .required("Company Name is required")
      .matches(
        /^[a-zA-Z0-9\s.,&'()\-/]*$/,
        "Company name can only contain letters, numbers, spaces, and characters like . , & ' ( ) - /"
      ),

    // IIF Membership
    iifMember: yup
      .boolean()
      .required("Please select if you are an IIF member"),
    iifMembershipNumber: yup.string().optional(),

    address: addressSchema.required(),

    // // Company contact
    // corporateEmail: yup
    //   .string()
    //   .required("Corporate Email is required")
    //   .email("Invalid email address"),
    // corporateMobile: yup
    //   .string()
    //   .required("Corporate Phone is required")
    //   .min(4, "Corporate Phone is required"),

    // Billing address — conditionally required for Indian participants (cross-field tests below)
    isBillingAddressSameAsRegistered: yup.boolean().optional(),
    billingAddress: billingAddressSchema,

    // Corporate website
    website: yup
      .string()
      .url("Invalid URL format (e.g., https://example.com)")
      .optional()
      .transform((v: string | undefined) => (v === "" ? undefined : v)),

    // Primary Contact Person
    name: yup
      .string()
      .required("Primary Contact Person Name is required")
      .matches(/^[a-zA-Z\s.]+$/, "Name should only contain letters"),
    designation: yup
      .string()
      .required("Primary Contact Person Designation is required")
      .matches(/^[a-zA-Z\s]+$/, "Designation should only contain letters"),
    mobile: yup
      .string()
      .required("Primary Contact Person Phone is required")
      .min(4, "Primary Contact Person Phone is required"),
    email: yup
      .string()
      .required("Primary Contact Person Email is required")
      .email("Invalid email address"),

    // Secondary contact (optional)
    secondaryContactPersonName: yup.string().optional(),
    secondaryContactPersonDesignation: yup.string().optional(),
    secondaryContactPersonPhoneInput: yup.string().optional(),
    secondaryContactPersonEmailInput: yup
      .string()
      .email("Invalid email address")
      .optional()
      .transform((v: string | undefined) => (v === "" ? undefined : v)),

    // Accounts person (optional)
    accountsPersonCopyFrom: yup.string().optional(),
    accountsPersonContactPersonName: yup.string().optional(),
    accountsPersonContactPersonDesignation: yup.string().optional(),
    accountsPersonContactPersonPhoneInput: yup.string().optional(),
    accountsPersonContactPersonEmailInput: yup
      .string()
      .email("Invalid email address")
      .optional()
      .transform((v: string | undefined) => (v === "" ? undefined : v)),

    fasciaName: yup.string().optional(),

    // Registration email
    companyEmail: yup
      .string()
      .required("Email Address is required")
      .email("Invalid email address"),
    companyMobile: yup
      .string()
      .required("Company Mobile is required")
      .min(4, "Company Mobile is required"),

    // PAN — conditionally required for Indian participants (cross-field tests below)
    panNumber: yup
      .string()
      .optional()
      .transform((v: string | undefined) => (typeof v === "string" ? v.toUpperCase().trim() : v))
      .matches(/^[A-Z0-9]*$/, "PAN can only contain letters and numbers"),

    gstNumber: yup
      .string()
      .transform((v: string | undefined) => (typeof v === "string" ? v.toUpperCase().trim() : v))
      .when('participationType', {
        is: "INDIAN_PARTICIPANT",
        then: (schema) => schema.required('GST Number is required for Indian participants'),
        otherwise: (schema) => schema.optional(),
      })
      .matches(/^[A-Z0-9]*$/, "GST Number can only contain letters and numbers"),

    // ── Step 2: Business Details ──────────────────────────────────────────────

    registeredWithMsme: yup
      .boolean()
      .typeError("Please select if you have an MSME number")
      .required("Please select if you have an MSME number"),

    msmeNumber: yup.string().optional(),

    businessIds: yup
      .mixed<string | number>()
      .required("Business Entity Type is required"),

    otherBusiness: yup.string().optional(),

    categoryIds: yup
      .mixed<string | number>()
      .required("Please select at least one option for what you provide"),

    otherCategory: yup.string().optional(),

    eventType: yup
      .string()
      .required("Participation Interest is required"),

    // ── Step 3: Booth Details ─────────────────────────────────────────────────

    currency: yup.string().required("Currency is required"),

    scheme: yup
      .string()
      .oneOf(["SHELL", "BARE"], "Please select a booth type")
      .required("Please select a booth type"),

    hasPreferredLocation: yup
      .boolean()
      .typeError("Please indicate if you want a premium location")
      .required("Please indicate if you want a premium location"),

    // preferredFloor: yup.string().optional().default("GROUND_FLOOR"),

    // preferredStallSides: yup
    //   .number()
    //   .typeError("Please select number of open sides")
    //   .integer()
    //   .min(1)
    //   .max(4)
    //   .default(1),

    tds: yup.boolean().optional(),

    area: yup
      .number()
      .typeError("Area must be a number")
      .required("Area is required")
      .min(12, "Area must be at least 12 sqm")
      .test(
        "multiple-of-3",
        "Area must be in multiples of 3 sqm (e.g., 12, 15, 18, 21, 24)",
        (val) => val == null || val % 3 === 0
      ),

    tdsPercentage: yup
      .number()
      .typeError("Please select TDS percentage")
      .oneOf([0, 2, 10], "TDS percentage must be 0, 2, or 10")
      .optional()
      .nullable(),

    tanNumber: yup
      .string()
      .optional()
      .transform((v: string | undefined) => (typeof v === "string" ? v.toUpperCase().trim() : v))
      .matches(/^[A-Z0-9]*$/, "TAN Number can only contain letters and numbers"),

    primaryPreferredStall: yup
      .string()
      .when('hasPreferredLocation', {
        is: true,
        then: (schema) => schema.required('Primary Preferred Stall is required when preferred location is selected'),
        otherwise: (schema) => schema.optional(),
      }),
    secondaryPreferredStall: yup.string().optional(),

    // UI-only helper fields
    _isBillingCopied: yup.boolean().optional(),
  })

  // ── Cross-field tests ────────────────────────────────────────────────────────

  .test("iif-membership-required", "", function (data) {
    if (data?.iifMember === true && !data?.iifMembershipNumber?.trim()) {
      return this.createError({ path: "iifMembershipNumber", message: "IIF Membership Number is required for IIF members" });
    }
    return true;
  })

  .test("msme-required", "", function (data) {
    if (data?.registeredWithMsme === true && !data?.msmeNumber?.trim()) {
      return this.createError({ path: "msmeNumber", message: "MSME/Udyog Number is required if you have one" });
    }
    return true;
  })

  .test("msme-format", "", function (data) {
    if (data?.registeredWithMsme === true && data?.msmeNumber?.trim()) {
      if (!msmeRegex.test(data.msmeNumber.trim())) {
        return this.createError({ path: "msmeNumber", message: "Invalid MSME format. Should be like UDYAM-XX-00-0000000" });
      }
    }
    return true;
  })

  .test("area-event-minimum", "", function (data) {
    const area = Number(data?.area);
    const scheme = String(data?.scheme ?? "");
    const eventKey = String(data?.eventType ?? "");
    if (!scheme || !Number.isFinite(area)) return true;
    if (area < getAreaMinimumRequirement(eventKey, scheme)) {
      return this.createError({ path: "area", message: getAreaValidationMessage(eventKey, scheme) });
    }
    return true;
  })

  .test("tds-percentage-required", "", function (data) {
    if (data?.tds === true && data?.tdsPercentage == null) {
      return this.createError({ path: "tdsPercentage", message: "Please select TDS percentage" });
    }
    return true;
  })

  .test("tan-required", "", function (data) {
    if (data?.tds === true && data?.tdsPercentage === 2 && !data?.tanNumber?.trim()) {
      return this.createError({ path: "tanNumber", message: "TAN Number is required when TDS is applicable" });
    }
    return true;
  })

  .test("tan-format", "", function (data) {
    if (data?.tds === true && data?.tdsPercentage === 2 && data?.tanNumber?.trim()) {
      if (!tanRegex.test(data.tanNumber.trim())) {
        return this.createError({ path: "tanNumber", message: "Invalid TAN format (e.g. ABCD01234E)" });
      }
    }
    return true;
  })

  // ── Indian-participant-only cross-field tests ────────────────────────────────

  .test("indian-pan-required", "", function (data) {
    if (data?.participationType !== ParticipationCategory.INDIAN_PARTICIPANT) return true;
    if (!String(data?.panNumber ?? "").trim()) {
      return this.createError({ path: "panNumber", message: "Company PAN Number is required" });
    }
    return true;
  })

  .test("indian-pan-format", "", function (data) {
    if (data?.participationType !== ParticipationCategory.INDIAN_PARTICIPANT) return true;
    const pan = String(data?.panNumber ?? "").trim();
    if (pan && !panRegex.test(pan)) {
      return this.createError({ path: "panNumber", message: "Invalid PAN format (e.g. ABCDE1234F)" });
    }
    return true;
  })

  .test("indian-iif-member-required", "", function (data) {
    if (data?.participationType !== ParticipationCategory.INDIAN_PARTICIPANT) return true;
    if (typeof data?.iifMember !== "boolean") {
      return this.createError({ path: "iifMember", message: "Please select if you are an IIF member" });
    }
    return true;
  })

  .test("indian-billing-addressLine1", "", function (data) {
    if (data?.participationType !== ParticipationCategory.INDIAN_PARTICIPANT) return true;
    if (data?.isBillingAddressSameAsRegistered) return true;
    if (!(data?.billingAddress?.addressLine1 ?? "").trim()) {
      return this.createError({ path: "billingAddress.addressLine1", message: "Billing Address Line 1 is required" });
    }
    return true;
  })

  .test("indian-billing-country", "", function (data) {
    if (data?.participationType !== ParticipationCategory.INDIAN_PARTICIPANT) return true;
    if (data?.isBillingAddressSameAsRegistered) return true;
    if (!(data?.billingAddress?.country ?? "").trim()) {
      return this.createError({ path: "billingAddress.country", message: "Billing Country is required" });
    }
    return true;
  })

  .test("indian-billing-state", "", function (data) {
    if (data?.participationType !== ParticipationCategory.INDIAN_PARTICIPANT) return true;
    if (data?.isBillingAddressSameAsRegistered) return true;
    if (!(data?.billingAddress?.state ?? "").trim()) {
      return this.createError({ path: "billingAddress.state", message: "Billing State/Province/Region is required" });
    }
    return true;
  })

  .test("indian-billing-city", "", function (data) {
    if (data?.participationType !== ParticipationCategory.INDIAN_PARTICIPANT) return true;
    if (data?.isBillingAddressSameAsRegistered) return true;
    if (!(data?.billingAddress?.city ?? "").trim()) {
      return this.createError({ path: "billingAddress.city", message: "Billing City is required" });
    }
    return true;
  })

  .test("indian-billing-zipCode", "", function (data) {
    if (data?.participationType !== ParticipationCategory.INDIAN_PARTICIPANT) return true;
    if (data?.isBillingAddressSameAsRegistered) return true;
    if (!/^[a-zA-Z0-9]{4,10}$/.test((data?.billingAddress?.zipCode ?? "").trim())) {
      return this.createError({ path: "billingAddress.zipCode", message: "Billing Postal Code must be 4-10 alphanumeric characters" });
    }
    return true;
  });

export type ExhibitorRegistrationFormData = yup.InferType<typeof exhibitorRegistrationSchema>;

