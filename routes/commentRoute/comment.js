const express=require('express')
const commentRoute=express.Router()
const commentController=require('../../controllers/commentController/comment')
const authentication=require('../../middlewares/jwt')
const tryCatch=require('../../middlewares/tryCatchMiddleware')




commentRoute.post('/users/postcomment/:id',authentication,tryCatch(commentController.postComment))
commentRoute.get('/users/viewcomment/:id',tryCatch(commentController.viewComments))
commentRoute.put('/users/editcomment/:commentId',authentication,tryCatch(commentController.editComment))
commentRoute.delete('/users/deletecomment/:id',tryCatch(commentController.deleteComment))
commentRoute.put('/users/replycomment/:commentId',authentication,tryCatch( commentController.replyComment))
commentRoute.get('/users/viewreply/:postId',tryCatch(commentController.viewReply))
commentRoute.put('/users/votecomment/:commentId',tryCatch(commentController.voteComment))



module.exports=commentRoute

