interface PriceTableProps {
  overseas?: boolean;
}

const PriceTable = ({ overseas = false }: PriceTableProps) => {
  const domesticPricingData = [
    {
      boothType: "Shell Scheme – Ground Floor (One Side)",
      rate: "₹ 11,000/sqm + Taxes",
      conditions: "Standard rate",
    },
    {
      boothType: "Shell Scheme – Upper Floor (One Side)",
      rate: "₹ 8,500/sqm + Taxes",
      conditions: "Standard rate",
    },
    {
      boothType: "Ground / Upper Floor (Two Side Open)",
      rate: "+ 15% additional on total space cost",
      conditions: "Applied after base calculation",
    },
    {
      boothType: "Ground / Upper Floor (Three Side Open)",
      rate: "+ 25% additional on total space cost",
      conditions: "Applied after base calculation",
    },
    {
      boothType: "Island Booth (4 Side Open) (Min. 150 sqm)",
      rate: "₹ 20,000/sqm + Taxes",
      conditions: "Priority to sponsors",
    },
    // {
    //   boothType: "Bare Space",
    //   rate: "₹ 500/sqm less than shell scheme rate",
    //   conditions: "Same additional % rules apply for sides",
    // },
  ];

  const overseasPricingData = [
    {
      boothType: "Standard Booth (One Side – Shell or Bare)",
      rate: "USD 250/sqm + Taxes",
      notes: "Subject to availability",
    },
    {
        boothType: "Ground / Upper Floor (Two Side Open)",
        rate: "+ 15% additional on total space cost",
        notes: "Applied after base calculation",
      },
      {
        boothType: "Ground / Upper Floor (Three Side Open)",
        rate: "+ 25% additional on total space cost",
        notes: "Applied after base calculation",
      },
  ];

  if (overseas) {
    return (
      <div className="w-full overflow-auto my-6">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="border border-black px-4 py-3 text-left text-sm font-semibold bg-gray-50">
                Booth Type
              </th>
              <th className="border border-black px-4 py-3 text-left text-sm font-semibold bg-gray-50">
                Rate (per sqm)
              </th>
              <th className="border border-black px-4 py-3 text-left text-sm font-semibold bg-gray-50">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {overseasPricingData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-black px-4 py-3 text-sm">
                  {row.boothType}
                </td>
                <td className="border border-black px-4 py-3 text-sm">
                  {row.rate}
                </td>
                <td className="border border-black px-4 py-3 text-sm">
                  {row.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto my-6">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="border border-black px-4 py-3 text-left text-sm font-semibold bg-gray-50">
              Booth Type / Location
            </th>
            <th className="border border-black px-4 py-3 text-left text-sm font-semibold bg-gray-50">
              Rate (per sqm)
            </th>
            <th className="border border-black px-4 py-3 text-left text-sm font-semibold bg-gray-50">
              Additional Conditions
            </th>
          </tr>
        </thead>
        <tbody>
          {domesticPricingData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-black px-4 py-3 text-sm">
                {row.boothType}
              </td>
              <td className="border border-black px-4 py-3 text-sm">
                {row.rate}
              </td>
              <td className="border border-black px-4 py-3 text-sm">
                {row.conditions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceTable;
