import express from "express";



const app = express();



app.use(express.json())

import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoutes'
import authRoutes from './routes/authRoutes'
import { authenticateToken } from "./middlewares/authMiddleware";


app.get('/', (req, res) => {
    res.send('hello bro')
})

//calling routes----------->
app.use('/users', authenticateToken, userRoutes)
app.use('/tweet', authenticateToken, tweetRoutes)
app.use('/auth', authRoutes)




app.listen(3000, () => {
    console.log('server is running ');
})