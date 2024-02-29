const { updateuser , join ,shownotification} = require('./user.controller.js');
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');

router.put('/user', authenticateJWT,updateuser);
router.post('/user',authenticateJWT,join);
router.get('/show',authenticateJWT,shownotification)
module.exports = router;

