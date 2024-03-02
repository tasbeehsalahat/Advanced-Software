const { updateuser , join ,shownotification,match,informations, LendMaterial,Lendcenter} = require('./user.controller.js');
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');
const { filter } = require('../services/filter.js');
const upload = require('./image.js');
router.patch('/:email', authenticateJWT,updateuser);//if i want to change a spacific thing
router.post('/user',authenticateJWT,join);
router.get('/show',authenticateJWT,shownotification);
router.get('/filter',filter);
router.get('/matchingcrafter',authenticateJWT,match);
router.get('/crafters/:useremail',informations);
router.post('/lendcenter',authenticateJWT,Lendcenter);///
router.get('/lendMaterial',authenticateJWT,LendMaterial)
module.exports = router;

