const fs = require('fs');
const path = require('path/posix');


fs.readdir(path.join(__dirname, 'files-copy'),{withFileTypes: true}, (err, files) => {
  if (err) process.stderr.write(err);
  files.forEach((file) => {
    fs.unlink(path.join(__dirname, 'files-copy', file.name), err => {
      if (err) throw err;
    });
  });
  fs.readdir(path.join(__dirname, 'files'),{withFileTypes: true}, (err, files) => {
    if (err) process.stderr.write(err);

    files.forEach((file) => {
      fs.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name),() => {});
    });
  });
});