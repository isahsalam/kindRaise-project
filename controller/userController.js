
const userModel=require("../model/userModel")
const cloudinary=require("../utilities/cloudinary")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")   
require("dotenv").config()
const sendmail=require("../helpers/nodemailer")
const {signUpTemplate,verifyTemplate,forgotPasswordTemplate}=require("../helpers/html")
 exports.signUp=async(req,res)=>{
    try {
        
    const{firstName,lastName,email,password,role}=req.body
    if(!firstName ||!lastName||!email||!password ){
        return res.status(400).json({message:`all requirement must be filled correctly,fullName email password phoneNumber sex)`}) 
    }
    const file=req.file ? req.file.path: null
    let image
    if(file){
        try {
           const image=await cloudinary.uplo.upload(file) 
        } catch (error) {
            res.status(500).json({info:`upload failed because ${error}`})
        }
    }
    
    const user=await userModel.findOne({email})
    if(user){ 
        return res.status(400).json({info:`user with email already exist`})
    }   
    if(firstName.length && lastName.length <=5 ||password.length<=7){
        return res.status(400).json({info:'require name must be above 5 character and password length must be at least 8 character'})
    }
    if(role==="npo" &&(organizationDetails || organizationName)){
        return res.status(400).json({info:`organiztion name and details is required for npo`})
    }
    if(role==="donor" &&(preferedCategories)){
        return res.status(400).json({info:`dear valid Donor ,please kindly state your prefered categories `})
    }
    const salt=await bcrypt.genSalt(10)
    const hash=await bcrypt.hash(password,salt)
   
    
    const savedUser= new userModel({
        
        firstName,
        lastName,
        email:email.toLowerCase(),
        password:hash,
        role,
        profilePic:image? image.url:null
    })
    await savedUser.save()
    const Token=jwt.sign({id:savedUser._id,email:savedUser.email},process.env.JWT_SECRET,{expiresIn:"1hour"})
    const verifyLink=`${req.protocol}://${req.get("host")}/api/v1/user/verify-email/${Token}`
    
    await sendmail({ 
        email:savedUser.email,
        subject:"kindly verify your email",
        html:signUpTemplate(verifyLink,savedUser.firstName)
    })

    
    res.status(200).json({info:`congratulation, ${savedUser.firstName} you have successfully signedUp,kindly check your email to verify`,
        data:savedUser,
        token:Token
    })
    } catch (error) {
        res.status(500).json({message:`unable to sign-up because ${error}`})
    }
 }
exports.verifyEmail=async(req,res)=>{
    try {
        //extract token from params
        const {token}=req.params
        //extract email from the verified token
        const {email}=jwt.verify(token,process.env.JWT_SECRET)
            const user=await userModel.findOne({email})
             if(!user){
                return res.status(400).json({info:`user not found`})
             }
             //now check if the user has already been verified
             if(user.isVerified){
                return res.status(400).json({message:`user with email has already been verified,log-in to continue`})
             }
             user.isVerified=true
             await user.save()
             res.status(200).json({info:`dear ${user.firstName} your email has successfully been verified`})
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            return res.status(500).json({info:`unable to verify because ${error}`})
        }
        res.status(500).json({info:`unable to verify because ${error}`})
    }
}
exports.logIn=async(req,res)=>{
    try {
        const{email,password}=req.body
        if(!email ||!password){
            return res.status(400).json({info:`log in must contain email and password`})
        }
        const user=await userModel.findOne({email}) 
        console.log(email);
        if(!user ){
            return res.status(401).json({info:`user with email not found`})
        }
        const verifyPassword=await bcrypt.compare(password,user.password)
        
        if(!verifyPassword){
            return res.status(400).json({info:`incorrect password`})
        }
        if(!user.isVerified){
            return res.status(400).json({message:`please verify your email first`})
        }
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
        return res.status(200).json({
            info:`logged in successful`,
            data:user,
             token})
    } catch (error) {
        res.status(500).json({info:`cannot log in because ${error}`})
    }
}
//if token expired and user want to receive another verification message
exports.resendVerificationEmail=async (req,res)=>{
    try {
       const {email}=req.body
      
       const user=await userModel.findOne({email})
       if(email.length<=8){
        return res.status(400).json('please kindly input your email correctly')
       }
       if(!user){
        return res.status(400).json({message:`user with email not in database`})
       } 
       if(user.isVerified){
        return res.status(400).json({info:`user has already beem verified`})
       }
         const token=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:`20 minutes`})
         const verifyLink=`${req.protocol}://${req.get("host")}/api/v1/user/verify-email/${token}`
         let mailOptions={
            email:user.email,
            subject:"resend verification link",
            html:verifyTemplate(verifyLink,user.firstName)
         }
         await sendmail(mailOptions)
         res.status(200).json({info:`verification email resend successfully,check your email to verify`})
    } catch (error) {
        res.status(500).json({message:`unable to resend verification link because ${error}`})
    }
}

exports.forgetPassword=async(req,res)=>{
    try {
        
        const {email}=req.body 
        
       const user=await userModel.findOne({email})
       if(!user){
        return res.status(400).json({message:`user with email not in database`})
       } 
        const resetToken=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:`20 minutes`})
        const forgotPasswordLink=`${req.protocol}://${req.get("host")}/api/v1/user/reset-Password/${resetToken}`
        //send forget password mail
        let mailOptions={
            email:user.email,
            subject:"forget password",
            html:forgotPasswordTemplate(forgotPasswordLink,user.firstName)
        }
        await sendmail(mailOptions)
        res.status(200).json({info:`forget password template sent successfully `,resetToken})
    } catch (error) {
        res.status(500).json({info:` can not send forget password template because ${error} `})
    }
}


exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        console.log(newPassword)

        // Check if the new password is provided
        if (!newPassword) {
            return res.status(400).json({ info: 'New password is required' });
        }

        // Verify the token and extract the email
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ info: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hash;
        await user.save();

        res.status(200).json({ information: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ info: `Unable to reset password because ${error.message}` });
    }
};


exports.changePassword=async(req,res)=>{
    try {
        const {token}=req.params
        const{oldPassword,NewPassword,ConfirmNewPassword}=req.body
        const {email}=jwt.verify(token,process.env.JWT_SECRET)
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(400).json({info:`user not found`})
        }
        const compare=await bcrypt.compare(oldPassword,user.password)
        if(!compare){
            return res.status(400).json({info:`oops seems you have forgoteen your previous password,click the forget password button to proceed`})
        }
        if(ConfirmNewPassword !==NewPassword){
            return res.status(400).json({message:'new password and confirm password does not match try again to proceed'})
        }
        const salt=await bcrypt.genSalt(10)
        const hashed=await bcrypt.hash(NewPassword,salt)
        user.password=hashed
        await user.save()
        
        
        res.status(200).json({information:`password changed successfully`})
    }catch(error){
res.status(500).json({info:`unable to change password because ${error}`})
    }
}



exports.updatedUser=async (req,res)=>{
    try {
        const {userId}=req.params
        const {fullName,phoneNumber,age}=req.body
        const data={fullName,
        phoneNumber
        ,maritalStatus}
        const updatedUserDetails=await userModel.findByIdAndUpdate(userId,data,{new:true})
        return res.status(200).json({info:`user in database updated successfully`,updatedUserDetails})
    } catch (error) {
        return  res.status(500).json({
              message:`can not update user because ${error}`
          })
      }
}

exports.makeAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Received request to make user admin. User ID: ${userId}`);

        if (!userId) {
            console.error('User ID is undefined or null');
            return res.status(400).json({ info: 'User ID is required' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            console.log(`User with ID ${userId} not found`);
            return res.status(400).json({ info: `User with ID ${userId} not found` });
        }

        user.role = "Admin";
        await user.save();
        
        const generateToken= jwt.sign({id:userId._id},
            process.env.JWT_SECRET,
            {expiresIn:"1 hour"})
          
       // console.log(`User with ID ${userId} is now an admin`);
        res.status(200).json({ info: ` ${user.fullName} is now  an admin`,user,generateToken });
    } catch (error) {
        console.error(`Error making user admin: ${error.message}`);
        return res.status(500).json({
            message: `Cannot make user an admin because ${error.message}`
        });
    }
};
exports.getAllAdmins = async (req, res) => {
    try {
        console.log("Fetching admins from the database...");

        // Find users with roles 'admin1' or 'admin2'
        const adminsOnly = await userModel.find({ role: { $in: ["Admin1", "Admin2"] } });

        console.log(`Admins found: ${adminsOnly.length}`);
        adminsOnly.forEach(admin => {
            console.log(`Admin: ${admin.fullName}, Role: ${admin.role}`);
        });
        const alladmins=adminsOnly.map(admins=>{
         const token=jwt.sign({_id:adminsOnly._id},process.env.JWT_SECRET,{expiresIn:"1 hour"})
         return{ ...admins.toObject(),token}  
        })
        return res.status(200).json({
            info: `${adminsOnly.length} admins in database collected successfully`,
            alladmins,
            
        });
    } catch (error) {
        return res.status(500).json({
            message: `Cannot fetch admins in database because ${error.message}`
        });
    }
};

exports.deleteOne=async(req,res)=>{
    try {
        const {id}=req.params
        const userInfo=await userModel.findByIdAndDelete(id)
        return res.status(200).json({info:`delete successful`,})
    } catch (error) {
        res.status(500).json({info:`${error.message}`})
    }
}

exports.deleteAll=async(req,res)=>{
    try {
        const allUsers = await userModel.find()
        if(allUsers<1){
            return res.status(400).json({info:`oops!,sorry no user found in database`})
        }
         const deleteAllUser=await userModel.deleteMany({})
         return res.status(200).json({info:`all ${allUsers.length} users in database deleted successfully`})
    } catch (error) {
        return  res.status(500).json({
              message:`can not delete all user because ${error}`
          })
      }  
}


exports.getAll = async (req, res) => {
    try {
        const allUsers = await userModel.find();
        if(allUsers<=0){
            return res.status(400).json({info:`oops !! no user found in database`})
        }

       
        const everyUsers= allUsers.map(user=>{
            const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn: "1 hour" });
            return {
                ...user.toObject(),
                token
            }
        })

        return res.status(200).json({
            info: `All ${allUsers.length} users in the database collected successfully`,
            users: everyUsers
        });
    } catch (error) {
        return res.status(500).json({
            message: `Cannot get all users because ${error}`
        });
    }
};
exports.logOut = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        console.log('Authorization Header:', auth); // Log the entire header

        const token = auth.split(" ")[1];
        if (!token) {
            return res.status(400).json({ nfo: `Access denied, no or invalid token` });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Payload:', decoded); // Log the decoded payload

        const { userId } = decoded;
        console.log('User ID from Token:', userId); // Log the user ID

        const user = await userModel.findById(userId); // Find user by ID
        if (!user) {
            return res.status(400).json({ nfo: `Access denied, user not found` });
        }

        user.blackList.push(token);
        await user.save();
        res.status(200).json({ info: `Log-out successful` });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.json({ info: `Token expired` });
        }
        res.status(500).json({ info: `Unable to log-out because ${error}` });
    }
};

exports.getOne=async(req,res)=>{
    try {
      const {studentId}=req.params
      const details=await studentModel.findById(studentId) 
      if(!details){
        return res.status(400).json({info:`user with id not found`})
      }
      res.status(200).json({message:`${details.fullName} details collected successfully`,details})
    } catch (error) {
        return res.status(500).json({info:`unable to find ${details.fullName} details because ${error} `})
    }
}
