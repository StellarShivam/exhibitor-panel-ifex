import { Controller, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";

// ----------------------------------------------------------------------

type RadioOption = { label: string; value: string | number | boolean, disabled?: boolean };

type Props = RadioGroupProps & {
	name: string;
	options: RadioOption[];
	label?: string;
	required?: boolean;
	spacing?: number;
	helperText?: React.ReactNode;
	radioColor?: string;
	errorBorderColor?: string;
	endAdornment?: React.ReactNode;
	onClickAdornment?: (option: RadioOption) => void;
	disabled?: boolean;
};

export default function RHFRadioGroup({
	row,
	name,
	label,
	required = false,
	options,
	spacing,
	helperText,
	radioColor = "#ffa206",
	errorBorderColor = "red",
	endAdornment,
	onClickAdornment,
	disabled,
	...other
}: Props) {
	const { control } = useFormContext();

	// Determine if the first option has a boolean value
	const hasBooleanValues = options.length > 0 && typeof options[0].value === 'boolean';

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => {
				// Convert boolean values to strings for radio button compatibility
				const fieldValue = hasBooleanValues ? String(field.value) : field.value;

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

						<FormControl component="fieldset" fullWidth>
							<RadioGroup
								{...field}
								value={fieldValue}
								onChange={(e) => {
									// Convert string back to boolean if needed
									let value: string | number | boolean = e.target.value;
									if (hasBooleanValues) {
										value = e.target.value === 'true';
									}
									field.onChange(value);
								}}
								row={row}
								{...other}
							>
								{options?.map((option) => (
									<Box
										key={String(option.value)}
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",

											"&:not(:last-of-type)": {
												mb: spacing || 0,
											},
											...(row && {
												mr: 0,
												"&:not(:last-of-type)": {
													mr: spacing || 2,
												},
											}),
										}}
									>
										<FormControlLabel
											value={String(option.value)}
											control={
												<Radio
													sx={{
														"&.Mui-checked": {
															color: radioColor,
														},
													}}
													disabled={option.disabled || disabled}
												/>
											}
											label={option.label}
										/>
										{endAdornment && <Box sx={{ mb: 1 }} onClick={() => { onClickAdornment?.(option) }}>{endAdornment}</Box>}
									</Box>
								))}
							</RadioGroup>

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
				);
			}}
		/>
	);
}
