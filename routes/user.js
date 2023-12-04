const express=require('express')
const userRoute=express.Router()
const userController=require('../controllers/usersController')
const authentication=require('../middlewares/jwt')




userRoute.post('/register',userController.register)
userRoute.post('/login',userController.login)
userRoute.post('/users/createpost',authentication,userController.createPost)
userRoute.get('/viewposts',userController.viewPosts)
userRoute.get('/users/singlepost/:id',userController.viewSpecificPost)
userRoute.post('/users/createcommunity',authentication,userController.createCommunity)
userRoute.post('/users/upvote/:id',authentication,userController.upVote)
userRoute.post('/users/downvote/:id',authentication,userController.downVote)
userRoute.post('/users/postcomment/:id',authentication,userController.postComment)
userRoute.get('/users/viewcomment/:id',userController.viewComments)
userRoute.get('/users/userprofile',authentication,userController.userProfile)
userRoute.get('/users/viewuserpost',authentication,userController.viewUserPost)
userRoute.get('/users/viewusercomment',authentication,userController.viewUserComment)
userRoute.get('/users/singlecommunity/:id',userController.viewSingleCommunity)
userRoute.delete('/users/deletecomment/:id',userController.deleteComment)
userRoute.get('/users/communitypost/:communityname',userController.viewCommunityPost)
userRoute.put('/users/uploadavatar',authentication,userController.uploadAvatar)
userRoute.put('/users/editcomment/:commentId',authentication,userController.editComment)
userRoute.put('/users/joincommunity/:communityId',authentication,userController.joinCommunity)
userRoute.put('/users/editpost/:postId',authentication,userController.editPost)
userRoute.delete('/users/deletepost/:postId',authentication,userController.deletePost)
userRoute.get('/users/viewpopular',authentication,userController.viewPopular)
userRoute.put('/users/editprofile',authentication,userController.editProfile)
userRoute.get('/users/allcommunities',authentication,userController.allCommunities)
userRoute.put('/users/reportpost/:postId',authentication,userController.reportPost)
userRoute.put('/users/replycomment/:commentId',authentication,userController.replyComment)
userRoute.get('/users/viewreply/:postId',userController.viewReply)
userRoute.delete('/users/deleteprofile',authentication,userController.deleteProfile)
userRoute.get('/users/userupvote',authentication,userController.userUpvoted)
userRoute.get('/users/userdownvote',authentication,userController.userDownvoted)






















module.exports=userRoute