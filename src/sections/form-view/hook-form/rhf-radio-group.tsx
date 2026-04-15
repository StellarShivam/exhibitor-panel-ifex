import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';

// ----------------------------------------------------------------------

type Props = RadioGroupProps & {
  name: string;
  options: { label: string; value: string | number; disabled?: boolean }[];
  label?: string;
  required?: boolean;
  spacing?: number;
  helperText?: React.ReactNode;
  radioColor?: string;
  errorBorderColor?: string;
};

export default function RHFRadioGroup({
  row,
  name,
  label,
  required = false,
  options,
  spacing,
  helperText,
  radioColor = '#ffa206',
  errorBorderColor = 'red',
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ width: '100%' }}>
          {label && (
            <label className="block text-gray-700 font-medium mb-2" htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <FormControl component="fieldset" fullWidth disabled={other.disabled}>
            <RadioGroup {...field} row={row} value={field?.value ?? ''} {...other}>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: radioColor,
                        },
                      }}
                      disabled={option.disabled}
                    />
                  }
                  label={option.label}
                  sx={{
                    '&:not(:last-of-type)': {
                      mb: spacing || 0,
                    },
                    ...(row && {
                      mr: 0,
                      '&:not(:last-of-type)': {
                        mr: spacing || 2,
                      },
                    }),
                  }}
                />
              ))}
            </RadioGroup>

            {(!!error || helperText) && (
              <FormHelperText
                error={!!error}
                sx={{
                  mx: 0,
                  '&.Mui-error': {
                    color: errorBorderColor,
                  },
                }}
              >
                {error ? error?.message : helperText}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      )}
    />
  );
}
