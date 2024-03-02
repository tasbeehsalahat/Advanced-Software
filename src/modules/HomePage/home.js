
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');
const {getItem,searchByTerm} = require('./homeController.js');

router.post('/search',authenticateJWT,searchByTerm);
router.get('/getItem',authenticateJWT, getItem);
module.exports = router;