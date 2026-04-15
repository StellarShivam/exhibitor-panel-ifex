import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
  country?: string;
};

export default function RHFPhone({
  name,
  label,
  placeholder = "Enter Phone Number",
  disabled = false,
  required = false,
  helperText,
  borderColor = "#D1D5DB",
  // hoverBorderColor = "#ffa206",
  focusBorderColor = "#ffa206",
  errorBorderColor = "red",
  country = "in",
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
          <PhoneInput
            country={country}
            value={value || ""}
            onChange={(phone) => {
              const formattedPhone = phone.startsWith("+")
                ? phone
                : `+${phone}`;
              onChange(formattedPhone);
            }}
            disabled={disabled}
            placeholder={placeholder}
            specialLabel=""
            enableSearch={true}
            searchPlaceholder="Search country"
            inputStyle={{
              width: "100%",
              height: "53px",
              borderRadius: "0.125rem",
              borderColor: error ? errorBorderColor : borderColor,
              backgroundColor: disabled ? "#F3F4F6" : "white",
              fontSize: "1rem",
              color: "#374151",
              transition: "border-color 0.2s",
            }}
            buttonStyle={{
              backgroundColor: "transparent",
              borderColor: error ? errorBorderColor : borderColor,
              borderRadius: "0.125rem 0 0 0.125rem",
              opacity: disabled ? 0.7 : 1,
              transition: "border-color 0.2s",
            }}
            dropdownStyle={{
              backgroundColor: "white",
              color: "#374151",
              overflowX: "hidden",
            }}
            searchStyle={{
              width: "94%",
              padding: "8px",
              fontSize: "0.875rem",
              border: "1px solid #D1D5DB",
              borderRadius: "0.125rem",
              margin: "4px",
            }}
            containerStyle={{
              width: "100%",
            }}
            inputProps={{
              required,
              autoFocus: false,
              onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
                e.target.style.borderColor = focusBorderColor;
                e.target.style.boxShadow = `0 0 0 1px ${focusBorderColor}`;
              },
              onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                e.target.style.borderColor = error
                  ? errorBorderColor
                  : borderColor;
                e.target.style.boxShadow = "none";
              },
            }}
          />
          {(error || helperText) && (
            <p
              className="text-xs mt-1 ml-2"
              style={{
                color: error ? errorBorderColor : "#6B7280",
              }}
            >
              {error ? error.message : helperText}
            </p>
          )}
        </Box>
      )}
    />
  );
}
