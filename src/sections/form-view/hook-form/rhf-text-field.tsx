import { Controller, useFormContext } from "react-hook-form";

import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
  valueFormatter?: (value: string) => string;
};

export default function RHFTextField({
  name,
  helperText,
  type,
  label,
  required = false,
  borderColor = "#D1D5DB",
  hoverBorderColor = "#ffa206",
  focusBorderColor = "#ffa206",
  errorBorderColor = "red",
  valueFormatter,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ width: "100%" }}>
          {label && (
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor={name}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <TextField
            {...field}
            id={name}
            fullWidth
            type={type}
            value={type === "number" && field.value === 0 ? "" : field.value}
            onChange={(event) => {
              if (type === "number") {
                field.onChange(Number(event.target.value));
                return;
              }

              const formattedValue = valueFormatter
                ? valueFormatter(event.target.value)
                : event.target.value;

              field.onChange(formattedValue);
            }}
            onWheel={(e) => {
              if (type === 'number') {
                e.target.blur()
              }
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
            {...other}
            label={undefined} // Remove the floating label
            sx={{
              "& .MuiOutlinedInput-root": {
                height: type === "number" || other.multiline ? "auto" : "53px",
                backgroundColor: "white",
                "& fieldset": {
                  borderColor: error ? errorBorderColor : borderColor,
                },
                "&:hover fieldset": {
                  borderColor: hoverBorderColor,
                },
                "&.Mui-focused fieldset": {
                  borderColor: focusBorderColor,
                  borderWidth: "2px",
                },
              },
              "& .MuiInputBase-input": {
                padding: other.multiline
                  ? "15.5px 14px"
                  : "15.5px 14px !important",
              },
              "& .MuiFormHelperText-root": {
                marginLeft: 1,
              },
              "& .MuiFormHelperText-root.Mui-error": {
                color: errorBorderColor,
              },
              ...other.sx,
            }}
          />
        </Box>
      )}
    />
  );
}
