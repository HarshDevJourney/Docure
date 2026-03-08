const express = require('express');
const { registerValidator, loginValidator } = require('../middlewares/validationMiddleware');
const validate = require('../middlewares/validate');
const passport = require('../passport');
const {
    doctorRegistration,
    doctorLogin,
    patientLogin,
    patientRegistration,
    googleAuth,
    googleCallback,
    googleCallbackErrorHandler,
} = require("../middlewares/authMiddleware");


const router = express.Router();

router.post('/doctor/register', registerValidator, validate, doctorRegistration);
router.post('/doctor/login', loginValidator, validate, doctorLogin);

router.post('/patient/register', registerValidator, validate, patientRegistration);
router.post("/patient/login", loginValidator, validate, patientLogin);

// handling google auth routes
router.get('/google', googleAuth);

router.get('/google/callback', googleCallbackErrorHandler, googleCallback);

router.get('/failure', (req, res) => res.badRequest('Google Authentication Failed'));


module.exports = router;