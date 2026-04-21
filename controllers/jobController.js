const Job = require('../models/Jobs');
const Register = require('../models/Register');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




exports.createJob = async (req, res) => {
    try {
        const { company, role, status, applyDate, platform, followUpDate, package, location } = req.body;

        const userId = req.user.id; // ✅ from token

        if (!company || !role) {
            return res.status(400).json({ message: "Please add all fields" });
        }

        const normalizedCompany = company.trim().toLowerCase();
        const normalizedRole = role.trim().toLowerCase();

        const existingJob = await Job.findOne({
            userId, // ✅ user-specific duplicate check
            company: { $regex: `^${company.trim()}$`, $options: 'i' },
            role: { $regex: `^${role.trim()}$`, $options: 'i' }
        });

        if (existingJob) {
            return res.status(400).json({
                message: "You have previously applied for this job"
            });
        }

        const count = await Job.countDocuments({ userId }); // ✅ per user
        const jobId = "JOB" + String(count + 1).padStart(3, '0');

        const job = await Job.create({
            jobId,
            userId, // ✅ attach user
            company: normalizedCompany,
            role: normalizedRole,
            status,
            applyDate,
            platform,
            followUpDate,
            package,
            location
        });

        return res.status(201).json({
            status: 201,
            message: "Job added successfully",
            data: job
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getJobs = async (req, res) => {
    const jobs = await Job.find();
    res.status(200).json(jobs);

}

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, userId: req.user.id });
        if (!job) return res.status(404).json({ message: "Job not found" });
        await Job.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.register = async (req, res) => {
    try {
        const { username, password, firstName, lastName, dob, mobileNumber } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const existingUsername = await Register.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Register.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            dob,
            mobileNumber
        });

        return res.status(201).json({
            message: "User registered successfully",
            data: user
        });

    } catch (error) {
        console.error("Register Error:", error); // 🔥 VERY IMPORTANT

        return res.status(500).json({
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ✅ Check user
        const user = await Register.findOne({ username });

        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "User not found"
            });
        }

        // ✅ Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                status: 400,
                message: "Invalid password"
            });
        }

        // ✅ Generate token
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET || "secret123", // 🔐 use env in real app
            { expiresIn: "7d" }
        );

        // ✅ Remove password before sending
        const userData = {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        };

        return res.status(200).json({
            status: 200,
            message: "Login successful",
            token,
            data: userData
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const job = await Job.findOne({ jobId: id }); // ✅ ensure it belongs to this user

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        return res.status(200).json({ status: 200, message: "Job updated successfully", data: updatedJob });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
