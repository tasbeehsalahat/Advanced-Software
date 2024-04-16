
const router = require('express').Router();
const { authenticateJWT } = require('../middleware/middleware.js');
const { filter } = require('../services/filter.js');
const {getJob,searchJobs,getItem,searchByTerm,chatGPT,finishedproject, featuredproject, showevent ,commentOnProj, getCommentsForProj} = require('./homeController.js');

router.post('/search',authenticateJWT,searchByTerm);
router.post('/chatGPT',authenticateJWT,chatGPT);
router.get('/getItem',authenticateJWT, getItem);
router.get('/finishedproject',finishedproject);
router.get('/featuredproject',featuredproject);
router.get('/showevents',showevent)
router.post('/comment',authenticateJWT,commentOnProj);
router.get('/showComments',getCommentsForProj)
router.get('/jobs',searchJobs);
router.get('/job',getJob);

router.get('/filter',filter);
module.exports = router;
//sj