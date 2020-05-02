/**
 * Sets the least significant bit to 1 or 0 (depending on the bit to set)
 * @param {Number} b 
 * @param {{ r: Number, g: Number, b: Number }} pixel 
 * @param {Number} position 
 */
const packBit = (pixel, position, bit) => {
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

  if (bit) {
    pixel[color] |= 1;
  } else {
    pixel[color] &= ~1;
  }

  return pixel;
};

module.exports = packBit;
