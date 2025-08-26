export default function handler(req, res) {
    const CryptoJS = require("crypto-js");
    const keyBase64 = process.env.SECRET_KEY; // Environment variable
    const secretKey = atob(keyBase64);
    if (req.method === 'POST') {
        const { text, action } = req.body;

        if (action === 'encrypt') {
            const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
            res.status(200).json({ result: encrypted });
        } else if (action === 'decrypt') {
            try {
                const bytes = CryptoJS.AES.decrypt(text, secretKey);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                res.status(200).json({ result: decrypted });
            } catch (error) {
                res.status(400).json({ error: 'Decryption failed' });
            }
        } else {
            res.status(400).json({ error: 'Invalid action' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}