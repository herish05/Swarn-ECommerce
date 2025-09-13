const router=require("express").Router();
const mongoose=require('mongoose');
const userData=require('../model/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer');
//Mail to user
const sendmail=(email,username)=>{
   const output=`
    <p style="font-size:15px">You can Successfully registered at Swarn.pvt.ltd</p>
    <p style="font-size:15px">Thank you For registering at Swarn</p>
    <p style="font-size:12px">Regards Thanks</p>
    
    `;
    const transporter=nodemailer.createTransport({
        service:"gmail",
        secure:true,
        port:465,
        auth:{
            user:'swarn.pvt.ltd1@gmail.com',
            pass:'utnslevcxaqzrdjn'
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    const createOutput={
        from:'swarn.pvt.ltd1@gmail.com',
        to:`${email}`,
        subject:'Swarn Pvt',
        text:`Welcome from Swarn to Register ${username}`,
        html:output
    }
     transporter.sendMail(createOutput,(err,info)=>{
        if(err){
            console.log('mail not send to user');
        }
        else{
            console.log('mail will be sent');
        }
        
    })
}
exports.signin=async(req,res)=>{
const {username,email,password,confirmpassword}=req.body;
const usernameCheck=await userData.findOne({username});
if(usernameCheck){
   return res.json({msg:"Username is already Exit",status:false});
}
const emailCheck=await userData.findOne({email});
if(emailCheck){
    return res.json({msg:"Email is already Registered",status:false});
}
if(password!=confirmpassword){
   return  res.json({msg:"Password do not Match",status:false});
}
if(!password){
   return  res.json({msg:"password is required",status:false})
}
if(password.length<8){
   return  res.json({msg:"Password do not less than 8",status:false});
}
const hashPassword=await bcrypt.hash(password,10);
const user=await userData.create({
    username,
    email,
    password:hashPassword
})
delete user.password;
sendmail(email,username);
return res.json({status:true,user})
}



            
exports.login=async(req,res)=>{
    const {email,password}=req.body;
    const emailCheck=await userData.findOne({email})
    if(!emailCheck){
       return res.json({msg:"This email is not Registered",status:false});
    }
    const passwordCheck=await bcrypt.compare(password,emailCheck.password)
    if(!passwordCheck){
       return res.json({msg:"Password is Incorrect",status:false});
    }
  const token=  jwt.sign({userId:emailCheck._id},'ssssshhhhhh',{expiresIn:'3d'});
    delete emailCheck.password;
   
    return res.json({status:true,emailCheck,token});
}