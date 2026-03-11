const fs = require('fs');
let content = fs.readFileSync('components/MarksheetCard.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(840, 940).join('\n'));
