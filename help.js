const { SlashCommandBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("顯示指令列表"),
  async execute(interaction){
    interaction.reply("Bot 已正常運作！")
  }
}
