// Mock classifyPaper
function classifyPaper(pid) {
    if (pid.includes('bus')) return { subject: 'business', paper: 'p3' };
    if (pid.includes('econ')) return { subject: 'economics', paper: 'p3' };
    // Default fallback
    return { subject: 'economics', paper: 'p3' };
}

// Mock Data
const userData = {
    papers: {
        '2024_bus_32': { q1: { score: 10 } }, // Business - Should count
        '2024_econ_32': { q1: { score: 15 } }, // Economics - Should count
        '2024_other_32': { q1: { score: 5 } }  // Unknown - Should count (fallback to econ)
    }
};

const papers = userData.papers || {};
let busCount = 0;
let totalScore = 0;

Object.keys(papers).forEach(pid => {
    const type = classifyPaper(pid);
    console.log(`Paper: ${pid}, Subject: ${type.subject}`);

    // The Logic to Test
    if (type.subject) {
        const attempts = papers[pid];
        let isAttempted = false;
        Object.values(attempts).forEach(q => {
            if (q.score !== undefined) {
                isAttempted = true;
                totalScore += (q.score || 0);
            }
        });
        if (isAttempted) busCount++;
    }
});

console.log(`Total Papers Counted: ${busCount}`);
console.log(`Expected: 3`);
