const express = require('express');
const { requiredRole, protect } = require('../middlewares/authMiddleware');
const { getPatientProfile, updatePatientProfile } = require('../middlewares/patientMiddleware');
const { updatePatientProfileValidator } = require('../middlewares/validationMiddleware');
const router = express.Router();


// Protected Routes
router.use(protect, requiredRole('patient'));

router.get('/me', getPatientProfile);
router.post('/onboarding/update', updatePatientProfileValidator, validate, updatePatientProfile);


module.exports = router;