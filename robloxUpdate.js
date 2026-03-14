const cron = require("node-cron");
const axios = require("axios");
const db = require("../utils/database");

module.exports = (client) => {
  cron.schedule("0 */6 * * *", async () => { // 每 6 小時
    const data = db.readDB();
    if (!data.settings || !data.settings.robloxChannel) return;
    const channel = client.channels.cache.get(data.settings.robloxChannel);
    if (!channel) return;
    try {
      const rivals = await axios.get("https://api.example.com/rivals/update");
      const blox = await axios.get("https://api.example.com/bloxfruits/update");
      channel.send(`🎮 Roblox Rivals 更新: ${rivals.data.update}\n🍉 Blox Fruits 更新: ${blox.data.update}`);
    } catch(e){ console.error("Roblox 更新失敗:", e.message); }
  });
};
