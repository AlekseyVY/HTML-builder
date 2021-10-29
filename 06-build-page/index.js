const fs = require('fs');
const path = require('path/posix');


// copy assets folder
const copy = async (src, dest) => {
  await fs.mkdir(dest, {recursive: true}, () => {});
  fs.readdir(src, {withFileTypes: true}, (err, files) => {
    files.forEach((file) => {
      let srcPath = path.join(src, file.name);
      let destPath = path.join(dest, file.name);
      if(file.isDirectory()) {
        copy(srcPath, destPath);
      } else {
        fs.copyFile(srcPath, destPath,() => {});
      }
    });
  });
};

const src = path.join(__dirname, 'assets');
const dest = path.join(__dirname, 'project-dist');

const copyDir = async (src, dest) => {
  await fs.mkdir(dest, {recursive: true}, () => {});
  const newDest = path.join(dest, 'assets');
  await copy(src, newDest);
};

copyDir(src, dest);


// build css bundle and copy
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), {flags: 'w'});

fs.readdir(path.join(__dirname, 'styles'),{withFileTypes: true}, (err, files) => {
  if (err) process.stderr.write(err);
  files.forEach((file) => {
    fs.stat(path.join(__dirname, 'styles', file.name), (err, stats) => {
      if(!stats.isDirectory() && path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
        const readStream = fs.createReadStream(path.join(__dirname,'styles', file.name),{encoding: 'utf8'});
        readStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      }
    });
  });
});


// build html from template
const templateStream = fs.createReadStream(path.join(__dirname, 'template.html'),{encoding: 'utf8'});
const articlesStream = fs.createReadStream(path.join(__dirname, 'components', 'articles.html'),{encoding: 'utf8'});
const footerStream = fs.createReadStream(path.join(__dirname, 'components', 'footer.html'),{encoding: 'utf8'});
const headerStream = fs.createReadStream(path.join(__dirname, 'components', 'header.html'),{encoding: 'utf8'});

const htmlWriteStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), {flags: 'w'});

templateStream.on('data', (chunk) => {
  articlesStream.on('data', (data) => {
    chunk = chunk.replace('{{articles}}', data);
    footerStream.on('data', (fData) => {
      chunk = chunk.replace('{{footer}}', fData);
      headerStream.on('data', (hData) => {
        chunk = chunk.replace('{{header}}', hData);
        htmlWriteStream.write(chunk);
      });
    });
  });
});