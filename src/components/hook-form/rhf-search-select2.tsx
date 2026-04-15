import { Controller, useFormContext } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  options: { label: string; value: string | number | boolean }[];
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  maxHeight?: number;
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
};

export default function RHFSearchSelect2({
  name,
  label,
  placeholder = "Search and select",
  options,
  disabled = false,
  required = false,
  helperText,
  maxHeight = 200,
  borderColor = "#D1D5DB",
  hoverBorderColor = "#ffa206",
  focusBorderColor = "#ffa206",
  errorBorderColor = "#EF4444",
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
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
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            value={options.find((option) => option.value === value) || null}
            onChange={(_, newValue) => {
              onChange(newValue?.value ?? null);
            }}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error.message : helperText}
                className="w-full rounded-sm"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    paddingRight: "39px !important",
                    height: "53px",
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
                    padding: "4px 18px 4px 4px !important",
                  },
                  "& .MuiFormHelperText-root.Mui-error": {
                    color: errorBorderColor,
                  },
                }}
              />
            )}
            ListboxProps={{ style: { maxHeight: `${maxHeight}px` } }}
          />
        </Box>
      )}
    />
  );
}