import axios from 'axios';
import Cookies from 'js-cookie';

import { paths } from 'src/routes/paths';

import { HOST_API, BASE_URL } from 'src/config-global';
import { Details } from '@mui/icons-material';

// ----------------------------------------------------------------------

// interface CommonHeaderProperties extends HeadersDefaults {
//   Authorization: string;
// }

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

const axiosInstance2 = axios.create({ baseURL: BASE_URL });

let AUTH_TOKEN_MANAGER: string = '';

let TOKEN_UUID = '';

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
export { axiosInstance2 };

// ----------------------------------------------------------------------

// export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
//   const [url, config] = Array.isArray(args) ? args : [args];

//   const res = await axiosInstance.get(url, { ...config });

//   return res.data;
// };

// ----------------------------------------------------------------------

interface ApiResponse {
  data: any;
  status: string;
  message: string;
  meta: Object;
}

export const fetcher = async (url: string) => {
  try {
    const AUTH_TOKEN = tokenManager.getToken();

    const response = await axiosInstance2.get<ApiResponse>(url, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Axios Data Response:', response);

    if (response.data.status === 'failure') {
      throw new Error(response?.data?.message || 'Failed to fetch data');
    }

    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error fetching data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch');
  }
};

// ----------------------------------------------------------------------
export const apiEndpoints = {
  base: BASE_URL,
  auth: {
    refresh: '/auth/refreshToken',
    login: '/auth/login',
  },
  invitationCoupon: {
    listing: '/exhibitorCoupons/',
  },
  partner: {
    listing: '/partners',
    update: '/update/partner',
    create: '/create/partner',
    detail: '/partner/',
  },
  productionRequirements: {
    getCategories: '/getCategory',
    getSubCategories: '/getSubCategory/',
    getProducts: '/getProductSku/',
    addToCart: '/addToCart',
    getCart: '/getCart/',
    removeFromCart: '/removeFromCart/',
    deleteFromCart: '/deleteFromCart/',
    emptyCart: '/emptyCart',
    getOrders: '/getOrders/exhibitorId?exhibitorId=',
    checkout: '/checkout?eventId=',
  },
  teamManagement: {
    listing: '/exhibitorUsers/',
    create: '/createExhibitorUser',
    update: '/updateExhibitorUser',
    details: '/exhibitorUser/',
  },
  helpAndSupport: {
    listing: '/tickets/email/',
    createTicket: '/createTicket',
    detailsTicket: '/ticket/details/',
    exhibitorMessage: '/ticketExhibitor/message',
  },
  exhibitorProfile: {
    details: '/exhibitorUsers/',
    update: '/updateExhibitor',
  },
  overview: {
    scannedUsers: '/exhibitorScannedUsers/',
    sessions: '/getAllMeetings',
    tasks: '/exhibitorUserTasks/',
    updateTask: '/updateTask',
  },
  connect: {
    listing: '/exhibitorScannedUsers/',
  },
  documentsUpload: {
    listing: '/exhibitor/document?eventId=',
    proforma: 'exhibitorDocumentData/',
  },
  event: {
    listing: '/exhibitorDetails',
    components: '/event/components',
    types: '/event/types',
    status: '/event/status',
    update: '/update/event',
    create: '/create/event',
    editAbout: '/edit/eventabout',
    about: '/eventabout/',
    detail: '/event/',
    userCohorts: '/eventusercohorts/',
  },
  form:{
    list:'/exhibitorUserData/',
    exhibitorForm: '/exhibitorForm/',
    updateForm: '/updateRegistrationDetails',
    updatePaymentStatus: '/updatePaymentStatus',
    payment: '/exhibitorPaymentDetails/',
  },
  pricing: {
    detail: '/eventpricing/',
    update: '/update/eventpricing',
  },
  eventForm: {
    detail: '/eventform/',
    save: '/save/eventform',
  },
  faq: {
    create: '/create/eventfaq',
    detail: '/eventfaq/',
    update: '/update/eventfaq',
  },
  media: {
    categories: '/media/categories',
  },
  speaker: {
    create: '/create/speaker',
    update: '/update/speaker',
    listing: '/speakers/',
    createSchedule: '/create/schedule',
    updateSchedule: '/update/schedule',
    getSchedule: '/event/schedule/',
  },
  tickets: {
    liveEvents: '/ticket/events',
    listing: '/tickets/',
    assignees: '/ticket/assignees',
    details: '/ticket/details/',
    update: '/update/ticket',
    history: '/ticket/history/',
    message: '/ticket/message',
  },
  peoples: {
    listing: '/registered/users/',
    approval: '/update/approval',
    email: '/send/email',
    notification: '/send/notification',
  },
  EventMedia: {
    eventListing: '/live/events',
    uploadMedia: '/file/uploadEventGallery',
    getEventMedia: '/eventGallery',
  },
  campaign: {
    listing: '/campaignDetails/',
    upload: '/file/uploadCampaignCsv',
  },
  coupons: {
    list: '/coupons/',
    create: '/saveCoupon',
    delete: '/delete/coupon/',
  },
  productPortfolio: {
    list: '/getPortfolioProducts/',
    create: '/createPortfolioProduct',
    update: '/updatePortfolioProduct',
    delete: '/deletePortfolioProduct/',
    savePortfolio: '/savePortfolio',
    getPortfolio: '/getPortfolio/',
  },
  products: {
    list: '/getProducts',
    details: '/getProduct/',
    create: '/createProduct',
    update: '/createProduct',
    categories: '/getCategory',
    colours: '/getColour',
    subCategories: '/getSubCategory/',
    sizes: '/getSize/',
    deleteProduct: '/deleteProduct/',
    deleteSku: '/deleteSkuById/',
  },
  common: {
    fileUpload: '/file/upload',
    userCohorts: '/usercohorts',
    createEventMediaUpload: 'create/eventmedia',
    updateEventMediaUpload: 'update/eventmedia',
    getEventMediaUpload: '/eventmedia/',
  },
  paymentSummary: {
    updatePaymentStatus: '/updatePaymentStatus',
    payment: '/exhibitorPaymentDetails/',
  }
};

export const endpoints = {
  chat: 'https://api-dev-minimal-v510.vercel.app/api/chat',
  calendar: '/api/calendar',
  auth: {
    me: '/api/v1/core/me',
    login: '/api/v1/core/login',
    register: '/api/auth/register',
  },
  mail: {
    list: 'https://api-dev-minimal-v510.vercel.app/api/mail/list',
    details: 'https://api-dev-minimal-v510.vercel.app/api/mail/details',
    labels: 'https://api-dev-minimal-v510.vercel.app/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  partner: '/api/v1/core/partner',
  event: 'api/v1/core/event',
  eventForm: 'api/v1/core/bulk-update-event-form',
  eventComponent: '/api/v1/core/component',
  userCohort: '/api/v1/core/user-cohort',
  eventServiceExport: '/api/v1/core/event-service-export',
  eventServiceImport: '/api/v1/core/event-service-import/',
  service: (service_type: any) => `/api/v1/core/${service_type}-service`,
  eventTemplate: '/api/v1/core/template',
};

export const tokenManager = {
  getTokenUUID: () => TOKEN_UUID,
  setTokenUUID: (newToken: string) => {
    TOKEN_UUID = newToken;
  },

  getToken: () => AUTH_TOKEN_MANAGER,
  setToken: (newToken: string) => {
    AUTH_TOKEN_MANAGER = newToken;
  },
  refreshToken: async () => {
    try {
      // Assume you have an API to refresh the token.
      const response = await axios.post(
        `${BASE_URL}${apiEndpoints.auth.refresh}`,
        {
          // token: "488aebda-85ab-4d26-8b1e-be9cbf7180b0"
          token: TOKEN_UUID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // const data = await response.json();
      // if (response.ok) {
      tokenManager.setToken(response.data.data.accessToken); // Update the token globally
      console.log('Token refreshed successfully');
      Cookies.set('templateToken', response.data.data.accessToken, {
        domain: 'localhost',
        secure: true,
        sameSite: 'None',
      });
      console.log(response.data.data.accessToken);
      // } else {
      //   console.error('Failed to refresh token', data.message);
      // }
    } catch (error) {
      console.error('Error refreshing token:', error);
      window.location.href = paths.auth.jwt.login;
    }
  },
};
