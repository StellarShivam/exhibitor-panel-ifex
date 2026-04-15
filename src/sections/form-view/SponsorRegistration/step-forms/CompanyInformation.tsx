import RHFTextField from "../../hook-form/rhf-text-field";

import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  UseFormTrigger,
} from "react-hook-form";

import { State } from "country-state-city";

import RHFSearchSelect from "../../hook-form/rhf-search-select";
import RHFRadioGroup from "../../hook-form/rhf-radio-group";
import RHFTextArea from "../../hook-form/rhf-text-area";
import RHFSearchSelect2 from "../../hook-form/rhf-search-select2";
import { gstStateCodeByISO } from "../data";
import { useEffect } from "react";
import { verifyDocument } from "../../apis/exhibitior-reg";
import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { RHFMultiCheckbox } from "../../hook-form/rhf-checkbox";

interface VerificationState {
  status: "idle" | "verifying" | "success" | "error";
  name?: string;
  error?: string;
  verifiedNumber?: string;
}

interface AdditionalDirector {
  id: string;
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

interface ContactInformationProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  trigger: UseFormTrigger<any>;
  panVerification: VerificationState;
  setPanVerification: React.Dispatch<React.SetStateAction<VerificationState>>;
  gstVerification: VerificationState;
  setGstVerification: React.Dispatch<React.SetStateAction<VerificationState>>;
  disabled?: boolean;
}

const exportMarketsOptions = [
  { label: "Africa", value: "Africa" },
  { label: "Asia", value: "Asia" },
  { label: "Europe", value: "Europe" },
  { label: "North America", value: "North America" },
  { label: "South America", value: "South America" },
  { label: "Oceania", value: "Oceania" },
  { label: "Others", value: "Others" },
];

export const ContactInformation = ({
  register,
  errors,
  setValue,
  watch,
  trigger: _trigger, // eslint-disable-line @typescript-eslint/no-unused-vars
  panVerification,
  setPanVerification,
  gstVerification,
  setGstVerification,
  disabled = false,
}: ContactInformationProps) => {
  const titleOptions = [
    { label: "Mr.", value: "Mr." },
    { label: "Mrs.", value: "Mrs." },
    { label: "Ms.", value: "Ms." },
    { label: "Dr.", value: "Dr." },
    { label: "Prof.", value: "Prof." },
  ];


  // Initialize additional directors from watch or empty array
  const directors =
    (watch("directors") as AdditionalDirector[]) || [];

  const addDirector = () => {
    const newDirector: AdditionalDirector = {
      id: Date.now().toString(),
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
    };
    setValue("directors", [...directors, newDirector]);
  };

  const removeDirector = (id: string) => {
    setValue(
      "directors",
      directors.filter((director) => director.id !== id)
    );
  };

  const gstStates = State.getStatesOfCountry("IN");

  const gstState = watch("gstState");
  useEffect(() => {
    if (gstState) {
      setValue("stateCode", gstStateCodeByISO[gstState as string]);
    }
  }, [gstState, setValue]);

  const panNumber = watch("panNumber");
  const contactPersonEmail = watch("email");
  const email = contactPersonEmail;

  useEffect(() => {
    if (!panNumber || !email) {
      setPanVerification({ status: "idle" });
      return;
    }

    if (
      panNumber &&
      typeof panNumber === "string" &&
      panNumber.length === 10 &&
      /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)
    ) {
      const panUpper = panNumber.toUpperCase();

      // Skip API call if this PAN was already verified successfully
      if (
        panVerification.status === "success" &&
        panVerification.verifiedNumber === panUpper
      ) {
        return;
      }

      const verifyPan = async () => {
        setPanVerification({ status: "verifying" });
        try {
          const response = await verifyDocument({
            eventId: 162,
            email: email as string,
            docType: "PAN",
            docNumber: panUpper,
          });

          console.log("PAN Verification Response:", response);

          // Check if response indicates success and contains name
          const responseData = response as Record<string, unknown>;
          const data = responseData.data as Record<string, unknown> | undefined;
          if (responseData && data && data.valid === true) {
            const name =
              (responseData.name as string) || (data?.name as string);
            if (name) {
              setPanVerification({
                status: "success",
                name,
                verifiedNumber: panUpper,
              });
              setValue("panVerifiedName", name);
            } else {
              setPanVerification({
                status: "error",
                error: "This PAN does not exist",
              });
            }
          } else {
            setPanVerification({
              status: "error",
              error: "This PAN does not exist",
            });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "This PAN does not exist";
          setPanVerification({
            status: "error",
            error: errorMessage,
          });
        }
      };

      const timeoutId = setTimeout(verifyPan, 1000);
      return () => clearTimeout(timeoutId);
    } else if (
      panNumber &&
      typeof panNumber === "string" &&
      panNumber.length > 0
    ) {
      setPanVerification({ status: "idle" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panNumber, email, setValue]);

  const gstNumber = watch("gstNumber");
  const gstEmail = watch("email");

  useEffect(() => {
    if (!gstNumber || !gstEmail) {
      setGstVerification({ status: "idle" });
      return;
    }

    if (gstNumber && typeof gstNumber === "string" && gstNumber.length === 15) {
      const gstUpper = gstNumber.toUpperCase();

      // Skip API call if this GST was already verified successfully
      if (
        gstVerification.status === "success" &&
        gstVerification.verifiedNumber === gstUpper
      ) {
        return;
      }

      const verifyGst = async () => {
        setGstVerification({ status: "verifying" });
        try {
          const response = await verifyDocument({
            eventId: 1,
            email: gstEmail as string,
            docType: "GSTIN",
            docNumber: gstUpper,
          });

          const responseData = response as Record<string, unknown>;
          const data = responseData.data as Record<string, unknown> | undefined;
          if (responseData && data && data.valid === true) {
            const name =
              (responseData.name as string) || (data?.name as string);
            if (name) {
              setGstVerification({
                status: "success",
                name,
                verifiedNumber: gstUpper,
              });
              setValue("gstVerifiedName", name);
            } else {
              setGstVerification({
                status: "error",
                error: "This GST does not exist",
              });
            }
          } else {
            setGstVerification({
              status: "error",
              error: "This GST does not exist",
            });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "This GST does not exist";
          setGstVerification({
            status: "error",
            error: errorMessage,
          });
        }
      };

      const timeoutId = setTimeout(verifyGst, 1000);
      return () => clearTimeout(timeoutId);
    } else if (
      gstNumber &&
      typeof gstNumber === "string" &&
      gstNumber.length > 0
    ) {
      setGstVerification({ status: "idle" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gstNumber, gstEmail, setValue]);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-6">Company Details</h2>
      <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-6">
        {watch("participationType") === "INDIAN_PARTICIPANT" && (
          <>
            <div>
              <RHFTextField
                name="panNumber"
                label="PAN Number"
                placeholder="Enter PAN Number"
                required
                disabled={disabled}
              />
              {panVerification.status === "verifying" && (
                <p className="text-blue-500 text-sm mt-1">Verifying PAN...</p>
              )}
              {panVerification.status === "success" && panVerification.name && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  ✓ Verified: {panVerification.name}
                </p>
              )}
              {panVerification.status === "error" && (
                <p className="text-red-500 text-sm mt-1">
                  {panVerification.error || "This PAN does not exist"}
                </p>
              )}
            </div>

            <div>
              <RHFTextField
                name="gstNumber"
                label="GST Number"
                placeholder="Enter GST Number"
                required
                disabled={disabled}
              />
              {gstVerification.status === "verifying" && (
                <p className="text-blue-500 text-sm mt-1">Verifying GST...</p>
              )}
              {gstVerification.status === "success" && gstVerification.name && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  ✓ Verified: {gstVerification.name}
                </p>
              )}
              {gstVerification.status === "error" && (
                <p className="text-red-500 text-sm mt-1">
                  {gstVerification.error || "This GST does not exist"}
                </p>
              )}
            </div>
            <RHFSearchSelect2
              name="gstState"
              label="State(where GST is registered)"
              placeholder="Select State"
              required
              options={gstStates.map((state) => ({
                label: state.name,
                value: state.isoCode,
              }))}
              disabled={disabled}
            />
            <RHFTextField
              name="stateCode"
              label="State Code(where GST is registered)"
              placeholder="Enter State Code"
              required
              disabled={disabled}
            />
          </>
        )}
        {watch("participationType") === "OVERSEAS_PARTICIPANT" && (
          <>
            <RHFTextField
              name="vatNumber"
              label="VAT Number"
              placeholder="Enter VAT Number"
              required
              disabled={disabled}
            />
          </>
        )}
        {/* <RHFTextField
          name="exportMarkets"
          label="Export Markets"
          placeholder="Enter Export Markets"
        /> */}
        <RHFTextField
          name="iecNumber"
          label="IEC Number"
          placeholder="Enter IEC Number"
          disabled={disabled}
        />
        {/* <RHFTextField
          name="cinNumber"
          label="CIN Number"
          placeholder="Enter CIN Number"
        />
        <RHFTextField
          name="dinNumber"
          label="DIN Number"
          placeholder="Enter DIN Number"
        /> */}
      </div>

      <div className="mt-4">
        <RHFRadioGroup name="isWomenEntreprenuer" options={[
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ]}
          label="Are you a Women Entrepreneur?"
          row disabled={disabled} />
      </div>

      <div className="mt-6">
        <h2 className="text-base font-semibold mb-2">
          Export Regions (select all that apply)
          {/* <span className="text-red-500 ml-1">*</span> */}
        </h2>
        <RHFMultiCheckbox
          name="exportMarkets"
          options={exportMarketsOptions}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: { xs: "4px", md: "6px" },
          }}
          disabled={disabled}
        />
      </div>
      {watch("exportMarkets")?.includes("Others") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-2">
          <RHFTextField
            name="otherExportMarket"
            label="Please specify Others"
            placeholder="Enter Other Export Market"
            required
            disabled={disabled}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-6">
        <RHFRadioGroup
          name="isMsme"
          label="Whether belongs to MSME"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          required
          row
          disabled={disabled}
        />
        {watch("isMsme") === "Yes" && (
          <>
            <RHFTextField
              name="msmeNumber"
              label="MSME Number"
              placeholder="Enter MSME Number"
              required
              disabled={disabled}
            />
          </>
        )}
      </div>

      <h2 className="text-base font-semibold mt-6">Director</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-2">
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full">
          <div className="w-full md:w-1/3">
            <RHFSearchSelect
              name="directorPrefix"
              label="Title"
              placeholder="Title"
              options={titleOptions.map((option) => option.value)}
              disabled={disabled}
            />
          </div>
          <div className="w-full md:w-2/3">
            <RHFTextField
              name="directorFirstName"
              label="First Name"
              placeholder="Enter First Name"
              disabled={disabled}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full">
          <RHFTextField
            name="directorMiddleName"
            label="Middle Name"
            placeholder="Enter Middle Name"
            disabled={disabled}
          />
          <RHFTextField
            name="directorLastName"
            label="Last Name"
            placeholder="Enter Last Name"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Additional Directors */}
      {directors.map((director, index) => (
        <div key={director.id} className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold">Director {index + 2}</h2>
            <IconButton
              onClick={() => removeDirector(director.id)}
              color="error"
              size="small"
              aria-label="Remove Director"
              disabled={disabled}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full">
              <div className="w-full md:w-1/3">
                <RHFSearchSelect
                  name={`directors.${index}.prefix`}
                  label="Title"
                  placeholder="Title"
                  required
                  options={titleOptions.map((option) => option.value)}
                  disabled={disabled}
                />
              </div>
              <div className="w-full md:w-2/3">
                <RHFTextField
                  name={`directors.${index}.firstName`}
                  label="First Name"
                  placeholder="Enter First Name"
                  required
                  disabled={disabled}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 w-full">
              <RHFTextField
                name={`directors.${index}.middleName`}
                label="Middle Name"
                placeholder="Enter Middle Name"
                disabled={disabled}
              />
              <RHFTextField
                name={`directors.${index}.lastName`}
                label="Last Name"
                placeholder="Enter Last Name"
                required
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add More Director Button */}
      <div className="mt-4">
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addDirector}
          disabled={disabled}
          sx={{
            color: "#ffa206",
            borderColor: "#ffa206",
            "&:hover": {
              borderColor: "#b01b6a",
              backgroundColor: "rgba(220, 34, 131, 0.04)",
            },
          }}
        >
          Add More Director
        </Button>
      </div>

      <div className="mt-6">
        <RHFTextArea
          name="companyBio"
          label="Company Profile"
          placeholder="Enter Company Profile (min 75 words and max 300 words)"
          required
          showWordCount={true}
          maxWords={300}
          minRows={4}
          maxRows={10}
          disabled={disabled}
        />
      </div>
    </>
  );
};
