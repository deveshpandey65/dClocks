const Shift = require('../models/Shift');
const Perimeter = require('../models/LocationPerimeter');

const haversineDistance = (coords1, coords2) => {
    const toRad = deg => (deg * Math.PI) / 180;
    const R = 6371e3;

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);

    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

exports.clockIn = async (req, res) => {
    const body = JSON.parse(req.body || "{}");
    const { latitude, longitude, note } = body;
    const employeeId = req.user._id;

    // Get start of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Check if already clocked in today and not clocked out yet
    const alreadyShift = await Shift.findOne({
        employeeId,
        clockInTime: { $gte: startOfDay },
        clockOutTime: null
    });

    if (alreadyShift) {
        return res.status(400).json({ message: "Already clocked in today" });
    }
    const perimeter = await Perimeter.findOne(); 
    if (!perimeter) {
        return res.status(400).json({ message: "No location perimeter set" });
    }
    const distance = haversineDistance(
        { latitude, longitude },
        { latitude: perimeter.latitude, longitude: perimeter.longitude }
    );
    if (distance > perimeter.radiusInMeters) {
        return res.status(403).json({ message: "Outside allowed perimeter" });
    }
    const shift = new Shift({
        employeeId,
        clockInTime: new Date(),
        clockInLocation: { latitude, longitude },
        clockInNote: note
    });

    await shift.save();
    res.json({ message: "Clocked in", shift });
};

exports.clockOut = async (req, res) => {
    const body = JSON.parse(req.body || "{}");
    const { latitude, longitude, note } = body;
    const employeeId = req.user._id;

    const shift = await Shift.findOne({ employeeId, clockOutTime: null });

    if (!shift) return res.status(400).json({ message: "No active clock-in found" });

    shift.clockOutTime = new Date();
    shift.clockOutLocation = { latitude, longitude };
    shift.clockOutNote = note;

    await shift.save();
    res.json({ message: "Clocked out", shift });
};
exports.getDetails = async (req, res) => {
    try {
        const body = JSON.parse(req.body || "{}");
        const { date } = body;

        // Parse start and end of the given date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const tasks = await Shift.find({
            employeeId: req.user._id,
            clockInTime: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error in getDetails:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

