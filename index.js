const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const teamRouter = require('./routes/teamRoutes');



dotenv.config();
const app =express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true             
}));

app.use(cookieParser());
app.use('/auth/api',authRouter);
app.use(teamRouter);

// Server setup
connectDB();
app.listen(5000, () => {
  console.log("Server is up and running on port 5000");
});