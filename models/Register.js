const mongoose = require('mongoose')

const RegisterSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    mobileNumber: { type: String, required: true }
})

module.exports = mongoose.model("Register", RegisterSchema);