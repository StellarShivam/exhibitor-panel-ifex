import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  UseFormWatch,
  UseFormTrigger,
  UseFormSetError,
  useFormContext,
} from 'react-hook-form';

import RHFRadioGroup from '../../hook-form/rhf-radio-group';
import RHFTextField from '../../hook-form/rhf-text-field';
import { useEffect, useState } from 'react';
import { calculatePricing, CalculatePricingResponse } from '../apis/sponsor-reg';
import { CircularProgress } from '@mui/material';
import RHFSearchSelect2 from '../../hook-form/rhf-search-select2';
import { CountryPartnerPackage, ExhibitionPackage, KnowledgeSessionsPackage, SponsorshipCategory, StatePartnerPackage } from '../enums';
import PackageTable from '../SponsorPackageTable';
interface BoothTypeProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  setError: UseFormSetError<FieldValues>;
  disabled?: boolean;
}


const sponsorshipCategoryOptions = [
  { label: "Exhibition", value: SponsorshipCategory.EXHIBITION },
  { label: "State Partner", value: SponsorshipCategory.STATE_PARTNER },
  { label: "Country Partner", value: SponsorshipCategory.COUNTRY_PARTNER },
  { label: "Knowledge Sessions", value: SponsorshipCategory.KNOWLEDGE_SESSIONS },
];

const sponsorshipPackagesOptions: Record<string, { label: string, value: string }[]> = {
  [SponsorshipCategory.EXHIBITION]: [
    { label: 'Platinum (5Cr)', value: ExhibitionPackage.PLATINUM },
    { label: 'Gold (3Cr)', value: ExhibitionPackage.GOLD },
    { label: 'Silver (2Cr)', value: ExhibitionPackage.SILVER },
    { label: 'Textile Technology (1Cr)', value: ExhibitionPackage.TEXTILE_TECHNOLOGY },
    { label: 'Textile Innovation (1Cr)', value: ExhibitionPackage.TEXTILE_INNOVATION },
    { label: 'Associate (1Cr)', value: ExhibitionPackage.ASSOCIATE },
    { label: 'Lounge (1Cr)', value: ExhibitionPackage.LOUNGE },
  ],
  [SponsorshipCategory.STATE_PARTNER]: [
    { label: 'Partner State(3Cr)', value: StatePartnerPackage.PARTNER_STATE },
    { label: 'Supporting State Partnership(2Cr)', value: StatePartnerPackage.SUPPORTING_STATE_PARTNERSHIP },
    { label: 'Knowledge Partner State(1Cr)', value: StatePartnerPackage.KNOWLEDGE_PARTNER_STATE },
  ],
  [SponsorshipCategory.COUNTRY_PARTNER]: [
    { label: 'Partner Country($100,000)', value: CountryPartnerPackage.PARTNER_COUNTRY },
    { label: 'Supporting Country Partnership($75,000)', value: CountryPartnerPackage.SUPPORTING_COUNTRY_PARTNERSHIP },
    { label: 'Knowledge Country Partner($50,000)', value: CountryPartnerPackage.KNOWLEDGE_COUNTRY_PARTNER },
  ],
  [SponsorshipCategory.KNOWLEDGE_SESSIONS]: [
    { label: 'Roundtable(30L)', value: KnowledgeSessionsPackage.ROUNDTABLE },
    { label: 'Fireside chat(30L)', value: KnowledgeSessionsPackage.FIRESIDE_CHAT },
    { label: 'Panel Discussion(20L)', value: KnowledgeSessionsPackage.PANEL_DISCUSSION },
    { label: 'Masterclass/Podcast(5L)', value: KnowledgeSessionsPackage.MASTERCLASS_PODCAST },
  ],
}

const tdsDeductorOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

export const BoothType = ({
  watch,
  trigger,
  errors,
  register,
  disabled = false,
}: BoothTypeProps) => {
  const [pricingData, setPricingData] = useState<CalculatePricingResponse['data'] | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const { setValue, resetField, formState: { dirtyFields } } = useFormContext();

  // Watch all required fields for pricing calculation
  const scheme = watch('scheme');
  const preferredFloor = watch('preferredFloor');
  const preferredStallSides = watch('preferredStallSides');
  const requiredArea = watch('area');
  const exhibitorCategory = watch('participationType');
  const billingState = watch('billingState');
  const tds = watch('tds');
  const tdsPercentage = watch('tdsPercentage');
  const sponsorshipCategory = watch('sponsorshipType');
  const numberOfSidesOptions = [
    { label: 'One Side', value: 1 },
    { label: 'Two Sides (Subject to availability)', value: 2 },
    { label: 'Three Sides (Subject to availability)', value: 3 },
    ...(exhibitorCategory !== 'OVERSEAS_PARTICIPANT' ? [{ label: 'Four Sides', value: 4 }] : []),
  ];

  // Calculate pricing when all required fields are filled (with debounce)
  useEffect(() => {
    if (errors.area || errors.preferredStallSides) {
      return;
    }

    // Check if all required fields are filled
    if (
      !scheme ||
      !preferredFloor ||
      !preferredStallSides ||
      !requiredArea ||
      !exhibitorCategory ||
      !billingState ||
      !tds ||
      (tds === 'Yes' && !tdsPercentage)
    ) {
      return;
    }

    // Validate requiredArea is a valid number
    const area = parseFloat(requiredArea);
    if (isNaN(area) || area <= 0) {
      return;
    }

    // Set loading state immediately
    setIsLoadingPricing(true);
    setPricingError(null);

    // Debounce the API call by 500ms
    const debounceTimer = setTimeout(async () => {
      try {
        const participationType =
          exhibitorCategory === 'INDIAN_PARTICIPANT'
            ? 'INDIAN_PARTICIPANT'
            : 'OVERSEAS_PARTICIPANT';

        const response: CalculatePricingResponse = await calculatePricing({
          preferredStallSides: parseInt(preferredStallSides),
          participationType: participationType,
          preferredFloor: preferredFloor,
          scheme: scheme,
          area: requiredArea,
          tds: tds === 'Yes',
          billingState: billingState,
          tdsPercentage: tdsPercentage ? parseInt(tdsPercentage) : 0,
        });

        // Extract pricing data from response
        if (response && response.data) {
          setPricingData({
            ...response.data,
            calculatedAmount: response.data.calculatedAmount ?? 0,
            gstAmount: response.data.gstAmount ?? 0,
            cgstAmount: response.data.cgstAmount ?? 0,
            sgstAmount: response.data.sgstAmount ?? 0,
            igstAmount: response.data.igstAmount ?? 0,
            tdsAmount: response.data.tdsAmount ?? 0,
            totalAmount: response.data.totalAmount ?? 0,
            plcAmount: response.data.plcAmount ?? 0,
            vatAmount: response.data.vatAmount !== undefined ? response.data.vatAmount : null,
            paidAmount: response.data.paidAmount ?? 0,
            currency: response.data.currency || 'INR',
          });
        }
      } catch (error) {
        console.error('Error calculating pricing:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to calculate pricing. Please try again.';
        setPricingError(errorMessage);
        setPricingData(null);
      } finally {
        setIsLoadingPricing(false);
      }
    }, 1000); // 500ms debounce delay

    // Cleanup function to cancel the timer if dependencies change
    return () => {
      clearTimeout(debounceTimer);
      setIsLoadingPricing(false);
    };
  }, [
    scheme,
    preferredFloor,
    preferredStallSides,
    requiredArea,
    exhibitorCategory,
    billingState,
    tds,
    errors.area,
    errors.preferredStallSides,
    tdsPercentage,
  ]);

  // useEffect(() => {
  //     if (preferredFloor) {
  //         trigger("preferredStallSides")
  //         trigger("area")
  //     }
  // }, [preferredFloor, trigger])

  //   useEffect(() => {
  //     if (numberOfSidesOptions) {
  //         trigger("area")
  //     }
  // }, [numberOfSidesOptions, trigger])

  useEffect(() => {
    // if (scheme) {
    trigger('preferredStallSides');
    trigger('area');
    trigger('preferredFloor');

    // }
  }, [scheme, preferredFloor, preferredStallSides, trigger]);
  // useEffect(() => {
  //   setValue("preferredStallSides", "");
  //   setValue("area", "");
  //   setValue("preferredFloor", "");
  //   setError("area",{message:undefined});
  //   setError("preferredStallSides",{message:undefined});
  //   setError("preferredFloor",{message:undefined});
  // }, [scheme])

  useEffect(() => {
    if (dirtyFields?.sponsorshipCategory) {
      resetField('sponsorshipPricingCategory');
    }
  }, [dirtyFields?.sponsorshipCategory, resetField, sponsorshipCategory]);

  console.log(watch('sponsorshipType'))

  return (
    <>
      {exhibitorCategory !== 'OVERSEAS_PARTICIPANT' && (
        <div className="flex justify-end text-sm">
          ** For Bare Space Rs. 500/sqm to be reduced (Min Size 18 sqm)
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Sponsor Details</h2>
      <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />

      <div className="mt-2">
        <h2 className="text-base font-semibold">
          Select Sponsorship Category
          <span className="text-red-500 ml-1">*</span>
        </h2>
        <RHFRadioGroup
          name="sponsorshipType"
          options={sponsorshipCategoryOptions}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: { xs: '4px', md: '6px' },
          }}
          disabled={disabled}
        />
      </div>
      <div>
        <PackageTable type={sponsorshipCategory} selectedPackage={watch('sponsorshipPricingCategory')} />
      </div>
      {
        sponsorshipCategory &&
        <div className="mt-4">
          <h2 className="text-base font-semibold">
            Select Package
            <span className="text-red-500 ml-1">*</span>
          </h2>
          <RHFRadioGroup
            name="sponsorshipPricingCategory"
            options={sponsorshipPackagesOptions[sponsorshipCategory]}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
              },
              gap: { xs: '4px', md: '6px' },
            }}
            disabled={disabled}
          />
        </div>
      }


      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-4">
        <div>
          <h2 className="text-base font-semibold">
            Are you a TDS Deductor?
            <span className="text-red-500 ml-1">*</span>
          </h2>
          <RHFRadioGroup name="tds" options={tdsDeductorOptions} row disabled={disabled} />
        </div>


        {tds === "Yes" && (
          <div>
            <RHFSearchSelect2
              name="tdsPercentage"
              label="TDS Percentage"
              placeholder="Select TDS Percentage"
              required
              options={[
                { label: "1%", value: "1" },
                { label: "2%", value: "2" },
                { label: "4%", value: "4" },
                { label: "10%", value: "10" },
              ]}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-4">
        {tds === "Yes" && <RHFTextField
          name="tanNumber"
          label="TAN Number"
          placeholder="Enter TAN Number"
          required
          disabled={disabled}
        />}
        <div />
      </div>

      {/* Pricing Breakdown Section - Fixed Container to Prevent Height Shifting */}
      {(isLoadingPricing || pricingData || pricingError) && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md border-2 border-[#ffa206] min-h-[250px] transition-all duration-300">
          {isLoadingPricing ? (
            <div className="flex items-center justify-center gap-3 h-[250px]">
              <CircularProgress size={24} sx={{ color: '#ffa206' }} />
              <p className="text-gray-600">Calculating pricing...</p>
            </div>
          ) : pricingError ? (
            <div className="flex items-center justify-center h-[250px]">
              <p className="text-sm font-semibold text-red-600 text-center">{pricingError}</p>
            </div>
          ) : pricingData ? (
            <>
              <h2 className="text-xl font-semibold mb-6 text-[#ffa206]">Pricing Breakdown</h2>
              <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />

              {/* <div className="flex justify-end">
                {pricingData.proformaInvoiceUrl && (
                  <a
                    href={pricingData.proformaInvoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[#ffa206] underline"
                  >
                    Download Proforma Invoice
                  </a>
                )}
              </div> */}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Currency</span>
                  <span className="text-base font-semibold text-gray-900">
                    {pricingData.currency ?? 'INR'}
                  </span>
                </div>

                {/* Base Amount */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Base Amount</span>
                  <span className="text-base font-semibold text-gray-900">
                    {pricingData.currency}{' '}
                    {pricingData.calculatedAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* {pricingData.plcAmount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            PLC Amount
                                        </span>
                                        <span className="text-base font-semibold text-gray-900">
                                            {pricingData.currency}{" "}
                                            {pricingData.plcAmount.toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </span>
                                    </div>
                                )} */}

                {pricingData.vatAmount !== null && pricingData.vatAmount !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">VAT Amount</span>
                    <span className="text-base font-semibold text-gray-900">
                      {pricingData.currency}{' '}
                      {pricingData.vatAmount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                {pricingData.tdsAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">TDS Deducted (-)</span>
                    <span className="text-base font-semibold text-red-600">
                      - {pricingData.currency}{' '}
                      {pricingData.tdsAmount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">CGST Amount</span>
                  <span className="text-base font-semibold text-gray-900">
                    {pricingData.currency}{' '}
                    {pricingData.cgstAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">SGST Amount</span>
                  <span className="text-base font-semibold text-gray-900">
                    {pricingData.currency}{' '}
                    {pricingData.sgstAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">IGST Amount</span>
                  <span className="text-base font-semibold text-gray-900">
                    {pricingData.currency}{' '}
                    {pricingData.igstAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Total GST Amount</span>
                  <span className="text-base font-semibold text-gray-900">
                    {pricingData.currency}{' '}
                    {pricingData.gstAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* {pricingData.paidAmount > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Paid Amount
                    </span>
                    <span className="text-base font-semibold text-gray-900">
                      {pricingData.currency}{" "}
                      {pricingData.paidAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )} */}

                {/* Total Amount */}
                <div className="flex justify-between items-center py-4 bg-[#ffa206] text-white rounded-lg px-4 mt-4">
                  <span className="text-base font-bold">Estimated Total Cost</span>
                  <span className="text-lg font-bold">
                    {pricingData.currency}{' '}
                    {pricingData.totalAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* <div className="mt-6 flex items-center">
        <input
          type="checkbox"
          id="termsAndConditions"
          // checked={watch("termsAndConditions")}
          className="w-5 h-5 text-[#ffa206] bg-gray-100 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          {...register('termsAndConditions')}
          disabled={disabled}
        />
        <label htmlFor="termsAndConditions" className={`ml-2 text-sm text-gray-700`}>
          I have read and understood the{' '}
          <a
            href="https://sit-event-backend-public.s3.amazonaws.com/event/img/ad_ur/1/1763072807024_GENERAL_REGULATION_BHARAT_TEX_2026_-_13_Nov_Ver1.0.pdf" // Update this to the path of your PDF file
            target="_blank" // Opens the PDF in a new tab
            rel="noopener noreferrer" // Adds security for external links
            className="text-[#ffa206] underline"
          >
            terms and conditions
          </a>{' '}
          and agree to abide by the same.
        </label>
        <p className="text-red-500 ml-1">*</p>
      </div>
      {errors.termsAndConditions && (
        <p className="text-red-500 text-sm mt-1">{errors.termsAndConditions?.message as string}</p>
      )} */}
    </>
  );
};
