import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  UseFormTrigger,
} from "react-hook-form";

import { RHFMultiCheckbox } from "../../hook-form/rhf-checkbox";
import RHFTextField from "../../hook-form/rhf-text-field";
import { productGroupsAndCategories } from "../data";
import { useEffect, useRef } from "react";
import RHFSearchSelect2 from "../../hook-form/rhf-search-select2";
import { ProductGroup, checkGstRegistered } from "../../apis/exhibitior-reg";
import { CircularProgress } from "@mui/material";

interface BusinessProductInformationProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  trigger: UseFormTrigger<any>;
  productGroups: ProductGroup[];
  gstRegistrationCheck: {
    status: "idle" | "checking" | "available" | "registered" | "error";
    message?: string;
  };
  setGstRegistrationCheck: React.Dispatch<
    React.SetStateAction<{
      status: "idle" | "checking" | "available" | "registered" | "error";
      message?: string;
    }>
  >;
  disabled?: boolean;
}

const BRANDS_OF_INDIA = "1.8 Brands of India";

const natureOfBusinessOptions = [
  { label: "Manufacturer", value: "Manufacturer" },
  { label: "Exporter", value: "Exporter" },
  { label: "Sole Agent", value: "Sole Agent" },
  { label: "Wholesaler", value: "Wholesaler" },
  { label: "Product Designer", value: "Product Designer" },
  { label: "Publisher", value: "Publisher" },
  { label: "Others", value: "Others" },
];

export const BusinessProductInformation = ({
  register,
  errors,
  setValue,
  watch,
  trigger,
  productGroups,
  gstRegistrationCheck,
  setGstRegistrationCheck,
  disabled = false,
}: BusinessProductInformationProps) => {
  const productGroupId = watch("productGroupId") as string | undefined;
  const gstNumber = watch("gstNumber") as string | undefined;
  const vatNumber = watch("vatNumber") as string | undefined;
  const exhibitorCategory = watch("participationType") as string | undefined;
  const productCategory = watch("productCategory") as string[] | undefined;
  const councilId = watch("councilId");
  const productCategoryHasBrandsOfIndia = councilId == 3 && productCategory?.includes(BRANDS_OF_INDIA);
  const previousCategoriesRef = useRef<string[]>([]);

  // Find selected product group from API data
  const selectedProductGroup = productGroups.find(
    (group) => group.id.toString() === productGroupId
  );

  // Get categories from static data based on product group name
  const categories =
    selectedProductGroup &&
    selectedProductGroup.name in productGroupsAndCategories
      ? productGroupsAndCategories[
          selectedProductGroup.name as keyof typeof productGroupsAndCategories
        ]
      : [];

  const previousProductGroupRef = useRef<string | undefined>(productGroupId);

  useEffect(() => {
    // Only clear product categories if the product group has actually changed
    // Don't clear on initial mount or when navigating between steps
    if (
      previousProductGroupRef.current &&
      previousProductGroupRef.current !== productGroupId
    ) {
      setValue("productCategory", []);
      setValue("otherProductCategory", "");
    }
    previousProductGroupRef.current = productGroupId;
  }, [productGroupId, setValue]);

  useEffect(() => {
    if (!productCategory) return;

    const hasBrands = productCategoryHasBrandsOfIndia;

    if (hasBrands) {
      // Save previous selection if not already saved
      if (!previousCategoriesRef.current.length) {
        previousCategoriesRef.current = productCategory.filter(
          (item) => item !== BRANDS_OF_INDIA
        );
      }

      // Only keep Brands of India selected
      setValue("productCategory", [BRANDS_OF_INDIA]);
      setValue("preferredFloor", 'GROUND_FLOOR');
      setValue("scheme", 'BARE');
    } else {
      // If Brands of India was removed, restore previous categories
      if (previousCategoriesRef.current.length) {
        setValue("productCategory", previousCategoriesRef.current);
        previousCategoriesRef.current = []; // reset storage
      }
    }
  }, [productCategory, setValue]);

  // Track previous values to prevent unnecessary API calls
  const previousCheckValuesRef = useRef<{
    productGroupId?: string;
    gstNumber?: string;
    vatNumber?: string;
  }>({});

  // Check GST registration when productGroupId, gstNumber, or vatNumber changes
  // useEffect(() => {
  //   const previousValues = previousCheckValuesRef.current;

  //   // Check if any relevant value has changed
  //   const hasChanged =
  //     previousValues.productGroupId !== productGroupId ||
  //     previousValues.gstNumber !== gstNumber ||
  //     previousValues.vatNumber !== vatNumber;

  //   // Only proceed if values have changed and we have the necessary data
  //   if (!hasChanged) {
  //     return;
  //   }

  //   // Update previous values
  //   previousCheckValuesRef.current = {
  //       productGroupId,
  //     gstNumber,
  //     vatNumber,
  //   };

  //   // Reset check if we don't have required data
  //   if (!productGroupId) {
  //     setGstRegistrationCheck({ status: "idle" });
  //     return;
  //   }

  //   // For Participant, check with GST number
  //   if (exhibitorCategory === "INDIAN_PARTICIPANT" && gstNumber) {
  //     if (gstNumber.length === 15) {
  //       const checkGst = async () => {
  //         setGstRegistrationCheck({ status: "checking" });
  //         try {
  //           const response = await checkGstRegistered(
  //             gstNumber,
  //             parseInt(productGroupId)
  //           );

  //           const responseData = response as Record<string, unknown>;

  //           if (responseData.status === true) {
  //             setGstRegistrationCheck({
  //               status: "registered",
  //               message:
  //                 (responseData.msg as string) ||
  //                 "This GST is already registered for this product group",
  //             });
  //           } else {
  //             setGstRegistrationCheck({
  //               status: "available",
  //               message:
  //                 (responseData.msg as string) || "Available for registration",
  //             });
  //           }
  //         } catch (error: unknown) {
  //           const errorMessage =
  //             error instanceof Error
  //               ? error.message
  //               : "Failed to check GST registration";
  //           setGstRegistrationCheck({
  //             status: "error",
  //             message: errorMessage,
  //           });
  //         }
  //       };

  //       const timeoutId = setTimeout(checkGst, 1000);
  //       return () => clearTimeout(timeoutId);
  //     } else if (gstNumber.length > 0) {
  //       setGstRegistrationCheck({ status: "idle" });
  //     }
  //   }

  //   // For Overseas Participant, check with VAT number
  //   if (exhibitorCategory === "OVERSEAS_PARTICIPANT" && vatNumber) {
  //     if (vatNumber.length >= 8) {
  //       const checkVat = async () => {
  //         setGstRegistrationCheck({ status: "checking" });
  //         try {
  //           const response = await checkGstRegistered(
  //             vatNumber,
  //             parseInt(productGroupId)
  //           );

  //           const responseData = response as Record<string, unknown>;

  //           if (responseData.status === true) {
  //             setGstRegistrationCheck({
  //               status: "registered",
  //               message:
  //                 (responseData.msg as string) ||
  //                 "This VAT is already registered for this product group",
  //             });
  //           } else {
  //             setGstRegistrationCheck({
  //               status: "available",
  //               message:
  //                 (responseData.msg as string) || "Available for registration",
  //             });
  //           }
  //         } catch (error: unknown) {
  //           const errorMessage =
  //             error instanceof Error
  //               ? error.message
  //               : "Failed to check VAT registration";
  //           setGstRegistrationCheck({
  //             status: "error",
  //             message: errorMessage,
  //           });
  //         }
  //       };

  //       const timeoutId = setTimeout(checkVat, 1000);
  //       return () => clearTimeout(timeoutId);
  //     } else if (vatNumber.length > 0) {
  //       setGstRegistrationCheck({ status: "idle" });
  //     }
  //   }

  //   // Reset if we don't have the right combination
  //   if (
  //     (exhibitorCategory === "INDIAN_PARTICIPANT" && !gstNumber) ||
  //     (exhibitorCategory === "OVERSEAS_PARTICIPANT" && !vatNumber)
  //   ) {
  //     setGstRegistrationCheck({ status: "idle" });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [productGroupId, gstNumber, vatNumber, exhibitorCategory]);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Nature of Business</h2>
      <hr className="w-full border-t-1 border-[#B1B1B1]" />
      <div className="mt-6">
        <h2 className="text-base font-semibold mb-2">
          Select Nature of business
          <span className="text-red-500 ml-1">*</span>
        </h2>
        <RHFMultiCheckbox
          name="businessNature"
          options={natureOfBusinessOptions}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: { xs: "4px", md: "6px" },
          }}
          disabled={disabled}
        />
      </div>
      {watch("businessNature")?.includes("Others") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-2">
          <RHFTextField
            name="otherBusinessNature"
            label="Please specify Others"
            placeholder="Enter Other Nature of Business"
            required
            disabled={disabled}
          />
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 mt-6">
        Product Group & Categories
      </h2>
      <hr className="w-full border-t-1 border-[#B1B1B1]" />

      <div className="mt-4">
        <h2 className="text-base font-semibold mb-2">
          Select Product Group
          <span className="text-red-500 ml-1">*</span>
        </h2>

        <RHFSearchSelect2
          name="productGroupId"
          placeholder="Select Product Group"
          options={productGroups.map((group) => ({
            label: group.name,
            value: group.id.toString(),
          }))}
          required
          disabled={disabled}
        />

        {/* GST Registration Check Status */}
        {gstRegistrationCheck.status === "checking" && (
          <p className="text-blue-500 text-sm mt-2 flex items-center gap-2">
            <CircularProgress size={16} />
            Checking {exhibitorCategory === "INDIAN_PARTICIPANT" ? "GST" : "VAT"}{" "}
            registration for this product group...
          </p>
        )}
        {/* {gstRegistrationCheck.status === "available" && (
          <p className="text-green-600 text-sm mt-2 font-medium">
            ✓ {gstRegistrationCheck.message || "Available for registration"}
          </p>
        )}
        {gstRegistrationCheck.status === "registered" && (
          <p className="text-red-500 text-sm mt-2 font-medium">
            ✗{" "}
            {gstRegistrationCheck.message ||
              "Already registered for this product group"}
          </p>
        )} */}
        {gstRegistrationCheck.status === "error" && (
          <p className="text-red-500 text-sm mt-2">
            {gstRegistrationCheck.message || "Failed to check registration"}
          </p>
        )}
      </div>

      {productGroupId && categories.length > 0 && (
        <>
          <div className="mt-4">
            <h2 className="text-base font-semibold mb-2">
              Select Product Categories
              <span className="text-red-500 ml-1">*</span>
            </h2>
            <RHFMultiCheckbox
              name="productCategory"
              options={categories.map((category: { label: string; value: string }) => ({
                label: category.label,
                value: category.value,
              }))}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: { xs: "4px", md: "6px" },
              }}
              disabled={disabled}
            />
          </div>
          {watch("productCategory")?.includes("Others") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-2">
              <RHFTextField
                name="otherProductCategory"
                label="Please specify Other Product Category"
                placeholder="Enter Other Product Category"
                required
                disabled={disabled}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
