import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { SchemaFormRendererField } from './SchemaFormRendererField';
import type { FieldConfig, ResponsiveGridMetadata } from './types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface FieldArrayGroupProps {
    field: FieldConfig;
}

// ─── Responsive Span Hook ─────────────────────────────────────────────────────

function useResponsiveSpan(metadata: ResponsiveGridMetadata): number {
    const [span, setSpan] = useState(() => {
        if (typeof window === 'undefined') return metadata.lg ?? 6;
        const width = window.innerWidth;
        if (width < 640) return metadata.xs ?? 12;
        if (width < 768) return metadata.sm ?? 12;
        if (width < 1024) return metadata.md ?? 6;
        return metadata.lg ?? 6;
    });

    useEffect(() => {
        const getSpan = () => {
            const width = window.innerWidth;
            if (width < 640) return metadata.xs ?? 12;
            if (width < 768) return metadata.sm ?? 12;
            if (width < 1024) return metadata.md ?? 6;
            return metadata.lg ?? 6;
        };

        const handler = () => setSpan(getSpan());
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [metadata.xs, metadata.sm, metadata.md, metadata.lg]);

    return span;
}

// ─── Field Item Component (encapsulates hook) ────────────────────────────────

interface FieldArrayItemProps {
    subField: FieldConfig;
    arrayName: string;
    arrayIdx: number;
    itemId: string;
}

function FieldArrayItem({ subField, arrayName, arrayIdx, itemId }: FieldArrayItemProps) {
    const fieldMetadata = subField.metadata || { xs: 12, sm: 12, md: 12, lg: 12 };
    const colSpan = useResponsiveSpan(fieldMetadata);

    const prefixedField: FieldConfig = {
        ...subField,
        id: `${itemId}-${subField.id}`,
        name: `${arrayName}.${arrayIdx}.${subField.name}`,
    };

    return (
        <div
            key={prefixedField.id}
            style={{
                gridColumn: `span ${colSpan} / span ${colSpan}`,
            }}
        >
            <SchemaFormRendererField field={prefixedField} />
        </div>
    );
}

/**
 * Renders a variable-length list of field groups driven entirely by config.
 * Backed by react-hook-form's `useFieldArray`; no manual wiring required.
 *
 * @example
 * {
 *   id: 'workers',
 *   name: 'workers',
 *   type: 'field-array',
 *   label: 'Workers',
 *   addLabel: 'Add Worker',
 *   minItems: 0,
 *   maxItems: 10,
 *   subFields: [
 *     { id: 'workerName',   name: 'name',   type: 'text',  label: 'Full Name', required: true },
 *     { id: 'workerMobile', name: 'mobile', type: 'phone', label: 'Mobile',    required: true },
 *   ],
 * }
 */
export function FieldArrayGroup({ field }: FieldArrayGroupProps) {
    const { control } = useFormContext();

    const {
        name,
        label,
        subFields = [],
        addLabel = 'Add Item',
        removeLabel = 'Remove',
        minItems = 0,
        maxItems,
    } = field;

    const { fields, append, remove } = useFieldArray({ control, name });

    // Simple id generator for array items
    const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Build an empty row from subField names, include an `id` string required by schema
    const emptyRow = subFields.reduce<Record<string, unknown>>(
        (acc, sf) => ({ ...acc, [sf.name]: '' }),
        { id: genId() }
    );

    const canAdd = maxItems === undefined || fields.length < maxItems;
    const canRemove = (idx: number) => fields.length > minItems || idx > 0;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '1rem' }}>
            {/* ── Header ── */}
            <div style={{ gridColumn: 'span 12', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                {label && (
                    <p className="font-semibold text-gray-700">{label}</p>
                )}

                {canAdd && (
                    <button
                        type="button"
                        className="flex items-center gap-1 text-[#ffa206] hover:underline text-sm font-medium ml-auto"
                        onClick={() => append(emptyRow)}
                    >
                        <AddIcon fontSize="small" />
                        {addLabel}
                    </button>
                )}
            </div>

            {/* ── Rows ── */}
            {fields.map((item, idx) => (
                <div
                    key={item.id}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                        gap: '1rem',
                        gridColumn: 'span 6',
                        position: 'relative',
                    }}
                >
                    {/* Remove button */}
                    {canRemove(idx) && (
                        <button
                            type="button"
                            title={removeLabel}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                zIndex: 10,
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => remove(idx)}
                        >
                            <RemoveCircleOutlineIcon fontSize="small" />
                        </button>
                    )}

                    {/* Sub-fields — name is prefixed with `arrayName.idx.` */}
                    {subFields.map((subField) => (
                        <FieldArrayItem
                            key={`${name}-${idx}-${subField.id}`}
                            subField={subField}
                            arrayName={name}
                            arrayIdx={idx}
                            itemId={item.id}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
