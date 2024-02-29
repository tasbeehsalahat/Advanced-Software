const { authenticateJWT } = require('../middleware/middleware.js');
const notification = require('../services/notification.js');
const {filter,createTask} = require('./organizer.controller.js');
const router = require('express').Router();

router.get('/filter',filter);
router.get('/notification',authenticateJWT,notification);

module.exports = router;



