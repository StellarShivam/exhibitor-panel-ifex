// import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSnackbar } from 'src/components/snackbar';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { useEventContext } from 'src/components/event-context';
import { BASE_URL } from 'src/config-global';
import { roundHalfUp } from 'src/utils/format-number';
import { FileUploadBox } from "../form-view/hook-form/FileUploadBox";


const API_URL = `${BASE_URL}/api/v1`;

interface PaymentDetails {
  email: string;
  currency: string;
  totalAmount: number;
  calculatedAmount: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  tdsAmount: number;
  plcAmount: number;
  vatAmount: number | null;
  paidAmount: number;
  preferredStallSides: number;
  preferredFloor: string;
}

interface TransactionDetail {
  email: string;
  eventId: number;
  finalAmount: string; // Stored as a string in the data
  actualAmount: string; // Stored as a string in the data
  gst: string; // Stored as a string in the data
  paymentMethod: string;
  orderId: string;
  paymentStatus: string;
  paymentOption: string | null; // Nullable field
  proofUrl: string | null; // Nullable field
}

interface TransactionsData {
  totalAmount: number | null; // Nullable field
  tds: number | null; // Nullable field
  billingAddressLine1: string | null; // Nullable field
  billingAddressLine2: string | null; // Nullable field
  billingCity: string | null; // Nullable field
  billingCountry: string | null; // Nullable field
  billingStateProvinceRegion: string | null; // Nullable field
  billingPostalCode: string | null; // Nullable field
  paymentDetails: TransactionDetail[];
}

// Define Zod schema for offline payment form validation


interface Props {
  open: boolean;
  onClose: () => void;
  paymentDetails: PaymentDetails;
  reFetchPayment: () => void;
  reFetchPaymentDetails: () => void;
  exhibitorForm: any;
  isOffline?: boolean;
}

export default function PaymentDialog({
  open,
  onClose,
  paymentDetails,
  reFetchPayment,
  reFetchPaymentDetails,
  exhibitorForm,
  isOffline = false,
}: Props) {
  // const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [postGstPrice, setPostGstPrice] = useState(0);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [purchaseId, setPurchaseId] = useState<string>("");
  const [shouldGeneratePDF, setShouldGeneratePDF] = useState(false);
  const [transactions, setTransactions] = useState<TransactionsData | null>(
    null
  );
  // const [gstAmount, setGstAmount] = useState(0); // State for GST amount
  const [paymentMode, setPaymentMode] = useState(""); // Track selected payment mode
  const [otherDetails, setOtherDetails] = useState(""); // State for "Other" input
  const [showOfflineForm, setShowOfflineForm] = useState(false); // State to control offline form visibility
  const [paymentStatus, setPaymentStatus] = useState("");
  const [onlineAmount, setOnlineAmount] = useState<number>();
  const [amountError, setAmountError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tdsAmout, setTdsAmount] = useState<number>();
  const { enqueueSnackbar } = useSnackbar();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const { eventData } = useEventContext();


  const calculateMinimumAmountToPay = () => {
    const totalAmountToPay = Number(paymentDetails?.totalAmount) || 0;
    const paidAmount = Number(paymentDetails?.paidAmount) || 0;
    const installmentDetails = paymentDetails?.installments || [];


    const now = new Date();
    const todayDate = paymentDetails?.timestamp
      ? paymentDetails.timestamp.split("T")[0]
      : now.toISOString().split("T")[0];

    const installmentsSorted = [...installmentDetails].sort((a, b) =>
      a.dueDate.localeCompare(b.dueDate)
    );

    if (!installmentsSorted.length) {
      return {
        minimumAmount: Math.max(0, totalAmountToPay - paidAmount),
        maximumAmount: Math.max(0, totalAmountToPay - paidAmount),
      };
    }

    let requiredPercentPaid = 0;
    let firstFutureInstallmentIdx = -1;

    installmentsSorted.forEach((inst, idx) => {
      if (todayDate >= inst.dueDate) {
        requiredPercentPaid += Number(inst.installmentPart || 0);
      } else if (firstFutureInstallmentIdx === -1) {
        firstFutureInstallmentIdx = idx;
      }
    });

    if (requiredPercentPaid === 0 && firstFutureInstallmentIdx !== -1) {
      requiredPercentPaid = Number(installmentsSorted[firstFutureInstallmentIdx].installmentPart || 0);
    }

    requiredPercentPaid = Math.min(100, requiredPercentPaid);

    if (totalAmountToPay > 0) {
      let requiredPaidAmount = (requiredPercentPaid / 100) * totalAmountToPay;

      let includedUpToIdx = -1;
      let sumPercent = 0;
      for (let i = 0; i < installmentsSorted.length; i++) {
        sumPercent += Number(installmentsSorted[i].installmentPart || 0);
        if (sumPercent <= requiredPercentPaid + 1e-9) {
          includedUpToIdx = i;
        } else {
          break;
        }
      }

      if (includedUpToIdx === -1 && firstFutureInstallmentIdx !== -1) {
        includedUpToIdx = firstFutureInstallmentIdx;
      }

      while (true) {
        requiredPaidAmount = (requiredPercentPaid / 100) * totalAmountToPay;

        if (paidAmount + 1e-9 < requiredPaidAmount) break;

        if (includedUpToIdx >= installmentsSorted.length - 1) break;

        const nextIdx = includedUpToIdx + 1;
        const nextPart = Number(installmentsSorted[nextIdx].installmentPart || 0);
        requiredPercentPaid = Math.min(100, requiredPercentPaid + nextPart);
        includedUpToIdx = nextIdx;

      }
    }

    requiredPercentPaid = Math.min(100, requiredPercentPaid);

    const requiredPaidAmount = (requiredPercentPaid / 100) * totalAmountToPay;

    let minimumAmount = requiredPaidAmount - paidAmount;
    minimumAmount = Math.max(0, minimumAmount);

    const maximumAmount = Math.max(0, totalAmountToPay - paidAmount);

    return {
      minimumAmount,
      maximumAmount,
    };
  };

  const getMembershipAmount = () => {
    const calculatedAmount = paymentDetails?.calculatedAmount || 0;
    const gstAmount = paymentDetails?.gstAmount || 0;
    const totalAmount = paymentDetails?.totalAmount || 0;
    const membershipAmount = totalAmount - (calculatedAmount + gstAmount);
    return membershipAmount > 0 ? membershipAmount : 0;
  };

  const calculateAmountToPay = (percentage: number) => {
    const totalAmountToPay = paymentDetails?.totalAmount || 0;
    const paidAmount = paymentDetails?.paidAmount || 0;
    if (paidAmount === 0) {
      const calculatedAmount = paymentDetails?.calculatedAmount || 0;
      const gstAmount = paymentDetails?.gstAmount || 0;
      const baseAmount = calculatedAmount + gstAmount;
      const membershipAmount = getMembershipAmount();
      const stageAmount = (percentage / 100) * baseAmount;
      return roundHalfUp(stageAmount + membershipAmount);
    }
    return roundHalfUp((percentage / 100) * totalAmountToPay);
  };


  const offlinePaymentSchema = z
    .object({
      inititalAmount: z
        .number()
        .min(0, "Amount must be greater than 25%")
        .max(postGstPrice, "Amount must be less than 1,000,000"),
      paymentMode: z
        .enum(["bank_transfer", "cheque", "UPI", "demand_draft"])
        .refine((val) => !!val, {
          message: "Select a payment mode",
        }),
      orderId: z
        .string()
        .min(1, "Required")
        .refine(
          (val) => /^[a-zA-Z0-9]+$/.test(val),
          "Order ID must contain only letters and numbers"
        ),
      finalAmount: z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Amount must be a valid number")
        .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0")
        .refine((val) => !!val, {
          message: "This field is required",
        }),
      confirmOrderId: z.string().refine((val) => val === getValues("orderId"), {
        message: "Order ID does not match",
      }),
      // confirmOfflineAmount: z
      //   .number()
      //   .refine((val) => val === getValues("finalAmount"), {
      //     message: "Amount does not match",
      //   }),
      ifscCode: paymentDetails?.currency === 'INR'
        ? z
          .string()
          .min(1, "IFSC Code is required")
          .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code format")
          .refine((val) => val.length === 11, "IFSC Code must be 11 characters")
        : z.string().optional(),
      transactionDate: z.string().min(1, "Required"), // <-- ensure required in schema
      proofUrl: z.string().optional(),
      percentageLikeToPay: z
        .number()
        .min(0, "Percentage must be greater than 0")
        .max(100, "Percentage must be less than 100"),
    })
    .refine(
      (data) => {
        const paymentMode = data.paymentMode;
        if (paymentMode !== "cheque") {
          const selectedDate = new Date(data.transactionDate);
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return selectedDate <= today;
        }
        return true;
      },
      {
        message:
          "Transaction date cannot be in the future for this payment mode",
        path: ["transactionDate"],
      }
    );

  const [steps, setSteps] = useState([
    { id: 1, label: "Exhibitor Information", completed: true },
    { id: 2, label: "Company Details", completed: true },
    { id: 3, label: "Objective & Preferences", completed: true },
    { id: 4, label: "Booth Details", completed: true },
    { id: 5, label: "Payment", completed: false },
  ]);

  const [currentStep, setCurrentStep] = useState(steps[4]);
  const [lastPaidAmount, setLastPaidAmount] = useState<number>(0);


  const { Razorpay } = useRazorpay();

  const topRef = useRef<HTMLDivElement>(null);

  const createOrder = async () => {
    try {
      const res = await axios.post(API_URL + "/payment/online", {
        email: paymentDetails?.email,
        currency: paymentDetails?.currency || "INR",
        amount: onlineAmount?.toString(),
      });

      return {
        orderId: res.data.data.orderId,
      };
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to create order. Please try again.", {
        variant: "error",
      });
      setIsPaymentProcessing(false);
    }
  };

  const completePayment = async (response, orderId) => {
    try {
      await axios.post(API_URL + "/payment/verify", {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
      });

      enqueueSnackbar("Payment completed successfully!", {
        variant: "success",
      });

      setIsPaymentProcessing(false);
    } catch (error) {
      console.log(error);
      setIsPaymentProcessing(false);
      enqueueSnackbar("Payment failed. Please try again or contact support.", {
        variant: "error",
      });
    } finally {
      setIsPaymentProcessing(false);
      setOnlineAmount("");
      onClose();
      reset();
      reFetchPayment();
      reFetchPaymentDetails();
    }
  };

  const hasPendingVerification = () => {
    return transactions?.paymentDetails.some(
      (transaction) => transaction.paymentStatus === "init"
    );
  };

  const handlePayment = async () => {
    if (isPaymentProcessing) return;
    setIsPaymentProcessing(true);
    setErrorMessage(null); // Clear any previous error

    enqueueSnackbar("Processing payment...", {
      variant: "info",
    });

    const { orderId } = await createOrder();
    const options = {
      key: "rzp_live_Rggf86DYjnbY0i",
      amount: Number(onlineAmount?.toFixed(2)) * 100, // Amount in paise
      currency: "INR",
      name: "IFEX TRADE FEDERATION",
      description: "IFEX TRADE FEDERATION",
      order_id: orderId,
      handler: (response: any) => {
        completePayment(response, orderId);
      },
      prefill: {
        email: paymentDetails?.email,
      },
      theme: {
        color: "#ffa206",
      },
      modal: {
        ondismiss: () => {
          setIsPaymentProcessing(false);
          enqueueSnackbar("Payment failed.", {
            variant: "error",
          });
        },
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
    setValue,
    trigger,
    watch,
  } = useForm<{
    paymentMode: string;
    orderId: string;
    finalAmount: number;
    confirmOrderId: string;
    confirmOfflineAmount: number;
    inititalAmount: number;
    ifscCode: string;
    transactionDate: string; // <-- add to form type
    proofUrl: string;
    percentageLikeToPay: number;
  }>({
    resolver: zodResolver(offlinePaymentSchema),
    mode: "onChange",
    defaultValues: {
      paymentMode: "",
      orderId: "",
      finalAmount: undefined,
      confirmOrderId: "",
      confirmOfflineAmount: undefined,
      inititalAmount: 0,
      ifscCode: "",
      transactionDate: "", // <-- add to form type
      proofUrl: "",
      percentageLikeToPay: undefined,
    },
  });


  // If exhibitor has allotment letter, force full remaining payment
  useEffect(() => {
    const hasAllotment = Boolean(exhibitorForm?.metaData?.data?.allotmentLetter);
    if (hasAllotment) {
      const total = paymentDetails?.totalAmount || 0;
      const paid = paymentDetails?.paidAmount || 0;
      const unpaid = Math.max(0, total - paid);
      setOnlineAmount(unpaid);
      try {
        setValue("finalAmount", unpaid as any);
        setValue("percentageLikeToPay", 100 as any);
      } catch (err) {
        // ignore
      }
    }
  }, [exhibitorForm, paymentDetails, setValue]);

  const handleOfflinePaymentSubmit = async (data: {
    paymentMode: string;
    orderId: string;
    finalAmount: number;
    transactionDate: string; // <-- add to function argument type
    proofUrl: string;
  }) => {
    if (hasPendingVerification()) {
      setErrorMessage(
        "Please wait for your previous transaction to be verified by the organizer."
      );
      enqueueSnackbar(
        "Please wait for your previous transaction to be verified by the organizer.",
        {
          variant: "error",
        }
      );
      return;
    }
    setErrorMessage(null); // Clear any previous error
    setIsLoading(true);

    enqueueSnackbar("Submitting offline payment details...", {
      variant: "info",
    });

    try {
      const payload = {
        urn: exhibitorForm?.urn,
        amount: Number(data?.finalAmount || 0),
        orderId: data.orderId, // Always include
        paymentMethod: data.paymentMode,
        bankName: ifscData?.bank || "",
        branchName: ifscData?.branch || "",
        transactionDate: data.transactionDate,
        proofUrl: data.proofUrl,
      };
      setLastPaidAmount(data.finalAmount);
      const response = await axios.post(API_URL + "/payment/offline", payload);


      enqueueSnackbar(
        "Offline payment details submitted successfully! Your payment is pending verification.",
        {
          variant: "success",
        }
      );

      setIsLoading(false);
      onClose();
      reFetchPayment();
      reFetchPaymentDetails();
      reset(); // Reset form
    } catch (error: any) {
      console.error("Offline Payment Error:", error);

      const errorMessage =
        error?.response?.data?.msg ||
        error?.message ||
        "Failed to submit offline payment. Please try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });

      setIsLoading(false);
    }
  };

  const [ifscCode, setIfscCode] = useState("");

  const [ifscData, setIfscData] = useState(null);
  const [isIfscCalledOnce, setIsIfscCalledOnce] = useState(false);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerifyIFSC = async () => {
    setIfscLoading(true);
    setIfscData(null);
    setIsIfscCalledOnce(true);
    // const response = await axios.post(
    //   "https://api.attestr.com/api/v1/public/finanx/ifsc",
    //   { ifsc: ifscCode },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // console.log("IFSC Data: ", response.data);
    try {
      const response = await axios.post(
        "https://api.attestr.com/api/v1/public/finanx/ifsc",
        { ifsc: ifscCode },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic T1gwajRlSVQ2TENUT29ZanBkLjZiY2E2YjY0ZTlhNWI0ZGVlMGQ3NWVjZTk4NDg0NWVhOjA0N2FlNzM0ZmMwZmQ2NTc2M2Q4OGNmNGNkZmY5Mzc3OTBhNWFlNzFhYTU0YWQ2ZQ==
    `,
          },
        }
      );
      setIfscData(response.data);
      setIfscLoading(false);
    } catch (err) {
      console.log("Error Verifying IFSC");
      setIfscLoading(false);
    }
  };

  const watchedPaymentMode = watch("paymentMode");
  const today = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];


  const renderContent = (
    <div className="flex items-center justify-center">
      <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] rounded-2xl w-full xl:w-5/6 my-8">
        {/* <div className="flex flex-col justify-start gap-3 lg:gap-8 items-center lg:items-start lg:w-2/5 w-full bg-[#ffa206] rounded-t-2xl lg:rounded-2xl lg:pl-5 px-4 py-6 lg:py-12 text-white">
        <h1 className="text-white text-2xl lg:text-3xl font-semibold px-4">
          Register Now
        </h1>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
            alignItems: { xs: "center", md: "flex-start" }, // Center for horizontal view in mobile
            paddingLeft: { lg: 0 }, // Adjust padding for large screens
            marginLeft: { lg: "10px" }, // Space for dots in large screens
            flexDirection: { xs: "row", md: "column" }, // Horizontal for mobile, vertical for large screens
            overflowX: { xs: "auto", md: "visible" }, // Allow horizontal scrolling in mobile
            "& .MuiTimelineConnector-root": {
              transform: { xs: "none", md: "none" }, // Ensure connectors are aligned
            },
            alignSelf: { xs: "center", md: "flex-start" }, // Center for horizontal view in mobile
          }}
        >
          {steps.map((step, index) => (
            <TimelineItem
              key={step.id}
              sx={{
                minHeight: { xs: "auto", md: "80px" }, // Adjust height for horizontal mode
                display: "flex",
                flexDirection: "row",
                "& .MuiTimelineContent-root": {
                  marginLeft: "10px", // Space between dot and text
                  paddingTop: "10px", // Align text with dot center
                  paddingLeft: "8px", // MUI default is 16px, reduce if needed
                  paddingRight: "8px",
                },
                "& .MuiTimelineSeparator-root": {
                  flexDirection: { xs: "row", md: "column" }, // Align connectors horizontally in mobile
                },
              }}
            >
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    width: { xs: "36px", md: "40px" },
                    height: { xs: "36px", md: "40px" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color:
                      step.completed || currentStep.id === step.id
                        ? "#ffa206"
                        : "white",
                    backgroundColor:
                      step.completed || currentStep.id === step.id
                        ? "white"
                        : "transparent",
                    borderColor: "white",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderRadius: "50%",
                    cursor: "not-allowed",
                    opacity:
                      step.completed ||
                      currentStep.id === step.id ||
                      steps.findIndex((s) => s.id === currentStep.id) >=
                        index
                        ? 1
                        : 0.5,
                    margin: { xs: "none", lg: 0 }, // Remove default margin if any
                  }}
                  variant={
                    step.completed || currentStep.id === step.id
                      ? "filled"
                      : "outlined"
                  }
                >
                  {step.completed && currentStep.id !== step.id ? (
                    <CheckIcon
                      sx={{ color: "#ffa206", fontSize: "20px" }}
                    />
                  ) : (
                    step.id
                  )}
                </TimelineDot>
                {index < steps.length - 1 && (
                  <TimelineConnector
                    sx={{
                      backgroundColor: "white",
                      opacity: step.completed ? 1 : 0.5,
                      width: {
                        xs: "26px",
                        md: step.completed ? "2px" : "1px",
                      }, // Horizontal width for mobile
                      height: {
                        xs: step.completed ? "2px" : "1px",
                        md: "40px",
                      }, // Vertical height for large screens
                      flexGrow: 1, // Ensure connector fills space
                    }}
                  />
                )}
              </TimelineSeparator>
              <TimelineContent
                sx={{
                  color: "white",
                  fontWeight:
                    step.completed || currentStep.id === step.id
                      ? "bold"
                      : "normal",
                  opacity:
                    step.completed ||
                    currentStep.id === step.id ||
                    steps.findIndex((s) => s.id === currentStep.id) >= index
                      ? 1
                      : 0.5,
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "not-allowed",
                  }}
                >
                  {step.label}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div> */}
        <div className="flex flex-col w-full">
          {errorMessage && (
            <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
              {errorMessage}
            </div>
          )}
          <div
            className="flex flex-col lg:flex-row items-start gap-14 justify-between w-full"
            ref={topRef}
          >
            {/* <div className="flex flex-col items-start h-full w-full">
            <h2 className="text-2xl font-semibold mb-4">Amount Details</h2>
            <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
            <div className="grid grid-cols-2 justify-around gap-4 mb-4 w-full">
              <div className="flex flex-col gap-1 mb-2">
                <p className="text-lg font-normal">Base Fee </p>
                <h1 className="text-xl font-semibold">
                  {formatCurrency(
                    paymentDetails?.calculatedAmount || 0,
                    paymentDetails?.currency || "INR"
                  )}
                </h1>
              </div>
              {paymentDetails && paymentDetails?.tdsAmount > 0 ? (
                <div className="flex flex-col gap-1 mb-2">
                  <p className="text-lg font-normal">TDS Deduction (-)</p>
                  <h1 className="text-xl font-semibold">
                    {formatCurrency(
                      paymentDetails?.tdsAmount || 0,
                      paymentDetails?.currency || "INR"
                    )}
                  </h1>
                </div>
              ) : null}

              {paymentDetails && paymentDetails?.cgstAmount > 0 ? (
                <div className="flex flex-col gap-1 mb-2">
                  <p className="text-lg font-normal">CGST (9%)</p>
                  <h1 className="text-xl font-semibold">
                    {formatCurrency(
                      paymentDetails?.cgstAmount || 0,
                      paymentDetails?.currency || "INR"
                    )}
                  </h1>
                </div>
              ) : null}

              {paymentDetails && paymentDetails?.sgstAmount > 0 ? (
                <div className="flex flex-col gap-1 mb-2">
                  <p className="text-lg font-normal">SGST (9%)</p>
                  <h1 className="text-xl font-semibold">
                    {formatCurrency(
                      paymentDetails?.sgstAmount || 0,
                      paymentDetails?.currency || "INR"
                    )}
                  </h1>
                </div>
              ) : null}

              {paymentDetails && paymentDetails?.igstAmount > 0 ? (
                <div className="flex flex-col gap-1 mb-2">
                  <p className="text-lg font-normal">IGST (18%)</p>
                  <h1 className="text-xl font-semibold">
                    {formatCurrency(
                      paymentDetails?.igstAmount || 0,
                      paymentDetails?.currency || "INR"
                    )}
                  </h1>
                </div>
              ) : null}

              {paymentDetails && paymentDetails?.totalAmount > 0 ? (
                <div className="flex flex-col gap-1 mb-2">
                  <p className="text-lg font-normal">
                    Total amount post taxes
                  </p>
                  <h1 className="text-xl font-semibold">
                    {formatCurrency(
                      paymentDetails?.totalAmount || 0,
                      paymentDetails?.currency || "INR"
                    )}
                  </h1>
                </div>
              ) : null}
            </div>
          </div> */}
            {/* <hr className="h-full w-[1px] bg-[#B1B1B1] hidden lg:block" />
          <div className="flex flex-col items-start h-full w-full">
            <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
            <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
            <div className="flex flex-col gap-1 mb-4">
              <p className="text-lg font-normal">Company</p>
              <h1 className="text-xl font-semibold">
                {paymentDetails?.companyName}
              </h1>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <p className="text-lg font-normal">Contact Name</p>
              <h1 className="text-xl font-semibold">
                {paymentDetails?.directorName}
              </h1>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <p className="text-lg font-normal">Contact Email </p>
              <h1 className="text-xl font-semibold">
                {paymentDetails?.supportEmail}
              </h1>
            </div>
            {transactions?.billingAddressLine1 && (
              <div className="flex flex-col gap-1 mb-4">
                <p className="text-lg font-normal">Billing Address </p>
                <h1 className="text-xl font-semibold pr-10">
                  {transactions?.billingAddressLine1}
                </h1>
                <h1 className="text-xl font-semibold pr-10">
                  {transactions?.billingAddressLine2}
                </h1>
                <h1 className="text-xl font-semibold pr-10">
                  {transactions?.billingCity},{" "}
                  {transactions?.billingStateProvinceRegion}
                </h1>
                <h1 className="text-xl font-semibold pr-10">
                  {transactions?.billingCountry}
                </h1>
                <h1 className="text-xl font-semibold pr-10">
                  {transactions?.billingPostalCode}
                </h1>
              </div>
            )}
          </div> */}
          </div>
          {/* <hr className="h-full w-[1px] bg-[#B1B1B1] hidden lg:block" /> */}
          <div className="flex flex-col items-start h-full w-full mt-2">
            <h2 className="text-2xl font-semibold mb-2">Payment Stages</h2>
            <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
            <ul className="grid md:grid-cols-2 grid-cols-1 gap-4 w-full">
              <li>
                <strong className="text-lg ">First Payment – 25%</strong>
                <br />
                <span className="text-gray-600">
                  Due By: At the time of booking
                </span>
              </li>
              <li>
                <strong className="text-lg">Second Payment – 25%</strong>
                <br />
                <span className="text-gray-600">
                  Due By: 20 July 2026
                </span>
              </li>
              <li>
                <strong className="text-lg">Third Payment – 25%</strong>
                <br />
                <span className="text-gray-600">
                  Due By: 20 Oct 2026
                </span>
              </li>
              <li>
                <strong className="text-lg">Last Payment – 25%</strong>
                <br />
                <span className="text-gray-600">
                  Due By: 16 Dec 2026
                </span>
              </li>
            </ul>
          </div>

          {/**
         * If exhibitor has allotmentLetter, force full remaining payment
         * by pre-filling maximum unpaid amount and hiding percentage options.
         */}
{exhibitorForm.paidAmount === 0 && getMembershipAmount() > 0 && (
                  <p className="text-sm text-gray-700 mt-6">
                    Note: First installment is selected % of stall amount + full membership amount.
                  </p>
                )}

          {!Boolean(exhibitorForm?.metaData?.data?.allotmentLetter) && (
            <div className="flex flex-col items-start h-full w-full mt-2">
              <h2 className="text-xl font-semibold mb-3">
                How much would you like to pay?
              </h2>
              <hr className="w-full border-t-1 border-gray-300 mb-6" />

              <div className="flex gap-6 w-full lg:w-1/2">
                {(() => {
                  const total = paymentDetails?.totalAmount || 0;
                  const paid = paymentDetails?.paidAmount || 0;
                  const unpaid = total - paid;
                  const paidPercent = total > 0 ? (paid / total) * 100 : 0;
                  const unpaidPercent = total > 0 ? (unpaid / total) * 100 : 0;
                  let options = [];
                  const roundedPaid = Math.round(paidPercent * 100) / 100;
                  const roundedUnpaid = Math.round(unpaidPercent * 100) / 100;
                  if (roundedPaid === 0) {
                    options = [25, 50, 100];
                  } else if (roundedPaid === 25) {
                    options = [25, 50, 75];
                  } else if (roundedPaid === 50) {
                    options = [25, 50];
                  } else if (roundedPaid > 50 && roundedPaid < 100 && roundedUnpaid > 0) {
                    options = [25, roundedUnpaid];
                  } else if (roundedPaid > 25 && roundedPaid < 50) {
                    // Between 25 and 50
                    options = [25, 50, roundedUnpaid];
                  } else if (roundedPaid > 0 && roundedPaid < 25) {
                    // Between 0 and 25
                    options = [25, 50, roundedUnpaid];
                  }
                  return options.map((percentage) => (
                    <label
                      key={percentage}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 accent-[#ffa206] border-gray-300 appearance-auto"
                        value={percentage}
                        checked={Math.round(Number(getValues("percentageLikeToPay"))) === (Math.round(Number(percentage)))}
                        onChange={(e) => {
                          setValue(
                            "percentageLikeToPay",
                            parseInt(e.target.value)
                          );
                          setOnlineAmount(
                            calculateAmountToPay(parseInt(e.target.value))
                          );
                          setValue(
                            "finalAmount",
                            calculateAmountToPay(
                              parseInt(e.target.value)
                            ).toString()
                          );
                        }}
                      />
                      <span className="ml-2 text-lg">{Math.round(percentage)}%</span>
                    </label>
                  ));
                })()}
              </div>
            </div>
          )}

          {watch("percentageLikeToPay") && (
            <div className="flex flex-col items-start h-full w-full mt-6">
              <h2 className="text-xl lg:text-2xl font-semibold mb-3">
                How would you like to Pay?
              </h2>
              <hr className="w-full border-t-1 border-gray-300 mb-6" />

              {/* Option 1: Pay Online */}
              {!isOffline && (
                <div className="w-full bg-white p-4 rounded-lg mb-6">
                  <div className="flex flex-col items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Option 1: Pay Online (Recommended)
                      </h3>
                      <p className="text-sm text-gray-500 my-1">
                        Use UPI, debit/credit card, or net banking, get instant
                        confirmation.
                      </p>
                      <p className="text-sm text-red-500 mb-2">(Payment gateway processing fees for online transactions will be borne by the participant)</p>
                    </div>
                    <div className="flex flex-col sm:flex-row w-full gap-4 justify-between items-center mt-2">
                      <div className="w-full">
                        <input
                          type="number"
                          className={`w-full lg:w-2/2 h-13 border bg-white ${amountError ? "border-red-500" : "border-gray-300"
                            } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffa206]`}
                          // placeholder={
                          //   "Enter amount to pay (min." +
                          //   formatCurrency(
                          //     calculateMinimumAmountToPay()?.minimumAmount || 0,
                          //     paymentDetails?.currency || "INR"
                          //   ) +
                          //   ")"
                          // }
                          // min={
                          //   calculateMinimumAmountToPay()?.minimumAmount || 0
                          // }
                          // max={
                          //   calculateMinimumAmountToPay()?.maximumAmount || 0
                          // }
                          value={onlineAmount}
                          // onChange={(e) => {
                          //   const value = parseFloat(e.target.value);
                          //   if (
                          //     value <
                          //       calculateMinimumAmountToPay()?.minimumAmount ||
                          //     value >
                          //       calculateMinimumAmountToPay()?.maximumAmount
                          //   ) {
                          //     setAmountError(true);
                          //   } else {
                          //     setAmountError(false);
                          //   }
                          //   setOnlineAmount(value);
                          // }}
                          disabled
                        // value={email || ""}
                        />
                      </div>
                      <button
                        onClick={handlePayment}
                        disabled={
                          isPaymentProcessing || amountError || !onlineAmount
                        } // Disable if submitting or details not loaded
                        className={`bg-[#ffa206] w-full sm:w-40 h-11 text-lg text-white rounded-full px-4 py-1 disabled:opacity-50 disabled:cursor-not-allowed 
                  ${amountError
                            ? "cursor-not-allowed"
                            : "cursor-pointer hover:scale-105 duration-300"
                          }
                  `}
                      >
                        {isPaymentProcessing
                          ? "Processing..."
                          : "Pay\u00A0Online"}
                      </button>
                    </div>
                    {/* <div>
                  {amountError && (
                    <p className="text-red-500 text-xs mt-1">
                      Amount must be between{" "}
                      {formatCurrency(
                        calculateMinimumAmountToPay()?.minimumAmount || 0,
                        paymentDetails?.currency || "INR"
                      )}{" "}
                      and{" "}
                      {formatCurrency(
                        calculateMinimumAmountToPay()?.maximumAmount || 0,
                        paymentDetails?.currency || "INR"
                      )}
                    </p>
                  )}
                </div> */}
                  </div>
                  {/* <hr className="w-full border-t-1 border-gray-300" />  */}
                </div>
              )}

              {/* Option 2: Pay Offline */}
              <div className="w-full bg-white p-4 rounded-lg">
                <div
                  className="flex sm:flex-row items-start sm:items-center justify-between cursor-pointer"
                  onClick={() => setShowOfflineForm(!showOfflineForm)}
                >
                  <div>
                    <h3 className="text-lg font-semibold ">
                      {!isOffline && "Option 2:"} Pay Offline
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Submit details of your manual payment (bank transfer,
                      cheque, etc.)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOfflineForm(!showOfflineForm)}
                    className={`border-[#ffa206] border-2 text-xl cursor-pointer rounded-full p-1 hover:scale-105 duration-300 disabled:opacity-50`}
                  >
                    {/* {showOfflineForm ? 'Hide Details' : 'Add Details'} */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transform transition-transform text-[#ffa206] duration-300 ${showOfflineForm ? "rotate-180" : ""
                        }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Offline Payment Form - Conditional Rendering */}
                {showOfflineForm && (
                  <div>
                    {paymentDetails?.currency === 'INR' && (<div className="flex flex-col gap-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                        <label
                          htmlFor="ifscCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Enter your IFSC Code:*
                        </label>
                        <input
                          type="text"
                          id="ifscCode"
                          {...register("ifscCode", {
                            onChange: (e) => {
                              const value = e.target.value.toUpperCase();
                              setIfscCode(value);
                            },
                          })}
                          className={`mt-1 block w-full lg:w-80 px-3 py-2 border ${errors.ifscCode
                            ? "border-red-500"
                            : "border-gray-300"
                            } h-13 rounded-sm focus:outline-none focus:ring-[#ffa206] focus:border-[#ffa206] sm:text-sm`}
                          placeholder="e.g., HDFC0000313"
                        />
                        <button
                          onClick={handleVerifyIFSC}
                          disabled={ifscCode.length != 11}
                          type="button"
                          className={`bg-[#ffa206] text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${isLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105 duration-300"
                            }`}
                        >
                          {isLoading ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                      {errors.ifscCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.ifscCode.message}
                        </p>
                      )}
                      {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                      )}
                      {ifscLoading && (
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ffa206]"></div>
                          <p className="mt-2 text-sm text-gray-600">
                            Verifying...
                          </p>
                        </div>
                      )}
                      {isIfscCalledOnce === false ? null : !ifscLoading &&
                        ifscData?.valid ? (
                        <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
                          <h3 className="text-lg font-semibold mb-2">
                            Your IFSC Details:
                          </h3>
                          <p>
                            <strong>Bank Name:</strong> {ifscData?.bank}
                          </p>
                          <p>
                            <strong>Branch:</strong> {ifscData?.branch}
                          </p>
                          <p>
                            <strong>Address:</strong> {ifscData?.address}
                          </p>
                          <p>
                            <strong>City:</strong> {ifscData?.city}
                          </p>
                          <p>
                            <strong>State:</strong> {ifscData?.state}
                          </p>
                        </div>
                      ) : !ifscLoading &&
                        isIfscCalledOnce &&
                        !ifscData?.valid ? (
                        <div className="mt-4 p-4 border border-red-300 rounded-md bg-red-50">
                          <h3 className="text-lg font-semibold mb-2 text-red-600">
                            Invalid IFSC Code
                          </h3>
                          <p>Please check the IFSC code and try again.</p>
                        </div>
                      ) : null}
                    </div>)}
                    <div className="text-sm mt-4">
                      All the payments related to participation in the
                      exhibition must bemade favoring “IFEX
                      Trade Federation”in one of the following ways:
                      <br />
                      <div className="ml-4 mt-2">a) By Online
                        Payment Gateway/NEFT/RTGS to our current account number:
                        Payment to be remitted in favour of :</div>
                    </div>
                    <div className="border-b border-gray-200 p-4 rounded-lg bg-gray-50 lg:w-3/3 my-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Bank Transfer Details
                      </h3>
                      <div className="flex flex-col gap-4">
                        <span className="text-xs text-end text-gray-600">
                          Click below to copy the details
                        </span>
                        {/* Account Number */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Beneficiary&nbsp;Name:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              IFEX TRADE FEDERATION
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard
                                  .writeText("IFEX TRADE FEDERATION")
                                  .then(() => {
                                    enqueueSnackbar(
                                      "Beneficiary Name copied to clipboard",

                                      { variant: "success" });
                                  });
                              }}
                              className="text-sm text-blue-500 hover:underline"
                            >
                              <ContentCopyIcon
                                sx={{
                                  color: "#ffa206",
                                  cursor: "pointer",
                                }}
                                fontSize="small"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Account&nbsp;Number:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              50100760494691
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard
                                  .writeText("50100760494691")
                                  .then(() => {
                                    enqueueSnackbar(
                                      "Account Number copied to clipboard",
                                      { variant: "success" });
                                  });
                              }}
                              className="text-sm text-blue-500 hover:underline"
                            >
                              <ContentCopyIcon
                                sx={{
                                  color: "#ffa206",
                                  cursor: "pointer",
                                }}
                                fontSize="small"
                              />
                            </button>
                          </div>
                        </div>

                        {/* Bank Name */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Bank&nbsp;Name:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              HDFC Bank
                            </span>
                            <button
                              onClick={() =>
                                navigator.clipboard
                                  .writeText("HDFC Bank")
                                  .then(() => {
                                    enqueueSnackbar(
                                      "Bank Name copied to clipboard",
                                      { variant: "success" });
                                  })
                              }
                              className="text-sm text-blue-500 hover:underline"
                            >
                              <ContentCopyIcon
                                sx={{
                                  color: "#ffa206",
                                  cursor: "pointer",
                                }}
                                fontSize="small"
                              />
                            </button>
                          </div>
                        </div>

                        {/* IFSC Code */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            IFSC Code:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              HDFC0000313
                            </span>
                            <button
                              onClick={() =>
                                navigator.clipboard
                                  .writeText("HDFC0000313")
                                  .then(() => {
                                    enqueueSnackbar(
                                      "IFSC Code copied to clipboard",
                                      { variant: "success" });
                                  })
                              }
                              className="text-sm text-blue-500 hover:underline"
                            >
                              <ContentCopyIcon
                                sx={{
                                  color: "#ffa206",
                                  cursor: "pointer",
                                }}
                                fontSize="small"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            GST NUMBER:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              07AAMCB8961G1Z9
                            </span>
                            <button
                              onClick={() =>
                                navigator.clipboard
                                  .writeText("07AAMCB8961G1Z9")
                                  .then(() => {
                                    enqueueSnackbar(
                                      "GST NUMBER copied to clipboard",
                                      { variant: "success" });
                                  })
                              }
                              className="text-sm text-blue-500 hover:underline"
                            >
                              <ContentCopyIcon
                                sx={{
                                  color: "#ffa206",
                                  cursor: "pointer",
                                }}
                                fontSize="small"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            PAN NUMBER:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              AAMCB8961G
                            </span>
                            <button
                              onClick={() =>
                                navigator.clipboard
                                  .writeText("AAMCB8961G")
                                  .then(() => {
                                    enqueueSnackbar(
                                      "PAN NUMBER copied to clipboard",
                                      { variant: "success" });
                                  })
                              }
                              className="text-sm text-blue-500 hover:underline"
                            >
                              <ContentCopyIcon
                                sx={{
                                  color: "#ffa206",
                                  cursor: "pointer",
                                }}
                                fontSize="small"
                              />
                            </button>
                          </div>
                        </div>


                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            TAN NUMBER:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              DELB29178C
                            </span>
                            <button
                              onClick={() =>
                                navigator.clipboard
                                  .writeText("DELB29178C")
                                  .then(() => {
                                    enqueueSnackbar(
                                      "GST NUMBER copied to clipboard",
                                      { variant: "success" });
                                  })
                              }
                              className="text-sm text-blue-500 hover:underline"
                            >
                              <ContentCopyIcon
                                sx={{
                                  color: "#ffa206",
                                  cursor: "pointer",
                                }}
                                fontSize="small"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form
                      onSubmit={handleSubmit(handleOfflinePaymentSubmit)}
                      className="mt-6 pt-4 border-t border-gray-200"
                    >
                      <div className="space-y-4">
                        <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col lg:flex-row gap-5 lg:items-center">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selected Payment Method:
                              </label>
                              <div className="flex flex-wrap gap-x-6 gap-y-3">
                                {(
                                  [
                                    "bank_transfer",
                                    "cheque",
                                    "UPI",
                                    "demand_draft",
                                  ] as const
                                ).map((mode) => (
                                  <label
                                    key={mode}
                                    className="inline-flex items-center"
                                  >
                                    <input
                                      type="radio"
                                      {...register("paymentMode")}
                                      value={mode}
                                      className="form-radio h-4 w-4 text-[#ffa206] focus:ring-[#ffa206] border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-600 capitalize">
                                      {mode?.replace("_", " ")}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            {errors.paymentMode && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.paymentMode.message}
                              </p>
                            )}
                            <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-2">
                                  <div className="mb-4 w-full md:w-1/2">
                                    <label
                                      htmlFor="orderId"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Enter&nbsp;Transaction&nbsp;ID:
                                    </label>
                                    <input
                                      type="text"
                                      id="orderId"
                                      {...register("orderId")}
                                      className="mt-1 block w-full lg:w-80 px-3 py-2 border border-gray-300 h-13 rounded-sm focus:outline-none focus:ring-[#ffa206] focus:border-[#ffa206] sm:text-sm"
                                      placeholder="e.g., UTR No, Cheque No."
                                    />
                                    {errors.orderId && (
                                      <p className="text-red-500 text-xs mt-1">
                                        {errors.orderId.message}
                                      </p>
                                    )}
                                  </div>

                                  <div className="mb-4 w-full md:w-1/2">
                                    <label
                                      htmlFor="transactionDate"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Enter&nbsp;Transaction&nbsp;Date:
                                    </label>
                                    <input
                                      type="date"
                                      id="transactionDate"
                                      {...register("transactionDate")}
                                      className="mt-1 block w-full lg:w-80 px-3 py-2 border border-gray-300 h-13 rounded-sm focus:outline-none focus:ring-[#ffa206] focus:border-[#ffa206] sm:text-sm"
                                      placeholder="e.g., UTR No, Cheque No."
                                      max={
                                        watchedPaymentMode !== "cheque"
                                          ? today
                                          : undefined
                                      }
                                    />
                                    {errors.transactionDate && (
                                      <p className="text-red-500 text-xs mt-1">
                                        {errors.transactionDate.message}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-2">
                                  <div className="mb-4 w-full md:w-1/2">
                                    <label
                                      htmlFor="confirmOrderId"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Confirm&nbsp;Transaction&nbsp;ID:
                                    </label>
                                    <input
                                      type="text"
                                      id="confirmOrderId"
                                      {...register("confirmOrderId")}
                                      className="mt-1 w-full lg:w-80 px-3 py-2 border border-gray-300 h-13 rounded-sm focus:outline-none focus:ring-[#ffa206] focus:border-[#ffa206] sm:text-sm"
                                      placeholder="e.g., UTR No, Cheque No."
                                    />
                                    {errors.confirmOrderId && (
                                      <p className="text-red-500 text-xs mt-1">
                                        {errors.confirmOrderId.message}
                                      </p>
                                    )}
                                  </div>
                                  <div className="mb-4 w-full md:w-1/2">
                                    <label
                                      htmlFor="orderId"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Payment&nbsp;Amount:
                                    </label>
                                    <input
                                      type="text"
                                      id="finalAmount"
                                      {...register("finalAmount")}
                                      className="mt-1 block w-full lg:w-80 px-3 py-2 border border-gray-300 h-13 rounded-sm focus:outline-none focus:ring-[#ffa206] focus:border-[#ffa206] sm:text-sm"
                                      // placeholder={
                                      //   "Enter amount to pay (min." +
                                      //   formatCurrency(
                                      //     calculateMinimumAmountToPay()
                                      //       ?.minimumAmount || 0,
                                      //     paymentDetails?.currency || "INR"
                                      //   ) +
                                      //   ")"
                                      // }
                                      // min={
                                      //   calculateMinimumAmountToPay()
                                      //     ?.minimumAmount || 0
                                      // }
                                      // max={
                                      //   calculateMinimumAmountToPay()
                                      //     ?.maximumAmount || 0
                                      // }
                                      disabled
                                    />

                                    {errors.finalAmount && (
                                      <p className="text-red-500 text-xs mt-1">
                                        {errors.finalAmount.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-2">
                                  <FileUploadBox
                                    label="Upload Proof of Payment"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    error={!!errors.proofUrl}
                                    helperText="Supported formats: PDF, PNG, JPG, JPEG (Max 5MB)"
                                    preview={watch("proofUrl")}
                                    errorMessage={errors.proofUrl?.message}
                                    onDelete={() => {
                                      setValue("proofUrl", "");
                                    }}
                                    onChange={(fileUrl) => {
                                      setValue("proofUrl", fileUrl);
                                      trigger("proofUrl");
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={
                            isSubmitting || paymentStatus === "pending"
                          }
                          className={`bg-white w-full lg:w-40 h-11 self-end text-lg text-[#ffa206] border-[#ffa206] border rounded-full px-4 py-1 ${paymentStatus === "pending"
                            ? "cursor-not-allowed disabled:opacity-50"
                            : "cursor-pointer hover:scale-105 duration-300"
                            } `}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog
      fullWidth
      fullScreen
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'background.neutral',
          px: 4,
          py: 4,
        },
        py: { xs: 2, md: 10 },
        px: { xs: 2, md: 20 },
      }}
    >
      {renderContent}
    </Dialog>
  );
}
