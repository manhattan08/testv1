const UserRouter = require('express').Router;
const router = new UserRouter();
const appointmentController = require("../contoller/appointment.controller");

router.post("/appointment", appointmentController.createAppointment);

module.exports = router;