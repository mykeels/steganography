# @mykeels/steganography

Inspired by [rodrigouroz/steganography](https://github.com/rodrigouroz/steganography).

This tool lets you hide and retrieve text data to/from an image. It's useful when you want to send information between parties and do not want it scrutinized by external parties.

## Installation

Run `npm i @mykeels/steganography` or `yarn add @mykeels/steganography` to install.

## Usage

To embed data, you'll need an image to embed the data in.

```js
const path = require('path');
const fs = require('fs');
const { embed } = require('@mykeels/steganography');

(async () => {
    const buffer = await embed(
        path.join(__dirname, './path/to/input.png'), 
        `This is my message to the world. Love, Joy and Happiness!`,
        'YOUR_PASSWORD_HERE'
    );

    fs.writeFileSync(
        path.join(__dirname, './path/to/output.png'),
        buffer
    );
})();
```

To retrieve data, you'll need an image that has data embeded in it.

```js
const path = require('path');
const { digUp } = require('@mykeels/steganography');

(async () => {
    const text = await digUp(
        path.join(__dirname, './path/to/output.png'),
        'YOUR_PASSWORD_HERE'
    );

    console.log(text);
})();
```

### NB

- The password argument is optional.