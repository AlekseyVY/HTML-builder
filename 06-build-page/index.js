const fs = require('fs');
const { type } = require('os');
const path = require('path/posix');


try {
  fs.rm(dest, {recursive: true, force: true}, () => {});
} catch(err) {}

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
const buildHtml = async () => {
  await fs.promises.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'));
  const files = await fs.promises.readdir(path.join(__dirname, 'components'));
  let template = await fs.promises.readFile(path.join(__dirname, 'template.html'), {encoding: 'utf-8'})
  await Promise.all(files.map(file => new Promise(async (res) => {
    const chunk = await fs.promises.readFile(path.join(__dirname, 'components', file), {encoding: 'utf-8'})
    template = template.replace(`{{${file.split('.')[0]}}}`, chunk);
    res();
  })))
  await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template,{flags: 'w'})
}

buildHtml()

