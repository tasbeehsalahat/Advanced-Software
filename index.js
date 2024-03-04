const express = require('express');
const app = express();
<<<<<<< HEAD
const admin = require('./src/modules/roles/admin/admin.js');
const auth = require('./src/modules/auth/auth.js');
const project= require('./src/modules/project/project.js');
const organizer=require('./src/modules/roles/organizer/organizer.js')
const users = require('./src/modules/roles/users/user.js');
const email = require('./src/modules/services/email/email.js');
=======
const auth = require('./src/modules/auth/auth.js');
const project= require('./src/modules/project/project.js');
const email = require('./src/modules/services/email/email.js');
const admin = require('./src/modules/roles/admin/admin.js')
const users = require('./src/modules/roles/users/user.js')
const organizer = require('./src/modules/roles/organizer/organizer.js')
>>>>>>> 8a5a8c0f43fed4ac26b24e79d69ec48b5aaa2f4e
const password = require('./src/modules/services/password/password.js');
const notfoundpage = require('./src/modules/notfoundpage/notfoundpage.js');
const Collaborations=require('./src/modules/Collaborations/collab.js')
const Home=require('./src/modules/HomePage/home.js')

app.use(express.json())
app.use('/admin',admin)
app.use('/auth',auth)
app.use('/project',project)
app.use('/organizer',organizer)
app.use('/users',users)
app.use('/email',email)
app.use('/password',password)
app.use('/upload', express.static('upload'));
app.use('/collaborations',Collaborations)
app.use('/Home',Home)
app.use('*', notfoundpage)
app.listen(3000,() => {
    console.log('listening on 3000');
});