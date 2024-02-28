const { authenticateJWT } = require('../middleware/middleware.js');
const {addproject,deleteproject,updateproject,getproject} = require('./project.contrroller.js');
const router = require('express').Router();

router.post('/projects',authenticateJWT, addproject);
router.delete('/project', deleteproject);
router.put('/project', updateproject);
router.get('/project',authenticateJWT, getproject);

module.exports = router;