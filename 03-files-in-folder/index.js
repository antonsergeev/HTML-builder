const fs = require('fs');
const path = require('path');

const dirname = path.join(__dirname, 'secret-folder');

fs.readdir(dirname, (error, files) => {
  if (error) return console.error(error.message);
  for (const file of files) {
    fs.stat(path.join(dirname, file), (error, stats) => {
      if (error) return console.error(error.message);
      if (stats.isFile()) {
        console.log(`${path.parse(file).name} - ${path.extname(file).slice(1)} - ${stats.size}b`);
      }
    });
  }
});
