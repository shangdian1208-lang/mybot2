const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("測試 Bot 延遲"),
  async execute(interaction) {
    const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
    interaction.editReply(`延遲: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  }
};
