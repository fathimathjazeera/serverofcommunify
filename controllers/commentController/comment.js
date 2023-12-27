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
  const { commentId } = req.params;
  const { action } = req.body;
  const userId = req.userId;

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

  if (action == "upvote") {
    console.log("upvotedComment:", upvotedComment);
    console.log("downvotedComment:", downvotedComment);
    if (!upvotedComment) {
      if (downvotedComment) {
        await comments.updateOne(
          { _id: commentId },
          { $inc: { downvote: -1 } ,
          $pull: {
            votes: {
              userId: userId,
              action: "downvote",
            },
          }
        },
         
        );
      }
      await comments.updateOne(
        { _id: commentId },
        {
          $inc: { upvote: 1 },
          $push: {
            votes: {
              userId: userId,
              action: "upvote",
            },
          },
        }
      );
    } else {
      await comments.updateOne({ _id: commentId }, { $inc: { upvote: -1 },  $pull: {
        votes: {
          userId: userId,
          action: "upvote",
        },
      }});
    }
  } else if (action == "downvote") {
    console.log("upvotedComment:", upvotedComment);
    console.log("downvotedComment:", downvotedComment);
    if (!downvotedComment) {
      if (upvotedComment) {
        await comments.updateOne({ _id: commentId }, { $inc: { upvote: -1 } , $pull: {
          votes: {
            userId: userId,
            action: "upvote",
          },
        }});
      }
     await comments.updateOne(
        { _id: commentId },
        { $inc: { downvote: 1 },  $push: {
          votes: {
            userId: userId,
            action: "downvote",
          },
        },}
      );
    } else {
      comments.updateOne({ _id: commentId }, { $inc: { downvote: -1 } , $pull: {
        votes: {
          userId: userId,
          action: "downvote",
        },
      }});
    }
  }
  const comment = await comments.findById(commentId)
  const totalvote = Math.max(comment.upvote - comment.downvote , 0);
  await comments.updateOne({ _id: commentId }, { $set: { totalvote:totalvote } });
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
