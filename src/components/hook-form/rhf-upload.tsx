import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import Stack from '@mui/material/Stack';

import { Upload, UploadBox, UploadProps, UploadAvatar } from '../upload';

// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, 'file'> {
  name: string;
  multiple?: boolean;
}

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox files={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, accept, ...other }: Props) {
  const { control } = useFormContext();
  const defaultAccept = { 'image/*': [] };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Upload
            multiple
            accept={accept || defaultAccept}
            files={field.value}
            error={!!error}
            helperText={
              <Stack spacing={1}>
                {helperText}
                {!!error && (
                  <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                    {error?.message}
                  </FormHelperText>
                )}
              </Stack>
            }
            {...other}
          />
        ) : (
          <Upload
            accept={accept || defaultAccept}
            file={field.value}
            error={!!error}
            helperText={
              <Stack spacing={1}>
                {helperText}
                {!!error && (
                  <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                    {error?.message}
                  </FormHelperText>
                )}
              </Stack>
            }
            {...other}
          />
        )
      }
    />
  );
}
