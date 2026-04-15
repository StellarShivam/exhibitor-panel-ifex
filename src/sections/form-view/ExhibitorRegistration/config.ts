import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";

import { exhibitorRegistrationSchema, getAreaMinimumRequirement, getAreaValidationMessage, msmeRegex, tanRegex } from "./schema";
import { PricingPreview } from "./PricingPreview";
import type {
    FieldOption,
    SchemaFormRendererConfig,
} from "src/context/SchemaFormRenderer";
import { verifyDocument, checkEmailRegistered, checkMobileRegistered } from "src/api/utils";
import { ImportantNotes } from "./ImportantNotes";
import { IifNonMemberNotice } from "./IifNonMemberNotice";
import { BoothTypeInfo } from "./BoothTypeInfo";





export enum ParticipationCategory {
    INDIAN_PARTICIPANT = "INDIAN_PARTICIPANT",
    OVERSEAS_PARTICIPANT = "OVERSEAS_PARTICIPANT",
}

export enum PreferredFloor {
    GROUND_FLOOR = "GROUND_FLOOR",
    FIRST_FLOOR = "FIRST_FLOOR",
}

// ─── Participation Category Options ───────────────────────────────────────────
const PARTICIPATION_CATEGORY_OPTIONS: FieldOption[] = [
    { label: "Indian participant", value: ParticipationCategory.INDIAN_PARTICIPANT },
    { label: "Overseas participant", value: ParticipationCategory.OVERSEAS_PARTICIPANT },
];

const YES_NO_BOOL_OPTIONS: FieldOption[] = [
    { label: "Yes", value: true },
    { label: "No", value: false },
];

const PREFERRED_FLOOR_OPTIONS: FieldOption[] = [
    { label: "Ground Floor", value: PreferredFloor.GROUND_FLOOR },
    { label: "First Floor", value: PreferredFloor.FIRST_FLOOR },
];

const PREFERRED_STALL_SIDE_OPTIONS: FieldOption[] = [
    { label: "One side", value: 1 },
    { label: "Two sides", value: 2 },
    { label: "Three sides", value: 3 },
    { label: "Four sides", value: 4 },
];


const BUSINESS_ENTITY_OPTIONS: FieldOption[] = [
    { label: "Casting Manufacturers / Foundry", value: "CASTING_MANUFACTURERS_FOUNDRY" },
    { label: "Equipment Suppliers", value: "EQUIPMENT_SUPPLIERS" },
    { label: "Raw Material Suppliers", value: "RAW_MATERIAL_SUPPLIERS" },
    { label: "Service Providers / Consultants", value: "SERVICE_PROVIDERS_CONSULTANTS" },
    { label: "Other", value: "OTHER" },
];

const WE_DEAL_WITH_OPTIONS: FieldOption[] = [
    { label: "Auxiliary Equipment", value: "AUXILIARY_EQUIPMENT" },
    { label: "Casting Machines & Accessories", value: "CASTING_MACHINES_ACCESSORIES" },
    { label: "Complete Foundry Plants", value: "COMPLETE_FOUNDRY_PLANTS" },
    { label: "Consultancy", value: "CONSULTANCY" },
    { label: "Die Casting Machines and Accessories", value: "DIE_CASTING_MACHINES_ACCESSORIES" },
    { label: "Environment Control", value: "ENVIRONMENT_CONTROL" },
    { label: "Foundry Processes", value: "FOUNDRY_PROCESSES" },
    { label: "Foundry Services", value: "FOUNDRY_SERVICES" },
    { label: "Heat Treatment and Drying", value: "HEAT_TREATMENT_DRYING" },
    { label: "Knockout, Finishing Equipment", value: "KNOCKOUT_FINISHING_EQUIPMENT" },
    { label: "Low Cost Automation", value: "LOW_COST_AUTOMATION" },
    { label: "Machining", value: "MACHINING" },
    { label: "Materials Handling", value: "MATERIALS_HANDLING" },
    { label: "Measuring, Testing, Process Control and Instruments", value: "MEASURING_TESTING_PROCESS_CONTROL" },
    { label: "Melting Furnaces & Accessories", value: "MELTING_FURNACES_ACCESSORIES" },
    { label: "Mould & Core Making", value: "MOULD_CORE_MAKING" },
    { label: "Packaging", value: "PACKAGING" },
    { label: "Raw Materials", value: "RAW_MATERIALS" },
    { label: "Robotics and Automation", value: "ROBOTICS_AUTOMATION" },
    { label: "Sand Preparation, Treatment & Reclamation", value: "SAND_PREPARATION_TREATMENT_RECLAMATION" },
    { label: "Special Purpose Machines", value: "SPECIAL_PURPOSE_MACHINES" },
    { label: "Other", value: "OTHER" },
];

const PARTICIPATION_INTEREST_OPTIONS: FieldOption[] = [
    { label: "IFEX", value: "IFEX" },
    { label: "CAST INDIA EXPO", value: "CAST_INDIA_EXPO" },
];

const BOOTH_RATE_HEADERS = [
    { key: "type", label: "Type" },
    { key: "minimumSize", label: "Minimum Size (sqm)" },
    { key: "nationalPrice", label: "National (INR)" },
    { key: "internationalPrice", label: "International (Euro)" },
];

const BOOTH_RATE_OPTIONS_IFEX: FieldOption[] = [
    {
        label: "Bare Stand",
        value: "BARE",
        type: "Bare Stand",
        minimumSize: "18",
        nationalPrice: "₹10,000/sqm",
        internationalPrice: "€275/sqm",
    },
    {
        label: "Shell Space",
        value: "SHELL",
        type: "Shell Space",
        minimumSize: "12",
        nationalPrice: "₹10,500/sqm",
        internationalPrice: "€300/sqm",
    },
];

const BOOTH_RATE_OPTIONS_CAST_INDIA_EXPO: FieldOption[] = [
    {
        label: "Bare Space",
        value: "BARE",
        type: "Bare Space",
        minimumSize: "12",
        nationalPrice: "₹10,000/sqm",
        internationalPrice: "€275/sqm",
    },
    {
        label: "Shell Stand",
        value: "SHELL",
        type: "Shell Stand",
        minimumSize: "12",
        nationalPrice: "₹10,000/sqm",
        internationalPrice: "€300/sqm",
    },
];

function BoothTypeNotes() {
    return React.createElement(
        "div",
        { className: "text-sm text-gray-700 space-y-1" },
        React.createElement(
            "p",
            null,
            "*Premium location charges (2-side, 3-side, or 4-side open) will incur an additional 12.5% fee."
        ),
        React.createElement("p", null, "*GST extra as applicable")
    );
}

function ContactPersonDetailsNotes() {
    return React.createElement(
        "div",
        { className: "text-sm text-gray-700 space-y-1" },
        React.createElement(
            "p",
            null,
            "(This person will be responsible for all future communication with the Organiser team.)"
        ),
    );
}
// ─── Default Values ───────────────────────────────────────────────────────────

export const defaultValues: Record<string, unknown> = {
    // Step 1 — Company & Contact Information
    participationType: "",
    companyName: "",
    iifMember: undefined,
    iifMembershipNumber: "",
    membershipPriceId: "",
    address: {
        addressLine1: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
    },
    corporateEmail: "",
    corporateMobile: "",
    isBillingAddressSameAsRegistered: false,
    billingAddress: {
        addressLine1: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
    },
    website: "",
    name: "",
    designation: "",
    mobile: "",
    email: "",
    secondaryContactPersonName: "",
    secondaryContactPersonDesignation: "",
    secondaryContactPersonPhoneInput: "",
    secondaryContactPersonEmailInput: "",
    accountsPersonCopyFrom: "",
    accountsPersonContactPersonName: "",
    accountsPersonContactPersonDesignation: "",
    accountsPersonContactPersonPhoneInput: "",
    accountsPersonContactPersonEmailInput: "",
    fasciaName: "",
    companyEmail: "",
    panNumber: "",
    hasGstNumber: undefined,
    gstNumber: "",

    // Step 2 — Business Details
    registeredWithMsme: undefined,
    msmeNumber: "",
    businessIds: "",
    otherBusiness: "",
    categoryIds: [],
    otherCategory: "",
    eventType: "",

    // Step 3 — Booth Details
    currency: "INR",
    scheme: undefined,
    hasPreferredLocation: undefined,
    tds: undefined,
    preferredFloor: PreferredFloor.GROUND_FLOOR,
    preferredStallSides: 1,
    area: "",
    tdsPercentage: undefined,
    tanNumber: "",
    primaryPreferredStall: "",
    secondaryPreferredStall: "",

    // UI helpers
    _isBillingCopied: false,
};

// ─── Form Config Function ─────────────────────────────────────────────────────

type ExhibitorConfigInput = {
    businessOptions?: FieldOption[];
    businessLoading?: boolean;
    categoryOptions?: FieldOption[];
    categoryLoading?: boolean;
    isEditable?: boolean;
    formValues?: Record<string, unknown> | null;
    indianMembershipTypeOptions?: FieldOption[];
    indianMembershipTypeLoading?: boolean;
    overseasMembershipTypeOptions?: FieldOption[];
    overseasMembershipTypeLoading?: boolean;
};

export function getFormConfig(input: ExhibitorConfigInput = {}): SchemaFormRendererConfig {
    const {
        businessOptions = [],
        businessLoading = false,
        categoryOptions = [],
        categoryLoading = false,
        indianMembershipTypeOptions = [],
        indianMembershipTypeLoading = false,
        overseasMembershipTypeOptions = [],
        overseasMembershipTypeLoading = false,
        isEditable,
        formValues,
    } = input;

    const mergedDefaults = formValues
        ? { ...defaultValues, ...formValues }
        : defaultValues;

    return {
        resolver: yupResolver(exhibitorRegistrationSchema) as never,
        defaultValues: mergedDefaults,
        mode: "onChange",
        isEditable,
        stepped: false,

        // ── Reactive side-effects ──────────────────────────────────────────────
        watchers: [
            // Participation category logic for country/state/city
            {
                fields: ["participationType"],
                onChange: (watchedValues: Record<string, unknown>, m: any) => {
                    const { dirtyFields } = m.formState;
                    if (watchedValues.participationType === ParticipationCategory.INDIAN_PARTICIPANT) {
                        m.setValue("address.country", "India");
                        m.setValue("billingAddress.country", "India");
                        m.setValue("membershipPriceId", "");
                        m.setValue("address.state", "");
                        m.setValue("address.city", "");
                        m.setValue("billingAddress.state", "");
                        m.setValue("billingAddress.city", "");
                    } else {
                        m.setValue("address.country", "");
                        m.setValue("membershipPriceId", "");
                        m.setValue("address.state", "");
                        m.setValue("address.city", "");
                        // Clear fields hidden for overseas participants
                        m.setValue("panNumber", "");
                        m.setValue("hasGstNumber", undefined);
                        m.setValue("gstNumber", "");
                        m.setValue("isBillingAddressSameAsRegistered", false);
                        m.setValue("billingAddress", {
                            addressLine1: "",
                            city: "",
                            state: "",
                            country: "",
                            zipCode: "",
                        });
                    }
                },
            },
            // Clear GST number when user says "no"
            {
                fields: ["hasGstNumber"],
                onChange: (watchedValues: Record<string, unknown>, m: any) => {
                    if (watchedValues.hasGstNumber !== true) m.setValue("gstNumber", "");
                },
            },
            // Clear IIF membership number when not a member
            {
                fields: ["iifMember"],
                onChange: (watchedValues: Record<string, unknown>, m: any) => {
                    if (watchedValues.iifMember !== true) m.setValue("iifMembershipNumber", "");
                    if (watchedValues.iifMember !== false) m.setValue("membershipPriceId", "");

                },
            },
            // Copy registered address → billing when checkbox ticked
            {
                fields: [
                    "isBillingAddressSameAsRegistered",
                    "address",
                ],
                onChange: (watchedValues: Record<string, unknown>, m: any) => {
                    const address = (watchedValues.address as Record<string, unknown>) ?? {};
                    const {dirtyFields} = m.formState;
                    if(!dirtyFields.isBillingAddressSameAsRegistered) return;
                    if (watchedValues.isBillingAddressSameAsRegistered) {
                        m.setValue("billingAddress", {
                            addressLine1: String(address.addressLine1 || ""),
                            city: String(address.city || ""),
                            state: String(address.state || ""),
                            country: String(address.country || ""),
                            zipCode: String(address.zipCode || ""),
                        });
                    } else {
                        m.setValue("billingAddress", {
                            addressLine1: "",
                            city: "",
                            state: "",
                            country: "",
                            zipCode: "",
                        });
                    }
                },
            },
            // Copy accounts person from primary or secondary contact
            {
                fields: [
                    "accountsPersonCopyFrom",
                    "name",
                    "designation",
                    "mobile",
                    "email",
                    "secondaryContactPersonName",
                    "secondaryContactPersonDesignation",
                    "secondaryContactPersonPhoneInput",
                    "secondaryContactPersonEmailInput",
                ],
                onChange: (watchedValues: Record<string, unknown>, m: any) => {
                    const copyFrom = watchedValues.accountsPersonCopyFrom as string;
                    if (copyFrom === "primary") {
                        m.setValue("accountsPersonContactPersonName", watchedValues.name || "");
                        m.setValue("accountsPersonContactPersonDesignation", watchedValues.designation || "");
                        m.setValue("accountsPersonContactPersonPhoneInput", watchedValues.mobile || "");
                        m.setValue("accountsPersonContactPersonEmailInput", watchedValues.email || "");
                    } else if (copyFrom === "secondary") {
                        m.setValue("accountsPersonContactPersonName", watchedValues.secondaryContactPersonName || "");
                        m.setValue("accountsPersonContactPersonDesignation", watchedValues.secondaryContactPersonDesignation || "");
                        m.setValue("accountsPersonContactPersonPhoneInput", watchedValues.secondaryContactPersonPhoneInput || "");
                        m.setValue("accountsPersonContactPersonEmailInput", watchedValues.secondaryContactPersonEmailInput || "");
                    }
                },
            },
            // Clear MSME number when not applicable
            {
                fields: ["registeredWithMsme"],
                onChange: (watchedValues: Record<string, unknown>, m: any) => {
                    if (watchedValues.registeredWithMsme !== true) m.setValue("msmeNumber", "");
                },
            },
            // Clear otherBusiness when not OTHER
            // {
            //     fields: ["businessIds"],
            //     onChange: (watchedValues: Record<string, unknown>, m: any) => {
            //         if (watchedValues.businessIds !== "OTHER") m.setValue("otherBusiness", "");
            //     },
            // },
            // Clear otherCategory when OTHER not selected
            // {
            //     fields: ["categoryIds"],
            //     onChange: (watchedValues: Record<string, unknown>, m: any) => {
            //         const categoryIds = (watchedValues.categoryIds as string[]) || [];
            //         if (!categoryIds.includes("OTHER")) m.setValue("otherCategory", "");
            //     },
            // },
            // Clear TAN when TDS is 0%
            {
                fields: ["tds"],
                onChange: (watchedValues: Record<string, unknown>, m: any) => {
                    if (watchedValues.tds !== true) {
                        m.setValue("tdsPercentage", undefined);
                        m.setValue("tanNumber", "");
                    }
                },
            },
            // Reset area when booth type changes
            {
                fields: ["scheme"],
                onChange: (_: Record<string, unknown>, m: any) => {
                    m.setValue("area", "", { shouldValidate: false });
                },
            },
            // Derive currency from booth type and company country
            {
                fields: ["scheme", "address"],
                onChange: (watchedValues: Record<string, unknown>, m: any) => {
                    const address = watchedValues.address as Record<string, unknown> | undefined;
                    const companyCountry = String(address?.country ?? "");
                    const currency = companyCountry === "India" ? "INR" : "EUR";
                    m.setValue("currency", currency, { shouldValidate: false });
                },
            },
        ],

        // ── Steps ─────────────────────────────────────────────────────────────
        steps: [
            // ── STEP 1: EXHIBITOR INFORMATION ──────────────────────────────────
            {
                id: 1,
                label: "Exhibitor Information",
                validate: (values: Record<string, unknown>, methods: any) => {
                    let valid = true;
                    if (values.participationType === ParticipationCategory.INDIAN_PARTICIPANT && values.hasGstNumber === true) {
                        const gst = String(values.gstNumber ?? "").trim();
                        if (!gst) {
                            methods.setError("gstNumber", { type: "manual", message: "GST Number is required if you select 'Yes'" });
                            valid = false;
                        } else if (gst.length < 15) {
                            methods.setError("gstNumber", { type: "manual", message: "GST Number must be at least 15 characters" });
                            valid = false;
                        }
                    }
                    if (values.iifMember === true) {
                        const num = String(values.iifMembershipNumber ?? "").trim();
                        if (!num) {
                            methods.setError("iifMembershipNumber", { type: "manual", message: "IIF Membership Number is required" });
                            valid = false;
                        }
                    }
                    return valid;
                },
                fields: [
                    // ── Important Notes ────────────────────────────────────────
                    {
                        id: "importantNotes",
                        name: "importantNotes",
                        type: "custom",
                        component: React.createElement(ImportantNotes),
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    
                    // ── Participation Category ─────────────────────────────---
                    {
                        id: "participationType",
                        name: "participationType",
                        type: "radio",
                        label: "Participation Category",
                        row: true,
                        required: true,
                        placeholder: "Select category",
                        options: PARTICIPATION_CATEGORY_OPTIONS,
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "iifMember",
                        name: "iifMember",
                        type: "select",
                        label: "Are you an existing member for IIF?",
                        required: true,
                        placeholder: "Select an option",
                        options: YES_NO_BOOL_OPTIONS,
                    },
                    {
                        id: "membershipPriceIdIndian",
                        name: "membershipPriceId",
                        type: "select",
                        label: "Membership Type",
                        placeholder: indianMembershipTypeLoading ? "Loading membership types..." : "Select membership type",
                        required: true,
                        options: indianMembershipTypeOptions,
                        visibleWhen: {
                            field: "iifMember",
                            value: false,
                            and: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT },
                        },
                        disabled: indianMembershipTypeLoading,
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    {
                        id: "membershipPriceIdOverseas",
                        name: "membershipPriceId",
                        type: "select",
                        label: "Membership Type",
                        placeholder: overseasMembershipTypeLoading ? "Loading membership types..." : "Select membership type",
                        required: true,
                        options: overseasMembershipTypeOptions,
                        visibleWhen: {
                            field: "iifMember",
                            value: false,
                            and: { field: "participationType", value: ParticipationCategory.OVERSEAS_PARTICIPANT },
                        },
                        disabled: overseasMembershipTypeLoading,
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    {
                        id: "iifNonMemberNotice",
                        name: "iifNonMemberNotice",
                        type: "custom",
                        component: React.createElement(IifNonMemberNotice),
                        visibleWhen: { field: "iifMember", value: false },
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "iifMembershipNumber",
                        name: "iifMembershipNumber",
                        type: "text",
                        label: "IIF Company Membership Number",
                        placeholder: "Enter IIF membership number",
                        maxLength: 20,
                        transform: (val: string) => val.toUpperCase(),
                        required: true,
                        visibleWhen: { field: "iifMember", value: true },
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    // ── Exhibitor Details ──────────────────────────────────────
                    {
                        id: "exhibitorDetailsHeading",
                        name: "exhibitorDetailsHeading",
                        type: "subheading",
                        label: "Company Details",
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "companyName",
                        name: "companyName",
                        type: "text",
                        label: "Company Name",
                        required: true,
                        placeholder: "Enter company name",
                    },
                    {
                        id: "companyEmail",
                        name: "companyEmail",
                        type: "email",
                        label: "Company Email",
                        placeholder: "Enter company email",
                        required: true,
                    },
                    {
                        id: "companyMobile",
                        name: "companyMobile",
                        type: "phone",
                        label: "Company Mobile",
                        placeholder: "Enter company mobile",
                        required: true,
                    },
                    {
                        id: "website",
                        name: "website",
                        type: "url",
                        label: "Website",
                        placeholder: "https://example.com",
                    },

                    

                    // ── Company Details ────────────────────────────────────────
                    {
                        id: "companyDetailsHeading",
                        name: "companyDetailsHeading",
                        type: "subheading",
                        label: "Billing Details",
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                        visibleWhen: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT },
                    },
                    {
                        id: "panNumber",
                        name: "panNumber",
                        type: "text",
                        label: "Company PAN Number",
                        required: true,
                        placeholder: "ABCDE1234F",
                        transform: (val: string) => val.toUpperCase(),
                        allowedCharacters: /[A-Z0-9]/,
                        visibleWhen: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT },
                        asyncHelperText: {
                            debounce: 800,
                            alsoWatchFields: ["companyEmail"],
                            blockStepNavigation: true,
                            fetch: async (value: unknown, formValues: Record<string, unknown>) => {
                                const pan = String(value ?? "").trim().toUpperCase();
                                if (pan.length !== 10) return null;
                                if (!formValues.companyEmail) return null;
                                try {
                                    const response = await verifyDocument({
                                        docNumber: pan,
                                        email: String(formValues.companyEmail),
                                        docType: "PAN",
                                        eventId: 162,
                                    });
                                    if (response?.data?.valid) {
                                        const name = response.data.name ? ` — ${response.data.name}` : "";
                                        return { status: "success", message: `PAN verified successfully${name}` };
                                    }
                                    return { status: "error", message: "Invalid PAN number" };
                                } catch {
                                    return null;
                                }
                            },
                        },
                    },
                    {
                        id: "gstNumber",
                        name: "gstNumber",
                        type: "text",
                        label: "GST Number",
                        placeholder: "22AAAAA0000A1Z5",
                        transform: (val: string) => val.toUpperCase(),
                        allowedCharacters: /[A-Z0-9]/,
                        asyncHelperText: {
                            debounce: 800,
                            alsoWatchFields: ["companyEmail"],
                            blockStepNavigation: true,
                            fetch: async (value: unknown, formValues: Record<string, unknown>) => {
                                const gst = String(value ?? "").trim().toUpperCase();
                                if (gst.length !== 15) return null;
                                if (!formValues.companyEmail) return null;
                                try {
                                    const response = await verifyDocument({
                                        docNumber: gst,
                                        email: String(formValues.companyEmail),
                                        docType: "GSTIN",
                                        eventId: 162,
                                    });
                                    if (response?.data?.valid) {
                                        const name = response.data.name ? ` — ${response.data.name}` : "";
                                        return { status: "success", message: `GST verified successfully${name}` };
                                    }
                                    return { status: "error", message: "Invalid GST number" };
                                } catch {
                                    return null;
                                }
                            },
                        },
                    },
                    // // ── Company Address ────────────────────────────────────────
                    {
                        id: "companyAddressHeading",
                        name: "companyAddressHeading",
                        type: "subheading",
                        label: "Company Address",
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "address.addressLine1",
                        name: "address.addressLine1",
                        type: "text",
                        label: "Address Line 1",
                        placeholder: "Street address, P.O. box, company name, c/o",
                        required: true,
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "companyCountryIndian",
                        name: "address.country",
                        type: "country",
                        label: "Country",
                        required: true,
                        disabled: true,
                        excludeCountries: [],
                        visibleWhen: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT },
                    },
                    {
                        id: "companyCountryOverseas",
                        name: "address.country",
                        type: "country",
                        label: "Country",
                        required: true,
                        excludeCountries: ["India"],
                        visibleWhen: { field: "participationType", value: ParticipationCategory.OVERSEAS_PARTICIPANT },
                    },
                    {
                        id: "companyStateProvinceRegion",
                        name: "address.state",
                        type: "state",
                        label: "State / Province / Region",
                        required: true,
                        countryFieldName: "address.country",
                    },
                    {
                        id: "companyCity",
                        name: "address.city",
                        type: "city",
                        label: "City / Town",
                        required: true,
                        countryFieldName: "address.country",
                        stateFieldName: "address.state",
                    },
                    {
                        id: "companyPostalCode",
                        name: "address.zipCode",
                        type: "text",
                        label: "Postal Code / ZIP Code",
                        required: true,
                        placeholder: "Enter postal code",
                    },
                    {
                        id: "isBillingAddressSameAsRegistered",
                        name: "isBillingAddressSameAsRegistered",
                        type: "checkbox",
                        label: "Billing address same as company address",
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                        visibleWhen: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT },
                    },

                    // ── Billing Address ────────────────────────────────────────
                    {
                        id: "billingAddressHeading",
                        name: "billingAddressHeading",
                        type: "subheading",
                        label: "Billing Address",
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                        visibleWhen: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT, and: { field: "isBillingAddressSameAsRegistered", value: false } },
                    },
                    {
                        id: "billingAddressLine1",
                        name: "billingAddress.addressLine1",
                        type: "text",
                        label: "Billing Address Line 1",
                        placeholder: "Street address, P.O. box, company name, c/o",
                        required: true,
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                        visibleWhen: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT, and: { field: "isBillingAddressSameAsRegistered", value: false } },
                    },
                    {
                        id: "billingCountryIndian",
                        name: "billingAddress.country",
                        type: "country",
                        label: "Billing Country",
                        required: true,
                        excludeCountries: [],
                        visibleWhen: {
                            field: "participationType",
                            value: ParticipationCategory.INDIAN_PARTICIPANT,
                            and: { field: "isBillingAddressSameAsRegistered", value: false },
                        },
                    },
                    {
                        id: "billingCountryOverseas",
                        name: "billingAddress.country",
                        type: "country",
                        label: "Billing Country",
                        required: true,
                        excludeCountries: ["India"],
                        visibleWhen: {
                            field: "participationType",
                            value: ParticipationCategory.OVERSEAS_PARTICIPANT,
                            and: { field: "isBillingAddressSameAsRegistered", value: false },
                        },
                    },
                    {
                        id: "billingStateProvinceRegion",
                        name: "billingAddress.state",
                        type: "state",
                        label: "Billing State / Province / Region",
                        required: true,
                        countryFieldName: "billingAddress.country",
                        visibleWhen: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT, and: { field: "isBillingAddressSameAsRegistered", value: false } },
                    },
                    {
                        id: "billingCity",
                        name: "billingAddress.city",
                        type: "city",
                        label: "Billing City / Town",
                        required: true,
                        countryFieldName: "billingAddress.country",
                        stateFieldName: "billingAddress.state",
                        visibleWhen: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT, and: { field: "isBillingAddressSameAsRegistered", value: false } },
                    },
                    {
                        id: "billingPostalCode",
                        name: "billingAddress.zipCode",
                        type: "text",
                        label: "Billing Postal Code / ZIP Code",
                        placeholder: "Enter billing postal code",
                        required: true,
                        visibleWhen: { field: "participationType", value: ParticipationCategory.INDIAN_PARTICIPANT, and: { field: "isBillingAddressSameAsRegistered", value: false } },
                    },

                    

                    // ── Contact Person Details ─────────────────────────────────
                    {
                        id: "contactPersonHeading",
                        name: "contactPersonHeading",
                        type: "subheading",
                        label: "Contact Person Details",
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "contactPersonDetailsNotes",
                        name: "contactPersonDetailsNotes",
                        type: "custom",
                        component: React.createElement(ContactPersonDetailsNotes),
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "name",
                        name: "name",
                        type: "text",
                        label: "Contact Person Name",
                        required: true,
                        placeholder: "Enter name",
                    },
                    // {
                    //     id: "secondaryContactPersonName",
                    //     name: "secondaryContactPersonName",
                    //     type: "text",
                    //     label: "Secondary Contact Person Name",
                    //     placeholder: "Enter Name",
                    // },
                    {
                        id: "designation",
                        name: "designation",
                        type: "text",
                        label: "Contact Person : Designation",
                        required: true,
                        placeholder: "Enter designation",
                    },
                    // {
                    //     id: "secondaryContactPersonDesignation",
                    //     name: "secondaryContactPersonDesignation",
                    //     type: "text",
                    //     label: "Secondary Contact : Designation",
                    //     placeholder: "Enter Designation",
                    // },
                    {
                        id: "mobile",
                        name: "mobile",
                        type: "phone",
                        label: "Contact Person : Mobile Number",
                        required: true,
                        defaultCountry: "in",
                    },
                    // {
                    //     id: "secondaryContactPersonPhoneInput",
                    //     name: "secondaryContactPersonPhoneInput",
                    //     type: "phone",
                    //     label: "Secondary Contact : Mobile Number",
                    //     defaultCountry: "in",
                    // },
                    {
                        id: "email",
                        name: "email",
                        type: "email",
                        label: "Contact Person : Email",
                        required: true,
                        placeholder: "Enter email address",
                    },
                    // {
                    //     id: "secondaryContactPersonEmailInput",
                    //     name: "secondaryContactPersonEmailInput",
                    //     type: "email",
                    //     label: "Secondary Contact : Email",
                    //     placeholder: "Enter Email Address",
                    // },

                    // // ── Accounts Person Details ────────────────────────────────
                    // {
                    //     id: "accountsPersonHeading",
                    //     name: "accountsPersonHeading",
                    //     type: "subheading",
                    //     label: "Accounts Person Details",
                    //     metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    // },
                    // {
                    //     id: "accountsPersonCopyFrom",
                    //     name: "accountsPersonCopyFrom",
                    //     type: "radio",
                    //     label: "",
                    //     options: [
                    //         { label: "Same as Primary Contact Person Details", value: "primary" },
                    //         { label: "Same as Secondary Contact Person Details", value: "secondary" },
                    //     ],
                    //     row: true,
                    //     metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    // },
                    // {
                    //     id: "accountsPersonContactPersonName",
                    //     name: "accountsPersonContactPersonName",
                    //     type: "text",
                    //     label: "Accounts Person Name",
                    //     required: true,
                    //     placeholder: "Enter full name",
                    // },
                    // {
                    //     id: "accountsPersonContactPersonDesignation",
                    //     name: "accountsPersonContactPersonDesignation",
                    //     type: "text",
                    //     label: "Accounts Person : Designation",
                    //     required: true,
                    //     placeholder: "Enter designation",
                    // },
                    // {
                    //     id: "accountsPersonContactPersonPhoneInput",
                    //     name: "accountsPersonContactPersonPhoneInput",
                    //     type: "phone",
                    //     label: "Accounts Person : Mobile Number",
                    //     required: true,
                    //     defaultCountry: "in",
                    // },
                    // {
                    //     id: "accountsPersonContactPersonEmailInput",
                    //     name: "accountsPersonContactPersonEmailInput",
                    //     type: "email",
                    //     label: "Accounts Person : Email",
                    //     required: true,
                    //     placeholder: "Enter email address",
                    // },
                    // {
                    //     id: "fasciaName",
                    //     name: "fasciaName",
                    //     type: "text",
                    //     label: "Fascia Name",
                    //     required: true,
                    //     placeholder: "Enter fascia name",
                    //     metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    // },
                ],
            },

            // ── STEP 2: BUSINESS INFORMATION ──────────────────────────────────
            {
                id: 2,
                label: "Exhibitor Participation Details",
                validate: (values: Record<string, unknown>, methods: any) => {
                    let valid = true;
                    if (values.registeredWithMsme === true) {
                        const msme = String(values.msmeNumber ?? "").trim();
                        if (!msme) {
                            methods.setError("msmeNumber", { type: "manual", message: "MSME/Udyog Number is required" });
                            valid = false;
                        } else if (!msmeRegex.test(msme)) {
                            methods.setError("msmeNumber", { type: "manual", message: "Invalid MSME format. Should be like UDYAM-XX-00-0000000" });
                            valid = false;
                        }
                    }
                    // if (values.businessIds === "OTHER") {
                    //     const other = String(values.otherBusiness ?? "").trim();
                    //     if (!other) {
                    //         methods.setError("otherBusiness", { type: "manual", message: "Please specify your business entity type" });
                    //         valid = false;
                    //     }
                    // }
                    // const categoryIds = (values.categoryIds as string[]) || [];
                    // if (categoryIds.includes("OTHER")) {
                    //     const other = String(values.otherCategory ?? "").trim();
                    //     if (!other) {
                    //         methods.setError("otherCategory", { type: "manual", message: "Please specify what else you provide" });
                    //         valid = false;
                    //     }
                    // }
                    return valid;
                },
                fields: [
                    {
                        id: "businessDetailsHeading",
                        name: "businessDetailsHeading",
                        type: "subheading",
                        label: "Business Information",
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "registeredWithMsme",
                        name: "registeredWithMsme",
                        type: "select",
                        label: "Are you registered with MSME?",
                        required: true,
                        placeholder: "Select",
                        options: YES_NO_BOOL_OPTIONS,
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "msmeNumber",
                        name: "msmeNumber",
                        type: "text",
                        label: "MSME / Udyog Aadhaar Number",
                        placeholder: "UDYAM-XX-00-0000000",
                        visibleWhen: { field: "registeredWithMsme", value: true },
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "businessIds",
                        name: "businessIds",
                        type: "select",
                        label: "We are",
                        required: true,
                        placeholder: businessLoading ? "Loading..." : "Select Your Business Type",
                        options: [...businessOptions, { label: "Other", value: "OTHER" }],
                        disabled: businessLoading,
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "otherBusiness",
                        name: "otherBusiness",
                        type: "text",
                        label: "Specify Business Entity Type",
                        placeholder: "Enter entity type",
                        visibleWhen: { field: "businessIds", value: "OTHER" },
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "categoryIds",
                        name: "categoryIds",
                        type: "radio",
                        label: "We Deal with",
                        required: true,
                        options: [...categoryOptions, { label: "Other", value: "OTHER" }],
                        columns: 3,
                        disabled: categoryLoading,
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "otherCategory",
                        name: "otherCategory",
                        type: "text",
                        label: "Specify What You Provide",
                        placeholder: "Please specify",
                        visibleWhen: { field: "categoryIds", value: "OTHER" },
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "eventType",
                        name: "eventType",
                        type: "select",
                        label: "Select the event you will be participating in",
                        required: true,
                        placeholder: "Select your participation interest",
                        options: PARTICIPATION_INTEREST_OPTIONS,
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                ],
            },

            // ── STEP 3: BOOTH TYPE ──────────────────────────────────────────
            {
                id: 3,
                label: "Booth Type",
                validate: (values: Record<string, unknown>, methods: any) => {
                    let valid = true;
                    const scheme = values.scheme as string;
                    const area = Number(values.area);
                    const eventName = (values.eventType as string) || "";

                    // Validate scheme is selected
                    if (!scheme) {
                        methods.setError("scheme", { type: "manual", message: "Please select a booth type" });
                        valid = false;
                    }

                    // Validate area is multiple of 3
                    if (area && area % 3 !== 0) {
                        methods.setError("area", {
                            type: "manual",
                            message: "Area must be in multiples of 3 sqm (e.g., 12, 15, 18, 21, 24)",
                        });
                        valid = false;
                    }

                    // Check event/space-type specific minimums
                    if (area && scheme) {
                        const minimumForType = getAreaMinimumRequirement(eventName, scheme);
                        if (area < minimumForType) {
                            methods.setError("area", {
                                type: "manual",
                                message: getAreaValidationMessage(eventName, scheme),
                            });
                            valid = false;
                        }
                    }

                    // TAN validation
                    if (values.tds === true && values.tdsPercentage == null) {
                        methods.setError("tdsPercentage", { type: "manual", message: "Please select TDS percentage" });
                        valid = false;
                    }

                    if (values.tds === true && values.tdsPercentage === 2) {
                        const tan = String(values.tanNumber ?? "").trim();
                        if (!tan) {
                            methods.setError("tanNumber", { type: "manual", message: "TAN Number is required when TDS is applicable" });
                            valid = false;
                        } else if (!tanRegex.test(tan)) {
                            methods.setError("tanNumber", { type: "manual", message: "Invalid TAN format (e.g. ABCD01234E)" });
                            valid = false;
                        }
                    }
                    return valid;
                },
                fields: [
                    {
                        id: "boothDetailsHeading",
                        name: "boothDetailsHeading",
                        type: "subheading",
                        label: "Booth Type",
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "boothTypeInfo",
                        name: "boothTypeInfo",
                        type: "custom",
                        component: React.createElement(BoothTypeInfo),
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "boothTypeRateTableIFEX",
                        name: "scheme",
                        type: "table-radio",
                        label: "Rate for IFEX (Please select your relevant option)",
                        required: true,
                        headers: BOOTH_RATE_HEADERS,
                        options: BOOTH_RATE_OPTIONS_IFEX,
                        visibleWhen: { field: "eventType", value: "IFEX" },
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "boothTypeRateTableCAST",
                        name: "scheme",
                        type: "table-radio",
                        label: "Rate for CAST INDIA EXPO (Please select your relevant option)",
                        required: true,
                        headers: BOOTH_RATE_HEADERS,
                        options: BOOTH_RATE_OPTIONS_CAST_INDIA_EXPO,
                        visibleWhen: { field: "eventType", value: "CAST_INDIA_EXPO" },
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "boothTypeNotes",
                        name: "boothTypeNotes",
                        type: "custom",
                        component: React.createElement(BoothTypeNotes),
                        metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    },
                    {
                        id: "hasPreferredLocation",
                        name: "hasPreferredLocation",
                        type: "select",
                        label: "Do you want to buy a preferred location?",
                        required: true,
                        placeholder: "Select",
                        options: YES_NO_BOOL_OPTIONS,
                        helperText: "Select Yes to view preferred location charge fields.",
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    {id: "emptySpace", name: "emptySpace", type: "custom",  metadata: { xs: 12, sm: 12, md: 12, lg: 12 } },
                    // {
                    //     id: "preferredFloor",
                    //     name: "preferredFloor",
                    //     type: "radio",
                    //     label: "Preferred Floor",
                    //     required: true,
                    //     options: PREFERRED_FLOOR_OPTIONS,
                    //     columns: 2,
                    //     visibleWhen: { field: "hasPreferredLocation", value: true },
                    //     metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    // },
                    // {
                    //     id: "preferredStallSides",
                    //     name: "preferredStallSides",
                    //     type: "radio",
                    //     label: "Preferred Stall Sides",
                    //     required: true,
                    //     options: PREFERRED_STALL_SIDE_OPTIONS,
                    //     columns: 2,
                    //     visibleWhen: { field: "hasPreferredLocation", value: true },
                    //     metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    // },
                    {
                        id: "primaryPreferredStall",
                        name: "primaryPreferredStall",
                        type: "text",
                        label: "Primary Preferred Stall",
                        required: true,
                        placeholder: "Enter Primary Preferred Stall",
                        visibleWhen: { field: "hasPreferredLocation", value: true },
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    {
                        id: "secondaryPreferredStall",
                        name: "secondaryPreferredStall",
                        type: "text",
                        label: "Secondary Preferred Stall",
                        placeholder: "Enter Secondary Preferred Stall",
                        visibleWhen: { field: "hasPreferredLocation", value: true },
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    {
                        id: "area",
                        name: "area",
                        type: "number",
                        label: "Area Required (sqm)",
                        required: true,
                        placeholder: "Enter area in sqm (multiples of 3)",
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    {id: "emptySpace2", name: "emptySpace2", type: "custom",  metadata: { xs: 12, sm: 12, md: 12, lg: 12 } },
                    {
                        id: "tds",
                        name: "tds",
                        type: "radio",
                        label: "Is TDS applicable?",
                        required: true,
                        row: true,
                        options: YES_NO_BOOL_OPTIONS,
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    {
                        id: "tanNumber",
                        name: "tanNumber",
                        type: "text",
                        label: "TAN Number",
                        placeholder: "AAAA00000A",
                        required: true,
                        transform: (val: string) => val.toUpperCase(),
                        allowedCharacters: /[A-Z0-9]/,
                        maxLength: 10,
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    {
                        id: "tdsPercentage",
                        name: "tdsPercentage",
                        type: "select",
                        label: "TDS Percentage",
                        required: true,
                        placeholder: "Select",
                        options: [
                            { label: "2%", value: 2 },
                            { label: "10%", value: 10 },
                        ],
                        visibleWhen: { field: "tds", value: true },
                        metadata: { xs: 12, sm: 12, md: 6, lg: 6 },
                    },
                    // {
                    //     id: "pricingPreview",
                    //     name: "pricingPreview",
                    //     type: "custom",
                    //     component: React.createElement(PricingPreview),
                    //     metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
                    // },
                ],
            },
        ],
    };
}
