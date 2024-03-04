
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');
const {getItem,searchByTerm,chatGPT,finishedproject,featuredproject, joinevent} = require('./homeController.js');

router.post('/search',authenticateJWT,searchByTerm);
router.post('/chatGPT',authenticateJWT,chatGPT);
router.get('/getItem',authenticateJWT, getItem);
router.get('/finishedproject',finishedproject);
router.post('/featuredproject',authenticateJWT,featuredproject);
module.exports = router;