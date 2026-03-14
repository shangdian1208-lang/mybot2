const cron = require("node-cron");
const db = require("../utils/database");

module.exports = (client) => {
  // 這裡可擴展自動生成商店道具或每日活動
  client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    // 簡單範例：金幣商店
    if (interaction.commandName === "buy-x2") {
      const data = db.readDB();
      const id = interaction.user.id;
      if (!data.users[id]) data.users[id] = { money:100,level:1,xp:0 };
      if (data.users[id].money < 1000) return interaction.reply("❌ 金幣不足！");
      data.users[id].money -= 1000;
      data.users[id].x2 = true;
      db.writeDB(data);
      interaction.reply("✅ 已購買金幣 x2 通行證！");
    }
  });
};
