import express from "express";



const app = express();



app.use(express.json())

import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoutes'


app.get('/', (req, res) => {
    res.send('hello bro')
})

//calling routes----------->
app.use('/users', userRoutes)
app.use('/tweet', tweetRoutes)




app.listen(3000, () => {
    console.log('server is running ');
})