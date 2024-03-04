const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");
const User = require("../models/user.model");

class AppointmentController {
    async createAppointment(req,res){
        try{
            const { user_id, doctor_id, slot } = req.body;

            if(!user_id || !doctor_id || !slot){
                return res.status(400).json({error:"Incorrect body!"})
            }


            const doctor = await Doctor.findOne({id:doctor_id});
            const user = await User.findOne({id:user_id});

            if(!doctor || !user){
                return res.status(404).json({error:"User or doctor not found!"})
            }

            const targetDate = new Date(slot)
            const isInArray = doctor.slots.some(date => date.getTime() === targetDate.getTime());

            if (!isInArray) {
                return res.status(400).json({ error: 'Slot not available' });
            }

            const existingAppointment = await Appointment.findOne({ doctor:doctor_id, slot });

            if (existingAppointment) {
                return res.status(400).json({ error: 'Slot already booked' });
            }

            const appointment = await Appointment.create({ user:user_id, doctor:doctor_id, slot });

            doctor.slots = doctor.slots.filter(s => s !== slot);
            await doctor.save();

            return res.status(200).json(appointment);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
 }

 module.exports = new AppointmentController()