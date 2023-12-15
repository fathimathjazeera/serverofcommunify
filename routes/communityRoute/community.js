const express=require('express')
const communityRoute=express.Router()
const communityController=require('../../controllers/communityController/community')
const authentication=require('../../middlewares/jwt')
const tryCatch=require('../middlewares/tryCatchMiddleware')





communityRoute.post('/users/createcommunity',authentication,tryCatch(communityController.createCommunity))
communityRoute.get('/users/singlecommunity/:id',tryCatch(communityController.viewSingleCommunity))
communityRoute.get('/users/communitypost/:communityname', tryCatch( communityController.viewCommunityPost))
communityRoute.put('/users/joincommunity/:communityId',authentication,tryCatch(communityController.joinCommunity))
communityRoute.get('/users/allcommunities',authentication,tryCatch( communityController.allCommunities))
