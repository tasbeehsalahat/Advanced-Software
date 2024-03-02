const express = require('express');
const app = express();
const admin = require('./src/modules/admin/admin.js');
const auth = require('./src/modules/auth/auth.js');
const project= require('./src/modules/project/project.js');
const organizer=require('./src/modules/organizer/organizer.js')
const users = require('./src/modules/users/user.js');
const email = require('./src/modules/email/email.js');
const password = require('./src/modules/services/password/password.js');
const notfoundpage = require('./src/modules/notfoundpage/notfoundpage.js');
app.use(express.json())
app.use('/admin',admin)
app.use('/auth',auth)
app.use('/project',project)
app.use('/organizer',organizer)
app.use('/users',users)
app.use('/email',email)
app.use('/password',password)
app.use('/upload', express.static('upload'));
app.use('*', notfoundpage)


app.listen(3000,() => {
    console.log('listening on 3000');
});