import { forwardRef } from 'react';

const Receipt = forwardRef<
  HTMLDivElement,
  {
    exhibitorName: string;
    exhibitorCount: string;
    address: {
      line1: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    boothType: string;
    gstNumber: string;
    email: string;
    totalAreaRequired: number | string;
    totalAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    totalAfterTax: number;
    purchaseId: string;
    numberToWords: (num: number) => string;
  }
>((props, ref) => {
  // Helper for UP state check (case-insensitive, trims whitespace)

  const isUP = props.address.state && props.address.state.trim().toLowerCase() === 'uttar pradesh';

  return (
    <div
      ref={ref}
      className="performaInvoice absolute -left-[10000rem] w-[210mm] h-[297mm] mx-auto bg-white p-4 text-xs"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="h-16 w-32">
          <img
            src="/performa_logo.png"
            alt="UP International Trade Show Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-right">
          <h1 className="text-base font-bold">UP International Trade Show 2025</h1>
          <p className="text-sm pt-1">India Exposition Mart LTD</p>
        </div>
      </div>

      {/* Address */}
      <div className="text-right text-[11px] mb-1">
        PLOT NO.- 25-26, 27-28, KNOWLEDGE PARK - II, DISTRICT GAUTAM BUDHA NAGAR, GREATER NOIDA -
        201306, UTTAR PRADESH, INDIA
      </div>
      <div className="text-right text-[11px] mb-1">
        AMIT SHARMA || +91-9667391298 || ACCOUNT@INDIAEXPOCENTRE.COM
      </div>
      <div className="text-right text-[11px] mb-6">
        PAN NO.: AAACI5873M | GSTIN: 09AAACI5873M1ZR
      </div>

      <hr className="border-black mb-2" />

      {/* Title */}
      <div className="text-center mb-5">
        <h2 className="text-lg font-bold">ADVANCE RECEIPT VOUCHER</h2>
      </div>

      <hr className="border-black mb-3" />

      {/* Exhibitor Details */}
      <div className="mb-2">
        <h3 className="text-base font-bold mb-3">Exhibitor Details</h3>

        <div className="grid grid-cols-2 gap-x-28 text-sm mb-4">
          <div>
            <p>
              <span>Name :</span> {props.exhibitorName}
            </p>
          </div>
          <div>
            <p>
              <span>Voucher No :</span> UP2025/SPC/ES/{props.purchaseId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-28 text-sm mb-4">
          <div>
            <p>
              <span>Address :</span> {props.address.line1}, {props.address.city},{' '}
              {props.address.state}, {props.address.country}, {props.address.postalCode}
            </p>
          </div>
          <div>
            <p>
              <span>Date :</span>{' '}
              {new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-28 text-sm mb-4">
          <div>
            <p>
              <span>City :</span> {props.address.city}
            </p>
          </div>
          <div>
            <p>
              <span>SAC/HSNCode :</span> 998596
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-28 text-sm mb-4">
          <div>
            <p>
              <span>Pincode :</span> {props.address.postalCode}
            </p>
          </div>
          <div>
            <p>
              <span>StallType :</span>{' '}
              {props.boothType === 'pre_fitted' ? 'Pre Fitted' : 'Space Only'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-28 text-sm mb-4">
          <div>
            <p>
              <span>State : </span>
              {props.address.state}
            </p>
          </div>
          <div>
            <p>
              <span>Total Area :</span> {props.totalAreaRequired} sq m
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-28 text-sm mb-4">
          <div className="text-sm">
            <p>
              <span>GST NO :</span> {props.gstNumber}
            </p>
          </div>
          <div>
            <p>
              <span>Email :</span> {props.email}
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="my-6 overflow-auto">
        <table className="w-full border-collapse text-xs bg-white">
          <thead>
            <tr className="">
              <th className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-left text-xs font-bold">
                Description
              </th>
              <th className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold">
                Taxable Value
              </th>
              <th
                className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold"
                colSpan={2}
              >
                CGST
              </th>
              <th
                className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold"
                colSpan={2}
              >
                SGST
              </th>
              <th
                className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold"
                colSpan={2}
              >
                IGST
              </th>
              <th className="border-t border-b border-r border-black px-1 pt-2 pb-4 text-center text-xs font-bold">
                Total Tax
              </th>
              <th className="border-t border-b border-black px-1 pt-2 pb-4 text-center text-xs font-bold">
                Total
              </th>
            </tr>

            <tr className="text-xs">
              <th className="border-b border-black px-1 py-1 border-r"></th>
              <th className="border-b border-black px-1 py-1 border-r"></th>
              <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                Rate
              </th>
              <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                Amt
              </th>
              <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                Rate
              </th>
              <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                Amt
              </th>
              <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                Rate
              </th>
              <th className="border-b border-black px-1 pt-1 pb-3 border-r text-center text-xs font-bold">
                Amt
              </th>
              <th className="font-bold text-xs border-b border-black px-1 pt-1 pb-3 border-r">
                (INR)
              </th>
              <th className="font-bold text-xs border-b border-black px-1 pt-1 pb-3">(INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-xs">
              <td className="border-b border-black px-1 pt-2 pb-4 border-r">Space Rent</td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {props.totalAmount.toFixed(2)}
              </td>
              {/* CGST */}
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {isUP ? '9.0%' : '0.0'}
              </td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {isUP ? props.cgstAmount.toFixed(2) : '0.00'}
              </td>
              {/* SGST */}
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {isUP ? '9.0%' : '0.0'}
              </td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {isUP ? props.sgstAmount.toFixed(2) : '0.00'}
              </td>
              {/* IGST */}
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {isUP ? '0.0' : '18.0%'}
              </td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {isUP ? '0.00' : props.igstAmount.toFixed(2)}
              </td>
              {/* Total Tax */}
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {(props.cgstAmount + props.sgstAmount + props.igstAmount).toFixed(2)}
              </td>
              {/* Total */}
              <td className="border-b border-black px-1 pt-2 pb-4 text-center">
                {props.totalAfterTax.toFixed(2)}
              </td>
            </tr>

            <tr className="text-xs">
              <td className="border-b border-black px-1 pt-2 pb-4">Total</td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center">
                {props.totalAmount.toFixed(2)}
              </td>
              <td className="border-b border-black px-1 pt-2 pb-4 border-r"></td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {isUP ? props.cgstAmount.toFixed(2) : '0.00'}
              </td>
              <td className="border-b border-black px-1 pt-2 pb-4 border-r"></td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {isUP ? props.sgstAmount.toFixed(2) : '0.00'}
              </td>
              <td className="border-b border-black px-1 pt-2 pb-4 border-r"></td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {isUP ? '0.00' : props.igstAmount.toFixed(2)}
              </td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center border-r">
                {(props.cgstAmount + props.sgstAmount + props.igstAmount).toFixed(2)}
              </td>
              <td className="border-b border-black px-1 pt-2 pb-4 text-center">
                {props.totalAfterTax.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex-1 pr-4">
          <div className="text-xs">
            <p className="font-medium">Total Amount After Tax In Words:</p>
            <p>{props.numberToWords(Math.round(props.totalAfterTax))}</p>
          </div>
        </div>

        <div className="w-60">
          <div className="text-xs space-y-1">
            <div className="flex justify-between border-b pb-4">
              <span>Total Amount Before Tax</span>
              <span>{props.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3">
              <span>Add CGST</span>
              <span>{isUP ? props.cgstAmount.toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between pt-3">
              <span>Add SGST</span>
              <span>{isUP ? props.sgstAmount.toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between py-3">
              <span>Add IGST</span>
              <span>{isUP ? '0.00' : props.igstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-black pt-3">
              <span>Total Amount After Tax</span>
              <span>{props.totalAfterTax.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-start mb-6">
        <p className="text-xs">For UP International Trade Show 2025</p>
      </div>

      <div className="flex justify-start gap-28 items-end mt-8">
        <div className="text-center">
          <div className="mb-2">
            <img src="/signature.png" alt="Signature" className="h-16 mx-auto" />
          </div>
          <div className="pt-1">
            <p className="font-bold text-sm">AUTHORIZED SIGNATURE</p>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-2 h-12"></div>
          <div className="pt-1">
            <p className="font-bold text-sm">STAMP</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Receipt;
