import { Controller, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel, {
  FormControlLabelProps,
  formControlLabelClasses,
} from "@mui/material/FormControlLabel";
import { FieldOption } from "../../context/SchemaFormRenderer";

// ----------------------------------------------------------------------

interface RHFCheckboxProps extends Omit<FormControlLabelProps, "control"> {
  name: string;
  fieldLabel?: string;
  required?: boolean;
  helperText?: React.ReactNode;
  checkboxColor?: string;
  errorBorderColor?: string;
}

export function RHFCheckbox({
  name,
  label,
  fieldLabel,
  required = false,
  helperText,
  checkboxColor = "#ffa206",
  errorBorderColor = "red",
  ...other
}: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ width: "100%" }}>
          {fieldLabel && (
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor={name}
            >
              {fieldLabel}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                sx={{
                  "&.Mui-checked": {
                    color: checkboxColor,
                  },
                }}
              />
            }
            label={label}
            {...other}
          />

          {(!!error || helperText) && (
            <FormHelperText
              error={!!error}
              sx={{
                marginLeft: 1,
                "&.Mui-error": {
                  color: errorBorderColor,
                },
              }}
            >
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}

// ----------------------------------------------------------------------

interface RHFMultiCheckboxProps
  extends Omit<FormControlLabelProps, "control" | "label"> {
  name: string;
  options: FieldOption[];
  row?: boolean;
  label?: string;
  required?: boolean;
  spacing?: number;
  helperText?: React.ReactNode;
  checkboxColor?: string;
  errorBorderColor?: string;
}

export function RHFMultiCheckbox({
  row,
  name,
  label,
  required = false,
  options,
  spacing,
  helperText,
  checkboxColor = "#ffa206",
  errorBorderColor = "red",
  sx,
  ...other
}: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  const getSelected = (
    selectedItems: (string | number | boolean)[],
    item: string | number | boolean
  ) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

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

          <FormControl component="fieldset" fullWidth>
            <FormGroup
              sx={{
                ...(row && {
                  flexDirection: "row",
                  flexWrap: "wrap",
                }),
                [`& .${formControlLabelClasses.root}`]: {
                  "&:not(:last-of-type)": {
                    mb: spacing || 0,
                  },
                  ...(row && {
                    mr: 0,
                    "&:not(:last-of-type)": {
                      mr: spacing || 2,
                    },
                  }),
                },
                ...sx,
              }}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={String(option.value)}
                  control={
                    <Checkbox
                      checked={field.value.includes(option.value)}
                      onChange={() =>
                        field.onChange(getSelected(field.value, option.value))
                      }
                      disabled={option.disabled}
                      sx={{
                        "&.Mui-checked": {
                          color: checkboxColor,
                        },
                      }}
                    />
                  }
                  label={option.label}
                  {...other}
                />
              ))}
            </FormGroup>

            {(!!error || helperText) && (
              <FormHelperText
                error={!!error}
                sx={{
                  mx: 0,
                  "&.Mui-error": {
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
