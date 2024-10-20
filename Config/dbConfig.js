require("dotenv").config()
const keepServerAlive=require("../middleware/keepServerAlive.js")


const mongoose=require("mongoose")

const url=process.env.mongodb

mongoose.connect(url).then(()=>{
     
    keepServerAlive();

    console.log(`server successfully connected to mongodb`)
}).catch((error)=>{
    console.log(`unable to connect to database because ${error}`)
})  