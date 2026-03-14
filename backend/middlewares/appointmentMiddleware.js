const Appointment = require("../models/Appointment");
const cloudinary = require("../cloudinary");

exports.getDoctorAppointmentList = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { doctorID: req.auth.id };

    if (status) {
      statusArray = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArray };
    }

    const appointments = await Appointment.find(filter)
      .populate("patientID", "name email profilePic phone dob age gender")
      .populate("doctorID", "name profilePic specialization fees")
      .sort({ slotStart: 1, slotEnd: 1 });

    res.ok(appointments, "Doctor Appointment Fetched Successfully");
  } catch (err) {
    console.error("Doctor Appointment Fetch Failed", err);
    res.serverError("Doctor Appointment Fetch Failed", [err?.message]);
  }
};

exports.getPatientAppointmentList = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { patientID: req.user._id };

    if (status) {
      statusArray = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArray };
    }

    const appointments = await Appointment.find(filter)
      .populate("patientID", "name email profilePic")
      .populate("doctorID", "name profilePic hospitalInfo specialization fees")
      .sort({ slotStart: 1, slotEnd: 1 });

    res.ok(appointments, "Patient Appointment Fetched Successfully");
  } catch (err) {
    console.error("Patient Appointment Fetch Failed", err);
    res.serverError("Patient Appointment Fetch Failed", [err?.message]);
  }
};

exports.getPatientHistoryForDoctor = async (req, res) => {
  try {
    const { patientId } = req.params;

    const filter = {
      patientID: patientId,
      doctorID: req.auth.id,
    };

    const appointments = await Appointment.find(filter)
      .populate("patientID", "name email profilePic phone dob age gender bloodGrp medicalHistory")
      .populate("doctorID", "name profilePic hospitalInfo specialization fees")
      .sort({ slotStart: -1 });

    res.ok(appointments, "Patient History Fetched Successfully");
  } catch (err) {
    console.error("Patient History Fetch Failed", err);
    res.serverError("Patient History Fetch Failed", [err?.message]);
  }
};

exports.cancelAppointment = async (req, res) => {};

exports.getBookedSlotDoctor = async (req, res) => {
  try {
    const { doctorID, date } = req.params;
    const now = new Date();
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const bookedAppointment = await Appointment.find({
      doctorID,
      slotStart: { $gte: dayStart, $lte: dayEnd },
      status: { $ne: "Cancelled" },
      $or: [{ "paymentDetails.paymentStatus": "Paid" }, { paymentExpiresAt: { $gt: now } }],
    }).select("slotStart slotEnd");

    const bookedSlot = bookedAppointment.map((slt) => {
      return {
        slotStart: slt.slotStart,
        slotEnd: slt.slotEnd,
      };
    });

    return res.ok(bookedSlot, "Booked Slot Retrieved"); // return [{ slotStart : , slotEnd : }, {}] => a array of objects with 2 key slotStart and slotEnd
  } catch (err) {
    console.error("Booked Slot Retrieval Failed", err);
    res.serverError("Booked Slot Retrieval Failed", [err?.message]);
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const {
      doctorID,
      date,
      medicalHistory,
      slotStart,
      slotEnd,
      consultationType,
      symptoms,
      paymentDetails,
    } = req.body;
    const now = new Date();

    const [year, month, day] = date.split("-").map(Number);
    const [startHour, startMinute] = slotStart.split(":").map(Number);
    const [endHour, endMinute] = slotEnd.split(":").map(Number);

    // Create proper Date objects (local timezone - IST)
    const slotStartDate = new Date(year, month - 1, day, startHour, startMinute, 0);
    const slotEndDate = new Date(year, month - 1, day, endHour, endMinute, 0);
    const appointmentDate = new Date(year, month - 1, day);

    const conflictingAppointment = await Appointment.findOne({
      doctorID,
      status: { $in: ["Scheduled", "Progress"] },
      slotStart: { $lt: slotEndDate },
      slotEnd: { $gt: slotStartDate },
      $or: [{ "paymentDetails.paymentStatus": "Paid" }, { paymentExpiresAt: { $gt: now } }],
    });

    if (conflictingAppointment) {
      return res.forbidden("This time slot is already booked");
    }

    const zegocloudRoomID = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const appointment = new Appointment({
      patientID: req.auth.id,
      doctorID,
      date: new Date(date),
      slotStart: slotStartDate,
      slotEnd: slotEndDate,
      consultationType,
      status: "Scheduled",
      symptoms,
      medicalHistory,
      zegocloudRoomID,
      paymentDetails: { ...paymentDetails, paymentStatus: "Pending" },
      payoutDetails: {
        payoutStatus: "Pending",
        payoutDate: null,
      },
      paymentDate: null,
      paymentExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour to complete payment
    });

    await appointment.save();

    await appointment.populate("doctorID", "name hospitalInfo specialization fees");

    await appointment.populate("patientID", "name email");

    return res.ok(appointment, "Appointment booked successfully");
  } catch (err) {
    console.error("Appointment Booking Failed", err);
    res.serverError("Appointment Booking Failed vgbthbt", [err.message]);
  }
};

exports.getAppointmentByID = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("patientID", "name email profilePic phone dob age gender")
      .populate("doctorID", "name profilePic hospitalInfo specialization fees");

    if (!appointment) {
      return res.notFound("Appointment not found");
    }

    const userType = req.auth.type;

    if (userType == "patient" && appointment.patientID._id.toString() !== req.auth.id) {
      return res.forbidden("Access Denied");
    }

    if (userType == "doctor" && appointment.doctorID._id.toString() !== req.auth.id) {
      return res.forbidden("Access Denied");
    }

    return res.ok({ appointment }, "Appointment Fetched Successfully");
  } catch (err) {
    console.error("Appointment Fetch Failed", err);
    res.serverError("Appointment Fetch Failed", [err?.message]);
  }
};

exports.getRoomJoinInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("patientID", "name")
      .populate("doctorID", "name");

    if (!appointment) {
      return res.notFound("Appointment not found");
    }

    appointment.status = "Progress";
    await appointment.save();

    return res.ok(
      {
        roomId: appointment.zegocloudRoomID,
        appointment,
      },
      "Consultation Room Joined Successfully",
    );
  } catch (err) {
    console.error("Consultation Room Connection Failed", err);
    res.serverError("Consultation Room Connection Failed", [err?.message]);
  }
};

exports.endRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: "Completed",
        notes,
        updatedAt: new Date.now(),
      },
      { new: true },
    ).populate("patientID doctorID");

    if (!appointment) {
      return res.notFound("Appointment not found");
    }

    return res.ok({ appointment }, "Consultation Completed Successfully");
  } catch (err) {
    console.error("Fail to End Meet", err);
    res.serverError("Fail to End Meet", [err?.message]);
  }
};

exports.uploadPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) return res.badRequest("No file uploaded");

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.notFound("Appointment not found");

    if (appointment.doctorID.toString() !== req.auth.id) {
      return res.forbidden("You can only upload prescriptions for your own appointments");
    }

    // multer-storage-cloudinary: file.format has the type, file.mimetype may be undefined
    const isPdf =
      file.format === "pdf" ||
      file.mimetype === "application/pdf" ||
      (file.originalname && file.originalname.endsWith(".pdf"));
    const fileType = isPdf ? "pdf" : "image";

    appointment.pescription = {
      fileUrl: file.path,
      fileType,
      fileName: file.originalname || file.filename || "prescription",
      uploadedBy: req.auth.id,
      uploadedAt: new Date(),
    };
    appointment.updatedAt = new Date();
    await appointment.save();

    res.ok({ pescription: appointment.pescription }, "Prescription uploaded successfully");
  } catch (err) {
    console.error("Prescription upload failed", err);
    res.serverError("Prescription upload failed", [err?.message]);
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.notFound("Appointment not found");

    if (appointment.doctorID.toString() !== req.auth.id) {
      return res.forbidden("You can only delete prescriptions for your own appointments");
    }

    if (!appointment.pescription) {
      return res.badRequest("No prescription to delete");
    }

    // Delete file from Cloudinary
    const fileUrl = appointment.pescription.fileUrl;
    if (fileUrl) {
      const parts = fileUrl.split("/");
      const folderIdx = parts.indexOf("docure");
      if (folderIdx !== -1) {
        const publicIdWithExt = parts.slice(folderIdx).join("/");
        const resourceType = appointment.pescription.fileType === "pdf" ? "raw" : "image";
        // For raw (PDF), keep the extension in publicId; for images, strip it
        const publicId =
          resourceType === "raw" ? publicIdWithExt : publicIdWithExt.replace(/\.[^/.]+$/, "");
        console.log("Deleting from Cloudinary:", { publicId, resourceType, fileUrl });
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log("Cloudinary delete result:", result);
      }
    }

    appointment.pescription = undefined;
    appointment.updatedAt = new Date();
    await appointment.save();

    res.ok(null, "Prescription deleted successfully");
  } catch (err) {
    console.error("Prescription delete failed", err);
    res.serverError("Prescription delete failed", [err?.message]);
  }
};

exports.markAsFollowUp = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        isFollowUp: true,
        updatedAt: new Date(),
      },
      { new: true },
    )
      .populate("patientID", "name email profilePic phone dob age gender")
      .populate("doctorID", "name profilePic specialization fees");

    if (!appointment) {
      return res.notFound("Appointment not found");
    }

    return res.ok({ appointment }, "Appointment marked as follow-up successfully");
  } catch (err) {
    console.error("Failed to mark as follow-up", err);
    res.serverError("Failed to mark as follow-up", [err?.message]);
  }
};
