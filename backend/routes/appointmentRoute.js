const express = require("express");
const { requiredRole, protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const {
  appointmentStatusValidator,
  bookAppointmentValidator,
  rescheduleValidator,
  updateStatusValidator,
} = require("../middlewares/validationMiddleware");
const {
  getBookedSlotDoctor,
  getDoctorAppointmentList,
  getPatientAppointmentList,
  bookAppointment,
  getRoomJoinInfo,
  endRoom,
  getAppointmentByID,
  getPatientHistoryForDoctor,
  uploadPrescription,
  deletePrescription,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleConsultation,
  markAsFollowUp,
  updateNotes,
} = require("../middlewares/appointmentMiddleware");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/booked-slot/:doctorID/:date", getBookedSlotDoctor);

// protected route
router.use(protect);

router.get("/details/:id", getAppointmentByID);
router.get("/patient-history/:patientId", requiredRole("doctor"), getPatientHistoryForDoctor);
router.get(
  "/doctor",
  requiredRole("doctor"),
  appointmentStatusValidator,
  validate,
  getDoctorAppointmentList,
);
router.get(
  "/patient",
  requiredRole("patient"),
  appointmentStatusValidator,
  validate,
  getPatientAppointmentList,
);

router.get("/join/:id", getRoomJoinInfo);
router.put("/end/:id", endRoom);

router.put("/prescription/:id", requiredRole("doctor"), upload.single("file"), uploadPrescription);
router.delete("/prescription/:id", requiredRole("doctor"), deletePrescription);
// router.put('/status/:id', requiredRole('doctor'),updateStatusValidator, validate, updateAppointmentStatus)

router.post(
  "/book-slot",
  requiredRole("patient"),
  bookAppointmentValidator,
  validate,
  bookAppointment,
);
router.put("/follow-up/:id", requiredRole("doctor"), markAsFollowUp);
router.put("/notes/:id", requiredRole("doctor"), updateNotes);
router.put("/cancel/:id", cancelAppointment);
// router.put('/reschedule/:id', rescheduleValidator, validate, rescheduleConsultation)

module.exports = router;
