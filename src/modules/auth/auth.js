const {login,signup} = require('./auth.controller.js');
const router = require('express').Router();

<<<<<<< HEAD
=======

>>>>>>> 821882947a6686f7ce3658491a700ec0f0dc8bd4
router.post('/login', login)
router.post('/signup', signup)
module.exports = router