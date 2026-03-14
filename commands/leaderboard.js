const { SlashCommandBuilder } = require("discord.js");
const db = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("查看金錢排行榜"),
  async execute(interaction) {
    const data = db.readDB();
    const list = Object.entries(data.users)
      .sort((a, b) => (b[1].money || 0) - (a[1].money || 0))
      .slice(0, 10);
    let text = "🏆 金幣排行榜\n";
    list.forEach(([id, user], i) => {
      text += `${i + 1}. <@${id}> - ${user.money || 0}💰\n`;
    });
    interaction.reply(text);
  }
};
