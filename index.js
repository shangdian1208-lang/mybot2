// index.js
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

// ===== 設定 =====
const OWNER_ID = "你的DiscordID"; // ⚠️ 改成你自己的ID
const YT_CHANNEL_ID = "你的YT頻道ID"; // ⚠️ 追蹤的YouTube頻道ID

// ===== DB =====
const DB="./db.json";
const read=()=>fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB)):{users:{},settings:{},spam:{},eq:{},yt:{},ai:{},logs:{},gacha:{}};
const write=d=>fs.writeFileSync(DB,JSON.stringify(d,null,2));

// ===== BOT =====
const client=new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ===== 指令列表 =====
const commands=[
  new SlashCommandBuilder().setName("ping").setDescription("測試"),
  new SlashCommandBuilder().setName("help").setDescription("指令列表"),
  new SlashCommandBuilder().setName("daily").setDescription("每日金幣"),
  new SlashCommandBuilder().setName("profile").setDescription("個人資料"),
  new SlashCommandBuilder().setName("rps").setDescription("剪刀石頭布")
    .addStringOption(o=>o.setName("choice")
      .addChoices(
        {name:"石頭",value:"rock"},
        {name:"剪刀",value:"scissors"},
        {name:"布",value:"paper"}
      ).setRequired(true)),
  new SlashCommandBuilder().setName("gacha").setDescription("扭蛋"),
  new SlashCommandBuilder().setName("set-welcome-channel").setDescription("設定歡迎頻道").addChannelOption(o=>o.setName("ch").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("set-leave-channel").setDescription("設定離開頻道").addChannelOption(o=>o.setName("ch").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("set-earthquake-channel").setDescription("設定地震頻道").addChannelOption(o=>o.setName("ch").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("set-announcement-channel").setDescription("設定公告頻道").addChannelOption(o=>o.setName("ch").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("broadcast").setDescription("全域公告").addStringOption(o=>o.setName("msg").setRequired(true)),
  new SlashCommandBuilder().setName("set-ai-channel").setDescription("設定AI聊天頻道").addChannelOption(o=>o.setName("ch").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("set-yt-channel").setDescription("設定YouTube發片頻道").addChannelOption(o=>o.setName("ch").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("set-weather-channel").setDescription("設定天氣頻道").addChannelOption(o=>o.setName("ch").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("set-meme-channel").setDescription("設定梗圖頻道").addChannelOption(o=>o.setName("ch").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder().setName("set-logs-channel").setDescription("設定日誌頻道").addChannelOption(o=>o.setName("ch").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
].map(c=>c.toJSON());

// ===== 註冊指令 =====
const rest=new REST({version:"10"}).setToken(process.env.TOKEN);
(async()=>{
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID),{body:commands});
  console.log("✅ 指令註冊完成");
})();

// ===== 上線 =====
client.once("ready",()=>console.log("🤖 Bot 上線"));

// ===== 進出訊息 =====
client.on("guildMemberAdd",m=>{
  const db=read();
  const ch=client.channels.cache.get(db.settings.welcome);
  if(ch) ch.send(`👋 歡迎 ${m}`);
});
client.on("guildMemberRemove",m=>{
  const db=read();
  const ch=client.channels.cache.get(db.settings.leave);
  if(ch) ch.send(`😢 ${m.user.tag} 離開了`);
});

// ===== 指令互動 =====
client.on("interactionCreate",async i=>{
  if(!i.isChatInputCommand()) return;
  const db=read();
  const u=i.user.id;
  if(!db.users[u]) db.users[u]={money:100,last:0};

  // ===== 基本 =====
  if(i.commandName==="ping") return i.reply("🏓 pong");
  if(i.commandName==="help") return i.reply("📜 指令: /daily /profile /rps /gacha /broadcast /set-ai-channel /set-yt-channel /set-weather-channel /set-meme-channel");

  // ===== 設定指令 =====
  const adminCmds=["set-welcome-channel","set-leave-channel","set-earthquake-channel","set-announcement-channel","set-ai-channel","set-yt-channel","set-weather-channel","set-meme-channel","set-logs-channel"];
  if(adminCmds.includes(i.commandName)){
    db.settings[i.commandName.replace("set-","").replace("-channel","")]=i.options.getChannel("ch").id;
    write(db);
    return i.reply(`✅ 設定完成: ${i.commandName}`);
  }

  // ===== 經濟 =====
  if(i.commandName==="daily"){ if(Date.now()-db.users[u].last<86400000) return i.reply("今天領過"); db.users[u].money+=100; db.users[u].last=Date.now(); write(db); return i.reply("+100金幣"); }
  if(i.commandName==="profile"){ return i.reply(`💰 ${db.users[u].money}`); }

  // ===== 遊戲 =====
  if(i.commandName==="rps"){
    const cost=30;if(db.users[u].money<cost) return i.reply("錢不夠");
    db.users[u].money-=cost;
    const choice=i.options.getString("choice");
    const bot=["rock","paper","scissors"][Math.floor(Math.random()*3)];
    let result="平手";
    if((choice==="rock"&&bot==="scissors")||(choice==="paper"&&bot==="rock")||(choice==="scissors"&&bot==="paper")){ db.users[u].money+=50; result="你贏了 +50"; }
    else if(choice!==bot){ db.users[u].money-=20; result="你輸了 -20"; }
    write(db); return i.reply(`你:${choice} Bot:${bot}\n${result}`);
  }
  if(i.commandName==="gacha"){ const cost=30;if(db.users[u].money<cost) return i.reply("錢不夠"); db.users[u].money-=cost; const n=Math.floor(Math.random()*201)-100; db.users[u].money+=n; write(db); return i.reply(`🎰 ${n}`); }

  // ===== 全域公告 =====
  if(i.commandName==="broadcast"){
    if(i.user.id !== OWNER_ID) return i.reply({content:"❌ 只有擁有者可用",ephemeral:true});
    const msg=i.options.getString("msg"); let count=0;
    for(const guild of client.guilds.cache.values()){
      try{
        let ch; const setting=db.settings[guild.id];
        if(setting?.announce){ ch=guild.channels.cache.get(setting.announce); }
        if(!ch){ ch=guild.channels.cache.find(c=>c.isTextBased()); }
        if(ch){ await ch.send(`📢 全域公告\n${msg}`); count++; }
      }catch(e){}
    }
    return i.reply(`✅ 發送成功 ${count} 個伺服器`);
  }
});

// ===== 防炸/防刷 =====
client.on("messageCreate",async msg=>{
  if(msg.author.bot) return;
  if(msg.content.includes("@everyone")){ msg.delete().catch(()=>{}); return; }
  const db=read(); const u=msg.author.id;
  if(!db.spam[u]) db.spam[u]={c:0}; db.spam[u].c++; if(db.spam[u].c>5){ msg.delete().catch(()=>{}); return; } setTimeout(()=>db.spam[u].c=0,5000); write(db);

  // ===== AI聊天 =====
  if(db.settings.ai && msg.channel.id===db.settings.ai){
    try{
      const res=await axios.post("https://api.openai.com/v1/chat/completions",{model:"gpt-3.5-turbo",messages:[{role:"user",content:msg.content}]},{headers:{Authorization:`Bearer ${process.env.OPENAI_KEY}`}});
      msg.reply(res.data.choices[0].message.content);
    }catch(e){ console.log("AI Error:",e.message); }
  }
});

// ===== 地震系統 =====
async function checkEQ(){
  const db=read(); if(!db.settings.earthquake) return;
  try{
    const res=await axios.get("https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0016-001?Authorization=你的KEY");
    const eq=res.data.records.Earthquake[0]; const id=eq.EarthquakeNo;
    if(db.eq.last===id) return; db.eq.last=id; write(db);
    const ch=client.channels.cache.get(db.settings.earthquake);
    if(ch) ch.send(`🌏 地震速報！\n地點：${eq.EarthquakeInfo.Epicenter.Location}\n規模：${eq.EarthquakeInfo.EarthquakeMagnitude.MagnitudeValue}\n時間：${eq.EarthquakeInfo.OriginTime}`);
  }catch(e){}
}
setInterval(checkEQ,60000);

// ===== YouTube 發片通知 =====
async function checkYT(){
  const db=read(); if(!db.settings.yt) return;
  try{
    const res=await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${process.env.YT_API}&channelId=${YT_CHANNEL_ID}&order=date&part=snippet&type=video&maxResults=1`);
    const latest=res.data.items[0]; if(!latest) return;
    if(db.yt.last===latest.id.videoId) return; db.yt.last=latest.id.videoId; write(db);
    const ch=client.channels.cache.get(db.settings.yt);
    if(ch) ch.send(`📺 新影片發佈！\n${latest.snippet.title}\nhttps://www.youtube.com/watch?v=${latest.id.videoId}`);
  }catch(e){ console.log("YT通知錯誤"); }
}
setInterval(checkYT,60000);

// ===== 啟動 =====
client.login(process.env.TOKEN);
