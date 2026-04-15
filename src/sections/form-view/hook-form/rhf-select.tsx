import { Controller, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { Theme, SxProps } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import FormControl, { FormControlProps } from "@mui/material/FormControl";

// ----------------------------------------------------------------------

type RHFSelectProps = TextFieldProps & {
  name: string;
  label?: string;
  required?: boolean;
  native?: boolean;
  maxHeight?: boolean | number;
  children: React.ReactNode;
  PaperPropsSx?: SxProps<Theme>;
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
};

export function RHFSelect({
  name,
  label,
  required = false,
  native,
  maxHeight = 220,
  helperText,
  children,
  PaperPropsSx,
  borderColor = "#D1D5DB",
  hoverBorderColor = "#B1B1B1",
  focusBorderColor = "#B1B1B1",
  errorBorderColor = "#EF4444",
  ...other
}: RHFSelectProps) {
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
            select
            fullWidth
            className="w-full bg-white"
            variant="outlined"
            size="small"
            SelectProps={{
              native,
              MenuProps: {
                PaperProps: {
                  sx: {
                    ...(!native && {
                      maxHeight:
                        typeof maxHeight === "number" ? maxHeight : "unset",
                    }),
                    ...PaperPropsSx,
                  },
                },
              },
              sx: { textTransform: "capitalize" },
              displayEmpty: true,
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
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
                padding: "15.5px 14px !important",
                color: field.value === "" ? "#9CA3AF" : "inherit",
              },
              "& .MuiFormHelperText-root.Mui-error": {
                color: errorBorderColor,
              },
            }}
            {...other}
          >
            {children}
          </TextField>
        </Box>
      )}
    />
  );
}

// ----------------------------------------------------------------------

type RHFMultiSelectProps = FormControlProps & {
  name: string;
  label?: string;
  chip?: boolean;
  checkbox?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  options: {
    label: string;
    value: string;
  }[];
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
};

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  helperText,
  borderColor = "#D1D5DB",
  hoverBorderColor = "#B1B1B1",
  focusBorderColor = "#B1B1B1",
  errorBorderColor = "#EF4444",
  ...other
}: RHFMultiSelectProps) {
  const { control } = useFormContext();

  const renderValues = (selectedIds: string[]) => {
    const selectedItems = options.filter((item) =>
      selectedIds.includes(item.value)
    );

    if (!selectedItems.length && placeholder) {
      return <Box sx={{ color: "text.disabled" }}>{placeholder}</Box>;
    }

    if (chip) {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selectedItems.map((item) => (
            <Chip key={item.value} size="small" label={item.label} />
          ))}
        </Box>
      );
    }

    return selectedItems.map((item) => item.label).join(", ");
  };

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
            </label>
          )}
          <FormControl error={!!error} fullWidth {...other}>
            <Select
              {...field}
              multiple
              displayEmpty={!!placeholder}
              id={`multiple-${name}`}
              renderValue={renderValues}
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
                  padding: "15.5px 14px !important",
                },
              }}
            >
              {options.map((option) => {
                const selected = field.value.includes(option.value);

                return (
                  <MenuItem key={option.value} value={option.value}>
                    {checkbox && (
                      <Checkbox size="small" disableRipple checked={selected} />
                    )}

                    {option.label}
                  </MenuItem>
                );
              })}
            </Select>

            {(!!error || helperText) && (
              <FormHelperText error={!!error}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      )}
    />
  );
}
