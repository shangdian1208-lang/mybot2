const { SlashCommandBuilder } = require("discord.js");
const db = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-ai-channel")
    .setDescription("設置 AI 聊天頻道")
    .addChannelOption(opt => opt.setName("channel").setDescription("選擇頻道").setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const data = db.readDB();
    if (!data.settings) data.settings = {};
    data.settings.aiChannel = channel.id;
    db.writeDB(data);
    interaction.reply(`✅ AI 聊天頻道已設置為 ${channel}`);
  }
};
