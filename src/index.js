const jimp = require("jimp");
const fs = require("fs");
const crypto = require('crypto');
const digUpNextSection = require("./dig-up-section");
const embedSection = require("./embed-section");
const { encrypt, decrypt } = require('./encrypt-decrypt');

let _index = 0;
let _width = 0;
let _height = 0;
let _clone;
let _batch;

module.exports.digUp = (imageFile, password) => {
  return new Promise((resolve, reject) => {

    jimp.read(imageFile, function (err, image) {
      if (!err) {
        _width = image.getWidth();
        _height = image.getHeight();
        _clone = image;

        const buffer = digUpNextSection({
          _index,
          _width,
          _height,
          _clone,
        });
        const payloadText = buffer.toString('utf8');
        const modifiedPayloadText = password ? decrypt(payloadText, password) : payloadText
        const payload = JSON.parse(modifiedPayloadText);
        
        const textBuffer = Buffer.from(payload.text, 'utf8');
        const textBufferShasum = crypto.createHash("sha1");
        textBufferShasum.update(textBuffer);

        if (textBufferShasum.digest().equals(Buffer.from(payload.hash))) {
            resolve(payload.text);
        }
        else {
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

    const textBuffer = Buffer.from(text, 'utf8');

    var shasum = crypto.createHash("sha1");
    shasum.update(textBuffer);

    const payload = JSON.stringify({
        text,
        hash: shasum.digest()
    }, null, 2);

    console.log(payload);

    const modifiedPayload = password ? encrypt(payload, password) : payload;

    jimp.read(imageFile, function (err, image) {
      if (!err) {
        image.clone(function (err, clone) {
          if (!err) {
            _clone = clone;
            _width = clone.getWidth();
            _height = clone.getHeight();
            _batch = clone;

            embedSection(Buffer.from(modifiedPayload, 'utf8'), { _index, _width, _batch, _clone });

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
