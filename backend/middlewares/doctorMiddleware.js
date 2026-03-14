const Doctor = require("../models/Doctor");

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
