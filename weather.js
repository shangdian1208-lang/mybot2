const axios=require("axios")

module.exports=(client)=>{

setInterval(async()=>{

 const db=require("../database.json")

 if(!db.settings.weatherChannel) return

 const channel=client.channels.cache.get(db.settings.weatherChannel)

 const res=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Taipei&appid=${process.env.WEATHER}`)

 const temp=(res.data.main.temp-273.15).toFixed(1)

 channel.send(`今日天氣：${temp}°C`)

},3600000)

}