const fs = require('fs');
const path = require('path');


const buildCSS = async () => {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'));
  let template = ''
  await Promise.all(files.map(file => new Promise(async (res) => {
    await fs.stat(path.join(__dirname, 'styles', file), async (err, stats) => {
      if(!stats.isDirectory() && path.extname(path.join(__dirname, 'styles', file)) === '.css') {
        const chunk = await fs.promises.readFile(path.join(__dirname, 'styles', file), {encoding: 'utf-8'})
        template += chunk
        res();
      }
    });
  })))
  await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), template,{flags: 'w'})
}

buildCSS()
