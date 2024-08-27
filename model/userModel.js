const mongoose=require("mongoose")   

const userSchema= new mongoose.Schema({
  firstName:{type:String,
    required:true},

      lastName:{type:String,
        required:true},
      
    email:{type:String,
      required:true,
      unique:true},

    password:{type:String,
      required:true},

profilePic:{type:String},
  blackList:[],

    isVerified:{type:Boolean,
      default:false},

    role:{type:String,
      enum:["admin","npo","donor"],
      required:true
    },
    organizationName:{type:String},

    organizationDetails:{type:String},

    preferedCategories:{type:String},
   
 },{timestamps:true})

 const userModel=mongoose.model("user",userSchema)
 

 module.exports=userModel
