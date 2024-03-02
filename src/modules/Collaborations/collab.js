
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');
const {sendMsg,fetchMsgs} = require('./collab.controller.js');

router.post('/sendMsgToGroupChat',authenticateJWT,sendMsg);
router.post('/getChat',authenticateJWT, fetchMsgs);
module.exports = router;