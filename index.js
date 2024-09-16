
const express =require("express")
const router=require("./router/individualRouter.js")
const npoRouter=require("./router/npoRouter")
const campaignrouter=require("./router/campaignRouter.js")
const donationRouter=require("./router/donationRouter.js")
const adminrouter=require("./router/adminRouter.js")
const cors=require("cors")
const morgan=require("morgan")
 

const env=require("dotenv").config()
const db=require("./Config/dbConfig.js")
const app=express()

const PORT=process.env.PORT
    
app.use(express.json())
router.use(express.urlencoded({ extended: true }));
app.use(cors({origin:"*"}))
app.use(morgan("dev"))
app.use("/api/v1/",router) 
app.use("/api/v1/",npoRouter)
app.use("/api/v1/",campaignrouter)
app.use("/api/v1",donationRouter)
app.use("/api/v1",adminrouter)
app.get('/', (req, res) => {
    res.send('Welcome to Kindraise!');
});



app.listen(PORT,(req,res)=>{
    console.log(`server is connected to port ${PORT}`)
}) 
