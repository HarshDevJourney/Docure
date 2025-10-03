const express = require('express');
const { registerValidator, loginValidator } = require('../middlewares/validationMiddleware');
const validate = require('../middlewares/validate');
const { doctorLogin, patientLogin, patientRegistration, googleAuth, googleCallback } = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/doctor/register', registerValidator, validate, doctorRegistration);
router.post('/doctor/login', loginValidator, validate, doctorLogin);

router.post('/patient/register', registerValidator, validate, patientRegistration);
router.post("/patient/login", loginValidator, validate, patientLogin);


router.get('/google', googleAuth);

router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: '/auth/failure', session: false 
}), googleCallback)

router.get('/failure', (req, res) => res.badRequest('Google Authentication Failed'));


module.exports = router;