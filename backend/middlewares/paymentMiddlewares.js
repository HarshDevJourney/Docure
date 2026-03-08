const Appointment = require("../models/Appointment");
const Razorpay = require('razorpay');
const crypto = require('crypto')

const razorpayInstance = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
});

module.exports.createOrder = async (req, res) => {
    try {
        const { appointmentID } = req.body;
        const appointment = await Appointment.findById(appointmentID)
            .populate('doctorID', 'name specialization fees')
            .populate('patientID', 'name email phone');

        if(!appointment){
            return res.notFound("Appointment not found");
        }

        if(appointment.patientID._id.toString() !== req.auth.id){
            return res.forbidden("You are not authorized to create an order for this appointment");
        }

        if(appointment.paymentDetails.paymentStatus === 'Paid'){
            return res.badRequest("Payment for this appointment is already paid");
        }

        const amount = appointment.paymentDetails.totalFees;
        const order = await razorpayInstance.orders.create({
            amount : amount * 100,
            currency : 'INR',
            receipt : `appointment_${appointment._id}`,
            notes : {
                appointmentID : appointment._id.toString(),
                doctorName : appointment.doctorID.name,
                patientName : appointment.patientID.name,
                appointmentDate : appointment.date,
                appointmentTime : appointment.slotStart,
                appointmentType : appointment.consultationType,
                appointmentDuration : appointment.slotDurationMinutes
            }
        });

        res.ok({
            orderID : order.id,
            amount : amount,
            currency : 'INR',
            key_id : process.env.RAZORPAY_KEY_ID
        }, "Order created successfully");
    }
    catch(err){
        console.error("Create Order Failed", err);
        res.serverError("Create Order Failed", [err.message]);
    }
}


module.exports.verifyPayment = async (req, res) => {
    try{
        const { appointmentID, razorpay_orderID, razorpay_paymentID, razorpay_signature } = req.body;

        const appointment = await Appointment.findById(appointmentID)
            .populate('doctorID', 'name specialization fees hospitalInfo')
            .populate('patientID', 'name email phone');

        if(!appointment){
            return res.notFound("Appointment not found");
        }

        if(appointment.patientID._id.toString() !== req.auth.id){
            return res.forbidden("You are not authorized to create an order for this appointment");
        }

        const body = razorpay_orderID + '|' + razorpay_paymentID
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        isValid = expectedSignature === razorpay_signature

        if(!isValid){
            return res.badRequest('Payment verification failed')
        }

        appointment.paymentDetails.paymentStatus = "Paid";
        appointment.paymentExpiresAt = null
        appointment.razorpayOrderID = razorpay_orderID;
        appointment.razorpayPaymentID = razorpay_paymentID;
        appointment.razorpaySignature = razorpay_signature;
        appointment.paymentDate = new Date();
        if (!appointment.payoutDetails) {
            appointment.payoutDetails = {};
        }
        appointment.payoutDetails.payoutStatus = "Paid";
        appointment.payoutDetails.payoutDate = new Date();

        await appointment.save();

        return res.success("Payment verified successfully", {
            appointment
        });

    }
    catch(err){
        console.error("Order verification Failed", err);
        res.serverError("Order verification Failed", [err.message]);
    }
}