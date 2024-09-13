const individualModel = require("../model/individualModel")
const npoModel=require("../model/npoModel")
const cloudinary=require("../utilis/cloudinary")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")   
require("dotenv").config()
const sendmail=require("../helpers/nodemailer")
const {signUpTemplate,verifyTemplate,forgotPasswordTemplate}=require("../helpers/html")



exports.NposignUp = async (req, res) => {
    try {
        // Destructure fields from the request body
        const { firstName, lastName, email, password, phoneNumber, organizationName,registrationNumber} = req.body;
        const allFields= { firstName, lastName, email, password, phoneNumber, organizationName,registrationNumber}

        // Validate required fields
        if (!firstName || !lastName || !email || !password ||!organizationName||!registrationNumber||!phoneNumber) {
            const missingFields = [];
    for (const [key, value] of Object.entries(allFields)) {
        if (!value) {
            missingFields.push(key);
        }
    }

    // Return error message with the list of missing fields
    return res.status(400).json({ 
        message: `The following fields are required: ${missingFields.join(', ')}`
    });
}

      
        // Check if user already exists
        // const existingUser = await npoModel.findOne({ email: email.toLowerCase() });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'A user with this email already exists.' });
        // }
        const existingIndividual = await individualModel.findOne({ email: email.toLowerCase() });
        const existingNpo = await npoModel.findOne({ email });

        const existingPhoneIndividual = await individualModel.findOne({ phoneNumber });
        const existingPhoneNpo = await npoModel.findOne({ phoneNumber });

        if (existingIndividual || existingNpo) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        if (existingPhoneIndividual || existingPhoneNpo) {
            return res.status(400).json({ message: 'Phone number already in use' });
        }


        // Handle file upload
        let profilePicUrl = null;
        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path);
                profilePicUrl = uploadResult.url;
            } catch (error) {
                return res.status(500).json({ message: `Image upload failed: ${error.message}` });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newNpo = new npoModel({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            phoneNumber,
            organizationName,
            registrationNumber:registrationNumber.toUpperCase(),
            profilePic: profilePicUrl,
           
        });

        // Save user to database
        await newNpo.save();

        // Generate JWT token
        const token = jwt.sign({ id: newNpo._id, email: newNpo.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send verification email
        const verifyLink = `${req.protocol}://${req.get('host')}/api/v1/verify-email/${token}`;
        await sendmail({
            email: newNpo.email,
            subject: 'Verify Your Email',
            html: signUpTemplate(verifyLink, newNpo.firstName),
        });

        // Respond to client
        const { password: _, ...npoWithoutPassword } = newNpo.toObject();
        res.status(201).json({
            message: `Congratulations, ${newNpo.firstName}! You have successfully signed up. Please check your email to verify your account.`,
            data: npoWithoutPassword,
            token,
        });
    } catch (error) {
        if(error.code === 11000){

            const duplicateField = Object.keys(error.keyValue)[0]
            const duplicateValue = error.keyValue[duplicateField]

            return res.status(400).json({message:`sorry, this ${duplicateValue} has already been used for this ${duplicateField},kindly try another one `})
        }
        console.error('Sign-up error:', error);
        res.status(500).json({ message: `Sign-up failed: ${error.message}` });
    }
};

exports.NpoverifyEmail=async(req,res)=>{
    try {
        //extract token from params
        const {token}=req.params
        //extract email from the verified token
        const {email}=jwt.verify(token,process.env.JWT_SECRET)
            const user=await npoModel.findOne({email})
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
exports.NpologIn=async(req,res)=>{
    try {
        const{email,password}=req.body
        if(!email ||!password){
            return res.status(400).json({info:`log in must contain email and password`})
        }
         const lowerCase=email.toLowerCase()
        const user = await npoModel.findOne({ email :lowerCase})
        
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
        const token=jwt.sign({id:user._id,email: user.email, },process.env.JWT_SECRET,{expiresIn:"1h"})
        const{password:_,...userData}=user.toObject()
        return res.status(200).json({
            info:`logged in successful`,
            data:userData,
             token})
    } catch (error) {
        res.status(500).json({info:`cannot log in because ${error}`})
    }
}
//if token expired and user want to receive another verification message
exports.NporesendVerificationEmail=async (req,res)=>{
    try {
       const {email}=req.body
      
       const user=await npoModel.findOne({email})
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

exports.NpoforgetPassword=async(req,res)=>{
    try {
        
        const {email}=req.body 
        
       const user=await npoModel.findOne({email})
       if(!user){
        return res.status(400).json({message:`user with email not in database`})
       } 
        const resetToken=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:`20 minutes`})
        const forgotPasswordLink=`${req.protocol}://${req.get("host")}/api/v1/reset-Password/${resetToken}`
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


exports.NporesetPassword = async (req, res) => {
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
        const user = await npoModel.findOne({ email });

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


exports.NpochangePassword=async(req,res)=>{
    try {
        const {token}=req.params
        const{oldPassword,NewPassword,ConfirmNewPassword}=req.body
        const {email}=jwt.verify(token,process.env.JWT_SECRET)
        const user=await npoModel.findOne({email})
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

exports.updateNpo = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName } = req.body

        const user = await npoModel.findById(id);
        if (!user) {
            return res.status(400).json({ info: `User not found, check the ID and try again.` });
        }

        const updatedData = {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
        };

    
        if (req.files && req.files.length > 0) {
            // Delete the old profile picture if it exists
            const oldFilePath = path.join(__dirname, 'uploads', user.photos);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath); // Delete old image
            }

            
            updatedData.photos = req.files[0].filename; 
        }
        const updatedUser = await npoModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({
            message: `User updated successfully`,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            photo: updatedUser.photos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Error: ${error.message}` });
    }
};
exports.NpologOut = async (req, res) => { 
    try {
        const auth = req.headers.authorization;
        console.log('Authorization Header:', auth); // Log the entire header

        const token = auth.split(" ")[1];
        if (!token) {
            return res.status(400).json({ nfo: `Access denied, no or invalid token` });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Payload:', decoded); // Log the decoded payload

        const { id } = decoded;
        console.log('User ID from Token:', id); // Log the user ID

        const user = await npoModel.findById(id); // Find user by ID
        if (!user) {
            return res.status(400).json({ nfo: `Access denied, user not found` });
        }

        user.blackList.push(token);
        await user.save();
        res.status(200).json({ info: `Log-out successful` });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ info: `Token expired` });
        }
        res.status(500).json({ info: `Unable to log-out because ${error}` });
    }
};

exports.getOneNpo=async(req,res)=>{
    try {
      const {id}=req.params
      const details=await npoModel.findById(id) 
      if(!details){
        return res.status(400).json({info:`user with id not found`})
      }
      res.status(200).json({message:`${details.firstName} details collected successfully`,details})
    } catch (error) {
        return res.status(500).json({info:`unable to find ${details.lastName} details because ${error} `})
    }
} 
