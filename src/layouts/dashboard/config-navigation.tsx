import { useMemo, useEffect, useState } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';
import { useEventContext } from 'src/components/event-context';
import { usePaymentByExhibitorID } from 'src/api/payment-summary';
import { useExhibitorForm, useBuyerForm } from 'src/api/form';
import { useBoolean } from 'src/hooks/use-boolean';

import SponsorContactDialog from 'src/components/sponsor-contact-dialog';
import { featureFlags } from 'src/config-global';

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

  // const { payment, paymentLoading, refetchPayment } = usePaymentByExhibitorID(
  //   eventData.state.exhibitorId
  // );
  const { exhibitorForm, exhibitorFormLoading, reFetchExhibitorForm } = useExhibitorForm();
  const [formStatus, setFormStatus] = useState('PENDING');

  const sponsorDialog = useBoolean();
  const buyerDialog = useBoolean();

  useEffect(() => {
    const status = exhibitorForm?.metaData?.data?.status;
    if (exhibitorForm) {
      setFormStatus(status);
    }
  }, [exhibitorForm]);

  const data = useMemo(() => {
    console.log(eventData)
    const isBuyer = eventData.state?.roles?.includes('BUYER');
    const isExhibitor = eventData.state?.roles?.includes('EXHIBITOR');
    const isSponsor = eventData.state?.roles?.includes('SPONSOR');
    if (isExhibitor) {
      return [
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
            ...(formStatus !== 'PENDING'
              ? [
                {
                  title: 'Transactions',
                  path: paths.dashboard.transactions,
                  icon: ICONS.banking,
                },
              ]
              : []),
            // {
            //   title: 'General Rules & Regulations',
            //   path: "https://bharat-tex.com/general-regulation/",
            //   icon: ICONS.menuItem,
            // },
            // {
            //   title: 'Download Center',
            //   path: "https://bharat-tex.com/downloads/",
            //   icon: ICONS.menuItem,
            // },
            // {
            //   title: 'Download Web Banners',
            //   path: "https://bharat-tex.com/web-banners/",
            //   icon: ICONS.menuItem,
            // },
            // {
            //   title: 'Become a Sponsor',
            //   path: '#',
            //   icon: ICONS.menuItem,
            //   onClick: sponsorDialog.onTrue,
            // },
            // {
            //   title: 'Invite Buyers',
            //   icon: ICONS.menuItem,
            //   path: '#',
            //   onClick: buyerDialog.onTrue,
            // },
          ],
        },
      ];
    }

    // if (isBuyer) {
    //   return [
    //     {
    //       subheader: '',
    //       items: [
    //         { title: 'Overview', path: paths.dashboard.overview, icon: ICONS.analytics },
    //         {
    //           title: 'Application Form',
    //           path: paths.dashboard.buyer.form,
    //           icon: ICONS.file,
    //         },
    //         ...((isOverseasBuyer && featureFlags.planYourVisit) 
    //           ? [
    //               {
    //                 title: 'Plan Your Travel',
    //                 path: paths.dashboard.buyer.planYourVisit,
    //                 icon: ICONS.booking,
    //               },
    //             ]
    //           : []),
    //         ...(
    //             featureFlags.exhibitorDirectory ? [
    //               {
    //                 title: 'Pre-fair Directory',
    //                 path: paths.dashboard.buyer.exhibitorDirectory,
    //                 icon: ICONS.calendar,
    //               },
    //             ] : []
    //           )
    //       ],
    //     },
    //   ];
    // }

    // if (isSponsor) {
    //   return [
    //     {
    //       subheader: '',
    //       items: [
    //         { title: 'Overview', path: paths.dashboard.overview, icon: ICONS.analytics },
    //         {
    //           title: 'Sponsor Application Form',
    //           path: paths.dashboard.sponsor.form,
    //           icon: ICONS.file,
    //         },
    //         ...(formStatus !== 'PENDING'
    //           ? [
    //               {
    //                 title: 'Transactions',
    //                 path: paths.dashboard.transactions,
    //                 icon: ICONS.banking,
    //               },
    //             ]
    //           : []),
    //       ],
    //     },
    //   ];
    // }
    return [
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
          //   title: 'Exhibitor Members',
          //   path: paths.dashboard.teamManagement.root,
          //   icon: ICONS.user,
          //   children: [
          //     { title: 'Members', path: paths.dashboard.teamManagement.root },
          //     { title: 'Add Member', path: paths.dashboard.teamManagement.new },
          //   ],
          // },
          ...(formStatus !== 'PENDING'
            ? [
              {
                title: 'Transactions',
                path: paths.dashboard.transactions,
                icon: ICONS.banking,
              },
            ]
            : []),
        ],
      },
    ];
  }, [formStatus, sponsorDialog.onTrue, buyerDialog.onTrue]);

  return { data, sponsorDialog, buyerDialog };
}
