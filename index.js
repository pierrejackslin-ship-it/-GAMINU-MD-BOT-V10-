const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const P = require("pino")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: "silent" })
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

            if (shouldReconnect) {
                startBot()
            }
        } else if (connection === "open") {
            console.log("✅ Bot connected!")
        }
    })

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const from = msg.key.remoteJid
        const body =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            ""

        const prefix = "."
        if (!body.startsWith(prefix)) return

        const command = body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
        const args = body.split(" ").slice(1)

        // 📋 MENU
        if (command === "menu") {
            await sock.sendMessage(from, {
                text: `
🤖 GAMINU MD BOT V10

🎧 .play
🎵 .tiktok
📝 .lyrics
🌍 .trad
🛡️ .antidelete
🚷 .antispam
🛡️ .antivirus
👁️ .viewonce
📊 Auto status
                `
            })
        }

        // 🎧 PLAY (placeholder)
        if (command === "play") {
            const query = args.join(" ")
            await sock.sendMessage(from, { text: `🔎 Searching: ${query}` })
        }

        // 🌍 TRANSLATE (placeholder)
        if (command === "trad") {
            const lang = args[0]
            const text = args.slice(1).join(" ")
            await sock.sendMessage(from, {
                text: `🌍 Translate to ${lang}: ${text}`
            })
        }

        // 🎵 TIKTOK (placeholder)
        if (command === "tiktok") {
            const link = args[0]
            await sock.sendMessage(from, {
                text: `📥 Downloading TikTok: ${link}`
            })
        }

        // 📝 LYRICS (placeholder)
        if (command === "lyrics") {
            const song = args.join(" ")
            await sock.sendMessage(from, {
                text: `🎶 Lyrics for: ${song}`
            })
        }

        // 👁️ VIEWONCE (basic placeholder)
        if (command === "viewonce") {
            await sock.sendMessage(from, {
                text: "👁️ ViewOnce decode feature (to implement)"
            })
        }

        // 🛡️ TOGGLES (placeholders)
        if (command === "antidelete") {
            await sock.sendMessage(from, {
                text: "🚫 Anti-delete toggled (logic to implement)"
            })
        }

        if (command === "antispam") {
            await sock.sendMessage(from, {
                text: "🚷 Anti-spam toggled (logic to implement)"
            })
        }

        if (command === "antivirus") {
            await sock.sendMessage(from, {
                text: "🛡️ Antivirus toggled (logic to implement)"
            })
        }
    })
}

startBot()