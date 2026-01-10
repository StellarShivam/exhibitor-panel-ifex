import { Controller, useFormContext } from 'react-hook-form';

import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTextField({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
          // InputLabelProps={{
          //   sx: {
          //     fontSize: '1rem', // or remove this line for default
          //     '&.Mui-focused': {
          //       fontSize: '1rem',
          //     },
          //     '&.MuiInputLabel-shrink': {
          //       fontSize: '1rem',
          //     },
          //   },
          // }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#262626',
              },
              // '&:hover fieldset': {
              //   borderColor: 'black',
              // },
              // '&.Mui-focused fieldset': {
              //   fontSize: '1.1rem',
              //   borderColor: 'black',
              // },
            },
          }}
        />
      )}
    />
  );
}
