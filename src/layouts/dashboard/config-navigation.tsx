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

  const { installments = [], currentDate } = eventData.state || {};
  const status = eventData.state?.status;

  // Sort installments by dueDate ascending
  const sortedInstallments = [...(installments || [])].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Find the nearest installment whose dueDate is <= currentDate
  const now = new Date(currentDate);
  const nearestInstallmentIdx = sortedInstallments.findIndex(
    (inst) => new Date(inst.dueDate).getTime() <= now.getTime()
  );
  const nearestInstallment =
    nearestInstallmentIdx !== -1
      ? sortedInstallments[nearestInstallmentIdx]
      : sortedInstallments[0];

  // Find all installmentTypes from nearestInstallment onwards (including higher)
  const allowedInstallmentTypes = sortedInstallments
    .slice(nearestInstallmentIdx)
    .map((inst) => inst.installmentType);

  // If status is approved, or matches nearestInstallment or any higher, allow navigation
  const isApproved =
    status === 'APPROVED' ||
    status === 'AUTO_APPROVED' ||
    status === 'ACTIVE' ||
    (allowedInstallmentTypes && allowedInstallmentTypes.includes(status));

  // console.log("isDeadlineReached", isDeadlineReached);

  console.log("Is Approved", isApproved);

  const data = useMemo(() => {
    if (isApproved) {
      return [
        // OVERVIEW
        // ----------------------------------------------------------------------
        {
          subheader: '',
          items: [
            { title: 'Overview', path: paths.dashboard.overview, icon: ICONS.analytics },
            {
              title: 'Application Form',
              path: paths.dashboard.form,
              icon: ICONS.file,
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
              children: [
                { title: 'All', path: paths.dashboard.transactions },
                { title: 'Service Request Forms', path: paths.dashboard.formsTransactions },
              ],
            },
            {
              title: 'Exhibitor Profile',
              path: paths.dashboard.exhibitorProfile.root,
              icon: ICONS.job,
            },
            {
              title: 'Exhibitor Manual',
              path: 'https://sit-event-backend-public.s3.amazonaws.com/event/img/ad_ur/1/1767611198208_IFEX-2026-Exhibitors_final_manual.pdf',
              icon: ICONS.external,
            },
            {
              title: 'Service Request Forms',
              path: paths.dashboard.forms.root,
              icon: ICONS.blog,
            },
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
  }, [eventData.state?.status, isApproved]);

  return data;
}
