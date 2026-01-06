'use client';

import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import { LinearProgress, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useEventContext } from 'src/components/event-context';
import Iconify from 'src/components/iconify';

import { useGetExhibitor } from 'src/api/exhibitor-profile';
import { useExhibitorForm, useGetFormData, useGetFormsList } from 'src/api/forms';

import { IFormListItem, IGetFormDataResponse } from 'src/types/forms';

import { fDateTime } from 'src/utils/format-time';

import FormsNewEditForm from '../form-new-edit-form';
import { getFormConfig } from '../config/form-fields-config';

// ----------------------------------------------------------------------

interface StatusConfig {
  backgroundColor: string;
  color: string;
  icon: string;
  message: string;
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  CREATED: {
    backgroundColor: '#FFF3E0',
    color: 'warning.main',
    icon: 'eos-icons:hourglass',
    message: 'Awaiting Approval',
  },
  RESUBMITTED: {
    backgroundColor: '#FFF3E0',
    color: 'warning.main',
    icon: 'eos-icons:hourglass',
    message: 'Awaiting Approval',
  },
  REJECTED: {
    backgroundColor: '#FFE3E3',
    color: 'error.main',
    icon: 'solar:danger-bold',
    message: 'Form has been rejected',
  },
  APPROVED: {
    backgroundColor: '#E8F5E9',
    color: 'success.main',
    icon: 'mdi:check-circle-outline',
    message: 'Form has been approved',
  },
};

const PAYMENT_STATUS_CONFIGS: Record<string, StatusConfig> = {
  initiated: {
    backgroundColor: '#FFF3E0',
    color: 'warning.main',
    icon: 'eos-icons:hourglass',
    message: 'Payment Pending',
  },
  pending: {
    backgroundColor: '#FFF3E0',
    color: 'warning.main',
    icon: 'eos-icons:hourglass',
    message: 'Payment approval is pending from the admin.',
  },
  captured: {
    backgroundColor: '#E8F5E9',
    color: 'success.main',
    icon: 'mdi:check-circle-outline',
    message: 'Payment Completed',
  },
  approved: {
    backgroundColor: '#E8F5E9',
    color: 'success.main',
    icon: 'mdi:check-circle-outline',
    message: 'Payment Approved',
  },
  failed: {
    backgroundColor: '#FFF3E0',
    color: 'warning.main',
    icon: 'eos-icons:hourglass',
    message: 'Payment Pending',
  },
};

interface FormStatusProps {
  changeType: string;
  reason?: string | null;
  createdAt: string;
}

function FormStatusMessage({ changeType, reason, createdAt }: FormStatusProps) {
  const config = STATUS_CONFIGS[changeType];
  if (!config) return null;

  return (
    <Stack spacing={1} sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Iconify icon="mingcute:time-fill" width={20} height={20} color="text.secondary" />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Submitted On {fDateTime(createdAt)}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          backgroundColor: config.backgroundColor,
          color: config.color,
          border: `2px solid ${config.backgroundColor}`,
          borderRadius: 1,
          px: 2,
          py: 1,
          width: '100%',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={config.icon} width={24} height={24} color={config.color} />
          <Stack direction="column">
            <Typography variant="body2" sx={{ color: config.color }}>
              {config.message}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {changeType === 'REJECTED' && reason && (
        <Stack>
          <Typography variant="subtitle2">Reason</Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              backgroundColor: 'background.neutral',
              border: '1px solid #FFE3E3',
              borderRadius: 1,
              px: 1,
              py: 1,
            }}
          >
            {reason}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

function PaymentStatusMessage({ changeType }: any) {
  let config = PAYMENT_STATUS_CONFIGS[changeType];
  if (!config) {
    config = PAYMENT_STATUS_CONFIGS.initiated;
  }

  return (
    <Stack spacing={1} sx={{ mb: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          backgroundColor: config.backgroundColor,
          color: config.color,
          border: `2px solid ${config.backgroundColor}`,
          borderRadius: 1,
          px: 2,
          py: 1,
          width: '100%',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={config.icon} width={24} height={24} color={config.color} />
          <Stack direction="column">
            <Typography variant="body2" sx={{ color: config.color }}>
              {config.message}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

type Props = {
  id: string | number;
};

export default function FormsEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { eventData } = useEventContext();
  const [currentForm, setCurrentForm] = useState<IFormListItem | undefined>(undefined);
  const [formDataMain, setFormDataMain] = useState<IGetFormDataResponse | undefined>(undefined);

  const { forms, formsLoading } = useGetFormsList();
  const { exhibitor } = useGetExhibitor(eventData?.state.exhibitorId);
  const { formData } = useGetFormData(currentForm?.exhibitorFormId || null);
  const { exhibitorForm } = useExhibitorForm(exhibitor?.supportEmail, eventData?.state.eventId);

  useEffect(() => {
    setCurrentForm(forms.find((form) => form.formId.toString() === id.toString()));
  }, [forms, id]);

  useEffect(() => {
    if (currentForm && currentForm?.exhibitorFormId !== null) {
      setFormDataMain(formData);
    }
  }, [formData, currentForm]);

  if (formsLoading) {
    return <LinearProgress />;
  }

  const formConfig = currentForm ? getFormConfig(currentForm.formId.toString()) : null;
  const isFormAvailable = formConfig !== null;

  const latestLog = formDataMain?.logs?.[formDataMain.logs.length - 1];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Form"
        links={[
          {
            name: 'Forms',
            href: paths.dashboard.forms.root,
          },
          {
            name: currentForm?.name,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {!isFormAvailable ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: '#FFF3E0',
            color: 'warning.main',
            border: '2px solid #FFF3E0',
            borderRadius: 1,
            px: 3,
            py: 4,
            minHeight: 200,
          }}
        >
          <Stack direction="column" alignItems="center" spacing={2}>
            <Iconify icon="solar:file-remove-bold" width={48} height={48} color="warning.main" />
            <Typography variant="h6" sx={{ color: 'warning.main' }}>
              Currently, this form is not available.
            </Typography>
          </Stack>
        </Stack>
      ) : (
        <>
          {currentForm?.formId !== 8 &&
            currentForm?.formId !== 2 &&
            currentForm?.formId !== 5 &&
            currentForm?.formId !== 7 &&
            currentForm?.formId !== 9 &&
            latestLog &&
            !currentForm?.isAutoApproved && (
              <FormStatusMessage
                changeType={latestLog.changeType}
                reason={latestLog.reason}
                createdAt={latestLog.createdAt}
              />
            )}

          {(currentForm?.formId === 8 ||
            currentForm?.formId === 2 ||
            currentForm?.formId === 5 ||
            currentForm?.formId === 7 ||
            currentForm?.formId === 9) &&
            latestLog && (
              <PaymentStatusMessage changeType={formDataMain?.formDetail?.paymentStatus} />
            )}
          {currentForm && forms && exhibitorForm && (
            <FormsNewEditForm
              currentForm={currentForm}
              formData={formDataMain}
              formList={forms}
              exhibitorForm={exhibitorForm}
            />
          )}
        </>
      )}

      {/* <FormsNewEditForm
      currentForm={currentForm}
      formData={formDataMain}
      formList={forms}
      exhibitorForm={exhibitorForm}
      /> */}
    </Container>
  );
}
