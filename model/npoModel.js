const mongoose=require("mongoose")   

const npoSchema= new mongoose.Schema({
  name:{type:String, 
    required:true},

      description:{type:String,
        required:true},
      
    registrationNumber:{type:String,
      required:true,
      unique:true},

    contactInfo:{type:String,
      required:true},

    isVerified:{type:Boolean,
      default:false},
   user:{type:mongoose.Schema.Types.ObjectId,
    ref:"user"}
   
 },{timestamps:true})

 const npoModel=mongoose.model("npo",npoSchema)
 

 module.exports=npoModel
