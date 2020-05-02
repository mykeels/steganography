const path = require('path');
const { embed } = require('../src/index');

(async () => {
    await embed(
        path.join(__dirname, './images/trianglify.png'), 
        `This is my message to the world. Love, Joy and Happiness!`,
        path.join(__dirname, './images/output'),
        'password-password-password'
    );
})();