const { authenticateJWT } = require('../middleware/middleware.js');
const {addproject,deleteproject,updateproject,getproject,changeProjStatus} = require('./project.contrroller.js');
const router = require('express').Router();

router.post('/project',authenticateJWT, addproject);
router.delete('/project', authenticateJWT,deleteproject);
router.put('/project', authenticateJWT,updateproject);
router.get('/project',authenticateJWT, getproject);
router.patch('/UpdateProjStatus',authenticateJWT,changeProjStatus)
module.exports = router;