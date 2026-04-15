import { createContext, useContext, type ReactNode } from "react";
import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";

// ─── Context & Types ──────────────────────────────────────────────────────

interface TableRadioContextType {
    selectedValue: string | number | undefined;
    onSelect: (value: string | number) => void;
}

const TableRadioContext = createContext<TableRadioContextType | undefined>(undefined);

const useTableRadio = () => {
    const context = useContext(TableRadioContext);
    if (!context) {
        throw new Error("TableRadio components must be used within a TableRadioInput");
    }
    return context;
};

export interface TableRadioHeader {
    key: string;
    label: string;
    width?: string; // e.g., "20%", "200px", "1fr"
}

export interface TableRadioOption {
    id: string | number;
    value: string | number;
    [key: string]: unknown; // Dynamic data matching header keys
}

interface RHFTableRadioInputProps<T extends FieldValues> {
    name: Path<T>;
    headers: TableRadioHeader[];
    options: TableRadioOption[];
    label?: string;
    required?: boolean;
    note?: string;
    className?: string;
    containerClassName?: string;
    headerClassName?: string;
    headerCellClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
    selectedRowClassName?: string;
    disabled?: boolean;
}

// ─── Compound Component: Main Container ────────────────────────────────────

export function RHFTableRadioInput<T extends FieldValues>({
    name,
    headers,
    options,
    label,
    required,
    note,
    className = "",
    containerClassName = "",
    headerClassName = "",
    headerCellClassName = "",
    rowClassName = "",
    cellClassName = "",
    selectedRowClassName = "",
    disabled = false,
}: RHFTableRadioInputProps<T>) {
    const { control } = useFormContext<T>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <TableRadioInputContent
                    value={value}
                    onChange={onChange}
                    headers={headers}
                    options={options}
                    label={label}
                    required={required}
                    note={note}
                    className={className}
                    containerClassName={containerClassName}
                    headerClassName={headerClassName}
                    headerCellClassName={headerCellClassName}
                    rowClassName={rowClassName}
                    cellClassName={cellClassName}
                    selectedRowClassName={selectedRowClassName}
                    disabled={disabled}
                />
            )}
        />
    );
}

// ─── Internal Content Component ────────────────────────────────────────────

interface TableRadioInputContentProps {
    value: string | number | undefined;
    onChange: (value: string | number) => void;
    headers: TableRadioHeader[];
    options: TableRadioOption[];
    label?: string;
    required?: boolean;
    note?: string;
    className?: string;
    containerClassName?: string;
    headerClassName?: string;
    headerCellClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
    selectedRowClassName?: string;
    disabled?: boolean;
}

function TableRadioInputContent({
    value,
    onChange,
    headers,
    options,
    label,
    required,
    note,
    className,
    containerClassName,
    headerClassName,
    headerCellClassName,
    rowClassName,
    cellClassName,
    selectedRowClassName,
    disabled,
}: TableRadioInputContentProps) {
    return (
        <TableRadioContext.Provider value={{ selectedValue: value, onSelect: onChange }}>
            <div className={`w-full my-6 ${className}`}>
                {label && (
                    <>
                        <label className="block text-gray-700 font-medium mb-4">
                            {label}
                            {required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="p-1">
                            <hr className="w-full border-t-[1px] border-[#B1B1B1] mb-4" />
                        </div>
                    </>
                )}

                <div className={`overflow-x-auto ${containerClassName}`}>
                    <table className="lg:w-full border-collapse">
                        <TableRadioHeader
                            headers={headers}
                            headerClassName={headerClassName}
                            headerCellClassName={headerCellClassName}
                        />
                        <TableRadioBody
                            options={options}
                            headers={headers}
                            rowClassName={rowClassName}
                            cellClassName={cellClassName}
                            selectedRowClassName={selectedRowClassName}
                            disabled={disabled}
                        />
                    </table>
                </div>

                {note && (
                    <p className="text-sm text-gray-500 mt-4">
                        Note: {note}
                    </p>
                )}
            </div>
        </TableRadioContext.Provider>
    );
}

// ─── Sub-Component: Table Header ──────────────────────────────────────────

interface TableRadioHeaderProps {
    headers: TableRadioHeader[];
    headerClassName?: string;
    headerCellClassName?: string;
}

function TableRadioHeader({
    headers,
    headerClassName = "",
    headerCellClassName = "",
}: TableRadioHeaderProps) {
    return (
        <thead className={`${headerClassName}`}>
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.key}
                        className={`text-left py-2 px-4 text-gray-500 font-normal ${headerCellClassName} `}
                        style={{ width: header.width || "auto" }}
                    >
                        {header.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

// ─── Sub-Component: Table Body ────────────────────────────────────────────

interface TableRadioBodyProps {
    options: TableRadioOption[];
    headers: TableRadioHeader[];
    rowClassName?: string;
    cellClassName?: string;
    selectedRowClassName?: string;
    disabled?: boolean;
}

function TableRadioBody({
    options,
    headers,
    rowClassName = "border-b-[1px] border-gray-300",
    cellClassName = "py-4 px-4",
    selectedRowClassName = "",
    disabled = false,
}: TableRadioBodyProps) {
    const { selectedValue, onSelect } = useTableRadio();

    return (
        <tbody>
            {options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                    <tr
                        key={option.id}
                        className={`border-b-1 border-gray-300 ${rowClassName} ${isSelected ? selectedRowClassName : ""}`}
                    >
                        {headers.map((header, colIndex) => (
                            <td
                                key={`${option.id}-${header.key}`}
                                className={`py-4 px-4 ${cellClassName}`}
                                style={{ width: header.width || "auto" }}
                            >
                                {colIndex === 0 ? (
                                    // First column: radio button embedded in a label with the cell content
                                    <label className={`flex items-center ${disabled ? "cursor-not-allowed opacity-90 pointer-events-none" : "cursor-pointer pointer-events-auto"}`}>
                                        <input
                                            type="radio"
                                            value={option.value}
                                            checked={isSelected}
                                            onChange={() => onSelect(option.value)}
                                            className="mr-2 h-5 w-5 accent-[#ffa206]"
                                        />
                                        {renderCellContent(option[header.key])}
                                    </label>
                                ) : (
                                    renderCellContent(option[header.key])
                                )}
                            </td>
                        ))}
                    </tr>
                );
            })}
        </tbody>
    );
}

// ─── Utility: Render Cell Content ─────────────────────────────────────────

function renderCellContent(content: unknown): ReactNode {
    if (content === null || content === undefined) {
        return "—";
    }

    if (typeof content === "string" || typeof content === "number") {
        return content;
    }

    if (Array.isArray(content)) {
        return content.join(", ");
    }

    if (typeof content === "object") {
        return JSON.stringify(content);
    }

    return String(content);
}
