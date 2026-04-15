import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Backdrop } from "@mui/material";

import { SchemaFormRendererProvider } from "src/context/SchemaFormRenderer";
import { useGetExhibitorForm } from "src/api/space";

import { getFormConfig } from "./config";
import ExhibitorFormRenderer from "./ExhibitorFormRenderer";
import { useBusinessOptions, useCategoryOptions } from "../apis/exhibitior-reg";
import { useMembershipPricingOptions } from "src/api/utils";

// The renderer component has been moved to ExhibitorFormRenderer.tsx

// ─── Root component ───────────────────────────────────────────────────────────

export default function ExhibitorForm({ isEditable }: { isEditable: boolean }) {
    const { urnNumber } = useParams<{ urnNumber: string }>();
    const { exhibitorForm, exhibitorFormLoading } = useGetExhibitorForm(urnNumber ?? '');

    const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { options: businessOptions, loading: businessLoading } = useBusinessOptions();
    const { options: categoryOptions, loading: categoryLoading } = useCategoryOptions();
    const { options: indianMembershipTypeOptions, loading: indianMembershipTypeLoading } = useMembershipPricingOptions("INDIAN_PARTICIPANT");
    const { options: overseasMembershipTypeOptions, loading: overseasMembershipTypeLoading } = useMembershipPricingOptions("OVERSEAS_PARTICIPANT");

    // Toggle this to show/hide the payment step
    const showPaymentStep = true;

    // Determine if form is editable based on form loading state
    const isFormEditable = !exhibitorFormLoading && isEditable;

    // Extract form data from API response, transform if needed
    const apiFormData = (exhibitorForm as any)?.formData ?? null;
    const formValues = useMemo(() => {
        if (!apiFormData) return null;

        // Transform the API response to populate selector fields
        const transformed: Record<string, unknown> = { ...apiFormData };

        // ── businessIds: API returns array [1], form expects single value 1 ──
        if (Array.isArray(transformed.businessIds)) {
            transformed.businessIds = transformed.businessIds[0] ?? "";
        }

        // ── categoryIds: API returns array [2], form expects single value 2 ──
        if (Array.isArray(transformed.categoryIds)) {
            transformed.categoryIds = transformed.categoryIds[0] ?? "";
        }

        // ── currency: lives at top-level exhibitorForm.currency, not in formData ──
        const topLevelCurrency = (exhibitorForm as any)?.currency;
        if (topLevelCurrency) {
            // Normalize "EURO" → "EUR" to match form values
            transformed.currency = topLevelCurrency === "EURO" ? "EUR" : topLevelCurrency;
        }

        // ── tds: default to false when not in API response ──
        if (!("tds" in transformed)) {
            transformed.tds = false;
        }

        // ── hasGstNumber: derive from gstNumber presence ──
        if (!("hasGstNumber" in transformed)) {
            const gst = String(transformed.gstNumber ?? "").trim();
            transformed.hasGstNumber = gst.length > 0 ? true : undefined;
        }

        // ── Populate _industryId, _departmentId, _categoryId from interests array ──
        if (apiFormData.interests && Array.isArray(apiFormData.interests) && apiFormData.interests.length > 0) {
            const first = apiFormData.interests[0];
            transformed._industryId = String(first.industryId ?? "");
            transformed._departmentId = String(first.departmentId ?? "");
            transformed._categoryId = String(first.categoryId ?? "");
        } else {
            if (apiFormData.industryId) transformed._industryId = String(apiFormData.industryId);
            if (apiFormData.departmentId) transformed._departmentId = String(apiFormData.departmentId);
            if (apiFormData.categoryId) transformed._categoryId = String(apiFormData.categoryId);
        }

        return transformed;
    }, [apiFormData, exhibitorForm]);

    const config = useMemo(() => getFormConfig({
        businessOptions, 
        businessLoading, 
        categoryOptions, 
        categoryLoading,
        indianMembershipTypeOptions,
        indianMembershipTypeLoading,
        overseasMembershipTypeOptions,
        overseasMembershipTypeLoading,
        formValues,
        isEditable: isFormEditable,
    }), [businessOptions, businessLoading, categoryOptions, categoryLoading, indianMembershipTypeOptions, indianMembershipTypeLoading, overseasMembershipTypeOptions, overseasMembershipTypeLoading, formValues, isFormEditable]);

    if (exhibitorFormLoading) {
        return (
            <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 4 }}>
                <CircularProgress color="primary" />
            </Backdrop>
        );
    }

    return (
        <SchemaFormRendererProvider config={config}>
            <ExhibitorFormRenderer
                apiMessage={apiMessage}
                setApiMessage={setApiMessage}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                showPaymentStep={showPaymentStep}
                urnNumber={urnNumber ?? ""}
                isEditable={isEditable}
            />
        </SchemaFormRendererProvider>
    );
}
