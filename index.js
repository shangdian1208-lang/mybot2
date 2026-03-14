// index.js
const { Client, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
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
const commands = [];

// 讀取 commands 資料夾
fs.readdirSync('./commands').filter(f => f.endsWith(".js")).forEach(file => {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
  commands.push(cmd.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const clientId = process.env.CLIENT_ID;

// -------- 全域指令註冊（所有伺服器） --------
(async () => {
  try {
    console.log("開始註冊全域指令...");
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );
    console.log("全域指令註冊完成！");
  } catch (err) {
    console.error(err);
  }
})();

// -------- Bot 上線 --------
client.once("ready", () => {
  console.log(`Bot 已上線 ${client.user.tag}`);
});

// -------- 當 Bot 加入新伺服器時，自動註冊該伺服器指令 --------
client.on("guildCreate", guild => {
  (async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guild.id),
        { body: commands }
      );
      console.log(`指令已註冊到新伺服器: ${guild.name}`);
    } catch (err) {
      console.error(err);
    }
  })();
});

// -------- 指令互動事件 --------
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "❌ 指令執行錯誤！", ephemeral: true });
  }
});

// -------- 登入 Bot --------
client.login(process.env.TOKEN);
