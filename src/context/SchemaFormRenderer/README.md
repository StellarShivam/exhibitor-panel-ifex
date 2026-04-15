# SchemaFormRenderer

A config-driven form system built on top of [react-hook-form](https://react-hook-form.com/). You describe your form entirely in a plain TypeScript object — fields, steps, validation, conditional visibility, async checks, watchers — and the renderer handles everything else.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [File Structure](#2-file-structure)
3. [Creating a Form — Step by Step](#3-creating-a-form--step-by-step)
   - [Step 1 — Write the Zod/Yup schema](#step-1--write-the-zodyup-schema)
   - [Step 2 — Write the config](#step-2--write-the-config)
   - [Step 3 — Write the Renderer component](#step-3--write-the-renderer-component)
   - [Step 4 — Write the Root component](#step-4--write-the-root-component)
   - [Step 5 — Write the Page wrapper](#step-5--write-the-page-wrapper)
4. [Config Reference](#4-config-reference)
   - [Top-level SchemaFormRendererConfig](#top-level-schemaformrendererconfig)
   - [FieldConfig — all properties](#fieldconfig--all-properties)
   - [All Field Types](#all-field-types)
   - [Responsive Layout (metadata)](#responsive-layout-metadata)
   - [Conditional Visibility (visibleWhen)](#conditional-visibility-visiblewhen)
   - [Watchers](#watchers)
   - [Async Helper Text](#async-helper-text)
5. [Context API](#5-context-api)
6. [Real-world Examples in this Codebase](#6-real-world-examples-in-this-codebase)

---

## 1. Architecture Overview

```
SchemaFormRendererProvider          ← holds RHF methods + all context
├── SchemaFormStepper               ← optional sidebar timeline (multi-step only)
└── <your Renderer component>
    ├── <form onSubmit={...}>
    │   ├── SchemaFormRenderer      ← renders the current step's fields
    │   └── Back / Next / Submit buttons
    └── error / success message
```

The **Provider** receives a single `config` object and initialises `react-hook-form` internally. Every descendant can call `useSchemaFormRenderer()` to read form state and trigger navigation.

---

## 2. File Structure

Every form in this project follows the same four-file convention:

```
src/sections/<domain>/form-view/
├── schema.ts          ← Zod (or Yup) validation schema + inferred type
├── config.ts          ← getXxxFormConfig() — returns SchemaFormRendererConfig
├── XxxFormRenderer.tsx ← handles step nav + submit; renders SchemaFormRenderer
├── XxxForm.tsx        ← fetches API options, builds config, wraps Provider
├── form.tsx           ← page shell: header, Edit/Cancel button, renders XxxForm
└── index.ts           ← barrel exports
```

Real examples:

- `src/sections/visitors/form-view/`
- `src/sections/space-booking/form-view/ExhibitorRegistration/`

---

## 3. Creating a Form — Step by Step

### Step 1 — Write the Zod/Yup schema

`schema.ts`

```ts
import { z } from 'zod';

export const myFormSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    tags: z.array(z.string()).min(1, 'Select at least one tag'),
    otherTag: z.string().optional(),
  })
  // Cross-field refinement: "otherTag" required when "Other" is selected
  .refine((d) => !(d.tags.includes('Other') && !d.otherTag?.trim()), {
    message: 'Please specify your other tag',
    path: ['otherTag'],
  });

export type MyFormData = z.infer<typeof myFormSchema>;
```

---

### Step 2 — Write the config

`config.ts`

The config is a plain TypeScript object that describes **everything** about the form. Return it from a function so it can receive dynamic options (from an API) and state (`formValues`, `isEditable`).

```ts
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldOption, SchemaFormRendererConfig } from 'src/context/SchemaFormRenderer/types';
import { myFormSchema } from './schema';

// ── Default (empty) values — one key per schema field ──────────────────────
export const defaultValues: Record<string, unknown> = {
  firstName: '',
  lastName: '',
  email: '',
  tags: [],
  otherTag: '',
};

// ── Config factory ──────────────────────────────────────────────────────────
export function getMyFormConfig({
  tagOptions = [],
  formValues, // pre-populate from API response
  isEditable = true, // false = read-only mode
}: {
  tagOptions?: FieldOption[];
  formValues?: Record<string, unknown> | null;
  isEditable?: boolean;
} = {}): SchemaFormRendererConfig {
  const mergedDefaults = formValues ? { ...defaultValues, ...formValues } : defaultValues;

  return {
    resolver: zodResolver(myFormSchema) as never,
    defaultValues: mergedDefaults,
    mode: 'onChange',
    isEditable, // ← drives read-only mode globally

    steps: [
      {
        id: 1,
        label: 'Personal Details',
        fields: [
          {
            id: 'personalDetailsHeading',
            name: 'personalDetailsHeading',
            type: 'subheading',
            label: 'Personal Details',
            metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
          },
          {
            id: 'firstName',
            name: 'firstName',
            type: 'text',
            label: 'First Name*',
            required: true,
            placeholder: 'Jane',
          },
          {
            id: 'lastName',
            name: 'lastName',
            type: 'text',
            label: 'Last Name*',
            required: true,
            placeholder: 'Doe',
          },
          {
            id: 'email',
            name: 'email',
            type: 'email',
            label: 'Email*',
            required: true,
            placeholder: 'jane@example.com',
          },
        ],
      },
      {
        id: 2,
        label: 'Tags',
        fields: [
          {
            id: 'tags',
            name: 'tags',
            type: 'multi-checkbox',
            label: 'Select Tags*',
            required: true,
            options: tagOptions,
            metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
          },
          {
            id: 'otherTag',
            name: 'otherTag',
            type: 'text',
            label: 'Please specify other tag',
            placeholder: 'Enter tag',
            required: true,
            // only shown when "Other" is checked in the tags array
            visibleWhen: { field: 'tags', value: 'Other' },
            metadata: { xs: 12, sm: 12, md: 12, lg: 12 },
          },
        ],
      },
    ],
  };
}
```

---

### Step 3 — Write the Renderer component

`MyFormRenderer.tsx`

This component sits **inside** the Provider. It calls `useSchemaFormRenderer()` to drive step navigation and handles the submit logic.

```tsx
import { useRef, useState } from 'react';
import { CircularProgress } from '@mui/material';
import {
  SchemaFormRenderer,
  SchemaFormStepper,
  useSchemaFormRenderer,
} from 'src/context/SchemaFormRenderer';
import { updateMyForm } from 'src/api/myApi'; // your API call

interface Props {
  apiMessage: { type: string; text: string };
  setApiMessage: (m: { type: string; text: string }) => void;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  urn?: string;
  isEditable?: boolean;
}

export default function MyFormRenderer({
  apiMessage,
  setApiMessage,
  isSubmitting,
  setIsSubmitting,
  urn = '',
  isEditable = true,
}: Props) {
  const topRef = useRef<HTMLDivElement>(null);
  const { methods, goToNext, goToPrev, isFirstStep, isLastStep, stepped } = useSchemaFormRenderer();

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const isValid = await goToNext();
    if (!isValid) {
      setApiMessage({ type: 'error', text: 'Please fix errors before continuing.' });
      // Scroll to first error field
      setTimeout(() => {
        const firstError = Object.keys(methods.formState.errors)[0];
        if (firstError)
          document
            .querySelector(`[name="${firstError}"]`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      setApiMessage({ type: '', text: '' });
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    goToPrev();
    setApiMessage({ type: '', text: '' });
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmit = methods.handleSubmit(async (data) => {
    setApiMessage({ type: '', text: '' });
    setIsSubmitting(true);
    try {
      const response = await updateMyForm({ ...data, urn });
      if (response?.status) {
        setApiMessage({ type: 'success', text: response.message || 'Saved successfully!' });
      } else {
        setApiMessage({
          type: 'error',
          text: response?.message || 'Save failed. Please try again.',
        });
      }
    } catch (err: unknown) {
      setApiMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to submit.',
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <div ref={topRef} className="absolute top-0 left-0" />
      <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] h-full rounded-2xl w-full mx-auto">
        {/* Sidebar stepper */}
        <SchemaFormStepper />

        {/* Form area */}
        <div className="h-full w-full">
          <form onSubmit={onSubmit}>
            <SchemaFormRenderer />

            {/* Error / success message */}
            {apiMessage.text && (
              <div
                className={`my-4 p-3 rounded-md text-center text-sm ${apiMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
              >
                {apiMessage.text}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-2 justify-between w-full mt-6 pt-4 border-t border-gray-200">
              {stepped ? (
                <>
                  {!isFirstStep && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={isSubmitting}
                      className="bg-[#ffa206] w-full lg:w-40 h-14 text-xl text-white rounded-full px-4 py-2 hover:scale-105 disabled:opacity-50 transition-all"
                    >
                      Back
                    </button>
                  )}
                  {!isLastStep ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl text-white rounded-full px-4 py-2 hover:scale-105 disabled:opacity-50 transition-all"
                    >
                      Next
                    </button>
                  ) : !isSubmitting ? (
                    <button
                      type="submit"
                      disabled={!isEditable}
                      className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl text-white rounded-full px-4 py-2 hover:scale-105 disabled:opacity-50 transition-all"
                    >
                      Submit
                    </button>
                  ) : (
                    <div className="flex ml-auto items-center gap-3 h-14 rounded-full px-6 py-2">
                      <span className="text-black font-semibold">Submitting...</span>
                      <CircularProgress size={34} thickness={5} sx={{ color: '#ffa206' }} />
                    </div>
                  )}
                </>
              ) : !isSubmitting ? (
                <button
                  type="submit"
                  disabled={!isEditable}
                  className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl text-white rounded-full px-4 py-2 hover:scale-105 disabled:opacity-50 transition-all"
                >
                  Submit
                </button>
              ) : (
                <div className="flex ml-auto items-center gap-3 h-14 rounded-full px-6 py-2">
                  <span className="text-black font-semibold">Submitting...</span>
                  <CircularProgress size={34} thickness={5} sx={{ color: '#ffa206' }} />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
```

---

### Step 4 — Write the Root component

`MyForm.tsx`

This component fetches dynamic options, builds the config, and wraps everything in the Provider. It also reacts to the `isEditable` prop so the config (and therefore all inputs) updates reactively.

```tsx
import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import { type FieldOption, SchemaFormRendererProvider } from 'src/context/SchemaFormRenderer';

import { useGetMyForm, fetchTagOptions } from 'src/api/myApi';
import { getMyFormConfig } from './config';
import MyFormRenderer from './MyFormRenderer';

export default function MyForm({ isEditable }: { isEditable: boolean }) {
  const { id } = useParams<{ id: string }>();
  const { myForm, myFormLoading } = useGetMyForm(id ?? '');

  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagOptions, setTagOptions] = useState<FieldOption[]>([]);

  // Fetch dropdown options once on mount
  useEffect(() => {
    fetchTagOptions()
      .then((data) => setTagOptions(data.map((d) => ({ label: d.name, value: d.id }))))
      .catch(console.error);
  }, []);

  const isFormEditable = !myFormLoading && isEditable;

  // Existing API data → form pre-population
  const formValues = useMemo(
    () => (myForm ? (myForm as unknown as Record<string, unknown>) : null),
    [myForm]
  );

  // Rebuild config when options, data, or editability changes
  const config = useMemo(
    () => getMyFormConfig({ tagOptions, formValues, isEditable: isFormEditable }),
    [tagOptions, formValues, isFormEditable]
  );

  if (myFormLoading) {
    return (
      <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 4 }}>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  }

  return (
    <SchemaFormRendererProvider config={config}>
      <MyFormRenderer
        apiMessage={apiMessage}
        setApiMessage={setApiMessage}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        urn={id ?? ''}
        isEditable={isFormEditable}
      />
    </SchemaFormRendererProvider>
  );
}
```

> **Key rule:** `SchemaFormRendererProvider` initialises `react-hook-form` once with `config.defaultValues`. To pre-populate with existing data, always merge the API response into `defaultValues` inside `getMyFormConfig()` — **not** via `useEffect`/`setValue` after mount.

---

### Step 5 — Write the Page wrapper

`form.tsx`

The outer shell with a header, Edit/Cancel toggle, and role guards.

```tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Backdrop, Box, Button, CircularProgress, Typography } from '@mui/material';
import { useGetMyForm } from 'src/api/myApi';
import { useEventContext } from 'src/components/event-context';
import MyForm from './MyForm';

export default function MyRegistrationForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'view';

  const { myForm, myFormLoading } = useGetMyForm(id ?? '');
  const { eventData } = useEventContext();
  const [isEditable, setIsEditable] = useState(mode === 'editing');

  // Keep state in sync with URL
  useEffect(() => {
    setIsEditable(mode === 'editing');
  }, [mode]);

  // Back-navigation guard
  useEffect(() => {
    const handlePopState = () => navigate('/dashboard/my-section', { replace: true });
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const toggleEditMode = () => {
    const next = !isEditable;
    setIsEditable(next);
    setSearchParams({ mode: next ? 'editing' : 'view' });
  };

  // Role-based edit guard
  const isEditDisabled = () =>
    eventData.state.roles?.includes('EXECUTIVE') ||
    eventData.state.roles?.includes('PAYMENT_ADMIN') ||
    false;

  return (
    <>
      {myFormLoading && (
        <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 4 }}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      {/* Header */}
      <Box sx={{ bgcolor: '#ffa206', color: 'white', p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          My Form — Overview
        </Typography>
        <Typography variant="body1">Description of this form.</Typography>
      </Box>

      {/* Edit toggle */}
      <Box sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          onClick={toggleEditMode}
          disabled={isEditDisabled()}
          sx={{ bgcolor: isEditable ? '#FF4D1C' : '#2D3250', textTransform: 'none' }}
        >
          {isEditable ? 'Cancel Edit' : 'Edit'}
        </Button>
      </Box>

      {/* Form */}
      <div className="bg-[#F6F6F6] min-h-[100vh] rounded-2xl mx-6 mb-8 p-6 lg:p-8">
        <MyForm isEditable={isEditable && !isEditDisabled()} />
      </div>
    </>
  );
}
```

`index.ts`

```ts
export { default as MyRegistrationForm } from './form';
export { default as MyForm } from './MyForm';
export { default as MyFormRenderer } from './MyFormRenderer';
```

---

## 4. Config Reference

### Top-level `SchemaFormRendererConfig`

| Property        | Type                            | Default      | Description                                                          |
| --------------- | ------------------------------- | ------------ | -------------------------------------------------------------------- |
| `defaultValues` | `Record<string, unknown>`       | **required** | Initial values for every field. Merge API data here to pre-populate. |
| `steps`         | `StepConfig[]`                  | —            | Use for multi-step forms. Each step has `id`, `label`, `fields`.     |
| `fields`        | `FieldConfig[]`                 | —            | Use for flat (single-step) forms instead of `steps`.                 |
| `resolver`      | `Resolver`                      | none         | `zodResolver(schema)` or `yupResolver(schema)`.                      |
| `mode`          | `'onChange' \| 'onBlur' \| ...` | `'onChange'` | RHF validation trigger strategy.                                     |
| `stepped`       | `boolean`                       | `true`       | `false` shows all steps at once (no stepper sidebar).                |
| `isEditable`    | `boolean`                       | `true`       | `false` disables every input globally (read-only mode).              |
| `watchers`      | `Watcher[]`                     | —            | Side-effects triggered when watched fields change.                   |

---

### `FieldConfig` — all properties

| Property           | Type                       | Required for                               | Description                                                                                 |
| ------------------ | -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `id`               | `string`                   | all                                        | Unique React key.                                                                           |
| `name`             | `string`                   | all                                        | RHF field name. Supports dot-notation (`address.city`).                                     |
| `type`             | `InputType`                | all                                        | See [All Field Types](#all-field-types).                                                    |
| `label`            | `string`                   | most                                       | Displayed label.                                                                            |
| `required`         | `boolean`                  | —                                          | Shows required marker; used by validation.                                                  |
| `disabled`         | `boolean`                  | —                                          | Forces this field disabled even when `isEditable` is true.                                  |
| `placeholder`      | `string`                   | —                                          | Placeholder text.                                                                           |
| `helperText`       | `string`                   | —                                          | Static hint below the input.                                                                |
| `options`          | `FieldOption[]`            | select, radio, multi-checkbox, table-radio | `{ label, value }` pairs.                                                                   |
| `categories`       | `AccordionCategory[]`      | accordion-checkbox                         | Grouped option sections.                                                                    |
| `defaultExpanded`  | `string[]`                 | accordion-checkbox                         | Category titles expanded on first render.                                                   |
| `minRows`          | `number`                   | textarea                                   | Minimum visible rows.                                                                       |
| `maxRows`          | `number`                   | textarea                                   | Maximum visible rows.                                                                       |
| `maxWords`         | `number`                   | textarea                                   | Word limit with optional counter.                                                           |
| `showWordCount`    | `boolean`                  | textarea                                   | Show live word counter.                                                                     |
| `maxLength`        | `number`                   | text, textarea                             | Character limit.                                                                            |
| `defaultCountry`   | `string`                   | phone                                      | ISO 2-letter country code e.g. `'in'`.                                                      |
| `countryFieldName` | `string`                   | state, city                                | RHF name of the country field this depends on.                                              |
| `stateFieldName`   | `string`                   | city                                       | RHF name of the state field this depends on.                                                |
| `excludeCountries` | `string[]`                 | country                                    | ISO codes to hide from the country list.                                                    |
| `headers`          | `{ key, label, width? }[]` | table-radio                                | Column definitions.                                                                         |
| `note`             | `string`                   | table-radio                                | Footnote below the table.                                                                   |
| `accept`           | `string`                   | file                                       | MIME types e.g. `'image/*'` or `'.pdf'`.                                                    |
| `subFields`        | `FieldConfig[]`            | field-array                                | Fields rendered in each repeated row.                                                       |
| `addLabel`         | `string`                   | field-array                                | "Add" button text. Defaults to `'Add Item'`.                                                |
| `removeLabel`      | `string`                   | field-array                                | Remove button tooltip. Defaults to `'Remove'`.                                              |
| `minItems`         | `number`                   | field-array                                | Hides remove button when row count is at or below this.                                     |
| `maxItems`         | `number`                   | field-array                                | Hides add button when this count is reached.                                                |
| `component`        | `ReactNode`                | custom                                     | Custom component to render.                                                                 |
| `row`              | `boolean`                  | radio, multi-checkbox                      | Display options horizontally.                                                               |
| `visibleWhen`      | `VisibleWhen`              | —                                          | Conditionally show/hide. See [Conditional Visibility](#conditional-visibility-visiblewhen). |
| `metadata`         | `ResponsiveGridMetadata`   | —                                          | Responsive column spans. See [Responsive Layout](#responsive-layout-metadata).              |
| `asyncHelperText`  | `AsyncHelperTextConfig`    | —                                          | API-driven field verification. See [Async Helper Text](#async-helper-text).                 |

---

### All Field Types

| `type`               | Component used         | Notes                                                                    |
| -------------------- | ---------------------- | ------------------------------------------------------------------------ |
| `text`               | `RHFTextField`         | Also covers `email`, `number`, `url`, `password`                         |
| `email`              | `RHFTextField`         | Input type = `email`                                                     |
| `number`             | `RHFTextField`         | Input type = `number`                                                    |
| `url`                | `RHFTextField`         | Input type = `url`                                                       |
| `password`           | `RHFTextField`         | Input type = `password`                                                  |
| `textarea`           | `RHFTextArea`          | `minRows`, `maxRows`, `maxWords`, `showWordCount`                        |
| `select`             | `RHFSearchSelect2`     | Searchable dropdown. Requires `options`.                                 |
| `radio`              | `RHFRadioGroup`        | Requires `options`. Use `row: true` for horizontal.                      |
| `checkbox`           | `RHFCheckbox`          | Single boolean toggle.                                                   |
| `multi-checkbox`     | `RHFMultiCheckbox`     | Stores array of selected values. Requires `options`.                     |
| `accordion-checkbox` | `RHFAccordionCheckbox` | Grouped multi-checkbox. Requires `categories`.                           |
| `phone`              | `RHFPhone`             | International phone picker. Use `defaultCountry`.                        |
| `country`            | `RHFCountrySelect`     | Full country list. Use `excludeCountries` to filter.                     |
| `state`              | `RHFStateSelect`       | Depends on `countryFieldName`.                                           |
| `city`               | `RHFCitySelect`        | Depends on `countryFieldName` + `stateFieldName`.                        |
| `file`               | `FileUploadBox`        | Use `accept` to restrict file types.                                     |
| `table-radio`        | `RHFTableRadioInput`   | Radio selection inside a table. Requires `headers` + `options`.          |
| `field-array`        | `FieldArrayGroup`      | Variable-length list of rows. Requires `subFields`.                      |
| `subheading`         | `<h3>`                 | Section title. Use `metadata: { xs:12, ..., lg:12 }` to span full width. |
| `signature`          | `RHFSignaturePad`      | Canvas signature. Shows image when `isEditable` is false.                |
| `custom`             | `field.component`      | Render any React node. Pass it as `component`.                           |

---

### Responsive Layout (`metadata`)

All fields sit inside a **12-column CSS grid**. Control how many columns each field occupies at each breakpoint:

```ts
metadata: { xs: 12, sm: 12, md: 6, lg: 6 }
// xs < 640px  → full width
// sm ≥ 640px  → full width
// md ≥ 768px  → half width
// lg ≥ 1024px → half width (default for most fields)
```

Default when `metadata` is omitted: `{ xs:12, sm:12, md:6, lg:6 }` (half width on desktop).  
`subheading` and `field-array` always use full width regardless of `metadata`.

---

### Conditional Visibility (`visibleWhen`)

A field is only rendered when the watched field's value satisfies the condition.

```ts
// Show when a scalar field equals a value
visibleWhen: { field: "hasGstNumber", value: true }

// Show when a scalar field matches any value in a list
visibleWhen: { field: "scheme", value: ["SHELL", "BARE"] }

// Show when an array field (multi-checkbox) contains a specific value
visibleWhen: { field: "tags", value: "Other" }

// Show when an array field contains any of several values
visibleWhen: { field: "tags", value: ["Other", "Custom"] }
```

The visibility check logic (in `SchemaFormRendererContext`):

| Current field value    | `expected` type | Resolved as                               |
| ---------------------- | --------------- | ----------------------------------------- |
| Array (multi-checkbox) | scalar          | `current.includes(expected)`              |
| Array (multi-checkbox) | array           | `expected.some(e => current.includes(e))` |
| Scalar                 | array           | `expected.includes(current)`              |
| Scalar                 | scalar          | `current === expected`                    |

---

### Watchers

Watchers run side-effects when specific fields change — useful for cascading resets, auto-fill, and computed fields. They have no rendering effect of their own; they only call `methods.setValue`, `methods.clearErrors`, etc.

```ts
watchers: [
  {
    // Reset a dependent field when the controlling field changes
    fields: ["hasGstNumber"],
    onChange: (watched, methods) => {
      if (!methods.formState.dirtyFields.hasGstNumber) return; // skip on initial load
      if (watched.hasGstNumber !== true) methods.setValue("gstNumber", "");
    },
  },
  {
    // Auto-fill billing address from registered address
    fields: ["isBillingAddressSameAsRegistered", "address"],
    onChange: (watched, methods) => {
      if (!methods.formState.dirtyFields.isBillingAddressSameAsRegistered) return;
      if (watched.isBillingAddressSameAsRegistered) {
        methods.setValue("billingAddress", { ...watched.address });
      }
    },
  },
],
```

> **Tip:** Always guard with `if (!methods.formState.dirtyFields.<field>) return;` to prevent watchers from firing on initial render when `defaultValues` is being applied.

---

### Async Helper Text

Use this to validate a field against an API (e.g. email uniqueness, document verification) with debouncing. The result is displayed below the input. Optionally, it can also **block step navigation** until verification succeeds.

```ts
{
  id:   "panNumber",
  name: "panNumber",
  type: "text",
  label: "PAN Number",
  asyncHelperText: {
    debounce: 800,                    // ms to wait after last keystroke
    blockStepNavigation: true,        // prevent Next until verified
    alsoWatchFields: ["companyEmail"], // re-trigger when these other fields change
    fetch: async (value, formValues) => {
      const pan = String(value ?? "").trim().toUpperCase();
      if (pan.length !== 10) return null; // return null to clear the message
      const res = await verifyPan({ pan, email: String(formValues.companyEmail) });
      if (res.valid) return { status: "success", message: `PAN verified — ${res.name}` };
      return { status: "error", message: "Invalid PAN number" };
    },
    onResult: (result, methods) => {
      // Optional: react to the result, e.g. clear errors or set values
      if (result?.status === "success") methods.clearErrors("panNumber");
    },
  },
},
```

Returned status values and their display:

| `status`    | Colour | Icon         |
| ----------- | ------ | ------------ |
| `success`   | green  | ✓            |
| `error`     | red    | ✗            |
| `info`      | blue   | —            |
| `'loading'` | grey   | "Verifying…" |

---

## 5. Context API

Access via `useSchemaFormRenderer()` inside any descendant of `SchemaFormRendererProvider`.

| Property / Method          | Type                                                           | Description                                                                             |
| -------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `methods`                  | `UseFormReturn`                                                | Full RHF API — `setValue`, `trigger`, `formState`, `handleSubmit`, etc.                 |
| `values`                   | `Record<string, unknown>`                                      | Live snapshot of all current values.                                                    |
| `config`                   | `SchemaFormRendererConfig`                                     | The config object passed to the provider.                                               |
| `isEditable`               | `boolean`                                                      | Global read-only toggle.                                                                |
| `stepped`                  | `boolean`                                                      | Whether the form is in multi-step mode.                                                 |
| `steps`                    | `StepState[]`                                                  | All steps with their `completed` status.                                                |
| `currentStep`              | `StepState \| null`                                            | The active step (null in flat/non-stepped mode).                                        |
| `currentStepIndex`         | `number`                                                       | 0-based index of the current step.                                                      |
| `isFirstStep`              | `boolean`                                                      | True when on the first step.                                                            |
| `isLastStep`               | `boolean`                                                      | True when on the last step.                                                             |
| `goToNext()`               | `() => Promise<boolean>`                                       | Validates current step, marks completed, advances. Returns `false` if validation fails. |
| `goToPrev()`               | `() => void`                                                   | Goes back without validation.                                                           |
| `goToStep(id)`             | `(id: number) => Promise<void>`                                | Jump to a step. Validates forward; allows free backward navigation.                     |
| `isFieldVisible(id)`       | `(id: string) => boolean`                                      | Returns whether a field should be shown based on `visibleWhen`.                         |
| `getAsyncHelperText(name)` | `(name: string) => AsyncHelperTextResult \| 'loading' \| null` | Latest async verification result for a field.                                           |

---

## 6. Real-world Examples in this Codebase

| Form                       | Location                                                      | Notes                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Visitor Registration**   | `src/sections/visitors/form-view/`                            | 2-step: Personal Details + Interests. Multi-checkbox with `visibleWhen` on array values. Dynamic options from API.                                                                           |
| **Exhibitor Registration** | `src/sections/space-booking/form-view/ExhibitorRegistration/` | 5-step form. Cascading selects (industry → department → category). Async PAN + mobile verification. Computed booth price watcher. `stepped: false` (all steps visible at once in view mode). |
