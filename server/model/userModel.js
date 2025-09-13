const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    password2:{
        type:String,
        
    },
    Date:{
        type:Date,
        default:new Date()
    }
})
module.exports=mongoose.model('UsersData',userSchema);