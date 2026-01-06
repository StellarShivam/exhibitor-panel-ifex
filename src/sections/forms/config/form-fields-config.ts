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
    exhibitorName: Yup.string().required('Exhibitor is required'),
    standHallNo: Yup.string().required('Stand & Hall No. is required'),
    contactPerson: Yup.string().required('Contact Person is required'),
    addressLine1: Yup.string().required('Address is required'),
    addressLine2: Yup.string(),
    tel: Yup.string().required('Tel is required'),
    fax: Yup.string(),
    standContractorName: Yup.string().required('Stand Contractor / Architect is required'),
    standContractorContactPerson: Yup.string().required('Contractor Contact Person is required'),
    standContractorAddressLine1: Yup.string().required('Contractor Address is required'),
    standContractorAddressLine2: Yup.string(),
    standContractorTel: Yup.string().required('Contractor Tel is required'),
    standContractorFax: Yup.string(),
    certifiedStandDrawings: Yup.array()
      .min(1, 'At least one certified stand drawing is required')
      .required('Certified stand drawings are required'),
    organizerApprovedStandDrawings: Yup.array()
      .min(1, 'At least one organizer approved stand drawing is required')
      .required('Organizer approved stand drawings are required'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    exhibitorName: formData?.exhibitorName || formData?.companyOrganizationName || '',
    standHallNo: formData?.standHallNo || formData?.stallNo || '',
    contactPerson: formData?.contactPerson || '',
    addressLine1: formData?.addressLine1 || '',
    addressLine2: formData?.addressLine2 || '',
    tel: formData?.tel || formData?.phone || '',
    fax: formData?.fax || '',
    standContractorName: formData?.standContractorName || formData?.standContractor || '',
    standContractorContactPerson:
      formData?.standContractorContactPerson || '',
    standContractorAddressLine1: formData?.standContractorAddressLine1 || '',
    standContractorAddressLine2: formData?.standContractorAddressLine2 || '',
    standContractorTel: formData?.standContractorTel || '',
    standContractorFax: formData?.standContractorFax || '',
    certifiedStandDrawings: formData?.certifiedStandDrawings || [],
    organizerApprovedStandDrawings: formData?.organizerApprovedStandDrawings || [],
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'exhibitorName',
        label: 'Exhibitor*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standHallNo',
        label: 'Stand & Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
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
        name: 'tel',
        label: 'Tel*',
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
        name: 'standContractorAddressLine1',
        label: 'Contractor Address*',
        type: 'text',
        required: true,
      },
      {
        name: 'standContractorAddressLine2',
        label: 'Contractor Address Line 2',
        type: 'text',
        required: false,
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
        name: 'certifiedStandDrawings',
        label: 'Certified Stand Drawings (Certified by Structural Engineer, elevations, layout plan, perspective, with dimensions)',
        type: 'file-multiple',
        required: true,
        maxSize: 10485760, // 10 MB
        allowedTypes: {
          'image/png': ['.png'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'application/pdf': ['.pdf'],
        },
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'organizerApprovedStandDrawings',
        label: 'Organizer Approved Stand Drawings (with dimensions, 2 sets)',
        type: 'file-multiple',
        required: true,
        maxSize: 10485760, // 10 MB
        allowedTypes: {
          'image/png': ['.png'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'application/pdf': ['.pdf'],
        },
        gridItem: {
          xs: 12,
        },
      },
    ],
    declaration: {
      required: true,
      text: 'We confirm that we have read, understood, and agree to comply with and to be bound by the Terms & Conditions.',
    },
  },
};

const basicCatalogueEntrySchema: IFormConfig = {
  schema: Yup.object().shape({
    productIndexNo: Yup.string()
      .required('Product Index No. is required')
      .matches(/^(\d+)(\.(\d+))*$/, 'Only numbers and dots allowed, e.g., 2.3.4'),
    productIndexNo2: Yup.string()
      .matches(/^(\d+)(\.(\d+))*$/, 'Only numbers and dots allowed, e.g., 2.3.4'),
    registeredCompanyName: Yup.string().required('Registered name of Exhibitor/Company is required'),
    addressLine1: Yup.string().required('Address is required'),
    addressLine2: Yup.string(),
    stateProvinceRegion: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    postalCode: Yup.string().required('Pin code is required'),
    phone: Yup.string().required('Phone is required'),
    fax: Yup.string(),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    website: Yup.string().url('Invalid website URL'),
    organizationHeadName: Yup.string().required('Name of the Organization\'s Head is required'),
    contactPerson: Yup.string().required('Contact Person is required'),
    standNo: Yup.string().required('Stand no. is required'),
    city: Yup.string(),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    productIndexNo: formData?.productIndexNo || '',
    registeredCompanyName: formData?.registeredCompanyName || formData?.companyOrganizationName || '',
    addressLine1: formData?.billingAddressLine1 || formData?.addressLine1 || '',
    addressLine2: formData?.billingAddressLine2 || formData?.addressLine2 || '',
    stateProvinceRegion: formData?.billingStateProvinceRegion || formData?.stateProvinceRegion || '',
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
    exhibitorName: Yup.string().required('Exhibitor is required'),
    standNo: Yup.string().required('Stand No. is required'),
    hallNo: Yup.string().required('Hall No. is required'),
    contactPerson: Yup.string().required('Contact Person is required'),
    date: Yup.string().required('Date is required'),
    tel: Yup.string().required('Tel is required'),
    powerLoadRequired: Yup.number()
      .required('Power Load Required (kw) is required')
      .min(1, 'Power Load Required must be at least 1'),
    totalDues: Yup.number(),
    demandDraftNo: Yup.string(),
    demandDraftFor: Yup.string(),
    demandDraftAmount: Yup.string(),
    banker: Yup.string(),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    exhibitorName: formData?.exhibitorName || formData?.companyOrganizationName || '',
    standNo: formData?.standNo || formData?.stallNo || '',
    hallNo: formData?.hallNo || '',
    contactPerson: formData?.contactPerson || '',
    date: formData?.date || '',
    tel: formData?.tel || formData?.phone || '',
    powerLoadRequired: formData?.powerLoadRequired || formData?.requiredKW || 0,
    totalDues: formData?.totalDues || 0,
    demandDraftNo: formData?.demandDraftNo || '',
    demandDraftFor: formData?.demandDraftFor || '',
    demandDraftAmount: formData?.demandDraftAmount || '',
    banker: formData?.banker || '',
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'exhibitorName',
        label: 'Exhibitor*',
        type: 'text',
        required: true,
      },
      {
        name: 'standNo',
        label: 'Stand No.*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'hallNo',
        label: 'Hall No.*',
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
        name: 'date',
        label: 'Date*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'tel',
        label: 'Tel*',
        type: 'phone',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'powerLoadRequired',
        label: 'Power Load Required - kw @ Rs. 3000/- + 18 % GST*',
        type: 'number',
        required: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'totalDues',
        label: 'Total Dues Rs.',
        type: 'number',
        required: false,
        disabled: true,
        gridItem: {
          xs: 12,
        },
      },
      {
        name: 'demandDraftNo',
        label: 'Demand Draft No.',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'demandDraftFor',
        label: 'For Rs.',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'demandDraftAmount',
        label: 'Rs.',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'banker',
        label: 'Banker',
        type: 'text',
        required: false,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'We confirm that we have read, understood, and agree to comply with and to be bound by the Terms & Conditions.',
        type: 'checkbox',
        required: true,
      },
    ],
    declaration: {
      required: true,
      text: 'The Organisers Will Only Provide 4 Spotlights & One Plug Socket (5/15 Amp) In A 12 Sq. Mt. Booth (Additional power requirement need to be applied). Any gadget requiring 24 hours electric load to be included in power load requirement and the numbers intimated to organizer while taking possession, charges applicable as per requirement. Important: Requests Received Without Payment Or After The Prescribed Date Will Not Be Entertained. Further, Payment For Electricity Load Once Deposited Will Not Be Refunded.',
    },
  },
};

const additionalCatalogueEntrySchema: IFormConfig = {
  schema: Yup.object().shape({
    exhibitorName: Yup.string().required('Exhibitor is required'),
    standNo: Yup.string().required('Stand no. is required'),
    contactPerson: Yup.string().required('Contact is required'),
    additionalProductIndexNo: Yup.string()
      .required('Additional Product Index No. is required')
      .test(
        'valid-multiple-index',
        'Enter one or more product index numbers separated by commas. Each must be in the format 2.3.4',
        value => {
          if (!value) return false;
          return value.split(',').every(v => v.trim().match(/^(\d+)(\.(\d+))*$/));
        }
      ),
    logoOption: Yup.string().required('Logo selection is required'),
    companyLogoFile: Yup.array().when('logoOption', {
      is: 'with_logo',
      then: (schema) =>
        schema.min(1, 'Company logo is required when selecting with company logo').required(
          'Company logo is required when selecting with company logo'
        ),
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
    exhibitorName: formData?.exhibitorName || formData?.companyOrganizationName || '',
    standNo: formData?.standNo || formData?.stallNo || '',
    contactPerson: formData?.contactPerson || '',
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
        name: 'exhibitorName',
        label: 'Exhibitor*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standNo',
        label: 'Stand#*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactPerson',
        label: 'Contact*',
        type: 'text',
        required: true,
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
          sm: 6,
        },
        inputProps: {
          placeholder: 'e.g. 2.3.4, 5.6.7',
        },
      },
      {
        name: 'logoOption',
        label: 'Logo Selection*',
        type: 'radio-group',
        options: [
          'with_logo|With company logo',
          'without_logo|Without company logo (soft copy of logo to be provided by the exhibitor)',
        ],
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
    exhibitorName: Yup.string().required('Exhibitor is required'),
    standHallNo: Yup.string().required('Stand & Hall No. is required'),
    contactPerson: Yup.string().required('Contact Person is required'),
    addressLine1: Yup.string().required('Address is required'),
    addressLine2: Yup.string(),
    tel: Yup.string().required('Tel is required'),
    fax: Yup.string(),
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
    exhibitorName: formData?.exhibitorName || formData?.companyOrganizationName || '',
    standHallNo: formData?.standHallNo || formData?.stallNo || '',
    contactPerson: formData?.contactPerson || '',
    addressLine1: formData?.addressLine1 || '',
    addressLine2: formData?.addressLine2 || '',
    tel: formData?.tel || formData?.phone || '',
    fax: formData?.fax || '',
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
    standContractorName: formData?.standContractorName || formData?.standContractorCompanyName || '',
    standContractorContactPerson: formData?.standContractorContactPerson || formData?.standContractorContactPersonName || '',
    standContractorAddress: formData?.standContractorAddress || formData?.standContractorAddressLine1 || '',
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
        name: 'exhibitorName',
        label: 'Exhibitor*',
        type: 'text',
        required: true,
        disabled: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standHallNo',
        label: 'Stand & Hall No.*',
        type: 'text',
        required: true,
        disabled: true,
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
        name: 'tel',
        label: 'Tel*',
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
        label: 'The above person will collect (number) of Contractor Badges on my behalf for following person .',
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
    hallNo: Yup.string().required('Hall No. is required'),
    standNo: Yup.string().required('Stand No. is required'),
    organizationName: Yup.string().required('Name of the Organisation is required'),
    addressLine1: Yup.string().required('Address is required'),
    addressLine2: Yup.string(),
    telephone: Yup.string().required('Telephone is required'),
    email: Yup.string().email('Invalid email format').required('E-mail is required'),
    contactExecutive: Yup.string().required('Contact Executive is required'),
    standNumber: Yup.string().required('Stand Number is required'),
    signatureDate: Yup.string().required('Date is required'),
    signatoryName: Yup.string().required('Name is required'),
    signatoryDesignation: Yup.string().required('Designation is required'),
    finalConfirmation: Yup.boolean()
      .required('You must confirm the details before submitting')
      .oneOf([true], 'You must confirm the details before submitting'),
  }),
  defaultValues: (formData: any) => ({
    hallNo: formData?.hallNo || '',
    standNo: formData?.standNo || formData?.stallNo || '',
    organizationName: formData?.organizationName || formData?.companyOrganizationName || '',
    addressLine1: formData?.addressLine1 || '',
    addressLine2: formData?.addressLine2 || '',
    telephone: formData?.telephone || formData?.phone || '',
    email: formData?.email || '',
    contactExecutive: formData?.contactExecutive || '',
    standNumber: formData?.standNumber || formData?.stallNo || '',
    signatureDate: formData?.signatureDate || '',
    signatoryName: formData?.signatoryName || '',
    signatoryDesignation: formData?.signatoryDesignation || '',
    finalConfirmation: formData?.finalConfirmation || false,
  }),
  structure: {
    fields: [
      {
        name: 'hallNo',
        label: 'Hall No.*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standNo',
        label: 'Stand No.*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'organizationName',
        label: 'NAME OF THE ORGANISATION*',
        type: 'text',
        required: true,
      },
      {
        name: 'addressLine1',
        label: 'ADDRESS*',
        type: 'text',
        required: true,
      },
      {
        name: 'addressLine2',
        label: 'Address Line 2',
        type: 'text',
        required: false,
      },
      {
        name: 'telephone',
        label: 'TELEPHONE*',
        type: 'phone',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'email',
        label: 'E-MAIL*',
        type: 'email',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'contactExecutive',
        label: 'CONTACT EXECUTIVE*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'standNumber',
        label: 'STAND NUMBER*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'signatoryName',
        label: 'Name (Signatory)*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'signatoryDesignation',
        label: 'Designation*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'signatureDate',
        label: 'Date*',
        type: 'text',
        required: true,
        gridItem: {
          xs: 12,
          sm: 6,
        },
      },
      {
        name: 'finalConfirmation',
        label:
          'We are enclosing a copy of our stand allotment letter and confirm that payment for stand charges in full has already been made.',
            declaration: {
              required: true,
              text: 'To be typed on company letterhead and to be submitted at the time of taking possession of your stand but not later than 11th February 2026 by 12 noon at the exhibition ground.',
            },
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
  '1': basicCatalogueEntrySchema,
  '2': additionalCatalogueEntrySchema,
  '3': standDesignSchema,
  '4': badgesForConstruction,
  '5': electricityFormSchema,
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
