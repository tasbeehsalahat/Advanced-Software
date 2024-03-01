const express = require('express');
const connection = require('../../../DB/connection.js');
<<<<<<< HEAD
const {addCrafter,getCrafter,addproject} = require('./admin.controller.js');
const { authenticateJWT } = require('../middleware/middleware.js');
const app = express();
app.post('/crafter',authenticateJWT,addCrafter);
app.get('/crafters',authenticateJWT,getCrafter);


module.exports= app ;
=======
const {addCrafter,getCrafter,deactivateUser,featured} = require('./admin.controller.js');
const { authenticateJWT } = require('../middleware/middleware.js');
const notification = require('../services/notification.js');
const { updateuser } = require('../users/user.controller.js');
const app = express();

app.post('/crafter',authenticateJWT,addCrafter);
app.get('/crafters',authenticateJWT,getCrafter);//view users 
app.patch('/:email',authenticateJWT,updateuser); //update user 
app.put('/status',authenticateJWT,deactivateUser);
app.get('/notification',authenticateJWT,notification);
app.get('/featured projects.',authenticateJWT,featured);

module.exports= app ;
////////////////////////////////
>>>>>>> 821882947a6686f7ce3658491a700ec0f0dc8bd4
