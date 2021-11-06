const fs = require('fs');
const path = require('path');



const buildCSS = async () => {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), {flags: 'w'})
  let template = []
  await Promise.all(files.map(file => new Promise(async (res) => {
      if(file.isFile() && path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
        const chunk = await fs.promises.readFile(path.join(__dirname, 'styles', file.name), {encoding: 'utf-8'})
        template.push(chunk)
        writeStream.write(chunk);
        writeStream.write('\n');
        res();
      }
  })))
}

buildCSS()
