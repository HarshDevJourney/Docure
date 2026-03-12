const cron = require("node-cron");
const Appointment = require("../models/Appointment");



// Runs every 5 minutes to clean up unpaid, expired appointments
cron.schedule("*/5 * * * *", async () => {
    try {
        const now = new Date();
        
        const expiredAppointments = await Appointment.find({
            status: "Scheduled",
            "paymentDetails.paymentStatus": "Pending",
            paymentExpiresAt: { $lte: now },
        }).select('_id patientID doctorID slotStart');

        if (expiredAppointments.length === 0) {
            return; 
        }

        console.log(`Found ${expiredAppointments.length} expired appointments to clean:`);
        expiredAppointments.forEach(apt => {
            console.log(`- Appointment ${apt._id}: Patient ${apt.patientID}, Slot: ${apt.slotStart}`);
        });

        const result = await Appointment.deleteMany({
            _id: { $in: expiredAppointments.map(apt => apt._id) },
            status: "Scheduled", 
            "paymentDetails.paymentStatus": "Pending" 
        });

        if (result.deletedCount > 0) {
            console.log(`✅ Successfully cleaned ${result.deletedCount} expired unpaid appointments`);
        } else {
            console.log(`⚠️ Found ${expiredAppointments.length} expired appointments but none were deleted (status may have changed)`);
        }

    } catch (err) {
        console.error("❌ Expiry job error:", err);
    }
});

// Runs every 5 minutes to mark no-show appointments as cancelled
// If neither doctor nor patient joins before slotEnd, appointment is marked as cancelled
cron.schedule("*/5 * * * *", async () => {
    try {
        const now = new Date();

        const noShowAppointments = await Appointment.find({
            status: "Scheduled",
            slotEnd: { $lte: now },
        }).select('_id patientID doctorID slotStart slotEnd');

        if (noShowAppointments.length === 0) {
            return;
        }

        console.log(`Found ${noShowAppointments.length} no-show appointments to process:`);
        noShowAppointments.forEach(apt => {
            console.log(`- Appointment ${apt._id}: Patient ${apt.patientID}, Doctor ${apt.doctorID}, Slot: ${apt.slotStart} to ${apt.slotEnd}`);
        });

        const result = await Appointment.updateMany(
            {
                _id: { $in: noShowAppointments.map(apt => apt._id) },
                status: "Scheduled",
            },
            {
                $set: {
                    status: "Cancelled",
                    cancelledReason: "NoShow",
                    updatedAt: new Date()
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ Successfully marked ${result.modifiedCount} no-show appointments as cancelled`);
        } else {
            console.log(`⚠️ Found ${noShowAppointments.length} no-show appointments but none were updated (status may have changed)`);
        }

    } catch (err) {
        console.error("❌ No-show job error:", err);
    }
});