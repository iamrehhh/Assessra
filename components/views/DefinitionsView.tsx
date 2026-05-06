'use client';

import { useState } from 'react';

const definitions = {
    'Business (9609)': [
        { term: 'Economies of Scale', def: 'Factors that cause average costs of production to fall as the scale of operation increases.' },
        { term: 'Diseconomies of Scale', def: 'Factors that cause average costs of production to rise when the scale of operation increases beyond a certain point.' },
        { term: 'Added Value', def: 'The difference between the selling price of a product and the cost of the raw materials used to make it.' },
        { term: 'Opportunity Cost', def: 'The benefit of the next best alternative given up when making a choice.' },
        { term: 'Working Capital', def: 'The capital needed to pay for raw materials, day-to-day running costs and credit offered to customers. (Current Assets - Current Liabilities).' },
        { term: 'Liquidity', def: 'The ability of a firm to pay its short-term debts.' },
        { term: 'Product Life Cycle', def: 'The pattern of sales of a product over time: development, introduction, growth, maturity, decline.' },
        { term: 'Corporate Social Responsibility (CSR)', def: 'The concept that businesses should consider the interests of society in their activities and decisions, beyond the legal obligations.' },
        { term: 'Market Segmentation', def: 'Identifying different segments within a market and targeting different products or services to them.' },
        { term: 'Price Skimming', def: 'Setting a high price for a new product when a firm has a unique or highly differentiated product with low price elasticity of demand.' },
        { term: 'Penetration Pricing', def: 'Setting a relatively low price often supported by strong promotion in order to achieve a high volume of sales.' },
        { term: 'Multinational Business', def: 'A business organization that has its headquarters in one country, but with operating branches, factories and assembly plants in other countries.' },
    ],
    'Economics (9708)': [
        { term: 'Allocative Efficiency', def: 'Occurs when resources are distributed in a way that maximizes consumer satisfaction; price equals marginal cost (P = MC).' },
        { term: 'Productive Efficiency', def: 'Producing output at the lowest possible average cost (lowest point on the AC curve).' },
        { term: 'Public Good', def: 'A good that is non-excludable (cannot stop non-payers from consuming) and non-rivalrous (consumption by one does not reduce availability for others).' },
        { term: 'Merit Good', def: 'A good with positive externalities that would be under-consumed in a free market due to information failure (e.g., education, healthcare).' },
        { term: 'Comparative Advantage', def: 'The ability of a country to produce a good at a lower opportunity cost than another country.' },
        { term: 'Absolute Advantage', def: 'The ability of a country to produce more of a good using the same resources relative to another country.' },
        { term: 'Fiscal Policy', def: 'Changes in government spending and taxation to influence the level of aggregate demand in the economy.' },
        { term: 'Monetary Policy', def: 'Changes in interest rates, exchange rates, or the money supply by the central bank to influence the level of aggregate demand.' },
        { term: 'Supply-side Policy', def: 'Government policies designed to increase the productive capacity of the economy and shift the LRAS curve to the right.' },
        { term: 'Terms of Trade', def: 'The ratio of export prices to import prices. (Index of export prices / Index of import prices) * 100.' },
        { term: 'J-Curve Effect', def: 'The observation that after a currency depreciation, the trade balance initially worsens before it improves, due to inelastic demand in the short run.' },
        { term: 'Marshall-Lerner Condition', def: 'A depreciation of a currency will only improve the current account balance if the sum of the price elasticities of demand for imports and exports is greater than 1 (|PEDx| + |PEDm| > 1).' },
    ]
};

export default function DefinitionsView() {
    const [activeTab, setActiveTab] = useState('Business (9609)');
    const [searchTerm, setSearchTerm] = useState('');

    const currentDefs = definitions[activeTab].filter(d =>
        d.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.def.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--lime-dark)', fontFamily: 'var(--font-playfair)' }}>📚 Key Definitions</h2>
                <p style={{ color: '#666' }}>Search terminology required for full marks.</p>
            </div>

            {/* Subject Tabs */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '25px' }}>
                {Object.keys(definitions).map(subject => (
                    <button
                        key={subject}
                        onClick={() => { setActiveTab(subject); setSearchTerm(''); }}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '25px',
                            border: 'none',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: activeTab === subject ? 'var(--lime-primary)' : '#e2e8f0',
                            color: activeTab === subject ? 'white' : '#64748b',
                            transition: '0.2s',
                        }}
                    >
                        {subject}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div style={{ maxWidth: '600px', margin: '0 auto 30px auto' }}>
                <input
                    type="text"
                    placeholder={`Search ${activeTab} definitions...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        fontSize: '1rem',
                        outline: 'none',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    }}
                />
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {currentDefs.length > 0 ? (
                    currentDefs.map((item, idx) => (
                        <div key={idx} style={{ background: 'white', borderRadius: '12px', padding: '20px', borderLeft: '4px solid var(--lime-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.1rem' }}>{item.term}</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>{item.def}</p>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#aaa' }}>
                        No definitions found matching "{searchTerm}".
                    </div>
                )}
            </div>
        </div>
    );
}
