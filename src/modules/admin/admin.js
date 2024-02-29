const express = require('express');
const connection = require('../../../DB/connection.js');
const {addCrafter,getCrafter,deactivateUser} = require('./admin.controller.js');
const { authenticateJWT } = require('../middleware/middleware.js');
const { updateuser} = require('../users/user.controller.js');
const notification = require('../services/notification.js');
const app = express();
app.post('/crafter',authenticateJWT,addCrafter);
app.get('/crafters',authenticateJWT,getCrafter);//view users 

app.put("/userinfo",authenticateJWT,updateuser); 

app.put('/status',authenticateJWT,deactivateUser);
app.get('/notification',authenticateJWT,notification);

module.exports= app ;
