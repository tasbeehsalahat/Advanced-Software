const express = require('express');
const app = express();
const admin = require('./src/modules/admin/admin.js');
const auth = require('./src/modules/auth/auth.js');
const project= require('./src/modules/project/project.js');
const organizer=require('./src/modules/organizer/organizer.js')
const users = require('./src/modules/users/user.js')
app.use(express.json())

app.use('/admin',admin)
app.use('/auth',auth)
app.use('/project',project)
app.use('/organizer',organizer)
app.use('/users',users)
//
app.listen(182,() => {
    console.log('listening on 1113');
});