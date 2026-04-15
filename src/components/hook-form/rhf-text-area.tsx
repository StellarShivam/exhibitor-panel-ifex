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
  showWordCount?: boolean;
  maxWords?: number;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
};

export default function RHFTextArea({
  name,
  helperText,
  label,
  required = false,
  borderColor = "#D1D5DB",
  hoverBorderColor = "#ffa206",
  focusBorderColor = "#ffa206",
  errorBorderColor = "red",
  showWordCount = true,
  maxWords,
  minRows = 4,
  maxRows = 8,
  maxLength = 1000,
  ...other
}: Props) {
  const { control } = useFormContext();

  const countWords = (text: string): number => {
    if (!text || text.trim() === "") return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const currentWordCount = countWords(field.value || "");
        const isOverLimit =
          maxWords !== undefined && currentWordCount > maxWords;
        const displayError =
          error ||
          (isOverLimit
            ? { message: `Word count exceeds maximum of ${maxWords} words` }
            : null);

        return (
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
              multiline
              minRows={minRows}
              maxRows={maxRows}
              value={field.value || ""}
              onChange={(event) => {
                let trimmedValue = event.target.value.trimStart();
                if (maxLength && trimmedValue.length > maxLength) {
                  trimmedValue = trimmedValue.substring(0, maxLength);
                }
                field.onChange(trimmedValue);
              }}
              onBlur={(event) => {
                const trimmedValue = event.target.value.trim();
                field.onChange(trimmedValue);
                field.onBlur();
              }}
              error={!!displayError}
              helperText={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span>
                    {displayError ? displayError.message : helperText || ""}
                  </span>
                  {showWordCount && (
                    <span
                      style={{
                        marginLeft: "auto",
                        color: isOverLimit ? errorBorderColor : "inherit",
                      }}
                    >
                      {currentWordCount}
                      {maxWords ? ` / ${maxWords}` : ""} word
                      {currentWordCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </Box>
              }
              {...other}
              label={undefined} // Remove the floating label
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  "& fieldset": {
                    borderColor: displayError ? errorBorderColor : borderColor,
                  },
                  "&:hover fieldset": {
                    borderColor: hoverBorderColor,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: focusBorderColor,
                    borderWidth: "2px",
                  },
                },
                // "& .MuiInputBase-input": {
                //   padding: "15.5px 14px",
                // },
                "& .MuiFormHelperText-root": {
                  marginLeft: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
                "& .MuiFormHelperText-root.Mui-error": {
                  color: errorBorderColor,
                },
                ...other.sx,
              }}
            />
          </Box>
        );
      }}
    />
  );
}
