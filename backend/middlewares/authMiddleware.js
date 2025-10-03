const Doctor = require("../models/Doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const passport = require("./../passport");

const generateJwtToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
  });
};

const createAndSendToken = (user, res, type) => {
  const token = generateJwtToken(user._id, type);

  const cookieOption = {
    expires: new Date(
      Date.now() +
        5.5 * 60 * 60 * 1000 +
        process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "PRODUCTION") {
    cookieOption.secure = true;
  }

  res.cookie("jwt", token, cookieOption);

  return token;
};

exports.doctorRegistration = async (req, res, next) => {
  try {
    const docExistance = await Doctor.findOne({ email: req.body.email });
    if (docExistance) return res.badRequest("Doctor already Registered");

    const hashedPass = await bcrypt.hash(req.body.password, 20);
    const doc = await Doctor.create({
      ...req.data,
      password: hashedPass,
      isVerified: true,
    });

    createAndSendToken(doc, res, "Doctor");

    return res.created(
      (data = {
        token,
        doctorID: doc._id,
        type: "Doctor",
      }),
      (message = "Doctor Registered Successfully")
    );
  } catch (err) {
    res.serverError("Registration Failed", [err.message]);
  }
};

exports.doctorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.badRequest("Bad Request", ["email or password is missing"]);

    const doc = await Doctor.findOne({ email });
    if (!doc) return res.unauthorized("Invalid credential");

    const match = await bcrypt.compare(password, doc.password);
    if (!match) return res.unauthorized("Invalid credential");

    createAndSendToken(doc, res, "Doctor");

    res.created(
      (data = {
        token,
        doctorID: doc._id,
        type: "Doctor",
      }),
      (message = "Doctor Login Successfull")
    );
  } catch (err) {
    res.unauthorized();
  }
};

exports.patientRegistration = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const PatientExistance = await Doctor.findOne({ email });
    if (PatientExistance) return res.badRequest("Patient already Registered");

    const hashedPass = await bcrypt.hash(password, 20);
    const patient = await Patient.create({
      ...req.data,
      password: hashedPass,
      isVerified: true,
    });

    createAndSendToken(patient, res, "Patient");

    res.created(
      (data = {
        token,
        patientID: patient._id,
        type: "Patient",
      }),
      (message = "Patient Registered Successfully")
    );
  } catch (err) {
    res.serverError("Registration Failed", [err.message]);
  }
};

exports.patientLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.badRequest("Bad Request", ["email or password is missing"]);

    const patient = await Patient.findOne({ email });
    if (!patient) return res.unauthorized("Invalid credential");

    const match = await bcrypt.compare(password, patient.password);
    if (!match) return res.unauthorized("Invalid credential");

    createAndSendToken(doc, res, "Patient");

    res.created(
      (data = {
        token,
        patientID: patient._id,
        type: "Patient",
      }),
      (message = "Patient Login Successfull")
    );
  } catch (err) {
    res.unauthorized();
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
