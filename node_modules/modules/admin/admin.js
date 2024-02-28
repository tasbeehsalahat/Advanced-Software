const express = require('express');
const connection = require('../../../DB/connection.js');
const {addCrafter,getCrafter,addproject} = require('./admin.controller.js');
const { authenticateJWT } = require('../middleware/middleware.js');
const app = express();
app.post('/crafter',authenticateJWT,addCrafter);
app.get('/crafters',authenticateJWT,getCrafter);


module.exports= app ;
