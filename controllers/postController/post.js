
const users = require("../../models/userSchema");
const posts = require("../../models/postSchema");
const subreddit = require("../../models/subReddit");
const votes = require("../../models/votesSchema");


// CREATE POST
const createPost = async (req, res) => {
      const userId = req.userId;
      const { title, content, subredditName, url } = req.body;
      const subName = await subreddit.findOne({ name: subredditName });
        const postData = {
        title: title,
        postedBy: userId,
        subreddit: subName.name,
      };
      if (content) {
        postData.content = content;
      }
      if (url) {
        postData.image = url;
      }
      await posts.create(postData);
      res.status(200).json({
        status: "success",
        message: "posted successfully",
      });
    }
  


// VIEW ALL POSTS
  const viewPosts = async (req, res) => {
    const allposts = await posts.find().populate("postedBy");
    console.log(allposts, "from viewposts");
    res.status(200).json({
      status: "success",
      message: "fetched all posts",
      data: allposts,
    });
  };

  // VIEW POPULAR POST
  const viewPopular = async (req, res) => {
      const userId = req.userId;
      const user = await users
        .findOne({ _id: userId })
        .populate("joined_communities");
      const joinedCommunitiesNames = user.joined_communities.map(
        (community) => community.name
      );
      const postsFromJoinedCommunities = await posts.find({
        subreddit: { $in: joinedCommunitiesNames },
      });
      console.log(postsFromJoinedCommunities,"joinedd");
      res.status(200).json({
        status: "success",
        message: "successfully fetched popular posts",
        data: postsFromJoinedCommunities,
      });
  };

  
// VIEW SINGLE POST
  const viewSpecificPost = async (req, res) => {
      const { id } = req.params;
      const post = await posts.findOne({ _id: id }).populate("postedBy");
      res.status(200).json({
        status: "success",
        message: "successfully fetched specificpost",
        data: post,
      });
    }
  

//EDIT POST
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


// REPORT POST
  const reportPost = async (req, res) => {
    const { postId } = req.params;
    await posts.updateOne({ _id: postId }, { $inc: { reported_count: 1 } });
    res.status(200).json({
      status: "success",
      message: "successfully reported post",
    });
  };



  //DELETE POST
  const deletePost = async (req, res) => {
    const { postId } = req.params;
    await posts.deleteOne({ _id: postId });
    res.status(200).json({
      status: "success",
      message: "successfully deleted post",
    });
  };




//UPVOTE
  const upVote = async (req, res) => {
    const userId = req.userId;
    const postId = req.params.id;
      const existingVote = await votes.findOne({ userId, postId });
      if (!existingVote) {
        await votes.create({ userId, postId, action: "upvote" });
        await posts.updateOne({ _id: postId }, { $inc: { upvote: 1 } });
      } else if (existingVote.action === "upvote") {
        await votes.deleteOne({ userId, postId });
        await posts.updateOne({ _id: postId }, { $inc: { upvote: -1 } });
      } else if (existingVote.action === "downvote") {
        await votes.updateOne({ userId, postId }, { $set: { action: "upvote" } });
        await posts.updateOne(
          { _id: postId },
          { $inc: { upvote: 1, downvote: -1 } }
        );
      }
      const post = await posts.findOne({ _id: postId });
      const totalvote = Math.max(post.upvote - post.downvote, 0);
      await posts.updateOne({ _id: postId }, { $set: { totalvote } });
      res.status(200)
        .json({ status: "success", message: "Vote updated successfully" });
  };



  //DOWNVOTE
  const downVote = async (req, res) => {
    const userId = req.userId;
    const postId = req.params.id;
      const existingVote = await votes.findOne({ userId, postId });
      if (!existingVote) {
        await votes.create({ userId, postId, action: "downvote" });
        await posts.updateOne({ _id: postId }, { $inc: { downvote: 1 } });
      } else if (existingVote.action === "downvote") {
        await votes.deleteOne({ userId, postId });
        await posts.updateOne({ _id: postId }, { $inc: { downvote: -1 } });
      } else if (existingVote.action === "upvote") {
        await votes.updateOne(
          { userId, postId },
          { $set: { action: "downvote" } }
        );
        await posts.updateOne(
          { _id: postId },
          { $inc: { downvote: 1, upvote: -1 } }
        );
      }
      const post = await posts.findOne({ _id: postId });
      const totalvote = Math.max(post.upvote - post.downvote, 0);
      await posts.updateOne({ _id: postId }, { $set: { totalvote } });
      res
        .status(200)
        .json({ status: "success", message: "Vote updated successfully" });
  };








module.exports={
createPost,
viewPosts,
viewPopular,
viewSpecificPost,
editPost,
reportPost,
deletePost,
upVote,
downVote
  }

