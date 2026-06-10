const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('/Users/abdulrehan/Documents/Assessra/past_papers/igcse/biology/MCQ/answer_key/0610_w25_ms_21.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
});
