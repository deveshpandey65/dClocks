const mongoose = require('mongoose');

const locationPerimeterSchema = new mongoose.Schema({
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    latitude: Number,
    longitude: Number,
    radiusInMeters: Number
}, { timestamps: true });

module.exports = mongoose.model('LocationPerimeter', locationPerimeterSchema);
