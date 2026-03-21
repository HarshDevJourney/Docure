const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.getDoctorByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = Doctor.findById(id).select("-password -googleId");
    if (!doc) res.badRequest("Doctor doesnt Exist");

    res.ok(doc, "Doctor Profile Fetched Successful");
  } catch (err) {
    console.error(err.message);
    res.error(err.message, "Doctor Matches Fetch Failed");
  }
};

exports.getMatchedDoctorsList = async (req, res, next) => {
  try {
    const {
      search,
      specilization,
      city,
      category,
      minFees,
      maxFees,
      sortBy = "createdBy",
      sortOrder = "desc",
      page = 1,
      limit = 100,
    } = req.query;

    const filter = { isVerified: true };

    if (specilization) filter.specilization = { $regex: `^${specilization}`, $options: "i" };
    if (city) filter["hospitalInfo.city"] = { $regex: city, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };

    if (minFees || maxFees) {
      filter.fees = {};
      if (minFees) filter.fees.$gte = minFees;
      if (maxFees) filter.fees.$lte = maxFees;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { "hospitalInfo.name": { $regex: search, $options: "i" } },
        { specilization: { $regex: search, $options: "i" } },
      ];
    }

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const skip = (Number(page) - 1) * limit;

    const [totalCount, doctors] = await Promise.all([
      Doctor.countDocuments(filter),
      Doctor.find(filter).select("-password -googleId").sort(sort).skip(skip).limit(limit),
    ]);

    res.ok(doctors, "Doctor Matches Fetch Successful", {
      totalCount,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error(err.message);
    res.error(err.message, "Doctor Matches Fetch Failed");
  }
};

exports.getDoctorProfile = async (req, res, next) => {
  try {
    const doc = await Doctor.findById(req.user._id).select("-password -googleId");
    res.ok(doc, "Doctor Profile Fetched Successful");
  } catch (err) {
    res.serverError("Doctor Profile Fetch Failed");
  }
};

exports.updateDocProfile = async (req, res, next) => {
  try {
    const updated = { ...req.body };
    delete updated.password;
    updated.isVerified = true;

    const updatedDoc = await Doctor.findByIdAndUpdate(req.user._id, updated, { new: true }).select(
      "-password -googleId",
    );

    res.ok(updatedDoc, "Doctor Profile Updated Successfully");
  } catch (err) {
    res.serverError("Doctor Profile Update Failed", [err.message]);
  }
};


exports.getDoctorDashboard = async (req, res) => {
  try {
    const doctorID = req.auth.id;
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Week boundaries (Monday – Sunday)
    const weekStart = new Date(now);
    const dow = now.getDay();
    weekStart.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const [todayAppts, weekAppts, allAppts, recentCompleted] = await Promise.all([
      Appointment.find({
        doctorID,
        slotStart: { $gte: todayStart, $lte: todayEnd },
        status: { $ne: "Cancelled" },
      })
        .populate("patientID", "name profilePic")
        .sort({ slotStart: 1 }),

      Appointment.find({
        doctorID,
        slotStart: { $gte: weekStart, $lte: weekEnd },
      }).select("status paymentDetails slotStart"),

      Appointment.find({ doctorID }).select(
        "patientID status pescription paymentDetails isFollowUp slotStart",
      ),

      Appointment.find({ doctorID, status: "Completed" })
        .populate("patientID", "name profilePic")
        .sort({ slotStart: -1 })
        .limit(20),
    ]);

    // Today
    const todayTotal = todayAppts.length;
    const todayDone = todayAppts.filter((a) => a.status === "Completed").length;

    // Week
    const weekCompleted = weekAppts.filter((a) => a.status === "Completed").length;
    const weekCancelled = weekAppts.filter((a) => a.status === "Cancelled").length;
    const weekRevenue = weekAppts
      .filter((a) => a.status === "Completed" && a.paymentDetails?.paymentStatus === "Paid")
      .reduce((s, a) => s + (a.paymentDetails?.totalFees || 0), 0);

    // All-time
    const totalPatients = new Set(allAppts.map((a) => a.patientID.toString())).size;
    const totalRevenue = allAppts
      .filter((a) => a.status === "Completed" && a.paymentDetails?.paymentStatus === "Paid")
      .reduce((s, a) => s + (a.paymentDetails?.doctorFees || 0), 0);
    const totalCompleted = allAppts.filter((a) => a.status === "Completed").length;
    const totalCancelled = allAppts.filter((a) => a.status === "Cancelled").length;

    // Pending actions
    const prescriptionsPending = allAppts.filter(
      (a) => a.status === "Completed" && !a.pescription,
    ).length;
    const unpaidConsultations = allAppts.filter(
      (a) => a.status !== "Cancelled" && a.paymentDetails?.paymentStatus === "Pending",
    ).length;
    const followUpsThisWeek = allAppts.filter(
      (a) => a.isFollowUp && a.slotStart >= weekStart && a.slotStart <= weekEnd,
    ).length;

    // Today's schedule
    const todaySchedule = todayAppts.map((a) => ({
      _id: a._id,
      time: a.slotStart.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      patient: a.patientID?.name || "Unknown",
      profilePic: a.patientID?.profilePic || null,
      type: a.consultationType,
      status: a.status,
    }));

    // Weekly day-by-day breakdown (Mon–Sun)
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekDaily = dayNames.map((day, i) => {
      const dayStart = new Date(weekStart);
      dayStart.setDate(weekStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayAppts = weekAppts.filter((a) => {
        const s = new Date(a.slotStart || a.createdAt);
        return s >= dayStart && s <= dayEnd;
      });

      return {
        day,
        total: dayAppts.length,
        completed: dayAppts.filter((a) => a.status === "Completed").length,
        cancelled: dayAppts.filter((a) => a.status === "Cancelled").length,
        revenue: dayAppts
          .filter((a) => a.status === "Completed" && a.paymentDetails?.paymentStatus === "Paid")
          .reduce((s, a) => s + (a.paymentDetails?.totalFees || 0), 0),
      };
    });

    const weekTotal = weekAppts.length;

    // Recent patients (deduplicated)
    const seen = new Set();
    const recentPatients = [];
    for (const a of recentCompleted) {
      const pid = a.patientID?._id?.toString();
      if (!pid || seen.has(pid)) continue;
      seen.add(pid);
      recentPatients.push({
        _id: pid,
        name: a.patientID?.name || "Unknown",
        profilePic: a.patientID?.profilePic || null,
        reason: a.symptoms || "Consultation",
        lastVisit: a.slotStart,
      });
      if (recentPatients.length >= 5) break;
    }

    res.ok(
      {
        stats: {
          todayTotal,
          todayDone,
          weekTotal,
          weekCompleted,
          weekCancelled,
          weekRevenue,
          pendingPayments: unpaidConsultations,
          totalPatients,
          totalRevenue,
          totalCompleted,
          totalCancelled,
        },
        weekDaily,
        todaySchedule,
        recentPatients,
        pendingActions: {
          prescriptionsPending,
          unpaidConsultations,
          followUpsThisWeek,
        },
      },
      "Doctor Dashboard Fetched Successfully",
    );
  } catch (err) {
    console.error("Doctor Dashboard Fetch Failed", err);
    res.serverError("Doctor Dashboard Fetch Failed", [err?.message]);
  }
};
