const { updateuser , join ,shownotification,match} = require('./user.controller.js');
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');
const { filter } = require('../services/filter.js');

router.put('/user', authenticateJWT,updateuser);
router.post('/user',authenticateJWT,join);
router.get('/show',authenticateJWT,shownotification);
router.get('/filter',filter);
router.get('/matchingcrafter',authenticateJWT,match);
module.exports = router;

