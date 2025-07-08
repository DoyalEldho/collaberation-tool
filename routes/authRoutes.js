const express = require('express');
const {  userRegister, userLogin, userInfo } = require('../controller/authController');
const authRouter =express.Router();
const auth = require('../middleware/auth')

authRouter.post('/register',userRegister);  
authRouter.post('/login',userLogin);  
authRouter.get('/info',auth,userInfo);


module.exports = authRouter;