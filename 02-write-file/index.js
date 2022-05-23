const fs = require('fs');
const path = require('path');
const { stdin, exit } = require('process');
const readline = require('readline');

const filename = path.join(__dirname, 'text.txt');
console.log('А теперь введите свой потрясающий текст!');

const sayByeAndClose = () => {
  console.log('Возвращайтесь еще!');
  exit();
};

const readlineInterface = readline.createInterface({
  input: stdin,
  output: fs.createWriteStream(filename),
});

readlineInterface.on('line', (line) => {
  if (line === 'exit') {
    sayByeAndClose();
  }
  readlineInterface.output.write(`${line}\n`);
});

process.on('SIGINT', sayByeAndClose);
