const express = require('express');
const { doctorListValidator, updateDocProfileValidator } = require('../middlewares/validationMiddleware');
const validate = require('../middlewares/validate');
const { getMatchedDoctorsList, getDoctorProfile, updateDocProfile, getDoctorByID } = require('../middlewares/doctorMiddleware');
const { protect, requiredRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getDoctorByID)
router.get('/doc-list', doctorListValidator, validate, getMatchedDoctorsList);

// Protected Routes
router.use(protect, requiredRole('doctor'));

router.get('/me', getDoctorProfile);
router.post('/onboarding/update', updateDocProfileValidator, validate, updateDocProfile);


module.exports = router;