import { Controller, useFormContext } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  options: string[];
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  maxHeight?: number;
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
};

export default function RHFSearchSelect({
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
            value={value || null}
            onChange={(_, newValue) => {
              onChange(newValue);
            }}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error.message : helperText}
                className="w-full bg-white rounded-sm"
                sx={{
                  "& .MuiOutlinedInput-root": {
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

// ----------------------------------------------------------------------

type RHFMultiSearchSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  options: string[];
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  maxHeight?: number;
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
  chipMaxWidth?: string;
};

export function RHFMultiSearchSelect({
  name,
  label,
  placeholder = "Select options",
  options,
  disabled = false,
  required = false,
  helperText,
  maxHeight = 200,
  borderColor = "#D1D5DB",
  hoverBorderColor = "#ffa206",
  focusBorderColor = "#ffa206",
  errorBorderColor = "#EF4444",
  chipMaxWidth = "200px",
}: RHFMultiSearchSelectProps) {
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
            multiple
            options={options}
            value={value || []}
            onChange={(_, newValue) => {
              onChange(newValue);
            }}
            disabled={disabled}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={index}
                  label={option}
                  size="small"
                  sx={{
                    maxWidth: chipMaxWidth,
                    height: "auto",
                    minHeight: "24px",
                    "& .MuiChip-label": {
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      lineHeight: "1.2",
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                    },
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error.message : helperText}
                className="w-full bg-white rounded-sm"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    paddingRight: "39px !important",
                    minHeight: "53px",
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
            sx={{
              "& .MuiOutlinedInput-root": {
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
            }}
            ListboxProps={{ style: { maxHeight: `${maxHeight}px` } }}
          />
        </Box>
      )}
    />
  );
}
