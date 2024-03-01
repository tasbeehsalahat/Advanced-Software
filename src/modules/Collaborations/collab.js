const { authenticateJWT } = require('../middleware/middleware.js');
const {chat} = require('./chat.js');

router.post('/chat',authenticateJWT,chat);
const router = require('express').Router();
module.exports = router;