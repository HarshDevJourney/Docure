const express = require('express');
const { paymentVerifyValidator } = require('../middlewares/validationMiddleware');
const { createOrder, verifyPayment } = require('../middlewares/paymentMiddlewares');
const { protect, requiredRole } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');

const router = express.Router();


router.post('/create-order', protect, requiredRole('patient'), validate, createOrder);
router.post('/verify-payment', protect, requiredRole('patient'), paymentVerifyValidator, validate, verifyPayment);


module.exports = router