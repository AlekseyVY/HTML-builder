const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), {flags: 'a'});

rl.question('Hi, please start typing your wisdom: ', (answer) => {
  if(exit(answer)) {
    writeStream.write(answer);
    writeStream.write('\n');
  }
});

rl.on('line', (line) => {
  if(exit(line)) {
    writeStream.write(line);
    writeStream.write('\n');
  }
});

rl.on('SIGINT', () => {
  exit('exit');
});

const exit = (data) => {
  if(data === 'exit') {
    process.stdout.write('Thanks for your wisdom!!!');
    writeStream.end();    rl.close();
    return false;
  }
  return true;
};