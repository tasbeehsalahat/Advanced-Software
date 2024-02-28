const { authenticateJWT } = require('../middleware/middleware.js');
const {filter,createTask,notification} = require('./organizer.controller.js');
const router = require('express').Router();

router.get('/filter',filter);
router.get('/notification',authenticateJWT,notification);

module.exports = router;



