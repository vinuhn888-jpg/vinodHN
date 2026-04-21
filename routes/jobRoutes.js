const express = require('express');
const router = express.Router();

const {
    createJob,
    getJobs,
    login,
    register,
    updateJob,
    deleteJob
} = require("../controllers/jobController");
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/addJob', verifyToken, createJob);


router.get('/getAllJobs', verifyToken, getJobs);   // ✅ protected + user-filtered
router.put('/editJob/:id', verifyToken, updateJob);

router.post('/register', register)

router.delete('/deleteJob/:id', verifyToken, deleteJob);

router.post('/login', login)

module.exports = router;