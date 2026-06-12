const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
  const files = [
    'public/notes/A Level/Business/theory.pdf',
    'public/notes/A Level/Business/definitions.pdf',
    'public/notes/A Level/Business/formulae.pdf'
  ];

  for (const file of files) {
    if (fs.existsSync(file)) {
      const dataBuffer = fs.readFileSync(file);
      const data = await pdf(dataBuffer);
      console.log(`\n\n=== START: ${file} ===\n`);
      console.log(data.text.trim());
      console.log(`\n=== END: ${file} ===\n`);
    } else {
        console.log(`File not found: ${file}`);
    }
  }
}

extract().catch(console.error);
