/**
 * Reads the least significant bits of the pixel (Red, Green and Blue) and 
 * add them to the corresponding position of the byte being constructed
 * @param {Number} b 
 * @param {{ r: Number, g: Number, b: Number }} pixel 
 * @param {Number} position 
 */
const unpackBit = (b, pixel, position) => {
  let color;

  switch (position % 3) {
    case 0:
      color = 'r';
      break;
    case 1:
      color = 'g';
      break;
    case 2:
      color = 'b';
      break;
  }

  // if pixel is set
  if (pixel[color] & 1) {
    b |= 1 << (7 - position);
  }

  return b;
};

module.exports = unpackBit;