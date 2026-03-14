const { SlashCommandBuilder } = require("discord.js");
const db = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-log-channel")
    .setDescription("設置日誌頻道")
    .addChannelOption(opt => opt.setName("channel").setDescription("選擇頻道").setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const data = db.readDB();
    if (!data.settings) data.settings = {};
    data.settings.logChannel = channel.id;
    db.writeDB(data);
    interaction.reply(`✅ 日誌頻道已設置為 ${channel}`);
  }
};
