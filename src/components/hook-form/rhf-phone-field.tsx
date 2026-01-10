import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, FormHelperText } from '@mui/material';
import { Theme, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface StyledPhoneInputProps {
  theme?: Theme;
  $error?: boolean;
  $disabled?: boolean;
}

const StyledPhoneInput = styled(PhoneInput)<StyledPhoneInputProps>(({
  theme,
  $error,
  $disabled,
}) => {
  const getFocusBoxShadowColor = () => {
    if ($error) return theme?.palette.error.lighter;
    return theme?.palette.mode === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
  };

  const getBorderColor = () => {
    if ($error) return theme?.palette.error.main;
    if (!$disabled) return '#262626';
    return theme?.palette.mode === 'dark' ? theme?.palette.grey[700] : theme?.palette.grey[300];
  };

  return {
    position: 'relative',
    '& .form-control': {
      width: '100%',
      height: '53px',
      padding: '14px 14px 14px 58px',
      borderRadius: theme?.shape.borderRadius,
      borderColor: $error ? theme?.palette.error.main : getBorderColor(),
      backgroundColor: 'transparent',
      fontSize: '1rem',
      color: theme?.palette.text.primary,
      '&::placeholder': {
        color: theme?.palette.text.disabled,
      },
      '&:hover': {
        borderColor: $error ? theme?.palette.error.main : theme?.palette.text.primary,
      },
      '&:focus': {
        borderColor: $error ? theme?.palette.error.main : getBorderColor(),
        boxShadow: $error
          ? `0 0 0 1.5px rgb(250, 51, 51)`
          : `0 0 0 2px ${getFocusBoxShadowColor()}`,
        outline: 'none',
        color: theme?.palette.text.primary,
      },
    },
    '& .special-label': {
      backgroundColor: theme?.palette.background.paper,
      color: $error ? theme?.palette.error.main : theme?.palette.text.secondary,
      top: '-8px',
    },
    '& .country-list': {
      backgroundColor: theme?.palette.background.paper,
      color: theme?.palette.text.primary,
      '& .country:hover': {
        backgroundColor: theme?.palette.action.hover,
      },
      '& .country.highlight': {
        backgroundColor: theme?.palette.action.selected,
      },
    },
    '& .selected-flag': {
      backgroundColor: 'transparent !important',
      '&:hover, &:focus': {
        backgroundColor: `${theme?.palette.action.hover} !important`,
      },
    },
    '& .arrow': {
      borderTopColor: theme?.palette.text.primary,
    },
    '& fieldset': {
      borderColor: '#262626',
    },
  };
});

const FieldWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2.5),
}));

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  country?: string;
  disabled?: boolean;
};

export default function RHFPhoneField({
  name,
  label,
  helperText,
  placeholder,
  country = 'in',
  disabled = false,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FieldWrapper>
          <StyledPhoneInput
            country={country}
            value={value}
            onChange={(phone, data: any) => {
              const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
              onChange(formattedPhone);
            }}
            placeholder={placeholder}
            disabled={disabled}
            specialLabel={label}
            $error={!!error}
            $disabled={disabled}
            inputProps={{
              required: true,
            }}
            {...other}
          />
          {(error || helperText) && (
            <FormHelperText
              error={!!error}
              sx={{
                position: 'absolute',
                bottom: '-20px',
                left: '14px',
                margin: 0,
              }}
            >
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FieldWrapper>
      )}
    />
  );
}
