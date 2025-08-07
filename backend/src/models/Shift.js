const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clockInTime: Date,
    clockOutTime: Date,
    clockInLocation: {
        latitude: Number,
        longitude: Number
    },
    clockOutLocation: {
        latitude: Number,
        longitude: Number
    },
    clockInNote: String,
    clockOutNote: String
}, { timestamps: true });

module.exports = mongoose.model('Shift', shiftSchema);
