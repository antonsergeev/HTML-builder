const fs = require('fs');
const path = require('path');

const sourceDirname = path.join(__dirname, 'styles');
const targetFilename = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(sourceDirname, {withFileTypes: true}, (error, dirents) => {
  if (error) return console.error(error.message);
  const filenames = [];
  for (const dirent of dirents) {
    if (dirent.isFile() && path.extname(dirent.name) === '.css') {
      filenames.push(path.join(sourceDirname, dirent.name));
    }
  }
  filenames.forEach((filename) => {
    fs.readFile(filename, 'utf-8', (error, data) => {
      if (error) return console.error(error.message);
      fs.appendFile(targetFilename, data, (error) => {
        if (error) return console.error(error.message);
      });
    });
  });
});
