const axios=require("axios")

module.exports=(client)=>{

setInterval(async()=>{

 const db=require("../database.json")

 if(!db.settings.memeChannel) return

 const channel=client.channels.cache.get(db.settings.memeChannel)

 const res=await axios.get("https://meme-api.com/gimme")

 channel.send(res.data.url)

},1800000)

}