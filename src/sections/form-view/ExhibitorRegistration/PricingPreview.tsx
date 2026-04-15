import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { calculatePricing, type CalculatePricingData } from "../apis/exhibitior-reg";
import { Currency, CURRENCY_SYMBOL, normalizeCurrency } from "src/constants";

// ─── helpers ──────────────────────────────────────────────────────────────────

const SCHEME_LABELS: Record<string, string> = {
    SHELL: "Shell Scheme",
    BARE: "Bare Space",
};

const FLOOR_LABELS: Record<string, string> = {
    GROUND_FLOOR: "Ground Floor",
    FIRST_FLOOR: "First Floor",
};

const SIDES_LABELS: Record<number, string> = {
    1: "One side",
    2: "Two sides",
    3: "Three sides",
    4: "Four sides",
};

function formatAmount(n: number, currency: string): string {
    const iso = normalizeCurrency(currency);
    const symbol = CURRENCY_SYMBOL[iso as Currency] ?? iso;
    return `${symbol}${Number(n).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

// ─── component ────────────────────────────────────────────────────────────────

export function PricingPreview() {
    const { watch } = useFormContext();

    // Watch all pricing-relevant fields
    const scheme              = watch("scheme") as string | undefined;
    const area                = watch("area") as string | number | undefined;
    const eventType           = watch("eventType") as string | undefined;
    const participationType   = watch("participationType") as string | undefined;
    const preferredFloor      = watch("preferredFloor") as string | undefined;
    const preferredStallSides = watch("preferredStallSides") as number | undefined;
    const tdsApplicable       = watch("tdsApplicable") as boolean | undefined;
    const tdsPercentage       = watch("tdsPercentage") as number | undefined;
    const hasPreferredLocation = watch("hasPreferredLocation") as boolean | undefined;
    const iifMember           = watch("iifMember") as boolean | undefined;
    const billingState        = watch("billingAddress.state") as string | undefined;

    const [pricing, setPricing] = useState<CalculatePricingData | null>(null);
    const [loading, setLoading]  = useState(false);
    const [error, setError]      = useState<string | null>(null);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const areaNum = Number(area);

        // Need at minimum these four to call the API
        if (!scheme || !areaNum || areaNum < 9 || !eventType || !participationType) {
            setPricing(null);
            setError(null);
            return;
        }

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await calculatePricing({
                    preferredStallSides : Number(preferredStallSides) || 1,
                    participationType,
                    preferredFloor      : preferredFloor || "GROUND_FLOOR",
                    scheme,
                    area                : areaNum,
                    tds                 : tdsApplicable === true,
                    tdsPercentage       : tdsApplicable === true ? (Number(tdsPercentage) || 0) : 0,
                    billingState        : billingState || undefined,
                    eventType,
                    hasPreferredLocation: hasPreferredLocation === true,
                    iifMember           : iifMember === true,
                });
                if (res.status) {
                    setPricing(res.data);
                } else {
                    setError("Unable to calculate pricing.");
                }
            } catch {
                setError("Unable to calculate pricing. Please check your inputs.");
            } finally {
                setLoading(false);
            }
        }, 700);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [
        scheme,
        area,
        eventType,
        participationType,
        preferredFloor,
        preferredStallSides,
        tdsApplicable,
        tdsPercentage,
        hasPreferredLocation,
        iifMember,
        billingState,
    ]);

    const areaNum = Number(area);

    // Don't render at all if required inputs are absent
    if (!scheme || !areaNum || areaNum < 9 || !eventType || !participationType) return null;

    const currency = pricing?.currency ?? "INR";

    // Build line items for the breakdown table
    type LineItem = { label: string; value: string; bold?: boolean; negative?: boolean };
    const lines: LineItem[] = [];

    if (pricing) {
        lines.push({ label: "Booth Cost", value: formatAmount(pricing.calculatedAmount, currency) });

        if (pricing.calculatedAmountPlc > 0) {
            lines.push({
                label: "Premium Location Charges",
                value: formatAmount(pricing.calculatedAmountPlc, currency),
            });
        }
        if(pricing.calculatedAmountIifMember > 0) {
            lines.push({
                label: "IIF Membership Fee",
                value: `${formatAmount(pricing.calculatedAmountIifMember, currency)}`,
            });
        }
        if (pricing.tdsAmount > 0) {
            lines.push({
                label   : "TDS Deduction",
                value   : `− ${formatAmount(pricing.tdsAmount, currency)}`,
                negative: true,
            });
        }
        if (pricing.gstAmount > 0 ) {
            lines.push({ label: "GST", value: formatAmount(
                (pricing.gstAmount || 0) + (pricing.gstAmountPlc || 0) + (pricing.gstAmountIifMember || 0)
                , currency) });
        }
        lines.push({ label: "Total Payable", value: formatAmount(pricing.totalAmount, currency), bold: true });
    }

    return (
        <div className="col-span-full w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">
                    Pricing Preview
                </h3>
                {loading && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <CircularProgress size={12} thickness={5} />
                        Calculating…
                    </span>
                )}
            </div>

            {/* Booth summary pills */}
            {/* <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 border-b border-gray-100">
                {[
                    { label: "Booth Type",  value: SCHEME_LABELS[scheme] ?? scheme },
                    { label: "Area",        value: `${areaNum} sqm` },
                    { label: "Floor",       value: FLOOR_LABELS[preferredFloor ?? ""] ?? (preferredFloor ?? "—") },
                    { label: "Open Sides",  value: SIDES_LABELS[Number(preferredStallSides)] ?? "One side" },
                ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-white border border-gray-200 px-3 py-2.5">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                            {label}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                ))}
            </div> */}

            {/* Error */}
            {error && !loading && (
                <p className="px-5 py-4 text-sm text-red-600">{error}</p>
            )}

            {/* Loading skeleton when no prior data */}
            {loading && !pricing && (
                <div className="px-5 py-6 flex justify-center">
                    <CircularProgress size={28} thickness={4} />
                </div>
            )}

            {/* Breakdown table */}
            {pricing && (
                <table className="w-full text-sm">
                    <tbody>
                        {lines.map(({ label, value, bold, negative }) => (
                            <tr
                                key={label}
                                className={
                                    bold
                                        ? "border-t-2 border-gray-200 bg-gray-50"
                                        : "border-b border-gray-100 last:border-0"
                                }
                            >
                                <td
                                    className={`px-5 py-3 ${bold ? "font-semibold text-gray-800" : "text-gray-500"}`}
                                >
                                    {label}
                                </td>
                                <td
                                    className={`px-5 py-3 text-right tabular-nums ${
                                        bold
                                            ? "font-bold text-indigo-700 text-base"
                                            : negative
                                            ? "text-red-500"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Footer note */}
            {pricing && (
                <p className="px-5 py-3 text-[11px] text-gray-400 border-t border-gray-100">
                    * Prices are indicative. Final invoice may vary based on confirmation.
                </p>
            )}
        </div>
    );
}
