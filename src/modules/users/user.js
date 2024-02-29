const { updateuser , join } = require('./user.controller.js');
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');

router.put('/user', authenticateJWT,updateuser);
router.post('/user',authenticateJWT,join);
router.get('/show',)
module.exports = router;

