require('dotenv').config();

const express=require('express')
const app=express()
const mongoose=require('mongoose')
const userRoute = require('./routes/userRoute/user')
const adminRoute = require('./routes/adminRoute/admin')
const commentRoute = require('./routes/commentRoute/comment')
const communityRoute= require('./routes/communityRoute/community')
const postRoute= require('./routes/postRoute/post')
const cors=require('cors')





app.use(express.json())
app.use(cors())
mongoose.connect('mongodb+srv://jezi:jezidb@communify.vxi1gld.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log('successfully connected');
})


app.use('/api',userRoute,adminRoute,commentRoute,communityRoute,postRoute)

app.listen(5001,()=>{
    console.log('server running')
}
)





