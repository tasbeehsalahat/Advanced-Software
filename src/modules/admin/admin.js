const express = require('express');
const connection = require('../../../DB/connection.js');
const {addCrafter,getCrafter,deactivateUser} = require('./admin.controller.js');
const { authenticateJWT } = require('../middleware/middleware.js');
const { update } = require('../users/user.controller.js');
const app = express();
app.post('/crafter',authenticateJWT,addCrafter);
app.get('/crafters',authenticateJWT,getCrafter);//view users 

app.put("/userinfo",authenticateJWT,update)
app.put('/status',authenticateJWT,deactivateUser);
module.exports= app ;
