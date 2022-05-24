const fs = require('fs');
const path = require('path');

const stylesSourceDirname = path.join(__dirname, 'styles');
const htmlSourceTemplateFilename = path.join(__dirname, 'template.html');
const htmlSourceComponentsDirname = path.join(__dirname, 'components');
const assetsSourceDirname = path.join(__dirname, 'assets');

const targetDirname = path.join(__dirname, 'project-dist');
const stylesTargetFilename = path.join(targetDirname, 'style.css');
const htmlTargetFilename = path.join(targetDirname, 'index.html');
const assetsTargetDirname = path.join(targetDirname, 'assets');

fs.rm(targetDirname, {recursive: true}, () => {

  // блок обработки HTML-страниц

  fs.mkdir(targetDirname, {recursive: true}, (error) => {
    if (error) return console.error(error.message);
    fs.readdir(htmlSourceComponentsDirname, {withFileTypes: true}, (error, dirents) => {
      if (error) return console.error(error.message);
      const filenames = [];
      for (const dirent of dirents) {
        if (dirent.isFile() && path.extname(dirent.name) === '.html') {
          filenames.push(path.join(htmlSourceComponentsDirname, dirent.name));
        }
      }
      const availableComponents = filenames.map(filename => path.parse(filename).name);

      fs.readFile(htmlSourceTemplateFilename, 'utf-8', (error, templateContent) => {
        if (error) return console.error(error.message);
        for(const filename of filenames) {
          const component = path.parse(filename).name;
          if (templateContent.includes(`{{${component}}}`)) {
            fs.readFile(filename, 'utf-8', (error, componentContent) => {
              if (error) return console.error(error.message);
              const regex = new RegExp(`{{${component}}}`, 'g');
              templateContent = templateContent.replace(regex, componentContent);
              if (availableComponents.every(currComponent => !templateContent.includes(`{{${currComponent}}}`))) {
                fs.writeFile(htmlTargetFilename, templateContent, 'utf-8', (error) => {
                  if (error) return console.error(error.message);
                });
              }
            });
          }
        }
      });

    });
  });

  // блок обработки стилей

  fs.readdir(stylesSourceDirname, {withFileTypes: true}, (error, dirents) => {
    if (error) return console.error(error.message);
    const filenames = [];
    for (const dirent of dirents) {
      if (dirent.isFile() && path.extname(dirent.name) === '.css') {
        filenames.push(path.join(stylesSourceDirname, dirent.name));
      }
    }
    filenames.forEach((filename) => {
      fs.readFile(filename, 'utf-8', (error, data) => {
        if (error) return console.error(error.message);
        fs.appendFile(stylesTargetFilename, data, (error) => {
          if (error) return console.error(error.message);
        });
      });
    });
  });

  // блок обработки дополнительных материалов

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

  getDirnames(assetsSourceDirname, (error, filenames) => {
    if (error) return console.error(error.message);
    filenames.forEach(filename => {
      const targetFilenameAbsolutePath = path.join(assetsTargetDirname, filename.slice(assetsSourceDirname.length));
      fs.mkdir(path.dirname(targetFilenameAbsolutePath), {recursive: true}, (error) => {
        if (error) return console.error(error.message);
        fs.copyFile(filename, targetFilenameAbsolutePath, (error) => {
          if (error) return console.error(error.message);
        });
      });
    });
  });

});
