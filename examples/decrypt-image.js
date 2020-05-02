const path = require('path');
const { digUp } = require('../src/index');

(async () => {
    const text = await digUp(
        path.join(__dirname, './images/output.png'),
        'password-password-password'
    );

    console.log(text);
})();