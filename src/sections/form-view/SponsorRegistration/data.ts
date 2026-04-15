import { CountryPartnerPackage, ExhibitionPackage, KnowledgeSessionsPackage, StatePartnerPackage } from "./enums";

export const gstStateCodeByISO: Record<string, string> = {
  JK: '01',
  HP: '02',
  PB: '03',
  CH: '04',
  UK: '05',
  HR: '06',
  DL: '07',
  RJ: '08',
  UP: '09',
  BR: '10',
  SK: '11',
  AR: '12',
  NL: '13',
  MN: '14',
  MZ: '15',
  TR: '16',
  ML: '17',
  AS: '18',
  WB: '19',
  JH: '20',
  OR: '21',
  CT: '22',
  MP: '23',
  GJ: '24',
  DD: '25',
  DH: '26',
  MH: '27',
  AP: '37',
  KA: '29',
  GA: '30',
  LD: '31',
  KL: '32',
  TN: '33',
  PY: '34',
  AN: '35',
  TS: '36',
  LA: '38',
  TG: '36',
  UT: '05',
};

export const productGroupsAndCategories = {
  '1. APPAREL & FASHION': [
    { label: '1.1 Menswear', value: '1.1 Menswear' },
    { label: '1.2 Womenswear', value: '1.2 Womenswear' },
    { label: '1.3 Kidswear', value: '1.3 Kidswear' },
    { label: '1.4 Sarees', value: '1.4 Sarees' },
    { label: '1.5 Innerwear & Sleepwear', value: '1.5 Innerwear & Sleepwear' },
    {
      label: '1.6 Shawls, Stoles and Scarves including Pashmina',
      value: '1.6 Shawls, Stoles and Scarves including Pashmina',
    },
    { label: '1.7 Accessories', value: '1.7 Accessories' },
    { label: '1.8 Brands of India', value: '1.8 Brands of India' },
    { label: '1.9 Combined', value: '1.9 Combined' },
    { label: '1.10 Knitwear', value: '1.10 Knitwear' },
    { label: '1.11 Others', value: 'Others' },
  ],
  '2. FABRICS & ACCESSORIES': [
    { label: '2.1 Knitted', value: '2.1 Knitted' },
    { label: '2.2 Woven', value: '2.2 Woven' },
    { label: '2.3 Denim', value: '2.3 Denim' },
    {
      label: '2.4 Trim/Embellishments & Accessories',
      value: '2.4 Trim/Embellishments & Accessories',
    },
    { label: '2.5 Recycled', value: '2.5 Recycled' },
    {
      label: '2.6 Integrated (Units of Complete value chain)',
      value: '2.6 Integrated (Units of Complete value chain)',
    },
    { label: '2.7 Combined', value: '2.7 Combined' },
    { label: '2.8 Grey woven fabrics', value: '2.8 Grey woven fabrics' },
    { label: '2.9 Others', value: 'Others' },
  ],
  '3. HOME TEXTILES': [
    { label: '3.1 Bed Linen', value: '3.1 Bed Linen' },
    { label: '3.2 Bath Linen', value: '3.2 Bath Linen' },
    { label: '3.3 Kitchen Linen', value: '3.3 Kitchen Linen' },
    {
      label: '3.4 Curtains & Drapes/Furnishing',
      value: '3.4 Curtains & Drapes/Furnishing',
    },
    { label: '3.5 Wall Decor', value: '3.5 Wall Decor' },
    { label: '3.6 Combined', value: '3.6 Combined' },
    { label: '3.7 Others', value: 'Others' },
  ],
  '4. FIBRES & YARNS': [
    { label: '4.1 Fiber/Filament', value: '4.1 Fiber/Filament' },
    { label: '4.2 Recycled', value: '4.2 Recycled' },
    { label: '4.3 Yarns', value: '4.3 Yarns' },
    { label: '4.4 Combined', value: '4.4 Combined' },
    { label: '4.5 Others', value: 'Others' },
  ],
  '5. TECHNICAL TEXTILES': [
    { label: '5.1 Fabric', value: '5.1 Fabric' },
    { label: '5.2 Functional Wear', value: '5.2 Functional Wear' },
    { label: '5.3 Footwear', value: '5.3 Footwear' },
    { label: '5.4 Combined', value: '5.4 Combined' },
    { label: '5.5 Others', value: 'Others' },
  ],
  '6. CARPETS & FLOORCOVERINGS': [
    { label: '6.1 Hand Knotted (Kaleen)', value: '6.1 Hand Knotted (Kaleen)' },
    {
      label: '6.2 Dari/Mats & Floor Coverings',
      value: '6.2 Dari/Mats & Floor Coverings',
    },
    {
      label: '6.3 Tufted/Machine Made Carpet',
      value: '6.3 Tufted/Machine Made Carpet',
    },
    {
      label: '6.4 Recycled Floor Coverings',
      value: '6.4 Recycled Floor Coverings',
    },
    { label: '6.5 Combined', value: '6.5 Combined' },
    { label: '6.6 Others', value: 'Others' },
  ],
  '7. START-UP & INNOVATIONS': [
    {
      label: '7.1 START-UP & INNOVATIONS',
      value: '7.1 START-UP & INNOVATIONS',
    },
  ],
  '8. JUTE & DIVERSIFIED PRODUCTS': [
    { label: '8.1 Jute Floor Coverings', value: '8.1 Jute Floor Coverings' },
    {
      label: '8.2 Jute Lifestyle Products',
      value: '8.2 Jute Lifestyle Products',
    },
    { label: '8.3 Jute Handicrafts', value: '8.3 Jute Handicrafts' },
    { label: '8.4 Jute Shopping Bags', value: '8.4 Jute Shopping Bags' },
    { label: '8.5 Jute Packaging', value: '8.5 Jute Packaging' },
    {
      label: '8.6 Jute Fashion Accessories',
      value: '8.6 Jute Fashion Accessories',
    },
    {
      label: '8.7 Jute Gifts & Souvenirs',
      value: '8.7 Jute Gifts & Souvenirs',
    },
    {
      label: '8.8 Jute Eco–friendly & Reusable Products',
      value: '8.8 Jute Eco–friendly & Reusable Products',
    },
    {
      label: '8.9 Jute Shopping/Handbags',
      value: '8.9 Jute Shopping/Handbags',
    },
    { label: '8.10 Jute Home Textiles', value: '8.10 Jute Home Textiles' },
    { label: '8.11 Jute Wine Bags', value: '8.11 Jute Wine Bags' },
    {
      label: '8.12 Sacking and Hessian Cloth',
      value: '8.12 Sacking and Hessian Cloth',
    },
    {
      label: '8.13 Jute Ribbons and Tapes',
      value: '8.13 Jute Ribbons and Tapes',
    },
    { label: '8.14 Jute Felt', value: '8.14 Jute Felt' },
    {
      label: '8.15 Jute Christmas Decoration',
      value: '8.15 Jute Christmas Decoration',
    },
    { label: '8.16 Jute Floor Coverings', value: '8.16 Jute Floor Coverings' },
    {
      label: '8.17 Jute / Cotton Blended Accessories',
      value: '8.17 Jute / Cotton Blended Accessories',
    },
    {
      label: '8.18 Cotton & Canvas Bags',
      value: '8.18 Cotton & Canvas Bags',
    },
    {
      label: '8.19 JUCO Bags',
      value: '8.19 JUCO Bags',
    },
    { label: '8.20 Others', value: 'Others' },
  ],
  '9. SERVICES': [
    { label: '9.1 Skill Institutes', value: '9.1 Skill Institutes' },
    { label: '9.2 Academia', value: '9.2 Academia' },
    { label: '9.3 Lab & Research', value: '9.3 Lab & Research' },
    {
      label: '9.4 Logistic & Warehousing',
      value: '9.4 Logistic & Warehousing',
    },
    {
      label: '9.5 Banking & Financial Institutes',
      value: '9.5 Banking & Financial Institutes',
    },
    { label: '9.6 Insurance Services', value: '9.6 Insurance Services' },
    { label: '9.7 Ecommerce', value: '9.7 Ecommerce' },
    { label: '9.8 Publication', value: '9.8 Publication' },
    { label: '9.9 Automation & Software', value: '9.9 Automation & Software' },
    {
      label: '9.10 SEZ/EPCs/Trade Bodies/Association',
      value: '9.10 SEZ/EPCs/Trade Bodies/Association',
    },
    { label: '9.11 Others', value: 'Others' },
  ],
};

export const productCategoriesForAccordion = [
  {
    title: '1. APPAREL & FASHION',
    options: [
      { label: '1.1 Menswear', value: '1.1 Menswear' },
      { label: '1.2 Womenswear', value: '1.2 Womenswear' },
      { label: '1.3 Kidswear', value: '1.3 Kidswear' },
      { label: '1.4 Sarees', value: '1.4 Sarees' },
      {
        label: '1.5 Innerwear & Sleepwear',
        value: '1.5 Innerwear & Sleepwear',
      },
      {
        label: '1.6 Shawls, Stoles and Scarves including Pashmina',
        value: '1.6 Shawls, Stoles and Scarves including Pashmina',
      },
      { label: '1.7 Accessories', value: '1.7 Accessories' },
      { label: '1.8 Brands of India', value: '1.8 Brands of India' },
      { label: '1.9 Combined', value: '1.9 Combined' },
      { label: '1.10 Knitwear', value: '1.10 Knitwear' },
      //   { label: "1.10 Others", value: "1.10 Others" },
    ],
  },
  {
    title: '2. FABRICS & ACCESSORIES',
    options: [
      { label: '2.1 Knitted', value: '2.1 Knitted' },
      { label: '2.2 Woven', value: '2.2 Woven' },
      { label: '2.3 Denim', value: '2.3 Denim' },
      {
        label: '2.4 Trim/Embellishments & Accessories',
        value: '2.4 Trim/Embellishments & Accessories',
      },
      { label: '2.5 Recycled', value: '2.5 Recycled' },
      {
        label: '2.6 Integrated (Units of Complete value chain)',
        value: '2.6 Integrated (Units of Complete value chain)',
      },
      { label: '2.7 Combined', value: '2.7 Combined' },
      { label: '2.8 Grey woven fabrics', value: '2.8 Grey woven fabrics' },
      //   { label: "2.8 Others", value: " Others" },
    ],
  },
  {
    title: '3. HOME TEXTILES',
    options: [
      { label: '3.1 Bed Linen', value: '3.1 Bed Linen' },
      { label: '3.2 Bath Linen', value: '3.2 Bath Linen' },
      { label: '3.3 Kitchen Linen', value: '3.3 Kitchen Linen' },
      {
        label: '3.4 Curtains & Drapes/Furnishing',
        value: '3.4 Curtains & Drapes/Furnishing',
      },
      { label: '3.5 Wall Decor', value: '3.5 Wall Decor' },
      { label: '3.6 Combined', value: '3.6 Combined' },
      //   { label: "3.7 Others", value: "Others" },
    ],
  },
  {
    title: '4. FIBRES & YARNS',
    options: [
      { label: '4.1 Fiber/Filament', value: '4.1 Fiber/Filament' },
      { label: '4.2 Recycled', value: '4.2 Recycled' },
      { label: '4.3 Yarns', value: '4.3 Yarns' },
      { label: '4.4 Combined', value: '4.4 Combined' },
      //   { label: "4.5 Others", value: "Others" },
    ],
  },
  {
    title: '5. TECHNICAL TEXTILES',
    options: [
      { label: '5.1 Fabric', value: '5.1 Fabric' },
      { label: '5.2 Functional Wear', value: '5.2 Functional Wear' },
      { label: '5.3 Footwear', value: '5.3 Footwear' },
      { label: '5.4 Combined', value: '5.4 Combined' },
      //   { label: "5.5 Others", value: "Others" },
    ],
  },
  {
    title: '6. CARPETS & FLOORCOVERINGS',
    options: [
      {
        label: '6.1 Hand Knotted (Kaleen)',
        value: '6.1 Hand Knotted (Kaleen)',
      },
      {
        label: '6.2 Dari/Mats & Floor Coverings',
        value: '6.2 Dari/Mats & Floor Coverings',
      },
      {
        label: '6.3 Tufted/Machine Made Carpet',
        value: '6.3 Tufted/Machine Made Carpet',
      },
      {
        label: '6.4 Recycled Floor Coverings',
        value: '6.4 Recycled Floor Coverings',
      },
      { label: '6.5 Combined', value: '6.5 Combined' },
      //   { label: "6.6 Others", value: "Others" },
    ],
  },
  {
    title: '7. START-UP & INNOVATIONS',
    options: [
      {
        label: '7.1 START-UP & INNOVATIONS',
        value: '7.1 START-UP & INNOVATIONS',
      },
    ],
  },
  {
    title: '8. JUTE & DIVERSIFIED PRODUCTS',
    options: [
      { label: '8.1 Jute Floor Coverings', value: '8.1 Jute Floor Coverings' },
      {
        label: '8.2 Jute Lifestyle Products',
        value: '8.2 Jute Lifestyle Products',
      },
      { label: '8.3 Jute Handicrafts', value: '8.3 Jute Handicrafts' },
      { label: '8.4 Jute Shopping Bags', value: '8.4 Jute Shopping Bags' },
      { label: '8.5 Jute Packaging', value: '8.5 Jute Packaging' },
      {
        label: '8.6 Jute Fashion Accessories',
        value: '8.6 Jute Fashion Accessories',
      },
      {
        label: '8.7 Jute Gifts & Souvenirs',
        value: '8.7 Jute Gifts & Souvenirs',
      },
      {
        label: '8.8 Jute Eco–friendly & Reusable Products',
        value: '8.8 Jute Eco–friendly & Reusable Products',
      },
      {
        label: '8.9 Jute Shopping/Handbags',
        value: '8.9 Jute Shopping/Handbags',
      },
      { label: '8.10 Jute Home Textiles', value: '8.10 Jute Home Textiles' },
      { label: '8.11 Jute Wine Bags', value: '8.11 Jute Wine Bags' },
      {
        label: '8.12 Sacking and Hessian Cloth',
        value: '8.12 Sacking and Hessian Cloth',
      },
      {
        label: '8.13 Jute Ribbons and Tapes',
        value: '8.13 Jute Ribbons and Tapes',
      },
      { label: '8.14 Jute Felt', value: '8.14 Jute Felt' },
      {
        label: '8.15 Jute Christmas Decoration',
        value: '8.15 Jute Christmas Decoration',
      },
      {
        label: '8.16 Jute Floor Coverings',
        value: '8.16 Jute Floor Coverings',
      },
      {
        label: '8.17 Jute / Cotton Blended Accessories',
        value: '8.17 Jute / Cotton Blended Accessories',
      },
      {
        label: '8.18 Cotton & Canvas Bags',
        value: '8.18 Cotton & Canvas Bags',
      },
      {
        label: '8.19 JUCO Bags',
        value: '8.19 JUCO Bags',
      },
      //   { label: "8.17 Others", value: "Others" },
    ],
  },
  {
    title: '9. SERVICES',
    options: [
      { label: '9.1 Skill Institutes', value: '9.1 Skill Institutes' },
      { label: '9.2 Academia', value: '9.2 Academia' },
      { label: '9.3 Lab & Research', value: '9.3 Lab & Research' },
      {
        label: '9.4 Logistic & Warehousing',
        value: '9.4 Logistic & Warehousing',
      },
      {
        label: '9.5 Banking & Financial Institutes',
        value: '9.5 Banking & Financial Institutes',
      },
      { label: '9.6 Insurance Services', value: '9.6 Insurance Services' },
      { label: '9.7 Ecommerce', value: '9.7 Ecommerce' },
      { label: '9.8 Publication', value: '9.8 Publication' },
      {
        label: '9.9 Automation & Software',
        value: '9.9 Automation & Software',
      },
      {
        label: '9.10 SEZ/EPCs/Trade Bodies/Association',
        value: '9.10 SEZ/EPCs/Trade Bodies/Association',
      },
      //   { label: "9.11 Others", value: "Others" },
    ],
  },
];


export const EXHIBITOR_PACKAGE_FEATURES = {
	headers: [
		{
			label: "Features of the package",
			icon: null,
		},
		{
			label: "Platinum",
			icon: ExhibitionPackage.PLATINUM,
		},
		{
			label: "Gold",
			icon: ExhibitionPackage.GOLD,
		},
		{
			label: "Silver",
			icon: ExhibitionPackage.SILVER,
		},
		{
			label: "Textile Technology",
			icon: ExhibitionPackage.TEXTILE_TECHNOLOGY,
		},
		{
			label: "Textile Innovation",
			icon: ExhibitionPackage.TEXTILE_INNOVATION,
		},
		{
			label: "Associate",
			icon: ExhibitionPackage.ASSOCIATE,
		},
		{
			label: "Lounge",
			icon: ExhibitionPackage.LOUNGE,
		},
	],
	body: [
		{
			type: "simple",
			feature: "Amount in INR",
			values: [
				"₹5 Crores",
				"₹3 Crores",
				"₹2 Crores",
				"₹1 Crore",
				"₹1 Crore",
				"₹1 Crore",
				"₹1 Crore",
			],
		},
		{
			type: "simple",
			feature: "Amount in USD",
			values: ["$600,000", "$350,000", "$250,000", "$125,000", "$125,000", "$125,000", "$125,000"],
		},
		{
			type: "simple",
			feature: "",
			values: [
				"Only for 02",
				"Only for 5",
				"Only for 5",
				"Only for 1",
				"Only for 1",
				"Only for 10",
				"Unlimited",
			],
		},
		{
			type: "simple",
			feature: "Complimentary space (approx in sq. mts.)",
			values: ["600 sqm.", "375 sqm.", "375 sqm.", "275 sqm.", "275 sqm.", "100 sqm.", "36 sqm."],
		},
		{
			type: "group",
			sequence: 0,
			title: "Pre-Event",
			iconType: "arrow",
			children: [
				{
					feature: "Logo presence website, roadshows, onsite",
					values: [true, true, true, true, true, true, false],
				},
				{
					feature: "Logo visibility & prominent placement of logo, first in hierarchy of all logos",
					values: [true, true, true, true, true, true, false],
				},
				{
					feature: "Special interview of spokesperson of the company for social media promotions",
					values: [true, false, false, false, false, false, false],
				},
				{
					feature: "Pre-show preview (Full page colour advertisement)",
					values: [true, true, false, false, false, false, false],
				},
			],
		},
		{
			type: "group",
			sequence: 1,
			title: "Online",
			iconType: "arrow",
			children: [
				{
					feature: "Partnership announcement",
					values: [true, true, true, false, false, false, false],
				},
				{
					feature:
						"Logo to be featured on IFEX website with a hyperlink to their company website",
					values: [true, true, false, false, false, false, false],
				},
				{
					feature:
						"Logo to be featured on IFEX website without a hyperlink to their company website",
					values: [false, false, true, true, true, true, true],
				},
				{
					feature: "Banner on E-newsletters",
					values: ["2 issues", "1 issue", false, false, false, false, false],
				},
				{
					feature: "Pre-event targeting campaign",
					values: [
						"300,000 impressions",
						"200,000 impressions",
						"100,000 impressions",
						false,
						false,
						false,
						false,
					],
				},
			],
		},
		{
			type: "group",
			sequence: 2,
			title: "Onsite",
			iconType: "arrow",
			children: [
				{
					feature: "Special Invite for the inaugural session",
					values: [5, 3, 2, false, false, false, false],
				},
				{
					feature: "Invitation for the inaugural session",
					values: [40, 30, 20, 10, 10, 10, 5],
				},
				{
					feature: "Logo presence on entry arches and backdrops",
					values: [true, true, true, true, true, true, false],
				},
				{
					feature:
						"Logo presence on visitor invitation, visitor guide, hoardings & demo area",
					values: [true, true, true, true, true, true, false],
				},
				{
					feature: "Exclusive hoarding on walkways towards halls (20x10 feet)",
					values: [5, 3, 2, 1, 1, 1, false],
				},
				{
					feature: "Corporate video to be played on the LED screen onsite",
					values: [true, true, true, false, false, false, false],
				},
				{
					feature: "Exclusive inside hall aisle buntings (size TBD)",
					values: [20, 10, 5, 5, 5, 5, false],
				},
				{
					feature: "Reserved slot of 1 hour in demo area",
					values: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 4", "Day 4", false],
				},
				{
					feature: "Advt. in the E-Catalogue",
					values: [
						"Front page",
						"Back Cover",
						"Inside page",
						"Inside page",
						"Inside page",
						"Inside page",
						"Inside page",
					],
				},
				{
					feature: "Company literature in the VIP & Buyer Seller Lounge",
					values: [true, true, false, false, false, false, false],
				},
				{
					feature: "Logo presence in city Branding (metro/ hoardings)",
					values: [true, true, false, false, false, false, false],
				},
				{
					feature: "Advertisement in visitor pocket guide",
					values: [true, true, false, false, false, false, false],
				},
				{
					feature: "Participation opportunity as a speaker",
					values: [true, true, true, false, false, false, false],
				},
				{
					feature: "One special Room for sponsor use only",
					values: [true, false, false, false, false, false, false],
				},
				{
					feature: "Special Buyer Lunch",
					values: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 4", "Day 4", "Day 4"],
				},
				{
					feature:
						"One booth visit and media interview with a senior company representative. Interview to be confirmed. Interviews will be broadcast on marketing channels(such as social media, website and onsite)",
					values: [true, true, false, false, false, false, false],
				},
				{
					feature:
						"Company Logo on relevant industry session & company video to be played during the break",
					values: [true, false, false, false, false, false, false],
				},
				{
					feature: "Special mention of the company in the event press note",
					values: [true, true, false, false, false, false, false],
				},
				{
					feature: "Access to all the VIP zones & area(B2B /G2G)",
					values: ["5 passes", "4 passes", "3 passes", false, false, false, false],
				},
			],
		},
		{
			type: "group",
			sequence: 3,
			title: "Post Event",
			iconType: "arrow",
			children: [
				{
					feature:
						"A special quote/interview of the spokesperson to be included in the post show report",
					values: [true, true, false, false, false, false, false],
				},
				{
					feature: "Logo presence in the Thank you partner brandings",
					values: [true, true, true, true, true, true, true],
				},
				{
					feature: "Lounge",
					values: [false, false, false, false, false, false, true],
				},
				{
					feature: "VIP Dining Room",
					values: [false, false, false, false, false, false, true],
				},
				{
					feature: "Knowledge Partner Speaker Lounge",
					values: [false, false, false, false, false, false, true],
				},
			],
		},
	],
};
export const STATE_PARTNER_DATA_FEATURES = {
	headers: [
		{
			label: "Features of the package",
			icon: null,
		},
		{
			label: "Partner State",
			icon: StatePartnerPackage.PARTNER_STATE,
		},
		{
			label: "Supporting State Partnership",
			icon: StatePartnerPackage.SUPPORTING_STATE_PARTNERSHIP,
		},
		{
			label: "Knowledge Partner State",
			icon: StatePartnerPackage.KNOWLEDGE_PARTNER_STATE,
		},
	],
	body: [
		{
			type: "simple",
			feature: "Amount in INR",
			values: ["₹3 Crores", "₹2 Crores", "₹1 Crore"],
		},

		{
			type: "simple",
			feature: "Complimentary space (sq. mts.)",
			values: ["300", "200", false],
		},
		{
			type: "group",
			sequence: 0,
			title: "Pre-Event",
			iconType: "arrow",
			children: [
				{
					feature: "Logo visibility & prominent placement of logo",
					values: [true, true, true],
				},
				{
					feature:
						"Exclusive Interview of the Chief Minister or person nominated",
					values: [true, false, false],
				},
			],
		},
		{
			type: "group",
			sequence: 1,
			title: "Online",
			iconType: "arrow",
			children: [
				{
					feature:
						"Partnership announcement & the State presentation launch video before the event",
					values: [true, true, true],
				},
				{
					feature:
						"Logo to be featured on IFEX website and linked to their State investment initiatives website",
					values: [true, false, false],
				},
				{
					feature: "Banner on E-newsletters",
					values: ["2 issues", "1 issue", "1 issue"],
				},
			],
		},
		{
			type: "group",
			sequence: 2,
			title: "Onsite",
			iconType: "arrow",
			children: [
				{
					feature: "Invitation for the Inaugural ceremony",
					values: [true, false, false],
				},
				{ feature: "VIP seating", values: ["25", "15", "15"] },
				{
					feature: "Special invitation for the Inaugural session",
					values: [50, 50, 50],
				},
				{
					feature: "Logo presence on Entry Arches, backdrops",
					values: [true, true, true],
				},
				{
					feature:
						"Logo presence on Visitor Invitations, visitor guide, hoardings & demo area",
					values: [true, true, true],
				},
				{
					feature: "Exclusive hoarding on walkways towards halls (20x10 feet)",
					values: [3, 1, 1],
				},
				{
					feature: "Corporate video played on the LED onsite",
					values: [true, true, true],
				},
				{
					feature: "Reserved slot of 1 hour in Live cultural zone",
					values: ["Day 1&2", "Day 3&4", "Day 3&4"],
				},
				{
					feature:
						"Craft, culture & cuisine will be demonstrated at the show at various points",
					values: [true, false, false],
				},
				{
					feature:
						"State Gala Dinner with Key Domestic & International participants (A presentation slot along with a slot for a cultural act will be allocated)",
					values: [true, false, false],
				},
				{
					feature:
						"Speaker slot for the state presentation at the Key Investment session",
					values: [false, false, false],
				},
				{
					feature: "State focus session like investors meet",
					values: [true, true, true],
				},
				{
					feature: "State literature in the VIP & Buyer Seller Lounge",
					values: [true, true, true],
				},
				{
					feature: "Logo presence in city Branding (metro/ hoardings)",
					values: [true, true, true],
				},
				{
					feature: "Advertisement in visitor pocket guide",
					values: [true, true, true],
				},
				{
					feature:
						"State Logo on relevant investment session & state video to be played during the break",
					values: [true, true, true],
				},
				{
					feature:
						"Special mention of the State participation with the key initiatives in the Event Press Note",
					values: [true, true, true],
				},
				{
					feature: "Access to all the VIP zones & area(B2B /G2G)",
					values: ["5 passes", "2 passes", "2 passes"],
				},
			],
		},
		{
			type: "group",
			sequence: 3,
			title: "Post Event",
			iconType: "arrow",
			children: [
				{
					feature:
						"A special quote/interview of the spokesperson to be included in the post show report",
					values: [true, true, true],
				},
				{
					feature: "Logo presence in the Thank you partner brandings",
					values: [true, true, true],
				},
			],
		},
	],
	note: "Theme Pavilion by Departments of Central/ State Govt./ Institute of repute : Highlighting sector-specific activities through their schemes or otherwise. Also institutes/ centre of excellence to highlight their initiative such as collaborations with IITs, design institutes, TRAs, and skill development.",
};
export const COUNTRY_PARTNER_DATA_FEATURES = {
	headers: [
		{
			label: "Features of the package",
			icon: null,
		},
		{
			label: "Partner Country",
			icon: CountryPartnerPackage.PARTNER_COUNTRY,
		},
		{
			label: "Supporting Country Partnership",
			icon: CountryPartnerPackage.SUPPORTING_COUNTRY_PARTNERSHIP,
		},
		{
			label: "Knowledge Partner Country",
			icon: CountryPartnerPackage.KNOWLEDGE_COUNTRY_PARTNER,
		},
	],
	body: [
		{
			type: "simple",
			feature: "Amount in USD",
			values: ["$100,000", "$75,000", "$50,000"],
		},
		{
			type: "simple",
			feature: "Complimentary space (approx in sq. mts.)",
			values: ["150", "100", false],
		},
		// {
		// 	type: "simple",
		// 	feature:
		// 		"Special country pavallion participation in sq. mts.(50 companies of 12 sqm each)",
		// 	values: ["600", false, false],
		// },
		{
			type: "group",
			sequence: 0,
			title: "Pre-Event",
			iconType: "arrow",
			children: [
				{
					feature: "Logo visibility & prominent placement of logo",
					values: [true, true, false],
				},
				{
					feature:
						"Exclusive Interview of the official spokesperson of the country",
					values: [true, false, false],
				},
			],
		},
		{
			type: "group",
			sequence: 1,
			title: "Online",
			iconType: "arrow",
			children: [
				{
					feature:
						"Partnership announcement & the Country presentation video to be played before the event",
					values: [true, true, false],
				},
				{
					feature:
						"Logo to be featured on IFEX website and linked to their Country investment initiatives website",
					values: [true, false, false],
				},
				{
					feature: "Banner on E-newsletters",
					values: ["2 issues", "1 issue", false],
				},
			],
		},
		{
			type: "group",
			sequence: 2,
			title: "Onsite",
			iconType: "arrow",
			children: [
				{
					feature:
						"Invitation to the Official from the Country for the Inaugural ceremony",
					values: [true, false, false],
				},
				{ feature: "VIP seating", values: ["25", "15", false] },
				{
					feature: "Special invitation for the Inaugural session",
					values: [50, 50, false],
				},
				{
					feature: "Logo presence on Entry Arches, backdrops",
					values: [true, true, false],
				},
				{
					feature:
						"Logo presence on Visitor Invitations, visitor guide, hoardings & demo area",
					values: [true, true, false],
				},
				{
					feature: "Exclusive hoarding on walkways towards halls (20x10 ft)",
					values: [3, 1, false],
				},
				{
					feature: "Corporate video played on the LED screen",
					values: [true, true, false],
				},
				{
					feature: "Reserved slot of 1 hour in Live cultural zone",
					values: ["Day 1&2", "Day 3&4", false],
				},
				{
					feature:
						"Craft, culture & cuisine will be demonstrated at the show at various points",
					values: [true, false, false],
				},
				{
					feature:
						"Gala Dinner with Key Domestic & International participants (A presentation slot along with a slot for a cultural act will be allocated)",
					values: [true, false, false],
				},
				{
					feature:
						"Speaker slot for the country presentation at the Key Investment session",
					values: [true, false, false],
				},
				{
					feature:
						"Exclusive Session to highlight about the product, services, activities of the country",
					values: [false, false, true],
				},
				{
					feature: "Company literature in the VIP & Buyer Seller Lounge",
					values: [true, true, false],
				},
				{
					feature: "Logo presence in city Branding (metro/ hoardings)",
					values: [true, true, false],
				},
				{
					feature: "Advertisement in visitor pocket guide",
					values: [true, true, false],
				},
				{
					feature:
						"Country presentation on relevant investment session & video to be played",
					values: [true, false, false],
				},
				{
					feature:
						"Special mention of the Country participation with the key initiatives in the Event Press Note",
					values: [true, true, false],
				},
				{
					feature: "Access to all the VIP zones & area(B2B /G2G)",
					values: ["5 passes", "2 passes", false],
				},
			],
		},
		{
			type: "group",
			sequence: 3,
			title: "Post Event",
			iconType: "arrow",
			children: [
				{
					feature:
						"A special quote/interview of the spokesperson to be included in the post show report",
					values: [true, true, false],
				},
				{
					feature: "Mention in Post Show Collaterals",
					values: [true, true, false],
				},
			],
		},
	],
	note: "Specialized activities: Showcasing unique selling points about their organisation. Such as R&D Centres, Universities or Special Products from their country under the banner of centre of excellence/ associations/ chambers/ bodies of repute.",
};
export const KNOWLEDGE_SESSIONS_FEATURES_DATA = {
	headers: [
		{
			label: "Features of the Package",
			icon: null,
		},
		{
			label: "Roundtable",
			icon: KnowledgeSessionsPackage.ROUNDTABLE,
		},
		{
			label: "Fireside chat",
			icon: KnowledgeSessionsPackage.FIRESIDE_CHAT,
		},
		{
			label: "Panel Discussion",
			icon: KnowledgeSessionsPackage.PANEL_DISCUSSION,
		},
		{
			label: "Masterclass /Podcast",
			icon: KnowledgeSessionsPackage.MASTERCLASS_PODCAST,
		},
	],
	body: [
		{
			type: "simple",
			feature: "Sponsorship Amount",
			values: ["₹30 lakhs", "₹30 lakhs", "₹20 lakhs", "₹5 lakhs"],
		},
		{
			type: "group",
			sequence: 0,
			title: "Logo Benefits",
			iconType: "arrow",
			children: [
				{
					feature: "Company logo visibility at venue",
					values: [
						"During the Session",
						"During the Session",
						"During the Session",
						"During the Session",
					],
				},
				{
					feature:
						"Logo presence on website/app in Knowledge Session Section (with hyperlink to company website)",
					values: [true, true, true, true],
				},
			],
		},
		{
			type: "group",
			sequence: 1,
			title: "Overall brand visibility",
			iconType: "arrow",
			children: [
				{
					feature:
						"Social Media Joint Logo presence for Knowledge Session related posts",
					values: [true, true, true, false],
				},
				{
					feature:
						"Corporate video to be played on LED Screen onsite during the session",
					values: [true, true, true, false],
				},
				{
					feature: "Advertisement in VIP pocket guide",
					values: [true, true, false, false],
				},
			],
		},
		{
			type: "group",
			sequence: 2,
			title: "Visibility of the Company Spokesperson",
			iconType: "arrow",
			children: [
				{
					feature:
						"Special interview of the key spokesperson of the company for social media promotions",
					values: [true, true, true, false],
				},
				{
					feature: "Session topic/Theme curated by the Sponsor",
					values: [true, true, false, false],
				},
				{
					feature: "Participation opportunity as speaker for flagship session",
					values: [
						"Limited to 2 speakers from company's leadership",
						"Limited to 2 speakers from company's leadership",
						"Limited to 1 speaker from company's leadership",
						false,
					],
				},
			],
		},
		{
			type: "group",
			sequence: 3,
			title: "Other Benefits",
			iconType: "arrow",
			children: [
				{
					feature: "Eminent seating for Inauguration/Valedictory",
					values: [true, true, false, false],
				},
				{
					feature:
						"Complimentary access for the sponsor company's leadership, including entry to the Gala Dinner with industry stalwarts and eminent dignitaries, along with exclusive use of the networking lounge.",
					values: ["3 Delegates", "3 Delegates", "2 Delegates", "1 Delegate"],
				},
			],
		},
	],
};
