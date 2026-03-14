module.exports = (client)=>{

const spamMap=new Map()

client.on("messageCreate",msg=>{

 if(msg.author.bot) return

 const now=Date.now()

 if(!spamMap.has(msg.author.id)){

  spamMap.set(msg.author.id,{count:1,time:now})
  return

 }

 const data=spamMap.get(msg.author.id)

 if(now-data.time<3000){

  data.count++

  if(data.count>5){

   msg.member.timeout(60000,"Spam")
   msg.channel.send(`${msg.author} 因刷頻被禁言`)

  }

 }else{

  spamMap.set(msg.author.id,{count:1,time:now})

 }

})

}