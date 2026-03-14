const { SlashCommandBuilder } = require("discord.js");
const db = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-roblox-channel")
    .setDescription("設置 Roblox 更新頻道")
    .addChannelOption(opt => opt.setName("channel").setDescription("選擇頻道").setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const data = db.readDB();
    if (!data.settings) data.settings = {};
    data.settings.robloxChannel = channel.id;
    db.writeDB(data);
    interaction.reply(`✅ Roblox 更新頻道已設置為 ${channel}`);
  }
};
