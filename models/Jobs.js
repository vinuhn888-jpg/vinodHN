const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    jobId: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    applyDate: { type: Date, required: false },
    platform: { type: String, required: false },
    followUpDate: { type: Date, required: false },
    package: { type: String, required: false },
    location: { type: String, required: false },
}, {
    timestamps: true
});

module.exports = mongoose.model("Job", jobSchema);