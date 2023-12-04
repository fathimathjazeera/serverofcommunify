const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
      type:String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', 
  },
subreddit:{
  type: String,
    ref: 'subreddits', 
},
reported:{
  type: Boolean,
default:false
},
reported_count:{
type:Number,
default:1
},
  upvote:{type:Number,default:0},
  downvote:{type:Number,default:0},
  totalvote:{type:Number,default:0},

});




module.exports = mongoose.model('posts', postSchema);


