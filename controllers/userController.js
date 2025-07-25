const userModel=require('../models/userModel');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).send("User Not Found")
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:'Invalid Credentials'
            })
        }
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        // Exclude password from user object
        const { password: pwd, ...userWithoutPassword } = user._doc;
        res.status(200).json({
            success:true,
            user: userWithoutPassword,
            token
        });
    }catch(error){
            res.status(400).json({
                success:false,
                error,
            })
    }
}
const registerController=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        if(!name || !email || !password){
            return res.status(400).json({success:false,message:'Please fill all fields'})
        }
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({success:false,message:'User already exists'})
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new userModel({name,email,password:hashedPassword})
        await newUser.save()
        // Generate JWT token for new user
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        const { password: pwd, ...userWithoutPassword } = newUser._doc;
        res.status(201).json({
            success:true,
            user: userWithoutPassword,
            token
        });  
 }
    catch(error){
        res.status(400).json({
            success:false,
            error,
        })
    }
}
module.exports={loginController,registerController};
 