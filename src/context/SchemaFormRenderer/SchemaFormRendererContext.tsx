import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';

import type {
    SchemaFormRendererConfig,
    SchemaFormRendererContextValue,
    FieldConfig,
    StepState,
    AsyncHelperTextResult,
    VisibleWhen,
} from './types';

// ─── Context ──────────────────────────────────────────────────────────────────

const SchemaFormRendererContext =
    createContext<SchemaFormRendererContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSchemaFormRenderer(): SchemaFormRendererContextValue {
    const ctx = useContext(SchemaFormRendererContext);
    if (!ctx) {
        throw new Error(
            'useSchemaFormRenderer must be used inside <SchemaFormRendererProvider>.'
        );
    }
    return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pick(
    obj: Record<string, unknown>,
    keys: string[]
): Record<string, unknown> {
    return keys.reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
}

function buildFieldMap(fields: FieldConfig[]): Map<string, FieldConfig> {
    return new Map(fields.map((f) => [f.id, f]));
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface Props {
    config: SchemaFormRendererConfig;
    children: ReactNode;
}

export function SchemaFormRendererProvider({ config, children }: Props) {
    const {
        steps: stepConfigs,
        fields: flatFields,
        resolver,
        defaultValues,
        watchers,
        mode = 'onChange',
    } = config;

    const methods = useForm({ resolver, defaultValues, mode });
    const values = methods.watch() as Record<string, unknown>;

    // ── Step state ─────────────────────────────────────────────────────────────
    const [stepStates, setStepStates] = useState<StepState[]>(() =>
        (stepConfigs ?? []).map((s) => ({ ...s, completed: false }))
    );
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Sync step fields when config.steps changes (e.g. dynamic options rebuild)
    useEffect(() => {
        if (!stepConfigs?.length) return;
        setStepStates((prev: StepState[]) =>
            stepConfigs.map((stepCfg, idx) => ({
                ...stepCfg,
                completed: prev[idx]?.completed ?? false,
            }))
        );
    }, [stepConfigs]);

    const currentStep = stepStates[currentStepIndex] ?? null;

    // ── All fields (for fieldMap / visibleWhen) ────────────────────────────────
    const allFields: FieldConfig[] = stepConfigs?.length
        ? stepStates.flatMap((s: StepState) => s.fields)
        : (flatFields ?? []);

    const fieldMap = buildFieldMap(allFields);

    // ── Watchers ───────────────────────────────────────────────────────────────
    const prevValuesRef = useRef<Record<string, unknown>>({});
    const isFirstWatcherRunRef = useRef(true);

    useEffect(() => {
        if (!watchers?.length) return;
        // Skip on first render to prevent watchers from wiping prefilled/default values
        if (isFirstWatcherRunRef.current) {
            isFirstWatcherRunRef.current = false;
            prevValuesRef.current = values;
            return;
        }
        const prev = prevValuesRef.current;
        watchers.forEach((watcher) => {
            const hasChanged = watcher.fields.some((f) => prev[f] !== values[f]);
            if (hasChanged) {
                watcher.onChange(pick(values, watcher.fields), methods);
            }
        });
        prevValuesRef.current = values;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    // ── Visibility helper ──────────────────────────────────────────────────────
    const matchesVisibleWhen = (vw: VisibleWhen): boolean => {
        const { field: watchedName, value: expected, and: andClause } = vw;
        const current = values[watchedName];
        let matches: boolean;
        // current is an array (e.g. multi-checkbox) — check if expected value is present in it
        if (Array.isArray(current)) {
            matches = Array.isArray(expected)
                ? expected.some((e) => current.includes(e as string | number | boolean))
                : current.includes(expected as string | number | boolean);
        } else if (Array.isArray(expected)) {
            matches = expected.includes(current as string | number | boolean);
        } else {
            matches = current === expected;
        }
        if (!matches) return false;
        return andClause ? matchesVisibleWhen(andClause) : true;
    };

    const isFieldVisible = (id: string): boolean => {
        const field = fieldMap.get(id);
        if (!field?.visibleWhen) return true;
        return matchesVisibleWhen(field.visibleWhen);
    };

    // ── Async helper text ──────────────────────────────────────────────────────
    const [asyncHelperTexts, setAsyncHelperTexts] = useState<
        Record<string, AsyncHelperTextResult | 'loading' | null>
    >({});
    const asyncDebounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    // Separate prev-values ref so it isn't clobbered by the watchers effect
    const asyncPrevValuesRef = useRef<Record<string, unknown>>({});
    // Always-current snapshot of values to avoid stale closures inside setTimeout
    const latestValuesRef = useRef<Record<string, unknown>>(values);
    latestValuesRef.current = values;

    useEffect(() => {
        const prev = asyncPrevValuesRef.current;
        allFields.forEach((field) => {
            if (!field.asyncHelperText) return;
            const { debounce: delay = 500, fetch: fetchFn, alsoWatchFields = [] } = field.asyncHelperText;
            const fieldName = field.name;

            // Fire if the field itself changed OR any of the alsoWatchFields changed
            const watchedFields = [fieldName, ...alsoWatchFields];
            const hasChanged = watchedFields.some((f) => prev[f] !== values[f]);
            if (!hasChanged) return;

            // Clear any pending debounce for this field
            clearTimeout(asyncDebounceRefs.current[fieldName]);

            const currentValue = values[fieldName];

            // If value is empty, clear immediately without an API call
            if (!currentValue) {
                setAsyncHelperTexts((prev) => ({ ...prev, [fieldName]: null }));
                watchedFields.forEach((f) => {
                    asyncPrevValuesRef.current = { ...asyncPrevValuesRef.current, [f]: values[f] };
                });
                return;
            }

            // Show loading while debouncing
            setAsyncHelperTexts((prev) => ({ ...prev, [fieldName]: 'loading' }));
            watchedFields.forEach((f) => {
                asyncPrevValuesRef.current = { ...asyncPrevValuesRef.current, [f]: values[f] };
            });

            asyncDebounceRefs.current[fieldName] = setTimeout(async () => {
                const latestValue = latestValuesRef.current[fieldName];
                const latestValues = latestValuesRef.current;
                try {
                    const result = await fetchFn(latestValue, latestValues);
                    setAsyncHelperTexts((prev) => ({ ...prev, [fieldName]: result }));
                    field.asyncHelperText?.onResult?.(result, methods);
                } catch {
                    const errResult: AsyncHelperTextResult = { status: 'error', message: 'Verification failed. Please try again.' };
                    setAsyncHelperTexts((prev) => ({
                        ...prev,
                        [fieldName]: errResult,
                    }));
                    field.asyncHelperText?.onResult?.(errResult, methods);
                }
            }, delay);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const getAsyncHelperText = (name: string): AsyncHelperTextResult | 'loading' | null =>
        asyncHelperTexts[name] ?? null;

    // Returns true if all blockStepNavigation fields in a step are successfully verified
    const checkAsyncBlocks = (stepFields: FieldConfig[]): boolean => {
        let allClear = true;
        stepFields.forEach((field) => {
            if (!field.asyncHelperText?.blockStepNavigation) return;
            const result = asyncHelperTexts[field.name] ?? null;
            if (result === null) {
                methods.setError(field.name as never, { type: 'manual', message: 'Please complete verification before proceeding.' });
                allClear = false;
            } else if (result === 'loading') {
                methods.setError(field.name as never, { type: 'manual', message: 'Please wait for verification to complete.' });
                allClear = false;
            } else if (result.status !== 'success') {
                methods.setError(field.name as never, { type: 'manual', message: result.message || 'Verification failed. Please correct the value and try again.' });
                allClear = false;
            }
        });
        return allClear;
    };

    // ── Step navigation ────────────────────────────────────────────────────────
    const goToNext = async (): Promise<boolean> => {
        if (!currentStep) return false;
        const fieldNames = currentStep.fields.map((f: FieldConfig) => f.name);
        const isValid = await methods.trigger(fieldNames as never);
        if (!isValid) return false;
        if (!checkAsyncBlocks(currentStep.fields)) return false;
        setStepStates((prev: StepState[]) =>
            prev.map((s: StepState) =>
                s.id === currentStep.id ? { ...s, completed: true } : s
            )
        );
        setCurrentStepIndex((idx: number) => Math.min(idx + 1, stepStates.length - 1));
        return true;
    };

    const goToPrev = (): void => {
        setCurrentStepIndex((idx: number) => Math.max(idx - 1, 0));
    };

    const goToStep = async (id: number): Promise<void> => {
        const targetIdx = stepStates.findIndex((s: StepState) => s.id === id);
        if (targetIdx === -1 || targetIdx === currentStepIndex) return;

        // Going back — always allow
        if (targetIdx < currentStepIndex) {
            setCurrentStepIndex(targetIdx);
            return;
        }

        // Going forward — validate current step first
        if (!currentStep) return;
        const fieldNames = currentStep.fields.map((f: FieldConfig) => f.name);
        const isValid = await methods.trigger(fieldNames as never);
        if (isValid && checkAsyncBlocks(currentStep.fields)) {
            setStepStates((prev: StepState[]) =>
                prev.map((s: StepState) =>
                    s.id === currentStep.id ? { ...s, completed: true } : s
                )
            );
            setCurrentStepIndex(targetIdx);
        }
    };

    // ── Stepped toggle ─────────────────────────────────────────────────────────
    const stepped = config.stepped !== false;
    const isEditable = config.isEditable !== false;

    // ── Context value ──────────────────────────────────────────────────────────
    const ctxValue: SchemaFormRendererContextValue = {
        methods,
        values,
        config,
        isFieldVisible,
        getAsyncHelperText,
        stepped,
        isEditable,
        steps: stepStates,
        currentStep: stepped ? currentStep : null,
        currentStepIndex,
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === stepStates.length - 1,
        goToNext,
        goToPrev,
        goToStep,
    };

    return (
        <SchemaFormRendererContext.Provider value={ctxValue}>
            <RHFFormProvider {...methods}>{children}</RHFFormProvider>
        </SchemaFormRendererContext.Provider>
    );
}
