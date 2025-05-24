import { IFile } from 'src/types/file';

// ----------------------------------------------------------------------

export const _allFiles2: IFile[] = [
  {
    id: '1',
    name: 'Aadhar Card',
    url: 'https://example.com/aadhar.pdf',
    shared: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        permission: 'view',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: '/assets/images/avatars/avatar_2.jpg',
        permission: 'edit',
      },
    ],
    tags: ['identity', 'government'],
    size: 1024 * 1024 * 2, // 2MB
    createdAt: new Date('2023-01-15'),
    modifiedAt: new Date('2023-01-15'),
    type: 'pdf',
    isFavorited: true,
  },
  {
    id: '2',
    name: 'PAN Card',
    url: 'https://example.com/pan.pdf',
    shared: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        permission: 'view',
      },
    ],
    tags: ['identity', 'tax'],
    size: 1024 * 500, // 500KB
    createdAt: new Date('2023-02-20'),
    modifiedAt: new Date('2023-02-20'),
    type: 'pdf',
    isFavorited: false,
  },
  {
    id: '3',
    name: 'Passport',
    url: 'https://example.com/passport.pdf',
    shared: null,
    tags: ['identity', 'travel'],
    size: 1024 * 1024 * 3, // 3MB
    createdAt: new Date('2023-03-10'),
    modifiedAt: new Date('2023-03-10'),
    type: 'pdf',
    isFavorited: true,
  },
  {
    id: '4',
    name: 'Driving License',
    url: 'https://example.com/license.pdf',
    shared: [
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: '/assets/images/avatars/avatar_2.jpg',
        permission: 'view',
      },
    ],
    tags: ['identity', 'license'],
    size: 1024 * 800, // 800KB
    createdAt: new Date('2023-04-05'),
    modifiedAt: new Date('2023-04-05'),
    type: 'pdf',
    isFavorited: false,
  },
  {
    id: '5',
    name: 'Voter ID',
    url: 'https://example.com/voter.pdf',
    shared: null,
    tags: ['identity', 'government'],
    size: 1024 * 700, // 700KB
    createdAt: new Date('2023-05-12'),
    modifiedAt: new Date('2023-05-12'),
    type: 'pdf',
    isFavorited: false,
  },
  {
    id: '6',
    name: 'Ration Card',
    url: '',
    shared: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        permission: 'view',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: '/assets/images/avatars/avatar_2.jpg',
        permission: 'edit',
      },
    ],
    tags: ['identity', 'government'],
    size: 0, // 600KB
    createdAt: new Date('2023-06-18'),
    modifiedAt: new Date('2023-06-18'),
    type: '',
    isFavorited: true,
  },
  {
    id: '7',
    name: 'Birth Certificate',
    url: 'https://example.com/birth.pdf',
    shared: null,
    tags: ['certificate', 'identity'],
    size: 1024 * 400, // 400KB
    createdAt: new Date('2023-07-22'),
    modifiedAt: new Date('2023-07-22'),
    type: 'pdf',
    isFavorited: false,
  },
  {
    id: '8',
    name: 'Marriage Certificate',
    url: 'https://example.com/marriage.pdf',
    shared: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        permission: 'view',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: '/assets/images/avatars/avatar_2.jpg',
        permission: 'edit',
      },
    ],
    tags: ['certificate', 'legal'],
    size: 1024 * 900, // 900KB
    createdAt: new Date('2023-08-30'),
    modifiedAt: new Date('2023-08-30'),
    type: 'pdf',
    isFavorited: true,
  },
  {
    id: '9',
    name: 'Property Documents',
    url: 'https://example.com/property.pdf',
    shared: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        permission: 'view',
      },
    ],
    tags: ['property', 'legal'],
    size: 1024 * 1024 * 5, // 5MB
    createdAt: new Date('2023-09-15'),
    modifiedAt: new Date('2023-09-15'),
    type: 'pdf',
    isFavorited: true,
  },
  {
    id: '10',
    name: 'Insurance Policy',
    url: 'https://example.com/insurance.pdf',
    shared: [
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: '/assets/images/avatars/avatar_2.jpg',
        permission: 'view',
      },
    ],
    tags: ['insurance', 'financial'],
    size: 1024 * 1024 * 4, // 4MB
    createdAt: new Date('2023-10-20'),
    modifiedAt: new Date('2023-10-20'),
    type: 'pdf',
    isFavorited: false,
  },
  {
    id: '11',
    name: 'Bank Statements',
    url: 'https://example.com/bank.pdf',
    shared: null,
    tags: ['financial', 'bank'],
    size: 1024 * 1024 * 6, // 6MB
    createdAt: new Date('2023-11-25'),
    modifiedAt: new Date('2023-11-25'),
    type: 'pdf',
    isFavorited: false,
  },
  {
    id: '12',
    name: 'Medical Reports',
    url: 'https://example.com/medical.pdf',
    shared: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        permission: 'view',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: '/assets/images/avatars/avatar_2.jpg',
        permission: 'edit',
      },
    ],
    tags: ['medical', 'health'],
    size: 1024 * 1024 * 7, // 7MB
    createdAt: new Date('2023-12-10'),
    modifiedAt: new Date('2023-12-10'),
    type: 'pdf',
    isFavorited: true,
  },
];

// ----------------------------------------------------------------------

export const FILE_TYPE_OPTIONS2 = [
  'folder',
  'txt',
  'zip',
  'audio',
  'image',
  'video',
  'word',
  'excel',
  'powerpoint',
  'pdf',
  'photoshop',
  'illustrator',
];
