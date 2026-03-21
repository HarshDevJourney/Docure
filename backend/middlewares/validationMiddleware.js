const { body, query } = require("express-validator");

exports.registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("email").notEmpty().withMessage("Email is required"),
  // .isEmail()
  // .withMessage("Email is not valid"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
];

exports.loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),

  body("password").notEmpty().withMessage("Password is required"),
];

exports.doctorListValidator = [
  query("search").optional().isString(),
  query("specilization").optional().isString(),
  query("city").optional().isString(),
  query("category").optional().isString(),
  query("minFees").optional().isInt({ min: 0 }),
  query("maxFees").optional().isInt({ min: 0 }),
  query("sortBy").optional().isIn(["fees", "name", "experience", "createdAt"]),
  query("sortOrder").optional().isIn(["asc", "desc"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

exports.updateDocProfileValidator = [
  body("name").optional().notEmpty(),
  body("email").optional().notEmpty(),
  body("specialization").optional().notEmpty(),
  body("qualification").optional().notEmpty(),
  body("category").optional().notEmpty(),
  body("experience").optional().isInt({ min: 0 }),
  body("about").optional().isString(),
  body("fees").optional().isInt({ min: 0 }),
  body("hospitalInfo").optional().isObject(),
  body("availabilityRange.startDate").optional().isISO8601(),
  body("availabilityRange.endDate").optional().isISO8601(),
  body("availabilityRange.excludedWeekdays").optional().isArray(),
  body("dailyTimeRange").optional().isArray({ min: 1 }),
  body("dailyTimeRange.*.start").optional().isString(),
  body("dailyTimeRange.*.end").optional().isString(),
  body("slotDurationMinutes").optional().isInt({ min: 5, max: 180 }),
  body("paymentDetails").optional().isObject(),
  body("paymentDetails.panNumber").optional().isString(),
  body("paymentDetails.bank").optional().isObject(),
  body("paymentDetails.bank.accountHolderName").optional().isString(),
  body("paymentDetails.bank.bankName").optional().isString(),
  body("paymentDetails.bank.accountNumber").optional().isString(),
  body("paymentDetails.bank.ifscCode").optional().isString(),
  body("paymentDetails.bank.upiId").optional().isString(),
  body("paymentDetails")
    .optional()
    .custom((value) => {
      if (!value) return true;

      const panNumber = value.panNumber;
      const bank = value.bank || {};

      if (!panNumber || !String(panNumber).trim()) {
        throw new Error("PAN number is required in payment details");
      }
      if (!bank.accountHolderName || !String(bank.accountHolderName).trim()) {
        throw new Error("Account holder name is required in payment details");
      }
      if (!bank.bankName || !String(bank.bankName).trim()) {
        throw new Error("Bank name is required in payment details");
      }
      if (!bank.accountNumber || !String(bank.accountNumber).trim()) {
        throw new Error("Account number is required in payment details");
      }
      if (!bank.ifscCode || !String(bank.ifscCode).trim()) {
        throw new Error("IFSC code is required in payment details");
      }

      return true;
    }),
];

exports.updatePatientProfileValidator = [
  body("name").optional().notEmpty(),
  body("email").optional().notEmpty(),
  body("phone").optional().isString(),
  body("dob").optional().isISO8601(),
  body("gender").optional().isIn(["male", "female", "other"]),
  body("bloodGrp").optional().isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),

  body("emergencyContact").optional().isObject(),
  body("emergencyContact.name").optional().isString().notEmpty(),
  body("emergencyContact.phone").optional().isString().notEmpty(),
  body("emergencyContact.relation").optional().isString().notEmpty(),

  body("medicalHistory").optional().isObject(),
  body("medicalHistory.allergies").optional().isString().notEmpty(),
  body("medicalHistory.currentMedications").optional().isString().notEmpty(),
  body("medicalHistory.chronicConditions").optional().isString().notEmpty(),
];

exports.appointmentStatusValidator = [
  query("status").optional().isArray().withMessage("Status can be an Array"),
  query("status.*").optional().isString().withMessage("Each Status must be string"),
];

exports.bookAppointmentValidator = [
  body("doctorID").isMongoId().withMessage("Valid doctor ID is required"),

  body("date").isISO8601().withMessage("Valid appointment date is required"),

  body("slotStart").isString().notEmpty().withMessage("Valid start time is required"),

  body("slotEnd").isString().notEmpty().withMessage("Valid end time is required"),

  body("consultationType").isIn(["video", "audio"]).withMessage("Valid consultation type required"),

  body("symptoms").optional().isString().withMessage("Symptoms must be a string"),

  body("paymentDetails.doctorFees").isNumeric().withMessage("Doctor fees is required"),

  body("paymentDetails.platformFees").isNumeric().withMessage("Platform fees is required"),

  body("paymentDetails.totalFees").isNumeric().withMessage("Total amount is required"),
];

exports.paymentVerifyValidator = [
  body("appointmentID").isMongoId().withMessage("valid appointment id is required"),

  body("razorpay_orderID").isString().withMessage("order ID is required"),

  body("razorpay_paymentID").isString().notEmpty().withMessage("Payment ID is required"),

  body("razorpay_signature").isString().notEmpty().withMessage("razorpay signature is required"),
];

exports.rescheduleValidator = [];

exports.updateStatusValidator = [];
