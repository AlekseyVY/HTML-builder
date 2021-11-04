const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'),{encoding: 'utf8'});
readStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});