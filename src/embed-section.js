const crypto = require('crypto');
const packBit = require('./pack-bit');

/**
 * Reads the next section (a section ends when the least significant bit of the 
 * blue component of the third pixel is 0) 
 * See http://domnit.org/blog/2007/02/stepic-explanation.html
 * @param {Buffer} buffer
 * @param {{ _index: Number, _width: Number, _batch, _clone, _password: String }} param1 
 */
const embedSection = (buffer, { _index, _width, _batch, _clone, _password }) => {
  let pixel;

  if (_password) {
    const cipher = crypto.createCipher("aes-256-ctr", _password);
    buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);
  }

  let bit;

  for (var i = 0; i < buffer.length; i++) {
    const octect = buffer[i];

    for (var j = 0; j < 8; j++) {
      if (j % 3 == 0) {
        if (pixel) {
          _batch.setPixelColor(_index % _width, Math.floor(_index / _width), pixel);
          _index++;
        }
        pixel = _clone.getPixelColor(_index % _width, Math.floor(_index / _width));
      }
      if (octect & (1 << (7 - j))) {
        bit = 1;
      } else {
        bit = 0;
      }
      pixel = packBit(pixel, j, bit);
    }

    if (i == buffer.length - 1) {
      pixel.b |= 1;
    } else {
      pixel.b &= ~1;
    }

    _batch.setPixelColor(_index % _width, Math.floor(_index / _width), pixel);
    _index++;
    pixel = undefined;
  }
};

module.exports = embedSection;
