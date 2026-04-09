sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "close") {
        const shouldReconnect =
            lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
        if (shouldReconnect) startBot()
    } else if (connection === "open") {
        console.log("✅ Bot connected")

        // 🖼️ SET PROFILE PICTURE
        try {
            await sock.updateProfilePicture(sock.user.id, {
                url: "https://drive.google.com/uc?export=download&id=1nBwJhD0-Nn5446-E4dUKnZ5VVIbh0i43"
            })
            console.log("✅ Profile picture set")
        } catch (e) {
            console.log("❌ Error setting profile picture")
        }
    }
})
const isAutoMenu = true

sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ""

    const prefix = "."

    // 👋 AUTO WELCOME + MENU
    if (isAutoMenu && body && !body.startsWith(prefix)) {
        await sock.sendMessage(from, {
            text: `🤖 GAMINU MD BOT V10

👋 Welcome!

Type:
.menu → commands

⚡ Prefix: .`
        })
    }

    if (!body.startsWith(prefix)) return

    const args = body.slice(prefix.length).trim().split(" ")
    const command = args.shift().toLowerCase()

    if (command === "menu") {
        await sock.sendMessage(from, {
            text: `🤖 GAMINU MD BOT V10

🎧 .play <song>
🎵 .tiktok <link>
📝 .lyrics <song>
🌍 .trad <lang> <text>
👁️ .vv3
🛡️ .antidelete on/off
🚷 .antispam on/off
🛡️ .antivirus on/off`
        })
    }
})