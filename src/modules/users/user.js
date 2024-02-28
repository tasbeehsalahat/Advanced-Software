const { updateuser } = require('./user.controller.js');
const router = require('express').Router();

router.put('/user', updateuser);

module.exports = router;

