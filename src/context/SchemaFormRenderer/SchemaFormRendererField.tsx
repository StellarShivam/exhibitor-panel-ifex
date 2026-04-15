import { Controller, type ControllerRenderProps, type ControllerFieldState } from 'react-hook-form';

import RHFTextField from 'src/components/hook-form/rhf-text-field';
import RHFTextArea from 'src/components/hook-form/rhf-text-area';
import RHFRadioGroup from 'src/components/hook-form/rhf-radio-group';
import { RHFCheckbox, RHFMultiCheckbox } from 'src/components/hook-form/rhf-checkbox';
import { RHFAccordionCheckbox } from 'src/components/hook-form/rhf-accordion-checkbox';
import RHFPhone from 'src/components/hook-form/rhf-phone';
import RHFSearchSelect2 from 'src/components/hook-form/rhf-search-select2';
import {
  RHFCountrySelect,
  RHFStateSelect,
  RHFCitySelect,
} from 'src/components/hook-form/rhf-country-state-city';
import { FileUploadBox } from 'src/components/hook-form/FileUploadBox';
import {
  RHFTableRadioInput,
  type TableRadioHeader,
  type TableRadioOption,
} from 'src/components/hook-form/rhf-table-radio';
import { RHFSignaturePad } from 'src/components/hook-form/rhf-signature-pad';

import { useSchemaFormRenderer } from './SchemaFormRendererContext';
import { FieldArrayGroup } from './FieldArrayGroup';
import type { FieldConfig, FieldOption, AccordionCategory } from './types';

// ─── Option normalisation ─────────────────────────────────────────────────────

/** Converts a mixed string | FieldOption array to FieldOption[]. */
function normalizeOptions(raw:FieldOption[] = []): FieldOption[] {
  return raw.map((item) =>
    typeof item === 'string' ? { label: item, value: item } : item
  );
}

/** Converts category options to the shape RHFAccordionCheckbox expects. */
function normalizeCategories(
  raw: AccordionCategory[] = []
): { title: string; options: FieldOption[] }[] {
  return raw.map((cat) => ({
    title: cat.title,
    options: normalizeOptions(cat.options),
  }));
}

/** Converts FieldOption[] to TableRadioOption[] for table-radio input. */
function normalizeTableRadioOptions(raw: FieldOption[] = []): TableRadioOption[] {
  return raw.map((item, index) => ({
    ...item,
    id: item.id ?? index,
    value: typeof item.value === 'boolean' ? String(item.value) : item.value,
  } as TableRadioOption));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SchemaFormRendererFieldProps {
  field: FieldConfig;
}

export function SchemaFormRendererField({
  field,
}: SchemaFormRendererFieldProps) {
  const { isFieldVisible, methods, getAsyncHelperText, isEditable } = useSchemaFormRenderer();

  if (!isFieldVisible(field.id)) return null;

  const asyncResult = field.asyncHelperText ? getAsyncHelperText(field.name) : null;

  const {
    name,
    type,
    label,
    required,
    disabled,
    helperText,
    placeholder,
    options,
    categories,
    defaultExpanded,
    minRows,
    maxRows,
    maxWords,
    showWordCount,
    maxLength,
    defaultCountry,
    countryFieldName,
    stateFieldName,
    excludeCountries,
    accept,
    headers,
    note,
  } = field;

  // Combine isEditable flag with field-level disabled prop
  const finalDisabled = disabled || !isEditable;

  const renderInput = () => {
  switch (type) {
    // ── Text-based ───────────────────────────────────────────────────────────
    case 'text':
    case 'email':
    case 'number':
    case 'url':
    case 'password':
      return (
        <RHFTextField
          name={name}
          label={label}
          type={type}
          required={required}
          disabled={finalDisabled}
          helperText={helperText}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      );

    // ── Textarea ─────────────────────────────────────────────────────────────
    case 'textarea':
      return (
        <RHFTextArea
          name={name}
          label={label}
          required={required}
          helperText={helperText}
          minRows={minRows}
          maxRows={maxRows}
          maxWords={maxWords}
          showWordCount={showWordCount}
          maxLength={maxLength}
          disabled={finalDisabled}
        />
      );

    // ── Select ───────────────────────────────────────────────────────────────
    case 'select':{
      const objOptions = normalizeOptions(options).map((o) => ({
        label: o.label,
        value: o.value,
      }));
      return (
        <RHFSearchSelect2
          name={name}
          label={label}
          required={required}
          disabled={finalDisabled}
          helperText={helperText}
          placeholder={placeholder}
          options={objOptions}
        />
      );
    }

    // ── Radio Group ───────────────────────────────────────────────────────────
    case 'radio': {
      const radioOptions = normalizeOptions(options);
      return (
        <RHFRadioGroup
          name={name}
          label={label}
          required={required}
          options={radioOptions}
          helperText={helperText}
          row={field.row}
          disabled={finalDisabled}
        />
      );
    }

    // ── Single Checkbox ───────────────────────────────────────────────────────
    case 'checkbox':
      return (
        <RHFCheckbox
          name={name}
          label={label ?? ''}
          // fieldLabel={label}
          required={required}
          helperText={helperText}
          disabled={finalDisabled}
        />
      );

    // ── Multi-Checkbox Group ──────────────────────────────────────────────────
    case 'multi-checkbox': {
      const checkboxOptions = options as FieldOption[] || [];
      return (
        <RHFMultiCheckbox
          name={name}
          label={label}
          required={required}
          options={checkboxOptions}
          helperText={helperText}
          disabled={finalDisabled}
          row={field.row}
        />
      );
    }

    // ── Accordion Checkbox ────────────────────────────────────────────────────
    case 'accordion-checkbox':
      return (
        <RHFAccordionCheckbox
          name={name}
          label={label}
          required={required}
          categories={normalizeCategories(categories)}
          defaultExpanded={defaultExpanded}
          helperText={helperText}
          disabled={finalDisabled}
        />
      );

    // ── Phone ─────────────────────────────────────────────────────────────────
    case 'phone':
      return (
        <RHFPhone
          name={name}
          label={label}
          required={required}
          disabled={finalDisabled}
          helperText={helperText}
          placeholder={placeholder}
          country={defaultCountry ?? 'in'}
        />
      );

    // ── Country ───────────────────────────────────────────────────────────────
    case 'country':
      return (
        <RHFCountrySelect
          name={name}
          label={label}
          required={required}
          disabled={finalDisabled}
          helperText={helperText}
          placeholder={placeholder}
          excludeCountries={excludeCountries}
        />
      );

    // ── State ─────────────────────────────────────────────────────────────────
    case 'state':
      return (
        <RHFStateSelect
          name={name}
          label={label}
          required={required}
          disabled={finalDisabled}
          helperText={helperText}
          placeholder={placeholder}
          countryFieldName={countryFieldName ?? ''}
        />
      );

    // ── City ──────────────────────────────────────────────────────────────────
    case 'city':
      return (
        <RHFCitySelect
          name={name}
          label={label}
          required={required}
          disabled={finalDisabled}
          helperText={helperText}
          placeholder={placeholder}
          countryFieldName={countryFieldName ?? ''}
          stateFieldName={stateFieldName ?? ''}
        />
      );

    // ── File Upload ───────────────────────────────────────────────────────────
    case 'file':
      return (
        <Controller
          name={name}
          control={methods.control}
          render={({
            field: { onChange, value },
            fieldState: { error },
          }: {
            field: ControllerRenderProps;
            fieldState: ControllerFieldState;
          }) => (
            <FileUploadBox
              label={label ?? name}
              accept={accept ?? '*/*'}
              required={required}
              error={!!error}
              errorMessage={error?.message}
              helperText={helperText}
              preview={typeof value === 'string' ? value : undefined}
              onChange={onChange}
              onDelete={() => onChange(null)}
              disabled={finalDisabled}
            />
          )}
        />
      );

    // ── Table Radio Input ─────────────────────────────────────────────────────
    case 'table-radio': {
      const tableOptions = normalizeTableRadioOptions(options);
      return (
        <RHFTableRadioInput
          name={name}
          headers={(headers ?? []) as TableRadioHeader[]}
          options={tableOptions}
          label={label}
          required={required}
          note={note}
          disabled={finalDisabled}
        />
      );
    }

    // ── Field Array (repeating group) ─────────────────────────────────────────
    case 'field-array':
      return <FieldArrayGroup field={field} />;

    // ── Subheading (section header for grouping) ───────────────────────────────
    case 'subheading':
      return (
        <div className="pt-4">
          <h3 className="text-3xl font-semibold text-gray-900 border-b-2 border-gray-300 pb-2">
            {label || 'Section'}
          </h3>
        </div>
      );

    // ── Custom Component ───────────────────────────────────────────────────────
    case 'custom':
      return <>{field.component}</>;

    // ── Signature Pad ───────────────────────────────────────────────────────────
    case 'signature':
      return (
        <RHFSignaturePad
          name={name}
          label={label}
          required={required}
          helperText={helperText}
          disabled={finalDisabled}
        />
      );

    default:
      return null;
  }
  }; // end renderInput

  return (
    <>
      {renderInput()}
      {asyncResult === 'loading' && (
        <p className="text-sm mt-1 text-gray-400">Verifying…</p>
      )}
      {asyncResult && asyncResult !== 'loading' && asyncResult.status === 'success' && (
        <p className="text-sm mt-1 text-green-600">✓ {asyncResult.message}</p>
      )}
      {asyncResult && asyncResult !== 'loading' && asyncResult.status === 'error' && (
        <p className="text-sm mt-1 text-red-600">✗ {asyncResult.message}</p>
      )}
      {asyncResult && asyncResult !== 'loading' && asyncResult.status === 'info' && (
        <p className="text-sm mt-1 text-blue-600">{asyncResult.message}</p>
      )}
    </>
  );
}
