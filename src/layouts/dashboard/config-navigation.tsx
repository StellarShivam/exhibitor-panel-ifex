import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';
import { useEventContext } from 'src/components/event-context';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { eventData } = useEventContext();

  // console.log(eventData, 'jhugyf');

  const data = useMemo(() => {
    if (eventData.state?.status === 'APPROVED' || eventData.state?.status === 'AUTO_APPROVED') {
      return [
        // OVERVIEW
        // ----------------------------------------------------------------------
        {
          subheader: '',
          items: [
            { title: 'Overview', path: paths.dashboard.overview, icon: ICONS.analytics },
            {
              title: 'Your Profile',
              path: paths.dashboard.exhibitorProfile.root,
              icon: ICONS.job,
            },
            // {
            //   title: 'Exhibitor Badges',
            //   path: paths.dashboard.teamManagement.root,
            //   icon: ICONS.user,
            //   children: [
            //     { title: 'Members', path: paths.dashboard.teamManagement.root },
            //     { title: 'Add Member', path: paths.dashboard.teamManagement.new },
            //   ],
            // },
            // {
            //   title: 'Facia',
            //   path: paths.dashboard.facia,
            //   icon: ICONS.kanban,
            // },
            {
              title: 'Transactions',
              path: paths.dashboard.transactions,
              icon: ICONS.banking,
            },
            {
              title: 'Form',
              path: paths.dashboard.form,
              icon: ICONS.file,
            },
            // {
            //   title: 'Documents',
            //   path: paths.dashboard.documents.root,
            //   icon: ICONS.blog,
            //   children: [
            //     { title: 'View Documents', path: paths.dashboard.documents.root },
            //     { title: 'Upload Document', path: paths.dashboard.documents.upload },
            //   ],
            // },
            // {
            //   title: 'Production Requirements',
            //   path: paths.dashboard.productionRequirements.root,
            //   icon: ICONS.banking,
            //   children: [
            //     { title: 'Products', path: paths.dashboard.productionRequirements.root },
            //     { title: 'Orders', path: paths.dashboard.productionRequirements.orderList },
            //   ],
            // },
            // {
            //   title: 'Help & Support',
            //   path: paths.dashboard.helpAndSupport.root,
            //   icon: ICONS.external,
            // },
            // {
            //   title: 'My Connects',
            //   path: paths.dashboard.myConnects,
            //   icon: ICONS.user,
            // },
            // {
            //   title: 'Chat',
            //   path: paths.dashboard.chat,
            //   icon: ICONS.chat,
            // },
            // {
            //   title: 'Admin',
            //   path: paths.dashboard.setupTasks,
            //   icon: ICONS.tour,
            // },
            // {
            //   title: 'Product Portfolio',
            //   path: paths.dashboard.productPortfolio.root,
            //   icon: ICONS.product,
            // },
            // {
            //   title: 'Listing Order',
            //   path: paths.dashboard.marketingAddOns,
            //   icon: ICONS.order,
            // },
            // {
            //   title: 'Invitation Coupons',
            //   path: paths.dashboard.invitationCoupons,
            //   icon: ICONS.label,
            // },
          ],
        },

        // MANAGEMENT
        // ----------------------------------------------------------------------
        // {
        //   subheader: 'management',
        //   items: [
        //     {
        //       title: 'user',
        //       path: paths.dashboard.group.root,
        //       icon: ICONS.user,
        //       children: [
        //         { title: 'four', path: paths.dashboard.group.root },
        //         { title: 'five', path: paths.dashboard.group.five },
        //         { title: 'six', path: paths.dashboard.group.six },
        //       ],
        //     },
        //   ],
        // },
      ];
    }
    return [];
  }, [eventData.state?.status]);

  return data;
}
