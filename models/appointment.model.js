const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    user: { type: String, required:true },
    doctor: { type: String, required:true },
    slot: { type: Date, required: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
