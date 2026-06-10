const fs = require('fs');
const path = require('path');
const { extractText } = require('unpdf');

const keysDir = path.join(__dirname, '../past_papers/igcse/physics/MCQ/answer_key');

async function extract() {
    const files = fs.readdirSync(keysDir).filter(f => f.endsWith('.pdf'));
    const results = {};

    for (const file of files) {
        const filePath = path.join(keysDir, file);
        const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
        try {
            const data = await extractText(dataBuffer);
            const text = data.text;
            
            let answers = [];
            for (let i = 1; i <= 40; i++) {
                // A regex to find the question number followed by an optional space, and then A/B/C/D
                const regex = new RegExp(`\\b${i}\\s+([A-D])\\b`);
                const match = text.match(regex);
                if (match) {
                    answers.push(match[1]);
                } else {
                    answers.push('?');
                }
            }
            
            results[file] = answers;
        } catch (e) {
            console.error("Error reading", file, e);
        }
    }

    console.log(JSON.stringify(results, null, 2));
}

extract();
