
const express =require("express")
const router=require("./router/userRouter")
const npoRouter=require("./router/npoRouter")
const cors=require("cors")


const env=require("dotenv").config()
const db=require("./config/dbConfig")
const app=express()

const PORT=process.env.PORT
    
app.use(express.json())
app.use(cors({origin:"*"}))
app.use("/api/v1/user",router) 
app.use("/api/v1/npo",npoRouter)


app.listen(PORT,(req,res)=>{
    console.log(`server is connected to port ${PORT}`)
})
