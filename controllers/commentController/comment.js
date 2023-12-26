require("dotenv").config();
const comments = require("../../models/commentSchema");

// POSTING COMMENT
const postComment = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;
  const { text } = req.body;
  await comments.create({
    text: text,
    userId: userId,
    postId: postId,
  });
  res.status(200).json({
    status: "success",
    message: "successfully commented",
  });
};

// VIEWCOMMENT
const viewComments = async (req, res) => {
  const postId = req.params.id;
  const commentData = await comments
    .find({ postId: postId })
    .populate("userId");
  res.status(200).json({
    status: "success",
    message: "successfully fetched comments",
    data: commentData,
  });
};

// EDIT COMMENT
const editComment = async (req, res) => {
  const { commentId } = req.params;
  console.log(commentId, "commentid");
  const { text } = req.body;
  console.log(text, "comment");
  await comments.findByIdAndUpdate(commentId, { $set: { text: text } });
  res.status(200).json({
    status: "success",
    message: "successfully edited comment",
  });
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  await comments.findByIdAndDelete(commentId);
  res
    .status(200)
    .json({ status: "success", message: "Comment deleted successfully" });
};

// REPLY COMMENT
const replyComment = async (req, res) => {
  const { commentId } = req.params;
  const { reply } = req.body;
  await comments.updateOne({ _id: commentId }, { $push: { reply: reply } });
  res.status(200).json({
    status: "success",
    message: "successfully replied to comment",
  });
};

// VIEW REPLY
const viewReply = async (req, res) => {
  const { postId } = req.params;
  const reply = await comments.find({ postId: postId });
  res.status(200).json({
    status: "success",
    message: "successfully replied to comment",
    data: reply,
  });
};

// VOTING COMMENT
const voteComment = async (req, res) => {
  console.log("voted");
  const { commentId } = req.params;
  const { vote } = req.body;
  console.log(vote ,"vote");
  const userId = req.userId;
  if (vote == "upvote") {
    const upvotedComment = await comments.findOne({
      _id: commentId,
      "votes.userId": userId,
      "votes.action": "upvote",
    });
    const downvotedComment = await comments.findOne({
      _id: commentId,
      "votes.userId": userId,
      "votes.action": "downvote",
    });
    if (!upvotedComment) {
      if (downvotedComment) {
        await comments.updateOne(
          { _id: commentId },
          { $inc: { downvote: -1 } }
        );
      }
      await comments.updateOne({ _id: commentId }, { $inc: { upvote: 1 } });
    } else {
      await comments.updateOne({ _id: commentId }, { $inc: { upvote: -1 } });
    }
  } else if (vote == "downvote") {
    const upvotedComment = await comments.findOne({
      _id: commentId,
      "votes.userId": userId,
      "votes.action": "upvote",
    });
    const downvotedComment = await comments.findOne({
      _id: commentId,
      "votes.userId": userId,
      "votes.action": "downvote",
    });
    if (!downvotedComment) {
      if (upvotedComment) {
        await comments.updateOne({ _id: commentId }, { $inc: { upvote: -1 } });
      }
      comments.updateOne({ _id: commentId }, { $inc: { downvote: 1 } });
    } else {
      comments.updateOne({ _id: commentId }, { $inc: { downvote: -1 } });
    }
  }
  res.status(200).json({
    status: "success",
    message: "successfully voted",
  });
};

module.exports = {
  postComment,
  viewComments,
  editComment,
  deleteComment,
  replyComment,
  viewReply,
  voteComment,
};
