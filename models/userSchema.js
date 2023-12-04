const mongoose=require('mongoose')




const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    profilepic:String,
    created_at:Date,
    karma:{type:Number, default:0},
    isBlocked:{type:Boolean,default:false},
    joined_communities:[   {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subreddits', 
    }],
})




module.exports=mongoose.model('users',userSchema)
