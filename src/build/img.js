const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminWebp = require("imagemin-webp");
const path = require("path");
const fs = require("fs");
const move = require("move-concurrently");

(async () => {
  const webpfiles = await imagemin(["../img/unoptimized/*.{jpg,png}"], {
    destination: "../img/optimized",
    plugins: [imageminWebp({ quality: 50 })],
  });

  const backupfiles = await imagemin(["../img/unoptimized/*.{jpg,png}"], {
    destination: "../img/optimized",
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  const directoryPath = path.join(
    __dirname.replace("/build", ""),
    "img/unoptimized/"
  );

  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    console.log(directoryPath);
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      if (file.indexOf(".") !== 0) {
        console.log(file);
        move(
          directoryPath + file,
          directoryPath + file.replace("/unoptimized/", "/original/")
        )
          .then(() => {
            // thing is now moved!
          })
          .catch((err) => {
            // oh no!
          });
      }
    });
  });

  // console.log(backupfiles);
  // console.log(webpfiles);
  //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
})();
