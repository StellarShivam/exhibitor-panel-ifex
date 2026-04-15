import { useEffect, useState } from 'react';
import { useSchemaFormRenderer } from './SchemaFormRendererContext';
import { SchemaFormRendererField } from './SchemaFormRendererField';
import type { FieldConfig, ResponsiveGridMetadata } from './types';

// ─── Responsive span hook ─────────────────────────────────────────────────────

function useResponsiveSpan(metadata: ResponsiveGridMetadata): number {
    const getSpan = () => {
        const width = window.innerWidth;
        if (width >= 1024 && metadata.lg !== undefined) return metadata.lg;
        if (width >= 768 && metadata.md !== undefined) return metadata.md;
        if (width >= 640 && metadata.sm !== undefined) return metadata.sm;
        return metadata.xs ?? 12;
    };

    const [span, setSpan] = useState(getSpan);

    useEffect(() => {
        const handler = () => setSpan(getSpan());
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metadata.xs, metadata.sm, metadata.md, metadata.lg]);

    return span;
}

// ─── FieldGridCell ────────────────────────────────────────────────────────────

function FieldGridCell({ field }: { field: FieldConfig }) {
    const isFullWidth = field.type === 'field-array' || field.type === 'subheading';
    const metadata: ResponsiveGridMetadata = isFullWidth
        ? { xs: 12, sm: 12, md: 12, lg: 12 }
        : (field.metadata ?? { xs: 12, sm: 12, md: 6, lg: 6 });

    const span = useResponsiveSpan(metadata);

    return (
        <div style={{ gridColumn: `span ${span} / span ${span}` }}>
            <SchemaFormRendererField field={field} />
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SchemaFormRenderer() {
    const { config, currentStep, isFieldVisible, stepped, steps } = useSchemaFormRenderer();

    // When stepped is false and steps exist, show all steps' fields at once
    if (!stepped && steps.length > 0) {
        return (
            <div className="flex flex-col gap-8">
                {steps.map((step) => (
                    <div key={step.id}>
                        <div className="grid grid-cols-12 gap-4">
                            {step.fields.map((field) => {
                                if (!isFieldVisible(field.id)) return null;
                                return <FieldGridCell key={field.id} field={field} />;
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const fields = currentStep ? currentStep.fields : (config.fields ?? []);

    return (
        <div className="grid grid-cols-12 gap-4">
            {fields.map((field) => {
                if (!isFieldVisible(field.id)) return null;
                return <FieldGridCell key={field.id} field={field} />;
            })}
        </div>
    );
}
