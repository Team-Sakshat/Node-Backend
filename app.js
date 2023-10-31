import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import registerRouter from './src/routes/registerRouter.js';
import crowdRouter from './src/routes/crowdRoutes.js';
import loginRouter from './src/routes/loginRouter.js';
import otpRouter from './src/routes/otpRouter.js';

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});


app.get('/', (req, res) => {
  res.send('Hello, Express!');
});


app.use('/user', loginRouter);
app.use('/user', registerRouter);    
app.use('/otp', otpRouter); 
app.use('/crowd', crowdRouter); 


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
