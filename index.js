
const express =require("express")
const router=require("./router/userRouter")



const env=require("dotenv").config()
const db=require("./config/dbConfig")
const app=express()

const PORT=process.env.PORT
    
app.use(express.json())
app.use("/api/v1/user",  router) 


app.listen(PORT,(req,res)=>{
    console.log(`server is connected to port ${PORT}`)
})
