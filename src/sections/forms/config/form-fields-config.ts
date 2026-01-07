import * as Yup from 'yup';

interface IFormConfig {
  schema: any;
  defaultValues: (formData: any) => any;
  structure: {
    fields: Array<{
      name: string;
      label: string;
      type:
        | 'text'
        | 'email'
        | 'phone'
        | 'file'
        | 'checkbox'
        | 'textarea'
        | 'country'
        | 'select'
        | 'grouped-select'
        | 'checkbox-group'
        | 'radio-group'
        | 'number'
        | 'state'
        | 'city'
        | 'file-multiple'
        | 'note';
      options?: string[];
      groupedOptions?: {
        [group: string]: {
          label: string;
          options: { value: string; label: string }[];
        };
      };
      required?: boolean;
      disabled?: boolean | ((formValues: any) => boolean);
      visible?: (formValues: any) => boolean;
      gridItem?: {
        xs?: number;
        sm?: number;
        md?: number;
      };
      maxSize?: number;
      allowedTypes?: {
        [key: string]: string[];
      };
    }>;
    declaration?: {
      required: boolean;
      text: string;
    };
    fileUpload?: {
      required: boolean;
      maxSize: number;
      allowedTypes: {
        [key: string]: string[];
      };
    };
  };
}

const standDesignSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo: Yup.string(),
    stallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    standContractorName: Yup.string().required('Stand Contractor / Architect is required'),
    standContractorContactPerson: Yup.string().required('Contractor Contact Person is required'),
    standContractorAddress: Yup.string().required('Contractor Address is required'),
    standContractorTel: Yup.string().required('Contractor Tel is required'),
    standContractorFax: Yup.string(),

    topView: Yup.array().min(1, 'Top View is required'),
    frontElevation: Yup.array().min(1, 'Front Elevation is required'),
    sideElevation: Yup.array().min(1, 'Side Elevation is required'),
    threeDView: Yup.array().min(1, '3D View is required'),
    safeStabilityStructureCertificate: Yup.array().optional(),

    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',

    standContractorName: formData?.standContractorName || formData?.standContractor || '',
    standContractorContactPerson: formData?.standContractorContactPerson || '',
    standContractorAddress: formData?.standContractorAddress || '',
    standContractorTel: formData?.standContractorTel || '',
    standContractorFax: formData?.standContractorFax || '',

    topView: formData?.topView || [],
    frontElevation: formData?.frontElevation || [],
    sideElevation: formData?.sideElevation || [],
    threeDView: formData?.threeDView || [],
    safeStabilityStructureCertificate: formData?.safeStabilityStructureCertificate || [],
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standContractorName',
        label: 'Stand Contractor / Architect*',
        type: 'text',
        required: true,
      },
      {
        name: 'standContractorContactPerson',
        label: 'Stand Contractor Contact Person*',
        type: 'text',
        required: true,
      },
      {
        name: 'standContractorAddress',
        label: 'Contractor Address*',
        type: 'text',
        required: true,
      },
      {
        name: 'standContractorTel',
        label: 'Contractor Tel*',
        type: 'phone',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standContractorFax',
        label: 'Contractor Fax',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'topView',
        label: 'Top View*',
        type: 'file',
        allowedTypes: {
          'application/pdf': ['.pdf'],
          'word/document': ['.doc', '.docx'],
        },
        gridItem: {
          xs: 12,
          sm: 6,
        },
        required: true,
        maxSize: 5242880,
      },
      {
        name: 'frontElevation',
        label: 'Front Elevation*',
        type: 'file',
        allowedTypes: {
          'application/pdf': ['.pdf'],
          'word/document': ['.doc', '.docx'],
        },
        gridItem: {
          xs: 12,
          sm: 6,
        },
        required: true,
        maxSize: 5242880,
      },
      {
        name: 'sideElevation',
        label: 'Side Elevation*',
        type: 'file',
        allowedTypes: {
          'application/pdf': ['.pdf'],
          'word/document': ['.doc', '.docx'],
        },
        gridItem: {
          xs: 12,
          sm: 6,
        },
        required: true,
        maxSize: 5242880,
      },
      {
        name: 'threeDView',
        label: '3D View*',
        type: 'file',
        allowedTypes: {
          'application/pdf': ['.pdf'],
          'word/document': ['.doc', '.docx'],
        },
        gridItem: {
          xs: 12,
          sm: 6,
        },
        required: true,
        maxSize: 5242880,
      },
      {
        name: 'safeStabilityStructureCertificate',
        label: 'Safe Stability Structure Certificate',
        type: 'file',
        allowedTypes: {
          'application/pdf': ['.pdf'],
          'word/document': ['.doc', '.docx'],
        },
        required: false,
        maxSize: 5242880,
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const basicCatalogueEntrySchema: IFormConfig = {
  schema: Yup.object().shape({
    productIndexNo: Yup.string()
      .required('Product Index No. is required')
      .matches(/^(\d+)(\.(\d+))*$/, 'Only numbers and dots allowed, e.g., 2.3.4'),
    productIndexNo2: Yup.string().matches(
      /^(\d+)(\.(\d+))*$/,
      'Only numbers and dots allowed, e.g., 2.3.4'
    ),
    registeredCompanyName: Yup.string().required(
      'Registered name of Exhibitor/Company is required'
    ),
    addressLine1: Yup.string().required('Address is required'),
    addressLine2: Yup.string(),
    stateProvinceRegion: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    postalCode: Yup.string().required('Pin code is required'),
    phone: Yup.string().required('Phone is required'),
    fax: Yup.string(),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    website: Yup.string().url('Invalid website URL'),
    organizationHeadName: Yup.string().required("Name of the Organization's Head is required"),
    contactPerson: Yup.string().required('Contact Person is required'),
    standNo: Yup.string().required('Stand no. is required'),
    city: Yup.string(),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    productIndexNo: formData?.productIndexNo || '',
    registeredCompanyName:
      formData?.registeredCompanyName || formData?.companyOrganizationName || '',
    addressLine1: formData?.billingAddressLine1 || formData?.addressLine1 || '',
    addressLine2: formData?.billingAddressLine2 || formData?.addressLine2 || '',
    stateProvinceRegion:
      formData?.billingStateProvinceRegion || formData?.stateProvinceRegion || '',
    country: formData?.billingCountry || formData?.country || '',
    postalCode: formData?.billingPostalCode || formData?.postalCode || '',
    phone: formData?.phone || '',
    fax: formData?.fax || '',
    email: formData?.email || '',
    website: formData?.website || '',
    organizationHeadName: formData?.organizationHeadName || '',
    contactPerson: formData?.contactPerson || '',
    standNo: formData?.standNo || formData?.stallNo || '',
    city: formData?.billingCity || formData?.city || '',
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'productIndexNo',
        label: 'Product Index No.*',
        type: 'text',
        required: true,
      },
      {
        name: 'productIndexNo2',
        label: 'Product Index No. 2',
        type: 'text',
        required: true,
      },
      {
        name: 'registeredCompanyName',
        label: 'Registered name of Exhibitor/Company*',
        type: 'text',
        required: true,
        disabled: true,
      },
      {
        name: 'addressLine1',
        label: 'Address*',
        type: 'text',
        required: true,
        disabled: true,
      },
      {
        name: 'addressLine2',
        label: 'Address Line 2',
        type: 'text',
        required: false,
        disabled: true,
      },
      {
        name: 'stateProvinceRegion',
        label: 'State*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'country',
        label: 'Country*',
        type: 'text',
        disabled: true,
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'postalCode',
        label: 'Pin code*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Phone (with area code)*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'fax',
        label: 'Fax',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'E-mail*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'website',
        label: 'Website: https://',
        type: 'text',
        required: false,
      },
      {
        name: 'organizationHeadName',
        label: "Name of the Organization's Head*",
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPerson',
        label: 'Contact Person*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standNo',
        label: 'Stand no.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'In submitting this application for catalogue entry, the exhibitor agrees to all points of the conditions for catalogue entry of Organiser and confirms to have received them. Undersigned is the duly authorised signatory of the exhibitor / co-exhibitor mentioned above.',
        type: 'checkbox',
        required: true,
      },
    ],
    // declaration: {
    //   required: true,
    //   text: 'Deadline for receiving completed basic catalogue entry forms with product profile is 31st January 2026.',
    // },
  },
};

const electricityFormSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo:Yup.string(),
    stallNo: Yup.string(),
    contactPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    powerLoadRequired: Yup.number()
      .required('Power Load Required is required')
      .min(1, 'Power Load Required must be at least 1'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    powerLoadRequired: formData?.powerLoadRequired || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Phone Number*',
        type: 'phone',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'powerLoadRequired',
        label: 'POWER LOAD REQUIRED - kw @ Rs. 3000/- + 18 % GST',
        type: 'number',
        required: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const waterConnectionServicesSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo:Yup.string(),
    stallNo: Yup.string(),
    contactPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    waterPerPointRequired: Yup.number()
      .required('Water Point Required is required')
      .min(1, 'Water Point Required must be at least 1'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    waterPerPointRequired: formData?.waterPerPointRequired || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Phone Number*',
        type: 'phone',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'waterPerPointRequired',
        label: 'Water Per Point Required',
        type: 'number',
        required: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const additionalCatalogueEntrySchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo: Yup.string(),
    stallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),


    additionalProductIndexNo: Yup.string()
      .required('Additional Product Index No. is required')
      .test(
        'valid-multiple-index',
        'Enter one or more product index numbers separated by commas. Each must be in the format 2.3.4',
        (value) => {
          if (!value) return false;
          return value.split(',').every((v) => v.trim().match(/^(\d+)(\.(\d+))*$/));
        }
      ),
    logoOption: Yup.string().required('Logo selection is required'),
    companyLogoFile: Yup.array().when('logoOption', {
      is: 'with_logo',
      then: (schema) =>
        schema
          .min(1, 'Company logo is required when selecting with company logo')
          .required('Company logo is required when selecting with company logo'),
      otherwise: (schema) => schema.optional(),
    }),
    productCompanyProfile: Yup.string().required('Product / Company Profile is required'),
    totalProductIndexNumbers: Yup.number()
      .required('Total product index numbers is required')
      .min(1, 'At least 1 product index number is required'),
    totalNumberOfWords: Yup.number()
      .required('Total number of words is required')
      .min(1, 'Total number of words must be at least 1'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',

    additionalProductIndexNo: formData?.additionalProductIndexNo || '',
    logoOption: formData?.logoOption || '',
    companyLogoFile: formData?.companyLogoFile || [],
    productCompanyProfile: formData?.productCompanyProfile || '',
    totalProductIndexNumbers: formData?.totalProductIndexNumbers || 1,
    totalNumberOfWords: formData?.totalNumberOfWords || 1,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'additionalProductIndexNo',
        label: 'Additional Product Index No.* (comma separated, e.g. 2.3.4, 5.6.7)',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
        },
        inputProps: {
          placeholder: 'e.g. 2.3.4, 5.6.7',
        },
      },
      {
        name: 'logoOption',
        label: 'Logo Selection*',
        type: 'radio-group',
        options: ['with_logo|With company logo', 'without_logo|Without company logo'],
        required: true,
      },
      {
        name: 'companyLogoFile',
        label: 'Company Logo (upload when selecting with logo)',
        type: 'file',
        required: false,
        maxSize: 5242880,
        allowedTypes: {
          'image/png': ['.png'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/bmp': ['.bmp'],
          'image/gif': ['.gif'],
          'image/svg+xml': ['.svg'],
          'image/tiff': ['.tif', '.tiff'],
          'application/postscript': ['.eps'],
          'application/pdf': ['.pdf'],
        },
        // This function will be used in the form renderer to dynamically disable the field
        disabled: (formValues: any) => formValues.logoOption !== 'with_logo',
      },
      {
        name: 'productCompanyProfile',
        label: 'Product / Company Profile*',
        type: 'textarea',
        required: true,
      },
      {
        name: 'totalProductIndexNumbers',
        label: 'Total product index numbers*',
        type: 'number',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
        disabled: true,
      },
      {
        name: 'totalNumberOfWords',
        label: 'Total number of words*',
        type: 'number',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
        disabled: true,
      },
      {
        name: 'finalConfirmation',
        label:
          'In submitting this application for catalogue entry, the exhibitor agrees to all points of the conditions for catalogue entry of Organiser and confirms to have received them. Undersigned is the duly authorised signatory of the exhibitor / co-exhibitor as mentioned above.',
        type: 'checkbox',
        required: true,
      },
    ],
    // declaration: {
    //   required: true,
    //   text: 'Costs: Rs. 5,500 per entry; Logo (single color) Rs. 1,100; Product/Profile entry Rs. 55 per word. Subject to change as per government norms.',
    // },
  },
};

const badgesForConstruction: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo: Yup.string(),
    stallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    worker1Name: Yup.string(),
    worker1Address: Yup.string(),
    worker1Mobile: Yup.string(),
    worker2Name: Yup.string(),
    worker2Address: Yup.string(),
    worker2Mobile: Yup.string(),
    worker3Name: Yup.string(),
    worker3Address: Yup.string(),
    worker3Mobile: Yup.string(),
    worker4Name: Yup.string(),
    worker4Address: Yup.string(),
    worker4Mobile: Yup.string(),
    worker5Name: Yup.string(),
    worker5Address: Yup.string(),
    worker5Mobile: Yup.string(),
    standContractorName: Yup.string().required('Stand Contractor / Architect is required'),
    standContractorContactPerson: Yup.string().required('Contractor Contact Person is required'),
    standContractorAddress: Yup.string().required('Contractor Address is required'),
    standContractorTel: Yup.string().required('Contractor Tel is required'),
    standContractorFax: Yup.string(),
    collectorName: Yup.string().required('Name of person collecting badges is required'),
    collectorAadhar: Yup.string().required('Aadhar number is required'),
    collectorMobile: Yup.string().required('Mobile number is required'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',

    worker1Name: formData?.worker1Name || '',
    worker1Address: formData?.worker1Address || '',
    worker1Mobile: formData?.worker1Mobile || '',
    worker2Name: formData?.worker2Name || '',
    worker2Address: formData?.worker2Address || '',
    worker2Mobile: formData?.worker2Mobile || '',
    worker3Name: formData?.worker3Name || '',
    worker3Address: formData?.worker3Address || '',
    worker3Mobile: formData?.worker3Mobile || '',
    worker4Name: formData?.worker4Name || '',
    worker4Address: formData?.worker4Address || '',
    worker4Mobile: formData?.worker4Mobile || '',
    worker5Name: formData?.worker5Name || '',
    worker5Address: formData?.worker5Address || '',
    worker5Mobile: formData?.worker5Mobile || '',
    standContractorName:
      formData?.standContractorName || formData?.standContractorCompanyName || '',
    standContractorContactPerson:
      formData?.standContractorContactPerson || formData?.standContractorContactPersonName || '',
    standContractorAddress:
      formData?.standContractorAddress || formData?.standContractorAddressLine1 || '',
    standContractorTel: formData?.standContractorTel || formData?.standContractorPhone || '',
    standContractorFax: formData?.standContractorFax || '',
    collectorName: formData?.collectorName || '',
    collectorAadhar: formData?.collectorAadhar || '',
    collectorMobile: formData?.collectorMobile || '',
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'worker1Name',
        label: 'Worker 1 - Name',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker1Address',
        label: 'Worker 1 - Address',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker1Mobile',
        label: 'Worker 1 - Mobile',
        type: 'phone',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker2Name',
        label: 'Worker 2 - Name',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker2Address',
        label: 'Worker 2 - Address',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker2Mobile',
        label: 'Worker 2 - Mobile',
        type: 'phone',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker3Name',
        label: 'Worker 3 - Name',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker3Address',
        label: 'Worker 3 - Address',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker3Mobile',
        label: 'Worker 3 - Mobile',
        type: 'phone',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker4Name',
        label: 'Worker 4 - Name',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker4Address',
        label: 'Worker 4 - Address',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker4Mobile',
        label: 'Worker 4 - Mobile',
        type: 'phone',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker5Name',
        label: 'Worker 5 - Name',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker5Address',
        label: 'Worker 5 - Address',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'worker5Mobile',
        label: 'Worker 5 - Mobile',
        type: 'phone',
        required: false,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'contractorNote',
        label: 'We have appointed the following agency for stand construction.',
        type: 'note',
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'standContractorName',
        label: 'Stand Contractor / Architect*',
        type: 'text',
        required: true,
      },
      {
        name: 'standContractorContactPerson',
        label: 'Contractor Contact Person*',
        type: 'text',
        required: true,
      },
      {
        name: 'standContractorAddress',
        label: 'Contractor Address*',
        type: 'textarea',
        required: true,
      },
      {
        name: 'standContractorTel',
        label: 'Contractor Tel*',
        type: 'phone',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standContractorFax',
        label: 'Contractor Fax',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'collectorNote',
        label:
          'The above person will collect (number) of Contractor Badges on my behalf for following person .',
        type: 'note',
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'collectorName',
        label: 'Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'collectorAadhar',
        label: 'Aadhar number*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
      {
        name: 'collectorMobile',
        label: 'Mobile number*',
        type: 'phone',
        required: true,
        gridItem: {
          xs: 12,
          sm: 4,
        },
      },
    ],
    declaration: {
      required: true,
      text: 'We confirm that we have read, understood, and agree to comply with and to be bound by the Terms & Conditions.',
    },
  },
};

const authorityLetterSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo: Yup.string(),
    stallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    undertakingOfNoRetailSale: Yup.array()
      .min(1, 'At least one file is required')
      .required('Undertaking of No Retail Sale Letter is required'),

    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    undertakingOfNoRetailSale: formData?.undertakingOfNoRetailSale || [],
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'authorityLetterForPossessionOfStand',
        label: 'Upload Authority Letter for Possession of Stand*',
        type: 'file',
        required: true,
        maxSize: 5242880,
        allowedTypes: {
          'application/pdf': ['.pdf'],
          'word/document': ['.doc', '.docx'],
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const securityServicesSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo: Yup.string(),
    stallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    dayShifts: Yup.array(),
    nightShifts: Yup.array().test(
      'at-least-one-shift',
      'At least one day shift or night shift must be selected',
      function (value) {
        const { dayShifts = [] } = this.parent;
        return dayShifts.length > 0 || (value && value.length > 0);
      }
    ),
    noOfDayShiftGuards_09: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('09th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift guards for 09/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftGuards_09: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('09th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift guards for 09/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftGuards_10: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('10th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift guards for 10/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftGuards_10: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('10th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift guards for 10/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftGuards_11: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('11th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift guards for 11/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftGuards_11: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('11th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift guards for 11/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftGuards_12: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('12th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift guards for 12/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftGuards_12: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('12th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift guards for 12/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftGuards_13: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('13th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift guards for 13/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftGuards_13: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('13th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift guards for 13/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftGuards_14: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('14th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift guards for 14/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftGuards_14: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('14th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift guards for 14/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    dayShifts: formData?.dayShifts || [],
    nightShifts: formData?.nightShifts || [],
    noOfDayShiftGuards_09: formData?.noOfDayShiftGuards_09 || formData?.dayShiftGuards_09 || 0,
    noOfNightShiftGuards_09:
      formData?.noOfNightShiftGuards_09 || formData?.nightShiftGuards_09 || 0,
    noOfDayShiftGuards_10: formData?.noOfDayShiftGuards_10 || formData?.dayShiftGuards_10 || 0,
    noOfNightShiftGuards_10:
      formData?.noOfNightShiftGuards_10 || formData?.nightShiftGuards_10 || 0,
    noOfDayShiftGuards_11: formData?.noOfDayShiftGuards_11 || formData?.dayShiftGuards_11 || 0,
    noOfNightShiftGuards_11:
      formData?.noOfNightShiftGuards_11 || formData?.nightShiftGuards_11 || 0,
    noOfDayShiftGuards_12: formData?.noOfDayShiftGuards_12 || formData?.dayShiftGuards_12 || 0,
    noOfNightShiftGuards_12:
      formData?.noOfNightShiftGuards_12 || formData?.nightShiftGuards_12 || 0,
    noOfDayShiftGuards_13: formData?.noOfDayShiftGuards_13 || formData?.dayShiftGuards_13 || 0,
    noOfNightShiftGuards_13:
      formData?.noOfNightShiftGuards_13 || formData?.nightShiftGuards_13 || 0,
    noOfDayShiftGuards_14: formData?.noOfDayShiftGuards_14 || formData?.dayShiftGuards_14 || 0,
    noOfNightShiftGuards_14:
      formData?.noOfNightShiftGuards_14 || formData?.nightShiftGuards_14 || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'dayShifts',
        label: 'Day Shifts',
        type: 'checkbox-group',
        options: [
          'Mon|09|09th February 2026',
          'Tue|10|10th February 2026',
          'Wed|11|11th February 2026',
          'Thu|12|12th February 2026',
          'Fri|13|13th February 2026',
          'Sat|14|14th February 2026',
        ],
        required: false,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'noOfDayShiftGuards_09',
        label: 'Day Shift No. of Guards on 09/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('09th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftGuards_10',
        label: 'Day Shift No. of Guards on 10/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('10th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftGuards_11',
        label: 'Day Shift No. of Guards on 11/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('11th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftGuards_12',
        label: 'Day Shift No. of Guards on 12/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('12th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftGuards_13',
        label: 'Day Shift No. of Guards on 13/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('13th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftGuards_14',
        label: 'Day Shift No. of Guards on 14/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('14th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'nightShifts',
        label: 'Night Shifts',
        type: 'checkbox-group',
        options: [
          'Mon|09|09th February 2026',
          'Tue|10|10th February 2026',
          'Wed|11|11th February 2026',
          'Thu|12|12th February 2026',
          'Fri|13|13th February 2026',
          'Sat|14|14th February 2026',
        ],
        required: false,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'noOfNightShiftGuards_09',
        label: 'Night Shift No. of Guards on 09/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('09th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftGuards_10',
        label: 'Night Shift No. of Guards on 10/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('10th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftGuards_11',
        label: 'Night Shift No. of Guards on 11/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('11th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftGuards_12',
        label: 'Night Shift No. of Guards on 12/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('12th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftGuards_13',
        label: 'Night Shift No. of Guards on 13/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('13th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftGuards_14',
        label: 'Night Shift No. of Guards on 14/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('14th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const cleaningServicesSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    stallNo: Yup.string(),
    hallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
    dayShifts: Yup.array(),
    nightShifts: Yup.array().test(
      'at-least-one-shift',
      'At least one day shift or night shift must be selected',
      function (value) {
        const { dayShifts = [] } = this.parent;
        return dayShifts.length > 0 || (value && value.length > 0);
      }
    ),
    noOfDayShiftCleaners_09: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('09th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift cleaners for 09/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftCleaners_09: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('09th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift cleaners for 09/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftCleaners_10: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('10th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift cleaners for 10/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftCleaners_10: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('10th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift guards for 10/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftCleaners_11: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('11th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift cleaners for 11/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftCleaners_11: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('11th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift cleaners for 11/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftCleaners_12: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('12th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift cleaners for 12/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftCleaners_12: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('12th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift cleaners for 12/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftCleaners_13: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('13th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift cleaners for 13/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftCleaners_13: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('13th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift cleaners for 13/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfDayShiftCleaners_14: Yup.number().when('dayShifts', {
      is: (dayShifts: any[]) =>
        Array.isArray(dayShifts) && dayShifts.includes('14th February 2026'),
      then: (schema) =>
        schema
          .required('Day shift cleaners for 14/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    noOfNightShiftCleaners_14: Yup.number().when('nightShifts', {
      is: (nightShifts: any[]) =>
        Array.isArray(nightShifts) && nightShifts.includes('14th February 2026'),
      then: (schema) =>
        schema
          .required('Night shift cleaners for 14/02/2026 is required')
          .min(1, 'This field is required'),
      otherwise: (schema) => schema.min(0, 'Must be 0 or greater'),
    }),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    dayShifts: formData?.dayShifts || [],
    nightShifts: formData?.nightShifts || [],
    noOfDayShiftCleaners_09:
      formData?.noOfDayShiftCleaners_09 || formData?.dayShiftCleaners_09 || 0,
    noOfNightShiftCleaners_09:
      formData?.noOfNightShiftCleaners_09 || formData?.nightShiftCleaners_09 || 0,
    noOfDayShiftCleaners_10:
      formData?.noOfDayShiftCleaners_10 || formData?.dayShiftCleaners_10 || 0,
    noOfNightShiftCleaners_10:
      formData?.noOfNightShiftCleaners_10 || formData?.nightShiftCleaners_10 || 0,
    noOfDayShiftCleaners_11:
      formData?.noOfDayShiftCleaners_11 || formData?.dayShiftCleaners_11 || 0,
    noOfNightShiftCleaners_11:
      formData?.noOfNightShiftCleaners_11 || formData?.nightShiftCleaners_11 || 0,
    noOfDayShiftCleaners_12:
      formData?.noOfDayShiftCleaners_12 || formData?.dayShiftCleaners_12 || 0,
    noOfNightShiftCleaners_12:
      formData?.noOfNightShiftCleaners_12 || formData?.nightShiftCleaners_12 || 0,
    noOfDayShiftCleaners_13:
      formData?.noOfDayShiftCleaners_13 || formData?.dayShiftCleaners_13 || 0,
    noOfNightShiftCleaners_13:
      formData?.noOfNightShiftCleaners_13 || formData?.nightShiftCleaners_13 || 0,
    noOfDayShiftCleaners_14:
      formData?.noOfDayShiftCleaners_14 || formData?.dayShiftCleaners_14 || 0,
    noOfNightShiftCleaners_14:
      formData?.noOfNightShiftCleaners_14 || formData?.nightShiftCleaners_14 || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'dayShifts',
        label: 'Day Shifts',
        type: 'checkbox-group',
        options: [
          'Mon|09|09th February 2026',
          'Tue|10|10th February 2026',
          'Wed|11|11th February 2026',
          'Thu|12|12th February 2026',
          'Fri|13|13th February 2026',
          'Sat|14|14th February 2026',
        ],
        required: false,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'noOfDayShiftCleaners_09',
        label: 'Day Shift No. of Cleaners on 09/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('09th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftCleaners_10',
        label: 'Day Shift No. of Cleaners on 10/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('10th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftCleaners_11',
        label: 'Day Shift No. of Cleaners on 11/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('11th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftCleaners_12',
        label: 'Day Shift No. of Cleaners on 12/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('12th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftCleaners_13',
        label: 'Day Shift No. of Cleaners on 13/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('13th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfDayShiftCleaners_14',
        label: 'Day Shift No. of Cleaners on 14/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.dayShifts?.includes('14th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'nightShifts',
        label: 'Night Shifts',
        type: 'checkbox-group',
        options: [
          'Mon|09|09th February 2026',
          'Tue|10|10th February 2026',
          'Wed|11|11th February 2026',
          'Thu|12|12th February 2026',
          'Fri|13|13th February 2026',
          'Sat|14|14th February 2026',
        ],
        required: false,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'noOfNightShiftCleaners_09',
        label: 'Night Shift No. of Cleaners on 09/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('09th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftCleaners_10',
        label: 'Night Shift No. of Cleaners on 10/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('10th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftCleaners_11',
        label: 'Night Shift No. of Cleaners on 11/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('11th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftCleaners_12',
        label: 'Night Shift No. of Cleaners on 12/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('12th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftCleaners_13',
        label: 'Night Shift No. of Cleaners on 13/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('13th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfNightShiftCleaners_14',
        label: 'Night Shift No. of Cleaners on 14/02/2026',
        type: 'number',
        required: false,
        visible: (formValues: any) =>
          formValues?.nightShifts?.includes('14th February 2026') || false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const hostedBuyerForm: IFormConfig = {
  schema: Yup.object().shape({
    // parentCompanyName: Yup.string().required('Parent company name is required'),
    // hallNo: Yup.string().required('Hall No. is required'),
    stallNo: Yup.string(),
    companyOrganizationName: Yup.string().required('Exhibitor Company Name is required'),
    recommendedBuyerFullName: Yup.string().required('Recommended Buyer Full Name is required'),
    recommendedBuyerCompany: Yup.string().required('Recommended Buyer Company is required'),
    recommendedBuyerDesignation: Yup.string().required('Recommended Buyer Designation is required'),
    recommendedBuyerMobile: Yup.string().required('Recommended Buyer Mobile is required'),
    recommendedBuyerEmail: Yup.string()
      .required('Recommended Buyer Email is required')
      .email('Recommended Buyer Email must be a valid email address'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    // parentCompanyName: formData?.parentCompanyName || '',
    companyOrganizationName: formData?.companyOrganizationName || '',
    stallNo: formData?.stallNo || '',
    recommendedBuyerFullName: formData?.recommendedBuyerFullName || '',
    recommendedBuyerCompany: formData?.recommendedBuyerCompany || '',
    recommendedBuyerDesignation: formData?.recommendedBuyerDesignation || '',
    recommendedBuyerMobile: formData?.recommendedBuyerMobile || '',
    recommendedBuyerEmail: formData?.recommendedBuyerEmail || '',
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Exhibitor Company Name*',
        type: 'text',
        required: true,
      },
      {
        name: 'recommendedBuyerFullName',
        label: 'Recommended Buyer Full Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'recommendedBuyerCompany',
        label: 'Recommended Buyer Company*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'recommendedBuyerDesignation',
        label: 'Recommended Buyer Designation*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'recommendedBuyerMobile',
        label: 'Recommended Buyer Mobile*',
        type: 'phone',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'recommendedBuyerEmail',
        label: 'Recommended Buyer Email*',
        type: 'email',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const itFormSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    stallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
    noOfWifiVocher: Yup.number().test(
      'at-least-one-service',
      'Either Number of Wi-Fi Vouchers or Dedicated Internet Connection must be selected',
      function (value) {
        const { dedicatedPorts = [] } = this.parent;
        return (value && value > 0) || (dedicatedPorts && dedicatedPorts.length > 0);
      }
    ),
    dedicatedPorts: Yup.array()
      .of(Yup.string())
      .test(
        'at-least-one-service',
        'Either Number of Wi-Fi Vouchers or Dedicated Internet Connection must be selected',
        function (value) {
          const { noOfWifiVocher } = this.parent;
          return (value && value.length > 0) || (noOfWifiVocher && noOfWifiVocher > 0);
        }
      ),
    numberOf1MbpsPorts: Yup.number().when('dedicatedPorts', {
      is: (val: any[]) => Array.isArray(val) && val.includes('1mbps'),
      then: (schema) => schema.min(1, 'Must be at least 1').required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    numberOf5MbpsPorts: Yup.number().when('dedicatedPorts', {
      is: (val: any[]) => Array.isArray(val) && val.includes('5mbps'),
      then: (schema) => schema.min(1, 'Must be at least 1').required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    numberOf10MbpsPorts: Yup.number().when('dedicatedPorts', {
      is: (val: any[]) => Array.isArray(val) && val.includes('10mbps'),
      then: (schema) => schema.min(1, 'Must be at least 1').required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    numberOf20MbpsPorts: Yup.number().when('dedicatedPorts', {
      is: (val: any[]) => Array.isArray(val) && val.includes('20mbps'),
      then: (schema) => schema.min(1, 'Must be at least 1').required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    numberOf30MbpsPorts: Yup.number().when('dedicatedPorts', {
      is: (val: any[]) => Array.isArray(val) && val.includes('30mbps'),
      then: (schema) => schema.min(1, 'Must be at least 1').required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    numberOf40MbpsPorts: Yup.number().when('dedicatedPorts', {
      is: (val: any[]) => Array.isArray(val) && val.includes('40mbps'),
      then: (schema) => schema.min(1, 'Must be at least 1').required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    numberOf50MbpsPorts: Yup.number().when('dedicatedPorts', {
      is: (val: any[]) => Array.isArray(val) && val.includes('50mbps'),
      then: (schema) => schema.min(1, 'Must be at least 1').required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),

  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    stallNo: formData?.stallNo || '',
    noOfWifiVocher: formData?.noOfWifiVocher || 0,
    dedicatedPorts: formData?.dedicatedPorts || [],
    numberOf1MbpsPorts: formData?.numberOf1MbpsPorts || 0,
    numberOf5MbpsPorts: formData?.numberOf5MbpsPorts || 0,
    numberOf10MbpsPorts: formData?.numberOf10MbpsPorts || 0,
    numberOf20MbpsPorts: formData?.numberOf20MbpsPorts || 0,
    numberOf30MbpsPorts: formData?.numberOf30MbpsPorts || 0,
    numberOf40MbpsPorts: formData?.numberOf40MbpsPorts || 0,
    numberOf50MbpsPorts: formData?.numberOf50MbpsPorts || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'noOfWifiVocher',
        label: 'Number of Voucher for Wi-Fi',
        type: 'number',
        required: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'dedicatedPorts',
        label: 'Dedicated Internet Wired Connection',
        type: 'checkbox-group',
        options: [
          '1mbps|1 Mbps (Rs. 2400/- per port per day)',
          '5mbps|5 Mbps (Rs. 7200/- per port per day)',
          '10mbps|10 Mbps (Rs. 10800/- per port per day)',
          '20mbps|20 Mbps (Rs. 16800/- per port per day)',
          '30mbps|30 Mbps (Rs. 27600/- per port per day)',
          '40mbps|40 Mbps (Rs. 38400/- per port per day)',
          '50mbps|50 Mbps (Rs. 49200/- per port per day)',
        ],
        required: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const airConnectionServicesSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo:Yup.string(),
    stallNo: Yup.string(),
    contactPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    airPerConnectionRequired: Yup.number()
      .required('Air Per Connection Required is required')
      .min(1, 'Air Per Connection Required must be at least 1'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    airPerConnectionRequired: formData?.airPerConnectionRequired || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Phone Number*',
        type: 'phone',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'airPerConnectionRequired',
        label: 'Air Per Connection Required',
        type: 'number',
        required: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const undertakingNoRetailSaleSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo: Yup.string(),
    stallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    undertakingOfNoRetailSale: Yup.array()
      .min(1, 'At least one file is required')
      .required('Undertaking of No Retail Sale Letter is required'),

    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    undertakingOfNoRetailSale: formData?.undertakingOfNoRetailSale || [],
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled:true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'undertakingOfNoRetailSale',
        label: 'Upload Undertaking of No Retail Sale Letter*',
        type: 'file',
        required: true,
        maxSize: 5242880,
        allowedTypes: {
          'application/pdf': ['.pdf'],
          'word/document': ['.doc', '.docx'],
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const gatePassFormSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo: Yup.string(),
    stallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    gatePassLetter: Yup.array()
      .min(1, 'At least one file is required')
      .required('Gate Pass Letter is required'),

    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    gatePassLetter: formData?.gatePassLetter || [],
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'gatePassLetter',
        label: 'Upload Gate Pass Letter*',
        type: 'file',
        required: true,
        maxSize: 5242880,
        allowedTypes: {
          'application/pdf': ['.pdf'],
          'word/document': ['.doc', '.docx'],
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
};

const heavyLargeExhibitsFormSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    hallNo: Yup.string(),
    stallNo: Yup.string(),
    conatctPersonName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),

    largeExhibitEntries: Yup.array()
      .of(
        Yup.object().shape({
          item: Yup.string().required('Items is required'),
          dimensions: Yup.string().required('Dimensions is required'),
          weightKg: Yup.number()
            .typeError('Weight must be a number')
            .positive('Weight must be positive')
            .required('Weight is required'),
          dateOfArrival: Yup.string().required('Date of arrival is required'),
        })
      )
      .min(1, 'At least one entry is required')
      .required('At least one entry is required'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    hallNo: formData?.hallNo || '',
    stallNo: formData?.stallNo || '',
    contactPersonName: formData?.firstName || formData?.contactPersonName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',

    largeExhibitEntries:
      formData?.largeExhibitEntries && Array.isArray(formData.largeExhibitEntries)
        ? formData.largeExhibitEntries
        : [
            {
              item: '',
              dimensions: '',
              weightKg: '',
              dateOfArrival: '',
            },
          ],
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: { xs: 12 },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: { xs: 12, sm: 6 },
      },
      {
        name: 'stallNo',
        label: 'Stall No.*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: { xs: 12, sm: 6 },
      },
      {
        name: 'contactPersonName',
        label: 'Contact Person Name*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: { xs: 12, sm: 6 },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
        gridItem: { xs: 12, sm: 6 },
      },
      {
        name: 'contactPersonDesignation',
        label: 'Contact Person Designation*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: { xs: 12, sm: 6 },
      },
      {
        name: 'email',
        label: 'Email ID*',
        type: 'email',
        required: true,
        disabled: true,
        gridItem: { xs: 12, sm: 6 },
      },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
        disabled: true,
        gridItem: { xs: 12, sm: 6 },
      },
    ],
    declaration: {
      required: true,
      text: 'I hereby confirm that all the provided information is accurate and final. I understand that no changes can be made after submission.',
    },
  },
};

const formConfigs: { [key: string]: IFormConfig } = {
  '1': basicCatalogueEntrySchema,
  '2': additionalCatalogueEntrySchema,
  '3': standDesignSchema,
  '4': badgesForConstruction,
  '5': electricityFormSchema,
  '6': authorityLetterSchema,
  '7': airConnectionServicesSchema,
  '8': waterConnectionServicesSchema,
  '9': undertakingNoRetailSaleSchema,
  '10': gatePassFormSchema,
  '11': securityServicesSchema,
  '12': cleaningServicesSchema,
  '13': heavyLargeExhibitsFormSchema,
};

export const getFormConfig = (formId: string): IFormConfig | null => formConfigs[formId] || null;

export const getFormSchema = (formId: string): any => {
  const config = getFormConfig(formId);
  return config?.schema || null;
};

export const getFormDefaultValues = (formId: string, formData: any): any => {
  const config = getFormConfig(formId);
  return config?.defaultValues ? config.defaultValues(formData) : null;
};

export const getFormStructure = (formId: string): any => {
  const config = getFormConfig(formId);
  return config?.structure || null;
};
