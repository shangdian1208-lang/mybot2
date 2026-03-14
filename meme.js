const axios = require("axios");
const cron = require("node-cron");
const db = require("../utils/database");

module.exports = (client) => {
  cron.schedule("*/30 * * * *", async () => { // 每 30 分鐘
    const data = db.readDB();
    if (!data.settings || !data.settings.memeChannel) return;
    const channel = client.channels.cache.get(data.settings.memeChannel);
    if (!channel) return;
    try {
      const res = await axios.get("https://some-random-api.ml/meme");
      channel.send(res.data.caption + "\n" + res.data.image);
    } catch (e) {
      console.error("梗圖發送失敗:", e.message);
    }
  });
};
