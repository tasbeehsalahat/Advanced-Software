const express = require('express');
const updated = require('./user.controller');

const app = express();

app.put("/userinfo",updated)
module.exports= app ;
