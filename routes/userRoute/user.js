const express=require('express')
const userRoute=express.Router()
const userController= require('../../controllers/userController/user')
const authentication=require('../../middlewares/jwt')
const tryCatch=require('../../middlewares/tryCatchMiddleware')






userRoute.post('/register',tryCatch(userController.register))
userRoute.post('/login',tryCatch(userController.login))
userRoute.get('/users/userprofile',authentication,tryCatch(userController.userProfile))
userRoute.get('/users/viewuserpost',authentication,tryCatch(userController.viewUserPost))
userRoute.get('/users/viewusercomment',authentication,tryCatch(userController.viewUserComment))
userRoute.put('/users/uploadavatar',authentication,tryCatch(userController.uploadAvatar))
userRoute.put('/users/editprofile',authentication,tryCatch(userController.editProfile))
userRoute.delete('/users/deleteprofile',authentication,tryCatch(userController.deleteProfile))
userRoute.get('/users/userupvote',authentication,tryCatch(userController.userUpvoted))
userRoute.get('/users/userdownvote',authentication, tryCatch(userController.userDownvoted))




module.exports=userRoute


















module.exports=userRoute