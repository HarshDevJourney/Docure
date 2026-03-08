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