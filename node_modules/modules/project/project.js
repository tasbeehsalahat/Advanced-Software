const {addproject,deleteproject,updateproject,getproject} = require('./project.contrroller.js');
const router = require('express').Router();

router.post('/projects', addproject);
router.delete('/project', deleteproject);
router.put('/project', updateproject);
router.get('/project', getproject);

module.exports = router;