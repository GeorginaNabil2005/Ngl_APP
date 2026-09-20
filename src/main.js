import { config } from 'dotenv';
config();
import { connectDB } from "./common/db/mongoose.js";
import express from 'express' ;
import authRouter from "../src/auth/auth.route.js";
import userRouter from "./user/user.route.js";
import messageRouter from "./message/message.route.js";



const app  = express();

app.use(express.json());

connectDB();
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);


app.listen(   3000,  ()  => console.log('Server started on port 3000'));

