import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";

// ----------------------------------------------------------------------

type RHFCountrySelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  maxHeight?: number;
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
  excludeCountries?: string[];
  customCountries?: { name: string }[];
};

export function RHFCountrySelect({
  name,
  label,
  excludeCountries = [],
  placeholder = "Select Country",
  disabled = false,
  required = false,
  helperText,
  maxHeight = 300,
  borderColor = "#D1D5DB",
  hoverBorderColor = "#ffa206",
  focusBorderColor = "#ffa206",
  errorBorderColor = "#EF4444",
  customCountries = [],
}: RHFCountrySelectProps) {
  const { control } = useFormContext();
  // if customCountries provided, assume they at least have a name and coerce to ICountry
  const countries: ICountry[] =
    customCountries && customCountries.length > 0
      ? (customCountries as unknown as ICountry[])
      : Country.getAllCountries().filter((country) => !excludeCountries.includes(country.name));

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
            options={countries}
            getOptionLabel={(option: ICountry) => option.name}
            value={countries.find((country) => country.name === value) || null}
            onChange={(_, newValue) => {
              onChange(newValue?.name || null);
            }}
            disabled={disabled}
            isOptionEqualToValue={(option, value) => option.name === value.name}
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

type RHFStateSelectProps = {
  name: string;
  countryFieldName: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  maxHeight?: number;
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
  customStates?: { name: string; }[];
};

export function RHFStateSelect({
  name,
  countryFieldName,
  label,
  placeholder = "Select State",
  disabled = false,
  required = false,
  helperText,
  maxHeight = 300,
  borderColor = "#D1D5DB",
  hoverBorderColor = "#ffa206",
  focusBorderColor = "#ffa206",
  errorBorderColor = "#EF4444",
  customStates = undefined,
}: RHFStateSelectProps) {
  const { control, watch, setValue } = useFormContext();
  const countryName = watch(countryFieldName);
  const currentStateValue = watch(name);

  // Convert country name to country code
  const country = countryName
    ? Country.getAllCountries().find((c) => c.name === countryName)
    : null;
  const countryCode = country?.isoCode;

  const states = customStates ? customStates : countryCode ? State.getStatesOfCountry(countryCode) : [];

  // Add N/A option
  const statesWithNA = [
    ...states,
    { isoCode: "N/A", name: "N/A", countryCode: countryCode || "" } as IState,
  ];

  // Reset state when country changes (but only if the current state is not valid for new country)
  useEffect(() => {
    if (countryName && currentStateValue) {
      // Recalculate countryCode from countryName
      const currentCountry = Country.getAllCountries().find(
        (c) => c.name === countryName
      );
      const currentCountryCode = currentCountry?.isoCode;

      const currentStates = currentCountryCode
        ? State.getStatesOfCountry(currentCountryCode)
        : [];
      const currentStatesWithNA = [
        {
          isoCode: "N/A",
          name: "N/A",
          countryCode: currentCountryCode || "",
        } as IState,
        ...currentStates,
      ];
      const isValidState = currentStatesWithNA.some(
        (state) => state.name === currentStateValue
      );
      if (!isValidState) {
        setValue(name, null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryName]);

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
            options={statesWithNA}
            getOptionLabel={(option: IState) => option.name}
            value={statesWithNA.find((state) => state.name === value) || null}
            onChange={(_, newValue) => {
              onChange(newValue?.name || null);
            }}
            disabled={disabled || !countryCode}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  !countryCode ? "Select country first" : placeholder
                }
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

type RHFCitySelectProps = {
  name: string;
  countryFieldName: string;
  stateFieldName: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  maxHeight?: number;
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
};

export function RHFCitySelect({
  name,
  countryFieldName,
  stateFieldName,
  label,
  placeholder = "Select City",
  disabled = false,
  required = false,
  helperText,
  maxHeight = 300,
  borderColor = "#D1D5DB",
  hoverBorderColor = "#ffa206",
  focusBorderColor = "#ffa206",
  errorBorderColor = "#EF4444",
}: RHFCitySelectProps) {
  const { control, watch, setValue } = useFormContext();
  const countryName = watch(countryFieldName);
  const stateName = watch(stateFieldName);
  const currentCityValue = watch(name);

  // Convert country name to country code
  const country = countryName
    ? Country.getAllCountries().find((c) => c.name === countryName)
    : null;
  const countryCode = country?.isoCode;

  // Convert state name to state code
  const state =
    countryCode && stateName && stateName !== "N/A"
      ? State.getStatesOfCountry(countryCode).find((s) => s.name === stateName)
      : null;
  const stateCode = state?.isoCode;

  const cities =
    countryCode && stateCode && stateCode !== "N/A"
      ? City.getCitiesOfState(countryCode, stateCode)
      : [];

  // Add N/A option
  const citiesWithNA = [
    ...cities,
    {
      name: "N/A",
      stateCode: stateCode || "",
      countryCode: countryCode || "",
    } as ICity,
  ];

  // Reset city when state changes (but only if the current city is not valid for new state)
  useEffect(() => {
    if (stateName && currentCityValue) {
      // Recalculate stateCode from stateName
      const currentState =
        countryCode && stateName && stateName !== "N/A"
          ? State.getStatesOfCountry(countryCode).find(
            (s) => s.name === stateName
          )
          : null;
      const currentStateCode = currentState?.isoCode;

      const currentCities =
        countryCode && currentStateCode && currentStateCode !== "N/A"
          ? City.getCitiesOfState(countryCode, currentStateCode)
          : [];
      const currentCitiesWithNA = [
        {
          name: "N/A",
          stateCode: currentStateCode || "",
          countryCode: countryCode || "",
        } as ICity,
        ...currentCities,
      ];
      const isValidCity = currentCitiesWithNA.some(
        (city) => city.name === currentCityValue
      );
      if (!isValidCity) {
        setValue(name, null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateName, countryName]);

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
            options={citiesWithNA}
            getOptionLabel={(option: ICity) => option.name}
            value={citiesWithNA.find((city) => city.name === value) || null}
            onChange={(_, newValue) => {
              onChange(newValue?.name || null);
            }}
            disabled={disabled || !countryCode || !stateName}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  !countryCode
                    ? "Select country first"
                    : !stateName
                      ? "Select state first"
                      : placeholder
                }
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
