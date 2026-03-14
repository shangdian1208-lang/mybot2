module.exports = (client) => {
  const userMessages = new Map();

  client.on("messageCreate", msg => {
    if (msg.author.bot) return;
    const now = Date.now();
    const arr = userMessages.get(msg.author.id) || [];
    arr.push(now);
    userMessages.set(msg.author.id, arr.filter(t => now - t < 5000)); // 5秒內訊息
    if (userMessages.get(msg.author.id).length > 5) { // 超過 5 則視為刷屏
      msg.channel.send(`<@${msg.author.id}> 請不要刷屏！`);
      msg.delete().catch(()=>{});
    }
  });
};
