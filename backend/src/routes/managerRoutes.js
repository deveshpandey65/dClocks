const express = require('express');
const router = express.Router();
const controller = require('../controllers/managerController');
const auth = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { message } = require('statuses');

router.use(auth, authorizeRoles('manager'));
router.post('/set-perimeter', controller.setPerimeter);
router.get('/staff-active', controller.getClockedInStaff);
router.get('/staff-logs/:employeeId', controller.getStaffLogs);
router.get('/dashboard', controller.getDashboard);
router.get('/getAllEmployee', controller.getAllStaff);

module.exports = router;
