'use client';

const formulae = [
    {
        subject: 'Business (9609)',
        items: [
            { name: 'Gross Profit Margin', formula: '(Gross Profit / Revenue) × 100', meaning: 'Measures profitability before overheads. High is better.' },
            { name: 'Net Profit Margin', formula: '(Net Profit / Revenue) × 100', meaning: 'Measures overall profitability after all expenses. High is better.' },
            { name: 'Return on Capital Employed (ROCE)', formula: '(Operating Profit / Capital Employed) × 100', meaning: 'Measures efficiency of capital use. Capital Employed = Non-current liabilities + Total equity.' },
            { name: 'Current Ratio', formula: 'Current Assets / Current Liabilities', meaning: 'Measures short-term liquidity. Ideal is 1.5 - 2.0.' },
            { name: 'Acid Test (Quick) Ratio', formula: '(Current Assets - Inventory) / Current Liabilities', meaning: 'Measures immediate liquidity without relying on stock sales. Ideal is 1.0.' },
            { name: 'Inventory Turnover', formula: 'Cost of Sales / Average Inventory', meaning: 'Measures how many times stock is sold and replaced per year.' },
            { name: 'Days Sales in Receivables (Debtor Days)', formula: '(Trade Receivables / Credit Sales) × 365', meaning: 'Average time taken to collect cash from credit customers.' },
            { name: 'Gearing Ratio', formula: '(Non-current Liabilities / Capital Employed) × 100', meaning: 'Measures financial risk. >50% is highly geared (high risk).' },
            { name: 'Price Elasticity of Demand (PED)', formula: '% change in Quantity Demanded / % change in Price', meaning: 'Measures responsiveness of demand to a price change.' },
            { name: 'Income Elasticity of Demand (YED)', formula: '% change in Quantity Demanded / % change in Income', meaning: 'Measures responsiveness of demand to consumer income changes.' },
            { name: 'Straight-line Depreciation', formula: '(Original Cost - Expected Residual Value) / Expected Useful Life', meaning: 'Calculates the annual drop in value of a fixed asset evenly over time.' },
            { name: 'Net Present Value (NPV)', formula: 'Sum of (Net Cash Flows × Discount Factors) - Initial Capital Cost', meaning: 'If NPV > 0, the investment is theoretically profitable over its lifetime.' },
        ]
    },
    {
        subject: 'Economics (9708)',
        items: [
            { name: 'Multiplier (k)', formula: '1 / (1 - MPC)  OR  1 / MPW', meaning: 'Measures how much national income changes following an initial injection. MPW = MPS + MPT + MPM.' },
            { name: 'GDP (Expenditure Method)', formula: 'C + I + G + (X - M)', meaning: 'Total components of aggregate demand.' },
            { name: 'Real GDP', formula: '(Nominal GDP / Price Index) × 100', meaning: 'GDP adjusted for inflation to show true volume of output.' },
            { name: 'Unemployment Rate', formula: '(Number of Unemployed / Labour Force) × 100', meaning: 'Percentage of the active labour force without a job.' },
            { name: 'Inflation Rate', formula: '((Current CPI - Previous CPI) / Previous CPI) × 100', meaning: 'Annual percentage change in the general price level.' },
            { name: 'Cross Elasticity of Demand (XED)', formula: '% change in Qd of Good A / % change in Price of Good B', meaning: 'Positive = Substitutes. Negative = Complements. Zero = Unrelated.' },
            { name: 'Price Elasticity of Supply (PES)', formula: '% change in Quantity Supplied / % change in Price', meaning: 'Always positive. >1 is elastic, <1 is inelastic.' },
        ]
    }
];

export default function FormulaeView() {
    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--lime-dark)', fontFamily: 'var(--font-playfair)' }}>📐 Key Formulae</h2>
                <p style={{ color: '#666' }}>Essential equations for Business & Economics</p>
            </div>

            <div style={{ display: 'grid', gap: '30px' }}>
                {formulae.map(subject => (
                    <div key={subject.subject}>
                        <h3 style={{ fontFamily: 'var(--font-playfair)', color: '#1e293b', borderBottom: '2px solid var(--lime-primary)', paddingBottom: '10px', marginBottom: '20px' }}>
                            {subject.subject}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '15px' }}>
                            {subject.items.map((item, idx) => (
                                <div key={idx} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                                    <h4 style={{ margin: '0 0 12px 0', color: 'var(--lime-dark)', fontSize: '1.05rem' }}>{item.name}</h4>
                                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#334155', marginBottom: '12px', textAlign: 'center', userSelect: 'all', border: '1px dashed #cbd5e1' }}>
                                        {item.formula}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                                        {item.meaning}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
