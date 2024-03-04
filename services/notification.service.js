const cron = require('node-cron');
const winston = require('winston');
const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");


const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} | ${info.message}`)
    ),
    transports: [
        new winston.transports.File({ filename: 'notifications.log' })
    ]
});

const everyFiveMin = async () => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const appointmentsTomorrow = await Appointment.find({
            slot: { $gte: tomorrow, $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) }
        });

        for(const appointment of appointmentsTomorrow){
            const { user, doctor, slot } = appointment;
            const findUser = await User.findOne({id:user})
            const findDoctor = await Doctor.findOne({id:doctor})

            logger.info(`Привет ${findUser?.name}! Вам через 2 часа к ${findDoctor?.spec} в ${slot}`);
        }
    } catch (error) {
        logger.error(`Ошибка при отправке напоминаний: ${error.message}`);
    }
};

const everyMin = async () => {
    try {
        const twoHoursFromNow = new Date();
        twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);

        const appointmentsTwoHoursAhead = await Appointment.find({
            slot: { $gte: twoHoursFromNow, $lt: new Date(twoHoursFromNow.getTime() + 2 * 60 * 60 * 1000) }
        });

        for(const appointment of appointmentsTwoHoursAhead){
            const { user, doctor, slot } = appointment;

            console.log(slot)
            const findUser = await User.findOne({id:user})
            const findDoctor = await Doctor.findOne({id:doctor})

            logger.info(`Привет ${findUser?.name}! Вам через 2 часа к ${findDoctor?.spec} в ${slot}`);
        }
    } catch (error) {
        logger.error(`Ошибка при отправке напоминаний: ${error.message}`);
    }
};

module.exports = async function checkAppointment(){
    await everyMin()
    await everyFiveMin()
    cron.schedule('*/5 * * * *', async () => {
        await everyMin()
        await everyFiveMin()
    }, {
        timezone: 'Europe/Kiev'
    });
}