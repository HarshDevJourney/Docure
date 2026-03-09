const express = require('express')
const { requiredRole, protect } = require('../middlewares/authMiddleware')
const { appointmentStatusValidator, bookAppointmentValidator, rescheduleValidator, updateStatusValidator } = require('../middlewares/validationMiddleware')
const {
    getBookedSlotDoctor,
    getDoctorAppointmentList,
    getPatientAppointmentList,
    bookAppointment,
    getRoomJoinInfo,
    endRoom,
    getAppointmentByID,
    uploadPrescription,
    updateAppointmentStatus,
    cancelAppointment,
    rescheduleConsultation,
    markAsFollowUp
} = require('../middlewares/appointmentMiddleware')
const validate = require('../middlewares/validate');

const router = express.Router()

router.get('/booked-slot/:doctorID/:date', getBookedSlotDoctor)

// protected route
router.use(protect)

router.get('/details/:id', getAppointmentByID)
router.get('/doctor', requiredRole('doctor'), appointmentStatusValidator, validate, getDoctorAppointmentList)
router.get('/patient', requiredRole('patient'), appointmentStatusValidator, validate, getPatientAppointmentList)

router.get('/join/:id', getRoomJoinInfo)
router.put('/end/:id', endRoom)

router.put('/prescription/:id', requiredRole('doctor'), uploadPrescription)
// router.put('/status/:id', requiredRole('doctor'),updateStatusValidator, validate, updateAppointmentStatus)

router.post('/book-slot', requiredRole('patient'), bookAppointmentValidator, validate, bookAppointment)
router.put('/follow-up/:id', requiredRole('doctor'), markAsFollowUp)
// router.put('/cancel/:id', cancelAppointment)
// router.put('/reschedule/:id', rescheduleValidator, validate, rescheduleConsultation)

module.exports = router;

