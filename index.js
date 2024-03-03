const express = require('express');
const app = express();
const admin = require('./src/modules/roles/admin/admin.js');
const auth = require('./src/modules/auth/auth.js');
const project= require('./src/modules/project/project.js');
const organizer=require('./src/modules/roles/organizer/organizer.js')
const users = require('./src/modules/roles/users/user.js');
const email = require('./src/modules/services/email/email.js');
const password = require('./src/modules/services/password/password.js');
const notfoundpage = require('./src/modules/notfoundpage/notfoundpage.js');
const Collaborations=require('./src/modules/Collaborations/collab.js')
const HomePage=require('./src/modules/HomePage/home.js')
app.use(express.json())
app.use('/admin',admin)
app.use('/auth',auth)
app.use('/project',project)
app.use('/organizer',organizer)
app.use('/users',users)
app.use('/email',email)
app.use('/password',password)
app.use('/collaborations',Collaborations)
app.use('/Home',HomePage)
app.use('*', notfoundpage)
app.listen(3000,() => {
    console.log('listening on 3000');
});