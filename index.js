const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const P = require("pino")
const axios = require("axios")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: "silent" })
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) startBot()
        } else if (connection === "open") {
            console.log("✅ Bot connected")
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

        const args = body.slice(prefix.length).trim().split(" ")
        const command = args.shift().toLowerCase()

        try {

        // 📋 MENU
        if (command === "menu") {
            await sock.sendMessage(from, {
                text: `🤖 GAMINU MD BOT V10

🎧 .play <song>
🎵 .tiktok <link>
📝 .lyrics <song>
🌍 .trad <lang> <text>
👁️ .vv3-> VeuwOnce decode
🛡️ .antidelete on/off
🚷 .antispam on/off
🛡️ .antivirus on/off`
            })
        }

        // 🎧 YOUTUBE PLAY
        if (command === "play") {
            const query = args.join(" ")
            const res = await axios.get(`https://api.lyrics.ovh/suggest/${query}`)
            const data = res.data.data[0]

            await sock.sendMessage(from, {
                text: `🎧 Title: ${data.title}\n🎤 Artist: ${data.artist.name}\n🔗 ${data.preview}`
            })
        }

        // 🎵 TIKTOK DOWNLOAD (API example)
        if (command === "tiktok") {
            const link = args[0]
            const res = await axios.get(`https://api.tiklydown.me/api/download?url=${link}`)
            const video = res.data.video.noWatermark

            await sock.sendMessage(from, {
                video: { url: video },
                caption: "🎵 TikTok Download"
            })
        }

        // 📝 LYRICS
        if (command === "lyrics") {
            const song = args.join(" ")
            const res = await axios.get(`https://api.lyrics.ovh/v1/${song}`)
            await sock.sendMessage(from, {
                text: res.data.lyrics || "No lyrics found"
            })
        }

        // 🌍 TRANSLATION
        if (command === "trad") {
            const lang = args[0]
            const text = args.slice(1).join(" ")

            const res = await axios.post("https://libretranslate.de/translate", {
                q: text,
                source: "auto",
                target: lang,
                format: "text"
            })

            await sock.sendMessage(from, {
                text: `🌍 Translated:\n${res.data.translatedText}`
            })
        }

        // 👁️ VIEW ONCE (basic placeholder)
        if (command === "viewonce") {
            await sock.sendMessage(from, {
                text: "👁️ ViewOnce decode (requires advanced media handling)"
            })
        }

        // 🛡️ TOGGLES
        if (command === "antidelete") {
            await sock.sendMessage(from, { text: "🚫 Anti-delete toggled" })
        }

        if (command === "antispam") {
            await sock.sendMessage(from, { text: "🚷 Anti-spam toggled" })
        }

        if (command === "antivirus") {
            await sock.sendMessage(from, { text: "🛡️ Antivirus toggled" })
        }

        } catch (e) {
            console.log(e)
            await sock.sendMessage(from, { text: "❌ Error occurred" })
        }
    })
}

startBot()
const isAutoMenu = true // ou ka mete false si ou vle dezaktive

sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ""

    const prefix = "."
    if (!body) return

    // 📌 AUTO MENU (lè user voye premye mesaj)
    if (isAutoMenu) {
        if (body && !body.startsWith(prefix)) {
            await sock.sendMessage(from, {
                text: `🤖 GAMINU MD BOT V10

👋 Welcome!

Type:
.menu → to see commands

⚡ Prefix: .`
            })
        }
    }

    if (!body.startsWith(prefix)) return

    const args = body.slice(prefix.length).trim().split(" ")
    const command = args.shift().toLowerCase()

    // 👉 MENU COMMAND
    if (command === "menu") {
        await sock.sendMessage(from, {
            text: `🤖 GAMINU MD BOT V10

🎧 .play <song>
🎵 .tiktok <link>
📝 .lyrics <song>
🌍 .trad <lang> <text>
👁️ .vv3-> vuewOnce decode
🛡️ .antidelete on/off
🚷 .antispam on/off
🛡️ .antivirus on/off`
        })
    }

})