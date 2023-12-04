

const mongoose=require('mongoose')
const commentSchema = new mongoose.Schema({
    text: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts', 
    
    },
    reply:[],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});





module.exports = mongoose.model('comments', commentSchema);

