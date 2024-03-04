const mongoose = require('mongoose');
const User = require("./models/user.model");
const Doctor = require("./models/doctor.model");

mongoose.connect("mongodb+srv://manhattan:root@dia-task.9vpfpm4.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to MongoDB");

        // Проверяем, есть ли данные в коллекциях User и Doctor
        return Promise.all([User.countDocuments(), Doctor.countDocuments()]);
    })
    .then(([userCount, doctorCount]) => {
        if (userCount > 0 || doctorCount > 0) {
            console.log("Data already exists. Shutting down the server.");
        } else {
            const users = [
                { id: '1', phone: '+380115550011', name: 'Иван' },
                { id: '2', phone: '+380974628831', name: 'Андрей' },
            ];

            const doctors = [
                {
                    id: '1',
                    name: 'Петр',
                    spec: 'Терапевт',
                    slots: generateSlots(15)
                },
            ];

            return User.insertMany(users)
                .then(() => {
                    console.log("Users inserted successfully");
                    return Doctor.insertMany(doctors);
                })
                .then(() => {
                    console.log("Doctors inserted successfully");
                })
                .catch((error) => {
                    console.error("Error inserting data:", error);
                });
        }
    })
    .finally(() => {
        console.log("All operations completed");
        mongoose.connection.close().then(() => {
            console.log("MongoDB connection closed");
            process.exit();
        });
    });

function generateSlots(numSlots) {
    const slots = [];
    const currentDate = new Date();
    currentDate.setHours(9, 0, 0, 0);

    for (let i = 0; i < numSlots; i++) {
        const slotTime = new Date(currentDate.getTime() + i * 60 * 60 * 1000);

        if (slotTime.getHours() < 18) {
            slots.push(slotTime);
        }
    }

    return slots;
}
