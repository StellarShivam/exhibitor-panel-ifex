import { CircularProgress } from "@mui/material";
import React from "react";
import { toast } from "react-hot-toast";

export interface FormNavigationButtonsProps {
  /**
   * Current step ID (1-based)
   */
  currentStepId: number;

  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Whether the form is currently submitting/saving
   */
  isSubmitting: boolean;

  /**
   * Whether to show "Save and Next" instead of just "Next"
   */
  showSaveAndNext?: boolean;

  /**
   * Handler for going to previous step
   */
  onBack: () => void;

  /**
   * Handler for going to next step or saving and going to next
   */
  onNext: () => void;

  /**
   * Handler for final form submission
   */
  onSubmit?: () => void;

  /**
   * Optional custom text for the next button
   */
  nextButtonText?: string;

  /**
   * Optional custom text for the submit button
   */
  submitButtonText?: string;

  /**
   * Optional disabled state for submit button
   */
  submitDisabled?: boolean;

  /**
   * Optional loading text for intermediate steps
   */
  loadingText?: string;

  /**
   * Optional loading text for final submission
   */
  finalLoadingText?: string;

  /**
   * Optional success message to show in toast (overrides default)
   */
  successMessage?: string;

  /**
   * Optional error message to show in toast (overrides default)
   */
  errorMessage?: string;
}

/**
 * Reusable component for form navigation buttons (Back, Save and Next/Next, Submit)
 *
 * @example
 * ```tsx
 * <FormNavigationButtons
 *   currentStepId={currentStep.id}
 *   totalSteps={steps.length}
 *   isSubmitting={isSaving}
 *   showSaveAndNext={true}
 *   onBack={handleGoToPrevStep}
 *   onNext={handleSaveAndNext}
 *   onSubmit={handleSubmit}
 *   submitDisabled={!isSaved || !signatureUrl}
 * />
 * ```
 */
export const FormNavigationButtons: React.FC<FormNavigationButtonsProps> = ({
  currentStepId,
  totalSteps,
  isSubmitting,
  showSaveAndNext = false,
  onBack,
  onNext,
  onSubmit,
  nextButtonText,
  submitButtonText = "Submit",
  submitDisabled = false,
  loadingText = "Saving...",
  finalLoadingText = "Submitting...",
  successMessage,
  errorMessage,
}) => {
  const isFirstStep = currentStepId === 1;
  const isLastStep = currentStepId === totalSteps - 1;

  // Show toast if messages are provided (using ref to track previous values to avoid duplicates)
  const prevSuccessRef = React.useRef<string | undefined>(undefined);
  const prevErrorRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (successMessage && successMessage !== prevSuccessRef.current) {
      toast.success(successMessage);
      prevSuccessRef.current = successMessage;
    }
  }, [successMessage]);

  React.useEffect(() => {
    if (errorMessage && errorMessage !== prevErrorRef.current) {
      toast.error(errorMessage);
      prevErrorRef.current = errorMessage;
    }
  }, [errorMessage]);

  return (
    <div className="flex gap-2 justify-between w-full mt-auto pt-4">
      {/* Back Button */}
      {!isFirstStep && !isSubmitting && (
        <button
          type="button"
          className="bg-[#ffa206] self-start w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 duration-300 disabled:opacity-50 transition-all ease-out"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </button>
      )}

      {/* Next/Save and Next/Submit Button */}
      {!isLastStep ? (
        !isSubmitting ? (
          <button
            type="button"
            className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-out"
            onClick={onNext}
            disabled={isSubmitting}
          >
            {nextButtonText || (showSaveAndNext ? "Save & Next" : "Next")}
          </button>
        ) : (
          <div className="flex ml-auto items-center justify-end gap-3 h-14 text-base rounded-full px-6 py-2 w-full lg:w-auto">
            <span className="text-black font-semibold">{loadingText}</span>
            <CircularProgress
              size={34}
              thickness={5}
              sx={{
                color: "#ffa206",
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
                width: "40px !important",
                height: "40px !important",
              }}
            />
          </div>
        )
      ) : (
        <div className="relative w-full lg:w-auto ml-auto">
          {!isSubmitting ? (
            <button
              type="submit"
              className="bg-[#ffa206] ml-auto w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-out"
              disabled={isSubmitting || submitDisabled}
              onClick={onSubmit}
            >
              {submitButtonText}
            </button>
          ) : (
            <div className="flex ml-auto items-center justify-end gap-3 h-14 text-base rounded-full px-6 py-2">
              <span className="text-black font-semibold">{finalLoadingText}</span>
              <CircularProgress
                size={34}
                thickness={5}
                sx={{
                  color: "#ffa206",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  },
                  width: "40px !important",
                  height: "40px !important",
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
