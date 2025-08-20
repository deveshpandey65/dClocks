const Job = require("../models/Job");

// Helper function to convert salary string (e.g., "20LPA") to a number
// This function assumes the salary format will always be 'XXLPA'
function parseSalary(salaryString) {
    if (!salaryString) return 0;
    const lpa = parseInt(salaryString.replace("LPA", ""), 10);
    return lpa * 100000; // Assuming 1LPA = 100,000
}

// Corrected buildFilter function to handle a single 'salary' string field
function buildFilter({ q, location, jobType, salaryMin, salaryMax }) {
    const filter = { status: { $ne: 'ARCHIVED' } };

    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { department: { $regex: q, $options: 'i' } },
        ];
    }

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;

    if (salaryMin != null || salaryMax != null) {
        if (salaryMin != null) {
            filter.salary = { ...filter.salary, $gte: `${salaryMin}LPA` };
        }
        if (salaryMax != null) {
            filter.salary = { ...filter.salary, $lte: `${salaryMax}LPA` };
        }
    }

    return filter;
}

// Corrected createJob function to handle the updated fields from your data
async function createJob(req, res, next) {
    try {
        const body = JSON.parse(req.body || "{}");
        // Validate that all required fields are present based on your schema
        if (!body.title || !body.companyLogo || !body.experience || !body.location || !body.salary ||
            !body.jobType || !body.shift || !body.department || !body.education || !body.description || !body.posted) {
            return res.status(400).json({ message: 'All required fields are missing' });
        }

        const job = await Job.create(body);
        res.status(201).json(job);
    } catch (e) { next(e); }
}

// Corrected listJobs function to use the updated filter and sort
async function listJobs(req, res, next) {
    try {
        const { page = 1, limit = 12, sortBy = 'createdAt', order = 'desc' } = req.query;
        const filter = buildFilter(req.query);
        const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

        const [items, total] = await Promise.all([
            Job.find(filter).sort(sort).skip((page - 1) * limit).limit(Number(limit)),
            Job.countDocuments(filter)
        ]);

        res.json({ items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) });
    } catch (e) { next(e); }
}


async function getJob(req, res, next) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (e) { next(e); }
}


async function updateJob(req, res, next) {
    try {
        const body = JSON.parse(req.body || "{}");
        const job = await Job.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (e) { next(e); }
}


async function deleteJob(req, res, next) {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { status: 'ARCHIVED' }, { new: true });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job archived', job });
    } catch (e) { next(e); }
}


module.exports = { createJob, listJobs, getJob, updateJob, deleteJob };
