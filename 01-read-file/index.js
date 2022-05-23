const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const filename = path.join(__dirname, 'text.txt');
const input = fs.createReadStream(filename, 'utf-8');

input.pipe(stdout);
