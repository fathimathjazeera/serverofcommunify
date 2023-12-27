const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  text: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  reply: [],

  votes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      action: {
        type: String,
        enum: ["upvote", "downvote"],
        required: true,
      },
    },
  ],

  upvote: { type: Number, default: 0 },
  downvote: { type: Number, default: 0 },
  totalvote: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comments", commentSchema);




