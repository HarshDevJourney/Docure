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
    expires: new Date(
      Date.now() + hours * 60 * 60 * 1000 
    ),
  };

  if(process.env.NODE_ENV === "PRODUCTION") {
    cookieOption.secure = true;
    cookieOption.sameSite = "none";
  }

  res.cookie("jwt", token, cookieOption);

  return token;
};

exports.doctorRegistration = async (req, res, next) => {
  try {
    const docExistance = await Doctor.findOne({ email: req.body.email });
    if (docExistance) return res.badRequest("Doctor already Registered");

    const { email, name, password } = req.body;
    
    const hashedPass = await bcrypt.hash(password, 10);
    const doc = await Doctor.create({
      name,
      email,
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
          isVerified : false
        },
        token,
      }),
      (message = "Doctor Registered Successfully")
    );
  } catch (err) {
    res.serverError("Registration Failed", [err.message]);
  }
};

exports.doctorLogin = async (req, res, next) => {
  console.time('doctorLogin');
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.badRequest("Bad Request", ["email or password is missing"]);

    const doc = await Doctor.findOne({ email });
    if (!doc) return res.unauthorized("Invalid credential");

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
          isVerified : doc.isVerified
        },
        token,
      }),
      (message = "Doctor Login Successfull")
    );
  } catch (err) {
    res.unauthorized();
  } finally {
    console.timeEnd('doctorLogin');
  }
};

exports.patientRegistration = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.badRequest("All fields are required");
    }

    const PatientExistance = await Patient.findOne({ email });
    if (PatientExistance) return res.badRequest("Patient already Registered");

    const hashedPass = await bcrypt.hash(password, 10);
    const patient = await Patient.create({
      name,
      email,
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
          isVerified : false
        },
        token,
      }),
      (message = "Patient Registered Successfully")
    );
  } catch (err) {
    res.serverError("Registration Failed", [err.message]);
  }
};

exports.patientLogin = async (req, res, next) => {
  console.time('patientLogin');
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.badRequest("Bad Request", ["email or password is missing"]);

    const patient = await Patient.findOne({ email });
    if (!patient) return res.unauthorized("Invalid credential");

    const match = await bcrypt.compare(password, patient.password);
    if (!match) return res.unauthorized("Invalid credential");

    const token = createAndSendToken(patient, res, "patient");

    res.created(
      (data = {
        user: {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          type: "patient",
          isVerified : patient.isVerified
        },
        token,
      }),
      (message = "Patient Login Successfull")
    );
  } catch (err) {
    res.unauthorized();
  } finally {
    console.timeEnd('patientLogin');
  }
};

exports.googleAuth = (req, res, next) => {
  const userType = req.query.type;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: userType,
    prompt: "select_account",
  })(req, res, next);
};

exports.googleCallback = (req, res) => {
  try {
    const { user, type } = req.user;
    const token = generateJwtToken(user._id, type);

    const redirectURL = `${
      process.env.CLIENT_URL
    }/auth/success?token=${token}&type=${type}&user=${encodeURIComponent(
      JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      })
    )}`;

    res.redirect(redirectURL);
  } catch (err) {
    res.redirect(
      `${process.env.CLIENT_URL}/auth/error?message=${encodeURIComponent(
        err.message
      )}`
    );
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token, currUser;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) return res.unauthorized("Missing Token");

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.auth = decoded;

    if (decoded.type === "doctor") {
      currUser = await Doctor.findById(decoded.id);
    } else if (decoded.type === "patient") {
      currUser = await Patient.findById(decoded.id);
    }

    req.user = currUser;
    res.locals.user = currUser;

    next();
  } catch (err) {
    return res.unauthorized("Invalid or Expiered Token");
  }
};

exports.requiredRole = role => (req, res, next) => {
  if(!req.auth || req.auth.type !== role){
    return res.forbidden("Insufficient role Permission")
  }

  next();
}

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

