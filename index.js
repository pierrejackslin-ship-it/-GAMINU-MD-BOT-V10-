const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("sessions");

    const sock = makeWASocket({
        auth: state
    });

    sock.ev.on("connection.update", (update) => {
        const { qr, connection } = update;

        if (qr) {
            qrcode.generate(qr, { small: true });
        }

        if (connection === "open") {
            console.log("Bot konekte ✅");
        }
    });

    sock.ev.on("creds.update", saveCreds);
}

startBot();