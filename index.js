const { Client, GatewayIntentBits, Collection } = require("discord.js")
const fs = require("fs")

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
})

client.commands = new Collection()

const folders = ["commands", "admin", "music", "role"]

for (const folder of folders) {
  if (!fs.existsSync(`./${folder}`)) continue
  const files = fs.readdirSync(`./${folder}`).filter(f => f.endsWith(".js"))
  for (const file of files) {
    const command = require(`./${folder}/${file}`)
    client.commands.set(command.data.name, command)
  }
}

client.once("clientReady", () => {
  console.log(`Bot已上線 ${client.user.tag}`)
})

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return
  const command = client.commands.get(interaction.commandName)
  if (!command) return
  try {
    await command.execute(interaction, client)
  } catch (err) {
    console.error(err)
    interaction.reply({ content: "指令錯誤", ephemeral: true })
  }
})

// 載入系統
const systemFolders = ["systems"]
for (const folder of systemFolders) {
  if (!fs.existsSync(`./${folder}`)) continue
  const files = fs.readdirSync(`./${folder}`).filter(f => f.endsWith(".js"))
  for (const file of files) {
    require(`./${folder}/${file}`)(client)
  }
}

client.login(process.env.TOKEN)
