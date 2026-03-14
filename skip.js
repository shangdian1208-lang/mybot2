const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("跳過音樂"),
  async execute(interaction) {
    interaction.reply("⏭ 已跳過音樂（暫未實作播放隊列）");
  }
};
