const Doctor = require("../models/Doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Patient = require("../models/Patient");
const passport = require("./../passport");

const generateJwtToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
  });
};

const createAndSendToken = (user, res, type) => {
  const token = generateJwtToken(user._id, type);

  const hours = Number(process.env.JWT_COOKIE_EXPIRE_IN);
  if (isNaN(hours)) {
    throw new Error("JWT_COOKIE_EXPIRE_IN must be a number (hours)");
  }

  const cookieOption = {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + hours * 60 * 60 * 1000),
  };

  if (process.env.NODE_ENV === "PRODUCTION") {
    cookieOption.secure = true;
    cookieOption.sameSite = "none";
  }

  res.cookie("jwt", token, cookieOption);

  return token;
};

exports.doctorRegistration = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    const docExistance = await Doctor.findOne({ email: normalizedEmail });
    if (docExistance) return res.badRequest("Doctor already Registered");

    const hashedPass = await bcrypt.hash(password, 10);
    const doc = await Doctor.create({
      name,
      email: normalizedEmail,
      password: hashedPass,
    });

    const token = createAndSendToken(doc, res, "doctor");

    return res.created(
      (data = {
        user: {
          id: doc._id,
          name: doc.name,
          email: doc.email,
          type: "doctor",
          isVerified: false,
        },
        token,
      }),
      (message = "Doctor Registered Successfully"),
    );
  } catch (err) {
    res.serverError("Registration Failed", [err.message]);
  }
};

exports.doctorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.badRequest("Bad Request", ["email or password is missing"]);

    const normalizedEmail = String(email).trim().toLowerCase();
    const doc = await Doctor.findOne({ email: normalizedEmail })
      .select("_id name email password isVerified")
      .lean();

    if (!doc || !doc.password) return res.unauthorized("Invalid credential");

    const match = await bcrypt.compare(password, doc.password);
    if (!match) return res.unauthorized("Invalid credential");

    const token = createAndSendToken(doc, res, "doctor");

    res.created(
      (data = {
        user: {
          id: doc._id,
          name: doc.name,
          email: doc.email,
          type: "doctor",
          isVerified: doc.isVerified,
        },
        token,
      }),
      (message = "Doctor Login Successfull"),
    );
  } catch (err) {
    res.unauthorized();
  }
};

exports.patientRegistration = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.badRequest("All fields are required");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const PatientExistance = await Patient.findOne({ email: normalizedEmail });
    if (PatientExistance) return res.badRequest("Patient already Registered");

    const hashedPass = await bcrypt.hash(password, 10);
    const patient = await Patient.create({
      name,
      email: normalizedEmail,
      password: hashedPass,
    });

    const token = createAndSendToken(patient, res, "patient");

    res.created(
      (data = {
        user: {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          type: "patient",
          isVerified: false,
        },
        token,
      }),
      (message = "Patient Registered Successfully"),
    );
  } catch (err) {
    res.serverError("Registration Failed", [err.message]);
  }
};

exports.patientLogin = async (req, res, next) => {
  try {
    const startTime = Date.now();
    const { email, password } = req.body;

    if (!email || !password) return res.badRequest("Bad Request", ["email or password is missing"]);

    const normalizedEmail = String(email).trim().toLowerCase();

    const dbStart = Date.now();
    const patient = await Patient.findOne({ email: normalizedEmail })
      .select("_id name email password isVerified profilePic phone")
      .lean();
    console.log(`[PATIENT LOGIN] DB Query: ${Date.now() - dbStart}ms`);

    if (!patient || !patient.password) return res.unauthorized("Invalid credential");

    // DEBUG: Check password hash format (should start with $2b$10$ and be 60 chars)
    console.log(`[DEBUG] Hash prefix: ${patient.password?.substring(0, 7)} | Length: ${patient.password?.length}`);

    const bcryptStart = Date.now();
    const match = await bcrypt.compare(password, patient.password);
    console.log(`[PATIENT LOGIN] Bcrypt Compare: ${Date.now() - bcryptStart}ms`);

    if (!match) return res.unauthorized("Invalid credential");

    const token = createAndSendToken(patient, res, "patient");

    console.log(`[PATIENT LOGIN] Total: ${Date.now() - startTime}ms`);

    res.created(
      (data = {
        user: {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          type: "patient",
          isVerified: patient.isVerified,
        },
        token,
      }),
      (message = "Patient Login Successfull"),
    );
  } catch (err) {
    console.error("patientLogin error:", err);
    res.unauthorized();
  }
};

exports.googleAuth = (req, res, next) => {
  const userType = req.query.type;
  const intent = req.query.intent || "signup";

  // Encode both userType and intent in the state parameter
  const state = `${userType}:${intent}`;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
    prompt: "select_account",
  })(req, res, next);
};

exports.googleCallbackErrorHandler = (req, res, next) => {
  passport.authenticate("google", {
    session: false,
  })(req, res, (err) => {
    if (err && err.message === "USER_NOT_FOUND") {
      // Decode state parameter which is in format "userType:intent"
      const stateData = (req.query.state || "patient:signup").split(":");
      const userType = stateData[0] || "patient";
      // Redirect to signup page for the user type
      return res.redirect(`${process.env.CLIENT_URL}/signup/${userType}`);
    }
    if (err) {
      return res.redirect(
        `${process.env.CLIENT_URL}/error?message=${encodeURIComponent(err.message)}`,
      );
    }
    // No error, proceed to callback
    next();
  });
};

exports.googleCallback = (req, res) => {
  try {
    const { user, type, isNewUser } = req.user;
    const token = generateJwtToken(user._id, type);

    const redirectURL = `${
      process.env.CLIENT_URL
    }/success?token=${token}&type=${type}&isNewUser=${isNewUser}&user=${encodeURIComponent(
      JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        isVerified: user.isVerified,
      }),
    )}`;

    res.redirect(redirectURL);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/error?message=${encodeURIComponent(err.message)}`);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token, currUser;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) return res.unauthorized("Missing Token");

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.auth = decoded;

    if (decoded.type === "doctor") {
      currUser = await Doctor.findById(decoded.id)
        .select("-password")
        .lean();
    } else if (decoded.type === "patient") {
      currUser = await Patient.findById(decoded.id)
        .select("-password")
        .lean();
    }

    if (!currUser) return res.unauthorized("User not found");

    req.user = currUser;
    res.locals.user = currUser;

    next();
  } catch (err) {
    return res.unauthorized("Invalid or Expiered Token");
  }
};

exports.requiredRole = (role) => (req, res, next) => {
  if (!req.auth || req.auth.type !== role) {
    return res.forbidden("Insufficient role Permission");
  }

  next();
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // ⬅️ immediately expire
    sameSite: "lax",
  });

  if (process.env.NODE_ENV === "production") {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
