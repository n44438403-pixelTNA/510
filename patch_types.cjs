const fs = require('fs');
let code = fs.readFileSync('types.ts', 'utf8');

// Fix the syntax error we can see in the diff:
//   topic?: string; // NEW
// +  difficultyLevel?: string;: If test was specific to a topic
//   omrData?: {

code = code.replace(
  /topic\?: string; \/\/ NEW\n  difficultyLevel\?: string;: If test was specific to a topic\n  omrData\?: \{/g,
  'topic?: string; // NEW: If test was specific to a topic\n  difficultyLevel?: string;\n  omrData?: {'
);

fs.writeFileSync('types.ts', code);
