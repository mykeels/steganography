const jimp = require("jimp");
const fs = require("fs");
const crypto = require('crypto');
const digUpNextSection = require("./dig-up-section");
const embedSection = require("./embed-section");

let _index = 0;
let _width = 0;
let _height = 0;
let _clone;
let _batch;
let _password;

module.exports.digUp = (imageFile, outputFolder, password) => {
  return new Promise((resolve, reject) => {
    _password = password ? password : null;

    jimp.read(imageFile, function (err, image) {
      if (!err) {
        _width = image.width();
        _height = image.height();
        _clone = image;

        const buffer = digUpNextSection({
          _index,
          _width,
          _height,
          _clone,
          _password,
        });
        const embededShasum = digUpNextSection({
          _index,
          _width,
          _height,
          _clone,
          _password,
        });
        const bufferShasum = crypto.createHash("sha1");
        bufferShasum.update(buffer);
        const output = outputFolder ? outputFolder : ".";

        if (embededShasum.equals(bufferShasum.digest())) {
            resolve(buffer.toString());
        } else {
          reject(new Error('could not verify Shasum'));
        }
      } else {
        reject(err);
      }
    });
  });
};

module.exports.embed = (imageFile, text, outputFile, password) => {
  return new Promise((resolve, reject) => {
    _password = password ? password : null;

    const data = Buffer.from(text, 'utf8');

    var shasum = crypto.createHash("sha1");
    shasum.update(data);

    jimp.read(imageFile, function (err, image) {
      if (!err) {
        image.clone(function (err, clone) {
          if (!err) {
            _clone = clone;
            _width = clone.getWidth();
            _height = clone.getHeight();
            _batch = clone;

            embedSection(data, { _index, _width, _batch, _clone, _password });
            embedSection(shasum.digest(), { _index, _width, _batch, _clone, _password });

            outputFile = outputFile ? outputFile : "output";

            clone.write(outputFile + ".png", function (err) {
              if (err) {
                reject(err);
              }
              resolve();
            });
          } else {
            reject(err);
          }
        });
      } else {
        reject(err);
      }
    });
  });
};
