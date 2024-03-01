const { updateuser , join ,shownotification,match,informations} = require('./user.controller.js');
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');
const { filter } = require('../services/filter.js');

router.patch('/:email', authenticateJWT,updateuser);//if i want to change a spacific thing
router.post('/user',authenticateJWT,join);
router.get('/show',authenticateJWT,shownotification);
router.get('/filter',filter);
router.get('/matchingcrafter',authenticateJWT,match);
router.get('/crafters/:useremail',informations);
module.exports = router;

