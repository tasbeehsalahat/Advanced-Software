const { updateuser , join ,shownotification,match,informations,LendMaterial, LendCenter,chooseMaterial} = require('./user.controller.js');
const router = require('express').Router();
const { authenticateJWT } = require('../../middleware/middleware.js');
const { filter } = require('../../services/filter.js');
<<<<<<< HEAD
const upload = require('./image.js');
=======
>>>>>>> 8a5a8c0f43fed4ac26b24e79d69ec48b5aaa2f4e
router.patch('/:email', authenticateJWT,updateuser);//if i want to change a spacific thing
router.post('/project',authenticateJWT,join);
router.get('/notification',authenticateJWT,shownotification);
router.get('/filter',filter);
router.get('/matchingcrafter',authenticateJWT,match);
router.get('/profile/:useremail',informations);
router.post('/LendCenter',authenticateJWT,LendCenter);
router.get('/LendMaterial',authenticateJWT,LendMaterial);
router.post('/chooseMaterial',authenticateJWT,chooseMaterial);
module.exports = router;
//s
