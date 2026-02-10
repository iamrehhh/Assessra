// Business Textbook Knowledge Base
const businessKnowledge = {
    // MARKETING
    "marketing": {
        keywords: ["marketing", "market", "customer"],
        content: {
            definition: "Marketing is the management process of identifying, anticipating and satisfying consumer requirements profitably.",
            keyPoints: [
                "Market research identifies customer needs",
                "Market segmentation divides markets into distinct groups",
                "Marketing mix (4Ps): Product, Price, Place, Promotion",
                "Marketing objectives include market share, brand loyalty, customer satisfaction"
            ],
            example: "A company like Apple uses marketing to understand customer desires for innovative technology, then promotes products through advertising and premium pricing strategies."
        }
    },

    "market segmentation": {
        keywords: ["segmentation", "segment", "target market", "demographics"],
        content: {
            definition: "Market segmentation is the process of dividing a market into distinct groups of consumers with similar characteristics or needs.",
            keyPoints: [
                "Demographic: age, gender, income, occupation",
                "Geographic: location, region, climate",
                "Psychographic: lifestyle, values, personality",
                "Behavioral: usage rate, brand loyalty, benefits sought"
            ],
            example: "Nike segments its market by demographics (age groups), psychographics (athletic lifestyle), and behavioral patterns (sports enthusiasts vs casual wearers)."
        }
    },

    // FINANCE
    "break-even": {
        keywords: ["break-even", "breakeven", "break even", "contribution"],
        content: {
            definition: "Break-even analysis shows the level of output at which total revenue equals total costs, resulting in neither profit nor loss.",
            keyPoints: [
                "Break-even point = Fixed Costs ÷ Contribution per unit",
                "Contribution = Selling price - Variable cost per unit",
                "Margin of safety = Current output - Break-even output",
                "Used for pricing decisions and profit planning"
            ],
            example: "If fixed costs are $10,000, selling price is $50, and variable cost is $30, break-even = 10,000÷20 = 500 units."
        }
    },

    "cash flow": {
        keywords: ["cash flow", "cashflow", "liquidity", "working capital"],
        content: {
            definition: "Cash flow is the movement of money into and out of a business over a period of time.",
            keyPoints: [
                "Cash inflows: sales revenue, loans, asset sales",
                "Cash outflows: expenses, wages, stock purchases",
                "Net cash flow = Cash inflows - Cash outflows",
                "Poor cash flow can lead to insolvency even if profitable"
            ],
            example: "A business may be profitable on paper but face cash flow problems if customers delay payments while suppliers demand immediate payment."
        }
    },

    // HUMAN RESOURCES
    "motivation": {
        keywords: ["motivation", "motivate", "motivating", "maslow", "herzberg", "taylor"],
        content: {
            definition: "Motivation refers to the factors that stimulate workers to put in effort and commitment in their work.",
            keyPoints: [
                "Maslow's Hierarchy: physiological, safety, social, esteem, self-actualization needs",
                "Herzberg's Two-Factor Theory: hygiene factors vs motivators",
                "Taylor's Scientific Management: financial incentives and efficiency",
                "Methods include financial rewards, job enrichment, empowerment, teamwork"
            ],
            example: "Google motivates employees through high salaries (financial), creative workspaces (esteem), and opportunities for innovation (self-actualization)."
        }
    },

    "leadership": {
        keywords: ["leadership", "leader", "management style", "autocratic", "democratic", "laissez-faire"],
        content: {
            definition: "Leadership is the ability to influence and direct people to meet organizational goals.",
            keyPoints: [
                "Autocratic: leader makes all decisions, quick but demotivating",
                "Democratic: participative decision-making, motivating but slower",
                "Laissez-faire: minimal supervision, freedom but requires skilled workers",
                "Situational leadership: adapting style to circumstances"
            ],
            example: "In a crisis, autocratic leadership may be needed for quick decisions. For creative projects, democratic leadership encourages innovation."
        }
    },

    // OPERATIONS
    "quality": {
        keywords: ["quality", "quality control", "quality assurance", "tqm", "total quality"],
        content: {
            definition: "Quality refers to meeting or exceeding customer expectations consistently.",
            keyPoints: [
                "Quality control: inspecting finished products to identify defects",
                "Quality assurance: preventing defects through process improvement",
                "Total Quality Management (TQM): organization-wide commitment to quality",
                "Benefits: customer loyalty, reduced waste, competitive advantage"
            ],
            example: "Toyota's TQM approach empowers all workers to stop production if quality issues arise, ensuring high standards."
        }
    },

    "lean production": {
        keywords: ["lean", "lean production", "just in time", "jit", "kaizen"],
        content: {
            definition: "Lean production is an approach that focuses on minimizing waste while maximizing productivity.",
            keyPoints: [
                "Just-in-Time (JIT): producing/ordering only what's needed, when needed",
                "Kaizen: continuous improvement through small incremental changes",
                "Eliminates waste in: overproduction, waiting, transport, inventory",
                "Benefits: lower costs, faster delivery, higher quality"
            ],
            example: "Dell uses JIT to assemble computers only after orders are placed, reducing inventory costs and customizing products."
        }
    },

    // GENERAL BUSINESS
    "stakeholders": {
        keywords: ["stakeholder", "stakeholders", "shareholders", "employees"],
        content: {
            definition: "Stakeholders are individuals or groups with an interest in the activities and performance of a business.",
            keyPoints: [
                "Internal: shareholders, employees, managers",
                "External: customers, suppliers, government, community",
                "Stakeholder conflict: different groups have different objectives",
                "Stakeholder mapping helps prioritize different groups"
            ],
            example: "Shareholders want high dividends, while employees want higher wages - creating potential conflict that management must balance."
        }
    },

    "business objectives": {
        keywords: ["objective", "objectives", "aims", "goals", "mission"],
        content: {
            definition: "Business objectives are specific, measurable targets that a business aims to achieve.",
            keyPoints: [
                "SMART objectives: Specific, Measurable, Achievable, Relevant, Time-bound",
                "Common objectives: profit maximization, growth, market share, survival",
                "Mission statement: overall purpose of the business",
                "Corporate vs functional objectives"
            ],
            example: "A SMART objective: 'Increase market share by 5% within the next 12 months through expanding into online sales channels.'"
        }
    }
};

// Add more topics as needed - structure remains the same