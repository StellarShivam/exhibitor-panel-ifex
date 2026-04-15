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
        | 'file-multiple';
      options?: string[];
      groupedOptions?: {
        [group: string]: {
          label: string;
          options: { value: string; label: string }[];
        };
      };
      required?: boolean;
      disabled?: boolean;
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
    stallNo: Yup.string(),
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string(),
    phone: Yup.string(),
    contactPersonDesignation: Yup.string(),
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    country: Yup.string(),
    stateProvinceRegion: Yup.string(),
    city: Yup.string(),
    postalCode: Yup.string(),
    standContractor: Yup.string().required('Stand Contractor is required'),
    topView: Yup.array().min(1, 'Top View is required'),
    frontElevation: Yup.array().min(1, 'Front Elevation is required'),
    sideElevation: Yup.array().min(1, 'Side Elevation is required'),
    threeDView: Yup.array().min(1, '3D View is required'),
    safeStabilityStructureCertificate: Yup.array().optional(),
    // files: Yup.array()
    //   .min(4, 'Please upload all 4 views separately')
    //   .required('Layout Upload is required'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    stallNo: formData?.stallNo || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    email: formData?.email || '',
    phone: formData?.phone || '',
    standContractor: formData?.standContractor || '',
    addressLine1: formData?.billingAddressLine1 || formData?.addressLine1 || '',
    addressLine2: formData?.billingAddressLine2 || formData?.addressLine2 || '',
    country: formData?.billingCountry || formData?.country || '',
    stateProvinceRegion:
      formData?.billingStateProvinceRegion || formData?.stateProvinceRegion || '',
    city: formData?.billingCity || formData?.city || '',
    postalCode: formData?.billingPostalCode || formData?.postalCode || '',
    // fabricatorName: formData?.fabricatorName || '',
    // fabricatorContactPersonName: formData?.fabricatorContactPersonName || '',
    // fabricatorContactNumber: formData?.fabricatorContactNumber || '',
    // fabricatorEmail: formData?.fabricatorEmail || '',
    topView: formData?.topView || [],
    frontElevation: formData?.frontElevation || [],
    sideElevation: formData?.sideElevation || [],
    threeDView: formData?.threeDView || [],
    safeStabilityStructureCertificate: formData?.safeStabilityStructureCertificate || [],
    // files: formData?.files || [],
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'firstName',
        label: 'Contact Person First Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
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
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standContractor',
        label: 'Stand Contractor Name*',
        type: 'text',
        required: true,
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

const exhibitorDirectorySchema: IFormConfig = {
  schema: Yup.object().shape({
    // parentCompanyName: Yup.string().required('Parent company name is required'),
    // hallNo: Yup.string().required('Hall No. is required'),
    stallNo: Yup.string(),
    companyOrganizationName: Yup.string(),
    files: Yup.array().min(1, 'At least one file is required').required('Company Logo is required'),
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    country: Yup.string(),
    stateProvinceRegion: Yup.string(),
    city: Yup.string(),
    postalCode: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
    firstName: Yup.string(),
    lastName: Yup.string(),
    productServices: Yup.string()
      .required('Products on Display is required')
      .max(120, 'Products on Display must not exceed 120 characters'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    // parentCompanyName: formData?.parentCompanyName || '',
    companyOrganizationName: formData?.companyOrganizationName || '',
    stallNo: formData?.stallNo || '',
    files: formData?.files || [],
    addressLine1: formData?.billingAddressLine1 || formData?.addressLine1 || '',
    addressLine2: formData?.billingAddressLine2 || formData?.addressLine2 || '',
    country: formData?.billingCountry || formData?.country || '',
    stateProvinceRegion:
      formData?.billingStateProvinceRegion || formData?.stateProvinceRegion || '',
    city: formData?.billingCity || formData?.city || '',
    postalCode: formData?.billingPostalCode || formData?.postalCode || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    // contactPersonDesignation: formData?.contactPersonDesignation || '',
    productServices: formData?.productServices || '',
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'files',
        label: 'Company Logo*',
        type: 'file',
        required: true,
        maxSize: 2097152,
        allowedTypes: {
          'image/png': ['.png'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/bmp': ['.bmp'],
          'image/gif': ['.gif'],
          'image/svg+xml': ['.svg'],
        },
      },
      {
        name: 'firstName',
        label: 'Contact Person First Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      // {
      //   name: 'contactPersonDesignation',
      //   label: 'Contact Person Designation*',
      //   type: 'text',
      //   required: true,
      //   gridItem: {
      //     xs: 12,
      //     sm: 6,
      //   },
      // },
      {
        name: 'phone',
        label: 'Mobile No.*',
        type: 'phone',
        required: true,
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
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },

      {
        name: 'productServices',
        label: 'Products on Display*',
        type: 'textarea',
        required: true,
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

const electricityFormSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    stallNo: Yup.string(),
    email: Yup.string(),
    phone: Yup.string(),
    firstName: Yup.string(),
    lastName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    requiredKW: Yup.number()
      .required('Required KW is required')
      .min(1, 'Required KW must be at least 1'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    stallNo: formData?.stallNo || '',
    email: formData?.email || '',
    phone: formData?.phone || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    requiredKW: formData?.requiredKW || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'firstName',
        label: 'Contact Person First Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
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
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'requiredKW',
        label: 'Required KW (Rs. 2250/- per KW)',
        type: 'number',
        required: false,
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

const fasciaFormSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    fasciaName: Yup.string()
      .required('FASCIA Name is required')
      .max(24, 'FASCIA Name must be at most 24 characters.')
      .matches(/^[A-Z0-9\s\W]+$/, 'FASCIA Name must be in capital letters'),
    // .transform((value) => (typeof value === 'string' ? value.toUpperCase() : value)),
    firstName: Yup.string(),
    lastName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
    stallNo: Yup.string(),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    fasciaName: formData?.fasciaName || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    stallNo: formData?.stallNo || '',
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'companyOrganizationName',
        label: 'Company Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'firstName',
        label: 'Contact Person First Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
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
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'fasciaName',
        label: 'FASCIA Name (as required on built-up stall)*',
        type: 'text',
        required: true,
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

const badgesForConstruction: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    stallNo: Yup.string(),
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string(),
    phone: Yup.string(),

    standContractorCompanyName: Yup.string().required('Stand Contractor Company Name is required'),
    standContractorContactPersonName: Yup.string().required(
      'Stand Contractor Contact Person Name is required'
    ),
    standContractorPhone: Yup.string().required('Stand Contractor Phone Number is required'),
    standContractorAddressLine1: Yup.string().required(
      'Stand Contractor Address Line 1 is required'
    ),
    standContractorAddressLine2: Yup.string(),
    standContractorCountry: Yup.string().required('Stand Contractor Country is required'),
    standContractorStateProvinceRegion: Yup.string().required('Stand Contractor State is required'),
    standContractorCity: Yup.string().required('Stand Contractor City is required'),
    standContractorPostalCode: Yup.string().required('Stand Contractor Postal Code is required'),
    contractorBadge: Yup.number()
      .required('Contractor Badge is required')
      .min(1, 'Contractor Badge must be at least 1'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    // parentCompanyName: formData?.parentCompanyName || '',
    companyOrganizationName: formData?.companyOrganizationName || '',
    stallNo: formData?.stallNo || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    standContractorCompanyName: formData?.standContractorCompanyName || '',
    standContractorContactPersonName: formData?.standContractorContactPersonName || '',
    standContractorPhone: formData?.standContractorPhone || '',
    standContractorAddressLine1: formData?.standContractorAddressLine1 || '',
    standContractorAddressLine2: formData?.standContractorAddressLine2 || '',
    standContractorCountry: formData?.standContractorCountry || '',
    standContractorStateProvinceRegion: formData?.standContractorStateProvinceRegion || '',
    standContractorCity: formData?.standContractorCity || '',
    standContractorPostalCode: formData?.standContractorPostalCode || '',
    // contactPersonDesignation: formData?.contactPersonDesignation || '',
    contractorBadge: formData?.contractorBadge || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'firstName',
        label: 'Contact Person First Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
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
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },

      {
        name: 'standContractorCompanyName',
        label: 'Stand Contractor / Architect Company Name*',
        type: 'text',
        required: true,
      },
      {
        name: 'standContractorContactPersonName',
        label: 'Stand Contractor / Architect Contact Person Name*',
        type: 'text',
        required: true,
      },
      {
        name: 'standContractorPhone',
        label: 'Stand Contractor / Architect Phone Number*',
        type: 'phone',
        required: true,
      },
      {
        name: 'standContractorAddressLine1',
        label: 'Address Line 1*',
        type: 'text',
        required: true,
      },
      {
        name: 'standContractorAddressLine2',
        label: 'Address Line 2',
        type: 'text',
        required: false,
      },
      {
        name: 'standContractorCountry',
        label: 'Country*',
        type: 'country',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standContractorStateProvinceRegion',
        label: 'State*',
        type: 'state',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standContractorCity',
        label: 'City*',
        type: 'city',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standContractorPostalCode',
        label: 'Pincode*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contractorBadge',
        label: 'Number of Contractor Badge*',
        type: 'number',
        required: true,
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

const authorityLetterSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    firstName: Yup.string(),
    lastName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
    stallNo: Yup.string(),
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    country: Yup.string(),
    stateProvinceRegion: Yup.string(),
    city: Yup.string(),
    postalCode: Yup.string(),
    authorityLetter: Yup.array()
      .min(1, 'At least one file is required')
      .required('Authority Letter is required'),
    authorisedPersonPhotoId: Yup.array()
      .min(1, 'At least one file is required')
      .required('Authorised Person’s Photo ID is required'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    addressLine1: formData?.billingAddressLine1 || formData?.addressLine1 || '',
    addressLine2: formData?.billingAddressLine2 || formData?.addressLine2 || '',
    country: formData?.billingCountry || formData?.country || '',
    stateProvinceRegion:
      formData?.billingStateProvinceRegion || formData?.stateProvinceRegion || '',
    city: formData?.billingCity || formData?.city || '',
    postalCode: formData?.billingPostalCode || formData?.postalCode || '',
    stallNo: formData?.stallNo || '',
    authorityLetter: formData?.authorityLetter || [],
    authorisedPersonPhotoId: formData?.authorisedPersonPhotoId || [],
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'firstName',
        label: 'Contact Person First Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
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
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'authorityLetter',
        label: 'Authority Letter*',
        type: 'file',
        required: true,
        maxSize: 5242880,
        allowedTypes: {
          'application/pdf': ['.pdf'],
          'word/document': ['.doc', '.docx'],
        },
      },
      {
        name: 'authorisedPersonPhotoId',
        label: 'Authorised Person’s Photo ID*',
        type: 'file',
        required: true,
        maxSize: 2097152,
        allowedTypes: {
          'image/png': ['.png'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/bmp': ['.bmp'],
          'image/gif': ['.gif'],
          'image/svg+xml': ['.svg'],
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
    stallNo: Yup.string(),
    firstName: Yup.string(),
    lastName: Yup.string(),
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
    totalNumberOfGuards: Yup.number()
      .required('Total Number of Guards is required')
      .min(1, 'Total Number of Guards must be at least 1'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    stallNo: formData?.stallNo || '',
    dayShifts: formData?.dayShifts || [],
    nightShifts: formData?.nightShifts || [],
    totalNumberOfGuards: formData?.totalNumberOfGuards || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'firstName',
        label: 'Contact Person First Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
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
          'Thu|25|25th September 2025',
          'Fri|26|26th September 2025',
          'Sat|27|27th September 2025',
          'Sun|28|28th September 2025',
          'Mon|29|29th September 2025',
        ],
        required: false,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'nightShifts',
        label: 'Night Shifts',
        type: 'checkbox-group',
        options: [
          'Thu|25|25th September 2025',
          'Fri|26|26th September 2025',
          'Sat|27|27th September 2025',
          'Sun|28|28th September 2025',
          'Mon|29|29th September 2025',
        ],
        required: false,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'totalNumberOfGuards',
        label: 'Total Number of Guards*',
        type: 'number',
        required: true,
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

const housekeepingServicesSchema: IFormConfig = {
  schema: Yup.object().shape({
    companyOrganizationName: Yup.string(),
    stallNo: Yup.string(),
    firstName: Yup.string(),
    lastName: Yup.string(),
    contactPersonDesignation: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
    dates: Yup.array().min(1, 'Dates is required'),
    totalNumberOfHousekeepers: Yup.number()
      .required('Total Number of Housekeeping Boys is required')
      .min(1, 'Total Number of Housekeeping Boys must be at least 1'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    companyOrganizationName: formData?.companyOrganizationName || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    contactPersonDesignation: formData?.contactPersonDesignation || '',
    phone: formData?.phone || '',
    email: formData?.email || '',
    stallNo: formData?.stallNo || '',
    dates: formData?.dates || [],
    totalNumberOfHousekeepers: formData?.totalNumberOfHousekeepers || 0,
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'firstName',
        label: 'Contact Person First Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
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
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'dates',
        label: 'Select Date(s)*:',
        type: 'checkbox-group',
        options: [
          'Thu|25|25th September 2025',
          'Fri|26|26th September 2025',
          'Sat|27|27th September 2025',
          'Sun|28|28th September 2025',
          'Mon|29|29th September 2025',
        ],
        required: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'totalNumberOfHousekeepers',
        label: 'Total Number of Housekeeping Boys*',
        type: 'number',
        required: true,
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
    firstName: Yup.string(),
    lastName: Yup.string(),
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
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
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
        name: 'firstName',
        label: 'Contact Person First Name*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'lastName',
        label: 'Contact Person Last Name*',
        type: 'text',
        required: true,
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

const formConfigs: { [key: string]: IFormConfig } = {
  '1': exhibitorDirectorySchema,
  '2': fasciaFormSchema,
  '3': standDesignSchema,
  '4': badgesForConstruction,
  '5': itFormSchema,
  '6': authorityLetterSchema,
  '7': securityServicesSchema,
  '8': electricityFormSchema,
  '9': housekeepingServicesSchema,
  // '10': itFormSchema,
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
