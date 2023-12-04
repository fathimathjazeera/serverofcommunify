const mongoose=require('mongoose')



const subRedditSchema= new mongoose.Schema({

    name: String,
    userId: { type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
                              
    created_at:{ type: String, default: new Date().toLocaleDateString()},                               
    subscribers: [],        
})



module.exports=mongoose.model('subreddits',subRedditSchema)

