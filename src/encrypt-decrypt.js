const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const IV_LENGTH = 16;

function encrypt(text, password) {
    let key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, password) {
    let key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;