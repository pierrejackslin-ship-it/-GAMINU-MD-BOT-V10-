 const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const QRCode = require('qrcode');

const app = express();
let qrCodeData = "";

// WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR event
client.on('qr', async (qr) => {
    qrCodeData = await QRCode.toDataURL(qr);
});

// ready
client.on('ready', () => {
    console.log('Bot konekte ✅');
});

// messages
client.on('message', message => {
    if (message.body === 'hi') {
        message.reply('Hello 👋 mwen sou web!');
    }
});

// route web
app.get('/', (req, res) => {
    if (!qrCodeData) {
        return res.send("⏳ Ap tann QR code...");
    }

    res.send(`
        <h1>Scan QR Code</h1>
        <img src="${qrCodeData}" />
    `);
});

// ⚠️ PORT FIX (ENPÒTAN)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Web server ap mache sou port " + PORT);
});

// start bot
client.initialize();