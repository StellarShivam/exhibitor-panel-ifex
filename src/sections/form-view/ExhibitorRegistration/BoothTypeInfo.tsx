// Color palette from global.css
const colors = {
    primary: '#ffa201',
    accent: '#d22027',
    accentLight: '#febd1f',
    textMuted: '#6B7280',
    textDefault: '#374151',
    border: '#521D49',
    borderStrong: '#9CA3AF',
    white: '#ffffff',
};

export function BoothTypeInfo() {
    return (
        <div style={{ width: '100%' }} className="space-y-4">
            {/* ── Standard Facilities: Shell Scheme ──────────────────────── */}
            <div>
                <h2 style={{
                    fontWeight: 600,
                    backgroundColor: colors.accent,
                    color: colors.white,
                    padding: '8px',
                    marginBottom: '8px'
                }}>
                    Standard Facilities : Shell Scheme
                </h2>
                <p style={{
                    marginBottom: '12px',
                    color: colors.textDefault,
                    fontSize: '14px'
                }}>
                    All the Shell Scheme Exhibitors would be entitled for the
                    following facilities as per their stall size.
                </p>
                <div style={{
                    width: '100%',
                    overflowX: 'auto',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        border: `1px solid ${colors.borderStrong}`,
                        fontSize: '14px',
                        backgroundColor: colors.white
                    }}>
                        <thead>
                            <tr>
                                {[
                                    "Area(sqm)", "Table", "Chairs", "Spot Lights",
                                    "5A Plug Point", "Waste Basket", "Carpet",
                                    "Invitation Cards", "Exhibitor Badges",
                                    "Fascia Name", "Additional Furniture",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            border: `1px solid ${colors.borderStrong}`,
                                            padding: '8px',
                                            backgroundColor: colors.primary,
                                            color: colors.white,
                                            textAlign: 'left',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 600
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: colors.white }}>
                            {[
                                { range: "12 to 16", table: 1, chairs: 2, spots: 3,  plug: 1, basket: 1, inv: 250, badges: 3  },
                                { range: "18 to 25", table: 2, chairs: 4, spots: 6,  plug: 2, basket: 1, inv: 250, badges: 6  },
                                { range: "27 to 35", table: 3, chairs: 6, spots: 9,  plug: 3, basket: 1, inv: 250, badges: 9  },
                                { range: "36 or 36+", table: 4, chairs: 8, spots: 12, plug: 4, basket: 1, inv: 250, badges: 12 },
                            ].map((row, i) => (
                                <tr key={row.range}>
                                    <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px', whiteSpace: 'nowrap' }}>{row.range}</td>
                                    <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px' }}>{row.table}</td>
                                    <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px' }}>{row.chairs}</td>
                                    <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px' }}>{row.spots}</td>
                                    <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px' }}>{row.plug}</td>
                                    <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px' }}>{row.basket}</td>
                                    {i === 0 && (
                                        <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px', textAlign: 'center' }} rowSpan={4}>
                                            As Per Area
                                        </td>
                                    )}
                                    <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px' }}>{row.inv}</td>
                                    <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px' }}>{row.badges}</td>
                                    {i === 0 && (
                                        <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px' }} rowSpan={4}>
                                            Upto 24 Characters – One side
                                        </td>
                                    )}
                                    {i === 0 && (
                                        <td style={{ border: `1px solid ${colors.borderStrong}`, padding: '8px' }} rowSpan={4}>
                                            Available with extra charges
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── General Facility Bare Space ────────────────────────────── */}
            <div>
                <h2 style={{
                    fontWeight: 600,
                    backgroundColor: colors.accent,
                    color: colors.white,
                    padding: '8px',
                    marginBottom: '8px'
                }}>
                    General Facility Bare Space
                </h2>
                <p style={{
                    color: colors.textDefault,
                    fontSize: '14px'
                }}>
                    This comprises of General Facility only. Exhibitors will
                    have to construct their own designed stall in the allocated
                    space.
                </p>
            </div>

            {/* ── Stall Fabrication & Design ─────────────────────────────── */}
            {/* <div>
                <h2 style={{
                    fontWeight: 600,
                    backgroundColor: colors.accent,
                    color: colors.white,
                    padding: '8px',
                    marginBottom: '8px'
                }}>
                    Stall Fabrication &amp; Design
                </h2>
                <p style={{
                    color: colors.textDefault,
                    fontSize: '14px'
                }}>
                    Exhibitor to please take a note that your stall
                    Fabricator/designer has to pay a refundable deposit of ₹
                    100/- per sqm. at the time of possession of stall.
                </p>
            </div> */}
        </div>
    );
}
