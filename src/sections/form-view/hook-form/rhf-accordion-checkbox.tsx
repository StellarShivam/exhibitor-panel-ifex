import { Controller, useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

interface CategoryOption {
  label: string;
  value: string | number;
}

interface AccordionCategory {
  title: string;
  options: CategoryOption[];
}

interface RHFAccordionCheckboxProps {
  name: string;
  categories: AccordionCategory[];
  label?: string;
  required?: boolean;
  helperText?: React.ReactNode;
  checkboxColor?: string;
  errorBorderColor?: string;
  defaultExpanded?: string[]; // Array of category titles to be expanded by default
  disabled?: boolean;
}

interface GroupedValue {
  title: string;
  values: (string | number)[];
}

export function RHFAccordionCheckbox({
  name,
  categories,
  label,
  required = false,
  helperText,
  checkboxColor = '#ffa206',
  errorBorderColor = 'red',
  defaultExpanded = [],
  disabled = false,
}: RHFAccordionCheckboxProps) {
  const { control, watch } = useFormContext();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(defaultExpanded);
  const [internalValues, setInternalValues] = useState<(string | number)[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasAutoExpanded, setHasAutoExpanded] = useState(false);

  const currentFieldValue = watch(name);

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryTitle)
        ? prev.filter((title) => title !== categoryTitle)
        : [...prev, categoryTitle]
    );
  };

  // Convert grouped format to flat array for internal use
  const flattenGroupedValues = (groupedValues: GroupedValue[]): (string | number)[] => {
    if (!Array.isArray(groupedValues)) return [];
    const flat: (string | number)[] = [];
    groupedValues.forEach((group) => {
      if (group.values && Array.isArray(group.values)) {
        flat.push(...group.values);
      }
    });
    return flat;
  };

  // Convert flat array to grouped format
  const groupValues = (flatValues: (string | number)[]): GroupedValue[] => {
    if (!Array.isArray(flatValues) || flatValues.length === 0) return [];

    const grouped: GroupedValue[] = [];

    categories.forEach((category) => {
      const categoryValues = category.options
        .map((opt) => opt.value)
        .filter((value) => flatValues.includes(value));

      if (categoryValues.length > 0) {
        grouped.push({
          title: category.title,
          values: categoryValues,
        });
      }
    });

    return grouped;
  };

  const getSelected = (selectedItems: (string | number)[], item: string | number) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  // Initialize internal values from grouped field value
  useEffect(() => {
    if (!isInitialized && currentFieldValue && Array.isArray(currentFieldValue)) {
      const flattened = flattenGroupedValues(currentFieldValue);
      setInternalValues(flattened);
      setIsInitialized(true);
    }
  }, [currentFieldValue, isInitialized]);

  // Auto-expand categories with selected values on initial load
  useEffect(() => {
    if (isInitialized && !hasAutoExpanded && internalValues.length > 0) {
      const categoriesToExpand: string[] = [];

      categories.forEach((category) => {
        const categoryValues = category.options.map((opt) => opt.value);
        const hasSelectedValues = categoryValues.some((val) => internalValues.includes(val));

        if (hasSelectedValues) {
          categoriesToExpand.push(category.title);
        }
      });

      if (categoriesToExpand.length > 0) {
        setExpandedCategories((prev) => {
          // Merge with existing expanded categories
          const combined = [...new Set([...prev, ...categoriesToExpand])];
          return combined;
        });
      }

      setHasAutoExpanded(true);
    }
  }, [isInitialized, hasAutoExpanded, internalValues, categories]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (item: string | number) => {
          const newValues = getSelected(internalValues, item);
          setInternalValues(newValues);

          // Convert to grouped format and update field
          const grouped = groupValues(newValues);
          field.onChange(grouped);
        };

        return (
          <Box sx={{ width: '100%' }}>
            {label && (
              <label className="block text-gray-700 font-medium mb-2" htmlFor={name}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            <FormControl component="fieldset" fullWidth>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {categories.map((category, index) => {
                  const isExpanded = expandedCategories.includes(category.title);
                  const categoryValues = category.options.map((opt) => opt.value);
                  const selectedInCategory = categoryValues.filter((val) =>
                    internalValues.includes(val)
                  );
                  const hasSelections = selectedInCategory.length > 0;

                  return (
                    <div
                      key={category.title}
                      className={`${index !== 0 ? 'border-t border-gray-300' : ''}`}
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.title)}
                        className="w-full px-4 py-1 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                        disabled={disabled}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-600">
                            {isExpanded ? '-' : '+'}
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                            {category.title}
                          </span>
                          {hasSelections && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                              {selectedInCategory.length} selected
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Accordion Content */}
                      {isExpanded && (
                        <div className="px-4 py-3 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {category.options.map((option) => (
                              <FormControlLabel
                                key={option.value}
                                control={
                                  <Checkbox
                                    checked={internalValues.includes(option.value)}
                                    onChange={() => handleChange(option.value)}
                                    sx={{
                                      padding: '4px',
                                      transform: 'scale(0.89)',
                                      '&.Mui-checked': {
                                        color: checkboxColor,
                                      },
                                    }}
                                    disabled={disabled}
                                  />
                                }
                                label={<span className="text-base">{option.label}</span>}
                                sx={{
                                  margin: 0,
                                }}
                                disabled={disabled}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {(!!error || helperText) && (
                <FormHelperText
                  error={!!error}
                  sx={{
                    mx: 0,
                    mt: 1,
                    '&.Mui-error': {
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
