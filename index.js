const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection();

// 載入指令
["commands", "admin", "music", "role"].forEach(folder => {
  if (!fs.existsSync(`./${folder}`)) return;
  fs.readdirSync(`./${folder}`).filter(f => f.endsWith(".js")).forEach(file => {
    const cmd = require(`./${folder}/${file}`);
    client.commands.set(cmd.data.name, cmd);
  });
});

// Bot 上線
client.once("ready", () => console.log(`Bot 已上線 ${client.user.tag}`));

// 指令互動
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try { await cmd.execute(interaction, client); }
  catch (err) { console.error(err); interaction.reply({ content:"指令錯誤", ephemeral:true }); }
});

// 載入系統
["systems"].forEach(folder => {
  if (!fs.existsSync(`./${folder}`)) return;
  fs.readdirSync(`./${folder}`).filter(f => f.endsWith(".js")).forEach(file => require(`./${folder}/${file}`)(client));
});

client.login(process.env.TOKEN);
