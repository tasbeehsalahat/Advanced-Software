const { authenticateJWT } = require('../middleware/middleware.js');
const { filter } = require('../services/filter.js');
const notification = require('../services/notification.js');
const router = require('express').Router();

router.get('/filter',filter);
router.get('/notification',authenticateJWT,notification);
module.exports = router;



