const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

// ===== DB =====
const DB="./db.json";
const read=()=>fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB)):{users:{},settings:{},spam:{},eq:{}};
const write=d=>fs.writeFileSync(DB,JSON.stringify(d,null,2));

// ===== BOT =====
const client=new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== 指令 =====
const commands=[

  // 基本
  new SlashCommandBuilder().setName("ping").setDescription("測試"),
  new SlashCommandBuilder().setName("help").setDescription("指令"),

  // 設定
  new SlashCommandBuilder()
    .setName("set-welcome-channel")
    .setDescription("設定歡迎頻道")
    .addChannelOption(o=>o.setName("ch").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("set-leave-channel")
    .setDescription("設定離開頻道")
    .addChannelOption(o=>o.setName("ch").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("set-earthquake-channel")
    .setDescription("設定地震頻道")
    .addChannelOption(o=>o.setName("ch").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // 經濟
  new SlashCommandBuilder().setName("daily").setDescription("每日"),
  new SlashCommandBuilder().setName("profile").setDescription("資料"),

  // 遊戲
  new SlashCommandBuilder()
    .setName("rps")
    .setDescription("剪刀石頭布")
    .addStringOption(o=>
      o.setName("選擇")
        .addChoices(
          {name:"石頭",value:"rock"},
          {name:"剪刀",value:"scissors"},
          {name:"布",value:"paper"}
        )
        .setRequired(true)
    ),

  new SlashCommandBuilder().setName("gacha").setDescription("扭蛋")

].map(c=>c.toJSON());

// ===== 註冊 =====
const rest=new REST({version:"10"}).setToken(process.env.TOKEN);
(async()=>{await rest.put(Routes.applicationCommands(process.env.CLIENT_ID),{body:commands});})();

// ===== 地震系統 =====
async function checkEQ(){
  const db=read();
  if(!db.settings.eqChannel) return;

  try{
    const res=await axios.get("https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0016-001?Authorization=你的KEY");
    const eq=res.data.records.Earthquake[0];
    const id=eq.EarthquakeNo;

    if(db.eq.last===id) return;

    db.eq.last=id; write(db);

    const ch=client.channels.cache.get(db.settings.eqChannel);
    if(ch){
      ch.send(`🌏 地震速報！
地點：${eq.EarthquakeInfo.Epicenter.Location}
規模：${eq.EarthquakeInfo.EarthquakeMagnitude.MagnitudeValue}
時間：${eq.EarthquakeInfo.OriginTime}`);
    }

  }catch(e){console.log("地震API錯誤");}
}
setInterval(checkEQ,60000);


// ===== 加入 =====
client.on("guildMemberAdd",member=>{
  const db=read();
  const ch=client.channels.cache.get(db.settings.welcome);
  if(ch) ch.send(`👋 歡迎 ${member}`);
});

// ===== 離開 =====
client.on("guildMemberRemove",member=>{
  const db=read();
  const ch=client.channels.cache.get(db.settings.leave);
  if(ch) ch.send(`😢 ${member.user.tag} 離開了`);
});

// ===== 指令 =====
client.on("interactionCreate",async i=>{
  if(!i.isChatInputCommand()) return;
  const db=read();
  const u=i.user.id;

  if(!db.users[u]) db.users[u]={money:100,last:0};

  if(i.commandName==="ping") return i.reply("pong");

  if(i.commandName==="help"){
    return i.reply("📜 指令已載入");
  }

  if(i.commandName==="set-welcome-channel"){
    db.settings.welcome=i.options.getChannel("ch").id;
    write(db);
    return i.reply("已設定歡迎頻道");
  }

  if(i.commandName==="set-leave-channel"){
    db.settings.leave=i.options.getChannel("ch").id;
    write(db);
    return i.reply("已設定離開頻道");
  }

  if(i.commandName==="set-earthquake-channel"){
    db.settings.eqChannel=i.options.getChannel("ch").id;
    write(db);
    return i.reply("已設定地震頻道");
  }

  if(i.commandName==="daily"){
    if(Date.now()-db.users[u].last<86400000) return i.reply("今天領過");
    db.users[u].money+=100;
    db.users[u].last=Date.now();
    write(db);
    return i.reply("+100金幣");
  }

  if(i.commandName==="profile"){
    return i.reply(`💰 ${db.users[u].money}`);
  }

  if(i.commandName==="rps"){
    const cost=30;
    if(db.users[u].money<cost) return i.reply("錢不夠");

    db.users[u].money-=cost;

    const choice=i.options.getString("選擇");
    const bot=["rock","paper","scissors"][Math.floor(Math.random()*3)];

    let result="平手";

    if(
      (choice==="rock"&&bot==="scissors")||
      (choice==="paper"&&bot==="rock")||
      (choice==="scissors"&&bot==="paper")
    ){
      db.users[u].money+=50;
      result="你贏了 +50";
    }
    else if(choice!==bot){
      db.users[u].money-=20;
      result="你輸了 -20";
    }

    write(db);
    return i.reply(`你:${choice} Bot:${bot}\n${result}`);
  }

  if(i.commandName==="gacha"){
    const cost=30;
    if(db.users[u].money<cost) return i.reply("錢不夠");

    db.users[u].money-=cost;

    const n=Math.floor(Math.random()*201)-100;
    db.users[u].money+=n;

    write(db);
    return i.reply(`🎰 抽到 ${n}`);
  }

});

// ===== 公告頻道設定 =====
if(i.commandName==="set-announcement-channel"){
  if(!db.settings[i.guild.id]) db.settings[i.guild.id] = {};

  db.settings[i.guild.id].announce = i.options.getChannel("ch").id;
  write(db);

  return i.reply("📢 公告頻道已設定");
}

// ===== 全域公告 =====
if(i.commandName==="broadcast"){

  const OWNER_ID = "你的DiscordID"; // ⚠️ 改這裡

  if(i.user.id !== OWNER_ID){
    return i.reply({ content:"❌ 只有Bot擁有者可以用", ephemeral:true });
  }

  const msg = i.options.getString("msg");
  let success = 0;

  for(const guild of client.guilds.cache.values()){
    try{
      let ch;
      const setting = db.settings[guild.id];

      // 優先用該伺服器設定頻道
      if(setting?.announce){
        ch = guild.channels.cache.get(setting.announce);
      }

      // fallback
      if(!ch){
        ch = guild.channels.cache.find(c =>
          c.isTextBased() &&
          c.permissionsFor(guild.members.me).has("SendMessages")
        );
      }

      if(ch){
        await ch.send(`📢 全域公告\n${msg}`);
        success++;
      }

    }catch(e){}
  }

  return i.reply(`✅ 已發送到 ${success} 個伺服器`);
}

// ===== 全域公告 =====
new SlashCommandBuilder()
  .setName("set-announcement-channel")
  .setDescription("設定公告頻道")
  .addChannelOption(o=>o.setName("ch").setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

new SlashCommandBuilder()
  .setName("broadcast")
  .setDescription("全域公告")
  .addStringOption(o=>o.setName("msg").setDescription("內容").setRequired(true))


// ===== 防炸 =====
client.on("messageCreate",msg=>{
  if(msg.author.bot) return;

  if(msg.content.includes("@everyone")){
    msg.delete().catch(()=>{});
    return;
  }

  const db=read();
  const u=msg.author.id;

  if(!db.spam[u]) db.spam[u]={c:0};
  db.spam[u].c++;

  if(db.spam[u].c>5){
    msg.delete().catch(()=>{});
    return;
  }

  setTimeout(()=>db.spam[u].c=0,5000);

  write(db);
});

// ===== 啟動 =====
client.login(process.env.TOKEN);
