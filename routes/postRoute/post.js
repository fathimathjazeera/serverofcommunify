const express=require('express')
const postRoute=express.Router()
const postController=require('../../controllers/postController/post')
const authentication=require('../middlewares/jwt')
const tryCatch=require('../middlewares/tryCatchMiddleware')



postRoute.post('/users/createpost',authentication,tryCatch(postController.createPost))
postRoute.get('/viewposts',tryCatch(postController.viewPosts))
postRoute.get('/users/viewpopular',authentication,tryCatch(postController.viewPopular))
postRoute.get('/users/singlepost/:id',tryCatch(postController.viewSpecificPost))
postRoute.put('/users/editpost/:postId',authentication,postController.editPost)
postRoute.put('/users/reportpost/:postId',authentication,postController.reportPost)
postRoute.delete('/users/deletepost/:postId',authentication,postController.deletePost)
postRoute.post('/users/upvote/:id',authentication,tryCatch(postController.upVote))
postRoute.post('/users/downvote/:id',authentication,tryCatch(postController.downVote))



