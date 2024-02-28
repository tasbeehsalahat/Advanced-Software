const { authenticateJWT } = require('../middleware/middleware.js');
const {filter,createTask} = require('./organizer.controller.js');
const router = require('express').Router();

router.get('/filter',filter);
router.get('/tasks',createTask)
module.exports = router;



