const { authenticateJWT } = require('../middleware/middleware.js');
const {sendMsg,fetchMsgs} = require('./chatController.js');
const router = require('express').Router();

router.post('/send/group', authenticateJWT,sendMsg)
router.get('/history/:senderId/:receiverId', authenticateJWT,fetchMsgs)

module.exports = router;