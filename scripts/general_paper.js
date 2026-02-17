// ==========================================
// GENERAL PAPER (8021) STORAGE & GENERATOR
// ==========================================

// Global variable to store GP data if not already defined
if (typeof paperData === 'undefined') {
    var paperData = {};
}

// === 1. ADD DATA TO THE DATABASE ===
Object.assign(paperData, {

    // --- MAY / JUNE 2025 (Variant 11) ---
    'gp_2025_mj_11': {
        title: "Essay Paper 11",
        pdf: "papers/8021_s25_qp_11.pdf",
        questions: [
            { n: '1', m: 30, t: "To what extent does the government provide effective public services to the people of your country?", l: '600-700' },
            { n: '2', m: 30, t: "Discuss the view that the news media should never be censored in your country.", l: '600-700' },
            { n: '3', m: 30, t: "To what extent are art galleries and museums still necessary?", l: '600-700' },
            { n: '4', m: 30, t: "Marriage is no longer necessary in modern society. Evaluate this view.", l: '600-700' },
            { n: '5', m: 30, t: "New medicines should always be fully tested before people use them. To what extent do you agree with this statement?", l: '600-700' },
            { n: '6', m: 30, t: "To what extent is your country adequately prepared for natural disasters?", l: '600-700' },
            { n: '7', m: 30, t: "All new house-building... [Refer to PDF for full question text]", l: '600-700' },
            { n: '8', m: 30, t: "Advertising has become an unwelcome feature of our lives. To what extent do you agree with this statement?", l: '600-700' },
            { n: '9', m: 30, t: "People should be allowed to protest in any way they choose. Evaluate this statement.", l: '600-700' },
            { n: '10', m: 30, t: "International aid benefits the people providing the aid more than the people receiving it. Discuss.", l: '600-700' }
        ]
    },

    // --- MAY / JUNE 2025 (Variant 12) ---
    'gp_2025_mj_12': {
        title: "Essay Paper 12",
        pdf: "papers/8021_s25_qp_12.pdf",
        questions: [
            { n: '1', m: 30, t: "Governments should prioritise the needs of people living in rural areas over the needs of people living in cities. Discuss.", l: '600-700' },
            { n: '2', m: 30, t: "To what extent do traditional arts and crafts provide an understanding of your country's history?", l: '600-700' },
            { n: '3', m: 30, t: "The world is more divided now than ever. Examine this statement.", l: '600-700' },
            { n: '4', m: 30, t: "Prisons play a positive role in keeping societies safe. Evaluate this view.", l: '600-700' },
            { n: '5', m: 30, t: "Online learning is the future of education. Discuss.", l: '600-700' },
            { n: '6', m: 30, t: "To what extent has genetic engineering positively changed people's lives?", l: '600-700' },
            { n: '7', m: 30, t: "The lack of [access to resources/water] is a significant threat to human survival. Discuss. [Check PDF]", l: '600-700' },
            { n: '8', m: 30, t: "Works of fiction have no relevance to the reality of everyday life. Evaluate this statement.", l: '600-700' },
            { n: '9', m: 30, t: "Effective censorship of the media is not possible today. Discuss.", l: '600-700' },
            { n: '10', m: 30, t: "To what extent do you agree that it is possible to achieve equality of wealth in your country?", l: '600-700' }
        ]
    },

    // --- MAY / JUNE 2025 (Variant 13) ---
    'gp_2025_mj_13': {
        title: "Essay Paper 13",
        pdf: "papers/8021_s25_qp_13.pdf",
        questions: [
            { n: '1', m: 30, t: "Everyone must help their country in times of war. To what extent do you agree with this statement?", l: '600-700' },
            { n: '2', m: 30, t: "To what extent should towns be designed to support people's needs?", l: '600-700' },
            { n: '3', m: 30, t: "Non-fiction books will never be as popular as fiction books. To what extent do you agree with this statement?", l: '600-700' },
            { n: '4', m: 30, t: "Evaluate the view that the aim of prison should be to improve people rather than punish them.", l: '600-700' },
            { n: '5', m: 30, t: "The rights of people to protest on the streets should always be protected. Examine this statement.", l: '600-700' },
            { n: '6', m: 30, t: "To what extent has globalisation improved people's lives? [Check PDF]", l: '600-700' },
            { n: '7', m: 30, t: "It is essential for local community arts to survive. Discuss.", l: '600-700' },
            { n: '8', m: 30, t: "To what extent does a plant-based diet ensure a healthy lifestyle?", l: '600-700' },
            { n: '9', m: 30, t: "Actors playing leading roles in movies are too often chosen for their physical appearance. Discuss.", l: '600-700' },
            { n: '10', m: 30, t: "To what extent is the introduction of electric vehicles a positive development?", l: '600-700' }
        ]
    }
});

// === 2. THE VISUAL CARDS ===
const gpCardsP1 = `
    <div style="text-align:center; margin-bottom:30px;">
        <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">🌍 General Paper</h2>
        <p style="color:#666;">Paper 1: Essay Questions (30 Marks)</p>
    </div>
    
    <div class="series-header"><div class="year-big">2025</div><div class="series-name">May / June Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2025_mj_11')">
            <span class="paper-tag">8021/11</span>
            <h3>Essay Paper 11</h3>
            <p style="color:#888; margin-top:5px;">10 Questions • PDF Available</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_mj_12')">
            <span class="paper-tag">8021/12</span>
            <h3>Essay Paper 12</h3>
            <p style="color:#888; margin-top:5px;">10 Questions • PDF Available</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_mj_13')">
            <span class="paper-tag">8021/13</span>
            <h3>Essay Paper 13</h3>
            <p style="color:#888; margin-top:5px;">10 Questions • PDF Available</p>
        </div>
    </div>
`;

const gpCardsP2 = `
    <div style="text-align:center; margin-bottom:30px;">
        <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">📰 General Paper</h2>
        <p style="color:#666;">Paper 2: Comprehension (50 Marks)</p>
    </div>

    <div class="series-header"><div class="year-big">Coming Soon</div></div>
    <div style="text-align:center; color:#999; padding:40px; border: 2px dashed #eee; border-radius:12px;">
        <h3 style="margin-bottom:10px;">🚧 Paper 2 Questions Under Development</h3>
        <p>We are currently digitizing the comprehension passages and questions.</p>
    </div>
`;

// === 3. INJECT INTO INDEX.HTML IMMEDIATELY ===
const gpContainerP1 = document.getElementById('container-general-p1');
if (gpContainerP1) {
    gpContainerP1.innerHTML = gpCardsP1;
}

const gpContainerP2 = document.getElementById('container-general-p2');
if (gpContainerP2) {
    gpContainerP2.innerHTML = gpCardsP2;
}