const fs = require('fs');
const path = require('path');

const results = {
  "0625_m24_ms_22.pdf": [
    "B", "B", "C", "A", "D", "D", "A", "B", "A", "B", "A", "C", "C", "B", "C", "C", "D", "D", "A", "C", "B", "D", "A", "D", "C", "B", "B", "B", "C", "A", "C", "A", "D", "C", "B", "C", "C", "A", "D", "A"
  ],
  "0625_m25_ms_22.pdf": [
    "B", "B", "C", "D", "A", "C", "B", "A", "D", "B", "A", "D", "A", "D", "A", "B", "C", "D", "D", "A", "A", "D", "A", "B", "A", "A", "D", "C", "D", "C", "B", "C", "C", "C", "A", "A", "D", "D", "C", "A"
  ],
  "0625_s24_ms_21.pdf": [
    "A", "B", "C", "B", "A", "C", "B", "B", "B", "C", "D", "C", "D", "?", "A", "C", "D", "D", "B", "D", "C", "C", "D", "B", "A", "D", "D", "D", "A", "A", "A", "D", "A", "A", "C", "D", "B", "C", "A", "A"
  ],
  "0625_s24_ms_22.pdf": [
    "C", "C", "B", "A", "D", "D", "C", "B", "C", "A", "D", "C", "B", "D", "A", "D", "B", "A", "D", "C", "C", "C", "B", "D", "A", "D", "B", "D", "C", "A", "A", "A", "A", "D", "B", "C", "A", "A", "A", "B"
  ],
  "0625_s24_ms_23.pdf": [
    "B", "A", "B", "D", "D", "A", "A", "B", "B", "D", "D", "B", "C", "A", "D", "C", "C", "D", "B", "A", "A", "C", "B", "A", "B", "D", "D", "B", "C", "D", "B", "A", "A", "D", "C", "C", "A", "C", "B", "C"
  ],
  "0625_s25_ms_21.pdf": [
    "C", "B", "D", "C", "B", "D", "C", "A", "D", "A", "B", "C", "B", "A", "A", "A", "B", "D", "B", "B", "B", "D", "D", "A", "A", "D", "C", "C", "C", "B", "A", "D", "A", "B", "C", "A", "D", "B", "C", "C"
  ],
  "0625_s25_ms_22.pdf": [
    "C", "A", "B", "D", "C", "A", "D", "C", "D", "B", "A", "C", "A", "B", "A", "B", "C", "B", "D", "D", "A", "D", "C", "C", "D", "A", "D", "C", "B", "A", "D", "B", "C", "B", "D", "A", "C", "C", "D", "D"
  ],
  "0625_s25_ms_23.pdf": [
    "A", "B", "B", "D", "A", "B", "B", "B", "B", "D", "A", "D", "D", "A", "C", "B", "D", "C", "B", "D", "C", "C", "A", "B", "D", "D", "B", "C", "B", "A", "A", "D", "D", "C", "C", "A", "C", "A", "C", "A"
  ],
  "0625_w24_ms_21.pdf": [
    "B", "C", "A", "C", "C", "D", "D", "D", "D", "B", "B", "B", "D", "A", "C", "D", "A", "B", "C", "B", "A", "D", "C", "A", "C", "C", "D", "C", "A", "B", "D", "B", "D", "C", "B", "B", "C", "A", "D", "B"
  ],
  "0625_w24_ms_22.pdf": [
    "A", "D", "C", "A", "C", "D", "A", "D", "D", "B", "C", "C", "A", "B", "C", "D", "B", "B", "A", "A", "B", "C", "B", "A", "C", "C", "A", "A", "B", "D", "A", "C", "B", "B", "B", "B", "C", "B", "B", "C"
  ],
  "0625_w24_ms_23.pdf": [
    "B", "C", "A", "A", "B", "D", "A", "C", "B", "B", "A", "B", "C", "C", "C", "D", "C", "B", "A", "C", "B", "B", "B", "D", "D", "B", "D", "C", "D", "C", "B", "A", "A", "A", "A", "D", "B", "B", "C", "D"
  ],
  "0625_w25_ms_21.pdf": [
    "D", "B", "B", "B", "C", "D", "A", "C", "A", "A", "C", "A", "A", "C", "A", "C", "B", "C", "B", "B", "D", "D", "B", "D", "D", "A", "C", "D", "C", "D", "D", "C", "B", "B", "C", "C", "A", "C", "D", "B"
  ],
  "0625_w25_ms_22.pdf": [
    "A", "B", "C", "C", "A", "C", "D", "D", "B", "D", "D", "C", "B", "D", "A", "A", "D", "B", "C", "C", "A", "B", "C", "A", "B", "C", "D", "B", "A", "B", "C", "D", "B", "D", "D", "A", "B", "A", "B", "A"
  ],
  "0625_w25_ms_23.pdf": [
    "A", "C", "D", "A", "D", "B", "B", "B", "C", "D", "A", "B", "C", "A", "A", "C", "A", "C", "A", "A", "C", "D", "D", "C", "A", "C", "B", "B", "D", "D", "C", "D", "A", "B", "B", "B", "D", "D", "C", "A"
  ]
};

const seriesNames = {
    'm': 'Feb / March Series',
    's': 'May / June Series',
    'w': 'Oct / Nov Series'
};

let dataTs = "// IGCSE Physics Paper 2 — MCQ answer keys\nexport const igcsePhysicsP2Data: Record<string, any> = {\n";
let papersTs = "export const igcsePhysicsP2Papers = [\n";

for (const msFile in results) {
    const qpFile = msFile.replace('_ms_', '_qp_');
    const answers = results[msFile];

    // Using proper regex
    const match = msFile.match(/^0625_([a-z])(\d+)_ms_(\d+)\.pdf$/);
    if (!match) continue;

    const seriesCode = match[1];
    const yearCode = match[2];
    const variantCode = match[3];

    const fullYear = "20" + yearCode;
    const seriesFull = seriesNames[seriesCode] || seriesCode;

    const id = "phys_0625_" + seriesCode + yearCode + "_" + variantCode;
    const title = "Physics MCQ Variant " + variantCode[1];
    const code = "0625/" + variantCode;

    dataTs += "    '" + id + "': {\n";
    dataTs += "        title: '" + title + "',\n";
    dataTs += "        pdf: \"past_papers/igcse/physics/MCQ/questions/" + qpFile + "\",\n";
    dataTs += "        answers: " + JSON.stringify(answers) + "\n";
    dataTs += "    },\n";

    papersTs += "    { id: '" + id + "', code: '" + code + "', title: '" + title + "', year: '" + fullYear + "', series: '" + seriesFull + "' },\n";
}

dataTs += "};\n\n";
papersTs += "];\n";

const outputPath = path.join(__dirname, '../data/papers/igcsePhysicsP2.ts');
fs.writeFileSync(outputPath, dataTs + papersTs);
console.log('Updated igcsePhysicsP2.ts');
