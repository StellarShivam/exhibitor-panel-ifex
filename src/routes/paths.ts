// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  LIST: '/list',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      verify: `${ROOTS.AUTH}/jwt/verify`,
    },
  },
  // LIST
  list: {
    root: ROOTS.LIST,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    // comingSoon1: `${ROOTS.DASHBOARD}/coming-soon`,
    // comingSoon2: `${ROOTS.DASHBOARD}/coming-soon`,
    transactions: `${ROOTS.DASHBOARD}/transactions`,
    overview: `${ROOTS.DASHBOARD}/overview`,
    form: `${ROOTS.DASHBOARD}/form`,
    setupTasks: `${ROOTS.DASHBOARD}/setup-tasks`,
    exhibitorProfile: {
      root: `${ROOTS.DASHBOARD}/exhibitor-profile`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/exhibitor-profile/${id}/edit`,
    },
    // productPortfolio: `${ROOTS.DASHBOARD}/product-portfolio`,
    marketingAddOns: `${ROOTS.DASHBOARD}/marketing-addons`,
    myConnects: `${ROOTS.DASHBOARD}/my-connects`,
    documents: {
      root: `${ROOTS.DASHBOARD}/documents-view`,
      upload: `${ROOTS.DASHBOARD}/documents-upload`,
    },
    chat: `${ROOTS.DASHBOARD}/chat`,
    // productionRequirements: `${ROOTS.DASHBOARD}/production-requirements`,
    productionRequirements: {
      root: `${ROOTS.DASHBOARD}/production-requirements`,
      checkout: `${ROOTS.DASHBOARD}/production-requirements/checkout`,
      orderList: `${ROOTS.DASHBOARD}/production-requirements/orders`,
      details: (id: string) => `${ROOTS.DASHBOARD}/production-requirements/${id}`,
    },
    productPortfolio: {
      root: `${ROOTS.DASHBOARD}/product-portfolio`,
      new: `${ROOTS.DASHBOARD}/product-portfolio/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product-portfolio/${id}/edit`,
    },
    leads3: `${ROOTS.DASHBOARD}/leads3`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    teamManagement: {
      root: `${ROOTS.DASHBOARD}/team-management`,
      new: `${ROOTS.DASHBOARD}/team-management/new`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/team-management/${id}/edit`,
      // demo: {
      //   edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      // },
    },
    helpAndSupport: {
      root: `${ROOTS.DASHBOARD}/help-and-support`,
      new: `${ROOTS.DASHBOARD}/help-and-support/new`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/help-and-support/${id}/detail`,
    },
    invitationCoupons: `${ROOTS.DASHBOARD}/invitation-coupons`,
    facia: `${ROOTS.DASHBOARD}/facia`,
    status: (id: string) => `${ROOTS.DASHBOARD}/status/${id}`,
    registration: `${ROOTS.DASHBOARD}/registration`,
  },
};
