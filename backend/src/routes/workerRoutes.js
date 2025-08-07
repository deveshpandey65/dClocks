const express = require('express');
const router = express.Router();
const controller = require('../controllers/workerController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.use(auth, role('employee'));
router.post('/clock-in', controller.clockIn);
router.post('/clock-out', controller.clockOut);
router.post('/getDetails', controller.getDetails);

module.exports = router;
