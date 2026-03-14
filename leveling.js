const db = require("../utils/database");

module.exports = (client) => {
  client.on("messageCreate", msg => {
    if (msg.author.bot) return;
    const data = db.readDB();
    if (!data.users[msg.author.id]) data.users[msg.author.id] = { money:100, xp:0, level:1 };
    const user = data.users[msg.author.id];
    user.xp += 5;
    if (user.xp >= user.level*100) {
      user.level +=1;
      user.xp = 0;
      msg.channel.send(`🎉 <@${msg.author.id}> 升級了！目前等級: ${user.level}`);
    }
    db.writeDB(data);
  });
};
