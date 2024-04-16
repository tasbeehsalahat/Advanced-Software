const { authenticateJWT } = require('../../middleware/middleware.js');
const { notification, chooseStatus } = require('../../services/notification.js');
const { personalInformation } = require('../../services/personalInformation.js');
const { getCrafter } = require('../admin/admin.controller.js');
const { joinevent, addtasks, showTask } = require('./organizer.controller.js');
const router = require('express').Router();


router.get('/notification',authenticateJWT,notification);
router.get('/chooseStatus',authenticateJWT,chooseStatus);
router.get('/personalInformation',authenticateJWT,personalInformation);
router.post('/event',authenticateJWT,joinevent);
router.get('/crafters',authenticateJWT,getCrafter);
router.post('/tasks',authenticateJWT,addtasks);
router.get('/showTask',authenticateJWT,showTask);
module.exports = router;



