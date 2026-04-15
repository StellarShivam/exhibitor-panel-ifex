import { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";

// import { registerExhibitor, type ExhibitorRegistrationRequest } from "../../apis/exhibitior-reg";
import { updateRegistrationDetails } from "src/api/space";

import {
    SchemaFormRenderer,
    SchemaFormStepper,
    useSchemaFormRenderer,
} from "src/context/SchemaFormRenderer";

interface ExhibitorFormRendererProps {
    apiMessage: { type: string; text: string };
    setApiMessage: (msg: { type: string; text: string }) => void;
    isSubmitting: boolean;
    setIsSubmitting: (v: boolean) => void;
}

// Add prop to toggle payment step
export interface ExhibitorFormRendererExtraProps {
    showPaymentStep?: boolean;
    onFieldChange?: (name: string, value: string) => void;
    urnNumber?: string;
    isEditable?: boolean;
}

export default function ExhibitorFormRenderer({
    apiMessage,
    setApiMessage,
    isSubmitting,
    setIsSubmitting,
    showPaymentStep = false,
    onFieldChange,
    urnNumber = "",
    isEditable = true,
}: ExhibitorFormRendererProps & ExhibitorFormRendererExtraProps) {
    const topRef = useRef<HTMLDivElement>(null);

    const { methods, goToNext, goToPrev, isFirstStep, isLastStep, stepped } =
        useSchemaFormRenderer();

    const [utmSource, setUtmSource] = useState("");
    const [utmMedium, setUtmMedium] = useState("");
    const [utmCampaign, setUtmCampaign] = useState("");
    const [utmTerm, setUtmTerm] = useState("");
    const [utmContent, setUtmContent] = useState("");
    const [utmId, setUtmId] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const utmParams = [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_term",
            "utm_content",
            "utm_id",
        ];
        for (const param of utmParams) {
            let value = queryParams.get(param);
            if (!value) {
                value = localStorage.getItem(param) || "";
            } else {
                localStorage.setItem(param, value);
            }
            switch (param) {
                case "utm_source":
                    setUtmSource(value);
                    break;
                case "utm_medium":
                    setUtmMedium(value);
                    break;
                case "utm_campaign":
                    setUtmCampaign(value);
                    break;
                case "utm_term":
                    setUtmTerm(value);
                    break;
                case "utm_content":
                    setUtmContent(value);
                    break;
                case "utm_id":
                    setUtmId(value);
                    break;
            }
        }
    }, []);

    // Watch industry/department selectors and notify parent to refresh dependent options
    const industryId = methods.watch("_industryId");
    const departmentId = methods.watch("_departmentId");
    useEffect(() => {
        if (onFieldChange && industryId) onFieldChange("_industryId", industryId as string);
    }, [industryId]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (onFieldChange && departmentId) onFieldChange("_departmentId", departmentId as string);
    }, [departmentId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const isValid = await goToNext();
        if (!isValid) {
            setApiMessage({
                type: "error",
                text: "Make sure all required fields are filled out correctly.",
            });
            // Scroll to the first field that has an error
            setTimeout(() => {
                const firstError = Object.keys(methods.formState.errors)[0];
                if (firstError) {
                    document
                        .querySelector(`[name="${firstError}"]`)
                        ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
        } else {
            setApiMessage({ type: "", text: "" });
            topRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        goToPrev();
        setApiMessage({ type: "", text: "" });
        topRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const onSubmit = methods.handleSubmit(async (data) => {
        setApiMessage({ type: "", text: "" });
        setIsSubmitting(true);
        try {
            // Strip UI-only fields; spread the rest directly onto the payload
            const {
                isBillingAddressSameAsRegistered: _same,
                _industryId: _ind,
                _departmentId: _dep,
                _categoryId: _cat,
                ...rest
            } = data;

            const payload = {
                eventId: "211",
                ...rest,
                urn: urnNumber,
                utmSource,
                utmMedium,
                utmCampaign,
                utmTerm,
                utmContent,
                utmId,
            };

            console.log(payload)

            const response = await updateRegistrationDetails(payload, urnNumber);

            if (response.status) {
                const urn = response.data?.urn;
                setApiMessage({
                    type: "success",
                    text: response.message || "Form updated successfully!",
                });
            } else {
                setApiMessage({
                    type: "error",
                    text: response.message || "Form update failed. Please try again.",
                });
            }
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Failed to submit. Please try again.";
            setApiMessage({ type: "error", text: msg });
        } finally {
            setIsSubmitting(false);
        }
    });

    return (
        <>
            <div ref={topRef} className="absolute top-0 left-0" />

            <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] h-full rounded-2xl w-full mx-auto">
                {/* ── Sidebar ── */}
                <SchemaFormStepper showPaymentStep={showPaymentStep} />

                {/* ── Form area ── */}
                <div className="h-full w-full">
                    <form onSubmit={onSubmit}>
                        {/* Config-driven fields for the current step */}
                        <SchemaFormRenderer />

                        {/* Error / success message */}
                        {apiMessage.text && (
                            <div
                                className={`my-4 p-3 rounded-md text-center text-sm ${apiMessage.type === "error"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {apiMessage.text}
                            </div>
                        )}
                        {/* Navigation buttons */}
                        {
                            isEditable &&
                            <div className="flex gap-2 justify-between w-full mt-6 pt-4 border-t border-gray-200">
                                {stepped ? (
                                    <>
                                        {!isFirstStep && (
                                            <button
                                                type="button"
                                                className="bg-[#ffa206] self-start w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 duration-300 disabled:opacity-50 transition-all ease-out"
                                                onClick={handlePrev}
                                                disabled={isSubmitting}
                                            >
                                                Back
                                            </button>
                                        )}

                                        {!isLastStep ? (
                                            <button
                                                type="button"
                                                className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 disabled:opacity-50 transition-all duration-300 ease-out"
                                                onClick={handleNext}
                                                disabled={isSubmitting}
                                            >
                                                Next
                                            </button>
                                        ) : !isSubmitting ? (
                                            <button
                                                type="submit"
                                                disabled={!isEditable}
                                                className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 disabled:opacity-50 transition-all duration-300 ease-out"
                                            >
                                                Submit
                                            </button>
                                        ) : (
                                            <div className="flex ml-auto items-center justify-end gap-3 h-14 text-base rounded-full px-6 py-2">
                                                <span className="text-black font-semibold">
                                                    Submitting...
                                                </span>
                                                <CircularProgress
                                                    size={34}
                                                    thickness={5}
                                                    sx={{ color: "#ffa206" }}
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : !isSubmitting ? (
                                    <button
                                        type="submit"
                                        disabled={!isEditable}
                                        className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 disabled:opacity-50 transition-all duration-300 ease-out"
                                    >
                                        Submit
                                    </button>
                                ) : (
                                    <div className="flex ml-auto items-center justify-end gap-3 h-14 text-base rounded-full px-6 py-2">
                                        <span className="text-black font-semibold">
                                            Submitting...
                                        </span>
                                        <CircularProgress
                                            size={34}
                                            thickness={5}
                                            sx={{ color: "#ffa206" }}
                                        />
                                    </div>
                                )}
                            </div>
                        }
                    </form>
                </div>
            </div>
        </>
    );
}
