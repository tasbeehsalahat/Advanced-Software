const express = require('express');
const app = express();
const users = require('./src/modules/users/user')
const admin = require('./src/modules/admin/admin.js');
const auth = require('./src/modules/auth/auth.js');
const project= require('./src/modules/project/project.js');

app.use(express.json())

app.use('/admin',admin)
app.use('/auth',auth)
app.use('/user',users)
app.use('/project',project)

app.listen(1103,() => {
    console.log('listening on 1113');
});