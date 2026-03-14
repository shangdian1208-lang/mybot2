const { SlashCommandBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-log-channel")
    .setDescription("設置日誌頻道"),
  async execute(interaction){
    interaction.reply("日誌頻道已設定！")
  }
}