const {login,signup} = require('./auth.controller.js');
const router = require('express').Router();

router.post('/login', login)
router.post('/signup', signup)
module.exports = router