import { UseFormReturn, Resolver } from 'react-hook-form';
import { ReactNode } from 'react';

// ─── Input Types ──────────────────────────────────────────────────────────────

export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'url'
  | 'password'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'multi-checkbox'
  | 'accordion-checkbox'
  | 'phone'
  | 'country'
  | 'state'
  | 'city'
  | 'file'
  | 'table-radio'       // options: { headers: TableRadioHeader[], options: TableRadioOption[] }
  | 'field-array'     // variable-length repeating group of sub-fields
  | 'subheading'      // section header for grouping fields
  | 'signature'       // signature canvas input
  | 'custom';         // custom component rendering

// ─── Shared Option Shape ──────────────────────────────────────────────────────

export interface FieldOption {
  label: string;
  value: string | number | boolean;
  [key: string]: any;
}

// ─── Accordion Category ───────────────────────────────────────────────────────

export interface AccordionCategory {
  title: string;
  options: FieldOption[];
}

// ─── Async Helper Text ────────────────────────────────────────────────────────

export interface AsyncHelperTextResult {
  message: string;
  status: 'success' | 'error' | 'info';
}

export interface AsyncHelperTextConfig {
  /** Debounce delay in ms before calling fetch. Defaults to 500. */
  debounce?: number;
  /**
   * Additional field names that should also trigger the fetch when they change
   * (e.g. other fields that are included in the API payload).
   */
  alsoWatchFields?: string[];
  /**
   * When true, `goToNext` will block step navigation until this field's async
   * result is `{ status: 'success' }`. A validation error is set on the field
   * automatically if the result is loading, null, or error.
   */
  blockStepNavigation?: boolean;
  /**
   * Called after every fetch completes (including catch). Use this to react to
   * results — e.g. call `methods.setValue` / `methods.clearErrors`.
   */
  onResult?: (result: AsyncHelperTextResult | null, methods: UseFormReturn) => void;
  /**
   * Async function called with the field's current value and all form values.
   * Return null to clear the helper text (e.g. when the value is empty/invalid length).
   */
  fetch: (
    value: unknown,
    formValues: Record<string, unknown>
  ) => Promise<AsyncHelperTextResult | null>;
}

// ─── Conditional Visibility ───────────────────────────────────────────────────

export interface VisibleWhen {
  /** The RHF field name to watch. */
  field: string;
  /**
   * The field is visible when the watched field's current value matches this.
   * Pass an array to accept multiple possible values (OR logic).
   */
  value: string | number | boolean | (string | number | boolean)[];
  /**
   * Additional clause (AND): all chained `and` conditions must match.
   * Example: `{ field: 'a', value: 1, and: { field: 'b', value: true } }`
   */
  and?: VisibleWhen;
}

// ─── Responsive Grid Metadata ─────────────────────────────────────────────────

/** Responsive column span config for a 12-column grid system. */
export interface ResponsiveGridMetadata {
  /** Extra small (mobile, <640px). Defaults to 12 (full width). */
  xs?: number;
  /** Small (tablet, ≥640px). Defaults to 12. */
  sm?: number;
  /** Medium (≥768px). Defaults to 6 (half width). */
  md?: number;
  /** Large (≥1024px). Defaults to 6. */
  lg?: number;
}

// ─── Field Config ─────────────────────────────────────────────────────────────

export interface FieldConfig {
  /** Unique key used as the React list key. */
  id: string;
  /** RHF field name (supports dot-notation for nested fields). Not needed for 'subheading' type. */
  name: string;
  type: InputType;

  // ── Common ──────────────────────────────────────────────────────────────────
  label?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  placeholder?: string;

  // ── select | radio | multi-checkbox | search-select | search-select2 ────────
  /** Accepts either plain strings or {label, value} pairs (normalised internally). */
  options?: FieldOption[];

  // ── accordion-checkbox ───────────────────────────────────────────────────────
  categories?: AccordionCategory[];
  defaultExpanded?: string[];

  // ── textarea ─────────────────────────────────────────────────────────────────
  minRows?: number;
  maxRows?: number;
  maxWords?: number;
  showWordCount?: boolean;

  // ── text | textarea ──────────────────────────────────────────────────────────
  maxLength?: number;

  // ── phone ────────────────────────────────────────────────────────────────────
  /** Default country code for the phone input, e.g. 'in', 'us'. */
  defaultCountry?: string;

  // ── state | city (chained selects) ───────────────────────────────────────────
  /** RHF field name of the country field that this state/city depends on. */
  countryFieldName?: string;
  /** RHF field name of the state field that this city depends on. */
  stateFieldName?: string;

  // ── country ──────────────────────────────────────────────────────────────────
  excludeCountries?: string[];

  // ── table-radio ───────────────────────────────────────────────────────────────
  /** Column definitions for the table-radio input. Required for `type: 'table-radio'`. */
  headers?: { key: string; label: string; width?: string }[];
  /** Optional footnote rendered below the table, e.g. "All rates are exclusive of 18% GST." */
  note?: string;

  // ── file ─────────────────────────────────────────────────────────────────────
  /** e.g. 'image/*' or '.pdf'. Passed to FileUploadBox `accept`. */
  accept?: string;

  // ── field-array ──────────────────────────────────────────────────────────────
  /** The fields that appear inside each repeated row. Required for `type: 'field-array'`. */
  subFields?: FieldConfig[];
  /** Label on the "Add" button. Defaults to 'Add Item'. */
  addLabel?: string;
  /** Tooltip on the remove button. Defaults to 'Remove'. */
  removeLabel?: string;
  /** Hide the remove button when the row count is at or below this number. Defaults to 0. */
  minItems?: number;
  /** Hide the add button when the row count reaches this number. No limit by default. */
  maxItems?: number;

  // ── custom ───────────────────────────────────────────────────────────────────
  /** Custom React component to render. Required for `type: 'custom'`. */
  component?: ReactNode;

  // ── Async helper text (e.g. API-based field validation) ──────────────────────
  /**
   * When provided, the field value is debounced and passed to `fetch` on every
   * change. The returned message is rendered below the input.
   */
  asyncHelperText?: AsyncHelperTextConfig;

  // ── Conditional visibility ───────────────────────────────────────────────────
  /**
   * When provided, this field is only rendered when the watched field matches
   * the given value. Omitting means "always visible".
   */
  visibleWhen?: VisibleWhen;

  // ── Layout ───────────────────────────────────────────────────────────────────
  /** Responsive grid column spans for a 12-column layout. Defaults: xs=12, sm=12, md=6, lg=6. */
  metadata?: ResponsiveGridMetadata;

  // ── radio ────────────────────────────────────────────────────────────────────
  /** Display radio options in a row (horizontal). Defaults to false (vertical/stacked). */
  row?: boolean;

  /** (Deprecated) Column span inside the 2-col grid. Use `metadata` for responsive sizing. Defaults to 1. */
  gridCols?: 1 | 2;
}

// ─── Watcher ──────────────────────────────────────────────────────────────────

export interface Watcher {
  /**
   * The RHF field names to observe.
   * `onChange` fires only when at least one of these fields changes.
   */
  fields: string[];
  /**
   * Called with the current values of the watched fields and the full
   * `UseFormReturn` methods, so you can call `setValue`, `trigger`, etc.
   */
  onChange: (
    watchedValues: Record<string, unknown>,
    methods: UseFormReturn
  ) => void;
}

// ─── Step Config & State ──────────────────────────────────────────────────────

/** One step as declared in the form config. */
export interface StepConfig {
  id: number;
  label: string;
  fields: FieldConfig[];
}

/** Runtime step state — extends StepConfig with `completed` tracking. */
export interface StepState extends StepConfig {
  completed: boolean;
}

// ─── Top-level Config ─────────────────────────────────────────────────────────

export interface SchemaFormRendererConfig {
  /** For multi-step forms: define steps (each with its own fields array). */
  steps?: StepConfig[];
  /** For flat / single-step forms: define fields directly. */
  fields?: FieldConfig[];
  /**
   * Supply a pre-built resolver: `yupResolver(schema)` or `zodResolver(schema)`.
   * If omitted, no validation is applied.
   */
  resolver?: Resolver;
  defaultValues: Record<string, unknown>;
  watchers?: Watcher[];
  /** Validation trigger strategy. Defaults to 'onChange'. */
  mode?: 'onChange' | 'onBlur' | 'onTouched' | 'onSubmit' | 'all';
  /** When true, renders in multi-step format with stepper. When false, all steps are shown at once. Defaults to true. */
  stepped?: boolean;
  /** When false, all inputs are disabled (read-only mode). Defaults to true. Signature fields show image only when disabled. */
  isEditable?: boolean;
}

// ─── Context Value ────────────────────────────────────────────────────────────

export interface SchemaFormRendererContextValue {
  /** Full react-hook-form methods (handleSubmit, setValue, trigger, …). */
  methods: UseFormReturn;
  /** Live snapshot of every field's current value. */
  values: Record<string, unknown>;
  config: SchemaFormRendererConfig;
  /** Returns true when the field should be rendered (visibleWhen satisfied or absent). */
  isFieldVisible: (id: string) => boolean;
  /** Returns the latest async helper text result for a field, 'loading' while in-flight, or null. */
  getAsyncHelperText: (name: string) => AsyncHelperTextResult | 'loading' | null;
  /** Whether the form is rendered in stepped format. */
  stepped: boolean;
  /** Whether the form inputs are editable. When false, all inputs are disabled (read-only mode). */
  isEditable: boolean;

  // ── Step navigation (only meaningful when config has `steps` and stepped is true) ───────────────
  /** All steps with their runtime state (id, label, completed, fields). */
  steps: StepState[];
  /** The currently active step, or null for flat forms or when stepped is false. */
  currentStep: StepState | null;
  /** 0-based index of the active step. */
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  /**
   * Validates the current step's fields, marks the step completed, and
   * advances to the next step. Returns `true` if validation passed.
   */
  goToNext: () => Promise<boolean>;
  /** Returns to the previous step without any validation. */
  goToPrev: () => void;
  /**
   * Navigate to a specific step by id.
   * Going back is always allowed; going forward validates the current step first.
   */
  goToStep: (id: number) => Promise<void>;
}
