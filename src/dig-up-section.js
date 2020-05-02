const crypto = require('crypto');
const unpackBit = require('./unpack-bit');

/**
 * Reads the next section (a section ends when the least significant bit of the 
 * blue component of the third pixel is 0) 
 * See http://domnit.org/blog/2007/02/stepic-explanation.html
 * @param {{ _index: Number, _width: Number, _height: Number, _clone, _password: String }} param0 
 */
const digUpNextSection = ({ _index, _width, _height, _clone, _password }) => {
  var b;
  var pixel;
  var buffer = [];

  while (_index < _width * _height) {
    b = 0;
    for (var i = 0; i < 8; i++) {
      if (i % 3 == 0) {
        pixel = _clone.getPixelColor(_index % _width, Math.floor(_index / _width));
        _index++;
      }
      b = unpackBit(b, pixel, i);
    }

    buffer.push(b);
    if (pixel.b & 1) {
      break;
    }
  }

  buffer = new Buffer(buffer);

  if (_password) {
    var decipher = crypto.createDecipher("aes-256-ctr", _password);
    buffer = Buffer.concat([decipher.update(buffer), decipher.final()]);
  }

  return buffer;
};

module.exports = digUpNextSection;
