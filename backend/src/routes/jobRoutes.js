const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');


router.use(auth);

const { createJob, listJobs, getJob, updateJob, deleteJob } = require('../controllers/jobsController');

router.post('/', authorizeRoles('admin'), createJob);
router.get('/', authorizeRoles('admin','user'), listJobs);
router.get('/:id', authorizeRoles('admin','user'), getJob);
router.patch('/:id', authorizeRoles('admin'), updateJob);
router.delete('/:id', authorizeRoles('admin'), deleteJob);

module.exports = router;
