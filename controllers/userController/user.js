require("dotenv").config();
const users = require("../../models/userSchema");
const authSchema = require("../validation/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const posts = require("../../models/postSchema");
const subreddit = require("../../models/subReddit");
const comments = require("../../models/commentSchema");
const votes = require("../../models/votesSchema");



// USER REGISTRATION
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





// USER OR ADMIN LOGIN
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




// VIEW USER ACCOUNT
const userProfile = async (req, res) => {
  const userId = req.userId;
  const data = await users.findById(userId);
  res.status(200).json({
    status: "success",
    message: "successfully fetched userdata",
    data: data,
  });
};





// VIEW USER POSTS
const viewUserPost = async (req, res) => {
  const userId = req.userId;
  const post = await posts.find({ postedBy: userId });
  res.status(200).json({
    status: "success",
    message: "successfully fetched",
    data: post,
  });
};




// VIEW USER COMMENT
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


// UPLOAD PROFILE PIC
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


// EDIT USER ACCOUNT
const editProfile = async (req, res) => {
  const userId = req.userId;
  const { username } = req.body;
  await users.findByIdAndUpdate(userId, { $set: { username: username } });
  res.status(200).json({
    status: "success",
    message: "successfully fetched user details",
  });
};



// DELETE USER ACCOUNT
const deleteProfile = async (req, res) => {
  const userId = req.userId;
  console.log(userId, "user");
  await users.findByIdAndDelete(userId);
  await posts.deleteOne({ postedBy: userId });
  await votes.deleteOne({ userId: userId });
  console.log("success");
  res.status(200).json({
    status: "success",
    message: "successfully deleted user account",
  });
};



// USER UPVOTED POSTS
const userUpvoted = async (req, res) => {
  const userId = req.userId;
  try {
    const votedPosts = await votes
      .find({ userId: userId, action: "upvote" })
      .populate("postId");
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



//USER DOWNVOTED POSTS
const userDownvoted = async (req, res) => {
  const userId = req.userId;
  try {
    const votedPosts = await votes
      .find({ userId: userId, action: "downvote" })
      .populate("postId");
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
  userProfile,
  viewUserPost,
  viewUserComment,
  uploadAvatar,
  editProfile,
  deleteProfile,
  userUpvoted,
  userDownvoted,
};
