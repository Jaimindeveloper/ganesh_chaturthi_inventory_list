const CryptoJS = require("crypto-js");

module.exports = (req, res) => {
    const keyBase64 = process.env.SECRET_KEY;
    const secretKey = atob(keyBase64);
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { text } = JSON.parse(body);
            const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
            const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ encrypted, decrypted }));
        });
    } else {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
}