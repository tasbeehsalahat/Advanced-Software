const { authenticateJWT, generateAccessToken } = require('../middleware/middleware.js');
const {login,signup, logout} = require('./auth.controller.js');
const router = require('express').Router();


router.post('/login', login)
router.post('/signup', signup)
router.delete('/log',authenticateJWT,logout)
module.exports = router
