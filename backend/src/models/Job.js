const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, index: true },
        companyLogo: { type: String, required: true, trim: true },
        experience: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true, index: true },
        salary: { type: String, required: true, trim: true },
        jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true, index: true },
        shift: { type: String, required: true, trim: true },
        department: { type: String, required: true, trim: true },
        education: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        posted: { type: String, required: true, trim: true },
        status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED', index: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
