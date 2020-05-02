const jimp = require("jimp");
const crypto = require('crypto');
const digUpNextSection = require("./dig-up-section");
const embedSection = require("./embed-section");
const { encrypt, decrypt } = require('./encrypt-decrypt');

let _index = 0;
let _width = 0;
let _height = 0;
let _clone;
let _batch;

/**
 * extracts the embedded data from an image
 * @param {String} imageFileOrBuffer 
 * @param {String} password 
 * @returns {Promise<String>} the extracted text data
 */
const digUp = (imageFileOrBuffer, password) => {
  return new Promise((resolve, reject) => {

    jimp.read(imageFileOrBuffer, function (err, image) {
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

/**
 * embeds text data in an image.
 * @param {String|Buffer} imageFileOrBuffer 
 * @param {String} text the data to be embedded
 * @param {String} password encrypts the text data with this key
 * @returns {Promise<Buffer>}
 */
const embed = (imageFileOrBuffer, text, password) => {
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

    jimp.read(imageFileOrBuffer, function (err, image) {
      if (!err) {
        image.clone(function (err, clone) {
          if (!err) {
            _clone = clone;
            _width = clone.getWidth();
            _height = clone.getHeight();
            _batch = clone;

            embedSection(Buffer.from(modifiedPayload, 'utf8'), { _index, _width, _batch, _clone });

            clone.getBuffer('image/png', function (err, buffer) {
              if (err) reject(err);
              else resolve(buffer);
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

module.exports.digUp = digUp;
module.exports.embed = embed;