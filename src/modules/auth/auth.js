const { authenticateJWT } = require('../middleware/middleware.js');
const {login,signup, logout,} = require('./auth.controller.js');
const router = require('express').Router();


router.post('/login', login)
router.post('/signup', signup)
router.get('/log',authenticateJWT,logout)
module.exports = router
