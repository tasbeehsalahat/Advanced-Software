const { authenticateJWT } = require('../middleware/middleware.js');
const {addproject,deleteproject,updateproject,getproject,changeProjStatus} = require('./project.contrroller.js');
const router = require('express').Router();

router.post('/',authenticateJWT, addproject);
router.delete('/project', authenticateJWT,deleteproject);
router.patch('/manage', authenticateJWT,updateproject);
router.get('/projects',authenticateJWT, getproject);
router.patch('/ProjStatus',authenticateJWT,changeProjStatus)
module.exports = router;
