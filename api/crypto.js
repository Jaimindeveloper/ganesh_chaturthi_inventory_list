import CryptoJS from "crypto-js";

export default async function handler(req, res) {
    const allowedOrigin = "https://ganesh-chaturthi-inventory-list.vercel.app";

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Preflight request
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const keyBase64 = process.env.SECRET_KEY;
        const secretKey = atob(keyBase64);
        if (!secretKey) {
            return res.status(500).json({ error: "Missing SECRET_KEY" });
        }

        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const bytes = CryptoJS.AES.decrypt(text, secretKey);;
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        res.status(200).json({ decrypted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error", details: error.message });
    }
}