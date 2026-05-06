'use client';

const tipsData = [
    {
        section: 'External Influences & Economy',
        tips: [
            { topic: 'Employment Laws', content: 'You do not need to know specific laws, but know the main employment laws in your country and what they expect employers to do.' },
            { topic: 'Consumer Protection', content: 'You do not need specific details, but you may be asked how a business is affected by consumer protection laws in your country.' },
            { topic: 'Social Change', content: 'Changing social conditions and employment patterns create just as many opportunities as potential risks. Use this to evaluate the impact.' },
            { topic: 'Technology Choice', content: 'Do not assume a business must always use the latest technology. There are substantial costs, and some businesses thrive without it.' },
            { topic: 'Evaluating Technology', content: 'New technology is not the best solution to all problems and introducing it badly can create more problems than it solves.' },
            { topic: 'Defining Multinationals', content: "When defining a multinational business, it is not enough to state that such businesses 'sell products in more than one country'." },
            { topic: 'Local Context', content: 'In case study questions on multinational business activity, you may have the opportunity to use examples from your own country.' },
            { topic: 'Record Keeping', content: 'Start keeping your own file of newspaper or website articles on economic events and data, and how businesses are responding.' },
            { topic: 'Growth Evaluation', content: 'When evaluating economic growth as an objective, remember that rapid growth is not always beneficial (e.g., pollution or job losses).' },
            { topic: 'Business Cycle', content: 'Think about how the stages of the business cycle affect different businesses in different ways, and how they respond with different strategies.' },
            { topic: 'Inflation Impact', content: 'The impact of inflation on any one business depends very greatly on the rate of inflation and on forecasts for the future.' },
            { topic: 'Interest Rates', content: 'Be able to evaluate the impact of changes. Even small changes could be significant for businesses with high debt or selling on credit.' },
            { topic: 'Exchange Rates', content: 'You should be able to analyse, with appropriate calculations if necessary, how rises or falls in an exchange rate might impact importers and exporters.' },
        ],
    },
    {
        section: 'Strategy & Planning',
        tips: [
            { topic: 'SWOT Analysis', content: 'Some questions ask you to undertake a SWOT analysis, while others ask you to evaluate the technique. Read the question carefully.' },
            { topic: 'Mergers and Takeovers', content: 'Start by identifying what type it is. Remember that they often cause businesses as many problems as they solve.' },
            { topic: 'Contextual Planning', content: 'Explain that the relative importance of planning factors will vary from business to business (e.g. luxury goods vs. small company limits).' },
            { topic: 'Analyzing Change', content: 'When discussing how change will affect strategies, try to analyse whether the change is incremental or dramatic, anticipated or unanticipated.' },
            { topic: 'Resistance', content: 'When discussing resistance to changes, try to think of the leadership style being used to implement the change.' },
            { topic: 'Contingency Planning', content: 'An excellent way to show evaluative skills is to explain that contingency planning does not guarantee that disasters will not occur, but prepares the business for less impact.' },
            { topic: 'Delayering and Delegation', content: 'You show very good understanding if you explain that removing layers of middle management must lead to higher levels of delegation.' },
            { topic: 'Structure and Communication', content: 'Try to link communication effectiveness with organisational structure. Traditional structures use vertical, matrix uses horizontal.' },
            { topic: 'Formal Networks', content: 'When discussing suitable communication methods, try to assess which formal communication network would be most appropriate.' },
            { topic: 'Theory References', content: 'When answering a question about leadership, incorporate a reference to one or more leadership theories to give a clear business focus.' },
            { topic: 'HRM Evaluation', content: 'You will not be asked detailed questions about IT/AI applications, but be prepared to evaluate their benefits and limitations for HRM.' },
        ],
    },
    {
        section: 'Marketing',
        tips: [
            { topic: 'Elasticity Caution', content: 'When commenting on an elasticity calculation, you should never assume the result will be accurate and relevant for future changes.' },
            { topic: 'R&D Evaluation', content: 'When evaluating R&D, do not assume success is guaranteed by spending more; some inventions will simply not be commercially successful.' },
            { topic: 'IT/AI Impact', content: 'You only need to understand their general impact on the role of the marketing department and data analysis, not specific technical applications.' },
            { topic: 'International Strategy', content: 'Keep up-to-date with business practices and legal changes in your own country. You may be asked to evaluate a strategy used by a business operating there.' },
        ],
    },
    {
        section: 'Operations & Finance',
        tips: [
            { topic: 'Relocation Evaluation', content: "When answering questions about business location, show evaluation by suggesting that the 'best' location will not always remain competitive." },
            { topic: 'Scale Application', content: 'When answering questions about economies of scale, make sure your answer is applied to the business specified in the question.' },
            { topic: 'Scale vs. Output', content: "Do not confuse 'producing more' with increasing the scale of operations. Changing scale means using more (or less) of all resources." },
            { topic: 'Consumer Expectations', content: 'Quality is often viewed as an absolute concept and not a relative one. In answers, quality must be explained with reference to the expectations of target market consumers.' },
            { topic: 'Small Business Quality', content: 'Show that quality is not just an issue for large businesses. Small firms also need to consider this to maintain customer loyalty.' },
            { topic: 'Decision Influences', content: 'Be prepared to analyse the influence of the availability of human, marketing, and financial resources on strategic operations decisions.' },
            { topic: 'IT/AI in Operations', content: 'Be prepared to evaluate the benefits and limitations of IT and AI for business operations without needing to know detailed technical applications.' },
            { topic: 'Kaizen Link', content: 'It would be good analysis to link the kaizen principle to the work of Herzberg on job enrichment.' },
            { topic: 'CPA Evaluation', content: 'You could evaluate CPA techniques by suggesting that no planning technique, however good, can ensure that a project will reach a successful conclusion.' },
            { topic: 'Accounting Structure', content: 'If a question asks you to amend a statement of profit or loss, or a statement of financial position, always use the same structure as shown in the case study.' },
            { topic: 'Evaluation Limits', content: 'If a question needs an evaluative answer regarding increasing profitability, it is very important that you consider at least one reason why your suggestion might not be effective.' },
            { topic: 'Ratio Accuracy', content: 'When commenting on ratio results, it is often advisable to question the accuracy of the data and explain the limitations of using a limited number of results.' },
            { topic: 'Formatting Calculations', content: 'When calculating investment appraisal methods, you are advised to lay out your working carefully, using the forms of table used in this chapter.' },
            { topic: 'Qualitative Factors', content: 'Unless the question asks only for numerical factors, your answers should include an assessment of qualitative factors too in investment appraisal.' },
            { topic: 'Strategy Timescales', content: 'An excellent way to demonstrate evaluation is to make a clear distinction between the impact of a new strategy on ratios in the short term compared to the long term.' },
        ],
    },
];

export default function TipsView() {
    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2rem', color: '#b7950b', fontFamily: 'var(--font-playfair)' }}>
                    💡 Examiner&apos;s Tips
                </h2>
                <p style={{ color: '#888' }}>Key advice for A Level Business (Chapters 6-36)</p>
            </div>

            {tipsData.map((section) => (
                <div className="formula-section" key={section.section}>
                    <h3 className="chapter-title" style={{ borderColor: '#FFD700' }}>
                        {section.section}
                    </h3>
                    <div className="formula-grid">
                        {section.tips.map((tip) => (
                            <div className="tip-card" key={tip.topic}>
                                <div className="t-topic">{tip.topic}</div>
                                <div className="t-content">{tip.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
