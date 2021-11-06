const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'),{withFileTypes: true}, (err, files) => {
  if(err) process.stderr.write(err);
  files.forEach((file) => {
    fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
      if(!stats.isDirectory()) {
        process.stdout.write(`${file.name.split('.')[0]} - ${path.extname(path.join(__dirname, 'secret-folder', file.name)).slice(1)} - ${stats.size}bytes\n`);
      }
    });
  });
});
