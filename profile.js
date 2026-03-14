const { SlashCommandBuilder } = require("discord.js");
const db = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("查看個人資料"),
  async execute(interaction) {
    const data = db.readDB();
    const user = data.users[interaction.user.id] || { level: 1, xp: 0, money: 100 };
    interaction.reply(`💰 金幣: ${user.money}\n⭐ 等級: ${user.level}\n✨ 經驗: ${user.xp}`);
  }
};
