const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-role-panel")
    .setDescription("生成身分組按鈕"),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId("role1").setLabel("身分組1").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("role2").setLabel("身分組2").setStyle(ButtonStyle.Success)
      );
    await interaction.reply({ content:"請點擊按鈕領取身分組", components:[row] });
  }
};
