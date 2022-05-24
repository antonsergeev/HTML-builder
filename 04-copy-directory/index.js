const fs = require('fs');
const path = require('path');

const sourceDirname = path.join(__dirname, 'files');
const targetDirname = path.join(__dirname, 'files-copy');

function getDirnames(dirname, callback) {
  fs.readdir(dirname, {withFileTypes: true}, (error, dirents) => {
    if (error) return console.error(error.message);
    const filenames = [];
    for (const dirent of dirents) {
      const currentPath = path.join(dirname, dirent.name);
      if (dirent.isFile()) {
        filenames.push(currentPath);
      } else {
        getDirnames(currentPath, callback);
      }
    }
    callback(null, filenames);
  });
}

fs.rm(targetDirname, {recursive: true}, () => {
  getDirnames(sourceDirname, (error, filenames) => {
    if (error) return console.error(error.message);
    filenames.forEach(filename => {
      const targetFilenameAbsolutePath = path.join(targetDirname, filename.slice(sourceDirname.length));
      fs.mkdir(path.dirname(targetFilenameAbsolutePath), {recursive: true}, (error) => {
        if (error) return console.error(error.message);
        fs.copyFile(filename, targetFilenameAbsolutePath, (error) => {
          if (error) return console.error(error.message);
        });
      });
    });
  });
});