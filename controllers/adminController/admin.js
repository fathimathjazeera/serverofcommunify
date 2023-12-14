require('dotenv').config()
const subreddits=require('../../models/subReddit')
const users=require('../../models/userSchema')
const posts=require('../../models/postSchema')
const comments= require('../../models/commentSchema')


const fetchAllUsers=async(req,res)=>{
const allUsers=await users.find()

res.status(200).json({
    status:"success",
    message:"fetched all users",
    data:allUsers
})
}


const specificUser=async(req,res)=>{
const {id}=req.params
const singleuser=await users.findById(id)
console.log(singleuser,"adminyyy");
   res.status(200).json({
    status:"success",
    message:"fetched specific user",
    data:singleuser
   })
}


const viewUserPost=async(req,res)=>{
    const {userId}= req.params
    console.log(userId,"user");
    const post=await posts.find({postedBy:userId})
    console.log(post,"adminuserpost");
    res.status(200).json({
      status:"success",
      message:"successfully fetched",
  data:post
    })
  }

  const viewUserComment=async(req,res)=>{
    const {userId}=req.params
    const comment=await comments.find({userId:userId}).populate('postId').populate('userId')
    console.log(comment);
    res.status(200).json({
      status:"success",
      message:"successfully fetched",
  data:comment
    })
  }


  const createCommunity=async(req,res)=>{
    const userId=req.userId
   const {community}=req.body
console.log(community,"community");
await subreddits.create({
    name: community,
    userId:userId
}) 
  res.status(200).json({
    status:"success",
    message:"successfully created community"
  })
}



const viewCommunities=async(req,res)=>{
   const communities= await subreddits.find().populate('userId')
    res.status(200).json({
        status:"success",
        message:"fetched communities",
        data: communities
    })
}


const viewSpecificCommunity=async(req,res)=>{
    const {communityname}=req.params
    const community=await subreddits.findOne({name:communityname})
    console.log(community,"community");
    res.status(200).json({
      status:"success",
  message:"successfully fetched",
  data:community
    })
  }



  const viewCommunityPost=async(req,res)=>{
      const {communityname}=req.params
      console.log(communityname,'communitypost');
      const post = await posts.find({subreddit:communityname})
      console.log(post,'communitypost');
      res.status(200).json({
        status:"success",
      message:"successfully fetched",
      data:post
      })
   }





const blockUser=async(req,res)=>{
const {userId}=req.params
const user=await users.findOne({_id:userId})
if(user.isBlocked){
 await users.updateOne({_id:userId},{$set:{isBlocked:false}})
 console.log(user,"unblocked");
  res.status(200).json({
    status:"success",
    message:"successfully unblocked",
    data:user
  })
}else{
 await users.updateOne({_id:userId},{$set:{isBlocked:true}})
 console.log(user,"blocked");
  res.status(200).json({
    status:"success",
    message:"successfully blocked",
    data:user
  })
}
  }

const reportedPost= async(req,res)=>{
   const reported= await posts.find({reported_count:{ $gt: 1}})
   console.log(reported,"reported");
res.status(200).json({
  status:"success",
  message:"successfully reported",
  data:reported
})
}













module.exports={
    fetchAllUsers,
    specificUser,
    viewUserPost,
    viewUserComment,
    createCommunity,
    viewCommunities,
    viewSpecificCommunity,
    viewCommunityPost,
  blockUser,
  reportedPost
}




