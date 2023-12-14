require("dotenv").config();
const users = require("../../models/userSchema");
const authSchema = require("../validation/validation");
const posts = require("../../models/postSchema");
const subreddit = require("../../models/subReddit");






// CREATE COMMUNITY
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



  // VIEW SINGLE COMMUNITY
  const viewSingleCommunity = async (req, res) => {
    const communityname = req.params.id;
    const community = await subreddit.findOne({ name: communityname });
    res.status(200).json({
      status: "success",
      message: "successfully fetched",
      data: community,
    });
  };



  
// VIEW COMMUNITY POSTS
  const viewCommunityPost = async (req, res) => {
      const { communityname } = req.params;
      const post = await posts.find({ subreddit: communityname });
      console.log(post, "communitypost");
      res.status(200).json({
        status: "success",
        message: "successfully fetched",
        data: post,
      });
  };


  // JOIN COMMUNITY
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
        { $push: { subscribers: userId } }
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




// VIEW ALL COMMUNITIES
  const allCommunities = async (req, res) => {
    const communities = await subreddit.find();
    res.status(200).json({
      status: "success",
      message: "fetched communities",
      data: communities,
    });
  };






module.exports={
createCommunity,
viewSingleCommunity,
viewCommunityPost,
joinCommunity,
allCommunities
  }

