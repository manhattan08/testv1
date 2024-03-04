const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    spec: { type: String, required: true },
    slots: [{ type: Date }],
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
