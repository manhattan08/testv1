const express = require('express');
const mongoose = require('mongoose');
const appointment_router = require("./routes/appointment.route");
const checkAppointment = require("./services/notification.service");

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api",appointment_router);

const start = async () => {
    try{
        await mongoose.connect("mongodb+srv://manhattan:root@dia-task.9vpfpm4.mongodb.net/?retryWrites=true&w=majority");

        await checkAppointment()

        app.listen(port,()=>{
            console.log(`Server starting on ${port}`);
        })
    } catch (e) {
        console.log(e)
    }
}



start()
