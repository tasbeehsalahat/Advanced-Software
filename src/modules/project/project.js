<<<<<<< HEAD
const {addproject,deleteproject,updateproject,getproject} = require('./project.contrroller.js');
const router = require('express').Router();

router.post('/projects', addproject);
router.delete('/project', deleteproject);
router.put('/project', updateproject);
router.get('/project', getproject);
=======
const { authenticateJWT } = require('../middleware/middleware.js');
const {addproject,deleteproject,updateproject,getproject} = require('./project.contrroller.js');
const router = require('express').Router();

router.post('/projects',authenticateJWT, addproject);
router.delete('/project', authenticateJWT,deleteproject);
router.put('/project', authenticateJWT,updateproject);
router.get('/project',authenticateJWT, getproject);
>>>>>>> 821882947a6686f7ce3658491a700ec0f0dc8bd4

module.exports = router;