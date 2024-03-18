
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');
const {sendMsg,fetchMsgs, clearChat} = require('./collab.controller.js');

router.post('/sendMsgToGroupChat',authenticateJWT,sendMsg);
router.post('/getChat',authenticateJWT, fetchMsgs);
router.post('/clearChat',authenticateJWT,clearChat);
module.exports = router;