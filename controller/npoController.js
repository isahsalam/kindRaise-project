const npoModel=require("../model/npoModel")
const userModel=require("../model/userModel")



exports.createNpo=async(req,res)=>{
    try {
        const {name, registrationNumber,contactInfo,description}=req.body
        if(!name ||!registrationNumber ||!contactInfo ||!description){
            return res.status(400).json({message:`dear valid NPO,kindly fill all (name, registrationNumber,contactInfo,description) info correctly`})
        }
        const existingNpo= await npoModel.findOne({registrationNumber})
        if(existingNpo){
            return res.status(401).json({message:`dear valid NPO,you are not authorized to use this registrationNumber`})
        }
        const userId=req.user.id
        const user=await userModel.findById(userId)
         if(!user){
            return res.status(400).json({info:`user with id not found`})
         }
         const newNpo= new npoModel({
            name, 
            registrationNumber,
            contactInfo,
            description,
            user:user._id
         })
         await newNpo.save()
         res.status(200).json({message:`npo successfully created by ${user.firstName} ${user.lastName}`,
            data:newNpo
         })
    } catch (error) {
        console.log("error creating Npo:",error)
        return res.status(500).json({info:`can not create npo because
            `,error:error.message})
    }
}