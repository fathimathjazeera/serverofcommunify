const mongoose=require('mongoose')




const voteSchema=mongoose.Schema({
    postId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'posts', 
         required: true },
  userId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'users', 
      required: true },
  action: {
     type: String, 
     enum: ['upvote', 'downvote'], 
     required: true },
totalvote:{type:Number}

})

































module.exports=mongoose.model('votes',voteSchema)