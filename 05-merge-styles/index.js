const fs = require('fs');
const path = require('path/posix');
const stream = require('node:stream');
const readline = require('readline');


const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), {flags: 'w'});

fs.readdir(path.join(__dirname, 'styles'),{withFileTypes: true}, (err, files) => {
  if (err) process.stderr.write(err);
  files.forEach((file) => {
    fs.stat(path.join(__dirname, 'styles', file.name), (err, stats) => {
      if(!stats.isDirectory() && path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
        const inStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
        const outStream = new stream;
        const rl = readline.createInterface(inStream, outStream);
        rl.on('line', function(line) {
          writeStream.write(line);
          writeStream.write('\n');
        });
      }
    });
  });
});

