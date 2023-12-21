const express=require('express')
const adminRoute=express.Router()
const adminController=require('../../controllers/adminController/admin')
const authentication= require('../../middlewares/adminJwt')




adminRoute.get('/admin/allusers',authentication,adminController.fetchAllUsers)
adminRoute.get('/specificuser/:id',authentication,adminController.specificUser)
adminRoute.get('/admin/viewuserpost/:userId',authentication,adminController.viewUserPost)
adminRoute.get('/admin/viewusercomment/:userId',authentication,adminController.viewUserComment)
adminRoute.get('/admin/viewusercomment/:userId',authentication,adminController.viewUserComment)
adminRoute.post('/admin/createcommunity',authentication,adminController.createCommunity)
adminRoute.get('/admin/viewcommunities',authentication,adminController.viewCommunities)
adminRoute.get('/admin/specificcommunity/:communityname',adminController.viewSpecificCommunity)
adminRoute.get('/admin/communitypost/:communityname',adminController.viewCommunityPost)
adminRoute.put('/admin/blockuser/:userId',adminController.blockUser)
adminRoute.get('/admin/reportedpost',adminController.reportedPost)
adminRoute.get('/admin/paginateduser',adminController.paginatedUsers)











module.exports=adminRoute