require("dotenv").config();
const users = require("../models/userSchema");
const authSchema = require("./validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const posts = require("../models/postSchema");
const subreddit = require("../models/subReddit");
const comments = require("../models/commentSchema");
const votes = require("../models/votesSchema");

const register = async (req, res) => {
  const { error, value } = authSchema.validate(req.body);
  const { username, email, password } = value;
  const findUser = await users.findOne({ email: email });
  if (error) {
    res.status(422).json({
      status: "error",
      message: error.details[0].message,
    });
  } else if (findUser) {
    res.status(409).json({
      status: "error",
      message: "User with this email already exists",
    });
  } else {
    await users.create({
      username: username,
      email: email,
      password: await bcrypt.hash(password, 10),
    });
    res.status(200).json({
      status: "success",
      message: "successfully register",
    });
  }
};

const login = async (req, res) => {
  const adminEmail = "admin@gmail.com";
  const { error, value } = authSchema.validate(req.body);

  if (!error) {
    const { email, password } = value;
    const registeredUser = await users.findOne({ email: email });

    if (email == adminEmail && password == process.env.ADMIN_PASSWORD) {
      let token = jwt.sign(adminEmail, process.env.ADMIN_SECRET_KEY);
      res.status(200).json({
        auth: true,
        message: "successfully admin logged In",
        adminemail: email,
        token: token,
      });
    } else {
      if (!registeredUser) {
        res.status(401).json({
          status: "failed",
          message: "User not found. Please register first.",
        });
      } else {
        bcrypt.compare(password, registeredUser.password).then((status) => {
          if (status) {
            let resp = {
              id: registeredUser._id,
              username: registeredUser.username,
              // karma:registeredUser.karma
            };
            let token = jwt.sign(resp, process.env.ACCESS_TOKEN_SECRET);

            res.status(200).json({
              auth: true,
              message: "successfully logged In",
              userId: resp.id,
              token: token,
            });
          } else {
            res.status(401).json({
              status: "failed",
              message: "Incorrect password login failed",
            });
          }
        });
      }
    }
  } else {
    res.status(422).json({
      status: "error",
      message: error.details[0].message,
    });
  }
};

const createCommunity = async (req, res) => {
  const userId = req.userId;
  const { community } = req.body;
  console.log(community, "community");
  await subreddit.create({
    name: community,
    userId: userId,
  });
  res.status(200).json({
    status: "success",
    message: "successfully created community",
  });
};
const createPost = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId, "from createpost");
    const { title, content, subredditName, url } = req.body;
    
    const subName = await subreddit.findOne({ name: subredditName });

    // Create an object with only the properties that have values
    const postData = {
      title: title,
      postedBy: userId,
      subreddit: subName.name,
    };

    // Add content to postData if it exists
    if (content) {
      postData.content = content;
    }

    // Add image to postData if it exists
    if (url) {
      postData.image = url;
    }

    await posts.create(postData);

    res.status(200).json({
      status: "success",
      message: "posted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


const editPost = async (req, res) => {
  const { postId } = req.params;
  const { title, content, subredditName, url } = req.body;
  await posts.findByIdAndUpdate(postId, {
    $set: {
      title: title,
      content: content,
      subreddit: subredditName,
      image: url,
    },
  });
};


const viewPosts = async (req, res) => {
  const allposts = await posts.find().populate("postedBy");
  console.log(allposts,"from viewposts");
  res.status(200).json({
    status: "success",
    message: "fetched all posts",
    data: allposts,
  });
};

const upVote = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;
  try {
    const existingVote = await votes.findOne({ userId, postId });
    if (!existingVote) {
      await votes.create({ userId, postId, action: "upvote" });
      await posts.updateOne({ _id: postId }, { $inc: { upvote: 1 } });
    } else if (existingVote.action === "upvote") {
      await votes.deleteOne({ userId, postId });
      await posts.updateOne({ _id: postId }, { $inc: { upvote: -1 } });
    } else if (existingVote.action === "downvote") {
      await votes.updateOne({ userId, postId }, { $set: { action: "upvote" } });
      await posts.updateOne({ _id: postId }, { $inc: { upvote: 1, downvote: -1 } });
    }
    const post = await posts.findOne({ _id: postId });
    const totalvote = Math.max(post.upvote - post.downvote, 0);
    await posts.updateOne({ _id: postId }, { $set: { totalvote } });

    res.status(200).json({ status: "success", message: "Vote updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to update vote" });
  }
};

const downVote = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;
  try {
    const existingVote = await votes.findOne({ userId, postId });
    if (!existingVote) {
      await votes.create({ userId, postId, action: "downvote" });
      await posts.updateOne({ _id: postId }, { $inc: { downvote: 1 } });
    } else if (existingVote.action === "downvote") {
      await votes.deleteOne({ userId, postId });
      await posts.updateOne({ _id: postId }, { $inc: { downvote: -1 } });
    } else if (existingVote.action === "upvote") {
      await votes.updateOne({ userId, postId }, { $set: { action: "downvote" } });
      await posts.updateOne({ _id: postId }, { $inc: { downvote: 1, upvote: -1 } });
    }
    const post = await posts.findOne({ _id: postId });
    const totalvote = Math.max(post.upvote - post.downvote, 0);
    await posts.updateOne({ _id: postId }, { $set: { totalvote } });
    res.status(200).json({ status: "success", message: "Vote updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to update vote" });
  }
};

const viewSpecificPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await posts.findOne({ _id: id }).populate("postedBy");
    res.status(200).json({
      status: "success",
      message: "successfully fetched specificpost",
      data: post,
    });
  } catch (err) {
    console.log(err.message);
  }
};

const postComment = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err.message);
  }
};

const viewComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentData = await comments
      .find({ postId: postId })
      .populate("userId");
    res.status(200).json({
      status: "success",
      message: "successfully fetched comments",
      data: commentData,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    await comments.findByIdAndDelete(commentId);
    res.status(200).json({ status: "success", message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const userProfile = async (req, res) => {
  const userId = req.userId;
  const data = await users.findById(userId);
  res.status(200).json({
    status: "success",
    message: "successfully fetched userdata",
    data: data,
  });
};

const viewUserPost = async (req, res) => {
  const userId = req.userId;
  const post = await posts.find({ postedBy: userId });
  res.status(200).json({
    status: "success",
    message: "successfully fetched",
    data: post,
  });
};

const viewUserComment = async (req, res) => {
  const userId = req.userId;
  const comment = await comments
    .find({ userId: userId })
    .populate("userId")
    .populate("postId");
  res.status(200).json({
    status: "success",
    message: "successfully fetched",
    data: comment,
  });
};

const viewSingleCommunity = async (req, res) => {
  const communityname = req.params.id;
  const community = await subreddit.findOne({ name: communityname });
  res.status(200).json({
    status: "success",
    message: "successfully fetched",
    data: community,
  });
};

const viewCommunityPost = async (req, res) => {
  try {
    const { communityname } = req.params;
    const post = await posts.find({ subreddit: communityname });
    console.log(post, "communitypost");
    res.status(200).json({
      status: "success",
      message: "successfully fetched",
      data: post,
    });
  } catch (err) {
    console.log(err.message, "error");
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const { url } = req.body;
    console.log(url, "url");
    await users.updateOne({ _id: userId }, { $set: { profilepic: url } });
    res.status(200).json({
      status: "success",
      message: "successfully uploaded profilepic",
    });
  } catch (err) {
    console.log(err.message, "error upload");
  }
};

const joinCommunity = async (req, res) => {
  const { communityId } = req.params;
  console.log(communityId, "communityid");
  const userId = req.userId;

  const joinedUser = await users.findById(userId);
  if (!joinedUser.joined_communities.includes(communityId)) {
    const userJoined = await users.findByIdAndUpdate(userId, {
      $push: { joined_communities: communityId },
    });
    await subreddit.updateOne(
      { _id: communityId },
      { $set: { subscribers: userId } }
    );
    res.status(200).json({
      status: "success",
      message: "successfully joined community",
      data: userJoined,
    });
  } else {
    const userJoined = await users.findByIdAndUpdate(userId, {
      $pull: { joined_communities: communityId },
    });
    await subreddit.updateOne(
      { _id: communityId },
      { $pull: { subscribers: userId } }
    );
    console.log(userJoined, "userjoin");
    res.status(200).json({
      status: "success",
      message: "cancelled joining",
      data: userJoined,
    });
  }
};

const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    console.log(commentId, "commentid");
    const { text } = req.body;
    console.log(text, "comment");
    await comments.findByIdAndUpdate(commentId, { $set: { text: text } });
    res.status(200).json({
      status: "success",
      message: "successfully edited comment",
    });
  } catch (err) {
    console.log(err.message);
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  await posts.deleteOne({ _id: postId });
  res.status(200).json({
    status: "success",
    message: "successfully deleted post",
  });
};

const viewPopular = async (req, res) => {
  const userId = req.userId;
  const popular = await users
    .findOne({ _id: userId })
    .populate("joined_communities");

  // console.log(popular, "popular");
};

const editProfile = async (req, res) => {
  const userId = req.userId;
  const { username } = req.body;
  await users.findByIdAndUpdate(userId, { $set: { username: username } });
  res.status(200).json({
    status: "success",
    message: "successfully fetched user details",
  });
};

// const searchCommunity=async(req,res)=>{
// const {communityName}= req.params
// const community=await subreddit.findOne({name:communityName})
// res.status(200).json({
//   status:"success",
//   message:"successfully fetched community",
//   data:community
// })
// }

const allCommunities = async (req, res) => {
  const communities = await subreddit.find();
  // console.log(communities, "all");
  res.status(200).json({
    status: "success",
    message: "fetched communities",
    data: communities,
  });
};

const reportPost = async (req, res) => {
  const { postId } = req.params;
  // console.log(postId, "post users");
  await posts.updateOne({ _id: postId }, { $inc: { reported_count: 1 } });

  res.status(200).json({
    status: "success",
    message: "successfully reported post",
  });
};

const replyComment = async (req, res) => {
  const { commentId } = req.params;
  const { reply } = req.body;
  await comments.updateOne({ _id: commentId }, { $push : { reply: reply } });
  res.status(200).json({
    status: "success",
    message: "successfully replied to comment",
  });
};

const viewReply = async (req, res) => {
  const { postId } = req.params;
  const reply = await comments.find({ postId: postId });

  res.status(200).json({
    status: "success",
    message: "successfully replied to comment",
    data: reply,
  });
};

const deleteProfile = async (req, res) => {
  const userId = req.userId;
  console.log(userId,"user");
  await users.findByIdAndDelete(userId);
  await posts.deleteOne({ postedBy: userId });
  await votes.deleteOne({userId:userId})
  // await comments.findByIdAndDelete(userId);
  console.log('success');
  res.status(200).json({
    status: "success",
    message: "successfully deleted user account",
  });
};



const userUpvoted = async (req, res) => {
  const userId = req.userId;
  try {
    const votedPosts = await votes.find({ userId: userId,action:"upvote"}).populate('postId');
    console.log(votedPosts, "voteddd");

    res.status(200).json({
      status: "success",
      message: "successfully fetched upvoted post",
      data: votedPosts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};




const userDownvoted = async (req, res) => {
  const userId = req.userId;
  try {
    const votedPosts = await votes.find({ userId: userId,action:"downvote" }).populate('postId');
    console.log(votedPosts, "voteddd");

    res.status(200).json({
      status: "success",
      message: "successfully fetched upvoted post",
      data: votedPosts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};







module.exports = {
  register,
  login,
  createPost,
  createCommunity,
  upVote,
  downVote,
  viewPosts,
  postComment,
  viewSpecificPost,
  viewComments,
  userProfile,
  viewUserPost,
  viewUserComment,
  viewSingleCommunity,
  deleteComment,
  viewCommunityPost,
  uploadAvatar,
  editComment,
  joinCommunity,
  editPost,
  deletePost,
  viewPopular,
  editProfile,
  allCommunities,
  reportPost,
  replyComment,
  viewReply,
  deleteProfile,
  userUpvoted,
  userDownvoted
};
