const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// kreye client la
const client = new Client({
    authStrategy: new LocalAuth()
});

// lè gen QR
client.on('qr', (qr) => {
    console.log('Scan QR code la:');
    qrcode.generate(qr, { small: true });
});

// lè li pare
client.on('ready', () => {
    console.log('Bot la pare ✅');
});

// repons otomatik
client.on('message', message => {
    if (message.body === 'hi') {
        message.reply('Hello 👋 mwen se bot ou!');
    }

    if (message.body === 'menu') {
        message.reply('📜 Menu:\n- hi\n- menu\n- ping');
    }

    if (message.body === 'ping') {
        message.reply('pong 🏓');
    }
});

// lanse bot la
client.initialize();