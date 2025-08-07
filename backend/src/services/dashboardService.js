const Shift = require('../models/Shift');
const moment = require('moment');

exports.getDashboardData = async () => {
    const today = moment().startOf('day');
    const lastWeek = moment().subtract(7, 'days').toDate();

    const shifts = await Shift.find({ clockInTime: { $gte: lastWeek } });

    const dailyStats = {};
    const userStats = {};

    shifts.forEach(shift => {
        const day = moment(shift.clockInTime).format('YYYY-MM-DD');
        const userId = shift.employeeId.toString();

        const duration = shift.clockOutTime
            ? (new Date(shift.clockOutTime) - new Date(shift.clockInTime)) / (1000 * 60 * 60)
            : 0;

        dailyStats[day] = (dailyStats[day] || 0) + 1;
        userStats[userId] = (userStats[userId] || 0) + duration;
    });

    const avgHoursPerDay = (shifts.reduce((acc, shift) => {
        if (!shift.clockOutTime) return acc;
        return acc + (new Date(shift.clockOutTime) - new Date(shift.clockInTime)) / (1000 * 60 * 60);
    }, 0) / (shifts.length || 1)).toFixed(2);

    return {
        avgHoursPerDay,
        dailyClockIns: dailyStats,
        weeklyUserTotalHours: userStats
    };
};
