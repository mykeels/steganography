const { expect } = require("chai");
const path = require("path");
const Jimp = require("jimp");

Jimp.read(path.join(__dirname, "./images/trianglify.png"), (err, img1) => {
  if (err) throw err;

  const img1Width = img1.getWidth();
  const img1Height = img1.getHeight();

  console.log({
    img1Width,
    img1Height,
  });

  Jimp.read(path.join(__dirname, "./images/output.png"), (err, img2) => {
    if (err) throw err;

    const img2Width = img2.getWidth();
    const img2Height = img2.getHeight();

    console.log({
      img2Width,
      img2Height,
    });

    expect(img1Width).to.eql(img2Width);
    expect(img1Height).to.eql(img2Height);

    let index = 0;

    const width = img1Width;

    while (index < 500) {
      for (var i = 0; i < 8; i++) {
        if (i % 3 == 0) {
          const hex1 = img1.getPixelColor(
            index % width,
            Math.floor(index / width)
          );
          const hex2 = img2.getPixelColor(
            index % width,
            Math.floor(index / width)
          );
          console.log(Jimp.intToRGBA(hex1), Jimp.intToRGBA(hex2));
          index++;
        }
      }
    }
  });
});
