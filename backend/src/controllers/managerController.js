const Perimeter = require('../models/LocationPerimeter');
const Shift = require('../models/Shift');
const User = require('../models/User');
const dashboardService = require('../services/dashboardService');

exports.setPerimeter = async (req, res) => {
    const body = JSON.parse(req.body || "{}");
    const { latitude, longitude, radiusInMeters } = body;
    const managerId = req.user._id;
    console.log(latitude, longitude, radiusInMeters)

    const perimeter = await Perimeter.findOneAndUpdate(
        { managerId },
        { latitude, longitude, radiusInMeters },
        { upsert: true, new: true }
    );
    console.log('Success')
    res.json({ success: true, perimeter });
};

exports.getClockedInStaff = async (req, res) => {
    const activeShifts = await Shift.find({ clockOutTime: null }).populate('employeeId', 'name email');
    console.log("Active", activeShifts)
    res.json(activeShifts);
};

exports.getStaffLogs = async (req, res) => {
    const { employeeId } = req.params;
    const shifts = await Shift.find({ employeeId }).sort({ createdAt: -1 });
    console.log('Logs',shifts)
    res.json(shifts);
};
exports.getAllStaff= async (req, res) => {
    const staff = await User.find({role : 'employee'})
    res.json(staff)
}

exports.getDashboard = async (req, res) => {
    const data = await dashboardService.getDashboardData();
    res.json(data);
};
